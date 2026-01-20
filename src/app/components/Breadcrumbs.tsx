import { ChevronRight, Home } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

interface BreadcrumbItem {
  id: string | null;
  name: string;
}

interface BreadcrumbsProps {
  path: BreadcrumbItem[];
  onNavigate: (id: string | null) => void;
}

export function Breadcrumbs({ path, onNavigate }: BreadcrumbsProps) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <Button
        variant="ghost"
        size="sm"
        onClick={() => onNavigate(null)}
        className="h-8"
      >
        <Home className="w-4 h-4 mr-1" />
        Главная
      </Button>
      
      {path.map((item, index) => (
        <div key={item.id || 'root'} className="flex items-center gap-2">
          <ChevronRight className="w-4 h-4 text-gray-400" />
          <Button
            variant={index === path.length - 1 ? 'secondary' : 'ghost'}
            size="sm"
            onClick={() => onNavigate(item.id)}
            className="h-8"
          >
            {item.name}
          </Button>
        </div>
      ))}
    </div>
  );
}
