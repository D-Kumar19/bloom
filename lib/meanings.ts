export function getFlowerCountMeaning(count: number): string {
  if (count <= 0) {
    return ''
  }

  if (count <= 2) {
    return 'Pick at least 3 flowers to complete your bouquet.'
  }

  const specific: Record<number, string> = {
    3: 'Three is a classic. It says: this was thoughtful.',
    4: 'Even numbers feel whole and balanced, like a complete thought.',
    5: 'Odd numbers carry energy, like a feeling that keeps growing.',
    6: 'Six flowers say: I thought about every single one.',
    7: "Seven is enchantment. There's something magical here.",
    8: "Eight is abundance. You're giving generously.",
    9: 'Nine says: you mean the world to me.',
    10: "Ten is a statement. This isn't casual.",
    11: "Eleven says: you're my favorite.",
    12: 'A dozen. The classic. Unmistakable.',
    20: 'Twenty flowers. Nothing left unsaid.',
  }

  if (specific[count]) {
    return specific[count]
  }

  if (count >= 13 && count <= 15) {
    return 'A grand gesture. This bouquet has weight.'
  }

  if (count >= 16 && count <= 19) {
    return "You're building something extraordinary."
  }

  if (count % 2 === 0) {
    return 'Even numbers feel whole and balanced, like a complete thought.'
  }

  return 'Odd numbers carry energy, like a feeling that keeps growing.'
}
