import { NextRequest, NextResponse } from 'next/server'
import { ReceiptParseRequest } from '@/lib/ocr/contracts'
import parserLocal, { parserLocal as parserAlias } from '@/lib/ocr/parserLocal'

export async function POST(req: NextRequest) {
  const body = (await req.json()) as ReceiptParseRequest
  try {
    // support default export or named as per spec
    const parser = (parserAlias || parserLocal) as any
    const result = await parser.parse(body)
    return NextResponse.json(result)
  } catch (e:any) {
    return NextResponse.json({ error: e?.message || 'parse failed' }, { status: 500 })
  }
}


