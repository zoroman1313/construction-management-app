import { NextRequest, NextResponse } from 'next/server'
import { createWriteStream } from 'fs'
import { mkdir, stat } from 'fs/promises'
import path from 'path'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const bytes = await file.arrayBuffer()
  const buffer = Buffer.from(bytes)

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  try { await stat(uploadsDir) } catch { await mkdir(uploadsDir, { recursive: true }) }

  const filename = `${Date.now()}-${file.name.replace(/\s+/g,'_')}`
  const filepath = path.join(uploadsDir, filename)
  await new Promise<void>((resolve, reject) => {
    const stream = createWriteStream(filepath)
    stream.on('error', reject)
    stream.on('finish', () => resolve())
    stream.write(buffer)
    stream.end()
  })

  const publicUrl = `/uploads/${filename}`
  return NextResponse.json({ url: publicUrl })
}


