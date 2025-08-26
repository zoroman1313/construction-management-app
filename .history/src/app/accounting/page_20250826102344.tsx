'use client';

import { useState } from 'react';
import TeamTab from '@/modules/accounting/src/features/accounting/TeamTab';
import ToolsTab from '@/modules/accounting/src/features/accounting/ToolsTab';
import MaterialsTab from '@/modules/accounting/src/features/accounting/MaterialsTab';
import TransactionsTab from '@/modules/accounting/src/features/accounting/TransactionsTab';

export default function AccountingPage() {
  const [activeTab, setActiveTab] = useState<'team' | 'tools' | 'materials' | 'transactions'>('team');

  const renderTab = () => {
    switch (activeTab) {
      case 'team':
        return <TeamTab />;
      case 'tools':
        return <ToolsTab />;
      case 'materials':
        return <MaterialsTab />;
      case 'transactions':
        return <TransactionsTab />;
      default:
        return null;
    }
  };

  return (
    <div className="p-4 space-y-4">
      <div className="flex gap-4">
        <button onClick={() => setActiveTab('team')}>Team</button>
        <button onClick={() => setActiveTab('tools')}>Tools</button>
        <button onClick={() => setActiveTab('materials')}>Materials</button>
        <button onClick={() => setActiveTab('transactions')}>Transactions</button>
      </div>

      <div>
        {renderTab()}
      </div>
    </div>
  );
}