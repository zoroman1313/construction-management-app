"use client";

import theme from '@/theme';

export default function Home() {
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
          borderColor: theme.colors.border 
        }}
      >
        <h1
          className="text-center mb-6"
          style={{ 
            fontSize: theme.font.size.xl, 
            color: theme.colors.text, 
            fontWeight: 'bold' 
          }}
        >
          Contractor Assistant
        </h1>
        <p
          className="text-center mb-8"
          style={{ color: theme.colors.muted }}
        >
          Your digital helper for construction management.
        </p>
        <div className="flex flex-col gap-4">
          <a
            href="/profile"
            className="transition-colors duration-200 ease-in-out"
            style={{
              backgroundColor: theme.colors.primary,
              color: '#fff',
              padding: '0.75rem 1.5rem',
              borderRadius: theme.borderRadius,
              textAlign: 'center',
              fontWeight: 600,
              display: 'inline-block',
              textDecoration: 'none',
            }}
            onMouseOver={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = theme.colors.primaryDark;
            }}
            onMouseOut={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.backgroundColor = theme.colors.primary;
            }}
          >
            Go to Profile
          </a>
        </div>
      </div>
    </main>
  );
}