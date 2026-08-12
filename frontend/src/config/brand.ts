/**
 * Crab2API brand configuration.
 *
 * Single source of truth for everything brand-specific that is *not* served by
 * the backend. Anything an operator may want to tweak without touching
 * components lives here.
 */

/** Canonical product name. Used verbatim everywhere. */
export const BRAND_NAME = 'Crab2API'

/** Chinese colloquial name (螃蟹中转站). */
export const BRAND_NAME_ZH = '螃蟹中转站'

/** Primary domain — the site entry point. */
export const BRAND_DOMAIN = 'crab2api.com'

/** Public site origin, used for canonical links and copy-paste examples. */
export const BRAND_ORIGIN = `https://${BRAND_DOMAIN}`

/**
 * Default API base URL shown in docs / quick-start snippets.
 * Overridden at runtime by the `api_base_url` public setting when the admin
 * configures one.
 */
export const DEFAULT_API_BASE_URL = `${BRAND_ORIGIN}/api`

/** Anthropic-compatible endpoint suffix (Claude Code / Anthropic SDK). */
export const ANTHROPIC_ENDPOINT = '/v1/messages'

/** OpenAI-compatible endpoint suffix (for clients that only speak OpenAI). */
export const OPENAI_ENDPOINT = '/v1/chat/completions'

/**
 * Claude models advertised on the public site.
 *
 * `id` must match the model id the gateway accepts. `tier` drives the badge
 * colour on the landing page.
 */
export interface AdvertisedModel {
  id: string
  label: string
  tier: 'flagship' | 'balanced' | 'fast'
}

export const ADVERTISED_MODELS: AdvertisedModel[] = [
  { id: 'claude-opus-4-6', label: 'Claude Opus 4.6', tier: 'flagship' },
  { id: 'claude-sonnet-4-5', label: 'Claude Sonnet 4.5', tier: 'balanced' },
  { id: 'claude-haiku-4-5', label: 'Claude Haiku 4.5', tier: 'fast' },
  { id: 'claude-opus-4-1', label: 'Claude Opus 4.1', tier: 'flagship' },
  { id: 'claude-3-7-sonnet', label: 'Claude 3.7 Sonnet', tier: 'balanced' }
]

/**
 * Fallback plan cards.
 *
 * The landing page prefers live plans from `GET /api/v1/payment/public/plans`.
 * These render only when payment is disabled or the endpoint is unreachable, so
 * the pricing section never collapses into an empty state.
 *
 * Keep these in step with `backend/migrations/221_crab2api_subscription_tiers.sql`,
 * which seeds the real plans. Copy lives in i18n under `landing.pricing.plans.*`
 * so the fallback stays bilingual.
 */
export interface FallbackPlan {
  key: string
  /** Charged in CNY — the only currency these tiers are priced in. */
  priceCNY: number
  /** Included allowance, in USD of upstream API usage. */
  quotaUSD: number
  /** Term length in days; the allowance is forfeited when it lapses. */
  periodDays: number
  featured?: boolean
}

export const FALLBACK_PLANS: FallbackPlan[] = [
  { key: 'day', priceCNY: 6.99, quotaUSD: 5, periodDays: 1 },
  { key: 'week', priceCNY: 29.99, quotaUSD: 20, periodDays: 7, featured: true },
  { key: 'month', priceCNY: 69.99, quotaUSD: 60, periodDays: 30 }
]

/**
 * Anthropic's own consumer plan prices, for the landing-page comparison strip.
 *
 * These are typed in by hand on purpose. Anthropic publishes no pricing API,
 * claude.com sends no CORS headers a browser fetch could use, and scraping the
 * marketing page would break on the next redesign — so a wrong number would
 * surface as a silently wrong comparison rather than a visible error. Static
 * values with a stamped date keep the claim auditable.
 *
 * Verified 2026-08-13 against claude.com/pricing and the Max plan help article.
 * Re-check before quoting these in any campaign.
 */
export const OFFICIAL_PLAN_PRICING_CHECKED_ON = '2026-08-13'

/**
 * USD -> CNY rate used only to render an indicative "≈ ¥N" next to the official
 * USD prices. Nothing is charged in USD, so this never touches billing — it
 * exists so a CNY-paying visitor can compare like with like.
 */
export const USD_TO_CNY_DISPLAY_RATE = 7.2

export interface OfficialPlan {
  key: string
  /** Anthropic's list price, USD per month, billed monthly. */
  priceUSD: number
}

export const OFFICIAL_PLANS: OfficialPlan[] = [
  { key: 'pro', priceUSD: 20 },
  { key: 'max5', priceUSD: 100 },
  { key: 'max20', priceUSD: 200 }
]

/**
 * Site names inherited from the upstream project.
 *
 * A deployment forked from Sub2API already has `site_name` seeded in its
 * settings table, and that stored value outranks any frontend default — which
 * is why the header and hero kept rendering "Sub2API" after the rebrand.
 * Treat those values as "never customised" so the Crab2API brand shows through
 * without an operator having to edit the setting by hand.
 *
 * An operator who genuinely wants a different name just sets it in admin
 * settings; anything not on this list is passed through untouched.
 */
const LEGACY_SITE_NAMES = new Set(['sub2api', 'sub2api-bmai', 'sub2api-frontend'])

/** Resolve the brand name to display for a stored `site_name` setting. */
export function normalizeSiteName(raw?: string | null): string {
  const trimmed = String(raw ?? '').trim()
  if (!trimmed) return BRAND_NAME
  if (LEGACY_SITE_NAMES.has(trimmed.toLowerCase())) return BRAND_NAME
  return trimmed
}

/** External links surfaced in the footer. */
export const BRAND_LINKS = {
  status: '',
  contact: '',
  terms: '/legal/terms-of-service',
  privacy: '/legal/privacy-policy'
} as const
