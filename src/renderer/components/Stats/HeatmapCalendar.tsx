import { useEffect } from 'react'
import { useStatsStore } from '@/stores/statsStore'

export default function HeatmapCalendar() {
  const { dailyStats, loadDailyStats } = useStatsStore()

  useEffect(() => { loadDailyStats(90) }, [loadDailyStats])

  const today = new Date()
  const days: { date: string; minutes: number }[] = []
  for (let i = 89; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    const dateStr = d.toISOString().slice(0, 10)
    const stat = dailyStats.find(s => s.date === dateStr)
    days.push({ date: dateStr, minutes: stat?.total_minutes ?? 0 })
  }

  const maxMin = Math.max(...days.map(d => d.minutes), 1)

  const getColor = (minutes: number) => {
    if (minutes === 0) return 'bg-white/5'
    const ratio = minutes / maxMin
    if (ratio < 0.25) return 'bg-emerald-900/60'
    if (ratio < 0.5) return 'bg-emerald-700/70'
    if (ratio < 0.75) return 'bg-emerald-500/80'
    return 'bg-emerald-400'
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="text-[10px] text-white/40 mb-1">最近90天</div>
      <div className="flex flex-wrap gap-[2px]" style={{ width: '100%' }}>
        {days.map(d => (
          <div
            key={d.date}
            className={`w-[7px] h-[7px] rounded-[1px] ${getColor(d.minutes)}`}
            title={`${d.date}: ${d.minutes}min`}
          />
        ))}
      </div>
    </div>
  )
}