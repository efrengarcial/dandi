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

interface ApiKey {
  id: string;
  name: string;
  key: string;
  createdAt: string;
  usage?: number;
}

export default function DashboardPage() {
  const [apiKeys, setApiKeys] = useState<ApiKey[]>([]);
  const [newKeyName, setNewKeyName] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState('1000');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});

  // Mock data - Replace with actual API calls
  useEffect(() => {
    setApiKeys([
      {
        id: '1',
        name: 'default',
        key: 'tvly-************sssss******************',
        createdAt: new Date().toISOString(),
        usage: 24,
      },
      {
        id: '2',
        name: 'tmp1',
        key: 'tvly-********sss********************',
        createdAt: new Date().toISOString(),
        usage: 0,
      },
      {
        id: '3',
        name: 'tmp2',
        key: 'tvly-********************************',
        createdAt: new Date().toISOString(),
        usage: 0,
      },
    ]);
  }, []);

  const handleCreateKey = async () => {
    // TODO: Implement actual API call
    const newKey: ApiKey = {
      id: Math.random().toString(),
      name: newKeyName,
      key: `tvly-********************************`,
      createdAt: new Date().toISOString(),
      usage: 0,
    };
    setApiKeys([...apiKeys, newKey]);
    setNewKeyName('');
    setMonthlyLimit('1000');
    setIsCreateDialogOpen(false);
  };

  const handleDeleteKey = async (id: string) => {
    // TODO: Implement actual API call
    setApiKeys(apiKeys.filter((key) => key.id !== id));
  };

  const toggleKeyVisibility = (id: string) => {
    setVisibleKeys(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const maskApiKey = (key: string) => {
    const prefix = 'tvly-';
    const rest = key.slice(prefix.length);
    return prefix + '*'.repeat(rest.length);
  };

  return (
    <div className="container mx-auto p-8">
      <div className="mb-8">
        <div className="rounded-lg bg-gradient-to-br from-purple-600 via-purple-400 to-amber-300 p-8 text-white">
          <div className="flex justify-between items-center">
            <div>
              <div className="text-sm mb-2">CURRENT PLAN</div>
              <h1 className="text-3xl font-bold mb-6">Researcher</h1>
              <div className="space-y-2">
                <div className="text-sm">API Limit</div>
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

      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-900">API Keys</h2>
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">+ Create New API Key</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px] bg-white">
              <DialogHeader>
                <DialogTitle className="text-xl font-semibold text-gray-900">Create a new API key</DialogTitle>
              </DialogHeader>
              <div className="space-y-6 py-4">
                <div className="space-y-2">
                  <label className="text-sm text-gray-500">
                    Key Name — A unique name to identify this key
                  </label>
                  <Input
                    id="keyName"
                    value={newKeyName}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setNewKeyName(e.target.value)}
                    placeholder="Key Name"
                    className="w-full bg-gray-900/5 border-0 text-gray-900 placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-gray-300"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm text-gray-500">
                    Limit monthly usage*
                  </label>
                  <Input
                    type="number"
                    value={monthlyLimit}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => setMonthlyLimit(e.target.value)}
                    placeholder="1000"
                    className="w-full bg-gray-900/5 border-0 text-gray-900 placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-gray-300"
                  />
                  <p className="text-xs text-gray-400">
                    *If the combined usage of all your keys exceeds your plan's limit, all requests will be rejected.
                  </p>
                </div>
                <div className="flex justify-end gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsCreateDialogOpen(false)}
                    className="bg-transparent hover:bg-gray-50 border-gray-200 text-gray-600"
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

        <div className="text-sm text-gray-500 mb-4">
          The key is used to authenticate your requests to the Research API. To learn more, see the <span className="text-gray-900">documentation</span> page.
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-gray-500 font-medium">NAME</TableHead>
              <TableHead className="text-gray-500 font-medium">USAGE</TableHead>
              <TableHead className="text-gray-500 font-medium">KEY</TableHead>
              <TableHead className="text-gray-500 font-medium">OPTIONS</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {apiKeys.map((apiKey) => (
              <TableRow key={apiKey.id} className="border-t border-gray-100">
                <TableCell className="font-medium text-gray-900">{apiKey.name}</TableCell>
                <TableCell className="text-gray-500">{apiKey.usage}</TableCell>
                <TableCell>
                  <code className="bg-gray-50 px-2 py-1 rounded text-gray-500">
                    {visibleKeys[apiKey.id] ? apiKey.key : maskApiKey(apiKey.key)}
                  </code>
                </TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <button 
                      className={`p-2 hover:bg-gray-50 rounded-md ${visibleKeys[apiKey.id] ? 'text-blue-600' : 'text-gray-400 hover:text-gray-500'}`}
                      onClick={() => toggleKeyVisibility(apiKey.id)}
                    >
                      <EyeIcon className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-50 rounded-md text-gray-400 hover:text-gray-500">
                      <CopyIcon className="w-4 h-4" />
                    </button>
                    <button className="p-2 hover:bg-gray-50 rounded-md text-gray-400 hover:text-gray-500">
                      <EditIcon className="w-4 h-4" />
                    </button>
                    <button 
                      className="p-2 hover:bg-gray-50 rounded-md text-red-400 hover:text-red-500"
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
    </div>
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