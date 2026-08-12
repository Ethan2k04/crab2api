-- Crab2API 调价:日卡 4.99 -> 6.99,周卡 19.99 -> 29.99,月卡 59.99 -> 69.99
--
-- 为什么不直接改 221 而要新开一个文件:
--   applyMigrationsFS 会对每个迁移文件做 SHA256 校验(migrations_runner.go)。
--   221 已经在生产库里留下了 checksum 记录,改动文件内容会让服务启动时直接
--   报 "checksum mismatch" 拒绝启动。已应用的迁移是不可变的。
--   而且 221 的 INSERT 全部带 WHERE NOT EXISTS —— 即使绕过校验,行已存在,
--   INSERT 也不会生效,价格根本不会变。改价必须用 UPDATE。
--
-- 额度(monthly_limit_usd)保持不变:$5 / $20 / $60。这次只调价格,
-- 也就是把毛利率从约 1.0x 提到日卡 1.4x、周卡 1.5x、月卡 1.17x
-- (按 1 USD ≈ 7.2 CNY 粗算)。
--
-- 幂等性:UPDATE ... WHERE price <> 新值。重复执行第二次匹配 0 行,无副作用。
--
-- 注意:这个迁移只在首次应用时跑一次(schema_migrations 记录后即跳过),
-- 所以它不会持续覆盖管理端的手工调价。但首次应用时,它会把管理端已经
-- 手工改过的价格覆盖成这里写死的值 —— 部署前先确认这三个数字是最终价。

UPDATE subscription_plans p
SET price = 6.99,
    updated_at = NOW()
FROM groups g
WHERE p.group_id = g.id
  AND g.name = 'crab-day'
  AND g.deleted_at IS NULL
  AND p.price <> 6.99;

UPDATE subscription_plans p
SET price = 29.99,
    updated_at = NOW()
FROM groups g
WHERE p.group_id = g.id
  AND g.name = 'crab-week'
  AND g.deleted_at IS NULL
  AND p.price <> 29.99;

UPDATE subscription_plans p
SET price = 69.99,
    updated_at = NOW()
FROM groups g
WHERE p.group_id = g.id
  AND g.name = 'crab-month'
  AND g.deleted_at IS NULL
  AND p.price <> 69.99;
