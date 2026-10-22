'use client'

import Image from 'next/image'
import { useMemo, useState } from 'react'

import { BouquetHero } from '@/components/bouquet/BouquetHero'
import { Button } from '@/components/ui/Button'
import { Modal } from '@/components/ui/Modal'
import {
  BOUQUET_MOODS,
  getBouquetById,
  getBouquetsByMood,
  type Bouquet,
  type BouquetMood,
} from '@/lib/bouquets'

type BouquetGalleryPickerProps = {
  selectedId: string
  onSelect: (bouquetId: string) => void
}

function BouquetDetailModal({
  bouquet,
  isSelected,
  open,
  onClose,
  onSelect,
}: {
  bouquet: Bouquet | null
  isSelected: boolean
  open: boolean
  onClose: () => void
  onSelect: (id: string) => void
}) {
  if (!bouquet) {
    return null
  }

  const moodLabel =
    BOUQUET_MOODS.find((mood) => mood.id === bouquet.mood)?.label ?? bouquet.mood

  const handleSelect = () => {
    onSelect(bouquet.id)
    onClose()
  }

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={bouquet.name}
    >
      <div className="mx-auto mb-4 w-full max-w-xs">
        <BouquetHero
          bouquetId={bouquet.id}
          theme="warm"
          showBackdrop={false}
          presentation="flat"
        />
      </div>
      <p className="text-sm font-medium text-bloom-ink/80">{bouquet.tagline}</p>
      <p className="mt-4 text-sm leading-relaxed text-bloom-ink/70">{bouquet.description}</p>
      <p className="mt-4 text-sm italic leading-relaxed text-bloom-ink/75">{bouquet.meaning}</p>
      <div className="mt-4 text-sm leading-relaxed text-bloom-ink/70">
        <p className="font-medium text-bloom-ink">In the bouquet:</p>
        <ul className="mt-2 list-disc space-y-1.5 pl-5">
          {bouquet.facts.map((fact) => (
            <li key={fact}>{fact}</li>
          ))}
        </ul>
      </div>
      <p className="mt-4 text-sm leading-relaxed text-bloom-ink/70">
        <span className="font-medium text-bloom-ink">Mood:</span> {moodLabel}
      </p>
      <p className="mt-4 text-sm leading-relaxed text-bloom-ink/70">
        <span className="font-medium text-bloom-ink">Perfect for:</span> {bouquet.perfectFor}
      </p>
      {isSelected ? (
        <p className="mt-5 border-t border-bloom-rose/15 pt-4 text-center text-sm text-bloom-ink/70">
          Selected for your bouquet
        </p>
      ) : (
        <Button
          data-testid="bouquet-modal-select"
          className="mt-5 w-full"
          onClick={handleSelect}
        >
          Choose this bouquet
        </Button>
      )}
    </Modal>
  )
}

export function BouquetGalleryPicker({ selectedId, onSelect }: BouquetGalleryPickerProps) {
  const [activeMood, setActiveMood] = useState<BouquetMood>('romantic')
  const [detailBouquet, setDetailBouquet] = useState<Bouquet | null>(null)

  const closeDetail = () => setDetailBouquet(null)

  const visibleBouquets = useMemo(
    () => getBouquetsByMood(activeMood),
    [activeMood],
  )

  const selectedBouquet = getBouquetById(selectedId)
  const selectedInActiveMood =
    selectedBouquet?.mood === activeMood ? selectedBouquet : null

  return (
    <div className="mx-auto w-full max-w-6xl">
      <div className="mb-5">
        <h2 className="font-display text-2xl text-bloom-ink md:text-3xl">
          Pick your bouquet
        </h2>
        <p className="mt-1 text-sm text-bloom-ink/60">
          Browse by mood, tap to learn more, then choose the one that fits.
        </p>
      </div>

      {selectedInActiveMood ? (
        <p
          className="mb-4 text-sm text-bloom-ink/70"
          data-testid="bouquet-selected-summary"
        >
          <span className="font-medium text-bloom-ink">{selectedInActiveMood.name}</span>
          <span className="mx-2 text-bloom-rose/40">·</span>
          <span className="italic">{selectedInActiveMood.tagline}</span>
        </p>
      ) : null}

      <div
        className="mb-4 flex flex-wrap gap-2"
        role="tablist"
        aria-label="Bouquet moods"
      >
        {BOUQUET_MOODS.map((mood) => {
          const isActive = activeMood === mood.id
          return (
            <button
              key={mood.id}
              type="button"
              role="tab"
              aria-selected={isActive}
              data-testid={`bouquet-mood-${mood.id}`}
              onClick={() => setActiveMood(mood.id)}
              className={`min-h-11 border px-4 py-2 text-sm font-medium transition ${
                isActive
                  ? 'bg-brand-pink text-white shadow-sm'
                  : 'border border-bloom-rose/20 bg-surface text-bloom-ink/75 hover:border-brand-pink/40'
              }`}
            >
              {mood.label}
            </button>
          )
        })}
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
        {visibleBouquets.map((bouquet, index) => {
          const isActive = selectedId === bouquet.id

          return (
            <article
              key={bouquet.id}
              data-testid={`bouquet-tile-${bouquet.id}`}
              className={`bloom-bouquet-tile flex flex-col overflow-hidden border-2 transition ${
                isActive
                  ? 'border-brand-pink/50 bg-brand-pink/[0.06] shadow-md shadow-brand-pink/10'
                  : 'border-bloom-rose/15 bg-surface shadow-sm'
              }`}
            >
              <button
                type="button"
                data-testid={`bouquet-image-${bouquet.id}`}
                onClick={() => setDetailBouquet(bouquet)}
                className="bloom-artwork group relative w-full text-left"
              >
                <span className="relative block aspect-[2/3] w-full">
                  <Image
                    src={bouquet.heroImage}
                    alt={bouquet.name}
                    fill
                    loading={index < 4 ? 'eager' : 'lazy'}
                    sizes="(max-width: 640px) 50vw, (max-width: 1100px) 33vw, 320px"
                    className="object-contain"
                  />
                </span>
                <span className="mt-2 block text-center text-xs font-medium text-[#512141] underline underline-offset-4">
                  Tap to learn
                </span>
              </button>

              <div className="flex flex-col gap-2 p-2.5">
                <h3 className="text-center font-display text-base text-bloom-ink">
                  {bouquet.name}
                </h3>
                <button
                  type="button"
                  data-testid={`bouquet-select-${bouquet.id}`}
                  aria-pressed={isActive}
                  onClick={() => onSelect(bouquet.id)}
                  className={`mx-auto min-h-11 w-full px-4 py-1.5 text-sm font-semibold transition ${
                    isActive
                      ? 'bg-brand-pink text-white'
                      : 'border border-bloom-rose/25 bg-surface text-bloom-ink hover:border-brand-pink/40'
                  }`}
                >
                  {isActive ? 'Selected' : 'Select'}
                </button>
              </div>
            </article>
          )
        })}
      </div>

      <BouquetDetailModal
        bouquet={detailBouquet}
        isSelected={detailBouquet?.id === selectedId}
        open={detailBouquet !== null}
        onClose={closeDetail}
        onSelect={onSelect}
      />
    </div>
  )
}
