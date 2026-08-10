import { describe, expect, it } from 'vitest'

import { BRAND_NAME, normalizeSiteName } from '../brand'

describe('normalizeSiteName', () => {
  it('falls back to the brand name when nothing is configured', () => {
    expect(normalizeSiteName(undefined)).toBe(BRAND_NAME)
    expect(normalizeSiteName(null)).toBe(BRAND_NAME)
    expect(normalizeSiteName('')).toBe(BRAND_NAME)
    expect(normalizeSiteName('   ')).toBe(BRAND_NAME)
  })

  it('rewrites the inherited upstream site name to the brand name', () => {
    // A fork of Sub2API already has this seeded in its settings table, and the
    // stored value outranks any frontend default — this is what made the header
    // and hero keep rendering "Sub2API" after the rebrand.
    expect(normalizeSiteName('Sub2API')).toBe(BRAND_NAME)
    expect(normalizeSiteName('sub2api')).toBe(BRAND_NAME)
    expect(normalizeSiteName('  SUB2API  ')).toBe(BRAND_NAME)
    expect(normalizeSiteName('sub2api-bmai')).toBe(BRAND_NAME)
  })

  it('passes a genuinely customised site name straight through', () => {
    expect(normalizeSiteName('My Relay')).toBe('My Relay')
    expect(normalizeSiteName('  My Relay  ')).toBe('My Relay')
    expect(normalizeSiteName(BRAND_NAME)).toBe(BRAND_NAME)
  })
})
