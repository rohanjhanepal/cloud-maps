import { useCallback, useMemo, useRef, forwardRef, useEffect } from 'react'
import ForceGraph3D, { type ForceGraphMethods } from 'react-force-graph-3d'
import * as THREE from 'three'
import type { GraphData, GraphNode } from '../types'
import { useAppStore } from '../store/useAppStore'
import { CATEGORY_COLORS } from '../constants/colors'
import { createTextSprite } from '../utils/createTextSprite'

interface ForceGraphProps {
  graphData: GraphData | null
}

export type GraphRef = {
  cameraPosition: (pos: object, lookAt?: object, ms?: number) => void
  zoomToFit?: (ms?: number, padding?: number, filter?: (n: object) => boolean) => void
}

export const ForceGraph3DComponent = forwardRef<GraphRef | null, ForceGraphProps>(function ForceGraph3DComponent({ graphData }, ref) {
  const internalRef = useRef<ForceGraphMethods | undefined>(undefined)
  const { selectedNode, setSelectedNode } = useAppStore()

  const nodeMap = useMemo(() => {
    if (!graphData) return new Map<string, GraphNode>()
    const m = new Map<string, GraphNode>()
    graphData.nodes.forEach((n) => m.set(n.id, n))
    return m
  }, [graphData])

  const nodeColor = useCallback((node: { id: string }) => {
    const n = nodeMap.get(node.id as string)
    if (!n) return '#6b7280'
    return CATEGORY_COLORS[n.category] ?? '#0078d4'
  }, [nodeMap])

  const nodeVal = useCallback(() => 5, [])

  const isCrossCloud = useCallback((link: Record<string, unknown>) => {
    const t = (link as { type?: string }).type
    return t === 'cross-cloud'
  }, [])

  const linkColor = useCallback((link: Record<string, unknown>) => {
    return isCrossCloud(link)
      ? '#00ffcc'
      : 'rgba(180, 200, 220, 0.8)'
  }, [isCrossCloud])

  const linkWidth = useCallback((link: Record<string, unknown>) => {
    return isCrossCloud(link) ? 3.5 : 1.5
  }, [isCrossCloud])

  const linkDirectionalParticles = useCallback((link: Record<string, unknown>) => {
    return isCrossCloud(link) ? 4 : 0
  }, [isCrossCloud])

  const linkDirectionalParticleSpeed = useCallback((link: Record<string, unknown>) => {
    return isCrossCloud(link) ? 0.02 : 0
  }, [isCrossCloud])

  const handleNodeClick = useCallback(
    (node: { id: string }) => {
      setSelectedNode(nodeMap.get(node.id as string) ?? null)
    },
    [nodeMap, setSelectedNode]
  )

  const customNodeThreeObject = useCallback(
    (node: { id: string; x?: number; y?: number; z?: number }) => {
      const n = nodeMap.get(node.id as string)
      const name = n?.name ?? ''
      const isSelected = selectedNode?.id === node.id
      const size = isSelected ? 6 : 5
      const color = nodeColor(node)
      const geometry = new THREE.SphereGeometry(size, 16, 12)
      const material = new THREE.MeshPhongMaterial({
        color,
        emissive: color,
        emissiveIntensity: 0.2,
        shininess: 25,
      })
      const sphere = new THREE.Mesh(geometry, material)

      const group = new THREE.Group()
      group.add(sphere)

      if (name) {
        const label = createTextSprite(name, color, 11)
        label.position.y = size * 1.6
        label.scale.multiplyScalar(size * 0.35)
        group.add(label)
      }
      return group
    },
    [nodeMap, nodeColor, selectedNode?.id]
  )

  useEffect(() => {
    const el = internalRef.current
    if (el && ref) {
      if (typeof ref === 'function') (ref as (r: GraphRef | null) => void)(el as unknown as GraphRef)
      else (ref as React.MutableRefObject<GraphRef | null>).current = el as unknown as GraphRef
    }
  })

  if (!graphData) return null

  return (
    <ForceGraph3D
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ref={internalRef as any}
      graphData={graphData as any}
      nodeId="id"
      linkSource="source"
      linkTarget="target"
      nodeThreeObject={customNodeThreeObject}
      nodeThreeObjectExtend
      nodeVal={nodeVal}
      nodeLabel={(node) => nodeMap.get((node as { id: string }).id)?.name ?? ''}
      linkColor={linkColor}
      linkWidth={linkWidth}
      linkOpacity={0.95}
      linkDirectionalParticles={linkDirectionalParticles}
      linkDirectionalParticleSpeed={linkDirectionalParticleSpeed}
      linkDirectionalParticleWidth={0.8}
      linkDirectionalParticleColor={() => '#00ffcc'}
      onNodeClick={handleNodeClick}
      onBackgroundClick={() => setSelectedNode(null)}
      backgroundColor="rgba(27,27,31,0)"
      showNavInfo={false}
      enableNodeDrag
      enableNavigationControls
      d3AlphaDecay={0.02}
      d3VelocityDecay={0.35}
    />
  )
})
