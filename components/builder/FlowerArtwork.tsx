import Image from 'next/image'

type FlowerArtworkProps = {
  src: string
  alt: string
  className?: string
  imageClassName?: string
  loading?: 'eager' | 'lazy'
}

/** Shared flower image rendering so cards and detail modal show the same asset. */
export function FlowerArtwork({
  src,
  alt,
  className = '',
  imageClassName = 'object-contain p-3',
  loading = 'lazy',
}: FlowerArtworkProps) {
  return (
    <div
      className={`relative aspect-square w-full overflow-hidden bg-gradient-to-b from-bloom-cream to-white ${className}`}
    >
      <Image
        src={src}
        alt={alt}
        fill
        unoptimized
        loading={loading}
        sizes="(max-width: 768px) 50vw, 320px"
        className={imageClassName}
      />
    </div>
  )
}
