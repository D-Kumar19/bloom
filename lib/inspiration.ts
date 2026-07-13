export type InspirationPrompt = {
  id: string
  emoji: string
  label: string
  preview: string
  starter: string
}

export const INSPIRATION_PROMPTS: InspirationPrompt[] = [
  {
    id: 'love',
    emoji: '💕',
    label: 'Love',
    preview: 'Every time I see ___, I think of you because...',
    starter:
      'Every time I see you smile, I think of you because you make ordinary days feel special. ',
  },
  {
    id: 'birthday',
    emoji: '🎂',
    label: 'Birthday',
    preview: 'On the day the world got you, I want you to know...',
    starter:
      'On the day the world got you, I want you to know how glad I am that you exist. ',
  },
  {
    id: 'encouragement',
    emoji: '💪',
    label: 'Encouragement',
    preview: 'I know things are hard right now, but I see how...',
    starter:
      'I know things are hard right now, but I see how brave you are, even on the days you do not feel it. ',
  },
  {
    id: 'thank-you',
    emoji: '🙏',
    label: 'Thank you',
    preview: 'I never told you this, but the moment you...',
    starter:
      'I never told you this, but the moment you showed up for me changed everything. Thank you. ',
  },
  {
    id: 'just-because',
    emoji: '🌸',
    label: 'Just because',
    preview: 'No reason. Just wanted you to know that...',
    starter:
      'No reason. Just wanted you to know that you crossed my mind today, and it made me smile. ',
  },
  {
    id: 'sympathy',
    emoji: '🕊️',
    label: 'Sympathy',
    preview: "I carry you with me. In everything I do, you're there.",
    starter: "I carry you with me. In everything I do, you're there. ",
  },
]
