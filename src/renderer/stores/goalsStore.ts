import { create } from 'zustand'

interface GoalSettings {
  dailyMinutes: number
  weeklyMinutes: number
}

interface GoalState {
  settings: GoalSettings
  setDailyGoal: (min: number) => void
  setWeeklyGoal: (min: number) => void
}

const DEFAULTS: GoalSettings = {
  dailyMinutes: 180,
  weeklyMinutes: 1200,
}

function loadSaved(): GoalSettings {
  try {
    const raw = localStorage.getItem('study-goals')
    return raw ? JSON.parse(raw) : DEFAULTS
  } catch { return DEFAULTS }
}

function saveGoals(s: GoalSettings) {
  localStorage.setItem('study-goals', JSON.stringify(s))
}

export const useGoalsStore = create<GoalState>((set, get) => ({
  settings: loadSaved(),

  setDailyGoal: (min) => {
    const next = { ...get().settings, dailyMinutes: min }
    saveGoals(next)
    set({ settings: next })
  },

  setWeeklyGoal: (min) => {
    const next = { ...get().settings, weeklyMinutes: min }
    saveGoals(next)
    set({ settings: next })
  },
}))
