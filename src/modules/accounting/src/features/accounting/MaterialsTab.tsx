'use client';

import { useEffect, useState } from 'react';

type Material = {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  date: string;
  location?: string;
};

export default function MaterialsTab() {
  const [materials, setMaterials] = useState<Material[]>([]);
  const [name, setName] = useState('');
  const [quantity, setQuantity] = useState<number | ''>('');
  const [unit, setUnit] = useState('');
  const [unitPrice, setUnitPrice] = useState<number | ''>('');
  const [location, setLocation] = useState('');
  const [locations, setLocations] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('contractor_materials');
    if (saved) setMaterials(JSON.parse(saved));

    const project = localStorage.getItem('contractor_project_setup');
    if (project) {
      const parsed = JSON.parse(project);
      setLocations(parsed.locations || []);
    }
  }, []);

  const handleAddMaterial = () => {
    if (!name || !quantity || !unit || !unitPrice) {
      alert('Please fill in all required fields.');
      return;
    }

    const newMaterial: Material = {
      id: Date.now().toString(),
      name,
      quantity: Number(quantity),
      unit,
      unitPrice: Number(unitPrice),
      date: new Date().toISOString().split('T')[0],
      location: location || undefined,
    };

    const updated = [...materials, newMaterial];
    setMaterials(updated);
    localStorage.setItem('contractor_materials', JSON.stringify(updated));

    // reset form
    setName('');
    setQuantity('');
    setUnit('');
    setUnitPrice('');
    setLocation('');
  };

  const totalCost = materials.reduce((sum, m) => sum + m.quantity * m.unitPrice, 0);

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-xl font-bold">Materials</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input className="p-2 border rounded" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
        <input className="p-2 border rounded" type="number" placeholder="Quantity" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
        <input className="p-2 border rounded" placeholder="Unit (e.g. m, pcs)" value={unit} onChange={(e) => setUnit(e.target.value)} />
        <input className="p-2 border rounded" type="number" placeholder="Unit Price (£)" value={unitPrice} onChange={(e) => setUnitPrice(Number(e.target.value))} />
        <select className="p-2 border rounded" value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="">Select location</option>
          {locations.map((loc) => (
            <option key={loc} value={loc}>{loc}</option>
          ))}
        </select>
      </div>
      <button onClick={handleAddMaterial} className="py-2 px-6 rounded bg-blue-600 text-white">Add Material</button>

      <div className="mt-8">
        <h3 className="text-lg font-semibold mb-2">Material List</h3>
        {materials.length === 0 ? (
          <p className="text-gray-500">No materials added yet.</p>
        ) : (
          <div className="space-y-2">
            {materials.map((m) => (
              <div key={m.id} className="border p-3 rounded flex justify-between items-center">
                <div>
                  <p className="font-medium">{m.name} - {m.quantity} {m.unit} @ £{m.unitPrice.toFixed(2)} each</p>
                  <p className="text-sm text-gray-500">{m.location} • {m.date}</p>
                </div>
                <div className="font-bold text-blue-700">£{(m.quantity * m.unitPrice).toFixed(2)}</div>
              </div>
            ))}
          </div>
        )}
        <p className="text-right font-semibold mt-4">Total Cost: £{totalCost.toFixed(2)}</p>
      </div>
    </div>
  );
}
