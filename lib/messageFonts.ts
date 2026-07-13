export const MESSAGE_FONT_OPTIONS = [
  { id: 'inter', label: 'Inter', family: 'var(--font-inter), system-ui, sans-serif', group: 'Clean' },
  { id: 'nunito', label: 'Nunito', family: 'var(--font-nunito), system-ui, sans-serif', group: 'Clean' },
  { id: 'raleway', label: 'Raleway', family: 'var(--font-raleway), system-ui, sans-serif', group: 'Clean' },
  {
    id: 'playfair',
    label: 'Playfair',
    family: 'var(--font-playfair), Georgia, serif',
    group: 'Elegant',
  },
  { id: 'lora', label: 'Lora', family: 'var(--font-lora), Georgia, serif', group: 'Elegant' },
  {
    id: 'eb-garamond',
    label: 'Garamond',
    family: 'var(--font-eb-garamond), Georgia, serif',
    group: 'Elegant',
  },
  {
    id: 'georgia',
    label: 'Georgia',
    family: 'Georgia, "Times New Roman", serif',
    group: 'Elegant',
  },
  { id: 'caveat', label: 'Caveat', family: 'var(--font-caveat), cursive', group: 'Handwritten' },
  {
    id: 'sacramento',
    label: 'Sacramento',
    family: 'var(--font-sacramento), cursive',
    group: 'Handwritten',
  },
  {
    id: 'courier',
    label: 'Typewriter',
    family: 'var(--font-courier-prime), monospace',
    group: 'Character',
  },
] as const

export type MessageFontFamily = (typeof MESSAGE_FONT_OPTIONS)[number]['id']

export function getMessageFontFamily(fontFamily: string): string {
  const font = MESSAGE_FONT_OPTIONS.find((option) => option.id === fontFamily)
  return font?.family ?? MESSAGE_FONT_OPTIONS[0].family
}

export function isMessageFontFamily(value: string): value is MessageFontFamily {
  return MESSAGE_FONT_OPTIONS.some((option) => option.id === value)
}
