'use client'

import { BackdropLayer } from '@/components/backdrop/BackdropLayer'

type RevealStageBackdropProps = {
  themeId: string
  muted?: boolean
  className?: string
  children: React.ReactNode
  'data-testid'?: string
}

export function RevealStageBackdrop({
  themeId,
  muted = false,
  className = '',
  children,
  'data-testid': dataTestId,
}: RevealStageBackdropProps) {
  return (
    <BackdropLayer
      theme={themeId}
      variant={muted ? 'muted' : 'full'}
      className={`rounded-3xl p-6 md:p-8 ${className}`}
      data-testid={dataTestId}
    >
      {children}
    </BackdropLayer>
  )
}
