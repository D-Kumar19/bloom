export type AppearanceMode = 'light' | 'dark' | 'system'

export const APPEARANCE_STORAGE_KEY = 'bloom-appearance'

export const DEFAULT_APPEARANCE: AppearanceMode = 'system'

export function isAppearanceMode(value: string): value is AppearanceMode {
  return value === 'light' || value === 'dark' || value === 'system'
}

export function resolveDarkMode(appearance: AppearanceMode): boolean {
  if (appearance === 'dark') {
    return true
  }
  if (appearance === 'light') {
    return false
  }
  if (typeof window === 'undefined') {
    return false
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
}

export function applyAppearanceMode(appearance: AppearanceMode): void {
  if (typeof document === 'undefined') {
    return
  }

  const root = document.documentElement
  root.dataset.appearance = appearance
  root.classList.toggle('dark', resolveDarkMode(appearance))
}
