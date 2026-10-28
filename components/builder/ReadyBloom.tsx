/** One-time, decorative "your bouquet is ready" moment for the share step. */
export function ReadyBloom() {
  return (
    <div
      aria-hidden="true"
      data-testid="ready-bloom"
      className="pointer-events-none mx-auto mb-3 flex flex-col items-center"
    >
      <span className="relative flex h-16 w-16 items-center justify-center">
        <span className="ready-bloom-glow absolute inset-0 rounded-full bg-bloom-rose/25" />
        <span className="ready-bloom-glow ready-bloom-glow-late absolute inset-0 rounded-full bg-bloom-rose/20" />
        <svg
          viewBox="0 0 64 64"
          className="ready-bloom-bud relative h-14 w-14 drop-shadow-sm"
          fill="none"
        >
          <circle cx="32" cy="32" r="30" fill="#fbf7f2" />
          <path d="M32 10C26 18 20 25 20 33a12 12 0 0 0 24 0c0-8-6-15-12-23Z" fill="#b85c63" />
          <path
            d="M22 38c6-3 9-9 9-16M42 38c-6-3-9-9-9-16"
            stroke="#9a4a50"
            strokeWidth="2"
            strokeLinecap="round"
          />
          <path d="M32 45v10" stroke="#607852" strokeWidth="3" strokeLinecap="round" />
          <path d="M32 52c-7 0-11-3-12-8 7-1 11 2 12 8Z" fill="#607852" />
        </svg>
      </span>
      <span className="ready-bloom-line mt-2 text-xs font-medium uppercase tracking-[0.2em] text-bloom-ink/70">
        Your bouquet is ready
      </span>
    </div>
  )
}
