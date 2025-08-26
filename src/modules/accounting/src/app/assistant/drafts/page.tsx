'use client';

import * as Tabs from '@radix-ui/react-tabs';
import { useState } from 'react';
import TeamTab from '../../features/accounting/TeamTab';
import ContractsTab from '../../features/accounting/ContractsTab';
import ToolsTab from '../../features/accounting/ToolsTab';
import BanksTab from '../../features/accounting/BanksTab';

export default function AssistantPage() {
  return (
    <main>
      <h1 className="text-2xl font-bold mb-6 text-center text-orange-600">Project Assistant</h1>
      <Tabs.Root defaultValue="team" className="space-y-4">
        <Tabs.List className="flex gap-4 border-b pb-2 justify-center">
          <Tabs.Trigger value="team">Team</Tabs.Trigger>
          <Tabs.Trigger value="contracts">Contracts</Tabs.Trigger>
          <Tabs.Trigger value="tools">Tools</Tabs.Trigger>
          <Tabs.Trigger value="banks">Banks</Tabs.Trigger>
        </Tabs.List>

        <Tabs.Content value="team">
          <TeamTab />
        </Tabs.Content>
        <Tabs.Content value="contracts">
          <ContractsTab />
        </Tabs.Content>
        <Tabs.Content value="tools">
          <ToolsTab />
        </Tabs.Content>
        <Tabs.Content value="banks">
          <BanksTab />
        </Tabs.Content>
      </Tabs.Root>
    </main>
  );
}