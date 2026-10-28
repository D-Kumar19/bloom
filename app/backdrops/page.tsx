import { BackdropPreview } from '@/components/backdrop/BackdropPreview'
import { DiscoveryPage } from '@/components/discovery/DiscoveryPage'
import { THEMES, getThemeMotionDescription, isThemeAnimated } from '@/lib/themes'

export const metadata = {
  title: 'Backdrops',
  description: 'Explore the light, color, and gentle motion behind a Bloom bouquet.',
}

export default function BackdropsPage() {
  return (
    <DiscoveryPage
      title="Set the light around it"
      introduction="A backdrop is the atmosphere behind the gift, not another message to write. Explore warm daylight, quiet color, and evening scenes, then choose the setting in the builder's Backdrop step."
    >
      <p className="mb-6 text-sm text-bloom-ink/75">Some scenes move gently. Your reduced-motion preference is respected.</p>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {THEMES.map((theme) => (
          <article key={theme.id} className="overflow-hidden rounded-3xl border border-bloom-rose/15 bg-surface p-4">
            <BackdropPreview theme={theme} className="h-48" />
            <h2 className="mt-4 font-display text-2xl">{theme.name}</h2>
            <p className="mt-2 text-sm leading-relaxed text-bloom-ink/80">{theme.description}</p>
            <p className="mt-3 text-sm text-bloom-ink/75">
              {isThemeAnimated(theme) ? getThemeMotionDescription(theme) : 'Still light and color, without animated motion.'}
            </p>
          </article>
        ))}
      </div>
    </DiscoveryPage>
  )
}
