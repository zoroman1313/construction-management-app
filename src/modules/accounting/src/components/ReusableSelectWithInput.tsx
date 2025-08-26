// ✅ ReusableSelectWithInput.tsx
import { useState } from 'react';

type Props = {
  label: string;
  options: string[];
  value: string;
  onChange: (val: string) => void;
  onOptionAdd?: (newOption: string) => void;
};

export default function ReusableSelectWithInput({ label, options, value, onChange, onOptionAdd }: Props) {
  const [manualInput, setManualInput] = useState('');

  const handleAdd = () => {
    if (manualInput && !options.includes(manualInput)) {
      onChange(manualInput);
      if (onOptionAdd) {
        onOptionAdd(manualInput);
      }
      setManualInput('');
    }
  };

  return (
    <div className="mb-4">
      <label className="block mb-1 font-medium">{label}</label>
      <select
        className="w-full p-2 rounded border mb-2"
        value={options.includes(value) ? value : ''}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="">Select or enter manually</option>
        {options.map((opt) => (
          <option key={opt} value={opt}>{opt}</option>
        ))}
      </select>

      <div className="flex">
        <input
          type="text"
          placeholder={`Enter new ${label.toLowerCase()}`}
          className="flex-1 p-2 rounded-l border border-r-0"
          value={manualInput}
          onChange={(e) => setManualInput(e.target.value)}
        />
        <button
          type="button"
          onClick={handleAdd}
          className="bg-orange-500 text-white px-4 rounded-r"
        >
          Add
        </button>
      </div>
    </div>
  );
}