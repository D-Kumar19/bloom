export default function PrivacyPage() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-16">
      <h1 className="font-display text-3xl text-bloom-ink">Privacy</h1>
      <p className="mt-4 text-bloom-ink/70">
        Bloom does not store your bouquet data on any server. Your bouquet state is
        encoded in the share link URL. When someone opens the link, the bouquet is
        decoded in their browser.
      </p>
    </main>
  )
}
