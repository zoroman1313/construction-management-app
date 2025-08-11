export default function AccountingHome() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Accounting</h1>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <a className="rounded-lg border p-4 hover:bg-slate-50" href="/accounting/income">Income</a>
        <a className="rounded-lg border p-4 hover:bg-slate-50" href="/accounting/expenses">Expenses</a>
        <a className="rounded-lg border p-4 hover:bg-slate-50" href="/accounting/receipt">Receipt OCR</a>
      </div>
    </div>
  )
}


