<template>
  <section id="models" class="border-b border-gray-200 dark:border-dark-800">
    <div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <header class="max-w-2xl">
        <p class="mono-label">02 / MODELS</p>
        <h2 class="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
          {{ t('landing.models.title') }}
        </h2>
        <p class="mt-3 text-base text-gray-600 dark:text-dark-300">
          {{ t('landing.models.subtitle') }}
        </p>
      </header>

      <ul class="mt-10 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <li
          v-for="model in models"
          :key="model.id"
          class="flex items-center gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3.5 transition-colors hover:border-primary-300 dark:border-dark-700 dark:bg-dark-900 dark:hover:border-primary-800"
        >
          <BrandLogo :size="22" class="text-primary-500" />
          <div class="min-w-0 flex-1">
            <p class="truncate text-sm font-medium text-gray-900 dark:text-white">
              {{ model.label }}
            </p>
            <code class="block truncate font-mono text-[11px] text-gray-400 dark:text-dark-400">
              {{ model.id }}
            </code>
          </div>
          <span
            class="shrink-0 rounded-md px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider"
            :class="tierClass(model.tier)"
          >
            {{ t(`landing.models.tier.${model.tier}`) }}
          </span>
        </li>
      </ul>

      <p class="mt-6 max-w-2xl text-xs text-gray-500 dark:text-dark-400">
        {{ t('landing.models.note') }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BrandLogo from '@/components/brand/BrandLogo.vue'
import { ADVERTISED_MODELS, type AdvertisedModel } from '@/config/brand'

const { t } = useI18n()

const models = ADVERTISED_MODELS

function tierClass(tier: AdvertisedModel['tier']): string {
  switch (tier) {
    case 'flagship':
      return 'bg-primary-500 text-white'
    case 'balanced':
      return 'bg-primary-100 text-primary-700 dark:bg-primary-900/40 dark:text-primary-300'
    default:
      return 'bg-gray-100 text-gray-600 dark:bg-dark-800 dark:text-dark-300'
  }
}
</script>
