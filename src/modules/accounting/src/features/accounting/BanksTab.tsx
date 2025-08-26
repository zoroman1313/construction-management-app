// src/features/accounting/BanksTab.tsx
'use client';

import { useEffect, useState } from 'react';

type Bank = {
  id: string;
  name: string;
  balance: number;
};

export default function BanksTab() {
  const [banks, setBanks] = useState<Bank[]>([]);
  const [name, setName] = useState('');
  const [balance, setBalance] = useState<number | ''>('');

  useEffect(() => {
    const saved = localStorage.getItem('contractor_banks');
    if (saved) setBanks(JSON.parse(saved));
  }, []);

  const handleAddBank = () => {
    if (!name || balance === '') {
      alert('Please enter both name and balance.');
      return;
    }

    const newBank: Bank = {
      id: Date.now().toString(),
      name,
      balance: Number(balance),
    };

    const updated = [...banks, newBank];
    setBanks(updated);
    localStorage.setItem('contractor_banks', JSON.stringify(updated));
    setName('');
    setBalance('');
  };

  return (
    <div className="space-y-6">
      <div className="border p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Add Bank Account</h2>
        <input
          type="text"
          placeholder="Bank Name"
          className="w-full p-2 border rounded mb-3"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="number"
          placeholder="Initial Balance"
          className="w-full p-2 border rounded mb-4"
          value={balance}
          onChange={(e) => setBalance(Number(e.target.value))}
        />
        <button
          onClick={handleAddBank}
          className="w-full py-2 px-4 rounded text-white font-semibold"
          style={{ backgroundColor: '#2563eb' }}
        >
          Add Bank
        </button>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-2">Bank Accounts:</h3>
        {banks.length === 0 ? (
          <p className="text-muted">No banks added yet.</p>
        ) : (
          <div className="space-y-2">
            {banks.map((bank) => (
              <div
                key={bank.id}
                className="border p-4 rounded-lg flex justify-between items-center bg-blue-50 border-blue-200"
              >
                <div>
                  <p className="font-medium">{bank.name}</p>
                  <p className="text-sm text-gray-600">£{bank.balance.toFixed(2)}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}