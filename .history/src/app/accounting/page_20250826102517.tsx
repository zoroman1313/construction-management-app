'use client';

import { Suspense, lazy } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import TabNavigation from '@/modules/accounting/components/TabNavigation';
import LoadingSpinner from '@/modules/accounting/components/LoadingSpinner';
import ErrorBoundary from '@/modules/accounting/components/ErrorBoundary';

// Lazy-load tabs from the barrel file for better bundle splitting
const TeamTab = lazy(() =>
  import('@/modules/accounting').then((m) => ({ default: m.TeamTab })),
);
const ToolsTab = lazy(() =>
  import('@/modules/accounting').then((m) => ({ default: m.ToolsTab })),
);
const MaterialsTab = lazy(() =>
  import('@/modules/accounting').then((m) => ({ default: m.MaterialsTab })),
);
const TransactionsTab = lazy(() =>
  import('@/modules/accounting').then((m) => ({ default: m.TransactionsTab })),
);

// You can add more tabs later (Banks, Contracts, Invoices, Funds, Projects, ...)

const tabs = [
  { id: 'transactions', label: 'Transactions', icon: '💳', component: TransactionsTab },
  { id: 'team', label: 'Team', icon: '👥', component: TeamTab },
  { id: 'materials', label: 'Materials', icon: '📦', component: MaterialsTab },
  { id: 'tools', label: 'Tools', icon: '🧰', component: ToolsTab },
] as const;

type TabId = (typeof tabs)[number]['id'];

export default function AccountingPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const activeTab = (searchParams.get('tab') as TabId) || 'transactions';

  const handleTabChange = (tabId: TabId) => {
    router.push(`/accounting?tab=${tabId}`);
  };

  const Active = tabs.find((t) => t.id === activeTab)?.component ?? TransactionsTab;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
        <h1 className="text-2xl font-bold text-center">Accounting Dashboard</h1>

        <TabNavigation tabs={tabs} activeTab={activeTab} onChange={handleTabChange} />

        <div className="bg-white rounded-lg shadow-sm border p-4">
          <ErrorBoundary fallback={<div className="p-4 text-red-600">Something went wrong in this tab.</div>}>
            <Suspense fallback={<LoadingSpinner />}>
              <Active />
            </Suspense>
          </ErrorBoundary>
        </div>
      </div>
    </div>
  );
}