import type { FlowerSlot, PlacedFlower } from './types'

const GOLDEN_ANGLE = 137.508

function generateSlot(index: number): FlowerSlot {
  const ring = Math.floor(index / 3)
  const positionInRing = index % 3
  const angleDeg = index * GOLDEN_ANGLE + positionInRing * 18
  const angleRad = (angleDeg * Math.PI) / 180

  const radiusX = 6 + ring * 9
  const radiusY = 4 + ring * 5
  const yBase = 44 - ring * 3 + positionInRing * 2

  const scale = Math.max(0.42, 0.95 - index * 0.025)
  const z = Math.min(5, 1 + ring + (positionInRing > 0 ? 1 : 0))

  return {
    x: 50 + Math.cos(angleRad) * radiusX,
    y: yBase + Math.sin(angleRad) * radiusY * 0.35,
    scale,
    rotation: ((angleDeg % 40) - 20) * 0.6,
    z,
  }
}

export function assignFlowersToSlots(flowerIds: string[]): PlacedFlower[] {
  return flowerIds.map((flowerId, index) => ({
    flowerId,
    slot: generateSlot(index),
  }))
}

/** @deprecated Kept for tests that reference fixed slot count. */
export const FLOWER_SLOTS: FlowerSlot[] = Array.from({ length: 8 }, (_, i) =>
  generateSlot(i)
)
