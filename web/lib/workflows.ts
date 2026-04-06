import fs from 'fs'
import path from 'path'
import type { WorkflowMeta, SearchResult, Stats, WorkflowDetail } from '@/types/workflow'

// process.cwd() = web/ (Next.js project root), workflows/ is one level up
const WORKFLOWS_ROOT = path.join(process.cwd(), '..', 'workflows')

// ─── Parsers ────────────────────────────────────────────────────────────────

const TRIGGER_SUFFIXES: Record<string, string> = {
  scheduled: 'Scheduled',
  webhook: 'Webhook',
  triggered: 'Triggered',
  monitor: 'Monitor',
}

function parseTrigger(filename: string): string {
  const lower = filename.toLowerCase().replace('.json', '')
  const last = lower.split('_').at(-1) ?? ''
  return TRIGGER_SUFFIXES[last] ?? 'Manual'
}

const GENERIC = new Set([
  'Automation','Automate','Manual','Triggered','Scheduled','Webhook','Monitor',
  'Create','Update','Send','Process','Import','Export','Automate','Get','Set',
  'Run','Add','Remove','Read','Write','Check','Build','Make','Use','And','Or',
  'The','With','For','From','Into','Http','Json','Api','N8N','N8n',
])

function parseServices(filename: string): string[] {
  const base = filename.replace('.json', '')
  const parts = base.split('_')
  // Skip numeric prefix and last part (trigger)
  const start = /^\d+$/.test(parts[0]) ? 1 : 0
  return parts
    .slice(start, -1)
    .filter(p => p.length > 1 && !GENERIC.has(p))
    .slice(0, 4)
}

function parseHubName(filename: string): string {
  const base = filename.replace('.json', '')
  const parts = base.split('_')
  if (/^\d+$/.test(parts[0])) {
    const services = parseServices(filename)
    const trigger = parseTrigger(filename)
    if (services.length) return `${services.join(' + ')}  ·  ${trigger}`
    return parts.slice(1).join(' ')
  }
  // Named file (special / community-style in hub)
  return base.replace(/_/g, ' ')
}

// ─── Index builder ───────────────────────────────────────────────────────────

let _cache: WorkflowMeta[] | null = null

function buildIndex(): WorkflowMeta[] {
  const list: WorkflowMeta[] = []

  // Hub: flat directory of numbered .json files
  const hubDir = path.join(WORKFLOWS_ROOT, 'hub')
  if (fs.existsSync(hubDir)) {
    for (const filename of fs.readdirSync(hubDir)) {
      if (!filename.endsWith('.json')) continue
      list.push({
        id: `hub::${filename}`,
        filename,
        name: parseHubName(filename),
        trigger: parseTrigger(filename),
        services: parseServices(filename),
        collection: 'hub',
        category: 'Hub',
        filePath: path.join(hubDir, filename),
      })
    }
  }

  // Community: one level of category subdirs
  const communityDir = path.join(WORKFLOWS_ROOT, 'community')
  if (fs.existsSync(communityDir)) {
    for (const entry of fs.readdirSync(communityDir, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue
      const category = entry.name.replace(/_/g, ' ')
      const catPath = path.join(communityDir, entry.name)
      for (const filename of fs.readdirSync(catPath)) {
        if (!filename.endsWith('.json')) continue
        const name = filename.replace('.json', '')
        list.push({
          id: `community::${entry.name}::${filename}`,
          filename,
          name,
          trigger: parseTrigger(filename),
          services: [entry.name.split('_')[0]],
          collection: 'community',
          category,
          filePath: path.join(catPath, filename),
        })
      }
    }
  }

  return list
}

export function getIndex(): WorkflowMeta[] {
  if (!_cache) _cache = buildIndex()
  return _cache
}

// ─── Search ──────────────────────────────────────────────────────────────────

export function searchWorkflows(params: {
  q?: string
  trigger?: string
  collection?: string
  category?: string
  page?: number
  perPage?: number
}): SearchResult {
  const { q = '', trigger = 'all', collection = 'all', category = 'all', page = 1, perPage = 50 } = params
  let results = getIndex()

  if (q) {
    const query = q.toLowerCase()
    results = results.filter(w =>
      w.name.toLowerCase().includes(query) ||
      w.filename.toLowerCase().includes(query) ||
      w.category.toLowerCase().includes(query) ||
      w.services.some(s => s.toLowerCase().includes(query))
    )
  }
  if (trigger !== 'all') results = results.filter(w => w.trigger === trigger)
  if (collection !== 'all') results = results.filter(w => w.collection === collection)
  if (category !== 'all') results = results.filter(w => w.category === category)

  const total = results.length
  const pages = Math.max(1, Math.ceil(total / perPage))
  const clamped = Math.min(Math.max(1, page), pages)
  const start = (clamped - 1) * perPage

  return {
    workflows: results.slice(start, start + perPage),
    total,
    page: clamped,
    pages,
    perPage,
  }
}

// ─── Stats ───────────────────────────────────────────────────────────────────

export function getStats(): Stats {
  const index = getIndex()
  const triggers: Record<string, number> = {}
  const catSet = new Set<string>()

  for (const w of index) {
    triggers[w.trigger] = (triggers[w.trigger] ?? 0) + 1
    if (w.collection === 'community') catSet.add(w.category)
  }

  return {
    total: index.length,
    hub: index.filter(w => w.collection === 'hub').length,
    community: index.filter(w => w.collection === 'community').length,
    triggers,
    categories: [...catSet].sort(),
  }
}

// ─── Detail ──────────────────────────────────────────────────────────────────

export function getWorkflowDetail(id: string): WorkflowDetail | null {
  const meta = getIndex().find(w => w.id === id)
  if (!meta) return null
  try {
    const raw = fs.readFileSync(meta.filePath, 'utf-8')
    const rawJson = JSON.parse(raw)
    const nodeCount = Array.isArray((rawJson as Record<string, unknown>).nodes)
      ? ((rawJson as Record<string, unknown[]>).nodes).length
      : 0
    return { meta, rawJson, nodeCount }
  } catch {
    return null
  }
}
