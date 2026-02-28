import { useCallback } from 'react'
import { useAppStore } from '../store/useAppStore'
import { getCategories, getRegions } from '../utils/extractMeta'
import { CATEGORY_COLORS } from '../constants/colors'

const CATEGORIES = ['Compute', 'Storage', 'Networking', 'Database', 'Security', 'AI/ML', 'Analytics', 'DevOps', 'Integration']

export function Sidebar() {
  const { rawGraph, filters, setFilters, resetFilters, sidebarCollapsed, setSidebarCollapsed } = useAppStore()
  const categories = rawGraph ? getCategories(rawGraph) : CATEGORIES
  const regions = rawGraph ? getRegions(rawGraph) : []

  const toggleCategory = useCallback(
    (cat: string) => {
      const next = filters.categories.includes(cat)
        ? filters.categories.filter((c) => c !== cat)
        : [...filters.categories, cat]
      setFilters({ categories: next })
    },
    [filters.categories, setFilters]
  )

  if (sidebarCollapsed) {
    return (
      <button
        type="button"
        onClick={() => setSidebarCollapsed(false)}
        className="absolute left-0 top-20 z-20 flex h-12 w-10 items-center justify-center rounded-r-lg border border-l-0 border-[#3c3c3c] bg-[#252526] text-[#0078d4] transition hover:bg-[#2d2d30] sm:top-24"
        aria-label="Open filters"
      >
        <span>▶</span>
      </button>
    )
  }

  return (
    <aside className="absolute left-0 top-0 z-10 flex h-full w-72 flex-col overflow-hidden border-r border-[#3c3c3c] bg-[#252526] shadow-xl sm:w-80">
      <div className="flex items-center justify-between border-b border-[#3c3c3c] px-4 py-3">
        <h2 className="text-base font-semibold text-[#ffffff]">Filters</h2>
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={() => setSidebarCollapsed(true)}
            className="rounded p-2 text-[#8a8886] transition hover:bg-[#3c3c3c] hover:text-[#ffffff]"
            aria-label="Collapse"
          >
            ◀
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4">
        <div className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-[#cccccc]">Provider</label>
            <select
              value={filters.provider}
              onChange={(e) => setFilters({ provider: e.target.value as 'AWS' | 'Azure' | 'Both' })}
              className="w-full rounded border border-[#3c3c3c] bg-[#1b1b1f] px-3 py-2.5 text-[#ffffff] focus:border-[#0078d4] focus:outline-none focus:ring-1 focus:ring-[#0078d4]"
            >
              <option value="Both">Both</option>
              <option value="AWS">AWS</option>
              <option value="Azure">Azure</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium text-[#cccccc]">Categories</label>
            <div className="flex flex-wrap gap-2">
              {categories.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => toggleCategory(cat)}
                  className="rounded px-3 py-1.5 text-sm font-medium transition"
                  style={{
                    backgroundColor: filters.categories.includes(cat)
                      ? CATEGORY_COLORS[cat] ?? '#0078d4'
                      : 'transparent',
                    color: filters.categories.includes(cat) ? '#ffffff' : '#cccccc',
                    border: `1px solid ${filters.categories.includes(cat) ? CATEGORY_COLORS[cat] ?? '#0078d4' : '#3c3c3c'}`,
                  }}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {regions.length > 0 && (
            <div>
              <label className="mb-2 block text-sm font-medium text-[#cccccc]">Regions</label>
              <select
                value={filters.regions[0] ?? ''}
                onChange={(e) => {
                  const v = e.target.value
                  setFilters({ regions: v ? [v] : [] })
                }}
                className="w-full rounded border border-[#3c3c3c] bg-[#1b1b1f] px-3 py-2.5 text-[#ffffff] focus:border-[#0078d4] focus:outline-none focus:ring-1 focus:ring-[#0078d4]"
              >
                <option value="">All regions</option>
                {regions.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="space-y-2">
            <label className="flex cursor-pointer items-center gap-3 rounded border border-[#3c3c3c] bg-[#1b1b1f] px-3 py-2.5">
              <input
                type="checkbox"
                checked={filters.previewOnly}
                onChange={(e) => setFilters({ previewOnly: e.target.checked })}
                className="h-4 w-4 rounded border-[#3c3c3c] bg-[#2d2d30] text-[#0078d4] focus:ring-[#0078d4]"
              />
              <span className="text-sm text-[#cccccc]">Preview only</span>
            </label>
            <label className="flex cursor-pointer items-center gap-3 rounded border border-[#3c3c3c] bg-[#1b1b1f] px-3 py-2.5">
              <input
                type="checkbox"
                checked={filters.crossCloudOnly}
                onChange={(e) => setFilters({ crossCloudOnly: e.target.checked })}
                className="h-4 w-4 rounded border-[#3c3c3c] bg-[#2d2d30] text-[#0078d4] focus:ring-[#0078d4]"
              />
              <span className="text-sm text-[#cccccc]">Cross-cloud only</span>
            </label>
          </div>

          <button
            type="button"
            onClick={resetFilters}
            className="w-full rounded border border-[#3c3c3c] bg-[#1b1b1f] py-2.5 text-sm font-medium text-[#cccccc] transition hover:bg-[#2d2d30] hover:text-[#ffffff]"
          >
            Reset filters
          </button>
        </div>
      </div>
    </aside>
  )
}
