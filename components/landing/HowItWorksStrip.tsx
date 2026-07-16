export function HowItWorksStrip() {
  const steps = [
    { icon: '🌸', title: 'Pick a bouquet', text: 'Choose from curated arrangements.' },
    { icon: '✉️', title: 'Write your note', text: 'Words on stationery you chose.' },
    { icon: '🔗', title: 'Share the link', text: 'Private. Instant. Yours to send.' },
  ]

  return (
    <section className="bg-surface-muted px-4 py-12 md:py-14">
      <div className="mx-auto max-w-4xl">
        <h2 className="text-center font-display text-2xl text-bloom-ink">How it works</h2>
        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {steps.map((step) => (
            <div key={step.title} className="text-center">
              <span className="text-2xl" aria-hidden>
                {step.icon}
              </span>
              <h3 className="mt-2 text-sm font-semibold text-bloom-ink">{step.title}</h3>
              <p className="mt-1 text-xs text-bloom-ink/65">{step.text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
