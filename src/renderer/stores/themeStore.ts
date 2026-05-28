import { create } from 'zustand'

export type ThemeId = 'warm' | 'cool' | 'forest' | 'night'

export interface Theme {
  id: ThemeId
  name: string
  icon: string
  colors: {
    bg: string
    glass: string
    glassBorder: string
    accent: string
    accentGlow: string
    text: string
    textSecondary: string
  }
}

export const THEMES: Theme[] = [
  {
    id: 'warm',
    name: '暖阳',
    icon: '☀️',
    colors: {
      bg: '#0f0c0a',
      glass: 'rgba(25, 18, 12, 0.93)',
      glassBorder: 'rgba(255, 200, 140, 0.15)',
      accent: 'rgba(255, 180, 100, 0.8)',
      accentGlow: 'rgba(255, 140, 60, 0.3)',
      text: 'rgba(255, 240, 220, 0.95)',
      textSecondary: 'rgba(255, 220, 180, 0.6)',
    },
  },
  {
    id: 'cool',
    name: '冰蓝',
    icon: '🧊',
    colors: {
      bg: '#0a0c10',
      glass: 'rgba(15, 18, 25, 0.93)',
      glassBorder: 'rgba(140, 180, 255, 0.15)',
      accent: 'rgba(120, 180, 255, 0.8)',
      accentGlow: 'rgba(80, 140, 255, 0.3)',
      text: 'rgba(220, 235, 255, 0.95)',
      textSecondary: 'rgba(180, 200, 240, 0.6)',
    },
  },
  {
    id: 'forest',
    name: '森林',
    icon: '🌲',
    colors: {
      bg: '#0a0f0a',
      glass: 'rgba(15, 22, 15, 0.93)',
      glassBorder: 'rgba(140, 200, 140, 0.15)',
      accent: 'rgba(120, 200, 120, 0.8)',
      accentGlow: 'rgba(80, 160, 80, 0.3)',
      text: 'rgba(220, 245, 220, 0.95)',
      textSecondary: 'rgba(180, 220, 180, 0.6)',
    },
  },
  {
    id: 'night',
    name: '深夜',
    icon: '🌙',
    colors: {
      bg: '#08080c',
      glass: 'rgba(12, 12, 18, 0.93)',
      glassBorder: 'rgba(180, 160, 220, 0.15)',
      accent: 'rgba(180, 160, 220, 0.8)',
      accentGlow: 'rgba(140, 120, 200, 0.3)',
      text: 'rgba(230, 220, 250, 0.95)',
      textSecondary: 'rgba(200, 180, 230, 0.6)',
    },
  },
]

interface ThemeState {
  current: ThemeId
  setTheme: (id: ThemeId) => void
  getColors: () => Theme['colors']
}

function loadSaved(): ThemeId {
  try { return (localStorage.getItem('theme') as ThemeId) || 'warm' } catch { return 'warm' }
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  current: loadSaved(),

  setTheme: (id) => {
    localStorage.setItem('theme', id)
    const theme = THEMES.find(t => t.id === id)
    if (theme) {
      const r = document.documentElement
      r.style.setProperty('--theme-bg', theme.colors.bg)
      r.style.setProperty('--theme-glass', theme.colors.glass)
      r.style.setProperty('--theme-border', theme.colors.glassBorder)
      r.style.setProperty('--theme-accent', theme.colors.accent)
      r.style.setProperty('--theme-accent-glow', theme.colors.accentGlow)
      r.style.setProperty('--theme-text', theme.colors.text)
      r.style.setProperty('--theme-text-sec', theme.colors.textSecondary)
    }
    set({ current: id })
  },

  getColors: () => {
    const theme = THEMES.find(t => t.id === get().current)
    return theme?.colors || THEMES[0].colors
  },
}))
