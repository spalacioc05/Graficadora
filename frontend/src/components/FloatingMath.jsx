export default function FloatingMath() {
  const symbols = ['∑', 'π', '√', '∞', '∫', 'Δ', '≈', '≡', '∂', 'λ']
  return (
    <div className="float-bg" aria-hidden>
      {Array.from({ length: 20 }).map((_, i) => (
        <span key={i} className={`float-symbol s${(i % 5) + 1}`} style={randomStyle(i)}>
          {symbols[i % symbols.length]}
        </span>
      ))}
    </div>
  )
}

function randomStyle(seed) {
  // pseudo-random deterministic based on seed
  const rnd = (n) => (Math.sin(n * 9999) + 1) / 2
  const top = Math.floor(rnd(seed) * 90) + '%'
  const left = Math.floor(rnd(seed + 1) * 90) + '%'
  const dur = 15 + Math.floor(rnd(seed + 2) * 25) // 15s - 40s
  const delay = Math.floor(rnd(seed + 3) * 20) * -1 // negative delay for staggered motion
  const size = 16 + Math.floor(rnd(seed + 4) * 18) // 16px - 34px
  const op = 0.06 + rnd(seed + 5) * 0.1 // 0.06 - 0.16
  return { top, left, animationDuration: `${dur}s`, animationDelay: `${delay}s`, fontSize: `${size}px`, opacity: op }
}
