export function getBouquetRevealTitle(from: string): string {
  const sender = from.trim()
  if (sender) {
    return `${sender} sent you a bouquet`
  }
  return 'Someone sent you a bouquet'
}

/** Browser tab title when a recipient opens the bouquet link. Uses the sender's `from` name. */
export function getBouquetDocumentTitle(from: string): string {
  const sender = from.trim()
  if (sender) {
    return `${sender} left something for you`
  }
  return 'Someone left something for you'
}

export function formatBouquetDocumentTitle(from: string, siteName = 'Bloom'): string {
  return `${getBouquetDocumentTitle(from)} | ${siteName}`
}

export function getBouquetTeaserLine(from: string): string {
  const sender = from.trim()
  if (sender) {
    return `${sender} left this for you`
  }
  return 'Someone left this for you'
}
