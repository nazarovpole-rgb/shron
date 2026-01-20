import { Upload } from 'lucide-react';
import { useCallback } from 'react';

interface FileUploadProps {
  onUpload: (files: File[]) => void;
}

export function FileUpload({ onUpload }: FileUploadProps) {
  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();

      const files = Array.from(e.dataTransfer.files);
      if (files.length > 0) {
        onUpload(files);
      }
    },
    [onUpload]
  );

  const handleFileInput = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const files = e.target.files;
      if (files && files.length > 0) {
        onUpload(Array.from(files));
      }
    },
    [onUpload]
  );

  return (
    <div
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-500 transition-colors cursor-pointer"
    >
      <label className="cursor-pointer flex flex-col items-center gap-3">
        <Upload className="w-10 h-10 text-gray-400" />
        <div>
          <p className="mb-1">
            Перетащите файлы сюда или нажмите для выбора
          </p>
          <p className="text-sm text-gray-500">
            Поддерживаются любые типы файлов
          </p>
        </div>
        <input
          type="file"
          multiple
          onChange={handleFileInput}
          className="hidden"
        />
      </label>
    </div>
  );
}
