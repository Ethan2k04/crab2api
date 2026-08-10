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

        <!-- Right: gateway trace panel -->
        <div class="relative">
          <div
            class="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-card dark:border-dark-700 dark:bg-dark-900"
          >
            <!-- panel head -->
            <div
              class="flex items-center justify-between border-b border-gray-200 px-4 py-2.5 dark:border-dark-700"
            >
              <span class="font-mono text-[11px] tracking-wider text-gray-400 dark:text-dark-400">
                CRAB2API / {{ t('landing.demo.label') }}
              </span>
              <span class="flex items-center gap-1.5">
                <span class="h-2 w-2 rounded-full bg-primary-500"></span>
                <span class="font-mono text-[11px] text-gray-400 dark:text-dark-400">
                  {{ t('landing.demo.verified') }}
                </span>
              </span>
            </div>

            <!-- request line -->
            <div class="border-b border-gray-200 px-4 py-3 dark:border-dark-700">
              <div class="flex items-center justify-between gap-3">
                <span class="font-mono text-xs text-gray-500 dark:text-dark-400">
                  {{ t('landing.demo.request') }}
                </span>
                <code class="font-mono text-xs text-gray-800 dark:text-gray-100">
                  POST /v1/messages
                </code>
                <span class="font-mono text-xs font-semibold text-primary-600 dark:text-primary-400">
                  200 OK
                </span>
              </div>
            </div>

            <!-- pipeline -->
            <div class="grid grid-cols-3 gap-px bg-gray-200 dark:bg-dark-700">
              <div class="bg-white px-3 py-4 dark:bg-dark-900">
                <p class="mono-label">01 / {{ t('landing.demo.client') }}</p>
                <p class="mt-1.5 text-sm font-medium text-gray-900 dark:text-white">
                  {{ t('landing.demo.yourApp') }}
                </p>
                <p class="mt-0.5 font-mono text-[11px] text-gray-400 dark:text-dark-400">
                  sk-crab_••••
                </p>
              </div>
              <div class="bg-primary-500 px-3 py-4">
                <p class="font-mono text-[11px] uppercase tracking-[0.18em] text-white/70">
                  02 / {{ t('landing.demo.gateway') }}
                </p>
                <p class="mt-1.5 text-sm font-medium text-white">Crab2API</p>
                <p class="mt-0.5 font-mono text-[11px] text-white/70">claude-only</p>
              </div>
              <div class="bg-white px-3 py-4 dark:bg-dark-900">
                <p class="mono-label">03 / {{ t('landing.demo.upstream') }}</p>
                <p class="mt-1.5 text-sm font-medium text-gray-900 dark:text-white">
                  claude-opus-4-6
                </p>
                <p class="mt-0.5 font-mono text-[11px] text-gray-400 dark:text-dark-400">
                  Anthropic
                </p>
              </div>
            </div>

            <!-- metrics -->
            <div
              class="grid grid-cols-2 gap-px border-t border-gray-200 bg-gray-200 sm:grid-cols-4 dark:border-dark-700 dark:bg-dark-700"
            >
              <div v-for="metric in metrics" :key="metric.label" class="bg-white px-3 py-3 dark:bg-dark-900">
                <p class="mono-label">{{ metric.label }}</p>
                <p class="mt-1 font-mono text-sm font-semibold text-gray-900 dark:text-white">
                  {{ metric.value }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BrandLogo from '@/components/brand/BrandLogo.vue'
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

// Illustrative figures for the demo panel — not live telemetry.
const metrics = computed(() => [
  { label: t('landing.demo.status'), value: '200 OK' },
  { label: t('landing.demo.latency'), value: '0.94 s' },
  { label: t('landing.demo.tokens'), value: '1,284' },
  { label: t('landing.demo.model'), value: 'opus-4-6' }
])
</script>
