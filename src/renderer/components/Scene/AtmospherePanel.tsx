import { memo } from 'react'
import { useAtmosphereStore } from '@/stores/atmosphereStore'

interface Props {
  visible: boolean
  onClose: () => void
}

const LAYERS = [
  { key: 'fireflies' as const, icon: '✨', name: '萤火虫' },
  { key: 'bokeh' as const, icon: '💫', name: '散景光斑' },
  { key: 'fog' as const, icon: '🌫️', name: '漂浮雾气' },
  { key: 'lightRays' as const, icon: '☀️', name: '斜射光线' },
]

function AtmospherePanel({ visible, onClose }: Props) {
  const store = useAtmosphereStore()

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-xl">🌌</span>
        <h3 className="text-lg font-medium text-white tracking-wide">氛围效果</h3>
      </div>

      <div className="space-y-3 mb-5">
        {LAYERS.map(layer => (
          <div key={layer.key}
            className="flex items-center justify-between p-3 rounded-xl hover:bg-white/[0.04] transition-colors cursor-pointer"
            onClick={() => store.toggle(layer.key)}>
            <div className="flex items-center gap-3">
              <span className="text-xl">{layer.icon}</span>
              <span className="text-base text-white/70 tracking-wide">{layer.name}</span>
            </div>
            <div className={`w-10 h-5 rounded-full transition-all duration-300 flex items-center
              ${store[layer.key] ? 'bg-amber-500/40 justify-end' : 'bg-white/10 justify-start'}`}>
              <div className={`w-4 h-4 rounded-full mx-0.5 transition-all duration-300
                ${store[layer.key] ? 'bg-amber-300/90' : 'bg-white/30'}`} />
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <button onClick={() => store.setAll(true)}
          className="flex-1 text-xs text-white/50 hover:text-white/80 py-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-all">
          全部开启
        </button>
        <button onClick={() => store.setAll(false)}
          className="flex-1 text-xs text-white/50 hover:text-white/80 py-2.5 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] transition-all">
          全部关闭
        </button>
      </div>
    </div>
  )
}

export default memo(AtmospherePanel)
