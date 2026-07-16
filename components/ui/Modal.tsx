'use client'

import { useEffect, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type ModalProps = {
  open: boolean
  onClose: () => void
  onBackdropClick?: () => void
  title: string
  children: ReactNode
}

export function Modal({ open, onClose, onBackdropClick, title, children }: ModalProps) {
  useEffect(() => {
    if (!open) {
      return
    }

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])

  useEffect(() => {
    if (!open) {
      return
    }

    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    return () => {
      document.body.style.overflow = previousOverflow
    }
  }, [open])

  if (!open) {
    return null
  }

  const handleBackdropClick = onBackdropClick ?? onClose

  return createPortal(
    <div className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain">
      <button
        type="button"
        className="fixed inset-0 bg-bloom-ink/40 backdrop-blur-sm"
        aria-label="Close dialog"
        onClick={handleBackdropClick}
      />
      <div className="flex min-h-full justify-center p-4 sm:items-center">
        <div
          className="relative z-10 my-4 w-full max-w-lg rounded-3xl bg-bloom-cream p-6 shadow-xl sm:my-8"
          role="dialog"
          aria-modal="true"
          aria-labelledby="modal-title"
          onClick={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
        >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id="modal-title" className="font-display text-2xl text-bloom-ink">
            {title}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-2xl px-3 py-1 text-sm text-bloom-ink/70 hover:bg-bloom-rose/10"
            aria-label="Close modal"
          >
            Close
          </button>
        </div>
        {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}
