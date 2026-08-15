/**
 * Alpha-only plan suspension.
 *
 * During the alpha we sell the day and week passes only. The month pass stays
 * in the database, stays on sale (`for_sale = true`) and keeps its price, so it
 * still renders on the pricing page and in the console — its purchase button is
 * just greyed out. Nothing about the plan, the group or the billing path is
 * removed, because all of it comes back for the public release.
 *
 * Plans are matched on **term length**, not name or id:
 *   - names are operator-authored and bilingual (`月卡 || Month Pass`), so
 *     matching them breaks the moment someone edits the copy;
 *   - ids and group ids differ between the dev, staging and production
 *     databases, so a hardcoded id would suspend the wrong plan somewhere.
 * The term is the one property that means the same thing everywhere, and
 * `planTermDays` resolves it exactly the way billing does.
 *
 * TO RESTORE THE MONTH PASS: empty `SUSPENDED_PLAN_TERM_DAYS` (or delete this
 * file and its imports). There is nothing else to undo on the frontend. The
 * backend carries a matching guard — see `alphaSuspendedPlanTermDays` in
 * `backend/internal/service/payment_order.go`; both must be cleared.
 */
import { planTermDays } from '@/components/payment/validity'

/**
 * Term lengths, in days, that cannot be purchased right now.
 * `[30]` is the month pass. An empty array disables the gate entirely.
 */
export const SUSPENDED_PLAN_TERM_DAYS: readonly number[] = [30]

/** True when a plan of this term length is suspended for the alpha. */
export function isSuspendedTerm(termDays: number): boolean {
  return termDays > 0 && SUSPENDED_PLAN_TERM_DAYS.includes(termDays)
}

/**
 * True when this plan cannot be purchased right now.
 *
 * Accepts anything carrying the two validity fields, so it works for both the
 * console's `SubscriptionPlan` and the public endpoint's leaner
 * `PublicSubscriptionPlan`.
 */
export function isPlanSuspended(
  plan: { validity_days: number; validity_unit: string } | null | undefined
): boolean {
  if (!plan) return false
  return isSuspendedTerm(planTermDays(plan))
}
