'use client';

import theme from '@/theme';

const modules = [
  { name: 'Accounting', emoji: '🧮', href: '#' },
  { name: 'Reports', emoji: '📋', href: '#' },
  { name: 'Estimation', emoji: '📐', href: '#' },
];

export default function Profile() {
  return (
    <main
      className="min-h-screen flex flex-col items-center justify-center px-4"
      style={{ backgroundColor: theme.colors.background }}
    >
      <div
        className="shadow-xl rounded-2xl max-w-xl w-full border"
        style={{
          backgroundColor: theme.colors.card,
          padding: theme.spacing.padding,
          borderColor: theme.colors.muted,
        }}
      >
        <h2
          className="text-center mb-8"
          style={{
            fontSize: theme.font.size.lg,
            fontWeight: 'bold',
            color: theme.colors.text,
          }}
        >
          Contractor Profile
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {modules.map((mod) => (
            <a
              key={mod.name}
              href={mod.href}
              className="transition-colors duration-200 ease-in-out"
              style={{
                backgroundColor: theme.colors.primary,
                color: '#fff',
                padding: '0.75rem 1.5rem',
                borderRadius: theme.borderRadius,
                textAlign: 'center',
                fontWeight: 600,
                textDecoration: 'none',
                fontSize: theme.font.size.base,
              }}
            >
              {mod.emoji} {mod.name}
            </a>
          ))}
        </div>
      </div>
    </main>
  );
}