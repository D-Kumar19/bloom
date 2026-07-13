'use client'

import { useState } from 'react'

import { FlowerArtwork } from '@/components/builder/FlowerArtwork'
import { Modal } from '@/components/ui/Modal'
import { useToast } from '@/components/ui/Toast'
import { FLOWERS } from '@/lib/flowers'
import {
  getFlowerQuantity,
  getTotalFlowerCount,
} from '@/lib/flowerSelection'
import { getFlowerCountMeaning } from '@/lib/meanings'
import { SUPPORT_EMAIL } from '@/lib/site'
import type { Flower } from '@/lib/types'
import { MAX_FLOWERS, MIN_FLOWERS } from '@/lib/types'

type FlowerPickerProps = {
  selected: string[]
  onAdjustQuantity: (flowerId: string, delta: number) => void
}

function QuantityButton({
  label,
  onClick,
  disabled,
}: {
  label: string
  onClick: () => void
  disabled?: boolean
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-8 w-8 items-center justify-center rounded-full border border-bloom-rose/25 bg-white text-base font-medium text-bloom-ink transition hover:border-brand-pink hover:bg-brand-pink/5 disabled:cursor-not-allowed disabled:opacity-30"
    >
      {label === 'decrease' ? '−' : '+'}
    </button>
  )
}

function FlowerDetailModal({
  flower,
  quantity,
  open,
  onClose,
}: {
  flower: Flower | null
  quantity: number
  open: boolean
  onClose: () => void
}) {
  if (!flower) {
    return null
  }

  return (
    <Modal open={open} onClose={onClose} title={flower.name}>
      <FlowerArtwork
        src={flower.image}
        alt={flower.name}
        className="mx-auto mb-4 max-w-xs rounded-2xl"
      />
      <p className="text-sm italic leading-relaxed text-bloom-ink/80">
        {flower.meaning}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-bloom-ink/70">
        <span className="font-medium text-bloom-ink">Did you know?</span>{' '}
        {flower.fact}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-bloom-ink/70">
        <span className="font-medium text-bloom-ink">Perfect for:</span>{' '}
        {flower.perfectFor}
      </p>
      {quantity > 0 ? (
        <p className="mt-5 border-t border-bloom-rose/15 pt-4 text-center text-sm text-bloom-ink/70">
          ✓ {quantity} in your bouquet
        </p>
      ) : null}
    </Modal>
  )
}

export function FlowerPicker({ selected, onAdjustQuantity }: FlowerPickerProps) {
  const { showToast } = useToast()
  const [detailFlower, setDetailFlower] = useState<Flower | null>(null)
  const total = getTotalFlowerCount(selected)
  const atMax = total >= MAX_FLOWERS
  const canContinue = total >= MIN_FLOWERS

  const handleIncrease = (flowerId: string) => {
    if (atMax) {
      showToast(`Your bouquet is full (${MAX_FLOWERS} flowers max).`, 'warning')
      return
    }
    onAdjustQuantity(flowerId, 1)
  }

  const detailQuantity = detailFlower
    ? getFlowerQuantity(selected, detailFlower.id)
    : 0

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="font-display text-2xl text-bloom-ink md:text-3xl">
            Pick your flowers
          </h2>
          <p className="mt-1 text-sm text-bloom-ink/60">
            Select the flowers for your bouquet (pick at least {MIN_FLOWERS}).
          </p>
        </div>
        <div className="rounded-2xl bg-white px-4 py-2 text-right shadow-sm ring-1 ring-bloom-rose/15">
          <p className="text-xs font-medium uppercase tracking-wide text-bloom-ink/50">
            Total
          </p>
          <p className="font-display text-2xl text-brand-pink">
            {total}
            <span className="text-base text-bloom-ink/40"> / {MAX_FLOWERS}</span>
          </p>
        </div>
      </div>

      {!canContinue ? (
        <p className="mb-4 text-sm text-bloom-ink/60">
          Add at least {MIN_FLOWERS} flowers to continue.
        </p>
      ) : (
        <p className="mb-4 text-sm text-bloom-ink/70">
          <span className="font-medium text-bloom-ink">
            {total} {total === 1 ? 'flower' : 'flowers'} chosen
          </span>
          <span className="mx-2 text-bloom-rose/40">·</span>
          <span className="italic">{getFlowerCountMeaning(total)}</span>
        </p>
      )}

      <div className="grid grid-cols-2 gap-3 md:grid-cols-4">
        {FLOWERS.map((flower, index) => {
          const qty = getFlowerQuantity(selected, flower.id)
          const isActive = qty > 0

          return (
            <article
              key={flower.id}
              data-testid={`flower-card-${flower.id}`}
              className={`flex flex-col overflow-hidden rounded-2xl border-2 transition ${
                isActive
                  ? 'border-brand-pink/50 bg-brand-pink/[0.06] shadow-md shadow-brand-pink/10'
                  : 'border-bloom-rose/15 bg-white shadow-sm'
              }`}
            >
              <button
                type="button"
                data-testid={`flower-image-${flower.id}`}
                onClick={() => setDetailFlower(flower)}
                className="group relative w-full text-left"
              >
                <FlowerArtwork
                  src={flower.image}
                  alt={flower.name}
                  loading={index < 4 ? 'eager' : 'lazy'}
                  imageClassName="object-contain p-3 transition duration-300 group-hover:scale-[1.03]"
                />
                <span className="absolute top-2 right-2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold tracking-normal text-brand-pink shadow-sm opacity-95 transition group-hover:opacity-100 md:text-xs">
                  ✨ Tap to learn
                </span>
              </button>

              <div className="flex flex-col gap-2 p-2.5">
                <h3 className="text-center font-display text-base text-bloom-ink">
                  {flower.name}
                </h3>
                <div className="flex items-center justify-center gap-2">
                  <QuantityButton
                    label="decrease"
                    disabled={qty === 0}
                    onClick={() => onAdjustQuantity(flower.id, -1)}
                  />
                  <span
                    data-testid={`flower-qty-${flower.id}`}
                    className="min-w-8 text-center font-display text-xl text-bloom-ink"
                  >
                    {qty}
                  </span>
                  <QuantityButton
                    label="increase"
                    onClick={() => handleIncrease(flower.id)}
                  />
                </div>
              </div>
            </article>
          )
        })}
      </div>

      <p className="mt-8 text-center text-xs leading-relaxed text-bloom-ink/55">
        These blooms are here to charm people, not train somebody&apos;s AI cousin
        or become stock photos on a random website. The flower, petal, foliage,
        and bouquet visuals belong to Bloom, so please don&apos;t download,
        redistribute, or reuse them outside the app without permission. See the{' '}
        <a href="/privacy" className="underline hover:text-bloom-ink">
          Privacy Policy
        </a>{' '}
        or email{' '}
        <a
          href={`mailto:${SUPPORT_EMAIL}`}
          className="underline hover:text-bloom-ink"
        >
          {SUPPORT_EMAIL}
        </a>{' '}
        if you need to use them properly.
      </p>

      <FlowerDetailModal
        flower={detailFlower}
        quantity={detailQuantity}
        open={detailFlower !== null}
        onClose={() => setDetailFlower(null)}
      />
    </div>
  )
}
