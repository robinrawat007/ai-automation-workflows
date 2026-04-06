import { searchWorkflows, getStats } from '@/lib/workflows'
import { WorkflowBrowser } from '@/components/WorkflowBrowser'

export default async function Home() {
  const [initial, stats] = await Promise.all([
    searchWorkflows({ perPage: 50 }),
    getStats(),
  ])

  return (
    <main className="min-h-screen">
      {/* Header */}
      <header className="border-b border-slate-800 bg-[#0d0d14] px-6 py-8">
        <div className="mx-auto max-w-7xl">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white">
                ⚡ N8N Workflow Browser
              </h1>
              <p className="mt-1 text-sm text-slate-400">
                Browse, search, and import automation workflows into your N8N instance
              </p>
            </div>
            <div className="flex flex-wrap gap-4 text-center text-sm">
              <Stat label="Total" value={stats.total.toLocaleString()} color="text-violet-400" />
              <Stat label="Hub" value={stats.hub.toLocaleString()} color="text-sky-400" />
              <Stat label="Community" value={stats.community.toLocaleString()} color="text-emerald-400" />
              <Stat label="Categories" value={String(stats.categories.length)} color="text-amber-400" />
            </div>
          </div>
        </div>
      </header>

      {/* Browser */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <WorkflowBrowser initialData={initial} stats={stats} />
      </div>
    </main>
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
