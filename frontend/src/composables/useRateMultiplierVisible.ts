import { computed, type ComputedRef } from 'vue'
import { useRoute } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { isAdminPath } from '@/router/paths'

/**
 * Whether the group rate multiplier may be painted on the current page.
 *
 * The multiplier is an operator-side pricing knob: an admin sets it, the
 * gateway bills against it, and a customer only ever needs to see the dollars
 * it produced. Gating on `authStore.isAdmin` alone was not enough — an admin
 * browsing their *own* console (API 密钥 / 我的订阅 / 充值订阅 …) is looking at
 * exactly the customer-facing surface, so the multiplier leaked into every
 * screen a customer sees, just only for admins.
 *
 * Visibility is therefore a property of the page, not only of the viewer: it
 * shows under {@link isAdminPath} and nowhere else. Anyone who reaches an admin
 * route has already passed the `requiresAdmin` guard, so the path check
 * subsumes the role check rather than weakening it — the `isAdmin` term is kept
 * only so a stale route match can never expose the value on its own.
 *
 * This is presentation only. Billing still applies whatever multiplier the
 * admin configured.
 */
export function useRateMultiplierVisible(): ComputedRef<boolean> {
  // Several consumers (GroupBadge, SubscriptionPlanCard …) are also mounted in
  // unit tests without a router installed. useRoute() is a plain inject(), so
  // it yields undefined there instead of throwing — treat that as "not admin".
  const route = useRoute() as ReturnType<typeof useRoute> | undefined
  const authStore = useAuthStore()
  return computed(() => authStore.isAdmin && isAdminPath(route?.path ?? ''))
}
