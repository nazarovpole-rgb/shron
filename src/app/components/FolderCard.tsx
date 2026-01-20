import { Folder, Trash2, MoreVertical, Edit2, Palette, Download } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

export interface FolderItem {
  id: string;
  name: string;
  parentId: string | null;
  createdDate: string;
  background?: string;
}

interface FolderCardProps {
  folder: FolderItem;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
  onRename: (id: string) => void;
  onChangeBackground: (id: string) => void;
  onDownloadFolder: (id: string) => void;
  isAdmin: boolean;
}

export function FolderCard({ folder, onOpen, onDelete, onRename, onChangeBackground, onDownloadFolder, isAdmin }: FolderCardProps) {
  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow group">
      <div
        className="aspect-square flex items-center justify-center cursor-pointer"
        style={{ background: folder.background || 'linear-gradient(to bottom right, #dbeafe, #bfdbfe)' }}
        onClick={() => onOpen(folder.id)}
      >
        <Folder className="w-16 h-16 text-blue-600" />
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3
            className="truncate flex-1 cursor-pointer"
            title={folder.name}
            onClick={() => onOpen(folder.id)}
          >
            {folder.name}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onDownloadFolder(folder.id)}>
                <Download className="w-4 h-4 mr-2" />
                Скачать папку
              </DropdownMenuItem>
              {isAdmin && (
                <>
                  <DropdownMenuItem onClick={() => onRename(folder.id)}>
                    <Edit2 className="w-4 h-4 mr-2" />
                    Переименовать
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onChangeBackground(folder.id)}>
                    <Palette className="w-4 h-4 mr-2" />
                    Изменить фон
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => onDelete(folder.id)}
                    className="text-red-600"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Удалить
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {new Date(folder.createdDate).toLocaleDateString('ru-RU')}
        </p>
      </div>
    </Card>
  );
}