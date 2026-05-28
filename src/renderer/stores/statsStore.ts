import { create } from 'zustand'
import type { FocusSession } from '../../shared/types'

interface DailyStat {
  date: string
  total_minutes: number
}

interface StatsState {
  sessions: FocusSession[]
  dailyStats: DailyStat[]
  todayMinutes: number
  weekMinutes: number
  monthMinutes: number
  dailyMinutes: Record<string, number>

  loadStats: () => Promise<void>
  loadDailyStats: (days: number) => Promise<void>
  addSession: (session: Omit<FocusSession, 'id'>) => Promise<void>
}

export const useStatsStore = create<StatsState>((set) => ({
  sessions: [],
  dailyStats: [],
  todayMinutes: 0,
  weekMinutes: 0,
  monthMinutes: 0,
  dailyMinutes: {},

  loadStats: async () => {
    const sessions: FocusSession[] = await window.api.db.getStats()
    const now = new Date()
    const today = now.toISOString().slice(0, 10)

    const weekAgo = new Date(now)
    weekAgo.setDate(weekAgo.getDate() - 7)
    const monthAgo = new Date(now)
    monthAgo.setDate(monthAgo.getDate() - 30)

    let todayMinutes = 0
    let weekMinutes = 0
    let monthMinutes = 0
    const dailyMinutes: Record<string, number> = {}

    for (const s of sessions) {
      if (!s.completed) continue
      const d = s.start_time.slice(0, 10)
      dailyMinutes[d] = (dailyMinutes[d] || 0) + s.duration_minutes
      if (d === today) todayMinutes += s.duration_minutes
      if (s.start_time >= weekAgo.toISOString()) weekMinutes += s.duration_minutes
      if (s.start_time >= monthAgo.toISOString()) monthMinutes += s.duration_minutes
    }

    set({ sessions, todayMinutes, weekMinutes, monthMinutes, dailyMinutes })
  },

  loadDailyStats: async (days: number) => {
    const dailyStats: DailyStat[] = await window.api.db.getDailyStats(days)
    set({ dailyStats })
  },

  addSession: async (session) => {
    await window.api.db.addSession(session)
    await useStatsStore.getState().loadStats()
  },
}))