'use client';

import { useEffect, useState } from 'react';
import { ToolItem } from './types';

export default function ToolsTab() {
  const [tools, setTools] = useState<ToolItem[]>([]);
  const [form, setForm] = useState<Omit<ToolItem, 'id'>>({
    name: '',
    quantity: 1,
    price: 0,
    owner: 'self',
    date: new Date().toISOString().split('T')[0],
    notes: '',
  });

  useEffect(() => {
    const saved = localStorage.getItem('tools');
    if (saved) setTools(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('tools', JSON.stringify(tools));
  }, [tools]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: name === 'quantity' || name === 'price' ? +value : value }));
  };

  const addTool = () => {
    if (!form.name) return;
    const newTool: ToolItem = { id: Date.now().toString(), ...form };
    setTools(prev => [...prev, newTool]);
    setForm({ name: '', quantity: 1, price: 0, owner: 'self', date: new Date().toISOString().split('T')[0], notes: '' });
  };

  const deleteTool = (id: string) => setTools(prev => prev.filter(t => t.id !== id));

  return (
    <div className="p-4 space-y-6">
      <h2 className="text-xl font-bold">Tool Management</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input name="name" value={form.name} onChange={handleChange} placeholder="Tool name" className="border p-2 rounded" />
        <input name="quantity" type="number" value={form.quantity} onChange={handleChange} placeholder="Quantity" className="border p-2 rounded" />
        <input name="price" type="number" value={form.price} onChange={handleChange} placeholder="Price" className="border p-2 rounded" />
        <select name="owner" value={form.owner} onChange={handleChange} className="border p-2 rounded">
          <option value="self">Owned</option>
          <option value="borrowed">Borrowed</option>
        </select>
        <input name="date" type="date" value={form.date} onChange={handleChange} className="border p-2 rounded" />
        <textarea name="notes" value={form.notes} onChange={handleChange} placeholder="Notes" className="border p-2 rounded col-span-1 md:col-span-2" />
      </div>

      <button onClick={addTool} className="bg-blue-600 text-white px-4 py-2 rounded">Add Tool</button>

      <table className="w-full text-sm mt-6">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="p-2">Name</th>
            <th className="p-2">Qty</th>
            <th className="p-2">Price</th>
            <th className="p-2">Owner</th>
            <th className="p-2">Date</th>
            <th className="p-2">Notes</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {tools.map(t => (
            <tr key={t.id} className="border-t">
              <td className="p-2">{t.name}</td>
              <td className="p-2">{t.quantity}</td>
              <td className="p-2">£{t.price}</td>
              <td className="p-2 capitalize">{t.owner}</td>
              <td className="p-2">{t.date}</td>
              <td className="p-2">{t.notes}</td>
              <td className="p-2">
                <button onClick={() => deleteTool(t.id)} className="text-red-600 hover:underline">Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}