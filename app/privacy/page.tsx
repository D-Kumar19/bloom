import Link from 'next/link'
import { CONTACT_MAILTO, CONTACT_NAME } from '@/lib/site'
import { publicPageMetadata } from '@/lib/pageMetadata'

export const metadata = publicPageMetadata({
  title: 'Privacy',
  description:
    'What Bloom gift links contain, who can open them, and how local drafts and the shared counter work.',
  path: '/privacy',
})

export default function PrivacyPage() {
  return (
    <main className="mx-auto w-full max-w-2xl space-y-8 px-6 py-12 leading-relaxed text-bloom-ink md:py-16">
      <header className="space-y-3">
        <p className="text-sm font-medium text-bloom-ink/70">Before you send a little joy</p>
        <h1 className="font-display text-4xl">Your gift and your privacy</h1>
        <p>No account needed does not mean a gift link is private.
          Here is what to know before you share.</p>
      </header>
      <section className="space-y-3 rounded-3xl border border-bloom-rose/20 bg-surface-muted p-6">
        <h2 className="font-display text-2xl"><span aria-hidden="true">🌿 </span>The short version</h2>
        <ul className="list-disc space-y-3 pl-5">
          <li><strong>Treat the link like the gift itself.</strong> Anyone who has it can read the note.</li>
          <li><strong>Your draft stays in this browser.</strong> It can be recovered for 24 hours after your last edit,
            unless browser storage is cleared or unavailable.</li>
          <li><strong>The counter is not a read receipt.</strong> It records eligible copies, not recipient views.</li>
          <li><strong>Keep sensitive information out.</strong> You cannot revoke or password-protect a gift link.</li>
        </ul>
        <p className="text-sm text-bloom-ink/70">The details below explain what is stored and what hosting services may see.</p>
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-2xl"><span aria-hidden="true">🔗 </span>Who can read my gift?</h2>
        <p>Your bouquet selections, names, and note are compressed into the gift URL.
          Compression is not encryption. The link has no password, expiry, or revocation
          control. Avoid sensitive personal information; a forwarded link reveals the gift too.</p>
        <p>Bloom uses no account or per-gift database to retrieve your gift. That does not
          mean its contents never reach a server: current links use a query parameter sent
          to the hosting service. Hosting logs, browser history, clipboard apps, and messaging
          services may retain links. HTTPS protects transport, not everyone who receives the URL.</p>
        <p>Bloom never sends email for you. Send by email opens your own mail app;
          the Gmail and Outlook options open that provider&apos;s compose page with the
          message and gift link already in the address, so that provider receives them.</p>
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-2xl"><span aria-hidden="true">📝 </span>What happens to my draft?</h2>
        <p>The builder stores the latest draft and step in local storage for 24 hours from
          the last edit. Confirming a new bouquet replaces the old draft; choosing
          Keep my draft leaves it unchanged. Expired drafts are
          removed when you next open the builder, not by a background timer.
          Shared-device users may be able to read local drafts. Clearing site data removes them.</p>
        <p>Bloom also stores your appearance preference and up to 500 recently counted gift
          IDs in local storage, and uses session storage for preview return state. The counter does not
          require a tracking cookie. If storage is blocked, draft recovery may not work.</p>
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-2xl"><span aria-hidden="true">🌸 </span>What does the bouquet counter know?</h2>
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
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-2xl"><span aria-hidden="true">🖼️ </span>What about images and sound?</h2>
        <p>Saved images are generated in your browser; Bloom does not upload the resulting
          image to a gift database. Bouquet images, fonts, and audio are requested from the site.
          Hosting providers still process ordinary request information such as IP addresses.</p>
      </section>
      <section className="space-y-2">
        <h2 className="font-display text-2xl"><span aria-hidden="true">🔎 </span>Can my note show up in search or previews?</h2>
        <p>Gift pages ask search engines not to index them and use generic social previews
          without names or note text. Pages request no referrer when navigating away.
          These are precautions, not access controls or guarantees that third parties erase links.</p>
      </section>
      <section className="space-y-3 rounded-3xl border border-bloom-rose/20 bg-surface-muted p-6">
        <h2 className="font-display text-2xl">Still unsure about sharing?</h2>
        <p>Privacy question? Contact{' '}
        <a href={CONTACT_MAILTO} className="underline">{CONTACT_NAME}</a>.
        {' '}Please avoid including private gift links or personal notes.
        This notice describes the current pre-release; review it again before sharing
        after future feature changes.</p>
      </section>
      <Link href="/" className="underline">Back to Bloom</Link>
    </main>
  )
}
