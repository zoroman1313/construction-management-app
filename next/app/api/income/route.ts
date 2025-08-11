import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db/mongoose'
import Income from '@/lib/models/Income'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const schema = z.object({
  payerName: z.string().min(1),
  method: z.enum(['Cash', 'BankTransfer']),
  bank: z.string().optional().nullable(),
  amount: z.number().positive(),
  currency: z.string().default('GBP'),
  accountTarget: z.string().optional().default(''),
  receivedAt: z.string().min(1),
  projectId: z.string().optional().nullable(),
  note: z.string().optional().default(''),
})

export async function GET() {
  await dbConnect()
  const docs = await Income.find({ userId: 'demo-user' }).sort({ createdAt: -1 }).lean()
  return NextResponse.json(docs)
}

export async function POST(req: NextRequest) {
  const json = await req.json().catch(()=>null)
  const parsed = schema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  await dbConnect()
  const created = await Income.create({ ...parsed.data, userId: 'demo-user' })
  return NextResponse.json(created)
}


