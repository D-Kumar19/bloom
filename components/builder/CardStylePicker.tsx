'use client'

import { useRef, useState } from 'react'

import { MessageCard } from '@/components/cards/MessageCard'
import { useToast } from '@/components/ui/Toast'
import { compressImageFile } from '@/lib/compressImage'
import {
  CARD_STYLES,
  FEATURED_CARD_STYLE,
  GRID_CARD_STYLES,
  PHOTO_CARD_ID,
  PHOTO_CARD_STYLE,
  SURPRISE_CARD_IDS,
} from '@/lib/cards'
import { SUPPORT_EMAIL } from '@/lib/site'

type CardStylePickerProps = {
  selectedId: string
  photoCardImage?: string
  onSelect: (id: string) => void
  onPhotoCardImageChange: (dataUrl: string | undefined) => void
}

const PREVIEW_TO = 'You'
const PREVIEW_MESSAGE = 'Your message...'

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => {
    window.setTimeout(resolve, ms)
  })
}

function pickRandomSurpriseIds(): string[] {
  const pool = [...SURPRISE_CARD_IDS]
  const sequence: string[] = []
  while (sequence.length < 4 && pool.length > 0) {
    const index = Math.floor(Math.random() * pool.length)
    sequence.push(pool.splice(index, 1)[0])
  }
  return sequence
}

type CardOptionProps = {
  styleId: string
  name: string
  tagline: string
  isActive: boolean
  surprising: boolean
  isSurpriseHighlight: boolean
  photoCardImage?: string
  onSelect: () => void
  onPhotoUploadClick?: () => void
  badge?: string
  className?: string
}

function CardOption({
  styleId,
  name,
  tagline,
  isActive,
  surprising,
  isSurpriseHighlight,
  photoCardImage,
  onSelect,
  onPhotoUploadClick,
  badge,
  className = '',
}: CardOptionProps) {
  return (
    <article
      data-testid={`card-${styleId}`}
      aria-pressed={isActive}
      onClick={() => {
        if (!surprising) {
          onSelect()
        }
      }}
      onKeyDown={(event) => {
        if (!surprising && (event.key === 'Enter' || event.key === ' ')) {
          event.preventDefault()
          onSelect()
        }
      }}
      role="button"
      tabIndex={surprising ? -1 : 0}
      className={`relative rounded-2xl border-2 p-2 text-left transition hover:-translate-y-0.5 hover:shadow-lg ${surprising ? 'cursor-wait opacity-90' : 'cursor-pointer'} ${
        isActive
          ? 'border-brand-pink/50 bg-brand-pink/[0.04] shadow-md shadow-brand-pink/10 ring-2 ring-brand-pink/15'
          : isSurpriseHighlight
            ? 'border-brand-pink/40 bg-brand-pink/[0.08] ring-2 ring-brand-pink/25 animate-card-surprise'
            : 'border-bloom-rose/15 bg-white hover:border-bloom-rose/40'
      } ${className}`}
    >
      {badge ? (
        <span className="absolute top-3 right-3 z-10 rounded-full bg-brand-pink px-2.5 py-0.5 text-[10px] font-semibold text-white shadow-sm">
          {badge}
        </span>
      ) : null}

      {isActive ? (
        <span
          data-testid={`card-check-${styleId}`}
          className="absolute top-3 left-3 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-brand-pink text-xs font-bold text-white shadow-sm"
          aria-hidden
        >
          ✓
        </span>
      ) : null}

      <MessageCard
        styleId={styleId}
        to={PREVIEW_TO}
        message={PREVIEW_MESSAGE}
        from=""
        photoImage={photoCardImage}
        onPhotoUploadClick={onPhotoUploadClick}
        compact
      />
      <p className="mt-2 px-2 text-sm font-medium text-black">{name}</p>
      <p className="px-2 pb-2 text-xs italic text-black">{tagline}</p>
    </article>
  )
}

export function CardStylePicker({
  selectedId,
  photoCardImage,
  onSelect,
  onPhotoCardImageChange,
}: CardStylePickerProps) {
  const { showToast } = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [surprising, setSurprising] = useState(false)
  const [surpriseHighlightId, setSurpriseHighlightId] = useState<string | null>(null)

  const selected = CARD_STYLES.find((style) => style.id === selectedId)

  const openPhotoUpload = () => {
    fileInputRef.current?.click()
  }

  const handlePhotoFile = async (file: File | undefined) => {
    if (!file) {
      return
    }

    try {
      const { dataUrl, warning } = await compressImageFile(file)
      onPhotoCardImageChange(dataUrl)
      onSelect(PHOTO_CARD_ID)
      if (warning) {
        showToast(warning, 'warning')
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Could not upload that photo.'
      showToast(message, 'warning')
    }
  }

  const handleSurpriseMe = async () => {
    if (surprising) {
      return
    }

    setSurprising(true)
    const sequence = pickRandomSurpriseIds()
    const finalId = sequence[sequence.length - 1]

    for (const id of sequence) {
      setSurpriseHighlightId(id)
      await sleep(220)
    }

    onSelect(finalId)
    setSurpriseHighlightId(finalId)
    await sleep(320)
    setSurpriseHighlightId(null)
    setSurprising(false)
  }

  return (
    <div className="mx-auto w-full max-w-6xl">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        data-testid="photo-card-file-input"
        onChange={(event) => {
          const file = event.target.files?.[0]
          void handlePhotoFile(file)
          event.target.value = ''
        }}
      />

      <div className="mb-5">
        <h2 className="font-display text-2xl text-bloom-ink md:text-3xl">Choose your note style</h2>
        <p className="mt-1 text-sm text-black">
          This is the stationery your words will arrive on — tap a style to make it yours.
        </p>
      </div>

      <div className="mb-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          data-testid="surprise-me-button"
          disabled={surprising}
          onClick={() => void handleSurpriseMe()}
          className="rounded-full border border-brand-pink/30 bg-white px-4 py-2 text-sm font-semibold text-brand-pink shadow-sm transition hover:border-brand-pink hover:bg-brand-pink/5 disabled:opacity-60"
        >
          {surprising ? 'Picking...' : '✨ Surprise me'}
        </button>
        <p className="text-xs text-black">Can&apos;t decide? Let Bloom pick for you.</p>
      </div>

      {selected ? (
        <p className="mb-4 text-sm text-black">
          <span className="font-semibold">{selected.name} selected</span>
          <span className="mx-2 text-black/40">·</span>
          <span className="italic">{selected.tagline}</span>
        </p>
      ) : null}

      <div className="mb-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-black">
          Most loved this week
        </p>
        <CardOption
          styleId={FEATURED_CARD_STYLE.id}
          name={FEATURED_CARD_STYLE.name}
          tagline={FEATURED_CARD_STYLE.tagline}
          isActive={selectedId === FEATURED_CARD_STYLE.id}
          surprising={surprising}
          isSurpriseHighlight={surpriseHighlightId === FEATURED_CARD_STYLE.id}
          onSelect={() => onSelect(FEATURED_CARD_STYLE.id)}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {GRID_CARD_STYLES.map((style) => (
          <CardOption
            key={style.id}
            styleId={style.id}
            name={style.name}
            tagline={style.tagline}
            isActive={selectedId === style.id}
            surprising={surprising}
            isSurpriseHighlight={surpriseHighlightId === style.id}
            onSelect={() => onSelect(style.id)}
          />
        ))}
      </div>

      <div className="mt-5">
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-black">
          Newly released
        </p>
        <CardOption
          styleId={PHOTO_CARD_STYLE.id}
          name={PHOTO_CARD_STYLE.name}
          tagline={PHOTO_CARD_STYLE.tagline}
          isActive={selectedId === PHOTO_CARD_STYLE.id}
          surprising={surprising}
          isSurpriseHighlight={surpriseHighlightId === PHOTO_CARD_STYLE.id}
          photoCardImage={photoCardImage}
          onSelect={() => onSelect(PHOTO_CARD_STYLE.id)}
          onPhotoUploadClick={openPhotoUpload}
          badge="Newly released"
        />
      </div>

      {selectedId === PHOTO_CARD_ID && !photoCardImage ? (
        <p className="mt-3 text-center text-xs text-bloom-ink/55">
          Upload a photo to continue with Photo Card.
        </p>
      ) : null}

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
    </div>
  )
}
