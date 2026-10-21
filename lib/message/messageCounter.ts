const TIGHT_THRESHOLD = 10

/** Warmer word counter copy for the message step. */
export function formatWordsLeft(wordsLeft: number): string {
  if (wordsLeft < 0) {
    const count = -wordsLeft
    return `${count} ${count === 1 ? 'word' : 'words'} over the limit`
  }
  if (wordsLeft <= TIGHT_THRESHOLD) {
    const unit = wordsLeft === 1 ? 'word' : 'words'
    return `${wordsLeft} ${unit} left`
  }

  return `${wordsLeft} words of love left`
}
