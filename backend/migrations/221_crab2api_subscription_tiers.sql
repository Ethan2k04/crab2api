-- Crab2API 三档订阅:日卡 / 周卡 / 月卡
--
-- 设计要点(改动前请先读完):
--
-- 1) 每档 = 一个 subscription 类型分组 + 一个挂在该分组上的套餐。
--    subscription 类型是「必须订阅才能拿 API Key」的开关:
--    canUserBindGroup() 对 subscription 分组强制校验有效订阅,
--    而 standard 分组任何人都能直接绑定。
--
-- 2) 额度一律写在 monthly_limit_usd,**不要用 daily_limit_usd**。
--    三个窗口的语义不同(见 subscription_service.go renewedSubscriptionTerm):
--      daily   -> 按日历日对齐,每天 0 点刷新
--      weekly  -> 锚定订阅起点,7×24h 滚动
--      monthly -> 锚定订阅起点,30×24h 滚动
--    日卡如果用 daily_limit_usd,晚上 20:00 下单的用户会在午夜多拿一次额度,
--    24 小时内实际可用 $10 而不是 $5。
--    改用 monthly_limit_usd 后,30 天窗口对 1/7/30 天的订阅都长于订阅本身,
--    窗口永远不会中途重置 —— 等价于「一次性总额度,到期作废」,正是所需语义。
--
-- 3) rate_multiplier 先统一设为 1.0:额度按上游官方计价扣减,
--    也就是「$5 额度 = $5 的官方 API 用量」。要做加价/让利在这里调。
--
-- 4) supported_model_scopes 只留 claude —— 本站只中转纯血 Claude 模型。
--
-- 幂等:全部走 WHERE NOT EXISTS,重复执行不会产生重复行。

-- ---------------------------------------------------------------------------
-- 1. 三个订阅分组
-- ---------------------------------------------------------------------------

INSERT INTO groups (
    name, description, rate_multiplier, is_exclusive, status,
    platform, subscription_type, monthly_limit_usd, default_validity_days,
    supported_model_scopes, sort_order, created_at, updated_at
)
SELECT
    'crab-day', '日卡 —— 24 小时内 $5 额度,到期作废', 1.0, FALSE, 'active',
    'anthropic', 'subscription', 5, 1,
    '["claude"]'::jsonb, 10, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM groups WHERE name = 'crab-day' AND deleted_at IS NULL
);

INSERT INTO groups (
    name, description, rate_multiplier, is_exclusive, status,
    platform, subscription_type, monthly_limit_usd, default_validity_days,
    supported_model_scopes, sort_order, created_at, updated_at
)
SELECT
    'crab-week', '周卡 —— 7 天内 $20 额度,到期作废', 1.0, FALSE, 'active',
    'anthropic', 'subscription', 20, 7,
    '["claude"]'::jsonb, 20, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM groups WHERE name = 'crab-week' AND deleted_at IS NULL
);

INSERT INTO groups (
    name, description, rate_multiplier, is_exclusive, status,
    platform, subscription_type, monthly_limit_usd, default_validity_days,
    supported_model_scopes, sort_order, created_at, updated_at
)
SELECT
    'crab-month', '月卡 —— 30 天内 $60 额度,到期作废', 1.0, FALSE, 'active',
    'anthropic', 'subscription', 60, 30,
    '["claude"]'::jsonb, 30, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM groups WHERE name = 'crab-month' AND deleted_at IS NULL
);

-- ---------------------------------------------------------------------------
-- 2. 三个套餐(features 用换行分隔,前端按 \n 切分成条目)
-- ---------------------------------------------------------------------------

INSERT INTO subscription_plans (
    group_id, name, description, price, currency,
    validity_days, validity_unit, features, product_name,
    for_sale, sort_order, created_at, updated_at
)
SELECT
    g.id, '日卡', '按天试水,或临时赶工时补一针。', 4.99, 'CNY',
    1, 'day',
    E'$5 额度(按官方计价扣减)\n有效期 24 小时,从下单时刻起算\n全部纯血 Claude 模型\n用完可立即再买一张',
    'Crab2API 日卡',
    TRUE, 10, NOW(), NOW()
FROM groups g
WHERE g.name = 'crab-day' AND g.deleted_at IS NULL
  AND NOT EXISTS (
      SELECT 1 FROM subscription_plans p WHERE p.group_id = g.id
  );

INSERT INTO subscription_plans (
    group_id, name, description, price, currency,
    validity_days, validity_unit, features, product_name,
    for_sale, sort_order, created_at, updated_at
)
SELECT
    g.id, '周卡', '一周的日常编码量,最常见的选择。', 19.99, 'CNY',
    7, 'day',
    E'$20 额度(按官方计价扣减)\n有效期 7 天,从下单时刻起算\n全部纯血 Claude 模型\n用完可立即再买一张',
    'Crab2API 周卡',
    TRUE, 20, NOW(), NOW()
FROM groups g
WHERE g.name = 'crab-week' AND g.deleted_at IS NULL
  AND NOT EXISTS (
      SELECT 1 FROM subscription_plans p WHERE p.group_id = g.id
  );

INSERT INTO subscription_plans (
    group_id, name, description, price, currency,
    validity_days, validity_unit, features, product_name,
    for_sale, sort_order, created_at, updated_at
)
SELECT
    g.id, '月卡', '长期跑 Agent / 高强度使用,单位额度最划算。', 59.99, 'CNY',
    30, 'day',
    E'$60 额度(按官方计价扣减)\n有效期 30 天,从下单时刻起算\n全部纯血 Claude 模型\n用完可立即再买一张',
    'Crab2API 月卡',
    TRUE, 30, NOW(), NOW()
FROM groups g
WHERE g.name = 'crab-month' AND g.deleted_at IS NULL
  AND NOT EXISTS (
      SELECT 1 FROM subscription_plans p WHERE p.group_id = g.id
  );

-- ---------------------------------------------------------------------------
-- 3. 移除继承自上游的 default 标准分组
-- ---------------------------------------------------------------------------
-- Crab2API 没有免费档:standard 类型分组不需要任何订阅就能绑定 API Key,
-- 留着它等于开了一道后门。软删除而非物理删除 —— groups 的唯一约束是
-- 「WHERE deleted_at IS NULL」的部分索引,软删除后名字可复用,同时保住
-- 任何仍指向它的历史记录(用量日志、已发放的 Key)的外键完整性。
--
-- 仅在该分组确实没有被任何 API Key 绑定时才删,避免打断正在跑的部署。
UPDATE groups
SET deleted_at = NOW(),
    status = 'disabled',
    updated_at = NOW()
WHERE name = 'default'
  AND deleted_at IS NULL
  AND subscription_type = 'standard'
  AND NOT EXISTS (
      SELECT 1 FROM api_keys k WHERE k.group_id = groups.id AND k.deleted_at IS NULL
  );
