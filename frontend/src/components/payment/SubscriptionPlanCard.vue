<template>
  <div
    :class="[
      'group relative flex flex-col overflow-hidden rounded-2xl border transition-all',
      // Tall enough that a three-tier row reads as a pricing table rather than
      // three stubs floating above an empty page.
      'min-h-[26rem]',
      'hover:shadow-xl hover:-translate-y-0.5',
      borderClass,
      'bg-white dark:bg-dark-800',
    ]"
  >
    <!-- Colored top accent bar -->
    <div :class="['h-1.5', accentClass]" />

    <div class="flex flex-1 flex-col p-5">
      <!-- Header: name + badge + price -->
      <div class="mb-3 flex items-start justify-between gap-2">
        <div class="min-w-0 flex-1">
          <h3
            :title="planName"
            class="h-12 min-w-0 break-words [overflow-wrap:anywhere] text-base font-bold leading-6 text-gray-900 dark:text-white line-clamp-2"
          >
            {{ planName }}
          </h3>
          <p v-if="planDescription" class="mt-0.5 text-xs leading-relaxed text-gray-500 dark:text-dark-400 line-clamp-2">
            {{ planDescription }}
          </p>
        </div>
        <div class="shrink-0 text-right">
          <div class="flex items-baseline gap-1">
            <span class="text-xs text-gray-400 dark:text-dark-500">{{ planCurrencySymbol }}</span>
            <span :class="['text-2xl font-extrabold tracking-tight', textClass]">{{ plan.price }}</span>
            <span v-if="plan.currency" class="text-xs font-medium text-gray-400 dark:text-dark-500">{{ plan.currency }}</span>
          </div>
          <div class="flex items-center justify-end gap-1">
            <span :class="['inline-flex shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium', badgeLightClass]">
              {{ pLabel }}
            </span>
            <span class="text-[11px] text-gray-400 dark:text-dark-500">/ {{ validitySuffix }}</span>
          </div>
          <div v-if="plan.original_price" class="mt-0.5 flex items-center justify-end gap-1.5">
            <span class="text-xs text-gray-400 line-through dark:text-dark-500">{{ planCurrencySymbol }}{{ plan.original_price }}<template v-if="plan.currency"> {{ plan.currency }}</template></span>
            <span :class="['rounded px-1 py-0.5 text-[10px] font-semibold', discountClass]">{{ discountText }}</span>
          </div>
        </div>
      </div>

      <!-- Group quota info (compact) -->
      <div class="mb-3 grid grid-cols-2 gap-x-3 gap-y-1 rounded-lg bg-gray-50 px-3 py-2 text-xs dark:bg-dark-700/50">
        <!-- Rate multipliers are an operator-side pricing knob. Customers are
             billed in dollars of usage and never need to see the multiplier,
             so both rate rows only render on admin console pages — including
             for an admin, who sees this same card on the purchase page. -->
        <div v-if="canSeeRateMultiplier" class="flex items-center justify-between">
          <span class="text-gray-400 dark:text-dark-500">{{ t('payment.planCard.rate') }}</span>
          <span class="font-medium text-gray-700 dark:text-gray-300">{{ rateDisplay }}</span>
        </div>
        <div v-if="canSeeRateMultiplier && hasPeakRate" class="col-span-2 flex items-center justify-between gap-2">
          <span class="text-gray-400 dark:text-dark-500">{{ t('payment.planCard.peakRate') }}</span>
          <span class="text-right font-medium text-amber-700 dark:text-amber-300">{{ peakRateDisplay }}</span>
        </div>
        <div v-if="plan.daily_limit_usd != null" class="flex items-center justify-between">
          <span class="text-gray-400 dark:text-dark-500">{{ quotaLabel('daily') }}</span>
          <span class="font-medium text-gray-700 dark:text-gray-300">${{ plan.daily_limit_usd }}</span>
        </div>
        <div v-if="plan.weekly_limit_usd != null" class="flex items-center justify-between">
          <span class="text-gray-400 dark:text-dark-500">{{ quotaLabel('weekly') }}</span>
          <span class="font-medium text-gray-700 dark:text-gray-300">${{ plan.weekly_limit_usd }}</span>
        </div>
        <div v-if="plan.monthly_limit_usd != null" class="flex items-center justify-between">
          <span class="text-gray-400 dark:text-dark-500">{{ quotaLabel('monthly') }}</span>
          <span class="font-medium text-gray-700 dark:text-gray-300">${{ plan.monthly_limit_usd }}</span>
        </div>
        <div v-if="plan.daily_limit_usd == null && plan.weekly_limit_usd == null && plan.monthly_limit_usd == null" class="flex items-center justify-between">
          <span class="text-gray-400 dark:text-dark-500">{{ t('payment.planCard.quota') }}</span>
          <span class="font-medium text-gray-700 dark:text-gray-300">{{ t('payment.planCard.unlimited') }}</span>
        </div>
        <div v-if="modelScopeLabels.length > 0" class="col-span-2 flex items-center justify-between">
          <span class="text-gray-400 dark:text-dark-500">{{ t('payment.planCard.models') }}</span>
          <div class="flex flex-wrap justify-end gap-1">
            <span v-for="scope in modelScopeLabels" :key="scope"
              class="rounded bg-gray-200/80 px-1.5 py-0.5 text-[10px] font-medium text-gray-600 dark:bg-dark-600 dark:text-gray-300">
              {{ scope }}
            </span>
          </div>
        </div>
      </div>

      <!-- Features list. Spacing grows with the card so a short feature list
           doesn't leave a block of dead space above the button. -->
      <div v-if="planFeatures.length > 0" class="mb-3 flex flex-1 flex-col justify-evenly gap-1 py-1">
        <div v-for="feature in planFeatures" :key="feature" class="flex items-start gap-1.5">
          <svg :class="['mt-0.5 h-3.5 w-3.5 flex-shrink-0', iconClass]" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2.5">
            <path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5" />
          </svg>
          <span class="text-xs text-gray-600 dark:text-gray-300">{{ feature }}</span>
        </div>
      </div>
      <div v-else class="flex-1" />

      <!-- Subscribe Button. Suspended tiers keep the card (price, allowance and
           features stay readable) but the action is inert — see config/alphaGate.ts -->
      <button
        type="button"
        :disabled="suspended"
        :class="[
          'w-full rounded-xl py-2.5 text-sm font-semibold transition-all',
          suspended
            ? 'cursor-not-allowed bg-gray-200 text-gray-500 dark:bg-dark-700 dark:text-dark-400'
            : ['active:scale-[0.98]', btnClass],
        ]"
        @click="suspended || emit('select', plan)"
      >
        {{ suspended ? t('payment.notYetAvailable') : isRenewal ? t('payment.renewNow') : t('payment.subscribeNow') }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import type { SubscriptionPlan } from '@/types/payment'
import type { UserSubscription } from '@/types'
import { useAppStore } from '@/stores/app'
import { useRateMultiplierVisible } from '@/composables/useRateMultiplierVisible'
import { hasPeakRate as groupHasPeakRate, formatPeakRateWindow, serverTimezoneLabel } from '@/utils/peak-rate'
import { isPlanOneShotQuota, planValiditySuffix, type PlanQuotaPeriod } from './validity'
import { currencySymbol } from '@/components/payment/currency'
import { pickPlanText } from '@/utils/planText'
import { isPlanSuspended } from '@/config/alphaGate'
import {
  platformAccentBarClass,
  platformBadgeLightClass,
  platformBorderClass,
  platformTextClass,
  platformIconClass,
  platformButtonClass,
  platformDiscountClass,
  platformLabel,
} from '@/utils/platformColors'

const props = defineProps<{ plan: SubscriptionPlan; activeSubscriptions?: UserSubscription[] }>()
const emit = defineEmits<{ select: [plan: SubscriptionPlan] }>()
const { t, locale } = useI18n()

// Plan copy is operator-authored and stored per field, so i18n can't reach it.
// planText.ts handles the `zh || en` convention admins use to write both.
const planName = computed(() => pickPlanText(props.plan.name, locale.value))
const planDescription = computed(() => pickPlanText(props.plan.description, locale.value))
const planFeatures = computed(() =>
  (props.plan.features || []).map((feature) => pickPlanText(feature, locale.value)).filter(Boolean)
)

/** Withheld for the alpha: card still renders, purchase action is dead. */
const suspended = computed(() => isPlanSuspended(props.plan))

const platform = computed(() => props.plan.group_platform || '')
const isRenewal = computed(() =>
  props.activeSubscriptions?.some(s => s.group_id === props.plan.group_id && s.status === 'active') ?? false
)

// Derived color classes from central config
const accentClass = computed(() => platformAccentBarClass(platform.value))
const borderClass = computed(() => platformBorderClass(platform.value))
const badgeLightClass = computed(() => platformBadgeLightClass(platform.value))
const textClass = computed(() => platformTextClass(platform.value))
const iconClass = computed(() => platformIconClass(platform.value))
const btnClass = computed(() => platformButtonClass(platform.value))
const discountClass = computed(() => platformDiscountClass(platform.value))
const pLabel = computed(() => platformLabel(platform.value))

const discountText = computed(() => {
  if (!props.plan.original_price || props.plan.original_price <= 0) return ''
  const pct = Math.round((1 - props.plan.price / props.plan.original_price) * 100)
  return pct > 0 ? `-${pct}%` : ''
})

const rateDisplay = computed(() => {
  const rate = props.plan.rate_multiplier ?? 1
  return `×${Number(rate.toPrecision(10))}`
})

const appStore = useAppStore()
const canSeeRateMultiplier = useRateMultiplierVisible()
const planCurrencySymbol = computed(() => currencySymbol(props.plan.currency || 'USD'))

/**
 * A limit whose window is longer than the plan's term never resets inside that
 * term — it is the total allowance, not a recurring one. Calling a day pass's
 * $10 a "monthly limit" implies a renewal the pass will never reach.
 */
function quotaLabel(period: PlanQuotaPeriod): string {
  if (isPlanOneShotQuota(props.plan, period)) return t('payment.planCard.totalQuota')
  return t(`payment.planCard.${period}Limit`)
}

const hasPeakRate = computed(() => groupHasPeakRate(props.plan))

const peakRateDisplay = computed(() => {
  return formatPeakRateWindow(props.plan, serverTimezoneLabel(appStore.cachedPublicSettings?.server_utc_offset))
})

const MODEL_SCOPE_LABELS: Record<string, string> = {
  claude: 'Claude',
  gemini_text: 'Gemini',
  gemini_image: 'Imagen',
}

const modelScopeLabels = computed(() => {
  if (platform.value !== 'antigravity') return []
  const scopes = props.plan.supported_model_scopes
  if (!scopes || scopes.length === 0) return []
  return scopes.map(s => MODEL_SCOPE_LABELS[s] || s)
})

const validitySuffix = computed(() => planValiditySuffix(props.plan, t))
</script>
