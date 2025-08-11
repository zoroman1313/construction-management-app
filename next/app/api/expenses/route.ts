import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db/mongoose'
import Expense from '@/lib/models/Expense'
import { z } from 'zod'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const lineItem = z.object({ name: z.string(), qty: z.number().optional(), unit_price: z.number().optional(), total: z.number().optional() })
const schema = z.object({
  projectId: z.string().optional().nullable(),
  category: z.enum(['InitialVisit','Fuel','Food','Material','Transport','Labor','Management','Misc']),
  vendor: z.string().optional().default(''),
  amount: z.number().positive(),
  currency: z.string().optional().default('GBP'),
  paymentMethod: z.enum(['Cash','Card','BankTransfer','Unknown']).optional().default('Unknown'),
  bank: z.string().optional().nullable(),
  vat: z.number().optional().default(0),
  discount: z.number().optional().default(0),
  items: z.array(lineItem).optional().default([]),
  expenseAt: z.string(),
  receiptImageUrl: z.string().optional().default(''),
  rawText: z.string().optional().default(''),
  confidence: z.number().optional().default(0),
  note: z.string().optional().default('')
})

export async function GET() {
  await dbConnect()
  const docs = await Expense.find({ userId: 'demo-user' }).sort({ createdAt: -1 }).lean()
  return NextResponse.json(docs)
}

export async function POST(req: NextRequest) {
  const json = await req.json().catch(()=>null)
  const parsed = schema.safeParse(json)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 })
  await dbConnect()
  const created = await Expense.create({ ...parsed.data, userId: 'demo-user' })
  return NextResponse.json(created)
}


