'use client';

import { useEffect, useRef, useState } from 'react';

type Contract = {
  id: string;
  title: string;
  party: string;
  date: string;
  fileName?: string;
};

export default function ContractsTab() {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [title, setTitle] = useState('');
  const [party, setParty] = useState('');
  const [date, setDate] = useState('');
  const [fileName, setFileName] = useState<string | undefined>();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const saved = localStorage.getItem('contractor_contracts');
    if (saved) setContracts(JSON.parse(saved));
  }, []);

  const handleAddContract = () => {
    if (!title || !party || !date) {
      alert('Please fill in all fields.');
      return;
    }

    const newContract: Contract = {
      id: Date.now().toString(),
      title,
      party,
      date,
      fileName,
    };

    const updated = [...contracts, newContract];
    setContracts(updated);
    localStorage.setItem('contractor_contracts', JSON.stringify(updated));

    setTitle('');
    setParty('');
    setDate('');
    setFileName(undefined);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) setFileName(file.name);
  };

  return (
    <div className="space-y-6">
      <div className="border p-6 rounded-xl">
        <h2 className="text-xl font-bold mb-4">Add Contract</h2>
        <input
          type="text"
          placeholder="Contract Title"
          className="w-full p-2 border rounded mb-3"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Party Involved"
          className="w-full p-2 border rounded mb-3"
          value={party}
          onChange={(e) => setParty(e.target.value)}
        />
        <input
          type="date"
          className="w-full p-2 border rounded mb-3"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
        <input
          type="file"
          accept=".pdf"
          ref={fileInputRef}
          className="mb-4"
          onChange={handleFileUpload}
        />
        <button
          onClick={handleAddContract}
          className="w-full py-2 px-4 rounded text-white font-semibold"
          style={{ backgroundColor: '#2563eb' }}
        >
          Add Contract
        </button>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-2">Contracts:</h3>
        {contracts.length === 0 ? (
          <p className="text-muted">No contracts added yet.</p>
        ) : (
          <div className="space-y-2">
            {contracts.map((c) => (
              <div
                key={c.id}
                className="border p-4 rounded-lg bg-slate-50 flex justify-between items-center"
              >
                <div>
                  <p className="font-medium">{c.title}</p>
                  <p className="text-sm text-gray-600">
                    Party: {c.party} — Date: {c.date}
                  </p>
                  {c.fileName && (
                    <p className="text-xs text-gray-500">File: {c.fileName}</p>
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