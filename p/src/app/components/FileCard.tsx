import { Download, Trash2, File, Image, FileText, Music, Video, MoreVertical } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { Card } from '@/app/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/app/components/ui/dropdown-menu';

export interface StoredFile {
  id: string;
  name: string;
  size: number;
  type: string;
  uploadDate: string;
  data: string;
  folderId: string | null;
}

interface FileCardProps {
  file: StoredFile;
  onDelete: (id: string) => void;
  onDownload: (file: StoredFile) => void;
  isAdmin: boolean;
}

function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

function getFileIcon(type: string) {
  if (type.startsWith('image/')) return <Image className="w-8 h-8" />;
  if (type.startsWith('video/')) return <Video className="w-8 h-8" />;
  if (type.startsWith('audio/')) return <Music className="w-8 h-8" />;
  if (type.includes('text') || type.includes('pdf')) return <FileText className="w-8 h-8" />;
  return <File className="w-8 h-8" />;
}

export function FileCard({ file, onDelete, onDownload, isAdmin }: FileCardProps) {
  const isImage = file.type.startsWith('image/');

  return (
    <Card className="overflow-hidden hover:shadow-lg transition-shadow">
      <div className="aspect-square bg-gray-100 flex items-center justify-center overflow-hidden">
        {isImage ? (
          <img
            src={file.data}
            alt={file.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="text-gray-400">
            {getFileIcon(file.type)}
          </div>
        )}
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="truncate flex-1" title={file.name}>
            {file.name}
          </h3>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="w-4 h-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onDownload(file)}>
                <Download className="w-4 h-4 mr-2" />
                Скачать
              </DropdownMenuItem>
              {isAdmin && (
                <DropdownMenuItem
                  onClick={() => onDelete(file.id)}
                  className="text-red-600"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Удалить
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <p className="text-sm text-gray-500 mt-1">
          {formatFileSize(file.size)} • {new Date(file.uploadDate).toLocaleDateString('ru-RU')}
        </p>
      </div>
    </Card>
  );
}