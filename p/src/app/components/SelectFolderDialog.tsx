import { useState } from 'react';
import { Button } from '@/app/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/app/components/ui/dialog';
import { Folder, ChevronRight } from 'lucide-react';
import { FolderItem } from './FolderCard';

interface SelectFolderDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  folders: FolderItem[];
  onSelectFolder: (folderId: string | null) => void;
}

export function SelectFolderDialog({
  open,
  onOpenChange,
  folders,
  onSelectFolder,
}: SelectFolderDialogProps) {
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);

  const getFolderPath = (folderId: string | null): string => {
    if (!folderId) return 'Главная папка';
    
    const path: string[] = [];
    let currentId = folderId;
    
    while (currentId) {
      const folder = folders.find((f) => f.id === currentId);
      if (!folder) break;
      path.unshift(folder.name);
      currentId = folder.parentId;
    }
    
    return path.length > 0 ? path.join(' / ') : 'Главная папка';
  };

  const renderFolderTree = (parentId: string | null, level = 0) => {
    const childFolders = folders.filter((f) => f.parentId === parentId);
    
    return (
      <>
        {level === 0 && (
          <button
            onClick={() => setSelectedFolderId(null)}
            className={`w-full text-left px-4 py-2 rounded hover:bg-gray-100 flex items-center gap-2 ${
              selectedFolderId === null ? 'bg-blue-100' : ''
            }`}
          >
            <Folder className="w-4 h-4" />
            Главная папка
          </button>
        )}
        {childFolders.map((folder) => (
          <div key={folder.id}>
            <button
              onClick={() => setSelectedFolderId(folder.id)}
              className={`w-full text-left px-4 py-2 rounded hover:bg-gray-100 flex items-center gap-2 ${
                selectedFolderId === folder.id ? 'bg-blue-100' : ''
              }`}
              style={{ paddingLeft: `${(level + 1) * 24}px` }}
            >
              <ChevronRight className="w-4 h-4" />
              <Folder className="w-4 h-4" />
              {folder.name}
            </button>
            {renderFolderTree(folder.id, level + 1)}
          </div>
        ))}
      </>
    );
  };

  const handleConfirm = () => {
    onSelectFolder(selectedFolderId);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Выбрать папку</DialogTitle>
          <DialogDescription>
            Выберите папку для загрузки файлов
          </DialogDescription>
        </DialogHeader>
        
        <div className="border rounded-lg p-2 max-h-64 overflow-y-auto">
          {renderFolderTree(null)}
        </div>
        
        {selectedFolderId !== null && (
          <div className="text-sm text-gray-600">
            Выбрано: {getFolderPath(selectedFolderId)}
          </div>
        )}

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={handleConfirm}>
            Выбрать
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
