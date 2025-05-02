import { useState, ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface CreateApiKeyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateKey: (name: string, monthlyLimit: string) => Promise<boolean>;
}

export function CreateApiKeyDialog({ isOpen, onOpenChange, onCreateKey }: CreateApiKeyDialogProps) {
  const [newKeyName, setNewKeyName] = useState('');
  const [monthlyLimit, setMonthlyLimit] = useState('1000');

  const handleCreateKey = async () => {
    const success = await onCreateKey(newKeyName, monthlyLimit);
    if (success) {
      resetAndClose();
    }
  };

  const resetAndClose = () => {
    setNewKeyName('');
    setMonthlyLimit('1000');
    onOpenChange(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
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
              *If the combined usage of all your keys exceeds your plan&apos;s limit, all requests will be rejected.
            </p>
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={resetAndClose}
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
  );
}

export function CreateApiKeyButton({ onClick }: { onClick: () => void }) {
  return (
    <Button 
      onClick={onClick}
      className="bg-blue-600 hover:bg-blue-700 text-white"
    >
      + Create New API Key
    </Button>
  );
} 