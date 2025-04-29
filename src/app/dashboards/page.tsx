'use client';

import { useState, useEffect, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { supabase } from '@/lib/supabase';
import type { DbApiKey } from '@/lib/supabase';
import { v4 as uuidv4 } from 'uuid';
import { Notification } from '@/components/ui/notification';
import { DashboardLayout } from '@/components/layout/dashboard-layout';

interface ApiKey extends Omit<DbApiKey, 'created_at'> {
  createdAt: string;
}

export default function DashboardPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState('1000');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editingKey, setEditingKey] = useState<{ id: string; name: string } | null>(null);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);
  const [notificationState, setNotificationState] = useState({
    show: false,
    message: '',
    type: 'success' as 'success' | 'error' | 'info' | 'warning'
  });

  useEffect(() => {
    fetchApiKeys();
  }, []);

  const fetchApiKeys = async () => {
    try {
      const { data, error } = await supabase
        .from('api_keys')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      setApiKeys(
        data.map(key => ({
          ...key,
          createdAt: key.created_at,
        }))
      );
    } catch (error) {
      console.error('Error fetching API keys:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateKey = async () => {
    try {
      const newKey: Omit<DbApiKey, 'id'> = {
        name: newKeyName,
        key: `dandi-${uuidv4()}`,
        created_at: new Date().toISOString(),
        usage: 0,
      };

      const { data, error } = await supabase
        .from('api_keys')
        .insert([newKey])
        .select()
        .single();

      if (error) throw error;

      setApiKeys(keys => [{
        ...data,
        createdAt: data.created_at,
      }, ...keys]);

      setNewKeyName('');
      setMonthlyLimit('1000');
      setIsCreateDialogOpen(false);
      
      // Show success notification
      setNotificationState({
        show: true,
        message: 'API Key created successfully',
        type: 'success'
      });
    } catch (error) {
      console.error('Error creating API key:', error);
      
      // Show error notification
      setNotificationState({
        show: true,
        message: 'Failed to create API Key',
        type: 'error'
      });
    }
  };

  const handleEditKey = (apiKey: ApiKey) => {
    setEditingKey({ id: apiKey.id, name: apiKey.name });
    setIsEditDialogOpen(true);
  };

  const handleSaveEdit = async () => {
    if (!editingKey) return;

    try {
      const { error } = await supabase
        .from('api_keys')
        .update({ name: editingKey.name })
        .eq('id', editingKey.id);

      if (error) throw error;

      setApiKeys(keys => keys.map(key => 
        key.id === editingKey.id 
          ? { ...key, name: editingKey.name }
          : key
      ));
      setIsEditDialogOpen(false);
      setEditingKey(null);
    } catch (error) {
      console.error('Error updating API key:', error);
    }
  };

  const handleDeleteKey = async (id: string) => {
    try {
      const { error } = await supabase
        .from('api_keys')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setApiKeys(keys => keys.filter(key => key.id !== id));
      
      // Show deletion notification with red styling
      setNotificationState({
        show: true,
        message: 'API Key deleted successfully',
        type: 'error' // Using error type for red styling
      });
    } catch (error) {
      console.error('Error deleting API key:', error);
      
      // Show error notification
      setNotificationState({
        show: true,
        message: 'Failed to delete API Key',
        type: 'error'
      });
    }
  };

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const maskApiKey = (key: string) => {
    const prefix = 'dandi-';
    const rest = key.slice(prefix.length);
    return prefix + '*'.repeat(rest.length);
  };

  const handleCopyKey = (key: string, id: string) => {
    navigator.clipboard.writeText(key).then(() => {
      setCopiedKeyId(id);
      setNotificationState({
        show: true,
        message: 'Copied API Key to clipboard',
        type: 'success'
      });
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedKeyId(null);
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      setNotificationState({
        show: true,
        message: 'Failed to copy to clipboard',
        type: 'error'
      });
    });
  };

  const closeNotification = () => {
    setNotificationState(prev => ({ ...prev, show: false }));
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

        <div className="mb-8">
          <div className="rounded-lg bg-gradient-to-br from-purple-600 via-purple-500 to-amber-300 p-8 text-white">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-sm mb-2 uppercase">CURRENT PLAN</div>
                <h1 className="text-3xl font-bold mb-6">Researcher</h1>
                <div className="space-y-2">
                  <div className="flex items-center gap-1 text-sm">
                    API Limit
                  </div>
                  <div className="bg-white/20 rounded-full h-2 w-full">
                    <div className="bg-white rounded-full h-full" style={{ width: '2.4%' }} />
                  </div>
                  <div className="text-sm">24/1,000 Requests</div>
                </div>
              </div>
              <Button 
                variant="outline" 
                className="bg-transparent text-white border-white hover:bg-white/10 transition-colors"
              >
                Manage Plan
              </Button>
            </div>
          </div>
        </div>

        <div className="bg-transparent rounded-lg border border-gray-800 p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-semibold text-white">API Keys</h2>
            <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700 text-white">+ Create New API Key</Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Create a new API key</DialogTitle>
                </DialogHeader>
                <div className="space-y-6 py-4">
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">
                      Key Name — A unique name to identify this key
                    </label>
                    <Input
                      id="keyName"
                      value={newKeyName}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setNewKeyName(e.target.value)}
                      placeholder="Key Name"
                      className="w-full bg-gray-800 border-0 text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-gray-600"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm text-gray-400">
                      Limit monthly usage*
                    </label>
                    <Input
                      type="number"
                      value={monthlyLimit}
                      onChange={(e: ChangeEvent<HTMLInputElement>) => setMonthlyLimit(e.target.value)}
                      placeholder="1000"
                      className="w-full bg-gray-800 border-0 text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-gray-600"
                    />
                    <p className="text-xs text-gray-500">
                      *If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
                    </p>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      variant="outline"
                      onClick={() => setIsCreateDialogOpen(false)}
                      className="bg-transparent hover:bg-gray-800 border-gray-700 text-gray-300"
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreateKey}
                      className="bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      Create
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          <div className="text-sm text-gray-400 mb-4">
            The key is used to authenticate your requests to the Research API. To learn more, see the <span className="text-blue-400 underline">documentation</span> page.
          </div>

          <Table>
            <TableHeader>
              <TableRow className="border-gray-800">
                <TableHead className="text-gray-400 font-medium">NAME</TableHead>
                <TableHead className="text-gray-400 font-medium">USAGE</TableHead>
                <TableHead className="text-gray-400 font-medium">KEY</TableHead>
                <TableHead className="text-gray-400 font-medium">OPTIONS</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {apiKeys.map((apiKey) => (
                <TableRow key={apiKey.id} className="border-t border-gray-800">
                  <TableCell className="font-medium text-white">{apiKey.name}</TableCell>
                  <TableCell className="text-gray-400">{apiKey.usage}</TableCell>
                  <TableCell>
                    <code className="bg-gray-800 px-2 py-1 rounded text-gray-300">
                      {visibleKeys[apiKey.id] ? apiKey.key : maskApiKey(apiKey.key)}
                    </code>
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-2">
                      <button 
                        className={`p-2 hover:bg-gray-800 rounded-md ${visibleKeys[apiKey.id] ? 'text-blue-400' : 'text-gray-400 hover:text-gray-300'}`}
                        onClick={() => toggleKeyVisibility(apiKey.id)}
                      >
                        <EyeIcon className="w-4 h-4" />
                      </button>
                      <button 
                        className={`p-2 hover:bg-gray-800 rounded-md ${copiedKeyId === apiKey.id ? 'text-green-400' : 'text-gray-400 hover:text-gray-300'}`}
                        onClick={() => handleCopyKey(apiKey.key, apiKey.id)}
                      >
                        {copiedKeyId === apiKey.id ? (
                          <CheckIcon className="w-4 h-4" />
                        ) : (
                          <CopyIcon className="w-4 h-4" />
                        )}
                      </button>
                      <button 
                        className="p-2 hover:bg-gray-800 rounded-md text-gray-400 hover:text-gray-300"
                        onClick={() => handleEditKey(apiKey)}
                      >
                        <EditIcon className="w-4 h-4" />
                      </button>
                      <button 
                        className="p-2 hover:bg-gray-800 rounded-md text-red-400 hover:text-red-300"
                        onClick={() => handleDeleteKey(apiKey.id)}
                      >
                        <TrashIcon className="w-4 h-4" />
                      </button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Edit Dialog */}
        <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Edit API Key</DialogTitle>
            </DialogHeader>
            <div className="space-y-6 py-4">
              <div className="space-y-2">
                <Input
                  value={editingKey?.name || ''}
                  onChange={(e: ChangeEvent<HTMLInputElement>) => 
                    setEditingKey(prev => prev ? { ...prev, name: e.target.value } : null)
                  }
                  placeholder="my-cool-api-key"
                  className="w-full bg-gray-800 border-0 text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-gray-600"
                />
              </div>
              <div className="flex justify-end gap-3">
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditDialogOpen(false);
                    setEditingKey(null);
                  }}
                  className="bg-transparent hover:bg-gray-800 border-gray-700 text-gray-300"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleSaveEdit}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Save
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </DashboardLayout>
  );
}

function EyeIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
  );
}

function CopyIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>
  );
}

function EditIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
  );
}

function TrashIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
  );
}

function CheckIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polyline points="20 6 9 17 4 12"/></svg>
  );
}

function CloseIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
  );
} 