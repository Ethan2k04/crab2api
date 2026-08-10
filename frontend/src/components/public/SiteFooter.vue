<template>
  <footer class="border-t border-gray-200 bg-gray-50 dark:border-dark-800 dark:bg-dark-950">
    <div class="mx-auto max-w-6xl px-4 py-12 sm:px-6">
      <div class="grid gap-10 md:grid-cols-[1.5fr_1fr_1fr_1fr]">
        <!-- Brand -->
        <div>
          <div class="flex items-center gap-2.5">
            <BrandLogo :size="26" class="text-primary-500" />
            <span class="font-semibold tracking-tight text-gray-900 dark:text-white">
              {{ brandName }}
            </span>
          </div>
          <p class="mt-3 max-w-xs text-sm text-gray-500 dark:text-dark-400">
            {{ t('siteFooter.tagline') }}
          </p>
        </div>

        <!-- Product -->
        <nav>
          <h3 class="mono-label">{{ t('siteFooter.product') }}</h3>
          <ul class="mt-3 space-y-2">
            <li>
              <router-link :to="{ path: publicPath('/'), hash: '#pricing' }" class="footer-link">
                {{ t('siteFooter.pricing') }}
              </router-link>
            </li>
            <li>
              <router-link :to="{ path: publicPath('/'), hash: '#models' }" class="footer-link">
                {{ t('siteFooter.models') }}
              </router-link>
            </li>
            <li>
              <router-link :to="{ path: publicPath('/'), hash: '#faq' }" class="footer-link">
                {{ t('siteFooter.faq') }}
              </router-link>
            </li>
          </ul>
        </nav>

        <!-- Resources -->
        <nav>
          <h3 class="mono-label">{{ t('siteFooter.resources') }}</h3>
          <ul class="mt-3 space-y-2">
            <li>
              <router-link :to="publicPath('/docs')" class="footer-link">
                {{ t('siteFooter.quickstart') }}
              </router-link>
            </li>
            <li>
              <router-link
                :to="{ path: publicPath('/docs'), hash: '#endpoints' }"
                class="footer-link"
              >
                {{ t('siteFooter.apiReference') }}
              </router-link>
            </li>
            <li>
              <router-link to="/dashboard" class="footer-link">
                {{ t('siteNav.console') }}
              </router-link>
            </li>
          </ul>
        </nav>

        <!-- Legal -->
        <nav>
          <h3 class="mono-label">{{ t('siteFooter.legal') }}</h3>
          <ul class="mt-3 space-y-2">
            <li>
              <router-link :to="BRAND_LINKS.terms" class="footer-link">
                {{ t('siteFooter.terms') }}
              </router-link>
            </li>
            <li>
              <router-link :to="BRAND_LINKS.privacy" class="footer-link">
                {{ t('siteFooter.privacy') }}
              </router-link>
            </li>
          </ul>
        </nav>
      </div>

      <div
        class="mt-10 flex flex-col gap-3 border-t border-gray-200 pt-6 text-xs text-gray-500 sm:flex-row sm:items-center sm:justify-between dark:border-dark-800 dark:text-dark-400"
      >
        <p>&copy; {{ currentYear }} {{ brandName }}. {{ t('siteFooter.allRightsReserved') }}</p>
        <p class="max-w-lg sm:text-right">{{ t('siteFooter.notAffiliated') }}</p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import BrandLogo from '@/components/brand/BrandLogo.vue'
import { usePublicLocale } from '@/composables/usePublicLocale'
import { useAppStore } from '@/stores'
import { BRAND_NAME, BRAND_LINKS } from '@/config/brand'

const { t } = useI18n()
const appStore = useAppStore()
const { publicPath } = usePublicLocale()

const brandName = computed(() => appStore.siteName || BRAND_NAME)
const currentYear = computed(() => new Date().getFullYear())
</script>

<style scoped>
.footer-link {
  @apply text-sm text-gray-600 transition-colors hover:text-primary-600 dark:text-dark-300 dark:hover:text-primary-400;
}
</style>
