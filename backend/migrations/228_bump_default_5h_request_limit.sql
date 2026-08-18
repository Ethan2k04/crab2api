-- 用户 5h 请求数默认限额从 30 提到 300。
--
-- 225 号迁移把默认值定成 30,现在改成 300 —— 订阅卡片文案要展示这个数字给
-- 用户看,后台的真实默认值必须跟文案一致,不然就是在骗人。
--
-- 幂等:ALTER COLUMN SET DEFAULT 只影响以后新插入的行,本身天然幂等;
-- 已有用户的 UPDATE 只动仍是旧默认值 30 的行,运营方在后台给个别用户手工
-- 调过这个字段的话不会被覆盖。

ALTER TABLE users ALTER COLUMN request_limit_5h SET DEFAULT 300;

UPDATE users
SET request_limit_5h = 300,
    updated_at = NOW()
WHERE request_limit_5h = 30;
