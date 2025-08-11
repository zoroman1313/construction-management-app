import { dbConnect } from '@/lib/db/mongoose'
import Income from '@/lib/models/Income'
import Expense from '@/lib/models/Expense'
import { Suspense } from 'react'

function getDateFromSearch(searchParams: Record<string,string|undefined>){
  const q = (searchParams?.date || '').toString()
  if (/^\d{4}-\d{2}-\d{2}$/.test(q)) return new Date(q)
  return new Date()
}

export default async function AccountingHome({ searchParams }: { searchParams?: Record<string,string|undefined> }) {
  await dbConnect()
  const base = getDateFromSearch(searchParams||{})
  const start = new Date(base.toISOString().slice(0,10))
  const end = new Date(start); end.setDate(end.getDate()+1)

  const [incomes, expenses] = await Promise.all([
    Income.find({ receivedAt: { $gte: start, $lt: end }, userId: 'demo-user' }).lean(),
    Expense.find({ expenseAt: { $gte: start, $lt: end }, userId: 'demo-user' }).lean(),
  ])
  const totalIncome = incomes.reduce((s:any,i:any)=> s + (i.amount||0), 0)
  const totalExpense = expenses.reduce((s:any,e:any)=> s + (e.amount||0), 0)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Daily balance</h1>
      <DatePickerControls dateISO={start.toISOString().slice(0,10)} />
      <div className="rounded-lg border p-4">
        <div>Total income: £{totalIncome.toFixed(2)}</div>
        <div>Total expense: £{totalExpense.toFixed(2)}</div>
        <div>Balance: £{(totalIncome-totalExpense).toFixed(2)}</div>
      </div>
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        <div>
          <h2 className="mb-2 font-medium">Incomes</h2>
          <pre className="text-sm p-2 border rounded overflow-auto max-h-[360px]">{JSON.stringify(incomes,null,2)}</pre>
        </div>
        <div>
          <h2 className="mb-2 font-medium">Expenses</h2>
          <pre className="text-sm p-2 border rounded overflow-auto max-h-[360px]">{JSON.stringify(expenses,null,2)}</pre>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <a className="rounded-lg border p-4 hover:bg-slate-50" href="/accounting/income">Income</a>
        <a className="rounded-lg border p-4 hover:bg-slate-50" href="/accounting/expenses">Expenses</a>
        <a className="rounded-lg border p-4 hover:bg-slate-50" href="/accounting/receipt">Receipt OCR</a>
      </div>
    </div>
  )
}

function DatePickerControls({ dateISO }: { dateISO: string }){
  return (
    <form action="/accounting" className="flex items-center gap-2">
      <input type="date" name="date" defaultValue={dateISO} className="rounded border px-3 py-2" />
      <button className="rounded bg-black px-3 py-2 text-white">Go</button>
    </form>
  )
}


