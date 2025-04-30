'use client';

import { useState } from 'react';
import { DashboardLayout } from '@/app/dashboards/dashboard-layout';
import { Notification } from '@/components/ui/notification';
import { CheckIcon } from './components/icons';
import { useApiKeys } from './hooks/useApiKeys';
import { ApiKeysTable } from './components/ApiKeysTable';
import { CreateApiKeyDialog, CreateApiKeyButton } from './components/CreateApiKeyDialog';
import { EditApiKeyDialog } from './components/EditApiKeyDialog';
import { PlanOverview } from './components/PlanOverview';

export default function DashboardPage() {
  // API key related state and logic
  const { 
    apiKeys, 
    isLoading, 
    notificationState, 
    createApiKey, 
    updateApiKey, 
    deleteApiKey,
    closeNotification,
    showNotification 
  } = useApiKeys();

  // UI state
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<{ id: string; name: string } | null>(null);

  // Handlers
  const handleEditKey = (apiKey: any) => {
    setEditingKey({ id: apiKey.id, name: apiKey.name });
    setIsEditDialogOpen(true);
  };

  return (
    <DashboardLayout>
      <div className="p-8 bg-black text-white min-h-screen">
        {/* Notification Toast */}
        <Notification
          show={notificationState.show}
          onClose={closeNotification}
          message={notificationState.message}
          type={notificationState.type}
          icon={notificationState.type === 'success' ? <CheckIcon className="w-5 h-5 text-green-600" /> : undefined}
        />

        {/* Header Section with breadcrumbs */}
        <div className="mb-6">
          <div className="flex items-center text-sm text-gray-400 mb-2">
            <span>Pages</span>
            <span className="mx-2">/</span>
            <span>Overview</span>
          </div>
          <h1 className="text-3xl font-bold text-white">Overview</h1>
        </div>

        {/* Plan Overview Section */}
        <PlanOverview 
          planName="Researcher"
          usedRequests={24}
          totalRequests={1000}
        />

        <div className="bg-transparent rounded-lg border border-gray-800 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">API Keys</h2>
            <CreateApiKeyButton onClick={() => setIsCreateDialogOpen(true)} />
          </div>

          <div className="text-sm text-gray-400 mb-4">
            The key is used to authenticate your requests to the Research API. To learn more, see the <span className="text-blue-400 underline">documentation</span> page.
          </div>

          {/* API Keys Table */}
          <ApiKeysTable 
            apiKeys={apiKeys}
            onEditKey={handleEditKey}
            onDeleteKey={deleteApiKey}
            showNotification={showNotification}
          />
        </div>

        {/* Create Dialog */}
        <CreateApiKeyDialog 
          isOpen={isCreateDialogOpen}
          onOpenChange={setIsCreateDialogOpen}
          onCreateKey={createApiKey}
        />

        {/* Edit Dialog */}
        <EditApiKeyDialog
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
          editingKey={editingKey}
          onEditingKeyChange={setEditingKey}
          onSaveEdit={updateApiKey}
        />
      </div>
    </DashboardLayout>
  );
} 