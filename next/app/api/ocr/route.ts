import { NextRequest, NextResponse } from 'next/server'
import { ReceiptParseRequest } from '@/lib/ocr/contracts'
import { parserLocal } from '@/lib/ocr/parserLocal'
import { parserRemote } from '@/lib/ocr/parserRemote'

const USE_REMOTE = process.env.USE_REMOTE_OCR === 'true'

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ReceiptParseRequest
  try {
    const parser = USE_REMOTE ? parserRemote : parserLocal
    const result = await parser.parse(body)
    return NextResponse.json(result)
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || 'parse failed' }, { status: 500 })
  }
}


