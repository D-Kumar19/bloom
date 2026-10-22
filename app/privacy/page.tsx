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
        <p>Bloom also stores your appearance preference and up to 500 recently counted gift
          IDs in local storage, and uses session storage for preview return state. The counter does not
          require a tracking cookie. If storage is blocked, draft recovery may not work.</p>
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-2xl">The shared counter and downloads</h2>
        <p>The first successful copy of a bouquet&apos;s link or message attempts to record
          one bouquet prepared to share. Repeated copies, edits, and retries keep the same
          random gift ID and do not add another count. Starting a new bouquet gives it a new
          ID. This does not prove that a recipient received or opened the gift.</p>
        <p>The counting request includes only that ID, not your note or names. Redis retains
          an aggregate total and a permanent counted-ID marker to prevent duplicate increments.
          Historical totals are preserved and were collected under earlier counting rules.</p>
        <p>To limit abuse, the server derives a keyed hash from the client IP supplied by
          Vercel. Redis stores short-lived quota keys based on that hash, not the raw IP:
          10 valid counting requests per fixed minute and 50 per fixed hour, including
          duplicates. People on a shared network share these limits. Quota keys expire at
          their window boundary. Hosting providers may separately retain IPs in logs.
          A failed or limited count does not stop you copying or opening a gift.</p>
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
