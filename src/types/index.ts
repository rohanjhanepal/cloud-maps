export interface GraphNode {
  id: string
  name: string
  provider: 'AWS' | 'Azure'
  category: string
  preview: boolean
  regions: string[]
  description: string
  crossCloudCompatible?: string[]
}

export interface GraphLink {
  source: string
  target: string
  type: 'intra-cloud' | 'cross-cloud' | string
  weight: number
}

export interface GraphData {
  nodes: GraphNode[]
  links: GraphLink[]
}
