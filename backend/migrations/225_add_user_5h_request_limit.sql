-- 用户级 5 小时请求数窗口限额。
--
-- 动机：订阅额度是「一次性总额度」，它拦不住用户在几十分钟内把上游账号的
-- Anthropic 官方 5h 配额打空——那个配额是全站共享的池子资源。这里给每个用户
-- 加一条按「请求次数」计的 5h 窗口闸门，既能挡住失控的 agent 客户端，
-- 也能直接展示给用户看（次数不像美元额度那样会泄露成本结构）。
--
-- 窗口语义（与 Anthropic 官方一致，实现在 Redis：INCR + 首次 EXPIRE 5h）：
--   首次请求开窗 → 5 小时后窗口失效 → 期间无请求则窗口消失 → 下次请求重新开窗。
--   不是自然时钟对齐的固定窗口，因此不存在「整点前后连打两窗」的放大问题。
--
-- request_limit_5h      0 = 不限制；默认 30 次。
-- request_alert_pct_5h  纯展示用的告警百分比；达到后前端标红提示，不影响放行。

ALTER TABLE users ADD COLUMN IF NOT EXISTS request_limit_5h integer NOT NULL DEFAULT 30;
ALTER TABLE users ADD COLUMN IF NOT EXISTS request_alert_pct_5h integer NOT NULL DEFAULT 80;

COMMENT ON COLUMN users.request_limit_5h IS '每 5 小时窗口内允许的请求数；0 表示不限制；窗口自首次请求起算，5 小时后重新开窗。';
COMMENT ON COLUMN users.request_alert_pct_5h IS '5h 窗口用量告警阈值（百分比 1-100）；仅用于前端标红提示，不影响请求放行。';
