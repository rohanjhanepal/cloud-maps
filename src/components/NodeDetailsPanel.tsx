import { useAppStore } from '../store/useAppStore'
import { getConnectedServices } from '../utils/extractMeta'
import { CATEGORY_COLORS } from '../constants/colors'
import type { GraphNode } from '../types'

interface NodeDetailsPanelProps {
  graphData: { nodes: GraphNode[]; links: { source: string; target: string }[] } | null
  fullGraphData?: { nodes: GraphNode[]; links: { source: string; target: string }[] } | null
}

export function NodeDetailsPanel({ graphData, fullGraphData }: NodeDetailsPanelProps) {
  const { selectedNode } = useAppStore()

  if (!selectedNode) return null

  const data = fullGraphData ?? graphData
  const nodeMap = new Map(data?.nodes.map((n) => [n.id, n]) ?? [])
  const connected = data
    ? getConnectedServices(selectedNode, data.links, nodeMap)
    : []
  const crossCloud = (selectedNode.crossCloudCompatible ?? []).map((id: string) => nodeMap.get(id)).filter(Boolean) as GraphNode[]
  const categoryColor = CATEGORY_COLORS[selectedNode.category] ?? '#0078d4'

  return (
    <aside className="absolute right-0 top-0 z-30 flex h-full w-full flex-col overflow-hidden border-l border-[#3c3c3c] bg-[#252526] shadow-2xl sm:w-96">
      <div className="border-b border-[#3c3c3c] p-4">
        <h2 className="text-lg font-semibold text-[#ffffff]">{selectedNode.name}</h2>
        <div className="mt-3 flex flex-wrap items-center gap-2">
          <span
            className="rounded px-2.5 py-0.5 text-xs font-medium"
            style={{
              backgroundColor: selectedNode.provider === 'AWS' ? 'rgba(255,153,0,0.25)' : 'rgba(0,120,212,0.25)',
              color: selectedNode.provider === 'AWS' ? '#ffb74d' : '#54a9ff',
            }}
          >
            {selectedNode.provider}
          </span>
          <span
            className="rounded px-2.5 py-0.5 text-xs font-medium"
            style={{ backgroundColor: `${categoryColor}30`, color: categoryColor }}
          >
            {selectedNode.category}
          </span>
          {selectedNode.preview && (
            <span className="rounded bg-purple-500/25 px-2.5 py-0.5 text-xs font-medium text-purple-300">
              Preview
            </span>
          )}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <p className="mb-5 text-sm leading-relaxed text-[#cccccc]">{selectedNode.description}</p>

        <div className="mb-5">
          <h3 className="mb-2 text-sm font-semibold text-[#ffffff]">Regions</h3>
          <div className="flex flex-wrap gap-2">
            {selectedNode.regions.map((r: string) => (
              <span
                key={r}
                className="rounded border border-[#3c3c3c] bg-[#1b1b1f] px-2.5 py-1 text-xs text-[#cccccc]"
              >
                {r}
              </span>
            ))}
          </div>
        </div>

        {connected.length > 0 && (
          <div className="mb-5">
            <h3 className="mb-2 text-sm font-semibold text-[#ffffff]">Connected services</h3>
            <ul className="space-y-1.5">
              {connected.slice(0, 12).map((n) => (
                <li key={n.id} className="flex items-center gap-2">
                  <span
                    className="h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: CATEGORY_COLORS[n.category] ?? '#0078d4' }}
                  />
                  <span className="truncate text-sm text-[#cccccc]">{n.name}</span>
                </li>
              ))}
              {connected.length > 12 && (
                <li className="text-sm text-[#8a8886]">+{connected.length - 12} more</li>
              )}
            </ul>
          </div>
        )}

        {crossCloud.length > 0 && (
          <div>
            <h3 className="mb-2 text-sm font-semibold text-[#ffffff]">Cross-cloud equivalents</h3>
            <ul className="space-y-1.5">
              {crossCloud.map((n) => (
                <li key={n.id} className="flex items-center gap-2">
                  <span className="h-2 w-2 shrink-0 rounded-full bg-[#00bcf2]" />
                  <span className="truncate text-sm text-[#cccccc]">{n.name}</span>
                  <span className="shrink-0 text-xs text-[#8a8886]">({n.provider})</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </aside>
  )
}
