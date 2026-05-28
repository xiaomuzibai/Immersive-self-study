import { useRef } from 'react'
import { useSceneStore } from '@/stores/sceneStore'
import type { Scene } from '../../../shared/types'

interface Props {
  onImported?: () => void
}

export default function SceneImport({ onImported }: Props) {
  const fileRef = useRef<HTMLInputElement>(null)
  const addUserScene = useSceneStore(s => s.addUserScene)

  const handleFile = (file: File) => {
    if (!file.type.startsWith('image/')) return

    const reader = new FileReader()
    reader.onload = (e) => {
      const dataUrl = e.target?.result as string
      const scene: Scene = {
        id: `user-${Date.now()}`,
        name: file.name.replace(/\.[^.]+$/, ''),
        image: dataUrl,
        sounds: [],
        isBuiltin: false,
      }
      addUserScene(scene)
      onImported?.()
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  return (
    <div
      className="w-16 h-10 rounded-lg border-2 border-dashed border-white/30 hover:border-white/60
        flex items-center justify-center cursor-pointer transition-colors flex-shrink-0"
      onClick={() => fileRef.current?.click()}
      onDrop={handleDrop}
      onDragOver={e => e.preventDefault()}
      title="导入场景图片"
    >
      <span className="text-white/60 text-lg">+</span>
      <input
        ref={fileRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        className="hidden"
        onChange={handleChange}
      />
    </div>
  )
}