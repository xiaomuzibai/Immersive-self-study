import { useState, useEffect, memo } from 'react'
import { useGoalsStore } from '@/stores/goalsStore'
import { useStatsStore } from '@/stores/statsStore'

interface Props {
  visible: boolean
  onClose: () => void
}

function GoalsTracker({ visible, onClose }: Props) {
  const { settings, setDailyGoal, setWeeklyGoal } = useGoalsStore()
  const { todayMinutes, weekMinutes, loadStats } = useStatsStore()
  const [editing, setEditing] = useState<'daily' | 'weekly' | null>(null)

  useEffect(() => { if (visible) loadStats() }, [visible, loadStats])

  const dailyP = Math.min(todayMinutes / settings.dailyMinutes, 1)
  const weeklyP = Math.min(weekMinutes / settings.weeklyMinutes, 1)

  const fmt = (min: number) => {
    if (min < 60) return `${min}分钟`
    return `${Math.floor(min / 60)}小时${min % 60 > 0 ? `${min % 60}分` : ''}`
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xl">🎯</span>
        <h3 className="text-lg font-medium text-white tracking-wide">学习目标</h3>
      </div>

      <div className="space-y-6">
        {/* Daily */}
        <GoalCard
          label="今日目标"
          current={todayMinutes}
          target={settings.dailyMinutes}
          progress={dailyP}
          editing={editing === 'daily'}
          onEdit={() => setEditing('daily')}
          onBlur={() => setEditing(null)}
          onChange={v => setDailyGoal(v)}
          formatMin={fmt}
        />
        {/* Weekly */}
        <GoalCard
          label="本周目标"
          current={weekMinutes}
          target={settings.weeklyMinutes}
          progress={weeklyP}
          editing={editing === 'weekly'}
          onEdit={() => setEditing('weekly')}
          onBlur={() => setEditing(null)}
          onChange={v => setWeeklyGoal(v)}
          formatMin={fmt}
        />
      </div>
    </div>
  )
}

const GoalCard = memo(function GoalCard({
  label, current, target, progress, editing, onEdit, onBlur, onChange, formatMin,
}: {
  label: string; current: number; target: number; progress: number
  editing: boolean; onEdit: () => void; onBlur: () => void
  onChange: (v: number) => void; formatMin: (n: number) => string
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-base text-white/80">{label}</span>
        {!editing ? (
          <button onClick={onEdit} className="text-sm text-white/50 hover:text-amber-300/80 transition-colors">
            {formatMin(target)} ›
          </button>
        ) : (
          <div className="flex items-center gap-1.5">
            <input type="number" min={10} max={10000} step={10} value={target}
              onChange={e => onChange(Number(e.target.value))}
              className="w-20 text-center text-sm rounded-lg px-2 py-1 text-white outline-none"
              autoFocus onBlur={onBlur} />
            <span className="text-xs text-white/45">分</span>
          </div>
        )}
      </div>
      <div>
        <div className="w-full h-3 bg-white/[0.08] rounded-full overflow-hidden">
          <div className="h-full rounded-full transition-all duration-700" style={{
            width: `${progress * 100}%`,
            background: progress >= 1
              ? 'linear-gradient(90deg, rgba(100,220,120,0.8), rgba(60,200,90,0.9))'
              : 'linear-gradient(90deg, rgba(255,180,100,0.7), rgba(255,140,60,0.9))',
          }} />
        </div>
        <div className="flex justify-between mt-2">
          <span className="text-xs text-white/50">{formatMin(current)}</span>
          <span className="text-xs text-white/50">{formatMin(target)}</span>
        </div>
      </div>
      {progress >= 1 && (
        <div className="text-center text-sm text-green-400/90 py-1.5 rounded-lg bg-green-500/10">
          目标已达成
        </div>
      )}
    </div>
  )
})

export default memo(GoalsTracker)
