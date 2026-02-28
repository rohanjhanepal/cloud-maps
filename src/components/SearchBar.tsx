import { useState, useMemo, useCallback, useRef, useEffect } from 'react'
import { useAppStore } from '../store/useAppStore'
import type { GraphNode } from '../types'

interface SearchBarProps {
  nodes: GraphNode[]
  graphRef: React.RefObject<{ cameraPosition: (pos: object, lookAt?: object, ms?: number) => void; zoomToFit?: (ms?: number, padding?: number, filter?: (n: object) => boolean) => void } | null>
}

export function SearchBar({ nodes, graphRef }: SearchBarProps) {
  const [input, setInput] = useState('')
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)
  const { setSelectedNode } = useAppStore()

  const matches = useMemo(() => {
    if (!input.trim()) return []
    const q = input.toLowerCase()
    return nodes
      .filter((n) => n.name.toLowerCase().includes(q))
      .slice(0, 10)
  }, [nodes, input])

  const handleSelect = useCallback(
    (node: GraphNode) => {
      setInput('')
      setOpen(false)
      setSelectedNode(node)
      if (graphRef.current?.zoomToFit) {
        graphRef.current.zoomToFit(800, 50, (n: { id?: string }) => n.id === node.id)
      }
    },
    [setSelectedNode, graphRef]
  )

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  return (
    <div ref={containerRef} className="relative w-full sm:w-80">
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8a8886]">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value)
            setOpen(true)
          }}
          onFocus={() => setOpen(true)}
          placeholder="Search services..."
          className="w-full rounded border border-[#3c3c3c] bg-[#1b1b1f] py-2.5 pl-10 pr-4 text-[#ffffff] placeholder-[#8a8886] focus:border-[#0078d4] focus:outline-none focus:ring-1 focus:ring-[#0078d4]"
        />
      </div>
      {open && matches.length > 0 && (
        <ul className="absolute left-0 right-0 top-full z-30 mt-1 max-h-64 overflow-y-auto rounded border border-[#3c3c3c] bg-[#252526] shadow-xl">
          {matches.map((node) => (
            <li key={node.id}>
              <button
                type="button"
                onClick={() => handleSelect(node)}
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-[#ffffff] transition hover:bg-[#2d2d30]"
              >
                <span
                  className="shrink-0 rounded px-2 py-0.5 text-xs font-medium"
                  style={{
                    backgroundColor: node.provider === 'AWS' ? 'rgba(255,153,0,0.3)' : 'rgba(0,120,212,0.3)',
                    color: node.provider === 'AWS' ? '#ffb74d' : '#54a9ff',
                  }}
                >
                  {node.provider}
                </span>
                <span className="truncate">{node.name}</span>
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
