import { useState, useEffect, useCallback, memo } from 'react'

const BUILTIN_QUOTES = [
  { text: '我想成为你眼中最亮的光，所以每个深夜我都在拼命燃烧。', author: '奋斗' },
  { text: '你是我所有拼命努力的理由，也是我咬牙坚持时心里的甜。', author: '为你' },
  { text: '我要悄悄拔尖，然后站在你面前说：我配得上你了。', author: '成长' },
  { text: '喜欢你，是我做过最靠近勇敢的事。', author: '勇气' },
  { text: '你不必多好，我喜欢就好；我未必多好，但为了你我会越来越好。', author: '承诺' },
  { text: '全世界都在催我长大，只有你心疼我的小翅膀。而我想为你撑起整片天。', author: '守护' },
  { text: '我努力的意义，就是让你选择生活，而不是被生活选择。', author: '目标' },
  { text: '你是我熬夜学习时的咖啡，是早起奋斗时的闹钟，是所有坚持下去的动力。', author: '动力' },
  { text: '爱一个人最好的方式，是经营好自己，给对方一个优质的爱人。', author: '势均力敌' },
  { text: '我想和你一起变成更好的人，不想成为你的负担，想成为你的骄傲。', author: '并肩' },
  { text: '你是我所有不安的解药，也是我所有野心的起点。', author: '野心' },
  { text: '因为想给你更好的未来，所以今天的苦我甘之如饴。', author: '甘愿' },
  { text: '你是我见过最美的意外，而我想成为你最稳的依赖。', author: '依赖' },
  { text: '我不怕千万人阻挡，只怕自己投降——因为终点有你在等我。', author: '不投降' },
  { text: '你是我写过最长的情书，也是我奋斗时默念的名字。', author: '情书' },
  { text: '喜欢你之后，我的人生计划里每一项都和你有关。', author: '计划' },
  { text: '我要把所有的好运都攒起来，在最好的时候给你一个最好的未来。', author: '攒运气' },
  { text: '你是我眼里藏不住的欢喜，也是我肩上扛得起的责任。', author: '责任' },
  { text: '想牵你的手，从心动到白头，从青丝到华发，从一无所有到应有尽有。', author: '白头' },
  { text: '我所有的努力，都是为了有一天能堂堂正正站在你身旁。', author: '并肩' },
  { text: '你是我最想留住的幸运，也是我最拼命的动力。', author: '幸运' },
  { text: '我想给你一个家，不大但温暖，不贵但用心。', author: '家' },
  { text: '因为你值得最好的，所以我不允许自己平庸。', author: '不平庸' },
  { text: '你是我所有加班的夜晚、早起的清晨、咬牙的瞬间里，唯一的光。', author: '唯一的光' },
  { text: '我不要短暂的温存，只要你一世的陪伴。而我愿用一生奋斗来换。', author: '一世' },
  { text: '你是我见过最温柔的风，而我想成为你最坚固的港。', author: '港湾' },
  { text: '我对你的喜欢，是想把全世界都搬到你面前的那种。', author: '全世界' },
  { text: '你让我想成为一个更好的人，这大概就是爱情最美好的样子。', author: '更好的人' },
  { text: '我想陪你从校服到婚纱，从青涩到成熟，从穷学生到有为青年。', author: '从头到尾' },
  { text: '你是我奋斗的意义，是我坚持的底气，是我所有勇气的来源。', author: '意义' },
]

export type QuotePosition = 'top'

export interface Quote {
  text: string
  author: string
  custom?: boolean
}

interface CardProps {
  visible: boolean
  onDismiss: () => void
}

function loadCustomQuotes(): Quote[] {
  try { return JSON.parse(localStorage.getItem('custom-quotes') || '[]') } catch { return [] }
}

function DailyQuoteCard({ visible, onDismiss }: CardProps) {
  const [quote] = useState(() => {
    const today = new Date()
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
    const all = [...BUILTIN_QUOTES, ...loadCustomQuotes()]
    return all[seed % all.length]
  })

  useEffect(() => {
    if (!visible) return
    const t = setTimeout(onDismiss, 12000)
    return () => clearTimeout(t)
  }, [visible, onDismiss])

  if (!visible) return null

  return (
    <div
      className="fixed top-4 left-0 right-0 mx-auto z-[55] animate-fade-in-down"
      style={{
        maxWidth: '560px',
        background: 'rgba(255,255,255,0.04)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: '14px',
        padding: '22px 40px',
        boxShadow: '0 4px 24px rgba(0,0,0,0.15)',
      }}
    >
      <button
        onClick={onDismiss}
        className="absolute top-2.5 right-2 w-5 h-5 flex items-center justify-center rounded-full
          bg-white/[0.05] hover:bg-white/12 text-white/20 hover:text-white/60
          text-[10px] transition-all duration-200"
      >
        ✕
      </button>
      <p
        className="text-xl leading-relaxed"
        style={{ fontFamily: "'Noto Serif SC', serif", color: 'rgba(255,210,140,0.9)' }}
      >
        {quote.text}
      </p>
      <p className="text-xs mt-3 text-right" style={{ color: 'rgba(255,200,120,0.45)' }}>
        — {quote.author}
      </p>
    </div>
  )
}

interface PanelProps {
  visible: boolean
  onClose: () => void
}

function QuotePanel({ visible, onClose }: PanelProps) {
  const [customQuotes, setCustomQuotes] = useState<Quote[]>(() => {
    try { return JSON.parse(localStorage.getItem('custom-quotes') || '[]') } catch { return [] }
  })
  const [idx, setIdx] = useState(() => {
    const today = new Date()
    const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate()
    return seed % BUILTIN_QUOTES.length
  })
  const [showAdd, setShowAdd] = useState(false)
  const [newText, setNewText] = useState('')
  const [newAuthor, setNewAuthor] = useState('')

  const allQuotes: Quote[] = [...BUILTIN_QUOTES, ...customQuotes]
  const quote = allQuotes[idx % allQuotes.length]

  const next = useCallback(() => setIdx(i => (i + 1) % allQuotes.length), [allQuotes.length])
  const prev = useCallback(() => setIdx(i => (i - 1 + allQuotes.length) % allQuotes.length), [allQuotes.length])

  const addQuote = useCallback(() => {
    if (!newText.trim()) return
    const q: Quote = { text: newText.trim(), author: newAuthor.trim() || '佚名', custom: true }
    const updated = [...customQuotes, q]
    setCustomQuotes(updated)
    localStorage.setItem('custom-quotes', JSON.stringify(updated))
    setNewText('')
    setNewAuthor('')
    setShowAdd(false)
    setIdx(BUILTIN_QUOTES.length + updated.length - 1)
  }, [newText, newAuthor, customQuotes])

  const deleteQuote = useCallback((customIdx: number) => {
    const updated = customQuotes.filter((_, i) => i !== customIdx)
    setCustomQuotes(updated)
    localStorage.setItem('custom-quotes', JSON.stringify(updated))
    if (idx >= BUILTIN_QUOTES.length + updated.length) {
      setIdx(Math.max(0, BUILTIN_QUOTES.length + updated.length - 1))
    }
  }, [customQuotes, idx])

  if (!visible) return null

  const isCustom = idx >= BUILTIN_QUOTES.length

  return (
    <div className="p-8 space-y-5">

      {/* Current quote preview */}
      <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <p className="text-sm text-white/70 leading-relaxed mb-1.5" style={{ fontFamily: "'Noto Serif SC', serif" }}>
          "{quote.text}"
        </p>
        <p className="text-[11px] text-white/25 text-right">— {quote.author}</p>
        {isCustom && (
          <button onClick={() => deleteQuote(idx - BUILTIN_QUOTES.length)}
            className="mt-2 text-[10px] text-red-300/40 hover:text-red-300/70 transition-colors">
            删除此条
          </button>
        )}
      </div>

      {/* Switch controls */}
      <div className="flex items-center justify-center gap-4">
        <button onClick={prev}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/[0.05] hover:bg-white/10 text-white/30 hover:text-white/70 text-lg transition-all">
          ‹
        </button>
        <span className="text-xs text-white/20 min-w-[50px] text-center">{idx + 1} / {allQuotes.length}</span>
        <button onClick={next}
          className="w-9 h-9 flex items-center justify-center rounded-full bg-white/[0.05] hover:bg-white/10 text-white/30 hover:text-white/70 text-lg transition-all">
          ›
        </button>
      </div>

      {/* Add */}
      <div>
        <button onClick={() => setShowAdd(v => !v)}
          className="w-full py-2.5 rounded-lg text-xs font-medium transition-all duration-300 border border-dashed
            border-white/[0.08] text-white/25 hover:border-amber-400/25 hover:text-amber-200/60 hover:bg-white/[0.02]">
          + 添加自定义格言
        </button>
        {showAdd && (
          <div className="mt-2.5 space-y-2">
            <input type="text" value={newText} onChange={e => setNewText(e.target.value)}
              placeholder="格言内容"
              className="w-full px-3 py-2 rounded-lg text-sm text-white/80 placeholder-white/20
                bg-white/[0.03] border border-white/[0.06] focus:border-amber-400/20 outline-none transition-colors"
              onKeyDown={e => e.key === 'Enter' && addQuote()} />
            <div className="flex gap-2">
              <input type="text" value={newAuthor} onChange={e => setNewAuthor(e.target.value)}
                placeholder="作者（选填）"
                className="flex-1 px-3 py-2 rounded-lg text-sm text-white/80 placeholder-white/20
                  bg-white/[0.03] border border-white/[0.06] focus:border-amber-400/20 outline-none transition-colors"
                onKeyDown={e => e.key === 'Enter' && addQuote()} />
              <button onClick={addQuote}
                className="px-4 py-2 rounded-lg text-sm font-medium
                  bg-gradient-to-r from-amber-500/20 to-orange-500/15 border border-amber-400/25
                  text-amber-100/80 hover:from-amber-500/30 hover:to-orange-500/25 transition-all">
                添加
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export { DailyQuoteCard, QuotePanel }
