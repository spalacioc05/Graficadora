import { render, screen } from '@testing-library/react'
import { test, expect } from 'vitest'
import GraphPlot from '../components/GraphPlot.jsx'

test('renders nothing without points', () => {
  const { container } = render(<GraphPlot expression="x" points={[]} />)
  expect(container).toBeEmptyDOMElement()
})

test('renders plot when points provided', () => {
  render(<GraphPlot expression="x" points={[{ x: 0, y: 0 }, { x: 1, y: 1 }]} />)
  expect(screen.getByLabelText('graph')).toBeInTheDocument()
})
