import { describe, expect, it } from 'vitest'

import { searchFlowersByFeeling } from '@/lib/flowers/feelingSearch'

describe('searchFlowersByFeeling', () => {
  it('returns lotus for resilience', () => {
    expect(searchFlowersByFeeling('resilience')).toContain('lotus')
  })

  it('returns tulip for first thought', () => {
    expect(searchFlowersByFeeling('first thought')).toContain('tulip')
  })

  it('returns empty array for blank query', () => {
    expect(searchFlowersByFeeling('   ')).toEqual([])
  })
})
