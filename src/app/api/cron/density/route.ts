import { NextResponse } from 'next/server'
import { syncAllDestinationsDensity } from '@/app/actions/density'

export async function GET() {
  try {
    const result = await syncAllDestinationsDensity()
    return NextResponse.json(result)
  } catch (error) {
    return NextResponse.json({ error: 'Failed to sync density' }, { status: 500 })
  }
}
