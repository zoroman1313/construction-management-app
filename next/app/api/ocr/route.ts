import { NextRequest, NextResponse } from 'next/server'
import localParser from '@/lib/ocr/parserLocal'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const body = await req.json().catch(()=>null)
  if (!body?.fileUrl) return NextResponse.json({ error: 'fileUrl required' }, { status: 400 })
  const result = await localParser.parse({ fileUrl: body.fileUrl, projectId: body.projectId || null, locale: body.locale || 'en' })
  return NextResponse.json(result)
}


