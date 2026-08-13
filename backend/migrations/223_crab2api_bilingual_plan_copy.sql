-- 三档订阅套餐的文案改为中英双语
--
-- 背景:subscription_plans 的 name / description / features 是运营方自己写的
-- 文本,不走前端 i18n,所以站点切到英文后价格卡片仍然是中文。
--
-- 方案:同一字段里用 `||` 分隔两种语言(中文在前,英文在后),前端按当前语言
-- 取对应的一半 —— 见 frontend/src/utils/planText.ts。features 按行存储,
-- 每一行各自带一对。
--
--     日卡 || Day Pass
--     $5 额度(按官方计价扣减) || $5 allowance, billed at upstream rates
--
-- 没有 `||` 的字段在两种语言下原样显示,也就是这条迁移之前的行为 —— 所以
-- 运营方后来手改过的套餐不会被这条迁移覆盖(见下面的 WHERE 条件)。
--
-- 幂等:只更新仍然是 221 号迁移原始中文文案的行。已经双语化,或者被运营方
-- 改过文案的套餐都会被跳过,重复执行不会产生副作用。

UPDATE subscription_plans p
SET name = '日卡 || Day Pass',
    description = '按天试水,或临时赶工时补一针。 || Try the service, or top up mid-crunch.',
    features = E'$5 额度(按官方计价扣减) || $5 allowance, billed at upstream rates\n有效期 24 小时,从下单时刻起算 || Valid 24 hours from purchase\n全部纯血 Claude 模型 || Every pure-blood Claude model\n用完可立即再买一张 || Buy another the moment it runs out',
    updated_at = NOW()
FROM groups g
WHERE p.group_id = g.id
  AND g.name = 'crab-day'
  AND g.deleted_at IS NULL
  AND p.name = '日卡';

UPDATE subscription_plans p
SET name = '周卡 || Week Pass',
    description = '一周的日常编码量,最常见的选择。 || A week of everyday coding — the usual pick.',
    features = E'$20 额度(按官方计价扣减) || $20 allowance, billed at upstream rates\n有效期 7 天,从下单时刻起算 || Valid 7 days from purchase\n全部纯血 Claude 模型 || Every pure-blood Claude model\n用完可立即再买一张 || Buy another the moment it runs out',
    updated_at = NOW()
FROM groups g
WHERE p.group_id = g.id
  AND g.name = 'crab-week'
  AND g.deleted_at IS NULL
  AND p.name = '周卡';

UPDATE subscription_plans p
SET name = '月卡 || Month Pass',
    description = '长期跑 Agent / 高强度使用,单位额度最划算。 || Sustained agent workloads; best value per dollar of allowance.',
    features = E'$60 额度(按官方计价扣减) || $60 allowance, billed at upstream rates\n有效期 30 天,从下单时刻起算 || Valid 30 days from purchase\n全部纯血 Claude 模型 || Every pure-blood Claude model\n用完可立即再买一张 || Buy another the moment it runs out',
    updated_at = NOW()
FROM groups g
WHERE p.group_id = g.id
  AND g.name = 'crab-month'
  AND g.deleted_at IS NULL
  AND p.name = '月卡';
