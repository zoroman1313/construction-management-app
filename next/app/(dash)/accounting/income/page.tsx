import IncomeForm from '@/components/accounting/IncomeForm'
import IncomeList from '@/components/accounting/IncomeList'

export default function IncomePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Income</h1>
      <IncomeForm />
      <IncomeList />
    </div>
  )
}


