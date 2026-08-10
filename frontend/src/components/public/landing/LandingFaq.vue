<template>
  <section id="faq" class="border-b border-gray-200 dark:border-dark-800">
    <div class="mx-auto max-w-6xl px-4 py-20 sm:px-6">
      <header class="max-w-2xl">
        <p class="mono-label">04 / FAQ</p>
        <h2 class="mt-3 text-3xl font-bold tracking-tight text-gray-900 md:text-4xl dark:text-white">
          {{ t('landing.faq.title') }}
        </h2>
        <p class="mt-3 text-base text-gray-600 dark:text-dark-300">
          {{ t('landing.faq.subtitle') }}
        </p>
      </header>

      <dl class="mt-10 divide-y divide-gray-200 border-y border-gray-200 dark:divide-dark-700 dark:border-dark-700">
        <div v-for="item in items" :key="item.key">
          <dt>
            <button
              type="button"
              class="flex w-full items-center justify-between gap-4 py-5 text-left transition-colors hover:text-primary-600 dark:hover:text-primary-400"
              :aria-expanded="expanded === item.key"
              @click="toggle(item.key)"
            >
              <span class="text-base font-medium text-gray-900 dark:text-white">{{ item.q }}</span>
              <Icon
                name="chevronDown"
                size="sm"
                class="shrink-0 text-gray-400 transition-transform"
                :class="{ 'rotate-180': expanded === item.key }"
              />
            </button>
          </dt>
          <transition name="crab-faq">
            <dd v-if="expanded === item.key" class="pb-5">
              <p class="max-w-3xl text-sm leading-relaxed text-gray-600 dark:text-dark-300">
                {{ item.a }}
              </p>
            </dd>
          </transition>
        </div>
      </dl>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import { useI18n } from 'vue-i18n'
import Icon from '@/components/icons/Icon.vue'

const { t } = useI18n()

const FAQ_KEYS = ['pureBlood', 'compatibility', 'billing', 'limits', 'privacy', 'refund'] as const

// The first question explains the brand promise, so it opens by default.
const expanded = ref<string | null>(FAQ_KEYS[0])

const items = computed(() =>
  FAQ_KEYS.map((key) => ({
    key,
    q: t(`landing.faq.items.${key}.q`),
    a: t(`landing.faq.items.${key}.a`)
  }))
)

function toggle(key: string) {
  expanded.value = expanded.value === key ? null : key
}
</script>

<style scoped>
.crab-faq-enter-active,
.crab-faq-leave-active {
  transition: all 0.18s ease;
}
.crab-faq-enter-from,
.crab-faq-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
