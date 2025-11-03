// Convert a simple polynomial expression like "3*x^2 - 2*x + 1" to LaTeX: "3x^{2} - 2x + 1"
export function exprToLatex(expr) {
  if (!expr || typeof expr !== 'string') return ''
  let s = expr
  // Remove * around variables
  s = s.replace(/\s*\*\s*/g, '')
  // Handle inputs that come as "x5" (implicitly meaning exponent) -> x^{5}
  // Only apply when directly followed by digits and NOT already in braces or with caret
  s = s.replace(/([xX])\s*(\d+)/g, (_, v, n) => `${v}^{${n}}`)
  // x^n -> x^{n}
  s = s.replace(/([xX])\s*\^\s*(-?\d+)/g, '$1^{$2}')
  // x^{1} -> x (lower/upper case)
  s = s.replace(/([xX])\^{1}(?!\d)/g, '$1')
  // 1x -> x (standalone 1x not part of 10x) for lower/upper x
  s = s.replace(/\b1([xX])\b/g, '$1')
  // -1x -> -x (lower/upper x)
  s = s.replace(/(^|\s)-1([xX])\b/g, '$1-$2')
  // Normalize plus-minus spacing
  s = s.replace(/\+\s-/g, '- ')
  // Safety: ensure caret is present before braces, e.g., fix occurrences like x{2} -> x^{2}
  s = s.replace(/([xX])\{(-?\d+)\}/g, (_, v, n) => `${v}^{${n}}`)
  return s
}
