import Link from 'next/link'

export const metadata = {
  title: 'Privacy',
  description: 'What Bloom gift links contain, who can open them, and how local drafts and the shared counter work.',
}

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-2xl space-y-6 px-6 py-16 text-bloom-ink">
      <h1 className="font-display text-4xl">Your gift and your privacy</h1>
      <section className="space-y-2">
        <h2 className="font-display text-2xl">Anyone with the link can open it</h2>
        <p>Your bouquet selections, names, and note are compressed into the gift URL.
          Compression is not encryption. The link has no password, expiry, or revocation
          control. Avoid sensitive personal information; a forwarded link reveals the gift too.</p>
        <p>Bloom uses no account or per-gift database to retrieve your gift. That does not
          mean its contents never reach a server: current links use a query parameter sent
          to the hosting service. Hosting logs, browser history, clipboard apps, and messaging
          services may retain links. HTTPS protects transport, not everyone who receives the URL.</p>
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-2xl">Drafts stay in this browser</h2>
        <p>The builder stores the latest draft and step in local storage for 24 hours from
          the last edit. Starting a new bouquet removes that draft. Expired drafts are
          removed when you next open the builder, not by a background timer.
          Shared-device users may be able to read local drafts. Clearing site data removes them.</p>
        <p>Bloom also stores your appearance preference and uses session storage to remember
          copied-gift fingerprints and preview return state. The current counter does not
          require a tracking cookie. If storage is blocked, draft recovery may not work.</p>
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-2xl">The shared counter and downloads</h2>
        <p>Copying a gift link attempts to increment an aggregate counter stored in Redis
          when configured. That request does not include your note or names. It does not prove
          that a recipient received or opened a gift. Deduplication is best-effort within
          your browser session, not an exact delivery measurement.</p>
        <p>Saved images are generated in your browser; Bloom does not upload the resulting
          image to a gift database. Bouquet images, fonts, and audio are requested from the site.
          Hosting providers still process ordinary request information such as IP addresses.</p>
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-2xl">Search and social previews</h2>
        <p>Gift pages ask search engines not to index them and use generic social previews
          without names or note text. Pages request no referrer when navigating away.
          These are precautions, not access controls or guarantees that third parties erase links.</p>
      </section>
      <p>A public contact channel is not available yet. This notice describes the current
        pre-release; review it again before sharing after future feature changes.</p>
      <Link href="/" className="underline">Back to Bloom</Link>
    </main>
  )
}
