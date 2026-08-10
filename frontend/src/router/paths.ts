/**
 * Crab2API URL contract.
 *
 * Public site (locale-prefixed):
 *   /            /docs           English
 *   /zh          /zh/docs        Chinese
 *
 * Console (never locale-prefixed):
 *   /dashboard                   user console home
 *   /dashboard/<page>            user console pages
 *   /dashboard/admin/<page>      admin console pages
 *
 * Deliberately left at the site root — these are contracts with something
 * outside the SPA and moving them would break it:
 *   /auth/**       OAuth redirect URIs registered with upstream providers
 *   /payment/**    the backend hard-validates the return URL path
 *                  (`paymentResultReturnPath` in payment_resume_service.go)
 *   /login /register /setup /key-usage /legal/** /model-plaza
 */

/** Root of every console page. */
export const CONSOLE_ROOT = '/dashboard'

/** Root of every admin console page. */
export const ADMIN_ROOT = '/dashboard/admin'

/** Landing page for a user who just authenticated. */
export const USER_HOME = CONSOLE_ROOT

/** Landing page for an admin who just authenticated. */
export const ADMIN_HOME = `${ADMIN_ROOT}/dashboard`

/**
 * Old flat console paths -> their new home under /dashboard.
 *
 * Registered as permanent redirects so bookmarks, e-mail links and any
 * `router.push('/keys')` left in a component keep working.
 */
export const LEGACY_CONSOLE_REDIRECTS: Record<string, string> = {
  '/keys': `${CONSOLE_ROOT}/keys`,
  '/batch-image': `${CONSOLE_ROOT}/batch-image`,
  // The console guide used to be aliased at /docs/batch-image, which now
  // collides with the public docs page.
  '/docs/batch-image': `${CONSOLE_ROOT}/batch-image`,
  '/usage': `${CONSOLE_ROOT}/usage`,
  '/redeem': `${CONSOLE_ROOT}/redeem`,
  '/affiliate': `${CONSOLE_ROOT}/affiliate`,
  '/available-channels': `${CONSOLE_ROOT}/available-channels`,
  '/monitor': `${CONSOLE_ROOT}/monitor`,
  '/profile': `${CONSOLE_ROOT}/profile`,
  '/subscriptions': `${CONSOLE_ROOT}/subscriptions`,
  '/purchase': `${CONSOLE_ROOT}/purchase`,
  '/orders': `${CONSOLE_ROOT}/orders`
}

/** True for any path that belongs to the console. */
export function isConsolePath(path: string): boolean {
  return path === CONSOLE_ROOT || path.startsWith(`${CONSOLE_ROOT}/`)
}

/** True for any admin console path. */
export function isAdminPath(path: string): boolean {
  return path === ADMIN_ROOT || path.startsWith(`${ADMIN_ROOT}/`)
}

/** Where an authenticated visitor should land. */
export function homePathFor(isAdmin: boolean): string {
  return isAdmin ? ADMIN_HOME : USER_HOME
}
