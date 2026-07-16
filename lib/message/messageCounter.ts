const TIGHT_THRESHOLD = 10

/** Warmer word counter copy for the message step. */
export function formatWordsLeft(wordsLeft: number): string {
  if (wordsLeft <= TIGHT_THRESHOLD) {
    const unit = wordsLeft === 1 ? 'word' : 'words'
    return `${wordsLeft} ${unit} left`
  }

  return `${wordsLeft} words of love left`
}
