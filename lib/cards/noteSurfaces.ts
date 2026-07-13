/** CSS surface classes for note card paper styles (shared by MessageCard and PhotoCard back). */
export const NOTE_SURFACE_CLASSES: Record<string, string> = {
  'classic-cream': 'card-surface-classic-cream text-black',
  vintage: 'card-surface-vintage text-black',
  midnight: 'card-surface-midnight text-white',
  'rose-gold': 'card-surface-rose-gold text-black',
  watercolor: 'card-surface-watercolor text-black',
  kraft: 'card-surface-kraft text-black',
  garden: 'card-surface-garden text-black',
  blush: 'card-surface-blush text-black',
  linen: 'card-surface-linen text-black',
}

export function getNoteSurfaceClass(styleId: string): string {
  return NOTE_SURFACE_CLASSES[styleId] ?? NOTE_SURFACE_CLASSES['classic-cream']
}
