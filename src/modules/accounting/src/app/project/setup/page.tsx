'use client';

import { useState } from 'react';
import theme from '@/theme';

export default function ProjectSetup() {
  const [projectName, setProjectName] = useState('');
  const [clientName, setClientName] = useState('');
  const [locations, setLocations] = useState<string[]>(['']);

  const handleSubmit = () => {
    const data = {
      projectName,
      clientName,
      locations: locations.filter(loc => loc.trim() !== ''),
    };
    localStorage.setItem('contractor_project_setup', JSON.stringify(data));
    alert('Project saved ✅');
  };

  const handleLocationChange = (value: string, index: number) => {
    const newLocations = [...locations];
    newLocations[index] = value;
    setLocations(newLocations);
  };

  const addLocation = () => {
    setLocations([...locations, '']);
  };

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div
        className="rounded-2xl shadow-xl border p-8 w-full max-w-xl"
        style={{
          backgroundColor: theme.colors.card,
          borderColor: theme.colors.muted,
        }}
      >
        <h2
          className="text-center mb-6"
          style={{ color: theme.colors.text, fontSize: theme.font.size.lg, fontWeight: 'bold' }}
        >
          تعریف پروژه جدید
        </h2>

        <input
          type="text"
          placeholder="اسم پروژه"
          className="w-full p-2 rounded mb-4 border"
          value={projectName}
          onChange={(e) => setProjectName(e.target.value)}
        />

        <input
          type="text"
          placeholder="نام کارفرما"
          className="w-full p-2 rounded mb-4 border"
          value={clientName}
          onChange={(e) => setClientName(e.target.value)}
        />

        <div className="mb-4">
          <label className="block mb-2 text-sm" style={{ color: theme.colors.text }}>محل‌های کار:</label>
          {locations.map((loc, idx) => (
            <input
              key={idx}
              type="text"
              placeholder={`مثلاً آشپزخانه ${idx + 1}`}
              className="w-full p-2 rounded mb-2 border"
              value={loc}
              onChange={(e) => handleLocationChange(e.target.value, idx)}
            />
          ))}
          <button
            type="button"
            onClick={addLocation}
            className="mt-2 text-sm font-medium"
            style={{ color: theme.colors.primary }}
          >
            + افزودن محل دیگر
          </button>
        </div>

        <button
          onClick={handleSubmit}
          className="w-full py-3 rounded font-semibold"
          style={{ backgroundColor: theme.colors.primary, color: '#fff' }}
        >
          ذخیره پروژه
        </button>
      </div>
    </main>
  );
}