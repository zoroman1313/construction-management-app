import { NextRequest, NextResponse } from 'next/server'
import { dbConnect } from '@/lib/db/mongoose'
import Expense from '@/lib/models/Expense'
import { z } from 'zod'

const item = z.object({
  name: z.string(),
  qty: z.number().optional(),
  unit_price: z.number().optional(),
  total: z.number().optional()
})

const schema = z.object({
  userId: z.string(),
  projectId: z.string().nullable().optional(),
  category: z.enum(['InitialVisit','Fuel','Food','Material','Transport','Labor','Management','Misc']),
  vendor: z.string().optional(),
  amount: z.number().nonnegative(),
  currency: z.string().default('GBP'),
  paymentMethod: z.enum(['Cash','Card','BankTransfer','Unknown']).default('Unknown'),
  bank: z.string().nullable().optional(),
  vat: z.number().nonnegative().default(0),
  discount: z.number().nonnegative().default(0),
  items: z.array(item).optional(),
  expenseAt: z.coerce.date(),
  receiptImageUrl: z.string().optional(),
  rawText: z.string().optional(),
  confidence: z.number().min(0).max(1).optional(),
  note: z.string().optional()
})

export async function GET() {
  await dbConnect()
  const docs = await Expense.find({ userId: 'demo-user' }).sort({ createdAt: -1 }).lean()
  return NextResponse.json(docs)
}

export async function POST(req: NextRequest) {
  await dbConnect()
  const body = await req.json()
  const parsed = schema.safeParse(body)
  if (!parsed.success) return NextResponse.json({ error: parsed.error.format() }, { status: 400 })
  const doc = await Expense.create(parsed.data)
  return NextResponse.json(doc)
}


