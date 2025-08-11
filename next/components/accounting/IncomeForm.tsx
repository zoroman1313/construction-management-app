'use client'
import { useState } from 'react'

export default function IncomeForm(){
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string,string>>({})

  async function onSubmit(formData: FormData){
    setLoading(true); setMessage('')
    setErrors({})
    const payload = {
      userId: 'demo-user',
      payerName: String(formData.get('payerName')||''),
      method: String(formData.get('method')||'Cash') as 'Cash'|'BankTransfer',
      bank: String(formData.get('bank')||'')||null,
      amount: Number(formData.get('amount')||0),
      currency: String(formData.get('currency')||'GBP'),
      accountTarget: String(formData.get('accountTarget')||''),
      receivedAt: String(formData.get('receivedAt')||''),
      projectId: String(formData.get('projectId')||'')||null,
      note: String(formData.get('note')||''),
    }
    const res = await fetch('/api/income', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
    if (res.ok) setMessage('Saved')
    else {
      setMessage('Error')
      try{
        const j = await res.json()
        const f = (j?.error||{})
        const mapped: Record<string,string> = {}
        for (const k of Object.keys(f)){
          const issue = f[k]
          if (issue && issue._errors && issue._errors.length) mapped[k] = issue._errors[0]
        }
        setErrors(mapped)
      }catch{}
    }
    setLoading(false)
  }

  const today = new Date().toISOString().slice(0,10)

  return (
    <form action={onSubmit} className="space-y-4 rounded-lg border p-4">
      <div className="grid gap-4 sm:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm">Payer name</span>
          <input name="payerName" required className="w-full rounded border px-3 py-2" />
          {errors.payerName && <p className="text-xs text-red-600">{errors.payerName}</p>}
        </label>
        <label className="space-y-1">
          <span className="text-sm">Amount</span>
          <input name="amount" type="number" step="0.01" min="0" required className="w-full rounded border px-3 py-2" />
          {errors.amount && <p className="text-xs text-red-600">{errors.amount}</p>}
        </label>
        <label className="space-y-1">
          <span className="text-sm">Method</span>
          <select name="method" className="w-full rounded border px-3 py-2">
            <option>Cash</option>
            <option>BankTransfer</option>
          </select>
          {errors.method && <p className="text-xs text-red-600">{errors.method}</p>}
        </label>
        <label className="space-y-1">
          <span className="text-sm">Bank (optional)</span>
          <input name="bank" className="w-full rounded border px-3 py-2" />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Currency</span>
          <input name="currency" defaultValue="GBP" className="w-full rounded border px-3 py-2" />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Account target</span>
          <input name="accountTarget" className="w-full rounded border px-3 py-2" />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Received at</span>
          <input name="receivedAt" type="date" defaultValue={today} required className="w-full rounded border px-3 py-2" />
          {errors.receivedAt && <p className="text-xs text-red-600">{errors.receivedAt}</p>}
        </label>
        <label className="space-y-1">
          <span className="text-sm">Project Id (optional)</span>
          <input name="projectId" className="w-full rounded border px-3 py-2" />
        </label>
      </div>
      <label className="block space-y-1">
        <span className="text-sm">Note</span>
        <textarea name="note" className="w-full rounded border px-3 py-2" />
      </label>
      <button disabled={loading} className="rounded bg-black px-4 py-2 text-white disabled:opacity-50">{loading? 'Saving...':'Save'}</button>
      {message && <span className="text-sm text-slate-600">{message}</span>}
    </form>
  )
}


