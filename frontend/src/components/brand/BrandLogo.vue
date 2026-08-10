<template>
  <svg
    :width="size"
    :height="size"
    viewBox="0 0 64 64"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    role="img"
    :aria-label="label"
    class="shrink-0"
  >
    <rect v-if="plate" width="64" height="64" rx="14" class="fill-gray-100 dark:fill-dark-800" />

    <!-- claws + legs -->
    <g
      stroke="currentColor"
      :stroke-width="strokeWidth"
      stroke-linecap="round"
      stroke-linejoin="round"
      fill="none"
    >
      <path d="M6.5 27.5 L11 32 L6.5 36.5" />
      <path d="M11 32 L17.5 37.5" />
      <path d="M57.5 27.5 L53 32 L57.5 36.5" />
      <path d="M53 32 L46.5 37.5" />
      <path d="M18 42 L10 45" />
      <path d="M20.5 45 L13.5 50" />
      <path d="M25 47 L20 54" />
      <path d="M46 42 L54 45" />
      <path d="M43.5 45 L50.5 50" />
      <path d="M39 47 L44 54" />
    </g>

    <!-- shell -->
    <path
      d="M16 41 C16 27 48 27 48 41 C48 44.5 40.5 46.5 32 46.5 C23.5 46.5 16 44.5 16 41 Z"
      fill="currentColor"
    />

    <!-- eyes -->
    <circle cx="26" cy="35.5" r="2.3" class="fill-gray-100 dark:fill-dark-800" />
    <circle cx="38" cy="35.5" r="2.3" class="fill-gray-100 dark:fill-dark-800" />
  </svg>
</template>

<script setup lang="ts">
/**
 * Crab2API mark. Draws in `currentColor` so it inherits the surrounding text
 * colour — set `text-primary-500` (or any other) on the parent.
 */
withDefaults(
  defineProps<{
    /** Rendered edge length in px. */
    size?: number | string
    /** Draw the rounded background plate behind the crab. */
    plate?: boolean
    /** Stroke weight for claws and legs. */
    strokeWidth?: number
    label?: string
  }>(),
  {
    size: 32,
    plate: false,
    strokeWidth: 3.2,
    label: 'Crab2API'
  }
)
</script>
