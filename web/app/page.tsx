import { WorkflowBrowser } from '@/components/WorkflowBrowser'
import { HeaderStats } from '@/components/HeaderStats'

export default function Home() {
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
            <HeaderStats />
          </div>
        </div>
      </header>

      {/* Browser */}
      <div className="mx-auto max-w-7xl px-4 py-6">
        <WorkflowBrowser />
      </div>
    </main>
  )
}
