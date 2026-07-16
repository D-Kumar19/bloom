'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react'

import {
  APPEARANCE_STORAGE_KEY,
  applyAppearanceMode,
  DEFAULT_APPEARANCE,
  isAppearanceMode,
  resolveDarkMode,
  type AppearanceMode,
} from '@/lib/appearance'

type AppearanceContextValue = {
  appearance: AppearanceMode
  resolvedDark: boolean
  setAppearance: (mode: AppearanceMode) => void
}

type AppearanceState = {
  appearance: AppearanceMode
  resolvedDark: boolean
}

const AppearanceContext = createContext<AppearanceContextValue | null>(null)

function readStoredAppearance(): AppearanceMode {
  if (typeof window === 'undefined') {
    return DEFAULT_APPEARANCE
  }

  const stored = localStorage.getItem(APPEARANCE_STORAGE_KEY)
  return stored && isAppearanceMode(stored) ? stored : DEFAULT_APPEARANCE
}

function readAppearanceState(): AppearanceState {
  const appearance = readStoredAppearance()

  if (typeof document === 'undefined') {
    return {
      appearance,
      resolvedDark: resolveDarkMode(appearance),
    }
  }

  applyAppearanceMode(appearance)

  return {
    appearance,
    resolvedDark: document.documentElement.classList.contains('dark'),
  }
}

export function AppearanceProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AppearanceState>(readAppearanceState)

  const setAppearance = useCallback((mode: AppearanceMode) => {
    localStorage.setItem(APPEARANCE_STORAGE_KEY, mode)
    applyAppearanceMode(mode)
    setState({
      appearance: mode,
      resolvedDark: document.documentElement.classList.contains('dark'),
    })
  }, [])

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onSystemChange = () => {
      const current = localStorage.getItem(APPEARANCE_STORAGE_KEY)
      const mode = current && isAppearanceMode(current) ? current : DEFAULT_APPEARANCE
      if (mode !== 'system') {
        return
      }

      applyAppearanceMode('system')
      setState({
        appearance: 'system',
        resolvedDark: document.documentElement.classList.contains('dark'),
      })
    }

    media.addEventListener('change', onSystemChange)
    return () => media.removeEventListener('change', onSystemChange)
  }, [])

  const value = useMemo(
    () => ({
      appearance: state.appearance,
      resolvedDark: state.resolvedDark,
      setAppearance,
    }),
    [setAppearance, state.appearance, state.resolvedDark],
  )

  return <AppearanceContext.Provider value={value}>{children}</AppearanceContext.Provider>
}

export function useAppearance(): AppearanceContextValue {
  const context = useContext(AppearanceContext)
  if (!context) {
    throw new Error('useAppearance must be used within AppearanceProvider')
  }
  return context
}
