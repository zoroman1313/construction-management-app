// src/app/assistant/layout.tsx
import { ReactNode } from 'react';

export default function AssistantLayout({ children }: { children: ReactNode }) {
  return (
    <section className="p-6 bg-gray-50 min-h-screen">
      {children}
    </section>
  );
}