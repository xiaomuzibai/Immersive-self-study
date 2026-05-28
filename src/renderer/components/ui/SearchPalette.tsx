import { useState, useEffect, useRef, useMemo, memo } from 'react'

interface Props {
  visible: boolean
  onClose: () => void
  onSelect: (action: string) => void
}

interface SearchItem {
  id: string
  icon: string
  label: string
  category: string
  action: string
}

const ITEMS: SearchItem[] = [
  { id: 'music', icon: '🎵', label: '轻音乐', category: '音频', action: 'open:music' },
  { id: 'ambient', icon: '🌊', label: '环境音', category: '音频', action: 'open:ambient' },
  { id: 'whitenoise', icon: '🎧', label: '白噪音', category: '音频', action: 'open:whitenoise' },
  { id: 'scenes', icon: '🖼️', label: '场景切换', category: '场景', action: 'open:scenes' },
  { id: 'goals', icon: '🎯', label: '学习目标', category: '工具', action: 'open:goals' },
  { id: 'calendar', icon: '📅', label: '学习日历', category: '工具', action: 'open:calendar' },
  { id: 'focusScore', icon: '⚡', label: '专注评分', category: '工具', action: 'open:focusScore' },
  { id: 'notes', icon: '📝', label: '学习笔记', category: '工具', action: 'open:notes' },
  { id: 'theme', icon: '🎨', label: '主题切换', category: '外观', action: 'open:theme' },
  { id: 'atmosphere', icon: '🌌', label: '氛围效果', category: '外观', action: 'open:atmosphere' },
  { id: 'settings', icon: '⚙️', label: '设置', category: '系统', action: 'open:settings' },
  { id: 'help', icon: '📖', label: '使用说明', category: '系统', action: 'open:help' },
  { id: 'breathing', icon: '🫁', label: '呼吸练习', category: '健康', action: 'open:breathing' },
  { id: 'export', icon: '📤', label: '导出数据', category: '系统', action: 'open:export' },
  { id: 'presets', icon: '💡', label: '场景预设', category: '场景', action: 'open:presets' },
  { id: 'report', icon: '📊', label: '专注报告', category: '统计', action: 'open:report' },
  { id: 'focusmode', icon: '🎯', label: '专注模式', category: '系统', action: 'toggle:focusMode' },
  { id: 'timer-start', icon: '▶️', label: '开始计时', category: '计时', action: 'timer:start' },
  { id: 'timer-pause', icon: '⏸️', label: '暂停计时', category: '计时', action: 'timer:pause' },
  { id: 'timer-reset', icon: '🔄', label: '重置计时', category: '计时', action: 'timer:reset' },
]

function SearchPalette({ visible, onClose, onSelect }: Props) {
  const [query, setQuery] = useState('')
  const [selectedIdx, setSelectedIdx] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const filtered = useMemo(() => {
    if (!query) return ITEMS
    const q = query.toLowerCase()
    return ITEMS.filter(item =>
      item.label.toLowerCase().includes(q) ||
      item.category.toLowerCase().includes(q)
    )
  }, [query])

  useEffect(() => {
    if (visible) {
      setQuery('')
      setSelectedIdx(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [visible])

  useEffect(() => {
    setSelectedIdx(0)
  }, [query])

  useEffect(() => {
    if (!visible) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelectedIdx(i => Math.min(i + 1, filtered.length - 1)) }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelectedIdx(i => Math.max(i - 1, 0)) }
      if (e.key === 'Enter' && filtered[selectedIdx]) {
        onSelect(filtered[selectedIdx].action)
        onClose()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [visible, filtered, selectedIdx, onSelect, onClose])

  if (!visible) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-start justify-center pt-[15vh]"
      style={{ background: 'rgba(0,0,0,0.5)', backdropFilter: 'blur(8px)' }}
      onClick={onClose}>
      <div className="w-[480px] rounded-2xl overflow-hidden animate-scale-in"
        style={{
          background: 'linear-gradient(135deg, rgba(20,15,10,0.98), rgba(15,12,8,0.99))',
          border: '1px solid rgba(255,200,140,0.12)',
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}
        onClick={e => e.stopPropagation()}>
        {/* Search input */}
        <div className="flex items-center gap-3 px-5 py-4 border-b border-white/[0.06]">
          <span className="text-white/30 text-lg">🔍</span>
          <input ref={inputRef} value={query} onChange={e => setQuery(e.target.value)}
            placeholder="搜索功能..."
            className="flex-1 bg-transparent text-white/90 text-base outline-none placeholder-white/25" />
          <kbd className="px-2 py-0.5 rounded bg-white/[0.06] border border-white/10 text-white/30 text-xs font-mono">
            Esc
          </kbd>
        </div>

        {/* Results */}
        <div className="max-h-[320px] overflow-y-auto py-2">
          {filtered.length === 0 ? (
            <div className="px-5 py-8 text-center text-white/30 text-sm">没有匹配的结果</div>
          ) : (
            filtered.map((item, i) => (
              <button key={item.id}
                className={`w-full flex items-center gap-3 px-5 py-2.5 text-left transition-colors
                  ${i === selectedIdx ? 'bg-amber-500/15' : 'hover:bg-white/[0.04]'}`}
                onClick={() => { onSelect(item.action); onClose() }}
                onMouseEnter={() => setSelectedIdx(i)}>
                <span className="text-lg w-7 text-center">{item.icon}</span>
                <span className="flex-1 text-sm text-white/80">{item.label}</span>
                <span className="text-xs text-white/30">{item.category}</span>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  )
}

export default memo(SearchPalette)
