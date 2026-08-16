package repository

import (
	"context"
	"fmt"
	"time"

	"github.com/Wei-Shaw/sub2api/internal/service"
	"github.com/redis/go-redis/v9"
)

// 用户级 5 小时请求数窗口计数器 Redis 实现。
//
// 设计说明：
//   - key 形式：req5h:u:{uid}（不带时间片——窗口起点就是 key 的创建时刻）。
//   - 开窗即 TTL：INCR 返回 1 说明这是窗口的第一个请求，此时才 EXPIRE 5h。
//     后续请求只 INCR 不续期，否则持续的流量会把窗口无限拖长。
//   - 剩余时间用 PTTL 读，而不是另存一个「窗口起点」字段：TTL 本身就是权威，
//     两处存时间必然会漂移。
//   - 用 Lua 而非 TxPipeline：需要「读 INCR 结果再决定是否 EXPIRE」的条件逻辑，
//     MULTI/EXEC 拿不到中间结果。脚本对单 key 操作，Redis Cluster 下同样安全。
const (
	userWindow5hKeyPrefix = "req5h:u:"
)

// incrWindow5hScript 原子递增 + 首次开窗设 TTL，返回 {count, pttl}。
//
// 返回 pttl 是为了让调用方一次往返就能拿到重置时间；
// 分两次调用会在窗口临界点上读到不一致的 count/ttl 组合。
var incrWindow5hScript = redis.NewScript(`
local count = redis.call('INCR', KEYS[1])
if count == 1 then
  redis.call('PEXPIRE', KEYS[1], ARGV[1])
end
return {count, redis.call('PTTL', KEYS[1])}
`)

type userWindow5hCacheImpl struct {
	rdb *redis.Client
}

// NewUserWindow5hCache 创建用户级 5h 窗口计数器。
func NewUserWindow5hCache(rdb *redis.Client) service.UserWindow5hCache {
	return &userWindow5hCacheImpl{rdb: rdb}
}

func userWindow5hKey(userID int64) string {
	return fmt.Sprintf("%s%d", userWindow5hKeyPrefix, userID)
}

// IncrementUserWindow5h 递增并（必要时）开窗。
func (c *userWindow5hCacheImpl) IncrementUserWindow5h(ctx context.Context, userID int64) (service.Window5hState, error) {
	if c == nil || c.rdb == nil {
		return service.Window5hState{}, fmt.Errorf("user window 5h cache unavailable")
	}
	ttlMillis := int64(service.Window5hDuration / time.Millisecond)
	res, err := incrWindow5hScript.Run(ctx, c.rdb, []string{userWindow5hKey(userID)}, ttlMillis).Int64Slice()
	if err != nil {
		return service.Window5hState{}, fmt.Errorf("user window 5h increment: %w", err)
	}
	if len(res) < 2 {
		return service.Window5hState{}, fmt.Errorf("user window 5h increment: unexpected script result %v", res)
	}

	state := service.Window5hState{Open: true, Used: int(res[0])}
	// PTTL 理论上必然 > 0（脚本刚 INCR 过），防御性处理 -1/-2 以免算出过去的时间。
	if res[1] > 0 {
		state.ResetAt = time.Now().UTC().Add(time.Duration(res[1]) * time.Millisecond)
	} else {
		state.ResetAt = time.Now().UTC().Add(service.Window5hDuration)
	}
	return state, nil
}

// GetUserWindow5h 只读读取窗口状态。
//
// 刻意分两次调用（GET + PTTL）而非脚本：只读路径没有原子性要求，
// 最坏情况是窗口正好在两次调用之间过期，此时 PTTL 返回 -2，
// 下面会把它当作「窗口已关闭」处理，与真实状态一致。
func (c *userWindow5hCacheImpl) GetUserWindow5h(ctx context.Context, userID int64) (service.Window5hState, error) {
	if c == nil || c.rdb == nil {
		return service.Window5hState{}, fmt.Errorf("user window 5h cache unavailable")
	}
	key := userWindow5hKey(userID)

	count, err := c.rdb.Get(ctx, key).Int()
	if err == redis.Nil {
		return service.Window5hState{}, nil
	}
	if err != nil {
		return service.Window5hState{}, fmt.Errorf("user window 5h get: %w", err)
	}

	ttl, err := c.rdb.PTTL(ctx, key).Result()
	if err != nil {
		return service.Window5hState{}, fmt.Errorf("user window 5h pttl: %w", err)
	}
	// -2 = key 已消失，-1 = key 存在但没有 TTL（理论上不会发生，
	// 除非有人手工写过这个 key）。两种都当作「无活动窗口」。
	if ttl <= 0 {
		return service.Window5hState{}, nil
	}

	return service.Window5hState{
		Open:    true,
		Used:    count,
		ResetAt: time.Now().UTC().Add(ttl),
	}, nil
}
