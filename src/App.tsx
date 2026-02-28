import { useEffect, useMemo, useRef } from 'react'
import { ForceGraph3DComponent } from './components/ForceGraph3D'
import { Sidebar } from './components/Sidebar'
import { SearchBar } from './components/SearchBar'
import { NodeDetailsPanel } from './components/NodeDetailsPanel'
import { LoadingSpinner } from './components/LoadingSpinner'
import { useAppStore } from './store/useAppStore'
import { filterGraph } from './utils/filterGraph'
import { isolateGraphByNode } from './utils/isolateGraph'
import type { GraphData } from './types'

const BASE = import.meta.env.BASE_URL ?? '/'

function App() {
  const {
    rawGraph,
    setRawGraph,
    filters,
    selectedNode,
    isLoading,
    setIsLoading,
  } = useAppStore()
  const graphRef = useRef<{ cameraPosition: (pos: object, lookAt?: object, ms?: number) => void; zoomToFit?: (ms?: number, padding?: number, filter?: (n: object) => boolean) => void } | null>(null)

  useEffect(() => {
    setIsLoading(true)
    fetch(`${BASE}data/graph.json`)
      .then((r) => r.json())
      .then((data: GraphData) => {
        setRawGraph(data)
        setIsLoading(false)
      })
      .catch(() => setIsLoading(false))
  }, [setRawGraph, setIsLoading])

  const filteredGraph = useMemo(() => {
    if (!rawGraph) return null
    return filterGraph(rawGraph, filters)
  }, [rawGraph, filters])

  const displayGraph = useMemo(() => {
    if (!filteredGraph) return null
    if (!selectedNode) return filteredGraph
    return isolateGraphByNode(filteredGraph, selectedNode.id, 1)
  }, [filteredGraph, selectedNode])

  // Zoom to fit isolated subgraph after it renders (give physics time to settle)
  useEffect(() => {
    if (!selectedNode || !displayGraph || !graphRef.current?.zoomToFit) return
    const id = setTimeout(() => {
      graphRef.current?.zoomToFit?.(600, 100)
    }, 300)
    return () => clearTimeout(id)
  }, [selectedNode?.id, displayGraph])

  return (
    <div className="relative h-full w-full overflow-hidden bg-[#1b1b1f]">
      {isLoading && <LoadingSpinner />}

      <div className="absolute inset-0">
        <ForceGraph3DComponent ref={graphRef} graphData={displayGraph} />
      </div>

      <Sidebar />

      <header className="absolute left-0 right-0 top-0 z-20 flex flex-col gap-3 p-3 sm:left-1/2 sm:right-auto sm:top-4 sm:flex-row sm:items-center sm:gap-4 sm:p-0 sm:max-w-2xl sm:-translate-x-1/2">
        <div className="flex items-center gap-2 sm:gap-3">
          <h1 className="text-lg font-semibold text-white sm:text-xl">
            CloudGraph <span className="text-[#0078d4]">3D</span>
          </h1>
          <span className="hidden rounded bg-[#252526] px-2 py-0.5 text-xs text-[#cccccc] sm:inline">
            AWS &amp; Azure Ecosystem
          </span>
        </div>
        <div className="flex-1 sm:flex-initial">
          <SearchBar nodes={displayGraph?.nodes ?? filteredGraph?.nodes ?? []} graphRef={graphRef} />
        </div>
      </header>

      <NodeDetailsPanel graphData={displayGraph} fullGraphData={filteredGraph} />

      <div className="absolute bottom-3 left-0 right-0 z-10 flex justify-center px-2 sm:left-auto sm:right-4 sm:bottom-4 sm:px-0">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1 rounded-lg border border-[#3c3c3c] bg-[#252526]/95 px-3 py-2 text-xs text-[#8a8886] backdrop-blur">
          {selectedNode && (
            <button
              type="button"
              onClick={() => useAppStore.getState().setSelectedNode(null)}
              className="rounded border border-[#3c3c3c] bg-[#2d2d30] px-2 py-1 text-[#0078d4] hover:bg-[#3c3c3c]"
            >
              ← Show full graph
            </button>
          )}
          <span><span className="font-medium text-[#cccccc]">Nodes:</span> {displayGraph?.nodes.length ?? 0}</span>
          <span><span className="font-medium text-[#cccccc]">Edges:</span> {displayGraph?.links.length ?? 0}</span>
          <span>Click node to isolate • Drag • Scroll</span>
        </div>
      </div>
    </div>
  )
}

export default App
