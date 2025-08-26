'use client';

import { useEffect, useState } from 'react';
import theme from '@/theme';

type Person = {
  id: string;
  name: string;
  role: string;
  wage: number;
  location: string;
};

export default function TeamTab() {
  const [name, setName] = useState('');
  const [role, setRole] = useState('');
  const [newRole, setNewRole] = useState('');
  const [wage, setWage] = useState<number | ''>('');
  const [location, setLocation] = useState('');
  const [newLocation, setNewLocation] = useState('');
  const [team, setTeam] = useState<Person[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [roles, setRoles] = useState<string[]>([]);

  useEffect(() => {
    const project = localStorage.getItem('contractor_project_setup');
    if (project) {
      const parsed = JSON.parse(project);
      setLocations(parsed.locations || []);
    }

    const existingTeam = localStorage.getItem('contractor_team');
    if (existingTeam) {
      const parsedTeam = JSON.parse(existingTeam);
      setTeam(parsedTeam);
    }

    const savedRoles = localStorage.getItem('contractor_roles');
    if (savedRoles) {
      setRoles(JSON.parse(savedRoles));
    }

    const savedLocations = localStorage.getItem('contractor_locations');
    if (savedLocations) {
      setLocations((prev) => Array.from(new Set([...prev, ...JSON.parse(savedLocations)])));
    }
  }, []);

  const handleAdd = () => {
    const finalRole = newRole || role;
    const finalLocation = newLocation || location;

    if (!name || !finalRole || !wage || !finalLocation) {
      alert('Please fill in all fields.');
      return;
    }

    const newPerson: Person = {
      id: Date.now().toString(),
      name,
      role: finalRole,
      wage: Number(wage),
      location: finalLocation,
    };

    const updatedTeam = [...team, newPerson];
    setTeam(updatedTeam);
    localStorage.setItem('contractor_team', JSON.stringify(updatedTeam));

    if (!roles.includes(finalRole)) {
      const updatedRoles = [...roles, finalRole];
      setRoles(updatedRoles);
      localStorage.setItem('contractor_roles', JSON.stringify(updatedRoles));
    }

    if (!locations.includes(finalLocation)) {
      const updatedLocations = [...locations, finalLocation];
      setLocations(updatedLocations);
      localStorage.setItem('contractor_locations', JSON.stringify(updatedLocations));
    }

    setName('');
    setRole('');
    setNewRole('');
    setWage('');
    setLocation('');
    setNewLocation('');
  };

  return (
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

      <select
        className="w-full p-2 rounded mb-2 border"
        value={role}
        onChange={(e) => setRole(e.target.value)}
      >
        <option value="">Select role</option>
        {roles.map((r) => (
          <option key={r} value={r}>{r}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Or type new role"
        className="w-full p-2 rounded mb-4 border"
        value={newRole}
        onChange={(e) => setNewRole(e.target.value)}
      />

      <input
        type="number"
        placeholder="Wage (e.g. £150)"
        className="w-full p-2 rounded mb-4 border"
        value={wage}
        onChange={(e) => setWage(Number(e.target.value))}
      />

      <select
        className="w-full p-2 rounded mb-2 border"
        value={location}
        onChange={(e) => setLocation(e.target.value)}
      >
        <option value="">Select location</option>
        {locations.map((loc) => (
          <option key={loc} value={loc}>{loc}</option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Or type new location"
        className="w-full p-2 rounded mb-6 border"
        value={newLocation}
        onChange={(e) => setNewLocation(e.target.value)}
      />

      <button
        onClick={handleAdd}
        className="w-full py-3 rounded font-semibold"
        style={{ backgroundColor: theme.colors.primary, color: '#fff' }}
      >
        Save Team Member
      </button>

      <div className="mt-10">
        <h3 className="mb-4" style={{ color: theme.colors.text, fontWeight: 'bold' }}>
          Registered Members:
        </h3>
        {team.length === 0 ? (
          <p style={{ color: theme.colors.muted }}>No members added yet.</p>
        ) : (
          <ul className="space-y-2">
            {team.map((person) => (
              <li key={person.id} className="border rounded p-3 flex justify-between items-center"
                style={{ borderColor: theme.colors.muted }}>
                <span>{person.name} ({person.role})</span>
                <span style={{ color: theme.colors.primary }}>{person.wage} – {person.location}</span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}