import Link from 'next/link'

export function Footer() {
  return (
    <footer className="mt-auto border-t border-bloom-rose/15 bg-white/60 px-4 py-8">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-4 text-center text-sm text-bloom-ink/70 md:flex-row md:justify-between md:text-left">
        <p>Made with care by Bloom</p>
        <p>Free to create and share. No account needed.</p>
        <nav className="flex gap-4">
          <Link href="/about" className="hover:text-bloom-ink">
            About
          </Link>
          <Link href="/privacy" className="hover:text-bloom-ink">
            Privacy
          </Link>
          <Link href="/contact" className="hover:text-bloom-ink">
            Contact
          </Link>
        </nav>
      </div>
    </footer>
  )
}
