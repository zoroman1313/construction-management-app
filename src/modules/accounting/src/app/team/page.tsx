'use client';

import { useEffect, useState } from 'react';
import theme from '@/theme';
import ReusableSelectWithInput from '../../components/ReusableSelectWithInput';

type Person = {
  id: string;
  name: string;
  role: string;
  wage: number;
  location: string;
};

export default function TeamPage() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [location, setLocation] = useState('');
  const [wage, setWage] = useState<number | ''>('');
  const [roles, setRoles] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [team, setTeam] = useState<Person[]>([]);

  useEffect(() => {
    const project = localStorage.getItem('contractor_project_setup');
    if (project) {
      const parsed = JSON.parse(project);
      setLocations(parsed.locations || []);
    }

    const savedRoles = localStorage.getItem('contractor_roles');
    if (savedRoles) setRoles(JSON.parse(savedRoles));

    const savedLocations = localStorage.getItem('contractor_locations');
    if (savedLocations) {
      setLocations((prev) => Array.from(new Set([...prev, ...JSON.parse(savedLocations)])));
    }

    const existingTeam = localStorage.getItem('contractor_team');
    if (existingTeam) setTeam(JSON.parse(existingTeam));
  }, []);

  const handleAdd = () => {
    if (!name || !role || !location || !wage) {
      alert('Please fill in all fields.');
      return;
    }

    const newPerson: Person = {
      id: Date.now().toString(),
      name,
      role,
      wage: Number(wage),
      location,
    };

    const updatedTeam = [...team, newPerson];
    setTeam(updatedTeam);
    localStorage.setItem('contractor_team', JSON.stringify(updatedTeam));
  };

  return (
    <main
      className="min-h-screen flex flex-col items-center px-4 py-10"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div
        className="shadow-xl rounded-2xl border p-8 w-full max-w-xl mb-8"
        style={{ backgroundColor: theme.colors.card, borderColor: theme.colors.muted }}
      >
        <h2
          className="text-center mb-6"
          style={{ color: theme.colors.text, fontSize: theme.font.size.lg, fontWeight: 'bold' }}
        >
          Add Team Member
        </h2>

        <input
          type="text"
          placeholder="Full name"
          className="w-full p-2 rounded mb-4 border"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <ReusableSelectWithInput
          label="Role"
          value={role}
          onChange={setRole}
          options={roles}
          onOptionAdd={(newRole) => {
            const updated = [...roles, newRole];
            setRoles(updated);
            localStorage.setItem('contractor_roles', JSON.stringify(updated));
          }}
        />

        <input
          type="number"
          placeholder="Wage (e.g. £150)"
          className="w-full p-2 rounded my-4 border"
          value={wage}
          onChange={(e) => setWage(Number(e.target.value))}
        />

        <ReusableSelectWithInput
          label="Location"
          value={location}
          onChange={setLocation}
          options={locations}
          onOptionAdd={(newLocation) => {
            const updated = [...locations, newLocation];
            setLocations(updated);
            localStorage.setItem('contractor_locations', JSON.stringify(updated));
          }}
        />

        <button
          onClick={handleAdd}
          className="w-full py-3 rounded mt-6 font-semibold"
          style={{ backgroundColor: theme.colors.primary, color: '#fff' }}
        >
          Save Team Member
        </button>
      </div>

      <div className="w-full max-w-xl">
        <h3 className="mb-4" style={{ color: theme.colors.text, fontWeight: 'bold' }}>
          Registered Members:
        </h3>
        {team.length === 0 ? (
          <p style={{ color: theme.colors.muted }}>No one added yet.</p>
        ) : (
          <ul className="space-y-2">
            {team.map((person) => (
              <li
                key={person.id}
                className="border rounded p-3 flex justify-between items-center"
                style={{ borderColor: theme.colors.muted }}
              >
                <span>
                  {person.name} ({person.role})
                </span>
                <span style={{ color: theme.colors.primary }}>
                  £{person.wage} – {person.location}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}