<template>
  <header
    class="sticky top-0 z-50 w-full border-b border-gray-200/70 bg-gray-50/80 backdrop-blur-xl dark:border-dark-700/70 dark:bg-dark-950/80"
  >
    <div class="mx-auto flex h-16 max-w-6xl items-center gap-4 px-4 sm:px-6">
      <!-- Left: logo + brand name -->
      <router-link
        :to="publicPath('/')"
        class="group flex shrink-0 items-center gap-2.5 transition-opacity hover:opacity-80"
      >
        <BrandLogo :size="30" class="text-primary-500" />
        <span class="font-semibold tracking-tight text-gray-900 dark:text-white">
          {{ brandName }}
        </span>
      </router-link>

      <!-- Middle: primary navigation -->
      <nav class="hidden flex-1 justify-center md:flex" :aria-label="t('siteNav.mainPage')">
        <div
          class="flex items-center gap-1 rounded-xl border border-gray-200 bg-white/70 p-1 dark:border-dark-700 dark:bg-dark-900/70"
        >
          <router-link
            v-for="item in navItems"
            :key="item.key"
            :to="item.to"
            class="rounded-lg px-3.5 py-1.5 text-sm font-medium transition-colors"
            :class="
              item.active
                ? 'bg-primary-500 text-white shadow-sm'
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900 dark:text-dark-300 dark:hover:bg-dark-800 dark:hover:text-white'
            "
          >
            {{ item.label }}
          </router-link>
        </div>
      </nav>

      <!-- Right: locale, theme, login -->
      <div class="ml-auto flex shrink-0 items-center gap-1.5 md:ml-0 sm:gap-2">
        <!-- Locale -->
        <div class="relative" ref="localeRef">
          <button
            type="button"
            class="flex h-9 items-center gap-1.5 rounded-lg border border-gray-200 px-2.5 text-sm font-medium text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-dark-700 dark:text-dark-300 dark:hover:bg-dark-800 dark:hover:text-white"
            :aria-label="t('siteNav.language')"
            :aria-expanded="localeOpen"
            aria-haspopup="listbox"
            @click="localeOpen = !localeOpen"
          >
            <Icon name="globe" size="sm" />
            <span class="hidden sm:inline">{{ activeLocaleName }}</span>
            <Icon
              name="chevronDown"
              size="xs"
              class="transition-transform"
              :class="{ 'rotate-180': localeOpen }"
            />
          </button>
          <transition name="crab-pop">
            <ul
              v-if="localeOpen"
              role="listbox"
              class="absolute right-0 z-50 mt-1.5 w-36 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-card dark:border-dark-700 dark:bg-dark-800"
            >
              <li v-for="loc in localeOptions" :key="loc.code">
                <button
                  type="button"
                  role="option"
                  :aria-selected="loc.code === currentLocale"
                  class="flex w-full items-center gap-2 px-3 py-2 text-sm transition-colors"
                  :class="
                    loc.code === currentLocale
                      ? 'bg-primary-50 text-primary-700 dark:bg-primary-900/25 dark:text-primary-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-dark-200 dark:hover:bg-dark-700'
                  "
                  @click="onSelectLocale(loc.code)"
                >
                  <span>{{ loc.flag }}</span>
                  <span>{{ loc.name }}</span>
                  <Icon
                    v-if="loc.code === currentLocale"
                    name="check"
                    size="sm"
                    class="ml-auto text-primary-500"
                  />
                </button>
              </li>
            </ul>
          </transition>
        </div>

        <!-- Day / night -->
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:border-dark-700 dark:text-dark-300 dark:hover:bg-dark-800 dark:hover:text-white"
          :aria-label="isDark ? t('siteNav.lightMode') : t('siteNav.darkMode')"
          :title="isDark ? t('siteNav.lightMode') : t('siteNav.darkMode')"
          @click="toggleTheme"
        >
          <Icon :name="isDark ? 'sun' : 'moon'" size="sm" />
        </button>

        <!-- Signed in: avatar menu. Signed out: login button. -->
        <UserMenu v-if="isAuthenticated" />
        <router-link
          v-else
          to="/login"
          class="hidden h-9 items-center rounded-lg bg-primary-500 px-4 text-sm font-medium text-white shadow-sm transition-colors hover:bg-primary-600 sm:inline-flex"
        >
          {{ t('siteNav.login') }}
        </router-link>

        <!-- Mobile menu -->
        <button
          type="button"
          class="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 text-gray-600 transition-colors hover:bg-gray-100 dark:border-dark-700 dark:text-dark-300 dark:hover:bg-dark-800 md:hidden"
          :aria-label="mobileOpen ? t('siteNav.closeMenu') : t('siteNav.openMenu')"
          :aria-expanded="mobileOpen"
          @click="mobileOpen = !mobileOpen"
        >
          <Icon :name="mobileOpen ? 'x' : 'menu'" size="sm" />
        </button>
      </div>
    </div>

    <!-- Mobile drawer -->
    <transition name="crab-collapse">
      <div
        v-if="mobileOpen"
        class="border-t border-gray-200 bg-gray-50 px-4 py-3 md:hidden dark:border-dark-700 dark:bg-dark-950"
      >
        <router-link
          v-for="item in navItems"
          :key="item.key"
          :to="item.to"
          class="block rounded-lg px-3 py-2.5 text-sm font-medium transition-colors"
          :class="
            item.active
              ? 'bg-primary-500 text-white'
              : 'text-gray-700 hover:bg-gray-100 dark:text-dark-200 dark:hover:bg-dark-800'
          "
          @click="mobileOpen = false"
        >
          {{ item.label }}
        </router-link>
        <router-link
          v-if="!isAuthenticated"
          to="/login"
          class="mt-2 block rounded-lg bg-primary-500 px-3 py-2.5 text-center text-sm font-medium text-white sm:hidden"
          @click="mobileOpen = false"
        >
          {{ t('siteNav.login') }}
        </router-link>
        <template v-else>
          <router-link
            to="/dashboard/profile"
            class="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-dark-200 dark:hover:bg-dark-800"
            @click="mobileOpen = false"
          >
            {{ t('nav.profile') }}
          </router-link>
          <router-link
            v-if="paymentEnabled"
            to="/dashboard/purchase"
            class="block rounded-lg px-3 py-2.5 text-sm font-medium text-gray-700 hover:bg-gray-100 dark:text-dark-200 dark:hover:bg-dark-800"
            @click="mobileOpen = false"
          >
            {{ t('nav.buySubscription') }}
          </router-link>
        </template>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute } from 'vue-router'
import BrandLogo from '@/components/brand/BrandLogo.vue'
import Icon from '@/components/icons/Icon.vue'
import UserMenu from '@/components/common/UserMenu.vue'
import { useTheme } from '@/composables/useTheme'
import { usePublicLocale, stripLocalePrefix, type PublicLocale } from '@/composables/usePublicLocale'
import { availableLocales } from '@/i18n'
import { useAppStore, useAuthStore } from '@/stores'
import { BRAND_NAME } from '@/config/brand'

const { t } = useI18n()
const route = useRoute()
const appStore = useAppStore()
const authStore = useAuthStore()
const { isDark, toggleTheme } = useTheme()
const { currentLocale, publicPath, switchLocale } = usePublicLocale()

const localeOpen = ref(false)
const mobileOpen = ref(false)
const localeRef = ref<HTMLElement | null>(null)

const localeOptions = availableLocales
const brandName = computed(() => appStore.siteName || BRAND_NAME)
const isAuthenticated = computed(() => authStore.isAuthenticated)

const activeLocaleName = computed(
  () => localeOptions.find((l) => l.code === currentLocale.value)?.name ?? '中文'
)

/** Admins land on the admin dashboard, everyone else on the user console. */
const consolePath = computed(() => (authStore.isAdmin ? '/dashboard/admin' : '/dashboard'))
const paymentEnabled = computed(() => appStore.cachedPublicSettings?.payment_enabled === true)

const neutralPath = computed(() => stripLocalePrefix(route.path))

const navItems = computed(() => [
  {
    key: 'main',
    label: t('siteNav.mainPage'),
    to: publicPath('/'),
    active: neutralPath.value === '/'
  },
  {
    key: 'console',
    label: t('siteNav.console'),
    to: consolePath.value,
    active: route.path.startsWith('/dashboard')
  },
  {
    key: 'docs',
    label: t('siteNav.docs'),
    to: publicPath('/docs'),
    active: neutralPath.value.startsWith('/docs')
  }
])

async function onSelectLocale(code: string) {
  localeOpen.value = false
  await switchLocale(code as PublicLocale)
}

function onClickOutside(event: MouseEvent) {
  if (localeRef.value && !localeRef.value.contains(event.target as Node)) {
    localeOpen.value = false
  }
}

// Route changes should never leave a dropdown or the drawer hanging open.
watch(
  () => route.fullPath,
  () => {
    localeOpen.value = false
    mobileOpen.value = false
  }
)

onMounted(() => document.addEventListener('click', onClickOutside))
onBeforeUnmount(() => document.removeEventListener('click', onClickOutside))
</script>

<style scoped>
.crab-pop-enter-active,
.crab-pop-leave-active {
  transition: all 0.15s ease;
}
.crab-pop-enter-from,
.crab-pop-leave-to {
  opacity: 0;
  transform: scale(0.96) translateY(-4px);
}

.crab-collapse-enter-active,
.crab-collapse-leave-active {
  transition: all 0.18s ease;
}
.crab-collapse-enter-from,
.crab-collapse-leave-to {
  opacity: 0;
  transform: translateY(-6px);
}
</style>
