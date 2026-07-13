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
  special?: boolean
}

export type Theme = {
  id: string
  name: string
  tagline: string
  className: string
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
  flowers: string[]
  greenery: string
  cardStyle: string
  photoCardImage?: string
  photoNoteStyle?: string
  messageFormat?: MessageFormat
  noteBorder?: NoteBorder
  to: string
  message: string
  from: string
  theme: string
}

export type FlowerSlot = {
  x: number
  y: number
  scale: number
  rotation: number
  z: number
}

export type PlacedFlower = {
  flowerId: string
  slot: FlowerSlot
}

export type BuilderStep =
  | 'pick'
  | 'greenery'
  | 'card'
  | 'message'
  | 'theme'
  | 'result'

export const MIN_FLOWERS = 3
export const MAX_FLOWERS = 20
export const MAX_MESSAGE_LENGTH = 200
