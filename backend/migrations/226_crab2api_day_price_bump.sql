-- Crab2API 日卡调价:¥6.99 -> ¥9.99,额度 $10 -> $30
--
-- 周卡/月卡这次不动 —— 定价模式还没定,继续维持 ¥29.99/$30、¥69.99/$60,
-- 前端把这两档的价格和额度显示成 "??" 是纯展示层的事,不需要改这里的数据。
--
-- 为什么新开文件:applyMigrationsFS 对每个迁移文件做 SHA256 校验,已应用的
-- 迁移改一个字节就会让服务启动时报 checksum mismatch。见 222/224 号迁移。
--
-- 幂等:每条 UPDATE 都带「当前值仍是旧值」的 WHERE,重复执行匹配 0 行;
-- 运营方在后台手工调过价格/额度的分组或套餐不会被覆盖。

-- ---------------------------------------------------------------------------
-- 1. 套餐价格
-- ---------------------------------------------------------------------------

UPDATE subscription_plans p
SET price = 9.99,
    updated_at = NOW()
FROM groups g
WHERE p.group_id = g.id
  AND g.name = 'crab-day'
  AND g.deleted_at IS NULL
  AND p.price = 6.99;

-- ---------------------------------------------------------------------------
-- 2. 分组额度
-- ---------------------------------------------------------------------------

UPDATE groups
SET monthly_limit_usd = 30,
    updated_at = NOW()
WHERE name = 'crab-day'
  AND deleted_at IS NULL
  AND monthly_limit_usd = 10;

-- ---------------------------------------------------------------------------
-- 3. 分组描述与套餐特性文案里写死的金额(223 号迁移后是双语,两半都要改)
-- ---------------------------------------------------------------------------

UPDATE groups
SET description = replace(description, '$10 额度', '$30 额度'),
    updated_at = NOW()
WHERE name = 'crab-day'
  AND deleted_at IS NULL
  AND description LIKE '%$10 额度%';

UPDATE subscription_plans p
SET features = replace(replace(features, '$10 额度', '$30 额度'), '$10 allowance', '$30 allowance'),
    updated_at = NOW()
FROM groups g
WHERE p.group_id = g.id
  AND g.name = 'crab-day'
  AND g.deleted_at IS NULL
  AND (p.features LIKE '%$10 额度%' OR p.features LIKE '%$10 allowance%');
