import { describe, expect, it, vi } from 'vitest'
import { flushPromises, mount } from '@vue/test-utils'
import RedeemView from '../RedeemView.vue'
import type { UserSubscription } from '@/types'

const fetchActiveSubscriptions = vi.hoisted(() => vi.fn().mockResolvedValue(undefined))
const activeSubscriptionsRef = vi.hoisted(() => ({ value: [] as UserSubscription[] }))
const getHistory = vi.hoisted(() => vi.fn().mockResolvedValue([]))
const getPublicSettings = vi.hoisted(() => vi.fn().mockResolvedValue({ contact_info: '' }))

vi.mock('vue-i18n', async () => {
  const actual = await vi.importActual<typeof import('vue-i18n')>('vue-i18n')
  return {
    ...actual,
    useI18n: () => ({
      t: (key: string) => key
    })
  }
})

vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({
    user: { username: 'demo-user', balance: 0 },
    refreshUser: vi.fn()
  })
}))

vi.mock('@/stores/subscriptions', () => ({
  // A getter (not a plain field) so reassigning activeSubscriptionsRef.value between
  // tests is picked up by the component's computed — matches real Pinia reactivity.
  useSubscriptionStore: () => ({
    get activeSubscriptions() {
      return activeSubscriptionsRef.value
    },
    fetchActiveSubscriptions
  })
}))

vi.mock('@/stores/app', () => ({
  useAppStore: () => ({
    showError: vi.fn(),
    showSuccess: vi.fn(),
    showWarning: vi.fn()
  })
}))

vi.mock('@/api', () => ({
  redeemAPI: {
    getHistory,
    redeem: vi.fn()
  },
  authAPI: {
    getPublicSettings
  }
}))

const mountOptions = {
  global: {
    stubs: {
      AppLayout: { template: '<div><slot /></div>' },
      Icon: { template: '<span />' }
    }
  }
}

describe('RedeemView', () => {
  it('shows "no subscription" when the user has none active', async () => {
    activeSubscriptionsRef.value = []
    const wrapper = mount(RedeemView, mountOptions)
    await flushPromises()

    expect(wrapper.text()).toContain('redeem.noSubscription')
    expect(wrapper.text()).not.toContain('redeem.currentBalance')
    expect(wrapper.text()).not.toContain('余额')
  })

  it('shows the active subscription with a usage bar for its configured quota window', async () => {
    activeSubscriptionsRef.value = [
      {
        id: 1,
        user_id: 1,
        group_id: 5,
        status: 'active',
        starts_at: '2026-08-01T00:00:00Z',
        daily_usage_usd: 0,
        weekly_usage_usd: 0,
        monthly_usage_usd: 3.2,
        daily_window_start: null,
        weekly_window_start: null,
        monthly_window_start: '2026-08-01T00:00:00Z',
        created_at: '2026-08-01T00:00:00Z',
        updated_at: '2026-08-01T00:00:00Z',
        expires_at: '2026-08-02T00:00:00Z',
        group: {
          id: 5,
          name: 'crab-day',
          description: null,
          platform: 'anthropic',
          rate_multiplier: 1,
          is_exclusive: false,
          status: 'active',
          subscription_type: 'day',
          daily_limit_usd: null,
          weekly_limit_usd: null,
          monthly_limit_usd: 10,
          allow_image_generation: false,
          allow_batch_image_generation: false,
          image_rate_independent: false,
          image_rate_multiplier: 1
        } as any
      } as UserSubscription
    ]

    const wrapper = mount(RedeemView, mountOptions)
    await flushPromises()

    expect(wrapper.text()).toContain('crab-day')
    expect(wrapper.text()).not.toContain('redeem.noSubscription')
    // Only monthly_limit_usd is configured (10, one-shot term-quota for this
    // 1-day pass) — the bar's width reflects that window's used/limit
    // (3.2 / 10 = 32%), not daily/weekly (both 0, which would render 0%).
    const bar = wrapper.find('.bg-white.rounded-full')
    expect(bar.exists()).toBe(true)
    expect(bar.attributes('style')).toContain('width: 32%')
  })
})
