import { useEffect, memo } from 'react'
import { useFocusScoreStore } from '@/stores/focusScoreStore'

interface Props {
  visible: boolean
  onClose: () => void
}

function FocusScore({ visible, onClose }: Props) {
  const { score, streak, bestStreak, interruptions, load } = useFocusScoreStore()
  useEffect(() => { load() }, [load])

  const grade = score >= 60 ? { label: 'S', color: 'text-amber-300', bg: 'bg-amber-400/15' }
    : score >= 40 ? { label: 'A', color: 'text-green-400', bg: 'bg-green-400/15' }
    : score >= 20 ? { label: 'B', color: 'text-blue-400', bg: 'bg-blue-400/15' }
    : score >= 10 ? { label: 'C', color: 'text-white/60', bg: 'bg-white/10' }
    : { label: 'D', color: 'text-white/40', bg: 'bg-white/5' }

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xl">⚡</span>
        <h3 className="text-lg font-medium text-white tracking-wide">专注分数</h3>
      </div>

      <div className="flex justify-center mb-6">
        <div className={`relative w-28 h-28 rounded-full ${grade.bg} flex items-center justify-center`}>
          <div className="text-center">
            <div className={`text-4xl font-bold ${grade.color}`}>{score}</div>
            <div className={`text-sm ${grade.color} opacity-70`}>{grade.label}</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 mb-5">
        {[
          { value: streak, label: '连续分钟', color: 'text-white' },
          { value: bestStreak, label: '最佳连续', color: 'text-amber-300/80' },
          { value: interruptions, label: '中断次数', color: 'text-white/60' },
        ].map(s => (
          <div key={s.label} className="text-center p-3 rounded-xl bg-white/[0.04]">
            <div className={`text-xl font-mono ${s.color}`}>{s.value}</div>
            <div className="text-[10px] text-white/45 mt-1">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="text-xs text-white/40 text-center leading-relaxed">
        连续专注时间越长，分数越高<br />中断会扣分并重置连续记录
      </div>
    </div>
  )
}

export default memo(FocusScore)
