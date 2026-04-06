import { NextRequest, NextResponse } from 'next/server'
import { searchWorkflows } from '@/lib/workflows'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const sp = req.nextUrl.searchParams
  const result = searchWorkflows({
    q:          sp.get('q')          ?? '',
    trigger:    sp.get('trigger')    ?? 'all',
    collection: sp.get('collection') ?? 'all',
    category:   sp.get('category')  ?? 'all',
    page:       Number(sp.get('page')    ?? 1),
    perPage:    Number(sp.get('perPage') ?? 50),
  })
  return NextResponse.json(result)
}
