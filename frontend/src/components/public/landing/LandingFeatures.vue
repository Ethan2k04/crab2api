<template>
  <section id="features" class="border-b border-gray-200 dark:border-dark-800">
    <div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <header class="max-w-2xl">
        <p class="mono-label">01 / FEATURES</p>
        <h2 class="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
          {{ t('landing.features.title') }}
        </h2>
        <p class="mt-3 text-base text-gray-600 dark:text-dark-300">
          {{ t('landing.features.subtitle') }}
        </p>
      </header>

      <div class="mt-12 grid gap-px overflow-hidden rounded-2xl border border-gray-200 bg-gray-200 md:grid-cols-2 lg:grid-cols-3 dark:border-dark-700 dark:bg-dark-700">
        <article
          v-for="feature in features"
          :key="feature.key"
          class="group bg-white p-6 transition-colors hover:bg-gray-50 dark:bg-dark-900 dark:hover:bg-dark-800"
        >
          <div
            class="flex h-10 w-10 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-500 group-hover:text-white dark:bg-primary-900/30 dark:text-primary-400"
          >
            <Icon :name="feature.icon" size="md" />
          </div>
          <h3 class="mt-4 text-base font-semibold text-gray-900 dark:text-white">
            {{ feature.title }}
          </h3>
          <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-dark-400">
            {{ feature.desc }}
          </p>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Icon from '@/components/icons/Icon.vue'

const { t } = useI18n()

const FEATURE_KEYS = [
  { key: 'authentic', icon: 'shield' },
  { key: 'noSwap', icon: 'lock' },
  { key: 'compatible', icon: 'terminal' },
  { key: 'transparent', icon: 'chartBar' },
  { key: 'sticky', icon: 'link' },
  { key: 'resilient', icon: 'server' }
] as const

const features = computed(() =>
  FEATURE_KEYS.map(({ key, icon }) => ({
    key,
    icon,
    title: t(`landing.features.items.${key}.title`),
    desc: t(`landing.features.items.${key}.desc`)
  }))
)
</script>
