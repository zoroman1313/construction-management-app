'use client';

import { Suspense, lazy } from 'react';

// تب‌ها را lazy لود می‌کنیم از ماژول
const AccountingDashboard = lazy(() =>
  import('@/modules/accounting').then(m => ({ default: m.AccountingDashboard }))
);

export default function AccountingPage() {
  return (
    <main className="min-h-screen p-6 bg-gray-50">
      <Suspense
        fallback={
          <div className="max-w-7xl mx-auto">
            <div className="animate-pulse h-10 w-48 bg-gray-200 rounded mb-4" />
            <div className="h-64 bg-white rounded-lg shadow border" />
          </div>
        }
      >
        <AccountingDashboard />
      </Suspense>
    </main>
  );
}