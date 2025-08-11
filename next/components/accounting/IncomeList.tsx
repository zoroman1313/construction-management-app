'use client'
import { useEffect, useState } from 'react'

type IncomeDoc = {
  _id: string
  payerName: string
  method: 'Cash'|'BankTransfer'
  amount: number
  currency: string
  receivedAt: string
}

export default function IncomeList(){
  const [rows, setRows] = useState<IncomeDoc[]>([])
  const [loading, setLoading] = useState(false)

  useEffect(()=>{
    let alive = true
    setLoading(true)
    fetch('/api/income').then(r=>r.json()).then(d=>{ if (alive) setRows(d||[]) }).finally(()=> setLoading(false))
    return ()=>{ alive=false }
  },[])

  return (
    <div className="rounded-lg border">
      <div className="flex items-center justify-between p-3">
        <h3 className="font-medium">Recent income</h3>
        {loading && <span className="text-sm text-slate-500">Loading…</span>}
      </div>
      <div className="max-h-96 overflow-y-auto">
        <table className="w-full text-sm">
          <thead className="sticky top-0 bg-white">
            <tr className="text-left">
              <th className="px-3 py-2 border-b">Date</th>
              <th className="px-3 py-2 border-b">Payer</th>
              <th className="px-3 py-2 border-b">Method</th>
              <th className="px-3 py-2 border-b">Amount</th>
              <th className="px-3 py-2 border-b">Currency</th>
            </tr>
          </thead>
          <tbody>
            {rows.map(r=> (
              <tr key={r._id} className="odd:bg-slate-50/50">
                <td className="px-3 py-2 border-b">{new Date(r.receivedAt).toLocaleDateString()}</td>
                <td className="px-3 py-2 border-b">{r.payerName}</td>
                <td className="px-3 py-2 border-b">{r.method}</td>
                <td className="px-3 py-2 border-b">£{(r.amount||0).toFixed(2)}</td>
                <td className="px-3 py-2 border-b">{r.currency}</td>
              </tr>
            ))}
            {rows.length===0 && !loading && (
              <tr><td className="px-3 py-6 text-center text-slate-500" colSpan={5}>No income yet</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}


