import { beforeEach, describe, expect, it, vi } from 'vitest'
import { useWindow5h } from '../useWindow5h'
import type { Window5hStatus } from '@/api/usage'

const getWindow5h = vi.fn()

vi.mock('@/api', () => ({
  usageAPI: {
    getWindow5h: (...args: unknown[]) => getWindow5h(...args),
  },
}))

const status = (over: Partial<Window5hStatus> = {}): Window5hStatus => ({
  limit: 30,
  used: 0,
  alert_pct: 80,
  window_open: true,
  degraded: false,
  ...over,
})

describe('useWindow5h', () => {
  beforeEach(() => {
    getWindow5h.mockReset()
  })

  it('stays disabled until the first fetch lands', () => {
    const w = useWindow5h()
    expect(w.enabled.value).toBe(false)
    expect(w.usedPct.value).toBe(0)
    expect(w.alerting.value).toBe(false)
  })

  // limit 0 是「不限制」而不是「上限为零」——画一条满格的进度条会把
  // 无限额度显示成已用尽，恰好是反的。
  it('stays disabled when the user has no cap', async () => {
    getWindow5h.mockResolvedValue(status({ limit: 0, used: 0 }))
    const w = useWindow5h()
    await w.refresh()
    expect(w.enabled.value).toBe(false)
  })

  // 计数器读不到时 used 是占位的 0；显示 "0 / 30" 等于告诉用户
  // 他一次都没用过，与事实相反。
  it('stays disabled when the counter is degraded', async () => {
    getWindow5h.mockResolvedValue(status({ used: 25, degraded: true }))
    const w = useWindow5h()
    await w.refresh()
    expect(w.enabled.value).toBe(false)
  })

  it('reports usage percentage against the cap', async () => {
    getWindow5h.mockResolvedValue(status({ limit: 30, used: 15 }))
    const w = useWindow5h()
    await w.refresh()
    expect(w.enabled.value).toBe(true)
    expect(w.usedPct.value).toBe(50)
    expect(w.alerting.value).toBe(false)
    expect(w.exhausted.value).toBe(false)
  })

  it('alerts once usage reaches the configured percentage', async () => {
    // 80% of 30 = 24
    getWindow5h.mockResolvedValue(status({ limit: 30, used: 23 }))
    const below = useWindow5h()
    await below.refresh()
    expect(below.alerting.value).toBe(false)

    getWindow5h.mockResolvedValue(status({ limit: 30, used: 24 }))
    const at = useWindow5h()
    await at.refresh()
    expect(at.alerting.value).toBe(true)
    expect(at.exhausted.value).toBe(false)
  })

  it('marks the window exhausted at the cap, and clamps the bar past it', async () => {
    // 计数可能短暂超过上限（并发请求同时通过闸门），进度条不能溢出。
    getWindow5h.mockResolvedValue(status({ limit: 30, used: 33 }))
    const w = useWindow5h()
    await w.refresh()
    expect(w.exhausted.value).toBe(true)
    expect(w.usedPct.value).toBe(100)
  })

  // 面板每分钟轮询一次，一次失败就把已显示的数字抹掉会让它在网络抖动时闪烁。
  it('keeps the last reading when a poll fails', async () => {
    getWindow5h.mockResolvedValue(status({ limit: 30, used: 12 }))
    const w = useWindow5h()
    await w.refresh()

    getWindow5h.mockRejectedValue(new Error('network'))
    await w.refresh()

    expect(w.status.value?.used).toBe(12)
    expect(w.enabled.value).toBe(true)
    expect(w.loading.value).toBe(false)
  })
})
