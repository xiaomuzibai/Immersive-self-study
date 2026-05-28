import { useEffect } from 'react'
import { useStatsStore } from '@/stores/statsStore'

export default function StatsOverview() {
  const { todayMinutes, weekMinutes, monthMinutes, loadStats } = useStatsStore()

  useEffect(() => { loadStats() }, [loadStats])

  const formatMin = (min: number) => {
    if (min === 0) return '0'
    if (min < 60) return `${min}`
    return `${Math.floor(min / 60)}h${min % 60 > 0 ? `${min % 60}m` : ''}`
  }

  const stats = [
    { label: '今日', value: todayMinutes },
    { label: '本周', value: weekMinutes },
    { label: '本月', value: monthMinutes },
  ]

  return (
    <div className="flex items-center gap-8">
      {stats.map((s, i) => (
        <div key={s.label} className="flex items-center gap-3">
          {i > 0 && <div className="w-px h-6 bg-white/10" />}
          <div className="flex items-baseline gap-2">
            <span
              className="text-2xl font-mono font-light text-white tabular-nums"
              style={{ textShadow: '0 0 12px rgba(255,180,100,0.12)' }}
            >
              {formatMin(s.value)}
            </span>
            <span className="text-sm text-white/50 tracking-widest">{s.label}</span>
          </div>
        </div>
      ))}
    </div>
  )
}
