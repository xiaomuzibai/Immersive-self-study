import { useEffect, useMemo, memo } from 'react'
import { useStatsStore } from '@/stores/statsStore'

interface Props {
  visible: boolean
  onClose: () => void
}

function FocusReport({ visible, onClose }: Props) {
  const { sessions, loadStats, todayMinutes, weekMinutes, monthMinutes } = useStatsStore()
  useEffect(() => { if (visible) loadStats() }, [visible, loadStats])

  const report = useMemo(() => {
    const completed = sessions.filter(s => s.completed)
    const totalMinutes = completed.reduce((sum, s) => sum + s.duration_minutes, 0)
    const totalCount = completed.length
    const avgSession = totalCount > 0 ? Math.round(totalMinutes / totalCount) : 0

    // Sessions by type
    const pomodoroCount = completed.filter(s => s.type === 'pomodoro').length
    const customCount = completed.filter(s => s.type === 'custom').length

    // Streak calculation
    const dateMap = new Map<string, number>()
    for (const s of completed) {
      const date = s.start_time.slice(0, 10)
      dateMap.set(date, (dateMap.get(date) || 0) + s.duration_minutes)
    }
    const sortedDates = Array.from(dateMap.keys()).sort()
    let maxStreak = 0, currentStreak = 0
    for (let i = 0; i < sortedDates.length; i++) {
      if (i === 0) { currentStreak = 1 }
      else {
        const prev = new Date(sortedDates[i - 1])
        const curr = new Date(sortedDates[i])
        const diff = (curr.getTime() - prev.getTime()) / (1000 * 60 * 60 * 24)
        if (diff === 1) currentStreak++
        else currentStreak = 1
      }
      maxStreak = Math.max(maxStreak, currentStreak)
    }

    // Best day
    let bestDay = '', bestDayMinutes = 0
    for (const [date, minutes] of dateMap) {
      if (minutes > bestDayMinutes) { bestDay = date; bestDayMinutes = minutes }
    }

    // Daily average (last 30 days)
    const last30 = new Date()
    last30.setDate(last30.getDate() - 30)
    const recentDays = Array.from(dateMap.entries()).filter(([d]) => d >= last30.toISOString().slice(0, 10))
    const dailyAvg = recentDays.length > 0 ? Math.round(recentDays.reduce((s, [, m]) => s + m, 0) / 30) : 0

    return {
      totalMinutes, totalCount, avgSession, pomodoroCount, customCount,
      maxStreak, bestDay, bestDayMinutes, dailyAvg, activeDays: dateMap.size,
    }
  }, [sessions])

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xl">📊</span>
        <h3 className="text-lg font-medium text-white tracking-wide">专注报告</h3>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 gap-3 mb-5">
        {[
          { label: '今日', value: `${todayMinutes}分`, icon: '📅' },
          { label: '本周', value: formatHour(weekMinutes), icon: '📆' },
          { label: '本月', value: formatHour(monthMinutes), icon: '🗓️' },
          { label: '总计', value: formatHour(report.totalMinutes), icon: '⏱️' },
        ].map(card => (
          <div key={card.label} className="p-3 rounded-xl bg-white/[0.04] text-center">
            <div className="text-lg mb-1">{card.icon}</div>
            <div className="text-lg font-mono text-white">{card.value}</div>
            <div className="text-[10px] text-white/40 mt-0.5">{card.label}</div>
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="space-y-3">
        <ReportRow label="总学习次数" value={`${report.totalCount} 次`} />
        <ReportRow label="番茄钟" value={`${report.pomodoroCount} 次`} />
        <ReportRow label="自定义" value={`${report.customCount} 次`} />
        <ReportRow label="平均每次" value={`${report.avgSession} 分钟`} />
        <ReportRow label="日均学习" value={`${report.dailyAvg} 分钟`} />
        <ReportRow label="学习天数" value={`${report.activeDays} 天`} />
        <ReportRow label="最长连续" value={`${report.maxStreak} 天`} />
        {report.bestDay && (
          <ReportRow label="最佳一天" value={`${report.bestDay} (${report.bestDayMinutes}分)`} />
        )}
      </div>
    </div>
  )
}

const ReportRow = memo(function ReportRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-2 border-b border-white/[0.04]">
      <span className="text-sm text-white/55">{label}</span>
      <span className="text-sm text-white/80 font-mono">{value}</span>
    </div>
  )
})

function formatHour(min: number) {
  if (min < 60) return `${min}分`
  return `${Math.floor(min / 60)}h${min % 60 > 0 ? `${min % 60}m` : ''}`
}

export default memo(FocusReport)
