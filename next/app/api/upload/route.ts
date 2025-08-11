import { NextRequest, NextResponse } from 'next/server'
import { promises as fs } from 'fs'
import path from 'path'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

export async function POST(req: NextRequest) {
  const form = await req.formData()
  const file = form.get('file') as unknown as File
  if (!file) return NextResponse.json({ error: 'Missing file' }, { status: 400 })

  const bytes = Buffer.from(await file.arrayBuffer())
  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  await fs.mkdir(uploadsDir, { recursive: true })
  const fname = `${Date.now()}-${file.name.replace(/[^a-zA-Z0-9_.-]/g,'_')}`
  const outPath = path.join(uploadsDir, fname)
  await fs.writeFile(outPath, bytes)
  const url = `/uploads/${fname}`
  return NextResponse.json({ url })
}


