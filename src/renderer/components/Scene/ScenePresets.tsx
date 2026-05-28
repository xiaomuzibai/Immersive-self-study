import { memo } from 'react'
import { useSceneStore } from '@/stores/sceneStore'
import { useAudioStore } from '@/stores/audioStore'
import { useAmbientStore } from '@/stores/ambientStore'
import { useWhiteNoiseStore } from '@/stores/whiteNoiseStore'
import { useAtmosphereStore } from '@/stores/atmosphereStore'

interface Props {
  visible: boolean
  onClose: () => void
}

interface Preset {
  id: string
  name: string
  icon: string
  scene: string
  sounds: { soundId: string; volume: number }[]
  ambient: string[]
  whiteNoise: string[]
  atmosphere: { fireflies: boolean; bokeh: boolean; fog: boolean; lightRays: boolean }
}

const PRESETS: Preset[] = [
  {
    id: 'deep-night', name: '雨夜书房', icon: '🌧️',
    scene: 'rainy-study',
    sounds: [{ soundId: 'music-01', volume: 0.3 }],
    ambient: ['rain'],
    whiteNoise: [],
    atmosphere: { fireflies: false, bokeh: false, fog: true, lightRays: false },
  },
  {
    id: 'morning-cafe', name: '清晨咖啡', icon: '☕',
    scene: 'coffee-shop',
    sounds: [{ soundId: 'music-04', volume: 0.4 }],
    ambient: ['keyboard'],
    whiteNoise: [],
    atmosphere: { fireflies: false, bokeh: true, fog: false, lightRays: true },
  },
  {
    id: 'rain-focus', name: '雨中漫步', icon: '🌿',
    scene: 'misty-forest',
    sounds: [{ soundId: 'music-07', volume: 0.3 }],
    ambient: ['rain', 'thunder'],
    whiteNoise: ['brown'],
    atmosphere: { fireflies: false, bokeh: false, fog: true, lightRays: false },
  },
  {
    id: 'sunset-calm', name: '日落海边', icon: '🌅',
    scene: 'sunset-beach',
    sounds: [{ soundId: 'music-02', volume: 0.4 }],
    ambient: ['wind'],
    whiteNoise: [],
    atmosphere: { fireflies: false, bokeh: true, fog: false, lightRays: true },
  },
  {
    id: 'winter-warm', name: '冬日壁炉', icon: '🔥',
    scene: 'snow-fireplace',
    sounds: [{ soundId: 'music-05', volume: 0.35 }],
    ambient: ['fire'],
    whiteNoise: [],
    atmosphere: { fireflies: false, bokeh: true, fog: false, lightRays: false },
  },
  {
    id: 'stargazing', name: '星空露营', icon: '⭐',
    scene: 'stargazing',
    sounds: [{ soundId: 'music-06', volume: 0.3 }],
    ambient: ['bird'],
    whiteNoise: ['pink'],
    atmosphere: { fireflies: true, bokeh: true, fog: false, lightRays: false },
  },
]

function ScenePresets({ visible, onClose }: Props) {
  const applyPreset = (preset: Preset) => {
    // Set scene
    useSceneStore.getState().switchScene(preset.scene)
    const scene = useSceneStore.getState().scenes.find(s => s.id === preset.scene)
    if (scene) useAudioStore.getState().loadSceneSounds(scene.sounds)

    // Set ambient
    useAmbientStore.getState().clearAll()
    for (const id of preset.ambient) {
      useAmbientStore.getState().toggle(id as any)
    }

    // Set white noise
    useWhiteNoiseStore.getState().clearAll()
    for (const id of preset.whiteNoise) {
      useWhiteNoiseStore.getState().toggle(id as any)
    }

    // Set atmosphere
    const atm = useAtmosphereStore.getState()
    for (const [key, val] of Object.entries(preset.atmosphere)) {
      if (atm[key as keyof typeof atm] !== val) atm.toggle(key as any)
    }

    onClose()
  }

  return (
    <div className="p-8">
      <div className="flex items-center gap-3 mb-5">
        <span className="text-xl">💡</span>
        <h3 className="text-lg font-medium text-white tracking-wide">场景预设</h3>
      </div>
      <p className="text-xs text-white/40 mb-4">一键切换场景+音乐+氛围的组合</p>

      <div className="grid grid-cols-2 gap-3">
        {PRESETS.map(preset => (
          <button key={preset.id} onClick={() => applyPreset(preset)}
            className="p-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08]
              border border-white/[0.06] hover:border-amber-400/20
              transition-all duration-300 text-left group">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">{preset.icon}</div>
            <div className="text-sm font-medium text-white/80 tracking-wide">{preset.name}</div>
            <div className="text-[10px] text-white/30 mt-1">
              {preset.sounds.length}首音乐 · {preset.ambient.length}环境音
              {preset.whiteNoise.length > 0 ? ` · ${preset.whiteNoise.length}白噪` : ''}
            </div>
          </button>
        ))}
      </div>
    </div>
  )
}

export default memo(ScenePresets)
