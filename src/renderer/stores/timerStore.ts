import { create } from 'zustand'

export type TimerMode = 'pomodoro' | 'custom' | 'stopwatch'
export type TimerPhase = 'focus' | 'shortBreak' | 'longBreak'

interface TimerState {
  mode: TimerMode
  phase: TimerPhase
  isRunning: boolean
  totalSeconds: number
  remainingSeconds: number
  elapsedSeconds: number
  pomodoroCount: number
  customDuration: number

  start: () => void
  pause: () => void
  reset: () => void
  tick: () => void
  setMode: (mode: TimerMode) => void
  setCustomDuration: (minutes: number) => void
  switchPhase: (phase: TimerPhase) => void
  loadSettings: () => Promise<void>
}

async function getSettings() {
  try {
    const s = await window.api.store.get('settings')
    return s || { pomodoroDuration: 25, shortBreak: 5, longBreak: 15 }
  } catch {
    return { pomodoroDuration: 25, shortBreak: 5, longBreak: 15 }
  }
}

async function getPhaseSeconds(phase: TimerPhase): Promise<number> {
  const settings = await getSettings()
  switch (phase) {
    case 'focus': return settings.pomodoroDuration * 60
    case 'shortBreak': return settings.shortBreak * 60
    case 'longBreak': return settings.longBreak * 60
  }
}

export const useTimerStore = create<TimerState>((set, get) => ({
  mode: 'pomodoro',
  phase: 'focus',
  isRunning: false,
  totalSeconds: 25 * 60,
  remainingSeconds: 25 * 60,
  elapsedSeconds: 0,
  pomodoroCount: 0,
  customDuration: 30,

  start: () => set({ isRunning: true }),
  pause: () => set({ isRunning: false }),

  reset: async () => {
    const { mode, phase, customDuration } = get()
    if (mode === 'stopwatch') {
      set({ isRunning: false, elapsedSeconds: 0 })
    } else {
      const seconds = await getPhaseSeconds(phase)
      set({ isRunning: false, remainingSeconds: seconds, totalSeconds: seconds })
    }
  },

  tick: async () => {
    const { isRunning, mode } = get()
    if (!isRunning) return

    if (mode === 'stopwatch') {
      set({ elapsedSeconds: get().elapsedSeconds + 1 })
      return
    }

    const { remainingSeconds } = get()
    if (remainingSeconds <= 0) return

    const newRemaining = remainingSeconds - 1
    if (newRemaining <= 0) {
      const state = get()
      if (state.mode === 'pomodoro' && state.phase === 'focus') {
        const newCount = state.pomodoroCount + 1
        const nextPhase: TimerPhase = newCount % 4 === 0 ? 'longBreak' : 'shortBreak'
        const seconds = await getPhaseSeconds(nextPhase)
        set({
          isRunning: false,
          pomodoroCount: newCount,
          phase: nextPhase,
          remainingSeconds: seconds,
          totalSeconds: seconds,
        })
      } else if (state.mode === 'pomodoro') {
        const seconds = await getPhaseSeconds('focus')
        set({
          isRunning: false,
          phase: 'focus',
          remainingSeconds: seconds,
          totalSeconds: seconds,
        })
      } else {
        set({ isRunning: false, remainingSeconds: 0 })
      }
      return
    }

    set({ remainingSeconds: newRemaining })
  },

  setMode: async (mode) => {
    const { customDuration } = get()
    if (mode === 'stopwatch') {
      set({ mode, isRunning: false, elapsedSeconds: 0 })
    } else {
      const settings = await getSettings()
      const seconds = mode === 'pomodoro'
        ? settings.pomodoroDuration * 60
        : customDuration * 60
      set({ mode, isRunning: false, phase: 'focus', remainingSeconds: seconds, totalSeconds: seconds })
    }
  },

  setCustomDuration: (minutes) => {
    const clamped = Math.max(1, Math.min(180, minutes))
    set({ customDuration: clamped })
    if (get().mode === 'custom') {
      const seconds = clamped * 60
      set({ remainingSeconds: seconds, totalSeconds: seconds, isRunning: false })
    }
  },

  switchPhase: async (phase) => {
    const seconds = await getPhaseSeconds(phase)
    set({ phase, isRunning: false, remainingSeconds: seconds, totalSeconds: seconds })
  },

  loadSettings: async () => {
    const { mode, phase } = get()
    if (mode === 'pomodoro') {
      const seconds = await getPhaseSeconds(phase)
      set({ remainingSeconds: seconds, totalSeconds: seconds })
    }
  },
}))
