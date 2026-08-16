package service

import (
	"context"
	"time"
)

// Window5hState 一个用户当前 5 小时窗口的只读快照。
//
// Open=false 表示当前没有活动窗口（用户已经 5 小时没发过请求，或从未发过）。
// 此时 Used=0、ResetAt 为零值——前端应显示 "0 / limit"，而不是编一个假的重置时间。
type Window5hState struct {
	// Open 当前是否存在活动窗口。
	Open bool
	// Used 当前窗口内已发起的请求数。
	Used int
	// ResetAt 当前窗口的失效时刻（UTC）。Open=false 时为零值。
	ResetAt time.Time
}

// UserWindow5hCache 用户级 5 小时请求数窗口计数器。
//
// 窗口语义（与 Anthropic 官方 5h 限额一致，也是产品上向用户承诺的语义）：
//
//	首次请求 → 开窗并把 TTL 设为 5h → 窗口内所有请求累加 → 5h 到期窗口消失 →
//	期间无请求就一直没有窗口 → 下一次请求重新开窗。
//
// 刻意不用「自然时钟对齐的固定窗口」（如按 5h 取整）：那样用户能在边界前后
// 连打两个满窗，瞬时压力翻倍，正是这条限流要防的事。
//
// Redis 故障时实现方返回 error，调用方一律 fail-open —— 限流不该把整个网关
// 拖下水，与 checkRPM 的处置保持一致。
type UserWindow5hCache interface {
	// IncrementUserWindow5h 原子递增用户当前窗口计数，返回递增后的窗口状态。
	// 计数从 0 变 1 时（即开窗那一次）负责把 TTL 设为 5h；后续递增不得续期，
	// 否则窗口会被持续的请求无限延长，永远不重置。
	//
	// 同时返回 ResetAt 是为了让超限时的 Retry-After 能报「窗口剩余时间」；
	// 分两次往返读会在窗口临界点上拿到自相矛盾的 count/reset 组合。
	IncrementUserWindow5h(ctx context.Context, userID int64) (Window5hState, error)

	// GetUserWindow5h 只读获取窗口状态，不递增、不开窗。供用户界面展示使用。
	GetUserWindow5h(ctx context.Context, userID int64) (Window5hState, error)
}

// Window5hDuration 窗口长度。与 Anthropic 官方 5h 配额对齐。
const Window5hDuration = 5 * time.Hour

// DefaultRequestAlertPct5h 告警阈值缺省值。DB 默认也是 80，
// 这里兜的是历史数据里该列为 0（或超出 1-100）的行。
const DefaultRequestAlertPct5h = 80

// NormalizeRequestAlertPct5h 把告警百分比夹到 1-100，越界回落到默认值。
func NormalizeRequestAlertPct5h(pct int) int {
	if pct <= 0 || pct > 100 {
		return DefaultRequestAlertPct5h
	}
	return pct
}
