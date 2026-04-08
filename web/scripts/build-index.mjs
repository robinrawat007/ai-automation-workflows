import fs from 'node:fs'
import path from 'node:path'

const webRoot = process.cwd()
const repoRoot = path.join(webRoot, '..')
const outDir = path.join(webRoot, 'public')

fs.mkdirSync(outDir, { recursive: true })

const TRIGGER_SUFFIXES = {
  scheduled: 'Scheduled',
  webhook: 'Webhook',
  triggered: 'Triggered',
  monitor: 'Monitor',
}

function parseTrigger(filename) {
  const lower = filename.toLowerCase().replace('.json', '')
  const last = (lower.split('_').at(-1) ?? '')
  return TRIGGER_SUFFIXES[last] ?? 'Manual'
}

const GENERIC = new Set([
  'Automation','Automate','Manual','Triggered','Scheduled','Webhook','Monitor',
  'Create','Update','Send','Process','Import','Export','Get','Set',
  'Run','Add','Remove','Read','Write','Check','Build','Make','Use','And','Or',
  'The','With','For','From','Into','Http','Json','Api','N8N','N8n',
])

function parseServices(filename) {
  const base = filename.replace('.json', '')
  const parts = base.split('_')
  const start = /^\d+$/.test(parts[0]) ? 1 : 0
  return parts
    .slice(start, -1)
    .filter(p => p.length > 1 && !GENERIC.has(p))
    .slice(0, 4)
}

function parseHubName(filename) {
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

function firstDirCategory(relPath) {
  const first = relPath.split(/[/\\]/)[0]
  return first.replace(/_/g, ' ').replace(/-/g, ' ')
}

function walkJsonFiles(rootAbs, onFile) {
  if (!fs.existsSync(rootAbs)) return
  const stack = [rootAbs]
  while (stack.length) {
    const dir = stack.pop()
    let entries = []
    try { entries = fs.readdirSync(dir, { withFileTypes: true }) } catch { continue }
    for (const e of entries) {
      if (e.name.startsWith('.') || e.name === 'node_modules') continue
      const full = path.join(dir, e.name)
      if (e.isDirectory()) stack.push(full)
      else if (e.isFile() && e.name.endsWith('.json')) onFile(full)
    }
  }
}

function scanSource({ rootRel, collection, categoryFn }) {
  const rootAbs = path.join(repoRoot, rootRel)
  const list = []
  walkJsonFiles(rootAbs, (fullPath) => {
    const relFromRoot = path.relative(rootAbs, fullPath).replace(/\\/g, '/')
    const repoPath = `${rootRel.replace(/\\/g, '/')}/${relFromRoot}`
    const filename = path.basename(fullPath)
    const category = categoryFn ? categoryFn(relFromRoot) : collection.replace(/[-_]/g, ' ')
    list.push({
      id: `${collection}::${relFromRoot}`,
      filename,
      name: parseHubName(filename),
      trigger: parseTrigger(filename),
      services: parseServices(filename),
      collection,
      category,
      repoPath,
    })
  })
  return list
}

// Build index
const workflows = []

// hub
{
  const hubRel = 'workflows/hub'
  const hubAbs = path.join(repoRoot, hubRel)
  if (fs.existsSync(hubAbs)) {
    for (const filename of fs.readdirSync(hubAbs)) {
      if (!filename.endsWith('.json')) continue
      workflows.push({
        id: `hub::${filename}`,
        filename,
        name: parseHubName(filename),
        trigger: parseTrigger(filename),
        services: parseServices(filename),
        collection: 'hub',
        category: 'Hub',
        repoPath: `${hubRel}/${filename}`,
      })
    }
  }
}

// community
{
  const communityRel = 'workflows/community'
  const communityAbs = path.join(repoRoot, communityRel)
  if (fs.existsSync(communityAbs)) {
    const entries = fs.readdirSync(communityAbs, { withFileTypes: true })
    for (const e of entries) {
      if (!e.isDirectory()) continue
      const catDir = e.name
      const category = catDir.replace(/_/g, ' ')
      const catAbs = path.join(communityAbs, catDir)
      for (const filename of fs.readdirSync(catAbs)) {
        if (!filename.endsWith('.json')) continue
        workflows.push({
          id: `community::${catDir}::${filename}`,
          filename,
          name: filename.replace('.json', '').replace(/_/g, ' '),
          trigger: parseTrigger(filename),
          services: [catDir.split('_')[0]],
          collection: 'community',
          category,
          repoPath: `${communityRel}/${catDir}/${filename}`.replace(/\\/g, '/'),
        })
      }
    }
  }
}

// other big sources (scanned recursively)
workflows.push(...scanSource({ rootRel: 'awesome-n8n-workflows', collection: 'awesome', categoryFn: firstDirCategory }))
workflows.push(...scanSource({ rootRel: 'n8n-free-templates', collection: 'free-templates', categoryFn: firstDirCategory }))
workflows.push(...scanSource({ rootRel: 'n8n-ai-automations', collection: 'ai-automations', categoryFn: null }))
workflows.push(...scanSource({ rootRel: 'n8n-automation-2025-AI-Agent-Suite', collection: 'ai-agent-suite', categoryFn: firstDirCategory }))
workflows.push(...scanSource({ rootRel: 'n8n_ai_agents', collection: 'ai-agents', categoryFn: firstDirCategory }))
workflows.push(...scanSource({ rootRel: 'n8n-ai-agents-masterclass-2025', collection: 'masterclass', categoryFn: null }))
workflows.push(...scanSource({ rootRel: 'n8n-automation-templates-5000', collection: 'templates-5000', categoryFn: firstDirCategory }))

// n8n-workflow-all-templates has an extra nested folder in this repo layout
workflows.push(...scanSource({
  rootRel: 'n8n-workflow-all-templates/n8n-workflow-all-templates',
  collection: 'all-templates',
  categoryFn: null,
}))

// Stats
const triggers = {}
const collections = {}
const catSet = new Set()
for (const w of workflows) {
  triggers[w.trigger] = (triggers[w.trigger] ?? 0) + 1
  collections[w.collection] = (collections[w.collection] ?? 0) + 1
  catSet.add(w.category)
}

const stats = {
  total: workflows.length,
  hub: collections.hub ?? 0,
  community: collections.community ?? 0,
  collections,
  triggers,
  categories: Array.from(catSet).sort(),
}

fs.writeFileSync(path.join(outDir, 'workflows-index.json'), JSON.stringify(workflows))
fs.writeFileSync(path.join(outDir, 'workflows-stats.json'), JSON.stringify(stats))

console.log(`[build-index] wrote ${workflows.length} workflows`)
