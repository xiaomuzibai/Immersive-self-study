import { create } from 'zustand'

interface AtmosphereState {
  fireflies: boolean
  bokeh: boolean
  fog: boolean
  lightRays: boolean
  toggle: (key: 'fireflies' | 'bokeh' | 'fog' | 'lightRays') => void
  setAll: (on: boolean) => void
}

function loadSaved() {
  try {
    const raw = localStorage.getItem('atmosphere')
    if (raw) return JSON.parse(raw)
  } catch {}
  return { fireflies: true, bokeh: true, fog: true, lightRays: true }
}

function save(s: Omit<AtmosphereState, 'toggle' | 'setAll'>) {
  localStorage.setItem('atmosphere', JSON.stringify(s))
}

export const useAtmosphereStore = create<AtmosphereState>((set, get) => ({
  ...loadSaved(),

  toggle: (key) => {
    const next = { ...get(), [key]: !get()[key] }
    save(next)
    set({ [key]: next[key] })
  },

  setAll: (on) => {
    const next = { fireflies: on, bokeh: on, fog: on, lightRays: on }
    save(next)
    set(next)
  },
}))
