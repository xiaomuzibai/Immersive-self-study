import { useState, memo } from 'react'
import { useThemeStore, THEMES } from '@/stores/themeStore'

interface Props {
  visible: boolean
  onClose: () => void
}

function ThemeSwitcher({ visible, onClose }: Props) {
  const current = useThemeStore(s => s.current)
  const setTheme = useThemeStore(s => s.setTheme)
  const [preview, setPreview] = useState<string | null>(null)

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-xl">🎨</span>
        <h3 className="text-lg font-medium text-white tracking-wide">主题</h3>
      </div>

      <div className="space-y-3">
        {THEMES.map(theme => (
          <button
            key={theme.id}
            onClick={() => { setTheme(theme.id); onClose() }}
            onMouseEnter={() => setPreview(theme.id)}
            onMouseLeave={() => setPreview(null)}
            className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all duration-300
              ${(preview || current) === theme.id
                ? 'bg-gradient-to-r from-amber-500/15 to-amber-600/8 ring-1 ring-amber-400/25'
                : 'bg-white/[0.04] hover:bg-white/[0.08]'}`}
          >
            <span className="text-2xl">{theme.icon}</span>
            <div className="flex-1 text-left">
              <div className={`text-base font-medium tracking-wide
                ${current === theme.id ? 'text-amber-200/90' : 'text-white/70'}`}>
                {theme.name}
              </div>
            </div>
            <div className="flex gap-1.5">
              <div className="w-5 h-5 rounded-full border border-white/10" style={{ background: theme.colors.bg }} />
              <div className="w-5 h-5 rounded-full border border-white/10" style={{ background: theme.colors.glass }} />
              <div className="w-5 h-5 rounded-full border border-white/10" style={{ background: theme.colors.accent }} />
            </div>
            {current === theme.id && (
              <div className="w-2 h-2 rounded-full bg-amber-400/80" />
            )}
          </button>
        ))}
      </div>
    </div>
  )
}

export default memo(ThemeSwitcher)
