import { create } from 'zustand'

interface FocusScoreState {
  score: number
  streak: number
  bestStreak: number
  interruptions: number
  lastTickTime: number | null

  tick: () => void
  interrupt: () => void
  reset: () => void
  load: () => void
}

function loadSaved() {
  try {
    const raw = localStorage.getItem('focus-score')
    return raw ? JSON.parse(raw) : { bestStreak: 0 }
  } catch { return { bestStreak: 0 } }
}

function save(data: { bestStreak: number }) {
  localStorage.setItem('focus-score', JSON.stringify(data))
}

export const useFocusScoreStore = create<FocusScoreState>((set, get) => ({
  score: 0,
  streak: 0,
  bestStreak: loadSaved().bestStreak,
  interruptions: 0,
  lastTickTime: null,

  tick: () => {
    const { streak, lastTickTime } = get()
    const now = Date.now()
    if (!lastTickTime) {
      set({ lastTickTime: now })
    } else if (now - lastTickTime >= 60000) {
      // +1 point per minute of continuous focus
      const newStreak = streak + 1
      const newBest = Math.max(newStreak, get().bestStreak)
      save({ bestStreak: newBest })
      set({
        streak: newStreak,
        score: newStreak,
        bestStreak: newBest,
        lastTickTime: now,
      })
    }
  },

  interrupt: () => {
    const { streak, interruptions } = get()
    set({
      streak: 0,
      interruptions: interruptions + 1,
      lastTickTime: null,
      score: Math.max(0, get().score - 2),
    })
  },

  reset: () => {
    set({ score: 0, streak: 0, interruptions: 0, lastTickTime: null })
  },

  load: () => {
    const saved = loadSaved()
    set({ bestStreak: saved.bestStreak })
  },
}))
