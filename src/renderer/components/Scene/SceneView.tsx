import { useState, useEffect } from 'react'
import { useSceneStore } from '@/stores/sceneStore'

function makeSvg(svg: string) {
  return `data:image/svg+xml,${encodeURIComponent(svg)}`
}

const SVG_SCENES: Record<string, string> = {
  'warm-cabin': makeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080">
    <defs>
      <radialGradient id="lamp" cx="30%" cy="50%" r="45%"><stop offset="0%" stop-color="#d4923a" stop-opacity="0.4"/><stop offset="60%" stop-color="#1a1410" stop-opacity="0.1"/><stop offset="100%" stop-color="#0e0b08" stop-opacity="0"/></radialGradient>
      <radialGradient id="fire2" cx="72%" cy="70%" r="20%"><stop offset="0%" stop-color="#c0522a" stop-opacity="0.25"/><stop offset="100%" stop-color="#0e0b08" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="1920" height="1080" fill="#0e0b08"/>
    <rect width="1920" height="1080" fill="url(#lamp)"/>
    <rect width="1920" height="1080" fill="url(#fire2)"/>
    <ellipse cx="600" cy="500" rx="200" ry="260" fill="#1a1410" opacity="0.4"/>
    <rect x="560" y="320" width="80" height="200" rx="6" fill="#2a1f16" opacity="0.35"/>
    <circle cx="600" cy="350" r="30" fill="#d4923a" opacity="0.35"/>
    <circle cx="600" cy="350" r="15" fill="#f0c060" opacity="0.25"/>
    <circle cx="600" cy="350" r="6" fill="#fff8e0" opacity="0.15"/>
    <rect x="1150" y="580" width="220" height="140" rx="10" fill="#1a1410" opacity="0.3"/>
    <circle cx="1260" cy="630" r="35" fill="#c0522a" opacity="0.15"/>
    <circle cx="1260" cy="630" r="18" fill="#e07040" opacity="0.1"/>
    <rect x="300" y="700" width="1400" height="2" fill="#d4923a" opacity="0.04"/>
  </svg>`),

  'misty-forest': makeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080">
    <defs>
      <linearGradient id="mSky" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#0e1510"/><stop offset="100%" stop-color="#0a0f0b"/></linearGradient>
      <radialGradient id="mMist" cx="50%" cy="65%" r="55%"><stop offset="0%" stop-color="#3a5a40" stop-opacity="0.18"/><stop offset="100%" stop-color="#0a0f0b" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="1920" height="1080" fill="url(#mSky)"/>
    <rect width="1920" height="1080" fill="url(#mMist)"/>
    <polygon points="150,1080 320,280 490,1080" fill="#0f1a12" opacity="0.65"/>
    <polygon points="380,1080 560,180 740,1080" fill="#0d1610" opacity="0.55"/>
    <polygon points="650,1080 860,220 1070,1080" fill="#0e1811" opacity="0.6"/>
    <polygon points="950,1080 1150,160 1350,1080" fill="#0c1410" opacity="0.5"/>
    <polygon points="1250,1080 1450,260 1650,1080" fill="#0f1a12" opacity="0.55"/>
    <polygon points="1500,1080 1720,320 1920,1080" fill="#0d1610" opacity="0.45"/>
    <rect x="0" y="680" width="1920" height="400" fill="#0a0e0a" opacity="0.4"/>
    <ellipse cx="960" cy="720" rx="700" ry="80" fill="#4a6a50" opacity="0.06"/>
    <ellipse cx="600" cy="760" rx="400" ry="40" fill="#3a5a40" opacity="0.05"/>
  </svg>`),

  'spring-garden': makeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080">
    <defs>
      <radialGradient id="sSun" cx="65%" cy="25%" r="38%"><stop offset="0%" stop-color="#f0d880" stop-opacity="0.2"/><stop offset="100%" stop-color="#0e110b" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="1920" height="1080" fill="#0e110b"/>
    <rect width="1920" height="1080" fill="url(#sSun)"/>
    <circle cx="280" cy="380" r="9" fill="#e8a0b8" opacity="0.35"/>
    <circle cx="300" cy="360" r="6" fill="#f0b8d0" opacity="0.3"/>
    <circle cx="260" cy="400" r="7" fill="#d890a8" opacity="0.25"/>
    <circle cx="480" cy="280" r="10" fill="#e8a0b8" opacity="0.3"/>
    <circle cx="500" cy="260" r="6" fill="#f0c0d8" opacity="0.25"/>
    <circle cx="1380" cy="330" r="8" fill="#e8a0b8" opacity="0.25"/>
    <circle cx="1400" cy="310" r="11" fill="#f0b8d0" opacity="0.2"/>
    <circle cx="1360" cy="350" r="7" fill="#d890a8" opacity="0.28"/>
    <circle cx="780" cy="230" r="7" fill="#f0c8d8" opacity="0.2"/>
    <circle cx="1080" cy="260" r="9" fill="#e8a8c0" opacity="0.18"/>
    <circle cx="1580" cy="380" r="8" fill="#e8a0b8" opacity="0.2"/>
    <circle cx="1600" cy="360" r="5" fill="#f0c0d8" opacity="0.18"/>
    <circle cx="650" cy="400" r="5" fill="#f0c0d0" opacity="0.15"/>
    <circle cx="950" cy="350" r="6" fill="#e8a0b8" opacity="0.13"/>
    <rect x="0" y="730" width="1920" height="350" fill="#0c0f09" opacity="0.5"/>
  </svg>`),

  'moonlight': makeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080">
    <defs>
      <radialGradient id="mo" cx="50%" cy="28%" r="32%"><stop offset="0%" stop-color="#c0d8f0" stop-opacity="0.25"/><stop offset="100%" stop-color="#080a10" stop-opacity="0"/></radialGradient>
      <linearGradient id="wa" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stop-color="#101828"/><stop offset="100%" stop-color="#080c14"/></linearGradient>
    </defs>
    <rect width="1920" height="1080" fill="#080a10"/>
    <rect width="1920" height="1080" fill="url(#mo)"/>
    <circle cx="960" cy="260" r="55" fill="#d0e0f0" opacity="0.18"/>
    <circle cx="960" cy="260" r="35" fill="#e0eaf5" opacity="0.12"/>
    <circle cx="960" cy="260" r="18" fill="#f0f5ff" opacity="0.08"/>
    <rect x="0" y="560" width="1920" height="520" fill="url(#wa)" opacity="0.75"/>
    <ellipse cx="960" cy="580" rx="320" ry="8" fill="#c0d8f0" opacity="0.05"/>
    <ellipse cx="960" cy="600" rx="220" ry="5" fill="#c0d8f0" opacity="0.035"/>
    <ellipse cx="960" cy="620" rx="160" ry="3" fill="#c0d8f0" opacity="0.025"/>
    <circle cx="380" cy="130" r="1.5" fill="#fff" opacity="0.25"/>
    <circle cx="1180" cy="90" r="1.2" fill="#fff" opacity="0.2"/>
    <circle cx="680" cy="70" r="1" fill="#fff" opacity="0.18"/>
    <circle cx="1480" cy="180" r="1.3" fill="#fff" opacity="0.22"/>
    <circle cx="280" cy="230" r="0.8" fill="#fff" opacity="0.15"/>
    <circle cx="1650" cy="120" r="1" fill="#fff" opacity="0.17"/>
  </svg>`),

  'cozy-nook': makeSvg(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1920 1080">
    <defs>
      <radialGradient id="cG1" cx="28%" cy="48%" r="38%"><stop offset="0%" stop-color="#c88040" stop-opacity="0.3"/><stop offset="100%" stop-color="#0e0c08" stop-opacity="0"/></radialGradient>
      <radialGradient id="cG2" cx="73%" cy="58%" r="28%"><stop offset="0%" stop-color="#b07030" stop-opacity="0.18"/><stop offset="100%" stop-color="#0e0c08" stop-opacity="0"/></radialGradient>
    </defs>
    <rect width="1920" height="1080" fill="#0e0c08"/>
    <rect width="1920" height="1080" fill="url(#cG1)"/>
    <rect width="1920" height="1080" fill="url(#cG2)"/>
    <rect x="180" y="330" width="420" height="300" rx="14" fill="#1a1510" opacity="0.4"/>
    <rect x="200" y="350" width="380" height="260" rx="10" fill="#221c14" opacity="0.3"/>
    <rect x="1280" y="380" width="370" height="270" rx="12" fill="#1a1510" opacity="0.35"/>
    <circle cx="390" cy="430" r="45" fill="#c88040" opacity="0.12"/>
    <circle cx="390" cy="430" r="22" fill="#e0a050" opacity="0.08"/>
    <circle cx="390" cy="430" r="8" fill="#fff0c0" opacity="0.05"/>
    <rect x="1330" y="430" width="130" height="90" rx="5" fill="#2a2018" opacity="0.3"/>
    <circle cx="1395" cy="460" r="18" fill="#d09040" opacity="0.1"/>
  </svg>`),
}

export default function SceneView() {
  const currentScene = useSceneStore(s => s.currentScene())
  const [displayedImage, setDisplayedImage] = useState<string>('')
  const [isTransitioning, setIsTransitioning] = useState(false)

  useEffect(() => {
    if (!currentScene) return
    const newImage = SVG_SCENES[currentScene.id] || currentScene.image
    if (!displayedImage) {
      setDisplayedImage(newImage)
      return
    }
    if (newImage === displayedImage) return

    setIsTransitioning(true)
    const timer = setTimeout(() => {
      setDisplayedImage(newImage)
      setIsTransitioning(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [currentScene?.id])

  const hasImage = !!displayedImage

  return (
    <div className="absolute inset-0 overflow-hidden bg-[#0a0a0c]">
      {hasImage ? (
        <>
          <img
            src={displayedImage}
            alt={currentScene?.name}
            className={'h-full w-full object-cover transition-all duration-1000 ease-in-out ' + (isTransitioning ? 'opacity-0 scale-105 blur-sm' : 'opacity-100 scale-100 blur-0')}
            style={{
              filter: 'brightness(0.7) saturate(1.1) contrast(1.05) sepia(0.12) blur(0.5px)',
            }}
            draggable={false}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at 50% 50%, rgba(255,180,100,0.06) 0%, transparent 60%)',
            }}
          />
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'radial-gradient(ellipse at center, transparent 55%, rgba(20,15,10,0.25) 80%, rgba(15,10,6,0.5) 100%)',
            }}
          />
        </>
      ) : (
        <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-[#1a1510] via-[#0f0d0a] to-[#0a0a0c]">
          <div className="text-center animate-breathe">
            <p className="text-7xl mb-6">📚</p>
            <p className="text-white/30 text-xl font-light tracking-[0.3em] mb-2" style={{ fontFamily: "'Quicksand', sans-serif" }}>
              {currentScene?.name ?? '自习室'}
            </p>
            <p className="text-white/15 text-sm tracking-wider">
              沉浸其中，静心自习
            </p>
          </div>
        </div>
      )}
    </div>
  )
}
