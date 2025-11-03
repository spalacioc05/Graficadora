import { describe, it, expect } from 'vitest'
import { exprToLatex } from '../lib/format.js'

describe('exprToLatex', () => {
  it('converts caret exponents to LaTeX', () => {
    expect(exprToLatex('3*x^2 - 2*x + 1')).toBe('3x^{2} - 2x + 1')
  })

  it('converts implicit exponents like x5 to LaTeX', () => {
    expect(exprToLatex('-4x5+6x4+7x2-2')).toBe('-4x^{5}+6x^{4}+7x^{2}-2')
  })
})
