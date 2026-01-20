import { useState, useEffect } from 'react';
import JSZip from 'jszip';
import { FileUpload } from '@/app/components/FileUpload';
import { FileCard, StoredFile } from '@/app/components/FileCard';
import { FolderCard, FolderItem } from '@/app/components/FolderCard';
import { Breadcrumbs } from '@/app/components/Breadcrumbs';
import { CreateFolderDialog } from '@/app/components/CreateFolderDialog';
import { BackgroundSelector } from '@/app/components/BackgroundSelector';
import { SelectFolderDialog } from '@/app/components/SelectFolderDialog';
import { UserRoleSelector, UserRole } from '@/app/components/UserRoleSelector';
import { Input } from '@/app/components/ui/input';
import { Button } from '@/app/components/ui/button';
import { Search, HardDrive, FolderPlus, Download } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/app/components/ui/sonner';

const FILES_STORAGE_KEY = 'file_storage_files';
const FOLDERS_STORAGE_KEY = 'file_storage_folders';
const USER_ROLE_KEY = 'file_storage_user_role';

export default function App() {
  const [files, setFiles] = useState<StoredFile[]>([]);
  const [folders, setFolders] = useState<FolderItem[]>([]);
  const [currentFolderId, setCurrentFolderId] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [renameDialogOpen, setRenameDialogOpen] = useState(false);
  const [renamingFolderId, setRenamingFolderId] = useState<string | null>(null);
  const [backgroundDialogOpen, setBackgroundDialogOpen] = useState(false);
  const [backgroundFolderId, setBackgroundFolderId] = useState<string | null>(null);
  const [selectFolderDialogOpen, setSelectFolderDialogOpen] = useState(false);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [userRole, setUserRole] = useState<UserRole>('admin');

  // Load data from localStorage
  useEffect(() => {
    const storedFiles = localStorage.getItem(FILES_STORAGE_KEY);
    const storedFolders = localStorage.getItem(FOLDERS_STORAGE_KEY);
    const storedRole = localStorage.getItem(USER_ROLE_KEY);

    if (storedFiles) {
      try {
        setFiles(JSON.parse(storedFiles));
      } catch (e) {
        console.error('Failed to load files:', e);
      }
    }

    if (storedFolders) {
      try {
        setFolders(JSON.parse(storedFolders));
      } catch (e) {
        console.error('Failed to load folders:', e);
      }
    }

    if (storedRole) {
      setUserRole(storedRole as UserRole);
    }
  }, []);

  // Save data to localStorage
  useEffect(() => {
    localStorage.setItem(FILES_STORAGE_KEY, JSON.stringify(files));
  }, [files]);

  useEffect(() => {
    localStorage.setItem(FOLDERS_STORAGE_KEY, JSON.stringify(folders));
  }, [folders]);

  useEffect(() => {
    localStorage.setItem(USER_ROLE_KEY, userRole);
  }, [userRole]);

  const isAdmin = userRole === 'admin';

  // Build breadcrumb path
  const getBreadcrumbPath = () => {
    const path: Array<{ id: string | null; name: string }> = [];
    let folderId = currentFolderId;

    while (folderId) {
      const folder = folders.find((f) => f.id === folderId);
      if (!folder) break;
      path.unshift({ id: folder.id, name: folder.name });
      folderId = folder.parentId;
    }

    return path;
  };

  // Get current folder contents
  const currentFolders = folders.filter((f) => f.parentId === currentFolderId);
  const currentFiles = files.filter((f) => f.folderId === currentFolderId);

  // Filter by search
  const filteredFolders = currentFolders.filter((folder) =>
    folder.name.toLowerCase().includes(searchQuery.toLowerCase())
  );
  const filteredFiles = currentFiles.filter((file) =>
    file.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileSelection = async (uploadedFiles: File[]) => {
    if (isAdmin) {
      setPendingFiles(uploadedFiles);
      setSelectFolderDialogOpen(true);
    } else {
      toast.error('У вас нет прав для загрузки файлов');
    }
  };

  const handleFolderSelected = async (folderId: string | null) => {
    const newFiles: StoredFile[] = [];

    for (const file of pendingFiles) {
      const reader = new FileReader();
      const fileData = await new Promise<string>((resolve) => {
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(file);
      });

      const storedFile: StoredFile = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: file.size,
        type: file.type,
        uploadDate: new Date().toISOString(),
        data: fileData,
        folderId: folderId,
      };

      newFiles.push(storedFile);
    }

    setFiles((prev) => [...newFiles, ...prev]);
    toast.success(`Загружено файлов: ${newFiles.length}`);
    setPendingFiles([]);
  };

  const handleCreateFolder = (name: string) => {
    const newFolder: FolderItem = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      name,
      parentId: currentFolderId,
      createdDate: new Date().toISOString(),
    };

    setFolders((prev) => [...prev, newFolder]);
    toast.success(`Папка "${name}" создана`);
  };

  const handleDeleteFolder = (id: string) => {
    const folder = folders.find((f) => f.id === id);
    if (!folder) return;

    // Check if folder has children
    const hasChildren = folders.some((f) => f.parentId === id) || files.some((f) => f.folderId === id);
    
    if (hasChildren) {
      toast.error('Невозможно удалить папку с содержимым. Сначала удалите все файлы и подпапки.');
      return;
    }

    setFolders((prev) => prev.filter((f) => f.id !== id));
    toast.success('Папка удалена');
  };

  const handleRenameFolder = (id: string) => {
    setRenamingFolderId(id);
    setRenameDialogOpen(true);
  };

  const handleRenameSubmit = (newName: string) => {
    if (!renamingFolderId) return;

    setFolders((prev) =>
      prev.map((f) => (f.id === renamingFolderId ? { ...f, name: newName } : f))
    );
    toast.success('Папка переименована');
    setRenamingFolderId(null);
  };

  const handleChangeBackground = (id: string) => {
    setBackgroundFolderId(id);
    setBackgroundDialogOpen(true);
  };

  const handleBackgroundSelect = (background: string) => {
    if (!backgroundFolderId) return;

    setFolders((prev) =>
      prev.map((f) => (f.id === backgroundFolderId ? { ...f, background } : f))
    );
    toast.success('Фон папки изменен');
    setBackgroundFolderId(null);
  };

  const handleDeleteFile = (id: string) => {
    setFiles((prev) => prev.filter((f) => f.id !== id));
    toast.success('Файл удален');
  };

  const handleDownloadFile = (file: StoredFile) => {
    const link = document.createElement('a');
    link.href = file.data;
    link.download = file.name;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleDownloadFolder = async (folderId: string) => {
    const folder = folders.find((f) => f.id === folderId);
    if (!folder) return;

    const zip = new JSZip();

    // Recursive function to add folder contents
    const addFolderToZip = (currentFolderId: string, zipFolder: JSZip) => {
      // Add files
      const folderFiles = files.filter((f) => f.folderId === currentFolderId);
      folderFiles.forEach((file) => {
        const base64Data = file.data.split(',')[1];
        zipFolder.file(file.name, base64Data, { base64: true });
      });

      // Add subfolders
      const subFolders = folders.filter((f) => f.parentId === currentFolderId);
      subFolders.forEach((subFolder) => {
        const subZipFolder = zipFolder.folder(subFolder.name);
        if (subZipFolder) {
          addFolderToZip(subFolder.id, subZipFolder);
        }
      });
    };

    addFolderToZip(folderId, zip);

    // Generate and download zip
    const blob = await zip.generateAsync({ type: 'blob' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `${folder.name}.zip`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(link.href);
    
    toast.success('Папка скачана');
  };

  const handleDownloadAllFiles = async () => {
    if (currentFiles.length === 0) {
      toast.error('В текущей папке нет файлов');
      return;
    }

    currentFiles.forEach((file) => {
      setTimeout(() => handleDownloadFile(file), 100);
    });
    
    toast.success(`Скачивание ${currentFiles.length} файлов`);
  };

  const handleNavigate = (folderId: string | null) => {
    setCurrentFolderId(folderId);
    setSearchQuery('');
  };

  const handleRoleChange = (role: UserRole) => {
    setUserRole(role);
    toast.success(`Режим изменен: ${role === 'admin' ? 'Администратор' : 'Пользователь'}`);
  };

  const renamingFolder = folders.find((f) => f.id === renamingFolderId);
  const currentFolder = folders.find((f) => f.id === currentFolderId);
  const backgroundFolder = folders.find((f) => f.id === backgroundFolderId);

  return (
    <div className="min-h-screen" style={{ background: currentFolder?.background || '#f9fafb' }}>
      <Toaster />

      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <HardDrive className="w-8 h-8 text-blue-600" />
              <h1 className="text-3xl">Файловое хранилище</h1>
            </div>
            <UserRoleSelector currentRole={userRole} onRoleChange={handleRoleChange} />
          </div>

          {/* Breadcrumbs */}
          <div className="mb-4">
            <Breadcrumbs path={getBreadcrumbPath()} onNavigate={handleNavigate} />
          </div>

          {/* Search and Actions */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Поиск файлов и папок..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            {isAdmin && (
              <Button onClick={() => setCreateDialogOpen(true)}>
                <FolderPlus className="w-4 h-4 mr-2" />
                Создать папку
              </Button>
            )}
            {currentFiles.length > 0 && (
              <Button variant="outline" onClick={handleDownloadAllFiles}>
                <Download className="w-4 h-4 mr-2" />
                Скачать все файлы
              </Button>
            )}
          </div>

          {/* Stats */}
          <div className="mt-4 text-sm text-gray-600">
            Папок: {filteredFolders.length} • Файлов: {filteredFiles.length}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {isAdmin && (
          <div className="mb-8">
            <FileUpload onUpload={handleFileSelection} />
          </div>
        )}

        {/* Folders and Files Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFolders.map((folder) => (
            <FolderCard
              key={folder.id}
              folder={folder}
              onOpen={handleNavigate}
              onDelete={handleDeleteFolder}
              onRename={handleRenameFolder}
              onChangeBackground={handleChangeBackground}
              onDownloadFolder={handleDownloadFolder}
              isAdmin={isAdmin}
            />
          ))}
          {filteredFiles.map((file) => (
            <FileCard
              key={file.id}
              file={file}
              onDelete={handleDeleteFile}
              onDownload={handleDownloadFile}
              isAdmin={isAdmin}
            />
          ))}
        </div>

        {filteredFolders.length === 0 && filteredFiles.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            <p>Папка пуста</p>
            {isAdmin && (
              <p className="text-sm mt-2">Создайте папку или загрузите файлы</p>
            )}
          </div>
        )}
      </main>

      {/* Dialogs */}
      {isAdmin && (
        <>
          <CreateFolderDialog
            open={createDialogOpen}
            onOpenChange={setCreateDialogOpen}
            onCreateFolder={handleCreateFolder}
          />

          <CreateFolderDialog
            open={renameDialogOpen}
            onOpenChange={setRenameDialogOpen}
            onCreateFolder={handleRenameSubmit}
            initialName={renamingFolder?.name || ''}
            title="Переименовать папку"
            description="Введите новое название папки"
          />

          <BackgroundSelector
            open={backgroundDialogOpen}
            onOpenChange={setBackgroundDialogOpen}
            onSelectBackground={handleBackgroundSelect}
            currentBackground={backgroundFolder?.background}
          />

          <SelectFolderDialog
            open={selectFolderDialogOpen}
            onOpenChange={setSelectFolderDialogOpen}
            folders={folders}
            onSelectFolder={handleFolderSelected}
          />
        </>
      )}
    </div>
  );
}
