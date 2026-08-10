/**
 * Locale-aware routing for the public site.
 *
 * URL contract:
 *   English  ->  /            /docs
 *   Chinese  ->  /zh          /zh/docs
 *
 * The console (/dashboard/**) and auth pages are NOT locale-prefixed; there the
 * language is driven purely by the switcher, as it always was.
 */
import { computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { setLocale } from '@/i18n'

export type PublicLocale = 'en' | 'zh'

/** Strip a leading /zh from a public path, returning the locale-neutral part. */
export function stripLocalePrefix(path: string): string {
  if (path === '/zh') return '/'
  if (path.startsWith('/zh/')) return path.slice(3) || '/'
  return path
}

/** Build the public path for `neutralPath` in `locale`. */
export function localizedPublicPath(neutralPath: string, locale: PublicLocale): string {
  const normalized = neutralPath.startsWith('/') ? neutralPath : `/${neutralPath}`
  if (locale === 'en') {
    return normalized
  }
  return normalized === '/' ? '/zh' : `/zh${normalized}`
}

export function usePublicLocale() {
  const route = useRoute()
  const router = useRouter()
  const { locale } = useI18n()

  const currentLocale = computed<PublicLocale>(() => (locale.value === 'zh' ? 'zh' : 'en'))

  /** True while the visitor is on a locale-prefixed public route. */
  const isPublicRoute = computed(() => route.meta?.publicSite === true)

  /** Map a locale-neutral public path onto the active locale. */
  function publicPath(neutralPath: string): string {
    return localizedPublicPath(neutralPath, currentLocale.value)
  }

  /**
   * Switch language. On a public route this also rewrites the URL so the
   * address bar keeps matching the rendered language.
   */
  async function switchLocale(next: PublicLocale): Promise<void> {
    if (next === currentLocale.value) return
    await setLocale(next)

    if (isPublicRoute.value) {
      const neutral = stripLocalePrefix(route.path)
      await router.replace({
        path: localizedPublicPath(neutral, next),
        query: route.query,
        hash: route.hash
      })
    }
  }

  return {
    currentLocale,
    isPublicRoute,
    publicPath,
    switchLocale
  }
}
