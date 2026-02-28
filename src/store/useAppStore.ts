import { create } from 'zustand'
import type { GraphData, GraphNode } from '../types'
import type { FilterState } from '../utils/filterGraph'

interface AppState {
  rawGraph: GraphData | null
  setRawGraph: (graph: AppState['rawGraph']) => void
  filters: FilterState
  setFilters: (f: Partial<FilterState>) => void
  resetFilters: () => void
  selectedNode: GraphNode | null
  setSelectedNode: (node: GraphNode | null) => void
  searchQuery: string
  setSearchQuery: (q: string) => void
  sidebarCollapsed: boolean
  setSidebarCollapsed: (v: boolean) => void
  isLoading: boolean
  setIsLoading: (v: boolean) => void
}

const defaultFilters: FilterState = {
  provider: 'Both',
  categories: [],
  regions: [],
  previewOnly: false,
  crossCloudOnly: false,
}

export const useAppStore = create<AppState>((set) => ({
  rawGraph: null,
  setRawGraph: (rawGraph) => set({ rawGraph }),
  filters: defaultFilters,
  setFilters: (f) =>
    set((s) => ({
      filters: { ...s.filters, ...f },
    })),
  resetFilters: () => set({ filters: defaultFilters }),
  selectedNode: null,
  setSelectedNode: (selectedNode) => set({ selectedNode }),
  searchQuery: '',
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  sidebarCollapsed: false,
  setSidebarCollapsed: (sidebarCollapsed) => set({ sidebarCollapsed }),
  isLoading: true,
  setIsLoading: (isLoading) => set({ isLoading }),
}))
