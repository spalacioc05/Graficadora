import Plot from 'react-plotly.js'
import { useEffect, useMemo, useState } from 'react'

export default function GraphPlot({ expression, points }) {
  if (!points || points.length === 0) return null

  const xs = useMemo(() => points.map((p) => p.x), [points])
  const ys = useMemo(() => points.map((p) => (p.y == null ? null : p.y)), [points])

  // Estilo de ejes tipo "GeoGebra": líneas marcadas, ticks visibles y números en todos los lados
  const axisColor = '#94a3b8'
  const gridColor = '#1f2937'

  // Calcular rangos para decidir si conviene mantener proporción 1:1
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const finiteYs = ys.filter((v) => v != null && Number.isFinite(v))
  const minY = finiteYs.length ? Math.min(...finiteYs) : 0
  const maxY = finiteYs.length ? Math.max(...finiteYs) : 0
  const rangeX = Math.max(1e-9, maxX - minX)
  const rangeY = Math.max(1e-9, maxY - minY)
  // Si la relación entre rangos es extrema, desactivar 1:1 para evitar vistas "aplastadas"
  const ratio = rangeY / rangeX
  const equalAspect = ratio > 0.02 && ratio < 50

  // Ventana visible: hacer que Y llegue a lo mismo que X (p. ej., si X es [-10,10], Y también [-10,10])
  const xAbs = Math.max(Math.abs(minX), Math.abs(maxX)) || 10
  const initialVisibleRange = useMemo(() => [-xAbs, xAbs], [xAbs])

  // Rango interactivo controlado: inicializa con visibleRange y luego respeta el pan/zoom del usuario
  const [ranges, setRanges] = useState({ x: initialVisibleRange, y: initialVisibleRange })
  useEffect(() => {
    // Reiniciar rango cuando la expresión o los puntos cambian (nuevo gráfico)
    setRanges({ x: initialVisibleRange, y: initialVisibleRange })
  }, [expression, initialVisibleRange])

  return (
    <div aria-label="graph">
      <Plot
        data={[
          {
            x: xs,
            y: ys,
            type: 'scatter',
            mode: 'lines',
            name: expression,
            line: { color: '#2563eb' },
          },
        ]}
        layout={{
          title: expression,
          autosize: true,
          paper_bgcolor: '#0b1220',
          plot_bgcolor: '#0b1220',
          font: { color: '#e5e7eb' },
          uirevision: expression,

          // Ejes principales (abajo e izquierda)
          xaxis: {
            title: 'x',
            showline: true,
            linecolor: axisColor,
            linewidth: 2,
            ticks: 'outside',
            ticklen: 6,
            tickwidth: 1.5,
            tickcolor: axisColor,
            gridcolor: gridColor,
            zeroline: true,
            zerolinecolor: axisColor,
            zerolinewidth: 1.5,
            automargin: true,
            tickangle: 0,
            ...(ranges?.x ? { range: ranges.x } : {}),
            // Mantener proporción de unidades con el eje Y solo cuando tiene sentido
            ...(equalAspect ? { constrain: 'domain' } : {}),
            // deja etiquetas abajo; las de arriba van en xaxis2
            side: 'bottom',
          },
          yaxis: {
            title: 'y',
            showline: true,
            linecolor: axisColor,
            linewidth: 2,
            ticks: 'outside',
            ticklen: 6,
            tickwidth: 1.5,
            tickcolor: axisColor,
            gridcolor: gridColor,
            zeroline: true,
            zerolinecolor: axisColor,
            zerolinewidth: 1.5,
            automargin: true,
            ...(ranges?.y ? { range: ranges.y } : {}),
            // Anclar escala al eje X para que 1 unidad en X = 1 unidad en Y (como GeoGebra) solo si no deforma la vista
            ...(equalAspect ? { scaleanchor: 'x', scaleratio: 1 } : {}),
            // deja etiquetas a la izquierda; las de la derecha van en yaxis2
            side: 'left',
          },

          // Ejes espejo (arriba y derecha) para que se vean números "alrededor" como en GeoGebra
          xaxis2: {
            overlaying: 'x',
            side: 'top',
            showline: true,
            linecolor: axisColor,
            linewidth: 2,
            ticks: 'outside',
            ticklen: 6,
            tickwidth: 1.5,
            tickcolor: axisColor,
            showgrid: false,
            // Etiquetas arriba
            showticklabels: true,
            tickangle: 0,
            tickfont: { size: 10 },
          },
          yaxis2: {
            overlaying: 'y',
            side: 'right',
            showline: true,
            linecolor: axisColor,
            linewidth: 2,
            ticks: 'outside',
            ticklen: 6,
            tickwidth: 1.5,
            tickcolor: axisColor,
            showgrid: false,
            // Etiquetas a la derecha
            showticklabels: true,
            tickfont: { size: 10 },
          },

          // Dibujar los ejes x=0 y y=0 dentro del plano (si entran en rango)
          shapes: [
            // Eje X sobre y=0 (a lo largo de todo el ancho del gráfico)
            {
              type: 'line',
              xref: 'paper',
              x0: 0,
              x1: 1,
              yref: 'y',
              y0: 0,
              y1: 0,
              line: { color: axisColor, width: 1 },
              layer: 'below',
            },
            // Eje Y sobre x=0 (a lo largo de todo el alto del gráfico)
            {
              type: 'line',
              xref: 'x',
              x0: 0,
              x1: 0,
              yref: 'paper',
              y0: 0,
              y1: 1,
              line: { color: axisColor, width: 1 },
              layer: 'below',
            },
          ],

          margin: { l: 60, r: 60, t: 50, b: 60 },
          hovermode: 'closest',
          dragmode: 'pan',
        }}
        useResizeHandler
  // Altura más grande y responsiva
  style={{ width: '100%', height: '60vh', minHeight: '380px' }}
        config={{
          displayModeBar: 'hover',
          scrollZoom: true, // zoom con rueda del mouse / pinch en touch
          responsive: true,
          doubleClick: 'autosize', // doble clic para reajustar vista
          modeBarButtonsToRemove: ['toggleSpikelines', 'autoScale2d', 'hoverCompareCartesian', 'hoverClosestCartesian'],
        }}
        onRelayout={(e) => {
          // Capturar cambios de rango al pan/zoom del usuario
          const rx0 = e['xaxis.range[0]']
          const rx1 = e['xaxis.range[1]']
          const ry0 = e['yaxis.range[0]']
          const ry1 = e['yaxis.range[1]']
          setRanges((prev) => ({
            x: rx0 != null && rx1 != null ? [rx0, rx1] : prev.x,
            y: ry0 != null && ry1 != null ? [ry0, ry1] : prev.y,
          }))
        }}
      />
    </div>
  )
}
