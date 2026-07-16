export type FlowerColor = {
  name: string
  swatch: string
  meaning: string
}

export type FlowerDetailContent = {
  story: string
  colors?: FlowerColor[]
  whenToSend: string[]
  whenNotToSend: string[]
  related: string[]
}

export const FLOWER_CONTENT: Record<string, FlowerDetailContent> = {
  rose: {
    story:
      'The rose does not hint. It says the thing out loud, in petals. People have been handing them to each other for centuries because sometimes "I love you" needs a witness.',
    colors: [
      { name: 'Red', swatch: '#c41e3a', meaning: 'Deep love. The unambiguous kind.' },
      { name: 'Pink', swatch: '#f4a7b9', meaning: 'Admiration, gratitude, gentle affection.' },
      { name: 'White', swatch: '#f8f6f3', meaning: 'Pure love, new beginnings, respect.' },
      { name: 'Yellow', swatch: '#f5d547', meaning: 'Friendship and joy, not romance.' },
    ],
    whenToSend: [
      'An anniversary where you want them to feel chosen, not just remembered.',
      'A long-distance night when words on a screen are not enough.',
      'The first time you say it out loud and need the petals to back you up.',
    ],
    whenNotToSend: [
      'A casual friendship where yellow roses would be warmer and less loaded.',
      'Someone who just ended a relationship and roses would feel like pressure.',
    ],
    related: ['peony', 'tulip', 'orchid', 'camellia'],
  },
  peony: {
    story:
      'Peonies arrive like good news. Soft, generous, a little extravagant. They are the flower you send when someone deserves more than a polite congratulations.',
    colors: [
      { name: 'Pink', swatch: '#f4b8c8', meaning: 'Romance, bashful affection, good fortune.' },
      { name: 'White', swatch: '#faf8f5', meaning: 'Honor, respect, a quiet "well done."' },
      { name: 'Coral', swatch: '#e8836f', meaning: 'Warmth, desire, heartfelt sincerity.' },
    ],
    whenToSend: [
      'A friend who finally got the thing they worked toward for years.',
      'A wedding week when you want joy without irony.',
      'Someone having a hard season who needs to hear they deserve good things.',
    ],
    whenNotToSend: [
      'Sympathy or remembrance, where softer lilies or lotus read more carefully.',
      'A quick apology that needs humility, not abundance.',
    ],
    related: ['rose', 'daisy', 'camellia', 'sunflower'],
  },
  tulip: {
    story:
      'Tulips are a morning text made visible. They do not ask for a grand gesture. They say: you crossed my mind before the day got loud.',
    colors: [
      { name: 'Red', swatch: '#d42b2b', meaning: 'True love and passion.' },
      { name: 'Pink', swatch: '#f0a0b0', meaning: 'Caring affection, happiness.' },
      { name: 'Yellow', swatch: '#f5d547', meaning: 'Cheerful thoughts, sunshine.' },
      { name: 'Purple', swatch: '#9b59b6', meaning: 'Royalty, admiration, elegance.' },
      { name: 'White', swatch: '#f8f6f3', meaning: 'Forgiveness, a fresh start.' },
    ],
    whenToSend: [
      'An ordinary Tuesday when someone deserves to feel thought of.',
      'Early in a relationship, before roses feel like a statement.',
      'Spring birthdays when you want color without drama.',
    ],
    whenNotToSend: [
      'Deep grief, where lilies or lotus carry the right weight.',
      'A formal apology that needs stillness more than brightness.',
    ],
    related: ['daisy', 'rose', 'cherry-blossom', 'lavender'],
  },
  daisy: {
    story:
      'Daisies refuse to be complicated. They are friendship in flower form: honest, bright, impossible to misread as a marriage proposal.',
    whenToSend: [
      'A friend who makes boring days better without trying.',
      'Thank-yous that should feel warm, not ceremonial.',
      'Kids, cousins, or anyone who deserves joy without weight.',
    ],
    whenNotToSend: [
      'Romantic milestones where roses or peonies say it clearer.',
      'Sympathy arrangements where daisies can feel too cheerful.',
    ],
    related: ['sunflower', 'tulip', 'peony', 'lavender'],
  },
  lily: {
    story:
      'Lilies stand upright when words wobble. They carry grace without performance, which is why people reach for them when the moment asks for dignity.',
    colors: [
      { name: 'White', swatch: '#f8f6f3', meaning: 'Purity, sympathy, restored peace.' },
      { name: 'Pink', swatch: '#f4b8c8', meaning: 'Prosperity, admiration, encouragement.' },
      { name: 'Orange', swatch: '#e8836f', meaning: 'Confidence, passion, pride.' },
      { name: 'Yellow', swatch: '#f5d547', meaning: 'Joy, gratitude, good health.' },
    ],
    whenToSend: [
      'Someone facing surgery or a hard week who needs calm support.',
      'A parent or elder you want to honor with respect, not fuss.',
      'Remembrance when the message should feel steady, not sentimental.',
    ],
    whenNotToSend: [
      'A "cheer up!" bouquet for someone in fresh grief, where white lilies read as funeral flowers.',
      'Playful celebrations where sunflowers or daisies match the energy better.',
    ],
    related: ['lotus', 'camellia', 'lavender', 'orchid'],
  },
  orchid: {
    story:
      'Orchids are for the person who does not need flattery, only recognition. Rare without being loud. Noticed without being chased.',
    colors: [
      { name: 'White', swatch: '#f8f6f3', meaning: 'Elegance, reverence, pure admiration.' },
      { name: 'Purple', swatch: '#9b59b6', meaning: 'Respect, royalty, dignity.' },
      { name: 'Pink', swatch: '#f4b8c8', meaning: 'Grace, joy, gentle affection.' },
      { name: 'Yellow', swatch: '#f5d547', meaning: 'New beginnings, friendship.' },
    ],
    whenToSend: [
      'A mentor who changed how you see yourself.',
      'Someone you admire from a distance and want to acknowledge carefully.',
      'A love that feels rare without needing to prove it.',
    ],
    whenNotToSend: [
      'Casual friendships where orchids can feel too formal or expensive in tone.',
      'Apologies that need softness and humility more than admiration.',
    ],
    related: ['camellia', 'rose', 'lily', 'lotus'],
  },
  camellia: {
    story:
      'Camellias bloom when everything else is tired. That is the whole point: devotion that shows up in the cold months, not just the easy ones.',
    colors: [
      { name: 'Red', swatch: '#c41e3a', meaning: 'Deep desire and passionate love.' },
      { name: 'Pink', swatch: '#f4b8c8', meaning: 'Longing, admiration, gratitude.' },
      { name: 'White', swatch: '#f8f6f3', meaning: 'Adoration, perfect love, respect.' },
    ],
    whenToSend: [
      'A teacher or parent who showed up when no one else did.',
      'Gratitude that needs to feel personal, not performative.',
      'Winter birthdays when you want warmth without noise.',
    ],
    whenNotToSend: [
      'Lighthearted jokes or casual banter between friends.',
      'Celebrations that need visible energy, like sunflowers or peonies.',
    ],
    related: ['peony', 'orchid', 'rose', 'lily'],
  },
  lotus: {
    story:
      'Lotus grows through mud and still opens clean. No lecture required. People send it when someone has survived something and needs to be seen, not fixed.',
    whenToSend: [
      'Recovery after illness, loss, or a season that broke them a little.',
      'Someone starting over who needs encouragement without pity.',
      'Quiet celebrations of personal growth nobody else witnessed.',
    ],
    whenNotToSend: [
      'Romantic first dates where tulips or roses carry the right lightness.',
      'High-energy congratulations where sunflowers fit better.',
    ],
    related: ['lily', 'lavender', 'orchid', 'cherry-blossom'],
  },
  sunflower: {
    story:
      'Sunflowers do not do subtle. They turn toward light the way some people turn toward the friend who always picks up. That is the message.',
    whenToSend: [
      'A friend in a dark week who needs warmth without a speech.',
      'Kids, siblings, or anyone who responds to joy more than poetry.',
      'Get-well wishes when you want the room to feel brighter.',
    ],
    whenNotToSend: [
      'Sympathy or remembrance, where sunflowers can feel too cheerful.',
      'Romantic moments that need intimacy more than brightness.',
    ],
    related: ['daisy', 'tulip', 'peony', 'lavender'],
  },
  lavender: {
    story:
      'Lavender is what you send when you want someone to exhale. Not excitement. Not drama. Just: I hope you find a little peace today.',
    whenToSend: [
      'Someone stressed before a big week who needs calm more than hype.',
      'Apologies when you want softness without over-explaining.',
      'A friend who always holds everyone else together.',
    ],
    whenNotToSend: [
      'Celebrations that need visible joy, like graduations or promotions.',
      'Romantic declarations where roses or peonies speak louder.',
    ],
    related: ['lotus', 'lily', 'daisy', 'cherry-blossom'],
  },
  carnation: {
    story:
      'Carnations remember. They are the flower people pin on lapels for mothers, soldiers, and anyone who gave something without asking for applause.',
    colors: [
      { name: 'Pink', swatch: '#f4b8c8', meaning: 'Gratitude, a mother\'s undying love.' },
      { name: 'Red', swatch: '#c41e3a', meaning: 'Deep love and admiration.' },
      { name: 'White', swatch: '#f8f6f3', meaning: 'Pure love, good luck, remembrance.' },
      { name: 'Yellow', swatch: '#f5d547', meaning: 'Disappointment or rejection in Victorian code. Avoid unless intentional.' },
    ],
    whenToSend: [
      "Mother's Day, or any day you owe a parent a thank-you.",
      'A teacher who changed your trajectory without knowing it.',
      'Honoring someone who sacrificed quietly for you.',
    ],
    whenNotToSend: [
      'Romantic first gestures where roses or tulips feel fresher.',
      'Playful friendships, unless pink carnations for gratitude.',
    ],
    related: ['camellia', 'peony', 'rose', 'daisy'],
  },
  'cherry-blossom': {
    story:
      'Cherry blossoms last about two weeks. That is not a flaw. It is the whole lesson: some beautiful things are precious because they end.',
    whenToSend: [
      'A farewell before someone moves away.',
      'Graduation when a chapter closes and another opens.',
      'Celebrating a fleeting moment you know you will miss later.',
    ],
    whenNotToSend: [
      'Get-well wishes or new-job congratulations that need forward energy.',
      'Romantic anniversaries where roses or peonies feel more enduring.',
    ],
    related: ['tulip', 'lavender', 'lotus', 'daisy'],
  },
}

export function getFlowerContent(id: string): FlowerDetailContent | undefined {
  return FLOWER_CONTENT[id]
}
