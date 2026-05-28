import { create } from 'zustand'
import type { Scene } from '../../shared/types'

const BUILTIN_SCENES: Scene[] = [
  { id: 'rainy-study', name: '云海日落', image: './scenes/rainy-study.jpg', sounds: [{ soundId: 'music-01', volume: 0.5 }], isBuiltin: true },
  { id: 'sunset-beach', name: '落日沙滩', image: './scenes/sunset-beach.jpg', sounds: [{ soundId: 'music-02', volume: 0.5 }], isBuiltin: true },
  { id: 'coffee-shop', name: '碧湖泛舟', image: './scenes/coffee-shop.jpg', sounds: [{ soundId: 'music-04', volume: 0.5 }], isBuiltin: true },
  { id: 'snow-fireplace', name: '远山木舟', image: './scenes/snow-fireplace.jpg', sounds: [{ soundId: 'music-05', volume: 0.5 }], isBuiltin: true },
  { id: 'stargazing', name: '雪林雾境', image: './scenes/stargazing.jpg', sounds: [{ soundId: 'music-06', volume: 0.5 }], isBuiltin: true },
  { id: 'zen-garden', name: '银河星空', image: './scenes/zen-garden.jpg', sounds: [{ soundId: 'music-08', volume: 0.5 }], isBuiltin: true },
  { id: 'warm-cabin', name: '暖光小屋', image: '', sounds: [{ soundId: 'music-03', volume: 0.5 }], isBuiltin: true },
  { id: 'misty-forest', name: '迷雾森林', image: '', sounds: [{ soundId: 'music-07', volume: 0.5 }], isBuiltin: true },
  { id: 'autumn-path', name: '绿野迷踪', image: './scenes/autumn-path.jpg', sounds: [{ soundId: 'music-12', volume: 0.5 }], isBuiltin: true },
  { id: 'spring-garden', name: '春日花园', image: '', sounds: [{ soundId: 'music-09', volume: 0.5 }], isBuiltin: true },
  { id: 'moonlight', name: '月光湖畔', image: '', sounds: [{ soundId: 'music-10', volume: 0.5 }], isBuiltin: true },
  { id: 'cozy-nook', name: '温馨角落', image: '', sounds: [{ soundId: 'music-11', volume: 0.5 }], isBuiltin: true },
]

interface SceneState {
  scenes: Scene[]
  currentSceneId: string | null
  currentScene: () => Scene | null
  setScenes: (scenes: Scene[]) => void
  switchScene: (id: string) => void
  nextScene: () => void
  prevScene: () => void
  addUserScene: (scene: Scene) => void
  removeUserScene: (id: string) => void
}

export const useSceneStore = create<SceneState>((set, get) => ({
  scenes: BUILTIN_SCENES,
  currentSceneId: BUILTIN_SCENES[0]?.id ?? null,
  currentScene: () => {
    const { scenes, currentSceneId } = get()
    return scenes.find(s => s.id === currentSceneId) ?? null
  },
  setScenes: (scenes) => set({ scenes }),
  switchScene: (id) => set({ currentSceneId: id }),
  nextScene: () => {
    const { scenes, currentSceneId } = get()
    const idx = scenes.findIndex(s => s.id === currentSceneId)
    const next = (idx + 1) % scenes.length
    set({ currentSceneId: scenes[next].id })
  },
  prevScene: () => {
    const { scenes, currentSceneId } = get()
    const idx = scenes.findIndex(s => s.id === currentSceneId)
    const prev = (idx - 1 + scenes.length) % scenes.length
    set({ currentSceneId: scenes[prev].id })
  },
  addUserScene: (scene) => set(state => ({ scenes: [...state.scenes, scene] })),
  removeUserScene: (id) => set(state => ({
    scenes: state.scenes.filter(s => s.id !== id),
    currentSceneId: state.currentSceneId === id ? state.scenes[0]?.id ?? null : state.currentSceneId
  })),
}))
