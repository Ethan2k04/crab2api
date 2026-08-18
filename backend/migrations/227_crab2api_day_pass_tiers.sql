-- 日卡拆分为三档:轻量 ¥5.99/$10、适中 ¥9.99/$50、满血 ¥15.99/$100
--
-- 原来唯一的日卡(crab-day 分组/套餐)就地改造成"适中"档:价格 ¥9.99 不变
-- (226 号迁移已经调过),额度从 $30 提到 $50,名称/文案改成"适中"版本。
-- 另外新增"轻量"与"满血"两档,分组名分别是 crab-day-light / crab-day-full,
-- 结构照抄 221 号迁移(monthly_limit_usd 装总额度,1 天的窗口不会中途重置)。
--
-- 每 5 小时的调用次数上限(users.request_limit_5h,见 228 号迁移)对所有档位
-- 都一样,不写进这里的套餐文案 —— 前端渲染卡片时统一追加这一行,见
-- SubscriptionPlanCard.vue / LandingPricing.vue。
--
-- 幂等:两个新分组都走 WHERE NOT EXISTS;"适中"档的改造 UPDATE 只在字段仍
-- 是 226 号迁移留下的原值时才生效,运营方手工改过的话会被跳过,不会覆盖。

-- ---------------------------------------------------------------------------
-- 1. "适中"档:就地改造原来的 crab-day
-- ---------------------------------------------------------------------------

UPDATE groups
SET description = '日卡-适中 —— 24 小时内 $50 额度,到期作废',
    monthly_limit_usd = 50,
    updated_at = NOW()
WHERE name = 'crab-day'
  AND deleted_at IS NULL
  AND monthly_limit_usd = 30;

UPDATE subscription_plans p
SET name = '日卡-适中 || Day Pass-Medium',
    description = '一天的常规使用量,最均衡的选择。 || A day of everyday use — the balanced pick.',
    features = E'$50 额度(按官方计价扣减) || $50 allowance, billed at upstream rates\n有效期 24 小时,从下单时刻起算 || Valid 24 hours from purchase\n全部纯血 Claude 模型 || Every pure-blood Claude model\n用完可立即再买一张 || Buy another the moment it runs out',
    product_name = 'Crab2API 日卡-适中',
    updated_at = NOW()
FROM groups g
WHERE p.group_id = g.id
  AND g.name = 'crab-day'
  AND g.deleted_at IS NULL
  AND p.name = '日卡 || Day Pass';

-- ---------------------------------------------------------------------------
-- 2. "轻量"档:新分组 + 新套餐,sort_order 排在"适中"(10)之前
-- ---------------------------------------------------------------------------

INSERT INTO groups (
    name, description, rate_multiplier, is_exclusive, status,
    platform, subscription_type, monthly_limit_usd, default_validity_days,
    supported_model_scopes, sort_order, created_at, updated_at
)
SELECT
    'crab-day-light', '日卡-轻量 —— 24 小时内 $10 额度,到期作废', 1.0, FALSE, 'active',
    'anthropic', 'subscription', 10, 1,
    '["claude"]'::jsonb, 5, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM groups WHERE name = 'crab-day-light' AND deleted_at IS NULL
);

INSERT INTO subscription_plans (
    group_id, name, description, price, currency,
    validity_days, validity_unit, features, product_name,
    for_sale, sort_order, created_at, updated_at
)
SELECT
    g.id, '日卡-轻量 || Day Pass-Light', '轻量的日常使用,先试试水。 || Light everyday use — dip a toe in.', 5.99, 'CNY',
    1, 'day',
    E'$10 额度(按官方计价扣减) || $10 allowance, billed at upstream rates\n有效期 24 小时,从下单时刻起算 || Valid 24 hours from purchase\n全部纯血 Claude 模型 || Every pure-blood Claude model\n用完可立即再买一张 || Buy another the moment it runs out',
    'Crab2API 日卡-轻量',
    TRUE, 5, NOW(), NOW()
FROM groups g
WHERE g.name = 'crab-day-light' AND g.deleted_at IS NULL
  AND NOT EXISTS (
      SELECT 1 FROM subscription_plans p WHERE p.group_id = g.id
  );

-- ---------------------------------------------------------------------------
-- 3. "满血"档:新分组 + 新套餐,sort_order 排在"适中"(10)之后
-- ---------------------------------------------------------------------------

INSERT INTO groups (
    name, description, rate_multiplier, is_exclusive, status,
    platform, subscription_type, monthly_limit_usd, default_validity_days,
    supported_model_scopes, sort_order, created_at, updated_at
)
SELECT
    'crab-day-full', '日卡-满血 —— 24 小时内 $100 额度,到期作废', 1.0, FALSE, 'active',
    'anthropic', 'subscription', 100, 1,
    '["claude"]'::jsonb, 15, NOW(), NOW()
WHERE NOT EXISTS (
    SELECT 1 FROM groups WHERE name = 'crab-day-full' AND deleted_at IS NULL
);

INSERT INTO subscription_plans (
    group_id, name, description, price, currency,
    validity_days, validity_unit, features, product_name,
    for_sale, sort_order, created_at, updated_at
)
SELECT
    g.id, '日卡-满血 || Day Pass-Full', '高强度 Agent / 大批量任务的满血版。 || Full power for heavy agent workloads.', 15.99, 'CNY',
    1, 'day',
    E'$100 额度(按官方计价扣减) || $100 allowance, billed at upstream rates\n有效期 24 小时,从下单时刻起算 || Valid 24 hours from purchase\n全部纯血 Claude 模型 || Every pure-blood Claude model\n用完可立即再买一张 || Buy another the moment it runs out',
    'Crab2API 日卡-满血',
    TRUE, 15, NOW(), NOW()
FROM groups g
WHERE g.name = 'crab-day-full' AND g.deleted_at IS NULL
  AND NOT EXISTS (
      SELECT 1 FROM subscription_plans p WHERE p.group_id = g.id
  );
