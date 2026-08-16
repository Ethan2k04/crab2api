import { describe, expect, it } from 'vitest'
import {
  BALANCE_RECHARGE_SUSPENDED,
  isPlanSuspended,
  isSuspendedTerm,
  SUSPENDED_PLAN_TERM_DAYS,
} from '../alphaGate'

/**
 * These lock in *which* tiers the alpha withholds. When the week and month
 * passes come back, `SUSPENDED_PLAN_TERM_DAYS` empties out and this whole
 * file goes with it.
 */
describe('alpha plan gate', () => {
  it('withholds the 7-day and 30-day tiers', () => {
    expect([...SUSPENDED_PLAN_TERM_DAYS]).toEqual([7, 30])
  })

  it('leaves only the day pass purchasable', () => {
    expect(isPlanSuspended({ validity_days: 1, validity_unit: 'day' })).toBe(false)
  })

  it('withholds the week pass', () => {
    expect(isPlanSuspended({ validity_days: 7, validity_unit: 'day' })).toBe(true)
  })

  it('withholds the month pass', () => {
    expect(isPlanSuspended({ validity_days: 30, validity_unit: 'day' })).toBe(true)
  })

  // The admin plan form saves plural units, so the same term can be stored
  // multiple different ways. Matching the raw day count would miss these.
  it.each([
    ['1 months', 1, 'months'],
    ['1 month', 1, 'month'],
    ['30 days', 30, 'days'],
    ['1 weeks', 1, 'weeks'],
  ])('withholds a term stored as %s', (_label, days, unit) => {
    expect(isPlanSuspended({ validity_days: days, validity_unit: unit })).toBe(true)
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
