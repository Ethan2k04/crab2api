<template>
  <!--
    Crab2API ships as a hosted web app: whatever the operator deploys is what
    every visitor already runs, so there is nothing for a user to "update".

    The upstream project shipped an online update/rollback panel here that
    resolved releases against Wei-Shaw/sub2api. On a fork that panel is worse
    than useless — it reported upstream's release number as an available
    update and its buttons would have pulled upstream's build over this one.
    Removed entirely; the badge is now a plain build indicator. Deployments
    move forward with `docker compose up -d --build`.
  -->
  <span
    v-if="displayVersion"
    class="inline-flex items-center rounded-lg bg-gray-100 px-2 py-1 text-xs font-medium text-gray-600 dark:bg-dark-800 dark:text-dark-400"
    :title="buildTitle"
  >
    v{{ displayVersion }}
  </span>
</template>

<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import { useAuthStore, useAppStore } from '@/stores'

const { t } = useI18n()

const props = defineProps<{
  version?: string
}>()

const authStore = useAuthStore()
const appStore = useAppStore()

const isAdmin = computed(() => authStore.isAdmin)

/**
 * `version` comes from public settings and is available to everyone; the admin
 * endpoint is only consulted because it reports the build actually running.
 */
const displayVersion = computed(() => appStore.currentVersion || props.version || '')

const buildTitle = computed(() =>
  appStore.buildType === 'release' ? t('version.buildRelease') : t('version.buildSource')
)

onMounted(() => {
  // Admin-only endpoint; non-admins fall back to the public settings value.
  if (isAdmin.value) {
    appStore.fetchVersion(false)
  }
})
</script>
