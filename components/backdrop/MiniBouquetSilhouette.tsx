type MiniBouquetSilhouetteProps = {
  dark?: boolean
  className?: string
}

export function MiniBouquetSilhouette({
  dark = false,
  className = '',
}: MiniBouquetSilhouetteProps) {
  const fill = dark ? 'rgb(255 255 255 / 0.12)' : 'rgb(42 36 32 / 0.1)'

  return (
    <svg
      viewBox="0 0 120 80"
      className={`pointer-events-none absolute bottom-2 left-1/2 w-[55%] max-w-[7rem] -translate-x-1/2 ${className}`}
      aria-hidden
    >
      <ellipse cx="60" cy="68" rx="22" ry="6" fill={fill} />
      <path
        d="M48 68 C48 50 52 28 60 18 C68 28 72 50 72 68 Z"
        fill={fill}
      />
      <circle cx="48" cy="32" r="8" fill={fill} />
      <circle cx="72" cy="30" r="7" fill={fill} />
      <circle cx="60" cy="24" r="9" fill={fill} />
      <circle cx="54" cy="40" r="6" fill={fill} />
      <circle cx="68" cy="38" r="6.5" fill={fill} />
    </svg>
  )
}
