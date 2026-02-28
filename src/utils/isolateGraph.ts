import type { GraphData } from '../types'

/**
 * Returns a subgraph containing the given node and all nodes within `depth` hops.
 * Depth 3 = selected node + direct neighbors + their neighbors + their neighbors.
 */
export function isolateGraphByNode(
  data: GraphData,
  nodeId: string,
  depth: number
): GraphData {
  const adjacency = new Map<string, Set<string>>()
  for (const link of data.links) {
    const src = typeof link.source === 'object' && link.source !== null && 'id' in link.source
      ? (link.source as { id: string }).id
      : String(link.source)
    const tgt = typeof link.target === 'object' && link.target !== null && 'id' in link.target
      ? (link.target as { id: string }).id
      : String(link.target)
    if (!adjacency.has(src)) adjacency.set(src, new Set())
    if (!adjacency.has(tgt)) adjacency.set(tgt, new Set())
    adjacency.get(src)!.add(tgt)
    adjacency.get(tgt)!.add(src)
  }

  const included = new Set<string>()
  let frontier = new Set([nodeId])
  included.add(nodeId)

  for (let d = 0; d < depth && frontier.size > 0; d++) {
    const next = new Set<string>()
    for (const id of frontier) {
      const neighbors = adjacency.get(id)
      if (neighbors) {
        for (const n of neighbors) {
          if (!included.has(n)) {
            included.add(n)
            next.add(n)
          }
        }
      }
    }
    frontier = next
  }

  const nodes = data.nodes.filter((n) => included.has(n.id))
  const links = data.links.filter((l) => {
    const src = typeof l.source === 'object' && l.source !== null && 'id' in l.source
      ? (l.source as { id: string }).id
      : String(l.source)
    const tgt = typeof l.target === 'object' && l.target !== null && 'id' in l.target
      ? (l.target as { id: string }).id
      : String(l.target)
    return included.has(src) && included.has(tgt)
  })

  return { nodes, links }
}
