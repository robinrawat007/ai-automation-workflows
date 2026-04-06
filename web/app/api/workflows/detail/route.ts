import { NextRequest, NextResponse } from 'next/server'
import { getWorkflowDetail } from '@/lib/workflows'

export const dynamic = 'force-dynamic'

export async function GET(req: NextRequest) {
  const id = req.nextUrl.searchParams.get('id')
  if (!id) return NextResponse.json({ error: 'id required' }, { status: 400 })

  const detail = getWorkflowDetail(decodeURIComponent(id))
  if (!detail) return NextResponse.json({ error: 'not found' }, { status: 404 })

  return NextResponse.json(detail)
}
