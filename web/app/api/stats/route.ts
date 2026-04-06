import { NextResponse } from 'next/server'
import { getStats } from '@/lib/workflows'

export const dynamic = 'force-dynamic'

export async function GET() {
  return NextResponse.json(getStats())
}
