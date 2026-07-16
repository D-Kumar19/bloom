export type Flower = {
  id: string
  name: string
  image: string
  meaning: string
  fact: string
  perfectFor: string
}

export type Greenery = {
  id: string
  name: string
  image: string
  meaning: string
  fact: string
  perfectFor: string
}

export type CardStyle = {
  id: string
  name: string
  tagline: string
  featured?: boolean
}

export type BackdropLightPosition = 'top' | 'top-left' | 'center' | 'bottom'

export type BackdropEffect = 'grain' | 'vignette' | 'petals' | 'stars' | 'pollen'

export type BackdropMotion =
  | 'breathe'
  | 'glow-drift'
  | 'wave-shift'
  | 'blur-pulse'
  | 'twinkle'
  | 'pollen-float'
  | 'none'

export type Theme = {
  id: string
  name: string
  tagline: string
  className: string
  description: string
  mood: string
  perfectFor: string
  lightPosition?: BackdropLightPosition
  lightTint?: string
  accentTint?: string
  accentAt?: 'bottom-left' | 'bottom-right' | 'top-right' | 'center'
  effects?: BackdropEffect[]
  motion?: BackdropMotion
  dark?: boolean
  /** Legacy flag; prefer isThemeAnimated() which also checks motion and particle effects. */
  animated?: boolean
}

export type MessageFontFamily =
  | 'inter'
  | 'nunito'
  | 'raleway'
  | 'playfair'
  | 'lora'
  | 'eb-garamond'
  | 'georgia'
  | 'caveat'
  | 'sacramento'
  | 'courier'

export type MessageFormat = {
  fontFamily: MessageFontFamily
  fontSize: 'sm' | 'base' | 'lg'
  color: string
}

export type NoteBorderStyle = 'solid' | 'dashed' | 'dotted' | 'double' | 'none'

export type NoteBorder = {
  style: NoteBorderStyle
  color: string
}

export type BouquetState = {
  bouquetId: string
  cardStyle: string
  messageFormat?: MessageFormat
  noteBorder?: NoteBorder
  to: string
  message: string
  from: string
  theme: string
  soundtrack?: string
}

export type BuilderStep =
  | 'bouquet'
  | 'card'
  | 'message'
  | 'theme'
  | 'share'

export const MAX_MESSAGE_LENGTH = 200
