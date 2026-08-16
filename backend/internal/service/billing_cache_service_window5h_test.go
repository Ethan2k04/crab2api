//go:build unit

package service

import (
	"context"
	"errors"
	"sync/atomic"
	"testing"
	"time"

	"github.com/Wei-Shaw/sub2api/internal/config"
	pkgerrors "github.com/Wei-Shaw/sub2api/internal/pkg/errors"
	"github.com/stretchr/testify/require"
)

// userWindow5hCacheStub 按调用顺序返回预设计数，并可注入错误。
type userWindow5hCacheStub struct {
	calls int32

	counts  []int // 依次返回的窗口计数
	resetAt time.Time
	err     error
}

func (s *userWindow5hCacheStub) IncrementUserWindow5h(_ context.Context, _ int64) (Window5hState, error) {
	idx := int(atomic.AddInt32(&s.calls, 1)) - 1
	if s.err != nil {
		return Window5hState{}, s.err
	}
	count := 1
	if idx < len(s.counts) {
		count = s.counts[idx]
	}
	resetAt := s.resetAt
	if resetAt.IsZero() {
		resetAt = time.Now().UTC().Add(Window5hDuration)
	}
	return Window5hState{Open: true, Used: count, ResetAt: resetAt}, nil
}

func (s *userWindow5hCacheStub) GetUserWindow5h(_ context.Context, _ int64) (Window5hState, error) {
	return Window5hState{}, nil
}

func newBillingServiceForWindow5h(t *testing.T, cache UserWindow5hCache) *BillingCacheService {
	t.Helper()
	svc := NewBillingCacheService(nil, nil, nil, nil, nil, nil, &config.Config{}, nil)
	svc.SetUserWindow5hCache(cache)
	t.Cleanup(svc.Stop)
	return svc
}

func TestCheck5hRequests_RejectsOnceWindowCountExceedsLimit(t *testing.T) {
	cache := &userWindow5hCacheStub{counts: []int{1, 2, 3}}
	svc := newBillingServiceForWindow5h(t, cache)
	user := &User{ID: 1, RequestLimit5h: 2}

	require.NoError(t, svc.check5hRequests(context.Background(), user))
	require.NoError(t, svc.check5hRequests(context.Background(), user), "计数等于上限时仍应放行")
	require.ErrorIs(t, svc.check5hRequests(context.Background(), user), ErrUser5hRequestsExceeded)
}

// Retry-After 报「本分钟剩余秒数」会让客户端每分钟空转重试到窗口结束，
// 所以超限错误必须带上窗口的真实重置时间。
func TestCheck5hRequests_AttachesWindowResetMetadata(t *testing.T) {
	resetAt := time.Now().UTC().Add(3 * time.Hour).Truncate(time.Second)
	cache := &userWindow5hCacheStub{counts: []int{5}, resetAt: resetAt}
	svc := newBillingServiceForWindow5h(t, cache)

	err := svc.check5hRequests(context.Background(), &User{ID: 1, RequestLimit5h: 1})
	require.ErrorIs(t, err, ErrUser5hRequestsExceeded)

	appErr := pkgerrors.FromError(err)
	require.NotNil(t, appErr)
	require.Equal(t, resetAt.Format(time.RFC3339), appErr.Metadata["window_resets_at"])
}

// 0 的语义是「不限制」——此时连计数器都不该碰，否则每个不限流的用户
// 都要为一次白跑的 Redis 往返买单。
func TestCheck5hRequests_ZeroLimitSkipsCounterEntirely(t *testing.T) {
	cache := &userWindow5hCacheStub{counts: []int{999}}
	svc := newBillingServiceForWindow5h(t, cache)

	require.NoError(t, svc.check5hRequests(context.Background(), &User{ID: 1, RequestLimit5h: 0}))
	require.EqualValues(t, 0, atomic.LoadInt32(&cache.calls))
}

// Redis 挂了不该把网关一起拖下水——与 checkRPM 的处置保持一致。
func TestCheck5hRequests_FailsOpenWhenCounterErrors(t *testing.T) {
	cache := &userWindow5hCacheStub{err: errors.New("redis down")}
	svc := newBillingServiceForWindow5h(t, cache)

	require.NoError(t, svc.check5hRequests(context.Background(), &User{ID: 1, RequestLimit5h: 1}))
}

// 未注入计数器（所有既有测试构造出的实例都是这种）时必须整条跳过，
// 否则 SetUserWindow5hCache 的可选注入设计就成了空指针陷阱。
func TestCheck5hRequests_NoCacheInjectedIsNoop(t *testing.T) {
	svc := NewBillingCacheService(nil, nil, nil, nil, nil, nil, &config.Config{}, nil)
	t.Cleanup(svc.Stop)

	require.NoError(t, svc.check5hRequests(context.Background(), &User{ID: 1, RequestLimit5h: 1}))
}

func TestNormalizeRequestAlertPct5h(t *testing.T) {
	require.Equal(t, 80, NormalizeRequestAlertPct5h(80))
	require.Equal(t, 100, NormalizeRequestAlertPct5h(100))
	require.Equal(t, 1, NormalizeRequestAlertPct5h(1))
	// 历史行可能留下 0；越界值一律回落默认，而不是把告警关掉或永远告警。
	require.Equal(t, DefaultRequestAlertPct5h, NormalizeRequestAlertPct5h(0))
	require.Equal(t, DefaultRequestAlertPct5h, NormalizeRequestAlertPct5h(-5))
	require.Equal(t, DefaultRequestAlertPct5h, NormalizeRequestAlertPct5h(101))
}
