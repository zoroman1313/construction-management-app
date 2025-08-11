import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db/mongoose'
import Income from '@/lib/models/Income'
import { z } from 'zod'

const schema = z.object({
  userId: z.string(),
  projectId: z.string().nullable().optional(),
  payerName: z.string(),
  method: z.enum(['Cash','BankTransfer']),
  bank: z.string().nullable().optional(),
  amount: z.number().positive(),
  currency: z.string().default('GBP'),
  accountTarget: z.string().optional(),
  receivedAt: z.coerce.date(),
  note: z.string().optional()
})

export async function GET() {
  await dbConnect()
  const docs = await Income.find({ userId: 'demo-user' }).sort({ createdAt: -1 }).lean()
  return NextResponse.json(docs)
}

export async function POST(req: NextRequest) {
  await dbConnect()
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  const doc = await Income.create(parsed.data)
  return NextResponse.json(doc)
}


