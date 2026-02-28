import type { GraphData, GraphNode, GraphLink } from '../types'

export interface FilterState {
  provider: 'AWS' | 'Azure' | 'Both'
  categories: string[]
  regions: string[]
  previewOnly: boolean
  crossCloudOnly: boolean
}

const DEFAULT_FILTERS: FilterState = {
  provider: 'Both',
  categories: [],
  regions: [],
  previewOnly: false,
  crossCloudOnly: false,
}

function nodeMatchesFilters(node: GraphNode, filters: FilterState): boolean {
  if (filters.provider !== 'Both' && node.provider !== filters.provider) return false
  if (filters.previewOnly && !node.preview) return false
  if (filters.categories.length > 0 && !filters.categories.includes(node.category)) return false
  if (filters.regions.length > 0) {
    const hasRegion = node.regions.some((r) => filters.regions.includes(r))
    if (!hasRegion) return false
  }
  return true
}

function linkConnectsNodes(
  link: GraphLink,
  nodeIds: Set<string>,
  filters: FilterState
): boolean {
  if (filters.crossCloudOnly && link.type !== 'cross-cloud') return false
  return nodeIds.has(link.source) && nodeIds.has(link.target)
}

export function filterGraph(data: GraphData, filters: FilterState): GraphData {
  if (Object.keys(filters).length === 0) return data

  let nodes = data.nodes.filter((n) => nodeMatchesFilters(n, filters))

  if (filters.crossCloudOnly) {
    const crossCloudNodeIds = new Set<string>()
    for (const link of data.links) {
      if (link.type === 'cross-cloud') {
        crossCloudNodeIds.add(link.source)
        crossCloudNodeIds.add(link.target)
      }
    }
    nodes = nodes.filter((n) => crossCloudNodeIds.has(n.id))
  }

  const nodeIds = new Set(nodes.map((n) => n.id))
  const links = data.links.filter((link) => linkConnectsNodes(link, nodeIds, filters))

  return { nodes, links }
}

export { DEFAULT_FILTERS }
