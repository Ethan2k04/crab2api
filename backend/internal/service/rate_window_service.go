package service

import (
	"context"
	"time"
)

// UserWindow5hStatus 用户 5h 窗口的对外视图。
type UserWindow5hStatus struct {
	// Limit 窗口上限；0 表示不限制，此时前端不应显示进度条。
	Limit int `json:"limit"`
	// Used 当前窗口已用请求数。窗口未开时为 0。
	Used int `json:"used"`
	// AlertPct 告警百分比（1-100）。Used >= Limit × AlertPct% 时前端标红。
	AlertPct int `json:"alert_pct"`
	// WindowOpen 当前是否存在活动窗口。false 时 ResetAt 为 nil——
	// 窗口尚未开始，编一个重置时间只会误导用户。
	WindowOpen bool `json:"window_open"`
	// ResetAt 当前窗口失效时刻（UTC RFC3339）。窗口未开时为 nil。
	ResetAt *time.Time `json:"reset_at,omitempty"`
	// Degraded 计数器不可用（Redis 故障等）。此时 Used 不可信，
	// 前端应隐藏数字而不是显示 0——显示 0 会让用户以为自己没用过。
	Degraded bool `json:"degraded"`
}

// RateWindowService 提供限流窗口的只读查询，供用户界面展示。
//
// 与 BillingCacheService 分开：那边是请求热路径上的「判罚」，
// 这边是面板上的「看表」，两者的可用性要求和失败处置都不一样——
// 热路径 fail-open 放行，这边 fail 就如实标记 Degraded。
type RateWindowService struct {
	userRepo      UserRepository
	window5hCache UserWindow5hCache
}

// NewRateWindowService 创建限流窗口查询服务。
func NewRateWindowService(userRepo UserRepository, window5hCache UserWindow5hCache) *RateWindowService {
	return &RateWindowService{userRepo: userRepo, window5hCache: window5hCache}
}

// GetUserWindow5hStatus 返回指定用户当前的 5h 窗口状态。
func (s *RateWindowService) GetUserWindow5hStatus(ctx context.Context, userID int64) (*UserWindow5hStatus, error) {
	if s == nil || s.userRepo == nil {
		return nil, ErrUserNotFound
	}

	user, err := s.userRepo.GetByID(ctx, userID)
	if err != nil {
		return nil, err
	}

	out := &UserWindow5hStatus{
		Limit:    user.RequestLimit5h,
		AlertPct: NormalizeRequestAlertPct5h(user.RequestAlertPct5h),
	}
	// 不限制时不去读计数器：闸门关着的时候本来也不会有人写它，
	// 白跑一次 Redis 只是给面板加延迟。
	if out.Limit <= 0 || s.window5hCache == nil {
		return out, nil
	}

	state, err := s.window5hCache.GetUserWindow5h(ctx, userID)
	if err != nil {
		out.Degraded = true
		return out, nil
	}
	out.Used = state.Used
	out.WindowOpen = state.Open
	if state.Open {
		resetAt := state.ResetAt
		out.ResetAt = &resetAt
	}
	return out, nil
}
