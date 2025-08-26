'use client';

import { useState } from 'react';
import TeamTab from '../features/accounting/TeamTab';
import MaterialsTab from '../features/accounting/MaterialsTab';
import ToolsTab from '../features/accounting/ToolsTab';
import TransactionsTab from '../features/accounting/TransactionsTab';
import ProjectsTab from '../features/accounting/ProjectsTab';
import BanksTab from '../features/accounting/BanksTab';
import ContractsTab from '../features/accounting/ContractsTab';
import InvoicesTab from '../features/accounting/InvoicesTab';
import FundsTab from '../features/accounting/FundsTab';

const tabs = [
  { key: 'Transactions', label: 'Transactions' },
  { key: 'Projects', label: 'Projects' },
  { key: 'Team', label: 'Team' },
  { key: 'Materials', label: 'Materials' },
  { key: 'Tools', label: 'Tools' },
  { key: 'Banks', label: 'Banks' },
  { key: 'Contracts', label: 'Contracts' },
  { key: 'Invoices', label: 'Invoices' },
  { key: 'Funds', label: 'Funds' },
];

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState('Transactions');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'Transactions':
        return <TransactionsTab />;
      case 'Projects':
        return <ProjectsTab />;
      case 'Team':
        return <TeamTab />;
      case 'Materials':
        return <MaterialsTab />;
      case 'Tools':
        return <ToolsTab />;
      case 'Banks':
        return <BanksTab />;
      case 'Contracts':
        return <ContractsTab />;
      case 'Invoices':
        return <InvoicesTab />;
      case 'Funds':
        return <FundsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-3xl font-bold text-center">Accounting Dashboard</h1>

      <div className="flex flex-wrap gap-2 justify-center">
        {tabs.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveTab(key)}
            className={`px-4 py-2 rounded font-medium transition-all duration-150 ${
              activeTab === key
                ? 'bg-blue-600 text-white shadow'
                : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
            }`}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="border border-gray-200 rounded-md p-4 shadow-sm bg-white">
        {renderTabContent()}
      </div>
    </div>
  );
}