'use client'

import { useEffect, useState, useCallback } from 'react'
import type { WorkflowDetail } from '@/types/workflow'

export function WorkflowModal({ id, onClose }: { id: string; onClose: () => void }) {
  const [detail, setDetail] = useState<WorkflowDetail | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [copied, setCopied] = useState(false)
  const [tab, setTab] = useState<'info' | 'json'>('info')

  useEffect(() => {
    setLoading(true)
    setError(null)
    fetch(`/api/workflows/detail?id=${encodeURIComponent(id)}`)
      .then(r => r.ok ? r.json() : Promise.reject('Not found'))
      .then((d: WorkflowDetail) => setDetail(d))
      .catch(() => setError('Failed to load workflow'))
      .finally(() => setLoading(false))
  }, [id])

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  const copyJson = useCallback(() => {
    if (!detail) return
    navigator.clipboard.writeText(JSON.stringify(detail.rawJson, null, 2))
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [detail])

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl border border-slate-800 bg-[#0d0d14] shadow-2xl shadow-black/60">

        {/* Header */}
        <div className="flex items-start justify-between gap-4 border-b border-slate-800 px-6 py-4">
          <div className="min-w-0 flex-1">
            {loading ? (
              <div className="h-5 w-48 animate-pulse rounded bg-slate-800" />
            ) : (
              <h2 className="text-base font-semibold leading-snug text-white">
                {detail?.meta.name ?? 'Workflow'}
              </h2>
            )}
          </div>
          <button
            onClick={onClose}
            className="shrink-0 rounded-lg p-1.5 text-slate-500 hover:bg-slate-800 hover:text-slate-300"
          >
            ✕
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-800 px-6">
          {(['info', 'json'] as const).map(t => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`border-b-2 px-4 py-2.5 text-sm font-medium capitalize transition-colors ${
                tab === t
                  ? 'border-violet-500 text-violet-400'
                  : 'border-transparent text-slate-500 hover:text-slate-300'
              }`}
            >
              {t === 'info' ? '📋 Info' : '{ } JSON'}
            </button>
          ))}
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto">
          {loading && (
            <div className="flex h-40 items-center justify-center text-slate-500">
              <span className="animate-spin text-2xl">⏳</span>
            </div>
          )}
          {error && (
            <div className="flex h-40 items-center justify-center text-rose-400">{error}</div>
          )}
          {detail && tab === 'info' && <InfoTab detail={detail} />}
          {detail && tab === 'json' && <JsonTab detail={detail} />}
        </div>

        {/* Footer */}
        {detail && (
          <div className="flex items-center justify-between border-t border-slate-800 px-6 py-3">
            <div className="text-xs text-slate-500">
              <span className="font-mono">{detail.meta.filename}</span>
            </div>
            <div className="flex gap-2">
              <button
                onClick={copyJson}
                className={`rounded-lg border px-3 py-1.5 text-xs font-medium transition-all ${
                  copied
                    ? 'border-emerald-700 bg-emerald-600/20 text-emerald-400'
                    : 'border-slate-700 bg-slate-800 text-slate-300 hover:border-slate-600 hover:text-white'
                }`}
              >
                {copied ? '✓ Copied!' : '⎘ Copy JSON'}
              </button>
              <a
                href={`data:application/json,${encodeURIComponent(JSON.stringify(detail.rawJson, null, 2))}`}
                download={detail.meta.filename}
                className="rounded-lg border border-violet-700 bg-violet-600/20 px-3 py-1.5 text-xs font-medium text-violet-300 transition-all hover:bg-violet-600/30 hover:text-violet-200"
              >
                ⬇ Download
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Info tab ────────────────────────────────────────────────────────────────

function InfoTab({ detail: { meta, nodeCount } }: { detail: WorkflowDetail }) {
  return (
    <div className="space-y-5 px-6 py-5">
      {/* Metadata grid */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <MetaField label="Collection" value={<Cap>{meta.collection}</Cap>} />
        <MetaField label="Trigger" value={meta.trigger} />
        <MetaField label="Nodes" value={nodeCount > 0 ? String(nodeCount) : '—'} />
        <MetaField label="Category" value={meta.category} span />
      </div>

      {/* Services */}
      {meta.services.length > 0 && (
        <div>
          <p className="mb-2 text-xs font-medium uppercase tracking-wider text-slate-500">Integrations</p>
          <div className="flex flex-wrap gap-1.5">
            {meta.services.map(s => (
              <span key={s} className="rounded-md bg-slate-800 px-2 py-1 text-xs text-slate-300">
                {s}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Import instructions */}
      <div className="rounded-xl border border-slate-800 bg-[#14141f] p-4 text-sm text-slate-400">
        <p className="mb-3 font-medium text-slate-300">How to import into N8N</p>
        <ol className="list-inside list-decimal space-y-1.5 text-xs leading-relaxed">
          <li>Copy the JSON using the button below</li>
          <li>Open your N8N dashboard</li>
          <li>Press <kbd className="rounded bg-slate-700 px-1.5 py-0.5 font-mono text-[10px]">Ctrl+I</kbd> or go to <strong>Workflows → Import</strong></li>
          <li>Paste the JSON and click Import</li>
          <li>Configure credentials for each service node</li>
          <li>Activate the workflow to start automating</li>
        </ol>
      </div>
    </div>
  )
}

function MetaField({ label, value, span }: { label: string; value: React.ReactNode; span?: boolean }) {
  return (
    <div className={`rounded-lg border border-slate-800 bg-[#14141f] px-3 py-2.5 ${span ? 'col-span-2' : ''}`}>
      <p className="text-[10px] font-medium uppercase tracking-wider text-slate-600">{label}</p>
      <p className="mt-0.5 text-sm font-medium text-slate-300">{value}</p>
    </div>
  )
}

function Cap({ children }: { children: React.ReactNode }) {
  return <span className="capitalize">{children}</span>
}

// ─── JSON tab ────────────────────────────────────────────────────────────────

function JsonTab({ detail }: { detail: WorkflowDetail }) {
  const highlighted = highlightJson(JSON.stringify(detail.rawJson, null, 2))
  return (
    <div className="relative">
      <pre
        className="overflow-x-auto px-6 py-4 font-mono text-[11px] leading-relaxed"
        dangerouslySetInnerHTML={{ __html: highlighted }}
      />
    </div>
  )
}

function highlightJson(json: string): string {
  return json
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(
      /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
      match => {
        if (/^"/.test(match)) {
          if (/:$/.test(match)) return `<span class="json-key">${match}</span>`
          return `<span class="json-string">${match}</span>`
        }
        if (/true|false/.test(match)) return `<span class="json-bool">${match}</span>`
        if (/null/.test(match)) return `<span class="json-null">${match}</span>`
        return `<span class="json-number">${match}</span>`
      }
    )
}
