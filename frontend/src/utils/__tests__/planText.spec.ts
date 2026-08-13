import { describe, expect, it } from 'vitest'
import { pickPlanLines, pickPlanText } from '../planText'

describe('pickPlanText', () => {
  it('returns text unchanged when it carries no separator', () => {
    expect(pickPlanText('日卡', 'en')).toBe('日卡')
    expect(pickPlanText('Day Pass', 'zh')).toBe('Day Pass')
  })

  it('picks the half matching the locale', () => {
    expect(pickPlanText('日卡 || Day Pass', 'zh')).toBe('日卡')
    expect(pickPlanText('日卡 || Day Pass', 'en')).toBe('Day Pass')
  })

  it('treats any zh-* locale as Chinese and everything else as English', () => {
    expect(pickPlanText('日卡 || Day Pass', 'zh-CN')).toBe('日卡')
    expect(pickPlanText('日卡 || Day Pass', 'en-GB')).toBe('Day Pass')
  })

  it('falls back to the other language rather than rendering blank', () => {
    expect(pickPlanText('日卡 ||', 'en')).toBe('日卡')
    expect(pickPlanText('|| Day Pass', 'zh')).toBe('Day Pass')
  })

  it('handles null and undefined fields', () => {
    expect(pickPlanText(null, 'en')).toBe('')
    expect(pickPlanText(undefined, 'zh')).toBe('')
  })

  it('ignores a stray third segment instead of leaking it into the output', () => {
    expect(pickPlanText('日卡 || Day Pass || whatever', 'en')).toBe('Day Pass')
  })
})

describe('pickPlanLines', () => {
  const features = '$5 额度 || $5 allowance\n有效期 24 小时 || Valid 24 hours\n'

  it('localizes each line independently', () => {
    expect(pickPlanLines(features, 'en')).toEqual(['$5 allowance', 'Valid 24 hours'])
    expect(pickPlanLines(features, 'zh')).toEqual(['$5 额度', '有效期 24 小时'])
  })

  it('drops blank lines so a trailing newline adds no empty bullet', () => {
    expect(pickPlanLines('a\n\n\nb', 'en')).toEqual(['a', 'b'])
    expect(pickPlanLines('', 'en')).toEqual([])
  })
})
