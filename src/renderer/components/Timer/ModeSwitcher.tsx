import { useTimerStore, type TimerMode } from '@/stores/timerStore'

export default function ModeSwitcher() {
  const mode = useTimerStore(s => s.mode)
  const setMode = useTimerStore(s => s.setMode)
  const customDuration = useTimerStore(s => s.customDuration)
  const setCustomDuration = useTimerStore(s => s.setCustomDuration)

  const modes: { id: TimerMode; label: string }[] = [
    { id: 'pomodoro', label: '番茄钟' },
    { id: 'custom', label: '自定义' },
    { id: 'stopwatch', label: '正计时' },
  ]

  return (
    <div className="flex items-center gap-2">
      {modes.map(m => (
        <button
          key={m.id}
          onClick={() => setMode(m.id)}
          className={`text-sm px-4 py-1.5 rounded-full transition-all duration-200 tracking-wide
            ${mode === m.id
              ? 'bg-white/15 text-white'
              : 'text-white/55 hover:text-white/85 hover:bg-white/[0.06]'}`}
        >
          {m.label}
        </button>
      ))}
      {mode === 'custom' && (
        <div className="flex items-center gap-1.5 ml-1">
          <input
            type="number"
            min={1}
            max={180}
            value={customDuration}
            onChange={e => setCustomDuration(Number(e.target.value))}
            className="w-14 text-center text-sm rounded-lg px-2 py-1 text-white/90 outline-none"
          />
          <span className="text-xs text-white/45">m</span>
        </div>
      )}
    </div>
  )
}
