'use client';

type Tab = {
  id: string;
  label: string;
  icon?: string;
};

type Props = {
  tabs: readonly { id: string; label: string; icon?: string }[];
  activeTab: string;
  onChange: (id: string) => void;
};

export default function TabNavigation({ tabs, activeTab, onChange }: Props) {
  return (
    <div className="flex flex-wrap justify-center gap-2">
      {tabs.map((t) => {
        const active = t.id === activeTab;
        return (
          <button
            key={t.id}
            onClick={() => onChange(t.id)}
            className={[
              'px-4 py-2 rounded-md border transition',
              active
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-gray-100 text-gray-800 border-gray-300 hover:bg-gray-200',
            ].join(' ')}
            aria-pressed={active}
          >
            <span className="inline-flex items-center gap-2">
              {t.icon ? <span aria-hidden>{t.icon}</span> : null}
              {t.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
