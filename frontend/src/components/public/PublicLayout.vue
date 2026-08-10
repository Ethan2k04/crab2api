<template>
  <div class="flex min-h-screen flex-col bg-gray-50 text-gray-900 dark:bg-dark-950 dark:text-gray-100">
    <a href="#main-content" class="skip-link">{{ t('siteNav.skipToContent') }}</a>

    <SiteHeader />

    <main id="main-content" class="flex-1">
      <slot />
    </main>

    <SiteFooter />
  </div>
</template>

<script setup lang="ts">
/**
 * Shell for every public (logged-out) page: landing and docs.
 * The header is sticky and shared, per the brand spec.
 */
import { useI18n } from 'vue-i18n'
import SiteHeader from './SiteHeader.vue'
import SiteFooter from './SiteFooter.vue'

const { t } = useI18n()
</script>

<style scoped>
/* Visible only when focused via keyboard. */
.skip-link {
  @apply absolute left-4 top-2 z-[60] -translate-y-16 rounded-lg bg-primary-500 px-4 py-2 text-sm font-medium text-white transition-transform;
}
.skip-link:focus {
  @apply translate-y-0;
}
</style>
