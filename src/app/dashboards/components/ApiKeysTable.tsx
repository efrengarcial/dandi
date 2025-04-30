import { useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ApiKey, NotificationState } from '../hooks/useApiKeys';
import { 
  EyeIcon, 
  CopyIcon, 
  EditIcon, 
  TrashIcon, 
  CheckIcon 
} from './icons';

interface ApiKeysTableProps {
  apiKeys: ApiKey[];
  onEditKey: (apiKey: ApiKey) => void;
  onDeleteKey: (id: string) => Promise<boolean>;
  showNotification: (message: string, type: NotificationState['type']) => void;
}

export function ApiKeysTable({ apiKeys, onEditKey, onDeleteKey, showNotification }: ApiKeysTableProps) {
  const [visibleKeys, setVisibleKeys] = useState<Record<string, boolean>>({});
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

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
      
      // Show notification
      showNotification('Copied API Key to clipboard', 'success');
      
      // Reset the copied state after 2 seconds
      setTimeout(() => {
        setCopiedKeyId(null);
      }, 2000);
    }).catch(err => {
      console.error('Failed to copy: ', err);
      showNotification('Failed to copy to clipboard', 'error');
    });
  };

  return (
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
                  onClick={() => onEditKey(apiKey)}
                >
                  <EditIcon className="w-4 h-4" />
                </button>
                <button 
                  className="p-2 hover:bg-gray-800 rounded-md text-red-400 hover:text-red-300"
                  onClick={() => onDeleteKey(apiKey.id)}
                >
                  <TrashIcon className="w-4 h-4" />
                </button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
} 