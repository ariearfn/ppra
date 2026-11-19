import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import type { AppState } from '../types'
import { createDefaultState, normalizeState } from './defaults'

const KEY = 'ppra-kit-rscc-2027'

interface Store {
  state: AppState
  update: (fn: (draft: AppState) => void) => void
  replace: (s: AppState) => void
  reset: () => void
  savedAt: number | null
}

const Ctx = createContext<Store | null>(null)

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY)
    return raw ? normalizeState(JSON.parse(raw)) : createDefaultState()
  } catch {
    return createDefaultState()
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AppState>(load)
  const [savedAt, setSavedAt] = useState<number | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(KEY, JSON.stringify(state))
      setSavedAt(Date.now())
    } catch {
      setSavedAt(null)
    }
  }, [state])

  const update = useCallback((fn: (draft: AppState) => void) => {
    setState((prev) => {
      const next = structuredClone(prev)
      fn(next)
      return next
    })
  }, [])

  const replace = useCallback((s: AppState) => setState(normalizeState(s)), [])
  const reset = useCallback(() => setState(createDefaultState()), [])

  const value = useMemo(() => ({ state, update, replace, reset, savedAt }), [state, update, replace, reset, savedAt])
  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

// eslint-disable-next-line react-refresh/only-export-components
export function useStore() {
  const s = useContext(Ctx)
  if (!s) throw new Error('useStore must be used within StoreProvider')
  return s
}
