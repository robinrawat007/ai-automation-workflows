import fs from 'node:fs/promises'
import path from 'node:path'
import { NextResponse } from 'next/server'

function safeResolveRepoFile(repoRelativePath: string) {
  const webRoot = process.cwd()
  const repoRoot = path.resolve(webRoot, '..')

  // Normalize and strip any leading slashes to avoid absolute paths.
  const normalized = repoRelativePath.replace(/\\/g, '/').replace(/^\/+/, '')

  // Prevent traversal.
  if (normalized.includes('..')) return null

  const abs = path.resolve(repoRoot, normalized)
  if (!abs.startsWith(repoRoot + path.sep)) return null

  return abs
}

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const p = searchParams.get('path')
  if (!p) {
    return NextResponse.json({ error: 'Missing path' }, { status: 400 })
  }

  const abs = safeResolveRepoFile(p)
  if (!abs) {
    return NextResponse.json({ error: 'Invalid path' }, { status: 400 })
  }

  try {
    const raw = await fs.readFile(abs, 'utf8')
    // Validate JSON and return parsed value (keeps client code simple).
    const parsed = JSON.parse(raw)
    return NextResponse.json(parsed, { status: 200 })
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Failed to read workflow'
    return NextResponse.json({ error: msg }, { status: 404 })
  }
}
