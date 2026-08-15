-- Crab2API 提额:日卡 $5 -> $10,周卡 $20 -> $30,月卡 $60 不变
--
-- 为什么新开文件而不是改 221/222:applyMigrationsFS 对每个迁移文件做 SHA256
-- 校验,已应用的迁移改一个字节就会让服务启动时报 checksum mismatch。
--
-- 额度写在 groups.monthly_limit_usd —— 见 221 号迁移的说明:30 天窗口比
-- 1/7/30 天的订阅期都长,窗口永远不会在订阅期内重置,等价于「一次性总额度,
-- 到期作废」。日卡千万不要改用 daily_limit_usd,否则跨午夜会多发一次额度。
--
-- 价格保持 6.99 / 29.99 / 69.99 不变 —— 这次只提额,毛利率随之下降:
-- 按 1 USD ≈ 7.2 CNY 粗算,日卡从约 1.4x 降到 0.10x……也就是 ¥6.99 卖 $10
-- 的上游用量已经是亏本价。这是有意的获客定价,改价请另开迁移。
--
-- 幂等:每条 UPDATE 都带「当前值仍是旧值」的 WHERE,重复执行匹配 0 行。
-- 同时这也意味着运营方在后台手工调过额度的分组不会被覆盖。

-- ---------------------------------------------------------------------------
-- 1. 分组额度
-- ---------------------------------------------------------------------------

UPDATE groups
SET monthly_limit_usd = 10,
    updated_at = NOW()
WHERE name = 'crab-day'
  AND deleted_at IS NULL
  AND monthly_limit_usd = 5;

UPDATE groups
SET monthly_limit_usd = 30,
    updated_at = NOW()
WHERE name = 'crab-week'
  AND deleted_at IS NULL
  AND monthly_limit_usd = 20;

-- ---------------------------------------------------------------------------
-- 2. 分组描述里写死的金额
-- ---------------------------------------------------------------------------

UPDATE groups
SET description = replace(description, '$5 额度', '$10 额度'),
    updated_at = NOW()
WHERE name = 'crab-day'
  AND deleted_at IS NULL
  AND description LIKE '%$5 额度%';

UPDATE groups
SET description = replace(description, '$20 额度', '$30 额度'),
    updated_at = NOW()
WHERE name = 'crab-week'
  AND deleted_at IS NULL
  AND description LIKE '%$20 额度%';

-- ---------------------------------------------------------------------------
-- 3. 套餐特性文案(223 号迁移后是 `中文 || English` 双语,两半都要改)
-- ---------------------------------------------------------------------------
-- 用 replace 而不是整段重写:只动带金额的那一行,运营方后来改过的其它行
-- (有效期、模型范围等)原样保留。

UPDATE subscription_plans p
SET features = replace(replace(features, '$5 额度', '$10 额度'), '$5 allowance', '$10 allowance'),
    updated_at = NOW()
FROM groups g
WHERE p.group_id = g.id
  AND g.name = 'crab-day'
  AND g.deleted_at IS NULL
  AND (p.features LIKE '%$5 额度%' OR p.features LIKE '%$5 allowance%');

UPDATE subscription_plans p
SET features = replace(replace(features, '$20 额度', '$30 额度'), '$20 allowance', '$30 allowance'),
    updated_at = NOW()
FROM groups g
WHERE p.group_id = g.id
  AND g.name = 'crab-week'
  AND g.deleted_at IS NULL
  AND (p.features LIKE '%$20 额度%' OR p.features LIKE '%$20 allowance%');
