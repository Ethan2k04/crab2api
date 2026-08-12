<template>
  <section id="pricing" class="border-b border-gray-200 bg-white dark:border-dark-800 dark:bg-dark-900/40">
    <div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <header class="max-w-2xl">
        <p class="mono-label">03 / PRICING</p>
        <h2 class="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
          {{ t('landing.pricing.title') }}
        </h2>
        <p class="mt-3 text-base text-gray-600 dark:text-dark-300">
          {{ t('landing.pricing.subtitle') }}
        </p>
      </header>

      <!-- Loading -->
      <div v-if="loading" class="mt-12 grid gap-6 md:grid-cols-3">
        <div
          v-for="n in 3"
          :key="n"
          class="h-80 animate-pulse rounded-2xl border border-gray-200 bg-gray-100 dark:border-dark-700 dark:bg-dark-800"
        ></div>
      </div>

      <template v-else>
        <!-- Comparison against Anthropic's own consumer plans. Our 30-day tier
             is the only like-for-like: theirs are all monthly subscriptions. -->
        <div
          v-if="comparison"
          class="mt-8 overflow-hidden rounded-2xl border border-gray-200 dark:border-dark-700"
        >
          <div class="flex flex-wrap items-stretch divide-x divide-gray-200 dark:divide-dark-700">
            <div
              v-for="plan in comparison.official"
              :key="plan.key"
              class="min-w-[9rem] flex-1 px-5 py-4"
            >
              <p class="font-mono text-[11px] uppercase tracking-wider text-gray-500 dark:text-dark-400">
                {{ t(`landing.pricing.compare.plans.${plan.key}`) }}
              </p>
              <p class="mt-1.5 text-xl font-semibold text-gray-700 dark:text-dark-200">
                ${{ plan.priceUSD }}<span class="text-xs font-normal text-gray-500 dark:text-dark-400">{{ t('landing.pricing.compare.perMonth') }}</span>
              </p>
              <p class="mt-0.5 text-xs text-gray-500 dark:text-dark-400">
                {{ t('landing.pricing.compare.approx', { cny: plan.priceCNY }) }}
              </p>
            </div>

            <div class="min-w-[11rem] flex-1 bg-primary-50 px-5 py-4 dark:bg-primary-900/20">
              <p class="font-mono text-[11px] uppercase tracking-wider text-primary-700 dark:text-primary-300">
                {{ t('landing.pricing.compare.ours') }}
              </p>
              <p class="mt-1.5 text-xl font-semibold text-primary-700 dark:text-primary-300">
                {{ comparison.oursDisplay }}<span class="text-xs font-normal">{{ t('landing.pricing.compare.perMonth') }}</span>
              </p>
              <p class="mt-0.5 text-xs font-medium text-primary-600 dark:text-primary-400">
                {{ t('landing.pricing.compare.cheaperThanPro', { percent: comparison.cheaperThanProPercent }) }}
              </p>
            </div>
          </div>
        </div>

        <p
          v-if="comparison || usingFallback"
          class="mt-3 max-w-4xl text-xs leading-relaxed text-gray-500 dark:text-dark-400"
        >
          <template v-if="comparison">
            {{ t('landing.pricing.compare.note', { rate: USD_TO_CNY_DISPLAY_RATE, date: OFFICIAL_PLAN_PRICING_CHECKED_ON }) }}
          </template>
          <template v-if="usingFallback">
            {{ t('landing.pricing.fallbackNotice') }}
          </template>
        </p>

        <!-- Empty -->
        <p
          v-if="cards.length === 0"
          class="mt-10 rounded-2xl border border-dashed border-gray-300 px-6 py-12 text-center text-sm text-gray-500 dark:border-dark-600 dark:text-dark-400"
        >
          {{ t('landing.pricing.empty') }}
        </p>

        <!-- Plan cards -->
        <div v-else class="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <article
            v-for="card in cards"
            :key="card.key"
            class="relative flex flex-col rounded-2xl border bg-white p-6 transition-shadow hover:shadow-card-hover dark:bg-dark-900"
            :class="
              card.featured
                ? 'border-primary-500 shadow-card'
                : 'border-gray-200 dark:border-dark-700'
            "
          >
            <span
              v-if="card.featured"
              class="absolute -top-3 left-6 rounded-md bg-primary-500 px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-white"
            >
              {{ t('landing.pricing.mostPopular') }}
            </span>

            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">{{ card.name }}</h3>
            <p class="mt-1.5 min-h-[2.5rem] text-sm text-gray-600 dark:text-dark-400">
              {{ card.description }}
            </p>

            <div class="mt-5 flex items-baseline gap-1.5">
              <span class="text-4xl font-bold tracking-tight text-gray-900 dark:text-white">
                {{ card.priceDisplay }}
              </span>
              <span class="text-sm text-gray-500 dark:text-dark-400">/ {{ card.periodLabel }}</span>
            </div>
            <p
              v-if="card.originalPriceDisplay"
              class="mt-1 text-xs text-gray-400 line-through dark:text-dark-500"
            >
              {{ card.originalPriceDisplay }}
            </p>

            <ul class="mt-6 flex-1 space-y-2.5">
              <li
                v-for="(feature, idx) in card.features"
                :key="idx"
                class="flex items-start gap-2 text-sm text-gray-700 dark:text-dark-200"
              >
                <Icon name="check" size="xs" class="mt-1 shrink-0 text-primary-500" />
                <span>{{ feature }}</span>
              </li>
            </ul>

            <router-link
              :to="card.href"
              class="mt-7 inline-flex h-10 items-center justify-center rounded-xl text-sm font-medium transition-colors"
              :class="
                card.featured
                  ? 'bg-primary-500 text-white hover:bg-primary-600'
                  : 'border border-gray-300 text-gray-700 hover:border-gray-400 hover:bg-gray-50 dark:border-dark-600 dark:text-dark-200 dark:hover:bg-dark-800'
              "
            >
              {{ t('landing.pricing.choosePlan') }}
            </router-link>
          </article>
        </div>

        <!-- The "spend it or lose it" rule belongs next to the price, not buried in the FAQ. -->
        <p v-if="cards.length > 0" class="mt-8 max-w-3xl text-xs leading-relaxed text-gray-500 dark:text-dark-400">
          {{ t('landing.pricing.forfeitNotice') }}
        </p>
      </template>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Icon from '@/components/icons/Icon.vue'
import { paymentAPI, type PublicSubscriptionPlan } from '@/api/payment'
import { currencySymbol, formatPaymentAmount } from '@/components/payment/currency'
import {
  FALLBACK_PLANS,
  OFFICIAL_PLANS,
  OFFICIAL_PLAN_PRICING_CHECKED_ON,
  USD_TO_CNY_DISPLAY_RATE
} from '@/config/brand'

interface PlanCard {
  key: string
  name: string
  description: string
  priceDisplay: string
  originalPriceDisplay: string
  periodLabel: string
  features: string[]
  featured: boolean
  href: string
  /** Term length in days — drives the like-for-like official comparison. */
  periodDays: number
  /** Numeric price in CNY, for arithmetic the display string can't do. */
  priceCNY: number
}

const { t, locale } = useI18n()

/** Console purchase page, opened straight onto the subscription tab. */
const PURCHASE_PATH = '/dashboard/purchase?tab=subscription'

const livePlans = ref<PublicSubscriptionPlan[]>([])
const loading = ref(true)
/** True when the backend gave us nothing usable and we render brand defaults. */
const usingFallback = ref(false)

/**
 * Period wording. The backend stores a unit that may be singular or plural
 * ('day'/'days', 'month'/'months'); billing always resolves it to
 * `validity_days`, so the label is derived from the day count.
 *
 * A one-day term is worded as 24 hours because that is literally how it is
 * measured — the term runs from the moment of purchase, not to midnight.
 */
function periodLabel(days: number): string {
  return days === 1 ? t('landing.pricing.per24h') : t('landing.pricing.perPeriodDays', { days })
}

const liveCards = computed<PlanCard[]>(() =>
  livePlans.value.map((plan, index) => ({
    key: `live-${plan.id}`,
    name: plan.name,
    description: plan.description,
    priceDisplay: formatPaymentAmount(plan.price, plan.currency, locale.value),
    originalPriceDisplay:
      typeof plan.original_price === 'number' && plan.original_price > plan.price
        ? formatPaymentAmount(plan.original_price, plan.currency, locale.value)
        : '',
    periodLabel: periodLabel(plan.validity_days),
    features: String(plan.features || '')
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean),
    // Highlight the middle card when there are three or more plans.
    featured: livePlans.value.length >= 3 ? index === 1 : index === 0,
    // The purchase page opens on the balance tab by default; ?tab=subscription
    // is the param it already understands. Deep-linking a single plan would
    // need its group id, which the public endpoint deliberately withholds.
    href: PURCHASE_PATH,
    periodDays: plan.validity_days,
    priceCNY: plan.currency === 'CNY' ? plan.price : 0
  }))
)

const fallbackCards = computed<PlanCard[]>(() =>
  FALLBACK_PLANS.map((plan) => ({
    key: `fallback-${plan.key}`,
    name: t(`landing.pricing.plans.${plan.key}.name`),
    description: t(`landing.pricing.plans.${plan.key}.desc`),
    // Always CNY: these tiers are charged in CNY, so quoting a converted USD
    // figure to English visitors would misstate what they actually pay.
    priceDisplay: `${currencySymbol('CNY')}${plan.priceCNY}`,
    originalPriceDisplay: '',
    periodLabel: periodLabel(plan.periodDays),
    features: [1, 2, 3, 4].map((i) => t(`landing.pricing.plans.${plan.key}.features.f${i}`)),
    featured: plan.featured === true,
    href: PURCHASE_PATH,
    periodDays: plan.periodDays,
    priceCNY: plan.priceCNY
  }))
)

const cards = computed<PlanCard[]>(() => (usingFallback.value ? fallbackCards.value : liveCards.value))

/**
 * Anthropic's plans are all 30-day subscriptions, so the only honest comparison
 * is against our 30-day tier. Matching on the term rather than the plan name
 * keeps this working if the plan is renamed in admin.
 *
 * Returns null — hiding the whole strip — when there is no 30-day CNY plan to
 * compare against, rather than quoting a number we cannot substantiate.
 */
const comparison = computed(() => {
  // Only ever compare against a tier that is actually on the page. Reaching for
  // a fallback price while live plans are showing would quote something the
  // visitor cannot buy.
  const monthly = cards.value.find((card) => card.periodDays === 30 && card.priceCNY > 0)
  if (!monthly) return null

  const official = OFFICIAL_PLANS.map((plan) => ({
    key: plan.key,
    priceUSD: plan.priceUSD,
    priceCNY: Math.round(plan.priceUSD * USD_TO_CNY_DISPLAY_RATE)
  }))

  const pro = official.find((plan) => plan.key === 'pro')
  if (!pro) return null

  return {
    official,
    oursDisplay: `${currencySymbol('CNY')}${monthly.priceCNY}`,
    cheaperThanProPercent: Math.round((1 - monthly.priceCNY / pro.priceCNY) * 100)
  }
})

onMounted(async () => {
  try {
    const { data } = await paymentAPI.getPublicPlans()
    const plans = Array.isArray(data) ? data : []
    if (plans.length > 0) {
      livePlans.value = plans
      usingFallback.value = false
    } else {
      // Payment disabled or nothing on sale — show the brand's indicative tiers
      // rather than an empty pricing section.
      usingFallback.value = true
    }
  } catch {
    // Older backend without the public endpoint, or a transient failure.
    usingFallback.value = true
  } finally {
    loading.value = false
  }
})
</script>
