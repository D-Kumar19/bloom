import { DiscoveryPage } from '@/components/discovery/DiscoveryPage'
import { SoundPreviews } from '@/components/discovery/SoundPreviews'

export const metadata = {
  title: 'Ambient sound',
  description: 'Listen to optional Bloom soundtracks, from gentle rain to piano. Silence is always a choice.',
}

export default function AmbientSoundPage() {
  return (
    <DiscoveryPage
      title="A little company. Or quiet."
      introduction="Sound is entirely optional. Tap to listen to one track at a time; nothing plays automatically. These are listening previews, not saved choices. You can add sound later in the builder's Backdrop step, or leave the bouquet silent."
    >
      <p className="mb-6 max-w-2xl text-sm leading-relaxed text-bloom-ink/75">
        Your recipient controls playback and mute. Their browser may need a tap before audio
        starts, so the gift never depends on sound to make sense. Leaving this page stops the preview.
      </p>
      <SoundPreviews />
    </DiscoveryPage>
  )
}
