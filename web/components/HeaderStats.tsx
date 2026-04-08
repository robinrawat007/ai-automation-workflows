'use client'

import { useEffect, useState } from 'react'
import type { Stats } from '@/types/workflow'

export function HeaderStats() {
  const [stats, setStats] = useState<Stats | null>(null)

  useEffect(() => {
    fetch('/workflows-stats.json')
      .then(r => r.json() as Promise<Stats>)
      .then(setStats)
      .catch(() => setStats(null))
  }, [])

  if (!stats) {
    return (
      <div className="flex flex-wrap gap-4 text-center text-sm">
        <Stat label="Total" value="—" color="text-violet-400" />
        <Stat label="Collections" value="—" color="text-sky-400" />
        <Stat label="Categories" value="—" color="text-emerald-400" />
      </div>
    )
  }

  return (
    <div className="flex flex-wrap gap-4 text-center text-sm">
      <Stat label="Total" value={stats.total.toLocaleString()} color="text-violet-400" />
      <Stat label="Collections" value={String(Object.keys(stats.collections).length)} color="text-sky-400" />
      <Stat label="Categories" value={String(stats.categories.length)} color="text-emerald-400" />
    </div>
  )
}

function Stat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="min-w-[70px] rounded-lg border border-slate-800 bg-[#0d0d14] px-4 py-2">
      <div className={`text-xl font-bold ${color}`}>{value}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  )
}

