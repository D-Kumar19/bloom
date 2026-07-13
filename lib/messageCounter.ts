const TIGHT_THRESHOLD = 15

/** Warmer character counter copy for the message step. */
export function formatCharactersLeft(charsLeft: number): string {
  if (charsLeft <= TIGHT_THRESHOLD) {
    const unit = charsLeft === 1 ? 'character' : 'characters'
    return `${charsLeft} ${unit} left`
  }

  return `${charsLeft} characters of love left`
}
