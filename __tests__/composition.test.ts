import { describe, expect, it } from 'vitest'

import { assignFlowersToSlots } from '@/lib/composition'
import {
  adjustFlowerQuantity,
  countFlowersById,
  getTotalFlowerCount,
} from '@/lib/flowerSelection'

describe('assignFlowersToSlots', () => {
  it('assigns a slot for every flower', () => {
    const ids = ['rose', 'peony', 'tulip', 'rose', 'rose']
    const placed = assignFlowersToSlots(ids)
    expect(placed).toHaveLength(5)
    expect(placed.every((p) => p.slot.x > 0 && p.slot.y > 0)).toBe(true)
  })

  it('is deterministic', () => {
    const ids = ['rose', 'lily', 'daisy', 'orchid', 'rose', 'rose']
    expect(assignFlowersToSlots(ids)).toEqual(assignFlowersToSlots(ids))
  })
})

describe('adjustFlowerQuantity', () => {
  it('adds and removes flower instances', () => {
    let flowers: string[] = []
    flowers = adjustFlowerQuantity(flowers, 'rose', 3)
    expect(getTotalFlowerCount(flowers)).toBe(3)
    expect(countFlowersById(flowers).get('rose')).toBe(3)

    flowers = adjustFlowerQuantity(flowers, 'rose', -1)
    expect(countFlowersById(flowers).get('rose')).toBe(2)
  })

  it('does not exceed max total when adding', () => {
    let flowers = Array.from({ length: 19 }, () => 'rose')
    flowers = adjustFlowerQuantity(flowers, 'tulip', 5)
    expect(flowers).toHaveLength(20)
    expect(flowers.filter((id) => id === 'tulip')).toHaveLength(1)
  })

  it('allows the same flower up to the total bouquet max', () => {
    let flowers: string[] = []
    flowers = adjustFlowerQuantity(flowers, 'rose', 8)
    expect(flowers.filter((id) => id === 'rose')).toHaveLength(8)
    expect(flowers).toHaveLength(8)
  })
})
