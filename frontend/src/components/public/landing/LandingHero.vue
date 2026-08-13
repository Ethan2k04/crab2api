<template>
  <section class="relative overflow-hidden border-b border-gray-200 dark:border-dark-800">
    <!-- geek grid backdrop -->
    <div class="pointer-events-none absolute inset-0 bg-grid opacity-70"></div>
    <div
      class="pointer-events-none absolute -right-32 -top-32 h-96 w-96 rounded-full bg-primary-400/15 blur-3xl"
    ></div>

    <div class="relative mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:py-28">
      <div class="grid items-center gap-14 lg:grid-cols-2 lg:gap-16">
        <!-- Left: copy -->
        <div>
          <p class="mono-label">{{ t('landing.hero.eyebrow') }}</p>

          <div class="mt-5 flex items-center gap-3">
            <BrandLogo :size="44" class="text-primary-500" />
            <span class="text-2xl font-semibold tracking-tight text-gray-900 dark:text-white">
              {{ brandName }}
            </span>
          </div>

          <h1
            class="mt-6 text-4xl font-bold leading-[1.1] tracking-tight text-gray-900 md:text-5xl lg:text-6xl dark:text-white"
          >
            {{ t('landing.hero.titleLine1') }}<br />
            <span class="text-primary-500">{{ t('landing.hero.titleLine2') }}</span>
          </h1>

          <p
            class="mt-5 border-l-2 border-primary-500 pl-4 font-mono text-base font-medium text-gray-800 md:text-lg dark:text-gray-100"
          >
            {{ t('landing.hero.slogan') }}
          </p>

          <p class="mt-6 max-w-xl text-base leading-relaxed text-gray-600 dark:text-dark-300">
            {{ t('landing.hero.description') }}
          </p>

          <div class="mt-9 flex flex-wrap items-center gap-3">
            <router-link
              to="/dashboard"
              class="inline-flex h-11 items-center gap-2 rounded-xl bg-primary-500 px-6 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-600"
            >
              {{ t('landing.hero.ctaPrimary') }}
              <Icon name="arrowRight" size="sm" />
            </router-link>
            <router-link
              :to="publicPath('/docs')"
              class="inline-flex h-11 items-center gap-2 rounded-xl border border-gray-300 px-6 text-sm font-medium text-gray-700 transition-colors hover:border-gray-400 hover:bg-white dark:border-dark-600 dark:text-dark-200 dark:hover:border-dark-500 dark:hover:bg-dark-800"
            >
              {{ t('landing.hero.ctaSecondary') }}
            </router-link>
          </div>

          <ul class="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
            <li
              v-for="badge in badges"
              :key="badge"
              class="flex items-center gap-1.5 text-xs text-gray-500 dark:text-dark-400"
            >
              <Icon name="check" size="xs" class="text-primary-500" />
              {{ badge }}
            </li>
          </ul>
        </div>

        <!-- Right: live-looking Claude Code session -->
        <ClaudeCodeTerminal />
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BrandLogo from '@/components/brand/BrandLogo.vue'
import ClaudeCodeTerminal from '@/components/public/landing/ClaudeCodeTerminal.vue'
import Icon from '@/components/icons/Icon.vue'
import { usePublicLocale } from '@/composables/usePublicLocale'
import { useAppStore } from '@/stores'
import { BRAND_NAME } from '@/config/brand'

const { t } = useI18n()
const appStore = useAppStore()
const { publicPath } = usePublicLocale()

const brandName = computed(() => appStore.siteName || BRAND_NAME)

const badges = computed(() => [
  t('landing.hero.badges.oneKey'),
  t('landing.hero.badges.claudeOnly'),
  t('landing.hero.badges.anthropicCompatible')
])
</script>
