import { BouquetHero } from '@/components/bouquet/BouquetHero'
import { MessageCard } from '@/components/cards/MessageCard'
import { shouldShowNoteCard } from '@/lib/message'
import type { BouquetState } from '@/lib/types'

type GiftCompositionProps = {
  bouquet: BouquetState
  showNote?: boolean
  folded?: boolean
}

export function GiftComposition({ bouquet, showNote = true, folded = false }: GiftCompositionProps) {
  const hasNote = showNote && shouldShowNoteCard(bouquet.message)

  return (
    <div
      data-testid="gift-composition"
      className={`gift-composition ${hasNote ? 'gift-composition--paired' : ''}`}
    >
      <figure className="gift-composition__flowers">
        <BouquetHero
          bouquetId={bouquet.bouquetId}
          theme={bouquet.theme}
          showBackdrop={false}
          presentation="flat"
        />
      </figure>
      {hasNote ? (
        <div className="gift-composition__note">
          <MessageCard
            styleId={bouquet.cardStyle}
            to={bouquet.to}
            from={bouquet.from}
            message={bouquet.message}
            messageFormat={bouquet.messageFormat}
            noteBorder={bouquet.noteBorder}
            folded={folded}
          />
        </div>
      ) : null}
    </div>
  )
}
