<template>
  <section class="relative overflow-hidden">
    <div class="pointer-events-none absolute inset-0 bg-grid opacity-60"></div>
    <div class="relative mx-auto max-w-6xl px-4 py-20 text-center sm:px-6">
      <BrandLogo :size="40" class="mx-auto text-primary-500" />
      <h2 class="mt-6 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
        {{ t('landing.cta.title') }}
      </h2>
      <p class="mx-auto mt-3 max-w-xl text-base text-gray-600 dark:text-dark-300">
        {{ t('landing.cta.description') }}
      </p>
      <div class="mt-8 flex flex-wrap items-center justify-center gap-3">
        <router-link
          to="/dashboard"
          class="inline-flex h-11 items-center gap-2 rounded-xl bg-primary-500 px-6 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-600"
        >
          {{ t('landing.cta.primary') }}
          <Icon name="arrowRight" size="sm" />
        </router-link>
        <router-link
          :to="publicPath('/docs')"
          class="inline-flex h-11 items-center rounded-xl border border-gray-300 px-6 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-white dark:border-dark-600 dark:text-dark-200 dark:hover:border-dark-500 dark:hover:bg-dark-800"
        >
          {{ t('landing.cta.secondary') }}
        </router-link>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import BrandLogo from '@/components/brand/BrandLogo.vue'
import Icon from '@/components/icons/Icon.vue'
import { usePublicLocale } from '@/composables/usePublicLocale'

const { t } = useI18n()
const { publicPath } = usePublicLocale()
</script>
