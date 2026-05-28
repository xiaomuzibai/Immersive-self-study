interface Props {
  value: number
  onChange: (value: number) => void
  className?: string
}

export default function VolumeSlider({ value, onChange, className = '' }: Props) {
  const percent = Math.round(value * 100)

  return (
    <div className={`relative flex items-center ${className}`}>
      <input
        type="range"
        min={0}
        max={100}
        value={percent}
        onChange={e => onChange(Number(e.target.value) / 100)}
        className="w-full h-1 appearance-none bg-white/20 rounded-full cursor-pointer
          [&::-webkit-slider-thumb]:appearance-none
          [&::-webkit-slider-thumb]:w-3
          [&::-webkit-slider-thumb]:h-3
          [&::-webkit-slider-thumb]:rounded-full
          [&::-webkit-slider-thumb]:bg-white
          [&::-webkit-slider-thumb]:shadow
          [&::-webkit-slider-thumb]:cursor-pointer"
      />
    </div>
  )
}