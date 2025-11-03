// Convert a simple polynomial expression like "3*x^2 - 2*x + 1" to LaTeX: "3x^{2} - 2x + 1"
export function exprToLatex(expr) {
  if (!expr || typeof expr !== 'string') return ''
  let s = expr
  // Remove * around variables
  s = s.replace(/\s*\*\s*/g, '')
  // x^n -> x^{n}
  s = s.replace(/x\s*\^\s*(-?\d+)/g, 'x^{$1}')
  // x^{1} -> x
  s = s.replace(/x\^{1}(?!\d)/g, 'x')
  // Handle cases where exponent caret is missing (e.g., "x2" -> "x^{2}")
  s = s.replace(/\bx(\d+)\b/g, 'x^{$1}')
  // 1x -> x (standalone 1x not part of 10x)
  s = s.replace(/\b1x\b/g, 'x')
  // -1x -> -x
  s = s.replace(/(^|\s)-1x\b/g, '$1-x')
  // Normalize plus-minus spacing
  s = s.replace(/\+\s-/g, '- ')
  return s
}
