'use client'
import { useState } from 'react'

export default function ExpenseForm(){
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const [errors, setErrors] = useState<Record<string,string>>({})

  async function onSubmit(formData: FormData){
    setLoading(true); setMessage('')
    setErrors({})
    const payload = {
      userId: 'demo-user',
      category: String(formData.get('category')||'Material'),
      vendor: String(formData.get('vendor')||''),
      amount: Number(formData.get('amount')||0),
      currency: String(formData.get('currency')||'GBP'),
      paymentMethod: String(formData.get('paymentMethod')||'Unknown'),
      bank: String(formData.get('bank')||'')||null,
      vat: Number(formData.get('vat')||0),
      discount: Number(formData.get('discount')||0),
      expenseAt: String(formData.get('expenseAt')||''),
      projectId: String(formData.get('projectId')||'')||null,
      note: String(formData.get('note')||''),
    }
    const res = await fetch('/api/expenses', { method:'POST', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) })
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
          <span className="text-sm">Category</span>
          <select name="category" className="w-full rounded border px-3 py-2">
            <option>InitialVisit</option>
            <option>Fuel</option>
            <option>Food</option>
            <option>Material</option>
            <option>Transport</option>
            <option>Labor</option>
            <option>Management</option>
            <option>Misc</option>
          </select>
          {errors.category && <p className="text-xs text-red-600">{errors.category}</p>}
        </label>
        <label className="space-y-1">
          <span className="text-sm">Vendor</span>
          <input name="vendor" className="w-full rounded border px-3 py-2" />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Amount</span>
          <input name="amount" type="number" step="0.01" min="0" required className="w-full rounded border px-3 py-2" />
          {errors.amount && <p className="text-xs text-red-600">{errors.amount}</p>}
        </label>
        <label className="space-y-1">
          <span className="text-sm">Currency</span>
          <input name="currency" defaultValue="GBP" className="w-full rounded border px-3 py-2" />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Payment method</span>
          <select name="paymentMethod" className="w-full rounded border px-3 py-2">
            <option>Unknown</option>
            <option>Cash</option>
            <option>Card</option>
            <option>BankTransfer</option>
          </select>
          {errors.paymentMethod && <p className="text-xs text-red-600">{errors.paymentMethod}</p>}
        </label>
        <label className="space-y-1">
          <span className="text-sm">Bank (optional)</span>
          <input name="bank" className="w-full rounded border px-3 py-2" />
        </label>
        <label className="space-y-1">
          <span className="text-sm">VAT</span>
          <input name="vat" type="number" step="0.01" min="0" className="w-full rounded border px-3 py-2" />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Discount</span>
          <input name="discount" type="number" step="0.01" min="0" className="w-full rounded border px-3 py-2" />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Expense date</span>
          <input name="expenseAt" type="date" defaultValue={today} required className="w-full rounded border px-3 py-2" />
          {errors.expenseAt && <p className="text-xs text-red-600">{errors.expenseAt}</p>}
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


