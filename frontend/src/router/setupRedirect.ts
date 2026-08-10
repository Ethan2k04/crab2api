import { homePathFor } from './paths'

export function resolveCompletedSetupRedirectPath(isAuthenticated: boolean, isAdmin: boolean): string {
  if (!isAuthenticated) {
    return '/login'
  }

  return homePathFor(isAdmin)
}
