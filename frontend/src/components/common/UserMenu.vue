<template>
  <div v-if="user" class="relative" ref="rootRef">
    <button
      type="button"
      class="flex items-center gap-2 rounded-xl p-1 transition-colors hover:bg-gray-100 dark:hover:bg-dark-800"
      :aria-label="t('common.userMenu')"
      :aria-expanded="open"
      aria-haspopup="menu"
      @click="open = !open"
    >
      <span
        class="flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-xs font-semibold text-white"
      >
        <img
          v-if="avatarUrl"
          :src="avatarUrl"
          :alt="displayName"
          class="h-full w-full object-cover"
        />
        <span v-else>{{ initials }}</span>
      </span>
      <Icon name="chevronDown" size="xs" class="text-gray-400 transition-transform" :class="{ 'rotate-180': open }" />
    </button>

    <transition name="crab-pop">
      <div
        v-if="open"
        role="menu"
        class="absolute right-0 z-50 mt-2 w-60 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card dark:border-dark-700 dark:bg-dark-800"
      >
        <!-- Identity -->
        <div class="flex items-center gap-3 border-b border-gray-100 px-4 py-3 dark:border-dark-700">
          <span
            class="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gradient-to-br from-primary-400 to-primary-600 text-xs font-semibold text-white"
          >
            <img
              v-if="avatarUrl"
              :src="avatarUrl"
              :alt="displayName"
              class="h-full w-full object-cover"
            />
            <span v-else>{{ initials }}</span>
          </span>
          <div class="min-w-0">
            <p class="truncate text-sm font-medium text-gray-900 dark:text-white">
              {{ user.email || displayName }}
            </p>
            <p class="text-xs text-gray-500 dark:text-dark-400">{{ roleLabel }}</p>
          </div>
        </div>

        <div class="py-1">
          <router-link to="/dashboard/profile" class="menu-item" role="menuitem" @click="open = false">
            <Icon name="user" size="sm" />
            {{ t('nav.profile') }}
          </router-link>

          <router-link
            v-if="paymentEnabled"
            to="/dashboard/purchase"
            class="menu-item"
            role="menuitem"
            @click="open = false"
          >
            <Icon name="creditCard" size="sm" />
            {{ t('nav.buySubscription') }}
          </router-link>
        </div>

        <div class="border-t border-gray-100 py-1 dark:border-dark-700">
          <button
            type="button"
            role="menuitem"
            class="menu-item w-full text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
            @click="onLogout"
          >
            <Icon name="login" size="sm" />
            {{ t('nav.logout') }}
          </button>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup lang="ts">
/**
 * Avatar + dropdown shown wherever a signed-in visitor needs to reach their
 * own pages — including the public site, so the landing page is never a
 * dead end for someone who is already logged in.
 *
 * The console header keeps its own richer menu (balance, onboarding replay,
 * support contact); this is the compact variant.
 */
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import Icon from '@/components/icons/Icon.vue'
import { useAppStore, useAuthStore } from '@/stores'

const { t } = useI18n()
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const appStore = useAppStore()

const open = ref(false)
const rootRef = ref<HTMLElement | null>(null)

const user = computed(() => authStore.user)
const avatarUrl = computed(() => user.value?.avatar_url?.trim() || '')
const paymentEnabled = computed(() => appStore.cachedPublicSettings?.payment_enabled === true)

const displayName = computed(() => {
  if (!user.value) return ''
  return user.value.username || user.value.email?.split('@')[0] || ''
})

const initials = computed(() => {
  const source = user.value?.username || user.value?.email?.split('@')[0] || ''
  return source.substring(0, 2).toUpperCase()
})

const roleLabel = computed(() =>
  authStore.isAdmin ? t('siteNav.roleAdmin') : t('siteNav.roleUser')
)

async function onLogout() {
  open.value = false
  try {
    await authStore.logout()
  } catch (error) {
    // Logging out locally still matters even if the server call fails.
    console.error('Logout error:', error)
  }
  await router.push('/login')
}

function onClickOutside(event: MouseEvent) {
  if (rootRef.value && !rootRef.value.contains(event.target as Node)) {
    open.value = false
  }
}

watch(() => route.fullPath, () => { open.value = false })

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
.menu-item {
  @apply flex items-center gap-2.5 px-4 py-2.5 text-sm text-gray-700 transition-colors hover:bg-gray-100 dark:text-dark-200 dark:hover:bg-dark-700;
}

.crab-pop-enter-active,
.crab-pop-leave-active {
  transition: all 0.15s ease;
}
.crab-pop-enter-from,
.crab-pop-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(-4px);
}
</style>
