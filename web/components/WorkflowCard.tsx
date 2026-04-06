'use client'

import type { WorkflowMeta } from '@/types/workflow'

const TRIGGER_STYLES: Record<string, string> = {
  Scheduled: 'bg-amber-600/15 text-amber-300 border-amber-700/40',
  Webhook:   'bg-sky-600/15 text-sky-300 border-sky-700/40',
  Triggered: 'bg-emerald-600/15 text-emerald-300 border-emerald-700/40',
  Monitor:   'bg-rose-600/15 text-rose-300 border-rose-700/40',
  Manual:    'bg-slate-600/15 text-slate-400 border-slate-700/40',
}

const TRIGGER_ICONS: Record<string, string> = {
  Scheduled: '🕐', Webhook: '🔗', Triggered: '⚡', Monitor: '👁', Manual: '▶',
}

const COLLECTION_STYLES: Record<string, string> = {
  hub:       'bg-sky-600/10 text-sky-400 border-sky-800/40',
  community: 'bg-violet-600/10 text-violet-400 border-violet-800/40',
}

export function WorkflowCard({ workflow: w, onClick }: { workflow: WorkflowMeta; onClick: () => void }) {
  const triggerStyle = TRIGGER_STYLES[w.trigger] ?? TRIGGER_STYLES.Manual
  const collectionStyle = COLLECTION_STYLES[w.collection]

  return (
    <button
      onClick={onClick}
      className="group flex flex-col gap-3 rounded-xl border border-slate-800 bg-[#0d0d14] p-4 text-left transition-all duration-150 hover:border-slate-700 hover:bg-[#14141f] hover:shadow-lg hover:shadow-black/30 active:scale-[0.99]"
    >
      {/* Badges */}
      <div className="flex flex-wrap items-center gap-1.5">
        <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-[11px] font-medium ${triggerStyle}`}>
          {TRIGGER_ICONS[w.trigger]} {w.trigger}
        </span>
        <span className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium capitalize ${collectionStyle}`}>
          {w.collection}
        </span>
      </div>

      {/* Name */}
      <h3 className="line-clamp-2 text-sm font-medium leading-snug text-slate-200 group-hover:text-white">
        {w.name}
      </h3>

      {/* Footer */}
      <div className="mt-auto flex items-center justify-between">
        {/* Services */}
        {w.services.length > 0 ? (
          <div className="flex flex-wrap gap-1">
            {w.services.slice(0, 3).map(s => (
              <span key={s} className="rounded bg-slate-800/80 px-1.5 py-0.5 text-[10px] text-slate-400">
                {s}
              </span>
            ))}
            {w.services.length > 3 && (
              <span className="rounded bg-slate-800/80 px-1.5 py-0.5 text-[10px] text-slate-600">
                +{w.services.length - 3}
              </span>
            )}
          </div>
        ) : (
          <span className="text-[11px] text-slate-600">{w.category}</span>
        )}
        <span className="ml-2 shrink-0 text-[10px] text-slate-600 opacity-0 transition-opacity group-hover:opacity-100">
          View →
        </span>
      </div>
    </button>
  )
}
