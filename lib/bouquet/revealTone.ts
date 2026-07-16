import { getThemeById } from '@/lib/themes'

export type RevealTextTone = {
  dark: boolean
  title: string
  body: string
  muted: string
  accent: string
  hint: string
  hintScrim: string
  beat0Card: string
  beat0Ring: string
  iconButton: string
  ghostButton: string
}

export function getRevealTextTone(themeId: string): RevealTextTone {
  const dark = getThemeById(themeId)?.dark ?? false

  if (dark) {
    return {
      dark: true,
      title: 'text-white',
      body: 'text-white/85',
      muted: 'text-white/65',
      accent: 'text-[#e8c882]',
      hint: 'text-white',
      hintScrim: 'bg-black/55 ring-1 ring-white/20',
      beat0Card: 'border-white/20 bg-black/30',
      beat0Ring: 'border-white/40 bg-white/10',
      iconButton:
        '!border-white/25 !bg-black/40 !text-white hover:!border-white/45 hover:!text-white backdrop-blur-sm',
      ghostButton:
        '!border-white/30 !bg-black/35 !text-white hover:!bg-black/50 hover:!border-white/45',
    }
  }

  return {
    dark: false,
    title: 'text-[#2a2420]',
    body: 'text-[#2a2420]/85',
    muted: 'text-[#2a2420]/65',
    accent: 'text-[#9a4a50]',
    hint: 'text-[#2a2420]',
    hintScrim: 'bg-white/92 ring-1 ring-[#2a2420]/12 shadow-sm',
    beat0Card: 'border-[#2a2420]/12 bg-white/80',
    beat0Ring: 'border-[#2a2420]/20 bg-white/90',
    iconButton:
      '!border-[#2a2420]/15 !bg-white/90 !text-[#2a2420] hover:!border-[#9a4a50]/45 hover:!text-[#2a2420] backdrop-blur-sm',
    ghostButton:
      '!border-[#2a2420]/20 !bg-white/85 !text-[#2a2420] hover:!bg-white hover:!border-[#2a2420]/30',
  }
}
