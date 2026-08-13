/**
 * Bilingual rendering for operator-authored subscription plan copy.
 *
 * Plan name / description / features are stored as a single string per field in
 * `subscription_plans`, so they cannot go through i18n the way static page copy
 * does — which is why an English visitor used to see Chinese pricing cards.
 *
 * Rather than add localized columns (and a second set of admin inputs that can
 * drift out of step with the first), a field may carry both languages in one
 * string, separated by `||`:
 *
 *     日卡 || Day Pass
 *     $5 额度(按官方计价扣减) || $5 allowance, billed at upstream rates
 *
 * Chinese first, English second. A field with no separator is shown as-is in
 * every locale — the behaviour before this existed — so plans an operator wrote
 * by hand keep rendering exactly as they did.
 *
 * Splitting per line matters for `features`, which is newline-delimited: each
 * bullet carries its own pair.
 */

/** Separator between the Chinese and English halves of a plan field. */
export const PLAN_TEXT_SEPARATOR = '||'

/**
 * Pick the half of `raw` matching `locale`.
 *
 * Falls back to the other language when the requested half is missing, since a
 * half-filled field should degrade to showing *something* rather than blanking
 * a plan name on the pricing page.
 */
export function pickPlanText(raw: string | null | undefined, locale: string): string {
  const text = String(raw ?? '').trim()
  if (!text.includes(PLAN_TEXT_SEPARATOR)) return text

  const parts = text.split(PLAN_TEXT_SEPARATOR)
  const zh = (parts[0] ?? '').trim()
  const en = (parts[1] ?? '').trim()
  const preferred = locale.toLowerCase().startsWith('zh') ? zh : en

  return preferred || zh || en
}

/**
 * Split a newline-delimited field (i.e. `features`) into localized lines,
 * dropping blanks so a trailing newline doesn't render an empty bullet.
 */
export function pickPlanLines(raw: string | null | undefined, locale: string): string[] {
  return String(raw ?? '')
    .split('\n')
    .map((line) => pickPlanText(line, locale))
    .filter((line) => line.length > 0)
}
