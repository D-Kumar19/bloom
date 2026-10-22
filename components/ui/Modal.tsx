'use client'

import { useEffect, useId, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'

type ModalProps = {
  open: boolean
  onClose: () => void
  onBackdropClick?: () => void
  title: string
  children: ReactNode
}

export function Modal({ open, onClose, onBackdropClick, title, children }: ModalProps) {
  const titleId = useId()
  const portalRef = useRef<HTMLDivElement>(null)
  const dialogRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef(onClose)
  useEffect(() => { closeRef.current = onClose }, [onClose])
  useEffect(() => {
    const portal = portalRef.current
    const dialog = dialogRef.current
    if (!open || !portal || !dialog) return
    const previousFocus = document.activeElement
    const previousOverflow = document.body.style.overflow
    const siblings = Array.from(document.body.children)
      .filter((node): node is HTMLElement => node instanceof HTMLElement && node !== portal)
    const previousInert = siblings.map(node => node.inert)
    siblings.forEach(node => { node.inert = true })
    document.body.style.overflow = 'hidden'
    const focusable = () => Array.from(dialog.querySelectorAll<HTMLElement>(
      'a[href],button:not([disabled]),input:not([disabled]),select:not([disabled]),textarea:not([disabled]),[tabindex]:not([tabindex="-1"])',
    )).filter(node => !node.hidden && !node.closest('[hidden], [inert]') && getComputedStyle(node).display !== 'none')
    ;(focusable()[0] ?? dialog).focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (portal.inert) return
      if (event.key === 'Escape') {
        event.preventDefault()
        event.stopPropagation()
        closeRef.current()
      }
      if (event.key === 'Tab') {
        const controls = focusable()
        const first = controls[0] ?? dialog
        const last = controls.at(-1) ?? dialog
        if (!controls.length || !dialog.contains(document.activeElement) ||
          (!event.shiftKey && document.activeElement === last) ||
          (event.shiftKey && (document.activeElement === first || document.activeElement === dialog))) {
          event.preventDefault()
          ;(event.shiftKey ? last : first).focus()
        }
      }
    }
    const onFocus = (event: FocusEvent) => {
      if (!portal.inert && event.target instanceof Node && !dialog.contains(event.target)) {
        ;(focusable()[0] ?? dialog).focus()
      }
    }
    document.addEventListener('keydown', onKeyDown)
    document.addEventListener('focusin', onFocus)
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.removeEventListener('focusin', onFocus)
      siblings.forEach((node, index) => { node.inert = previousInert[index] })
      document.body.style.overflow = previousOverflow
      if (previousFocus instanceof HTMLElement && previousFocus.isConnected) previousFocus.focus()
    }
  }, [open])

  if (!open) {
    return null
  }

  const handleBackdropClick = onBackdropClick ?? onClose

  return createPortal(
    <div ref={portalRef} className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain">
      <button
        type="button"
        className="fixed inset-0 bg-bloom-ink/40 backdrop-blur-sm"
        aria-label="Close dialog"
        tabIndex={-1}
        onClick={handleBackdropClick}
      />
      <div className="flex min-h-full justify-center p-4 sm:items-center">
        <div
          className="relative z-10 my-4 w-full max-w-lg rounded-3xl bg-bloom-cream p-6 shadow-xl sm:my-8"
          role="dialog"
          ref={dialogRef}
          tabIndex={-1}
          aria-modal="true"
          aria-labelledby={titleId}
          onClick={(event) => event.stopPropagation()}
          onMouseDown={(event) => event.stopPropagation()}
        >
        <div className="mb-4 flex items-center justify-between gap-4">
          <h2 id={titleId} className="font-display text-2xl text-bloom-ink">
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
