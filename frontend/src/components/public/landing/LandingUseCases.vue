<template>
  <section id="use-cases" class="border-b border-gray-200 dark:border-dark-800">
    <div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <header class="max-w-2xl">
        <p class="mono-label">02 / USE CASES</p>
        <h2 class="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
          {{ t('landing.useCases.title') }}
        </h2>
        <p class="mt-3 text-base text-gray-600 dark:text-dark-300">
          {{ t('landing.useCases.subtitle') }}
        </p>
      </header>

      <div class="mt-12 grid gap-6 md:grid-cols-3">
        <article
          v-for="useCase in useCases"
          :key="useCase.key"
          class="group flex flex-col rounded-2xl border border-gray-200 bg-white p-6 transition-colors hover:border-primary-300 dark:border-dark-700 dark:bg-dark-900 dark:hover:border-primary-800"
        >
          <div
            class="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-50 text-primary-600 transition-colors group-hover:bg-primary-500 group-hover:text-white dark:bg-primary-900/30 dark:text-primary-400"
          >
            <Icon :name="useCase.icon" size="lg" />
          </div>

          <h3 class="mt-4 text-base font-semibold text-gray-900 dark:text-white">
            {{ useCase.title }}
          </h3>
          <p class="mt-2 text-sm leading-relaxed text-gray-600 dark:text-dark-400">
            {{ useCase.desc }}
          </p>

          <!-- Real prompts, phrased the way you'd actually type them. -->
          <ul class="mt-5 flex-1 space-y-2">
            <li
              v-for="(example, idx) in useCase.examples"
              :key="idx"
              class="flex gap-2 rounded-lg bg-gray-50 px-3 py-2.5 font-mono text-[12px] leading-relaxed text-gray-700 dark:bg-dark-800 dark:text-dark-200"
            >
              <span class="shrink-0 text-primary-500">&gt;</span>
              <span class="min-w-0">{{ example }}</span>
            </li>
          </ul>
        </article>
      </div>

      <p class="mt-6 max-w-2xl text-xs text-gray-500 dark:text-dark-400">
        {{ t('landing.useCases.note') }}
      </p>
    </div>
  </section>
</template>

<script setup lang="ts">
/**
 * What people actually do with Claude Code, in place of a model spec sheet.
 * The model list moved to the docs page, where someone comparing ids will
 * actually be looking for it.
 */
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import Icon from '@/components/icons/Icon.vue'

const { t } = useI18n()

/** Example counts differ per case — hence the explicit length, not a fixed 2. */
const USE_CASES = [
  { key: 'data', icon: 'trendingUp', examples: 2 },
  { key: 'build', icon: 'cube', examples: 2 },
  { key: 'research', icon: 'beaker', examples: 2 }
] as const

const useCases = computed(() =>
  USE_CASES.map(({ key, icon, examples }) => ({
    key,
    icon,
    title: t(`landing.useCases.items.${key}.title`),
    desc: t(`landing.useCases.items.${key}.desc`),
    examples: Array.from({ length: examples }, (_, i) =>
      t(`landing.useCases.items.${key}.examples.e${i + 1}`)
    )
  }))
)
</script>
