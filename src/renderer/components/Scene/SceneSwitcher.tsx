import { useRef, memo } from 'react'
import { useSceneStore } from '@/stores/sceneStore'
import { useAudioStore } from '@/stores/audioStore'
import type { Scene } from '../../../shared/types'

interface Props {
  visible: boolean
  onClose: () => void
}

function SceneSwitcher({ visible, onClose }: Props) {
  const scenes = useSceneStore(s => s.scenes)
  const currentSceneId = useSceneStore(s => s.currentSceneId)
  const switchScene = useSceneStore(s => s.switchScene)
  const addUserScene = useSceneStore(s => s.addUserScene)
  const loadSceneSounds = useAudioStore(s => s.loadSceneSounds)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSwitch = (id: string) => {
    switchScene(id)
    const scene = scenes.find(s => s.id === id)
    if (scene) loadSceneSounds(scene.sounds)
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    const reader = new FileReader()
    reader.onload = (ev) => {
      const newScene: Scene = {
        id: `user-${Date.now()}`,
        name: file.name.replace(/\.[^.]+$/, '').slice(0, 6),
        image: ev.target?.result as string,
        sounds: [], isBuiltin: false,
      }
      addUserScene(newScene)
      switchScene(newScene.id)
    }
    reader.readAsDataURL(file)
    e.target.value = ''
  }

  return (
    <div className="p-8">
      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileChange} />

      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-3">
          <span className="text-xl">🖼️</span>
          <h3 className="text-lg font-medium text-white tracking-wide">场景</h3>
          <span className="text-sm text-amber-200/60 bg-amber-400/15 px-3 py-1 rounded-full border border-amber-400/15">
            {scenes.length}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3">
        {scenes.map(scene => (
          <button key={scene.id} onClick={() => handleSwitch(scene.id)}
            className={`scene-thumb relative w-full h-[80px] rounded-xl overflow-hidden group
              ${scene.id === currentSceneId ? 'active' : ''}`}
            title={scene.name}>
            {scene.image ? (
              <img src={scene.image} alt={scene.name} className="h-full w-full object-cover"
                style={{ filter: 'brightness(0.75) saturate(1.15)' }} />
            ) : (
              <div className="h-full w-full bg-gradient-to-br from-amber-900/30 to-stone-900/50 flex items-center justify-center">
                <span className="text-sm text-white/70">{scene.name.slice(0, 2)}</span>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 text-[11px] text-white/90 text-center py-1 font-medium tracking-wide">
              {scene.name}
            </div>
          </button>
        ))}

        <button onClick={() => fileInputRef.current?.click()}
          className="w-full h-[80px] rounded-xl overflow-hidden
            border border-dashed border-amber-400/20 hover:border-amber-400/35
            bg-gradient-to-b from-amber-500/5 to-transparent hover:from-amber-500/10
            flex items-center justify-center transition-all duration-300 group">
          <span className="text-amber-300/35 text-3xl group-hover:text-amber-300/60 transition-colors">+</span>
        </button>
      </div>
    </div>
  )
}

export default memo(SceneSwitcher)
