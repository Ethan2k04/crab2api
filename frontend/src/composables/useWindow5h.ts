import { computed, ref, type ComputedRef, type Ref } from 'vue'
import { usageAPI } from '@/api'
import type { Window5hStatus } from '@/api/usage'

/**
 * The caller's rolling 5-hour request window.
 *
 * Why request *counts* and not dollars: the point of showing this is to stop a
 * runaway client from draining the shared upstream 5h allowance. A count is
 * something the user can act on ("I've made 27 of 30 calls") and, unlike a USD
 * figure, it leaks nothing about our cost structure or pool state.
 */
export interface Window5h {
  /** Raw payload, null until the first successful fetch. */
  status: Ref<Window5hStatus | null>
  loading: Ref<boolean>
  /** True when there is a real cap to display. */
  enabled: ComputedRef<boolean>
  /** Window usage as a percentage of the cap, clamped to 0-100. */
  usedPct: ComputedRef<number>
  /** Usage has crossed the admin-configured alert threshold. */
  alerting: ComputedRef<boolean>
  /** The window is full — further requests get a 429 until it resets. */
  exhausted: ComputedRef<boolean>
  refresh: () => Promise<void>
}

export function useWindow5h(): Window5h {
  const status = ref<Window5hStatus | null>(null)
  const loading = ref(false)

  // degraded means the counter was unreachable, so `used` is a placeholder 0.
  // Showing "0 / 30" then would tell the user the exact opposite of the truth,
  // so the whole widget stays hidden until the counter is readable again.
  const enabled = computed(() => {
    const s = status.value
    return !!s && s.limit > 0 && !s.degraded
  })

  const usedPct = computed(() => {
    const s = status.value
    if (!enabled.value || !s) return 0
    return Math.min(100, Math.round((s.used / s.limit) * 100))
  })

  const alerting = computed(() => {
    const s = status.value
    if (!enabled.value || !s) return false
    return s.used >= Math.ceil((s.limit * s.alert_pct) / 100)
  })

  const exhausted = computed(() => {
    const s = status.value
    return enabled.value && !!s && s.used >= s.limit
  })

  const refresh = async () => {
    loading.value = true
    try {
      status.value = await usageAPI.getWindow5h()
    } catch {
      // A failed poll must not blank out a reading the user is already looking
      // at, and it must not raise a toast either — this is an ambient widget,
      // not something they asked for. Keep the last value and try again later.
    } finally {
      loading.value = false
    }
  }

  return { status, loading, enabled, usedPct, alerting, exhausted, refresh }
}
