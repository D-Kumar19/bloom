import { MessageCard } from '@/components/cards/MessageCard'
import { getBouquetById } from '@/lib/bouquets'
import { shouldShowNoteCard } from '@/lib/message'
import type { BouquetState } from '@/lib/types'

type BouquetExportSnapshotProps = {
  bouquet: BouquetState
}

export function BouquetExportSnapshot({ bouquet }: BouquetExportSnapshotProps) {
  const bouquetMeta = getBouquetById(bouquet.bouquetId)
  const hasNote = shouldShowNoteCard(bouquet.message)

  if (!bouquetMeta) {
    return null
  }

  return (
    <div
      id="bouquet-export-snapshot"
      data-testid="bouquet-export-snapshot"
      aria-hidden
      className="export-static pointer-events-none fixed top-0 -left-[9999px] w-full max-w-md bg-[#fff8f0] p-6"
    >
      <div className="space-y-6">
        <div className="relative mx-auto w-fit -rotate-2 rounded-[1.75rem] bg-white/95 p-2.5 shadow-[0_20px_50px_-12px_rgba(42,36,32,0.35)] ring-1 ring-white/80">
          <div className="relative aspect-[4/5] w-[15.5rem] overflow-hidden rounded-2xl">
            {/* Native img is required for reliable html2canvas export (Next/Image taints the canvas). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={bouquetMeta.heroImage}
              alt={bouquetMeta.name}
              width={248}
              height={310}
              className="h-full w-full object-cover"
            />
          </div>
          <p className="mt-2 text-center font-display text-sm text-[#2a2420]/80">
            {bouquetMeta.name}
          </p>
        </div>

        {hasNote ? (
          <div className="text-center">
            <MessageCard
              styleId={bouquet.cardStyle}
              to={bouquet.to}
              message={bouquet.message}
              from={bouquet.from}
              messageFormat={bouquet.messageFormat}
              noteBorder={bouquet.noteBorder}
            />
          </div>
        ) : null}
      </div>
    </div>
  )
}
