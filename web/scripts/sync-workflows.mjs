import fs from 'node:fs'
import path from 'node:path'

const webRoot = process.cwd()
const repoRoot = path.join(webRoot, '..')

const destRoot = path.join(webRoot, 'workflow-sources')
fs.mkdirSync(destRoot, { recursive: true })

/**
 * Copy a directory from repo root into web/workflow-sources.
 * This ensures Netlify/Next serverless bundles include the data.
 */
function copyDir(rel) {
  const src = path.join(repoRoot, rel)
  const dest = path.join(destRoot, rel)

  if (!fs.existsSync(src)) {
    console.warn(`[sync-workflows] missing: ${rel}`)
    return
  }

  fs.rmSync(dest, { recursive: true, force: true })
  fs.mkdirSync(path.dirname(dest), { recursive: true })
  fs.cpSync(src, dest, {
    recursive: true,
    dereference: true,
    filter: (p) => {
      const name = path.basename(p)
      if (name === 'node_modules') return false
      if (name === '.git') return false
      return true
    },
  })
}

const SOURCES = [
  'workflows',
  'awesome-n8n-workflows',
  'n8n-free-templates',
  'n8n-ai-automations',
  'n8n-automation-2025-AI-Agent-Suite',
  'n8n_ai_agents',
  'n8n-ai-agents-masterclass-2025',
  'n8n-automation-templates-5000',
  'n8n-workflow-all-templates',
]

for (const dir of SOURCES) copyDir(dir)

console.log(`[sync-workflows] copied ${SOURCES.length} sources into ${path.relative(webRoot, destRoot)}`)

