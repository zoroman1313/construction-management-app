import { NextRequest, NextResponse } from 'next/server'
import { createWriteStream } from 'fs'
import { mkdir, stat } from 'fs/promises'
import path from 'path'
import crypto from 'crypto'

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get('file') as File | null
  if (!file) return NextResponse.json({ error: 'No file' }, { status: 400 })

  const bytes = await file.arrayBuffer()
  // Validate size (<= 5MB)
  if (bytes.byteLength > 5 * 1024 * 1024) {
    return NextResponse.json({ error: 'File too large (max 5MB)' }, { status: 413 })
  }
  // Validate type
  const type = (file.type || '').toLowerCase()
  if (!type.startsWith('image/')) {
    return NextResponse.json({ error: 'Only image uploads are allowed' }, { status: 415 })
  }
  const buffer = Buffer.from(bytes)

  const uploadsDir = path.join(process.cwd(), 'public', 'uploads')
  try { await stat(uploadsDir) } catch { await mkdir(uploadsDir, { recursive: true }) }

  const ext = path.extname(file.name || '').toLowerCase() || '.jpg'
  const filename = `${crypto.randomUUID()}${ext}`
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


