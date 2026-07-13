'use client'

import { useState } from 'react'

import { FlowerArtwork } from '@/components/builder/FlowerArtwork'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import { GREENERY } from '@/lib/flowers'
import { SUPPORT_EMAIL } from '@/lib/site'
import type { Greenery } from '@/lib/types'

type GreeneryPickerProps = {
  selectedId: string
  onSelect: (id: string) => void
}

function GreeneryDetailModal({
  item,
  isSelected,
  open,
  onClose,
  onSelect,
}: {
  item: Greenery | null
  isSelected: boolean
  open: boolean
  onClose: () => void
  onSelect: (id: string) => void
}) {
  if (!item) {
    return null
  }

  const handleSelect = () => {
    onSelect(item.id)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={item.name}>
      <FlowerArtwork
        src={item.image}
        alt={item.name}
        className="mx-auto mb-4 max-w-xs rounded-2xl"
      />
      <p className="text-sm italic leading-relaxed text-bloom-ink/80">{item.meaning}</p>
      <p className="mt-4 text-sm leading-relaxed text-bloom-ink/70">
        <span className="font-medium text-bloom-ink">Did you know?</span> {item.fact}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-bloom-ink/70">
        <span className="font-medium text-bloom-ink">Perfect for:</span> {item.perfectFor}
      </p>
      {isSelected ? (
        <p className="mt-5 border-t border-bloom-rose/15 pt-4 text-center text-sm text-bloom-ink/70">
          ✓ Selected for your bouquet
        </p>
      ) : (
        <Button
          data-testid="greenery-modal-select"
          className="mt-5 w-full"
          onClick={handleSelect}
        >
          Use this foliage
        </Button>
      )}
    </Modal>
  )
}

export function GreeneryPicker({ selectedId, onSelect }: GreeneryPickerProps) {
  const [detailItem, setDetailItem] = useState<Greenery | null>(null)

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-5">
        <h2 className="font-display text-2xl text-bloom-ink md:text-3xl">Choose your foliage</h2>
        <p className="mt-1 text-sm text-bloom-ink/60">
          Tap an image to learn more, then hit Select on your favorite backdrop.
        </p>
      </div>

      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        {GREENERY.map((item, index) => {
          const isActive = selectedId === item.id

          return (
            <article
              key={item.id}
              data-testid={`greenery-card-${item.id}`}
              className={`flex flex-col overflow-hidden rounded-2xl border-2 transition ${
                isActive
                  ? 'border-brand-pink/50 bg-brand-pink/[0.06] shadow-md shadow-brand-pink/10'
                  : 'border-bloom-rose/15 bg-white shadow-sm'
              }`}
            >
              <button
                type="button"
                data-testid={`greenery-image-${item.id}`}
                onClick={() => setDetailItem(item)}
                className="group relative w-full text-left"
              >
                <FlowerArtwork
                  src={item.image}
                  alt={item.name}
                  loading={index < 3 ? 'eager' : 'lazy'}
                  imageClassName="object-contain p-3 transition duration-300 group-hover:scale-[1.03]"
                />
                <span className="absolute top-2 right-2 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold tracking-normal text-brand-pink shadow-sm opacity-95 transition group-hover:opacity-100 md:text-xs">
                  ✨ Tap to learn
                </span>
              </button>

              <div className="flex flex-col gap-2 p-2.5">
                <h3 className="text-center font-display text-base text-bloom-ink">{item.name}</h3>
                <button
                  type="button"
                  data-testid={`greenery-select-${item.id}`}
                  aria-pressed={isActive}
                  onClick={() => onSelect(item.id)}
                  className={`mx-auto min-h-8 rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? 'bg-brand-pink text-white shadow-sm shadow-brand-pink/25'
                      : 'border border-bloom-rose/25 bg-white text-bloom-ink hover:border-brand-pink hover:bg-brand-pink/5'
                  }`}
                >
                  {isActive ? '✓ Selected' : 'Select'}
                </button>
              </div>
            </article>
          )
        })}
      </div>

      <p className="mt-8 text-center text-xs leading-relaxed text-bloom-ink/55">
        These blooms are here to charm people, not train somebody&apos;s AI cousin or become stock
        photos on a random website. The flower, petal, foliage, and bouquet visuals belong to
        Bloom, so please don&apos;t download, redistribute, or reuse them outside the app without
        permission. See the{' '}
        <a href="/privacy" className="underline hover:text-bloom-ink">
          Privacy Policy
        </a>{' '}
        or email{' '}
        <a href={`mailto:${SUPPORT_EMAIL}`} className="underline hover:text-bloom-ink">
          {SUPPORT_EMAIL}
        </a>{' '}
        if you need to use them properly.
      </p>

      <GreeneryDetailModal
        item={detailItem}
        isSelected={detailItem?.id === selectedId}
        open={detailItem !== null}
        onClose={() => setDetailItem(null)}
        onSelect={onSelect}
      />
    </div>
  )
}
