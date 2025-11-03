import { InlineMath, BlockMath } from 'react-katex'
import { exprToLatex } from '../lib/format.js'

export default function MathExpr({ expr, block = false }) {
  const latex = exprToLatex(expr)
  if (!latex) return null
  if (block) return <BlockMath>{latex}</BlockMath>
  return <InlineMath>{latex}</InlineMath>
}
