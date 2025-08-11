import { dbConnect } from '@/lib/db/mongoose'
import Income from '@/lib/models/Income'
import Expense from '@/lib/models/Expense'

export default async function AccountingHome() {
  await dbConnect()
  const today = new Date()
  const start = new Date(today.toISOString().slice(0,10))
  const end = new Date(start); end.setDate(end.getDate()+1)

  const [incomes, expenses] = await Promise.all([
    Income.find({ receivedAt: { $gte: start, $lt: end }, userId: 'demo-user' }).lean(),
    Expense.find({ expenseAt: { $gte: start, $lt: end }, userId: 'demo-user' }).lean(),
  ])
  const totalIncome = incomes.reduce((s:any,i:any)=> s + (i.amount||0), 0)
  const totalExpense = expenses.reduce((s:any,e:any)=> s + (e.amount||0), 0)

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Daily balance (Today)</h1>
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


