import { useEffect, memo, type ReactNode } from 'react'

interface Props {
  side: 'left' | 'right' | 'center'
  visible: boolean
  onClose: () => void
  width?: number
  children: ReactNode
}

function Drawer({ side, visible, onClose, width = 840, children }: Props) {
  useEffect(() => {
    if (!visible) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [visible, onClose])

  const isCenter = side === 'center'

  return (
    <>
      {/* Backdrop */}
      <div
        className={`fixed inset-0 z-[60] transition-opacity duration-400 ${
          visible ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
        style={{ background: 'rgba(10,8,6,0.35)', backdropFilter: 'blur(4px)' }}
        onClick={onClose}
      />

      {/* Panel */}
      <div
        className={`fixed z-[61] transition-all duration-400 ease-out overflow-hidden
          ${visible ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
        style={isCenter ? {
          top: '50%',
          left: '50%',
          transform: visible ? 'translate(-50%, -50%)' : 'translate(-50%, -50%) scale(0.95)',
          width,
          maxHeight: '85vh',
          background: 'linear-gradient(135deg, rgba(30,22,14,0.55), rgba(20,16,10,0.5))',
          backdropFilter: 'blur(32px) saturate(1.6)',
          WebkitBackdropFilter: 'blur(32px) saturate(1.6)',
          border: '1px solid rgba(255,200,140,0.15)',
          borderRadius: '20px',
          boxShadow: '0 24px 80px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,220,180,0.08)',
        } : {
          top: 0,
          bottom: 0,
          [side]: 0,
          width,
          background: 'linear-gradient(135deg, rgba(20,15,10,0.97) 0%, rgba(15,12,8,0.98) 100%)',
          borderRight: side === 'left' ? '1px solid rgba(255,200,140,0.1)' : 'none',
          borderLeft: side === 'right' ? '1px solid rgba(255,200,140,0.1)' : 'none',
          boxShadow: side === 'left'
            ? '8px 0 40px rgba(0,0,0,0.5)'
            : '-8px 0 40px rgba(0,0,0,0.5)',
        }}
        onClick={e => e.stopPropagation()}
      >
        {/* Decorative top glow */}
        <div className="absolute top-0 left-[10%] right-[10%] h-px"
          style={{ background: 'linear-gradient(to right, transparent, rgba(255,200,140,0.2), transparent)' }} />

        <div className={`${isCenter ? '' : 'h-full'} overflow-y-auto custom-scrollbar`}
          style={isCenter ? { maxHeight: '85vh', padding: '40px' } : undefined}>
          {children}
        </div>
      </div>
    </>
  )
}

export default memo(Drawer)
