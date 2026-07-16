export function getBouquetRevealTitle(from: string): string {
  const sender = from.trim()
  if (sender) {
    return `${sender} sent you a bouquet`
  }
  return 'Someone sent you a bouquet'
}

export function getBouquetTeaserLine(from: string): string {
  const sender = from.trim()
  if (sender) {
    return `${sender} left this for you`
  }
  return 'Someone left this for you'
}
