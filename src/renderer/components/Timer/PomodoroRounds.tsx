import { useTimerStore } from '@/stores/timerStore'

export default function PomodoroRounds() {
  const { mode, pomodoroCount, phase } = useTimerStore()

  if (mode !== 'pomodoro') return null

  // Show last 8 completed pomodoros, grouped by 4
  const displayCount = Math.min(pomodoroCount, 8)
  const groups = []

  for (let i = 0; i < displayCount; i += 4) {
    groups.push(Array.from({ length: Math.min(4, displayCount - i) }, (_, j) => i + j))
  }

  return (
    <div className="flex items-center gap-4">
      {groups.map((group, gi) => (
        <div key={gi} className="flex items-center gap-1.5">
          {group.map(idx => (
            <div
              key={idx}
              className="w-2.5 h-2.5 rounded-full bg-amber-400/70"
              style={{ boxShadow: '0 0 6px rgba(255,180,100,0.3)' }}
            />
          ))}
          {gi < groups.length - 1 && (
            <div className="w-1 h-1 rounded-full bg-white/15 ml-1" />
          )}
        </div>
      ))}
      {/* Empty slots for current cycle */}
      {pomodoroCount < 4 && (
        <div className="flex items-center gap-1.5">
          {Array.from({ length: 4 - (pomodoroCount % 4 || (pomodoroCount > 0 ? 0 : 4)) }, (_, i) => (
            <div
              key={`empty-${i}`}
              className="w-2.5 h-2.5 rounded-full border border-white/15"
            />
          ))}
        </div>
      )}
    </div>
  )
}
