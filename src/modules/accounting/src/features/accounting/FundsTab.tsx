'use client';

import { useEffect, useState } from 'react';

type FundEntry = {
  id: string;
  source: string;
  amount: number;
  date: string;
  note?: string;
};

export default function FundsTab() {
  const [funds, setFunds] = useState<FundEntry[]>([]);
  const [source, setSource] = useState('');
  const [amount, setAmount] = useState('');
  const [date, setDate] = useState('');
  const [note, setNote] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('contractor_funds');
    if (saved) setFunds(JSON.parse(saved));
  }, []);

  const handleAddFund = () => {
    if (!source || !amount || !date) {
      alert('Please fill in all required fields.');
      return;
    }

    const newFund: FundEntry = {
      id: Date.now().toString(),
      source,
      amount: parseFloat(amount),
      date,
      note: note || '',
    };

    const updated = [...funds, newFund];
    setFunds(updated);
    localStorage.setItem('contractor_funds', JSON.stringify(updated));

    setSource('');
    setAmount('');
    setDate('');
    setNote('');
  };

  return (
    <div className="space-y-6">
      <div className="border p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Add Received Funds</h2>
        <input
          type="text"
          placeholder="Source or Client"
          className="w-full p-2 border rounded mb-3"
          value={source}
          onChange={(e) => setSource(e.target.value)}
        />
        <input
          type="number"
          placeholder="Amount (£)"
          className="w-full p-2 border rounded mb-3"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
        <input
          type="date"
          className="w-full p-2 border rounded mb-3"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="text"
          placeholder="Optional note"
          className="w-full p-2 border rounded mb-3"
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
        <button
          onClick={handleAddFund}
          className="w-full py-2 px-4 rounded text-white font-semibold"
          style={{ backgroundColor: '#16a34a' }}
        >
          Add Fund
        </button>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-2">Received Funds:</h3>
        {funds.length === 0 ? (
          <p className="text-muted">No funds recorded yet.</p>
        ) : (
          <div className="space-y-2">
            {funds.map((f) => (
              <div
                key={f.id}
                className="border p-4 rounded-lg bg-slate-50 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">£{f.amount.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">
                    Source: {f.source} — Date: {f.date}
                  </p>
                  {f.note && (
                    <p className="text-xs text-gray-500">Note: {f.note}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
