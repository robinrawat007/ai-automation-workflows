import fs from 'fs'
import path from 'path'
import type { WorkflowMeta, SearchResult, Stats, WorkflowDetail } from '@/types/workflow'

const REPO_ROOT = path.join(process.cwd(), '..')
const WORKFLOWS_ROOT = path.join(REPO_ROOT, 'workflows')

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
  return base.replace(/_/g, ' ').replace(/-/g, ' ')
}

// ─── Recursive scanner ───────────────────────────────────────────────────────

/**
 * Walk a directory tree and collect all .json files as WorkflowMeta.
 * categoryFn receives the path relative to rootDir and returns the category label.
 * Pass null to use the collection name as a flat category.
 */
function scanSource(
  rootDir: string,
  collection: string,
  categoryFn: ((relPath: string) => string) | null = null,
): WorkflowMeta[] {
  if (!fs.existsSync(rootDir)) return []
  const list: WorkflowMeta[] = []

  function walk(dir: string) {
    let entries: fs.Dirent[]
    try { entries = fs.readdirSync(dir, { withFileTypes: true }) } catch { return }
    for (const entry of entries) {
      if (entry.name.startsWith('.') || entry.name === 'node_modules') continue
      const fullPath = path.join(dir, entry.name)
      if (entry.isDirectory()) {
        walk(fullPath)
      } else if (entry.name.endsWith('.json')) {
        const relPath = path.relative(rootDir, fullPath)
        const category = categoryFn
          ? categoryFn(relPath)
          : collection.replace(/-/g, ' ').replace(/_/g, ' ')
        list.push({
          id: `${collection}::${relPath.replace(/\\/g, '/')}`,
          filename: entry.name,
          name: parseHubName(entry.name),
          trigger: parseTrigger(entry.name),
          services: parseServices(entry.name),
          collection,
          category,
          filePath: fullPath,
        })
      }
    }
  }

  walk(rootDir)
  return list
}

/** Category = first path component (top-level subdir name), cleaned up */
function firstDirCategory(relPath: string): string {
  const first = relPath.split(/[/\\]/)[0]
  return first.replace(/_/g, ' ').replace(/-/g, ' ')
}

// ─── Index builder ───────────────────────────────────────────────────────────

let _cache: WorkflowMeta[] | null = null

function buildIndex(): WorkflowMeta[] {
  const list: WorkflowMeta[] = []

  // ── Original sources ──────────────────────────────────────────────────────

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
        list.push({
          id: `community::${entry.name}::${filename}`,
          filename,
          name: filename.replace('.json', '').replace(/_/g, ' '),
          trigger: parseTrigger(filename),
          services: [entry.name.split('_')[0]],
          collection: 'community',
          category,
          filePath: path.join(catPath, filename),
        })
      }
    }
  }

  // ── New sources ───────────────────────────────────────────────────────────

  // awesome-n8n-workflows: category subdirs (analytics, automation, crm, …)
  list.push(...scanSource(
    path.join(REPO_ROOT, 'awesome-n8n-workflows'),
    'awesome',
    firstDirCategory,
  ))

  // n8n-free-templates: category subdirs (AI_ML, Agriculture, …)
  list.push(...scanSource(
    path.join(REPO_ROOT, 'n8n-free-templates'),
    'free-templates',
    firstDirCategory,
  ))

  // n8n-ai-automations: flat directory
  list.push(...scanSource(
    path.join(REPO_ROOT, 'n8n-ai-automations'),
    'ai-automations',
    null,
  ))

  // n8n-automation-2025-AI-Agent-Suite: top-level dirs are service categories
  // skip 'img' and non-JSON dirs automatically
  list.push(...scanSource(
    path.join(REPO_ROOT, 'n8n-automation-2025-AI-Agent-Suite'),
    'ai-agent-suite',
    firstDirCategory,
  ))

  // n8n_ai_agents: numbered subdirs with agent workflows
  list.push(...scanSource(
    path.join(REPO_ROOT, 'n8n_ai_agents'),
    'ai-agents',
    firstDirCategory,
  ))

  // n8n-ai-agents-masterclass-2025: flat directory
  list.push(...scanSource(
    path.join(REPO_ROOT, 'n8n-ai-agents-masterclass-2025'),
    'masterclass',
    null,
  ))

  // n8n-automation-templates-5000: mixed structure, use top-level dir as category
  list.push(...scanSource(
    path.join(REPO_ROOT, 'n8n-automation-templates-5000'),
    'templates-5000',
    firstDirCategory,
  ))

  // n8n-workflow-all-templates: deeply nested numbered dirs — flat category
  list.push(...scanSource(
    path.join(REPO_ROOT, 'n8n-workflow-all-templates', 'n8n-workflow-all-templates'),
    'all-templates',
    null,
  ))

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
  const collections: Record<string, number> = {}
  const catSet = new Set<string>()

  for (const w of index) {
    triggers[w.trigger] = (triggers[w.trigger] ?? 0) + 1
    collections[w.collection] = (collections[w.collection] ?? 0) + 1
    catSet.add(w.category)
  }

  return {
    total: index.length,
    hub: collections['hub'] ?? 0,
    community: collections['community'] ?? 0,
    collections,
    triggers,
    categories: Array.from(catSet).sort(),
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
