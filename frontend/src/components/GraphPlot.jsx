import Plot from 'react-plotly.js'

export default function GraphPlot({ expression, points }) {
  if (!points || points.length === 0) return null
  const xs = points.map((p) => p.x)
  const ys = points.map((p) => (p.y == null ? null : p.y))
  return (
    <div aria-label="graph">
      <Plot
        data={[{ x: xs, y: ys, type: 'scatter', mode: 'lines', name: expression, line: { color: '#2563eb' } }]}
        layout={{
          title: expression,
          autosize: true,
          paper_bgcolor: '#0b1220',
          plot_bgcolor: '#0b1220',
          font: { color: '#e5e7eb' },
          xaxis: { title: 'x', zeroline: true, zerolinecolor: '#94a3b8', gridcolor: '#1f2937' },
          yaxis: { title: 'y', zeroline: true, zerolinecolor: '#94a3b8', gridcolor: '#1f2937' },
          margin: { l: 50, r: 20, t: 40, b: 50 },
          hovermode: 'closest',
          dragmode: 'pan',
        }}
        useResizeHandler
        style={{ width: '100%', height: '360px' }}
        config={{
          displayModeBar: 'hover',
          scrollZoom: true,        // zoom con rueda del mouse / pinch en touch
          responsive: true,
          doubleClick: 'autosize', // doble clic para reajustar vista
          modeBarButtonsToRemove: [
            'toggleSpikelines', 'autoScale2d', 'hoverCompareCartesian', 'hoverClosestCartesian'
          ],
        }}
      />
    </div>
  )
}
