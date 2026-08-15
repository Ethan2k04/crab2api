import { mount } from '@vue/test-utils'
import { describe, expect, it, vi } from 'vitest'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'
import { createRouter, createMemoryHistory } from 'vue-router'
import { defineComponent, h } from 'vue'
import type { SubscriptionPlan } from '@/types/payment'
import { ADMIN_ROOT, CONSOLE_ROOT } from '@/router/paths'
import SubscriptionPlanCard from '@/components/payment/SubscriptionPlanCard.vue'

// The multiplier is meant to be hidden from customers. An admin is the only
// viewer who could ever see it, so every case here signs in as one — what is
// under test is the *page*, not the role.
vi.mock('@/stores/auth', () => ({
  useAuthStore: () => ({ isAdmin: true, user: { role: 'admin' } })
}))

const i18n = createI18n({
  legacy: false,
  locale: 'en',
  fallbackWarn: false,
  missingWarn: false,
  messages: {
    en: {
      payment: {
        days: 'days',
        planCard: { quota: 'Quota', rate: 'Rate', totalQuota: 'Allowance', unlimited: 'Unlimited' },
        subscribeNow: 'Subscribe now'
      }
    }
  }
})

const plan: SubscriptionPlan = {
  id: 1,
  group_id: 10,
  group_platform: 'anthropic',
  name: 'Day Pass',
  price: 6.99,
  amount: 699,
  features: [],
  rate_multiplier: 3,
  monthly_limit_usd: 10,
  validity_days: 1,
  validity_unit: 'day',
  is_active: true
} as SubscriptionPlan

async function mountCardAt(path: string) {
  const Host = defineComponent({
    render: () => h(SubscriptionPlanCard, { plan })
  })
  const router = createRouter({
    history: createMemoryHistory(),
    routes: [{ path: '/:pathMatch(.*)*', component: Host }]
  })
  await router.push(path)
  await router.isReady()

  const wrapper = mount(Host, { global: { plugins: [i18n, createPinia(), router] } })
  await wrapper.vm.$nextTick()
  return wrapper
}

describe('rate multiplier visibility', () => {
  it('hides the multiplier on a customer-facing console page, even for an admin', async () => {
    const text = (await mountCardAt(`${CONSOLE_ROOT}/purchase`)).text()

    expect(text).not.toContain('×3')
    expect(text).not.toContain('payment.planCard.rate')
    // The allowance is what a customer is actually buying — still shown.
    expect(text).toContain('$10')
  })

  it('shows the multiplier on an admin console page', async () => {
    const text = (await mountCardAt(`${ADMIN_ROOT}/orders`)).text()

    expect(text).toContain('×3')
  })

  it('hides the multiplier off-console (public pages, payment returns)', async () => {
    expect((await mountCardAt('/model-plaza')).text()).not.toContain('×3')
  })
})
