'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { WorkflowMeta, SearchResult, Stats } from '@/types/workflow'
import { WorkflowCard } from './WorkflowCard'
import { WorkflowModal } from './WorkflowModal'

interface Props {
  initialData: SearchResult
  stats: Stats
}

const TRIGGERS = ['all', 'Scheduled', 'Webhook', 'Triggered', 'Monitor', 'Manual']
const COLLECTIONS = ['all', 'hub', 'community']

export function WorkflowBrowser({ initialData, stats }: Props) {
  const [data, setData] = useState(initialData)
  const [q, setQ] = useState('')
  const [trigger, setTrigger] = useState('all')
  const [collection, setCollection] = useState('all')
  const [category, setCategory] = useState('all')
  const [page, setPage] = useState(1)
  const [loading, setLoading] = useState(false)
  const [selectedId, setSelectedId] = useState<string | null>(null)
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const fetch_ = useCallback(async (params: {
    q: string; trigger: string; collection: string; category: string; page: number
  }) => {
    setLoading(true)
    const sp = new URLSearchParams({ perPage: '50', page: String(params.page) })
    if (params.q) sp.set('q', params.q)
    if (params.trigger !== 'all') sp.set('trigger', params.trigger)
    if (params.collection !== 'all') sp.set('collection', params.collection)
    if (params.category !== 'all') sp.set('category', params.category)
    try {
      const res = await fetch(`/api/workflows?${sp}`)
      const json: SearchResult = await res.json()
      setData(json)
    } finally {
      setLoading(false)
    }
  }, [])

  // Debounce search query; immediate for filters
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => {
      setPage(1)
      fetch_({ q, trigger, collection, category, page: 1 })
    }, 250)
  }, [q]) // eslint-disable-line

  useEffect(() => {
    setPage(1)
    fetch_({ q, trigger, collection, category, page: 1 })
  }, [trigger, collection, category]) // eslint-disable-line

  useEffect(() => {
    fetch_({ q, trigger, collection, category, page })
  }, [page]) // eslint-disable-line

  function handlePageChange(p: number) {
    setPage(p)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Search + Filters */}
      <div className="flex flex-col gap-3 rounded-xl border border-slate-800 bg-[#0d0d14] p-4">
        {/* Search bar */}
        <div className="relative">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">🔍</span>
          <input
            type="text"
            value={q}
            onChange={e => setQ(e.target.value)}
            placeholder="Search by name, service, category…"
            className="w-full rounded-lg border border-slate-700 bg-[#14141f] py-2.5 pl-10 pr-4 text-sm text-slate-200 placeholder-slate-500 outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500/40"
          />
          {q && (
            <button
              onClick={() => setQ('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"
            >✕</button>
          )}
        </div>

        {/* Filter chips */}
        <div className="flex flex-wrap gap-3">
          <FilterGroup
            label="Collection"
            options={COLLECTIONS}
            value={collection}
            onChange={setCollection}
            colors={{ all: 'violet', hub: 'sky', community: 'emerald' }}
          />
          <FilterGroup
            label="Trigger"
            options={TRIGGERS}
            value={trigger}
            onChange={setTrigger}
            colors={{ Scheduled: 'amber', Webhook: 'sky', Triggered: 'emerald', Monitor: 'rose', Manual: 'slate' }}
          />
          {collection === 'community' && (
            <div className="flex flex-wrap items-center gap-1.5">
              <span className="text-xs text-slate-500">Category:</span>
              <select
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="rounded-md border border-slate-700 bg-[#14141f] px-2 py-1 text-xs text-slate-300 outline-none focus:border-violet-500"
              >
                <option value="all">All</option>
                {stats.categories.map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
          )}
        </div>

        {/* Result count */}
        <div className="flex items-center justify-between text-xs text-slate-500">
          <span>
            {loading ? 'Searching…' : (
              <>
                <span className="font-semibold text-slate-300">{data.total.toLocaleString()}</span> workflows
                {q && <> matching <span className="text-violet-400">"{q}"</span></>}
              </>
            )}
          </span>
          {data.pages > 1 && (
            <span>Page {data.page} of {data.pages}</span>
          )}
        </div>
      </div>

      {/* Grid */}
      <div className={`grid gap-3 transition-opacity duration-150 sm:grid-cols-2 lg:grid-cols-3 ${loading ? 'opacity-40' : 'opacity-100'}`}>
        {data.workflows.map(w => (
          <WorkflowCard
            key={w.id}
            workflow={w}
            onClick={() => setSelectedId(w.id)}
          />
        ))}
      </div>

      {data.workflows.length === 0 && !loading && (
        <div className="py-20 text-center text-slate-500">
          <div className="text-4xl">🔍</div>
          <p className="mt-2 text-sm">No workflows found for "{q}"</p>
        </div>
      )}

      {/* Pagination */}
      {data.pages > 1 && (
        <Pagination page={data.page} pages={data.pages} onChange={handlePageChange} />
      )}

      {/* Modal */}
      {selectedId && (
        <WorkflowModal id={selectedId} onClose={() => setSelectedId(null)} />
      )}
    </div>
  )
}

// ─── Sub-components ──────────────────────────────────────────────────────────

const COLOR_MAP: Record<string, string> = {
  violet:  'bg-violet-600/20 text-violet-300 border-violet-700/50 hover:bg-violet-600/30',
  sky:     'bg-sky-600/20 text-sky-300 border-sky-700/50 hover:bg-sky-600/30',
  emerald: 'bg-emerald-600/20 text-emerald-300 border-emerald-700/50 hover:bg-emerald-600/30',
  amber:   'bg-amber-600/20 text-amber-300 border-amber-700/50 hover:bg-amber-600/30',
  rose:    'bg-rose-600/20 text-rose-300 border-rose-700/50 hover:bg-rose-600/30',
  slate:   'bg-slate-700/30 text-slate-300 border-slate-600/50 hover:bg-slate-700/50',
  default: 'bg-slate-700/30 text-slate-300 border-slate-600/50 hover:bg-slate-700/50',
}

function FilterGroup({ label, options, value, onChange, colors }: {
  label: string
  options: string[]
  value: string
  onChange: (v: string) => void
  colors: Record<string, string>
}) {
  return (
    <div className="flex flex-wrap items-center gap-1.5">
      <span className="text-xs text-slate-500">{label}:</span>
      {options.map(opt => {
        const colorKey = colors[opt] ?? 'default'
        const base = COLOR_MAP[colorKey]
        const active = value === opt
        return (
          <button
            key={opt}
            onClick={() => onChange(opt)}
            className={`rounded-full border px-2.5 py-0.5 text-xs font-medium capitalize transition-all ${base} ${active ? 'ring-1 ring-current' : 'opacity-60 hover:opacity-100'}`}
          >
            {opt}
          </button>
        )
      })}
    </div>
  )
}

function Pagination({ page, pages, onChange }: { page: number; pages: number; onChange: (p: number) => void }) {
  const range = buildRange(page, pages)
  return (
    <div className="flex items-center justify-center gap-1 pt-2">
      <PagBtn disabled={page <= 1} onClick={() => onChange(page - 1)}>← Prev</PagBtn>
      {range.map((p, i) =>
        p === '…' ? (
          <span key={`e${i}`} className="px-2 text-slate-600">…</span>
        ) : (
          <PagBtn key={p} active={p === page} onClick={() => onChange(p as number)}>
            {p}
          </PagBtn>
        )
      )}
      <PagBtn disabled={page >= pages} onClick={() => onChange(page + 1)}>Next →</PagBtn>
    </div>
  )
}

function PagBtn({ children, onClick, disabled, active }: {
  children: React.ReactNode; onClick?: () => void; disabled?: boolean; active?: boolean
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`min-w-[36px] rounded-lg border px-3 py-1.5 text-xs font-medium transition-all disabled:cursor-not-allowed disabled:opacity-30 ${
        active
          ? 'border-violet-500 bg-violet-600 text-white'
          : 'border-slate-700 bg-[#0d0d14] text-slate-400 hover:border-slate-600 hover:text-slate-200'
      }`}
    >
      {children}
    </button>
  )
}

function buildRange(page: number, pages: number): (number | '…')[] {
  if (pages <= 7) return Array.from({ length: pages }, (_, i) => i + 1)
  const r: (number | '…')[] = [1]
  if (page > 3) r.push('…')
  for (let p = Math.max(2, page - 1); p <= Math.min(pages - 1, page + 1); p++) r.push(p)
  if (page < pages - 2) r.push('…')
  r.push(pages)
  return r
}
