<template>
  <!--
    Operator override: when an admin sets `home_content` in system settings it
    replaces the whole landing page, either as an embedded URL or raw HTML.
    Carried over from the pre-rebrand home so the setting keeps working.
  -->
  <div v-if="hasHomeContent" class="min-h-screen">
    <iframe
      v-if="isHomeContentUrl"
      :src="homeContent.trim()"
      class="h-screen w-full border-0"
      allowfullscreen
    ></iframe>
    <!-- SECURITY: home_content is an admin-only setting; same trust model as before. -->
    <div v-else v-html="homeContent"></div>
  </div>

  <PublicLayout v-else>
    <LandingHero />
    <LandingFeatures />
    <LandingUseCases />
    <LandingPricing />
    <LandingFaq />
    <LandingCta />
  </PublicLayout>
</template>

<script setup lang="ts">
/**
 * Crab2API welcome page.
 *
 * Served at `/` (English) and `/zh` (Chinese) — see the `publicSite` route meta
 * and the locale guard in the router.
 */
import { computed, onMounted, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import PublicLayout from '@/components/public/PublicLayout.vue'
import LandingHero from '@/components/public/landing/LandingHero.vue'
import LandingFeatures from '@/components/public/landing/LandingFeatures.vue'
import LandingUseCases from '@/components/public/landing/LandingUseCases.vue'
import LandingPricing from '@/components/public/landing/LandingPricing.vue'
import LandingFaq from '@/components/public/landing/LandingFaq.vue'
import LandingCta from '@/components/public/landing/LandingCta.vue'
import { useAppStore } from '@/stores'

const { t, locale } = useI18n()
const appStore = useAppStore()

const homeContent = computed(() => appStore.cachedPublicSettings?.home_content || '')
const hasHomeContent = computed(() => homeContent.value.trim().length > 0)
const isHomeContentUrl = computed(() => {
  const content = homeContent.value.trim()
  return content.startsWith('http://') || content.startsWith('https://')
})

/** Keep the meta description in step with the active language. */
function syncMetaDescription() {
  const content = t('landing.meta.description')
  let tag = document.querySelector('meta[name="description"]')
  if (!tag) {
    tag = document.createElement('meta')
    tag.setAttribute('name', 'description')
    document.head.appendChild(tag)
  }
  tag.setAttribute('content', content)
}

watch(locale, syncMetaDescription)

onMounted(() => {
  syncMetaDescription()
  if (!appStore.publicSettingsLoaded) {
    appStore.fetchPublicSettings()
  }
})
</script>
