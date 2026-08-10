<template>
  <div
    class="group relative overflow-hidden rounded-xl border border-gray-200 bg-gray-950 dark:border-dark-700"
  >
    <div
      v-if="label"
      class="flex items-center justify-between border-b border-white/10 px-4 py-2"
    >
      <span class="font-mono text-[11px] uppercase tracking-wider text-gray-400">{{ label }}</span>
    </div>

    <button
      type="button"
      class="absolute right-2 z-10 rounded-lg border border-white/15 bg-white/10 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-gray-200 opacity-0 transition-opacity hover:bg-white/20 focus:opacity-100 group-hover:opacity-100"
      :class="label ? 'top-9' : 'top-2'"
      @click="onCopy"
    >
      {{ copied ? t('docsPage.copied') : t('docsPage.copy') }}
    </button>

    <pre
      class="overflow-x-auto px-4 py-4 font-mono text-[13px] leading-relaxed text-gray-100"
    ><code>{{ code }}</code></pre>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { useClipboard } from '@/composables/useClipboard'

const props = defineProps<{
  code: string
  /** Optional caption shown in the block header, e.g. "bash" or "python". */
  label?: string
}>()

const { t } = useI18n()
const { copied, copyToClipboard } = useClipboard()

function onCopy() {
  copyToClipboard(props.code, t('docsPage.copied'))
}
</script>
