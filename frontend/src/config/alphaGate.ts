/**
 * Sales gates.
 *
 * Two things are withheld right now: the week and month passes, and balance
 * top-up. Both may come back later, so nothing is deleted — the plans, the
 * groups, the balance ledger and every backend path stay exactly as they are
 * and are simply refused at the door.
 *
 * -- 1. The week and month passes --
 *
 * Only the day pass (now split into light/medium/full quota tiers) is sold.
 * The week and month passes stay in the database and stay on sale
 * (`for_sale = true`), but the frontend filters them out entirely — they
 * never render on the pricing page or in the console, not even as a greyed
 * -out card. Their pricing model isn't decided yet, so there is nothing
 * honest to show. Nothing about the plans, the groups or the billing path is
 * removed, because it may come back.
 *
 * Plans are matched on **term length**, not name or id:
 *   - names are operator-authored and bilingual (`月卡 || Month Pass`), so
 *     matching them breaks the moment someone edits the copy;
 *   - ids and group ids differ between the dev, staging and production
 *     databases, so a hardcoded id would suspend the wrong plan somewhere.
 * The term is the one property that means the same thing everywhere, and
 * `planTermDays` resolves it exactly the way billing does.
 *
 * TO RESTORE THE WEEK/MONTH PASSES: empty `SUSPENDED_PLAN_TERM_DAYS` (or
 * delete this file and its imports). There is nothing else to undo on the
 * frontend. The backend carries a matching guard — see
 * `alphaSuspendedPlanTermDays` in `backend/internal/service/payment_order.go`;
 * both must be cleared.
 */
import { planTermDays } from '@/components/payment/validity'

/**
 * Term lengths, in days, that cannot be purchased right now.
 * `[7, 30]` is the week and month passes. An empty array disables the gate
 * entirely.
 */
export const SUSPENDED_PLAN_TERM_DAYS: readonly number[] = [7, 30]

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

/**
 * Whether pre-paid balance top-up is withheld for the alpha.
 *
 * Deliberately *not* the existing `balance_disabled` admin setting, which is
 * the operator's own permanent switch and hides the top-up tab outright. This
 * is a separate, temporary alpha state: the tab stays where users expect it
 * and explains itself, and flipping this back does not disturb whatever the
 * operator has configured.
 *
 * TO RESTORE TOP-UP: set this to false. The matching backend guard is
 * `alphaBalanceRechargeSuspended` in
 * `backend/internal/service/payment_order.go`; both must be cleared.
 */
export const BALANCE_RECHARGE_SUSPENDED = true
