'use client';

import { useEffect, useState } from 'react';

interface InvoiceItem {
  description: string;
  quantity: number;
  unitPrice: number;
}

interface Invoice {
  id: string;
  project: string;
  client: string;
  date: string;
  items: InvoiceItem[];
}

export default function InvoicesTab() {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [project, setProject] = useState('');
  const [client, setClient] = useState('');
  const [date, setDate] = useState('');
  const [items, setItems] = useState<InvoiceItem[]>([]);

  const [newItem, setNewItem] = useState<InvoiceItem>({
    description: '',
    quantity: 1,
    unitPrice: 0,
  });

  useEffect(() => {
    const saved = localStorage.getItem('contractor_invoices');
    if (saved) setInvoices(JSON.parse(saved));
  }, []);

  const handleAddItem = () => {
    if (!newItem.description || newItem.unitPrice <= 0) return;
    setItems((prev) => [...prev, newItem]);
    setNewItem({ description: '', quantity: 1, unitPrice: 0 });
  };

  const handleCreateInvoice = () => {
    if (!project || !client || !date || items.length === 0) return alert('Please complete all fields and add at least one item.');

    const invoice: Invoice = {
      id: Date.now().toString(),
      project,
      client,
      date,
      items,
    };

    const updated = [...invoices, invoice];
    setInvoices(updated);
    localStorage.setItem('contractor_invoices', JSON.stringify(updated));

    setProject('');
    setClient('');
    setDate('');
    setItems([]);
  };

  return (
    <div className="space-y-6">
      <div className="border rounded-xl p-6">
        <h2 className="text-xl font-bold mb-4">Create Invoice</h2>
        <input
          placeholder="Project Name"
          className="input"
          value={project}
          onChange={(e) => setProject(e.target.value)}
        />
        <input
          placeholder="Client Name"
          className="input"
          value={client}
          onChange={(e) => setClient(e.target.value)}
        />
        <input
          type="date"
          className="input"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />

        <div className="mt-4">
          <h3 className="font-semibold mb-2">Add Item</h3>
          <input
            placeholder="Description"
            className="input"
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
          />
          <input
            type="number"
            placeholder="Quantity"
            className="input"
            value={newItem.quantity}
            onChange={(e) => setNewItem({ ...newItem, quantity: Number(e.target.value) })}
          />
          <input
            type="number"
            placeholder="Unit Price"
            className="input"
            value={newItem.unitPrice}
            onChange={(e) => setNewItem({ ...newItem, unitPrice: Number(e.target.value) })}
          />
          <button className="btn" onClick={handleAddItem}>Add Item</button>
        </div>

        <button className="btn w-full mt-4" onClick={handleCreateInvoice}>Create Invoice</button>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-2">Invoices</h3>
        {invoices.length === 0 ? (
          <p className="text-muted">No invoices yet.</p>
        ) : (
          <ul className="space-y-2">
            {invoices.map((inv) => (
              <li key={inv.id} className="border p-4 rounded-lg">
                <p className="font-semibold">{inv.project} — {inv.client}</p>
                <p className="text-sm text-gray-600">Date: {inv.date}</p>
                <ul className="mt-2 text-sm list-disc pl-4">
                  {inv.items.map((item, idx) => (
                    <li key={idx}>{item.description} — {item.quantity} x £{item.unitPrice}</li>
                  ))}
                </ul>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

const inputClass = "w-full p-2 mb-2 border rounded";
const btnClass = "py-2 px-4 bg-blue-600 text-white rounded mt-2";
