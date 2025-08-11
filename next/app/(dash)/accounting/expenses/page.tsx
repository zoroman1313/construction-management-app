import ExpenseForm from '@/components/accounting/ExpenseForm'
import ExpenseList from '@/components/accounting/ExpenseList'

export default function ExpensesPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Expenses</h1>
      <ExpenseForm />
      <ExpenseList />
    </div>
  )
}


