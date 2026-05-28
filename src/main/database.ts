import Store from 'electron-store'
import type { FocusSession } from '../shared/types'

interface DBSchema {
  sessions: FocusSession[]
}

let db: Store<DBSchema>

export function initDatabase(): void {
  db = new Store<DBSchema>({
    name: 'focus-sessions',
    defaults: { sessions: [] }
  })
}

export function addSession(session: Omit<FocusSession, 'id'>): void {
  const sessions = db.get('sessions', [])
  const id = sessions.length > 0 ? Math.max(...sessions.map(s => s.id)) + 1 : 1
  sessions.push({ ...session, id })
  db.set('sessions', sessions)
}

export function getStats(): FocusSession[] {
  return db.get('sessions', []).sort((a, b) => b.start_time.localeCompare(a.start_time))
}

export function getDailyStats(days: number): { date: string; total_minutes: number }[] {
  const sessions = db.get('sessions', [])
  const cutoff = new Date()
  cutoff.setDate(cutoff.getDate() - days)
  const cutoffStr = cutoff.toISOString()

  const dailyMap = new Map<string, number>()
  for (const s of sessions) {
    if (!s.completed || s.start_time < cutoffStr) continue
    const date = s.start_time.slice(0, 10)
    dailyMap.set(date, (dailyMap.get(date) || 0) + s.duration_minutes)
  }

  return Array.from(dailyMap.entries())
    .map(([date, total_minutes]) => ({ date, total_minutes }))
    .sort((a, b) => a.date.localeCompare(b.date))
}