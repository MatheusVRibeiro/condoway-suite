import React from 'react';
import { useAuth } from '@/context/AuthContext';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Settings } from 'lucide-react';

export const Header: React.FC = () => {
  const { user } = useAuth();

  if (!user) return null;

  const getRoleBadgeVariant = (tipo: string) => {
    return tipo === 'sindico' ? 'default' : 'secondary';
  };

  const getRoleDisplayName = (tipo: string) => {
    return tipo === 'sindico' ? 'Síndico' : 'Porteiro';
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-sidebar-border bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/60">
      <div className="flex h-16 items-center justify-between px-4">
        <div className="flex items-center gap-4">
          <SidebarTrigger className="hover:bg-sidebar-accent hover:text-sidebar-accent-foreground" />
          
          <div className="flex items-center gap-3">
            <div className="hidden sm:block">
              <h1 className="text-lg font-semibold text-foreground">
                Painel Administrativo
              </h1>
            </div>
            <Badge variant={getRoleBadgeVariant(user.tipo)} className="hidden sm:inline-flex">
              {getRoleDisplayName(user.tipo)}
            </Badge>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 w-3 h-3 bg-destructive rounded-full text-xs flex items-center justify-center text-destructive-foreground">
              3
            </span>
            <span className="sr-only">Notificações</span>
          </Button>
          
          <Button variant="ghost" size="icon">
            <Settings className="w-4 h-4" />
            <span className="sr-only">Configurações</span>
          </Button>
        </div>
      </div>
    </header>
  );
};