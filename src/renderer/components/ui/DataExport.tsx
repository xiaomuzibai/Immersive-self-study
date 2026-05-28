import { useState, useEffect, memo } from 'react'
import { useStatsStore } from '@/stores/statsStore'

interface Props {
  visible: boolean
  onClose: () => void
}

function DataExport({ visible, onClose }: Props) {
  const { sessions, loadStats } = useStatsStore()
  const [format, setFormat] = useState<'csv' | 'json'>('csv')

  useEffect(() => { if (visible) loadStats() }, [visible, loadStats])

  const handleExport = () => {
    let content: string
    let filename: string
    let mime: string

    if (format === 'csv') {
      const header = 'id,start_time,end_time,duration_minutes,type,completed'
      const rows = sessions.map(s =>
        `${s.id},${s.start_time},${s.end_time},${s.duration_minutes},${s.type},${s.completed}`
      )
      content = [header, ...rows].join('\n')
      filename = `study-sessions-${new Date().toISOString().slice(0, 10)}.csv`
      mime = 'text/csv'
    } else {
      content = JSON.stringify(sessions, null, 2)
      filename = `study-sessions-${new Date().toISOString().slice(0, 10)}.json`
      mime = 'application/json'
    }

    const blob = new Blob([content], { type: mime })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-6">
        <span className="text-xl">📤</span>
        <h3 className="text-lg font-medium text-white tracking-wide">导出数据</h3>
      </div>

      <div className="space-y-4">
        <div className="p-4 rounded-xl bg-white/[0.04]">
          <p className="text-sm text-white/60 mb-3">
            导出 {sessions.length} 条学习记录
          </p>
          <div className="flex gap-3">
            <button onClick={() => { setFormat('csv'); handleExport() }}
              className="flex-1 py-3 rounded-xl text-sm font-medium
                bg-amber-500/15 text-amber-200/80 hover:bg-amber-500/25
                border border-amber-400/15 transition-all">
              CSV 格式
            </button>
            <button onClick={() => { setFormat('json'); handleExport() }}
              className="flex-1 py-3 rounded-xl text-sm font-medium
                bg-white/[0.06] text-white/70 hover:bg-white/10
                border border-white/[0.06] transition-all">
              JSON 格式
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(DataExport)
