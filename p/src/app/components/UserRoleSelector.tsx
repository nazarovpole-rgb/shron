import { UserCircle, Shield } from 'lucide-react';
import { Button } from '@/app/components/ui/button';

export type UserRole = 'admin' | 'user';

interface UserRoleSelectorProps {
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
}

export function UserRoleSelector({ currentRole, onRoleChange }: UserRoleSelectorProps) {
  return (
    <div className="flex items-center gap-2 bg-white rounded-lg p-1 border">
      <Button
        variant={currentRole === 'admin' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onRoleChange('admin')}
        className="flex items-center gap-2"
      >
        <Shield className="w-4 h-4" />
        Администратор
      </Button>
      <Button
        variant={currentRole === 'user' ? 'default' : 'ghost'}
        size="sm"
        onClick={() => onRoleChange('user')}
        className="flex items-center gap-2"
      >
        <UserCircle className="w-4 h-4" />
        Пользователь
      </Button>
    </div>
  );
}
