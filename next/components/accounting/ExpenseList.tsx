'use client'
import { useEffect, useState } from 'react'

type ExpenseDoc = {
  _id: string
  category: string
  vendor?: string
  amount: number
  paymentMethod: 'Cash'|'Card'|'BankTransfer'|'Unknown'
  expenseAt: string
}

export default function ExpenseList(){
  const [rows, setRows] = useState<ExpenseDoc[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    let alive = true
    setLoading(true)
    fetch('/api/expenses').then(r=>r.json()).then(d=>{ if (alive) setRows(d||[]) }).finally(()=> setLoading(false))
    return ()=>{ alive=false }
  },[])

  return (
    <div className="rounded-lg border">
      <div className="flex items-center justify-between p-3">
        <h3 className="font-medium">Recent expenses</h3>
        {loading && <span className="text-sm text-slate-500">Loading…</span>}
      </div>
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white">
            <tr className="text-left">
              <th className="px-3 py-2 border-b">Date</th>
              <th className="px-3 py-2 border-b">Category</th>
              <th className="px-3 py-2 border-b">Vendor</th>
              <th className="px-3 py-2 border-b">Amount</th>
              <th className="px-3 py-2 border-b">Payment</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r=> (
              <tr key={r._id} className="odd:bg-slate-50/50">
                <td className="px-3 py-2 border-b">{new Date(r.expenseAt).toLocaleDateString()}</td>
                <td className="px-3 py-2 border-b">{r.category}</td>
                <td className="px-3 py-2 border-b">{r.vendor||'-'}</td>
                <td className="px-3 py-2 border-b">£{(r.amount||0).toFixed(2)}</td>
                <td className="px-3 py-2 border-b">{r.paymentMethod}</td>
              </tr>
            ))}
            {rows.length===0 && !loading && (
              <tr><td className="px-3 py-6 text-center text-slate-500" colSpan={5}>No expenses yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}


