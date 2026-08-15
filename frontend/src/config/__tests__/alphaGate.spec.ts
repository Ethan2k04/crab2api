import { describe, expect, it } from 'vitest'
import {
  BALANCE_RECHARGE_SUSPENDED,
  isPlanSuspended,
  isSuspendedTerm,
  SUSPENDED_PLAN_TERM_DAYS,
} from '../alphaGate'

/**
 * These lock in *which* tiers the alpha withholds. When the month pass comes
 * back, `SUSPENDED_PLAN_TERM_DAYS` empties out and this whole file goes with it.
 */
describe('alpha plan gate', () => {
  it('withholds only the 30-day tier', () => {
    expect([...SUSPENDED_PLAN_TERM_DAYS]).toEqual([30])
  })

  it('leaves the day and week passes purchasable', () => {
    expect(isPlanSuspended({ validity_days: 1, validity_unit: 'day' })).toBe(false)
    expect(isPlanSuspended({ validity_days: 7, validity_unit: 'day' })).toBe(false)
  })

  it('withholds the month pass', () => {
    expect(isPlanSuspended({ validity_days: 30, validity_unit: 'day' })).toBe(true)
  })

  // The admin plan form saves plural units, so the same 30-day term can be
  // stored three different ways. Matching the raw day count would miss two.
  it.each([
    ['1 months', 1, 'months'],
    ['1 month', 1, 'month'],
    ['30 days', 30, 'days'],
  ])('withholds a 30-day term stored as %s', (_label, days, unit) => {
    expect(isPlanSuspended({ validity_days: days, validity_unit: unit })).toBe(true)
  })

  it('does not withhold a 7-day term stored as 1 weeks', () => {
    expect(isPlanSuspended({ validity_days: 1, validity_unit: 'weeks' })).toBe(false)
  })

  it('treats a missing or zero-length plan as purchasable rather than blocked', () => {
    expect(isPlanSuspended(null)).toBe(false)
    expect(isPlanSuspended(undefined)).toBe(false)
    expect(isSuspendedTerm(0)).toBe(false)
  })

  it('withholds balance top-up', () => {
    expect(BALANCE_RECHARGE_SUSPENDED).toBe(true)
  })
})
