import { useState, memo } from 'react'
import { useNotesStore } from '@/stores/notesStore'

interface Props {
  visible: boolean
  onClose: () => void
}

function NotesPanel({ visible, onClose }: Props) {
  const { notes, addNote, deleteNote, updateNote } = useNotesStore()
  const [newNote, setNewNote] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)

  const handleAdd = () => {
    if (!newNote.trim()) return
    addNote(newNote.trim())
    setNewNote('')
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAdd() }
  }

  const fmtTime = (ts: number) => {
    const d = new Date(ts)
    return `${d.getMonth() + 1}/${d.getDate()} ${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`
  }

  return (
    <div className="p-8 flex flex-col" style={{ minHeight: '400px', maxHeight: 'calc(85vh - 48px)' }}>
      <div className="flex items-center gap-3 mb-5 flex-shrink-0">
        <span className="text-xl">📝</span>
        <h3 className="text-lg font-medium text-white tracking-wide">笔记</h3>
        <span className="text-sm text-amber-200/60 bg-amber-400/15 px-3 py-1 rounded-full border border-amber-400/15">
          {notes.length}
        </span>
      </div>

      {/* Input */}
      <div className="mb-4 flex-shrink-0">
        <div className="flex gap-2">
          <textarea value={newNote} onChange={e => setNewNote(e.target.value)}
            onKeyDown={handleKeyDown} placeholder="记点什么..." rows={2}
            className="flex-1 text-sm rounded-xl px-4 py-2.5 text-white/90 placeholder-white/25
              bg-white/[0.05] border border-white/10 outline-none resize-none
              focus:border-amber-400/30 transition-colors" />
          <button onClick={handleAdd} disabled={!newNote.trim()}
            className="self-end px-4 py-2.5 rounded-xl text-sm font-medium
              bg-amber-500/20 text-amber-200/80 hover:bg-amber-500/30
              disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-200">
            添加
          </button>
        </div>
        <div className="text-[10px] text-white/25 mt-1.5">Enter 发送 · Shift+Enter 换行</div>
      </div>

      {/* List */}
      <div className="flex-1 overflow-y-auto space-y-2.5">
        {notes.length === 0 ? (
          <EmptyState />
        ) : (
          notes.map(note => (
            <div key={note.id}
              className="group p-3.5 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] transition-colors">
              <div className="flex items-start justify-between gap-2">
                {editingId === note.id ? (
                  <textarea defaultValue={note.content}
                    onBlur={e => { updateNote(note.id, e.target.value); setEditingId(null) }}
                    autoFocus rows={3}
                    className="flex-1 text-sm text-white/90 bg-transparent border border-amber-400/20 rounded-lg px-2 py-1 outline-none resize-none" />
                ) : (
                  <p className="flex-1 text-sm text-white/70 leading-relaxed whitespace-pre-wrap cursor-pointer"
                    onClick={() => setEditingId(note.id)}>
                    {note.content}
                  </p>
                )}
                <button onClick={() => deleteNote(note.id)}
                  className="text-white/20 hover:text-red-400/70 text-sm opacity-0 group-hover:opacity-100 transition-all flex-shrink-0">
                  ✕
                </button>
              </div>
              <div className="text-[10px] text-white/25 mt-2">{fmtTime(note.createdAt)}</div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-12 text-center">
      <div className="text-4xl mb-3 opacity-40">📋</div>
      <p className="text-sm text-white/30 mb-1">还没有笔记</p>
      <p className="text-xs text-white/20">在上方输入框记录你的学习心得</p>
    </div>
  )
}

export default memo(NotesPanel)
