import { useState, useEffect } from 'react';

interface Project {
  id: string;
  name: string;
  client?: string;
  startDate: string;
  notes?: string;
}

export default function ProjectsTab() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [startDate, setStartDate] = useState('');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('projects');
    if (saved) setProjects(JSON.parse(saved));
  }, []);

  const handleAddProject = () => {
    if (!name || !startDate) return;

    const newProject: Project = {
      id: Date.now().toString(),
      name,
      client,
      startDate,
      notes,
    };

    const updated = [...projects, newProject];
    setProjects(updated);
    localStorage.setItem('projects', JSON.stringify(updated));

    // Reset form
    setName('');
    setClient('');
    setStartDate('');
    setNotes('');
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Projects</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <input
          type="text"
          placeholder="Project Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Client Name (optional)"
          value={client}
          onChange={(e) => setClient(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="text"
          placeholder="Notes (optional)"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="border p-2 rounded"
        />
      </div>
      <button
        onClick={handleAddProject}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Add Project
      </button>

      <div className="mt-6">
        <h3 className="text-lg font-medium mb-2">Project List</h3>
        {projects.length === 0 ? (
          <p className="text-gray-500">No projects added yet.</p>
        ) : (
          <ul className="space-y-2">
            {projects.map((p) => (
              <li
                key={p.id}
                className="border p-2 rounded bg-gray-50"
              >
                <strong>{p.name}</strong> — {p.client || 'No client'} — {p.startDate}
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
