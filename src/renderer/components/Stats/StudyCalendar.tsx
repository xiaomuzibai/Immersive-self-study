import { useEffect, useMemo, memo } from 'react'
import { useStatsStore } from '@/stores/statsStore'

interface Props {
  visible: boolean
  onClose: () => void
}

function StudyCalendar({ visible, onClose }: Props) {
  const { loadStats, dailyMinutes } = useStatsStore()
  useEffect(() => { if (visible) loadStats() }, [visible, loadStats])

  const weeks = useMemo(() => {
    const today = new Date()
    const start = new Date(today)
    start.setDate(start.getDate() - 90)
    const day = start.getDay()
    start.setDate(start.getDate() - (day === 0 ? 6 : day - 1))
    const result: { date: Date; minutes: number; label: string }[][] = []
    const current = new Date(start)
    for (let w = 0; w < 13; w++) {
      const week: { date: Date; minutes: number; label: string }[] = []
      for (let d = 0; d < 7; d++) {
        const key = current.toISOString().split('T')[0]
        week.push({ date: new Date(current), minutes: dailyMinutes[key] || 0, label: `${current.getMonth() + 1}/${current.getDate()}` })
        current.setDate(current.getDate() + 1)
      }
      result.push(week)
    }
    return result
  }, [dailyMinutes])

  const maxMin = useMemo(() => {
    let max = 0
    for (const week of weeks) for (const day of week) if (day.minutes > max) max = day.minutes
    return max || 1
  }, [weeks])

  const getColor = (m: number) => {
    if (m === 0) return 'rgba(255,200,140,0.08)'
    const r = m / maxMin
    if (r < 0.25) return 'rgba(255,180,100,0.25)'
    if (r < 0.5) return 'rgba(255,160,80,0.4)'
    if (r < 0.75) return 'rgba(255,140,60,0.6)'
    return 'rgba(255,120,40,0.8)'
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-xl">📅</span>
        <h3 className="text-lg font-medium text-white tracking-wide">学习日历</h3>
      </div>
      <div className="flex gap-2">
        <div className="flex flex-col gap-[4px] mr-1.5">
          {['一', '二', '三', '四', '五', '六', '日'].map(d => (
            <div key={d} className="h-[16px] flex items-center text-[10px] text-white/45">{d}</div>
          ))}
        </div>
        <div className="flex gap-[4px]">
          {weeks.map((week, wi) => (
            <div key={wi} className="flex flex-col gap-[4px]">
              {week.map((day, di) => (
                <div key={di} className="w-[16px] h-[16px] rounded-[3px] transition-colors duration-300 cursor-default"
                  style={{ backgroundColor: getColor(day.minutes) }}
                  title={`${day.label}: ${day.minutes}分钟`} />
              ))}
            </div>
          ))}
        </div>
      </div>
      <div className="flex items-center gap-1.5 mt-4 justify-end">
        <span className="text-[10px] text-white/40">少</span>
        {[0, 1, 2, 3, 4].map(i => (
          <div key={i} className="w-[12px] h-[12px] rounded-[2px]"
            style={{ backgroundColor: getColor((i / 4) * maxMin) }} />
        ))}
        <span className="text-[10px] text-white/40">多</span>
      </div>
    </div>
  )
}

export default memo(StudyCalendar)
