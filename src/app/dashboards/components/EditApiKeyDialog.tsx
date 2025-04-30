import { ChangeEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface EditApiKeyDialogProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  editingKey: { id: string; name: string } | null;
  onEditingKeyChange: (key: { id: string; name: string } | null) => void;
  onSaveEdit: (id: string, name: string) => Promise<boolean>;
}

export function EditApiKeyDialog({ 
  isOpen, 
  onOpenChange, 
  editingKey, 
  onEditingKeyChange, 
  onSaveEdit 
}: EditApiKeyDialogProps) {
  
  const handleSaveEdit = async () => {
    if (!editingKey) return;

    const success = await onSaveEdit(editingKey.id, editingKey.name);
    if (success) {
      handleCancel();
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
    onEditingKeyChange(null);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit API Key</DialogTitle>
        </DialogHeader>
        <div className="space-y-6 py-4">
          <div className="space-y-2">
            <Input
              value={editingKey?.name || ''}
              onChange={(e: ChangeEvent<HTMLInputElement>) => 
                onEditingKeyChange(editingKey ? { ...editingKey, name: e.target.value } : null)
              }
              placeholder="my-cool-api-key"
              className="w-full bg-gray-800 border-0 text-white placeholder:text-gray-500 focus-visible:ring-1 focus-visible:ring-gray-600"
            />
          </div>
          <div className="flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={handleCancel}
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
  );
} 