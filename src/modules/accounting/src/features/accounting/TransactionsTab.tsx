'use client';

import { useEffect, useState } from 'react';

interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: 'income' | 'expense';
  date: string;
  category: string;
}

export default function TransactionsTab() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [newTransaction, setNewTransaction] = useState<Transaction>({
    id: '',
    title: '',
    amount: 0,
    type: 'expense',
    date: new Date().toISOString().substring(0, 10),
    category: '',
  });

  useEffect(() => {
    const stored = localStorage.getItem('contractor_transactions');
    if (stored) setTransactions(JSON.parse(stored));
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setNewTransaction((prev) => ({
      ...prev,
      [name]: name === 'amount' ? parseFloat(value) : value,
    }));
  };

  const handleAdd = () => {
    const tx = {
      ...newTransaction,
      id: Date.now().toString(),
    };
    const updated = [...transactions, tx];
    setTransactions(updated);
    localStorage.setItem('contractor_transactions', JSON.stringify(updated));

    // reset
    setNewTransaction({
      id: '',
      title: '',
      amount: 0,
      type: 'expense',
      date: new Date().toISOString().substring(0, 10),
      category: '',
    });
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold">Transactions</h2>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-4 border p-4 rounded">
        <input
          type="text"
          name="title"
          placeholder="Title"
          value={newTransaction.title}
          onChange={handleChange}
          className="border px-2 py-1 rounded"
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={newTransaction.amount}
          onChange={handleChange}
          className="border px-2 py-1 rounded"
        />
        <select
          name="type"
          value={newTransaction.type}
          onChange={handleChange}
          className="border px-2 py-1 rounded"
        >
          <option value="expense">Expense</option>
          <option value="income">Income</option>
        </select>
        <input
          type="date"
          name="date"
          value={newTransaction.date}
          onChange={handleChange}
          className="border px-2 py-1 rounded"
        />
        <input
          type="text"
          name="category"
          placeholder="Category"
          value={newTransaction.category}
          onChange={handleChange}
          className="border px-2 py-1 rounded"
        />
        <button
          onClick={handleAdd}
          className="bg-blue-600 text-white px-4 py-2 rounded"
        >
          + Add Transaction
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full border text-sm">
          <thead>
            <tr className="bg-gray-100">
              <th className="border px-2 py-1">Title</th>
              <th className="border px-2 py-1">Amount</th>
              <th className="border px-2 py-1">Type</th>
              <th className="border px-2 py-1">Date</th>
              <th className="border px-2 py-1">Category</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <tr key={tx.id}>
                <td className="border px-2 py-1">{tx.title}</td>
                <td className="border px-2 py-1">£{tx.amount}</td>
                <td className="border px-2 py-1">{tx.type}</td>
                <td className="border px-2 py-1">{tx.date}</td>
                <td className="border px-2 py-1">{tx.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}