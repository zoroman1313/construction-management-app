'use client';

import Link from 'next/link';

export default function ProfilePage() {
  return (
    <main className="min-h-screen flex items-center justify-center p-6">
      <div className="shadow-xl rounded-2xl border w-full max-w-lg p-8 bg-white">
        <h1 className="text-2xl font-bold text-center mb-6">
          Contractor Profile
        </h1>

        <div className="flex flex-col gap-4">
          <Link
            href="/accounting"
            className="w-full text-center py-3 rounded-md font-semibold bg-amber-600 text-white hover:bg-amber-700"
          >
            🧮 Accounting
          </Link>

          <Link
            href="/reports"
            className="w-full text-center py-3 rounded-md font-semibold bg-amber-600 text-white/90 pointer-events-none opacity-50"
          >
            📊 Reports (soon)
          </Link>

          <Link
            href="/estimation"
            className="w-full text-center py-3 rounded-md font-semibold bg-amber-600 text-white/90 pointer-events-none opacity-50"
          >
            📐 Estimation (soon)
          </Link>
        </div>
      </div>
    </main>
  );
}