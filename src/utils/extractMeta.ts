import type { GraphData, GraphNode } from '../types'

export function getCategories(data: GraphData | null): string[] {
  if (!data) return []
  const set = new Set<string>()
  data.nodes.forEach((n) => set.add(n.category))
  return Array.from(set).sort()
}

export function getRegions(data: GraphData | null): string[] {
  if (!data) return []
  const set = new Set<string>()
  data.nodes.forEach((n) => n.regions.forEach((r) => set.add(r)))
  return Array.from(set).sort()
}

export function getConnectedServices(node: GraphNode, links: { source: string; target: string }[], nodeMap: Map<string, GraphNode>): GraphNode[] {
  const ids = new Set<string>()
  links.forEach((l) => {
    if (l.source === node.id) ids.add(l.target)
    if (l.target === node.id) ids.add(l.source)
  })
  return Array.from(ids)
    .map((id) => nodeMap.get(id))
    .filter(Boolean) as GraphNode[]
}
