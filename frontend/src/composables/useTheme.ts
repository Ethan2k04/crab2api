/**
 * Shared day/night mode state.
 *
 * The `dark` class is applied to <html> during bootstrap (see main.ts) so the
 * first paint is already correct. This composable keeps every toggle in the app
 * pointing at the same reactive source instead of each component reading the
 * DOM on its own.
 *
 * Crab2API defaults to day mode; only an explicit user choice is persisted.
 */
import { ref, readonly } from 'vue'

const THEME_KEY = 'theme'

function currentlyDark(): boolean {
  if (typeof document === 'undefined') return false
  return document.documentElement.classList.contains('dark')
}

// Module-level singleton: every caller shares one ref.
const isDark = ref<boolean>(currentlyDark())

function apply(dark: boolean): void {
  isDark.value = dark
  document.documentElement.classList.toggle('dark', dark)
  localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light')
}

export function useTheme() {
  function toggleTheme(): void {
    apply(!isDark.value)
  }

  function setTheme(dark: boolean): void {
    apply(dark)
  }

  /** Re-read the DOM, e.g. after an external script flipped the class. */
  function syncFromDom(): void {
    isDark.value = currentlyDark()
  }

  return {
    isDark: readonly(isDark),
    toggleTheme,
    setTheme,
    syncFromDom
  }
}
