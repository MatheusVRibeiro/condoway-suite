import React from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import { useAuth, UserRole } from '@/context/AuthContext';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Users,
  Package,
  UserCheck,
  Calendar,
  DollarSign,
  MessageSquare,
  Building,
  Settings,
  LogOut
} from 'lucide-react';

interface MenuItem {
  title: string;
  url: string;
  icon: React.ElementType;
  roles: UserRole[];
}

const menuItems: MenuItem[] = [
  {
    title: 'Dashboard',
    url: '/',
    icon: LayoutDashboard,
    roles: ['sindico', 'porteiro']
  },
  {
    title: 'Estrutura',
    url: '/estrutura',
    icon: Building,
    roles: ['sindico']
  },
  {
    title: 'Moradores',
    url: '/moradores',
    icon: Users,
    roles: ['sindico', 'porteiro']
  },
  {
    title: 'Financeiro',
    url: '/financeiro',
    icon: DollarSign,
    roles: ['sindico']
  },
  {
    title: 'Visitantes',
    url: '/visitantes',
    icon: UserCheck,
    roles: ['sindico', 'porteiro']
  },
  {
    title: 'Encomendas',
    url: '/encomendas',
    icon: Package,
    roles: ['sindico', 'porteiro']
  },
  {
    title: 'Reservas',
    url: '/reservas',
    icon: Calendar,
    roles: ['sindico', 'porteiro']
  },
  {
    title: 'Comunicação',
    url: '/comunicacao',
    icon: MessageSquare,
    roles: ['sindico', 'porteiro']
  }
];

export const AppSidebar: React.FC = () => {
  const { state } = useSidebar();
  const { user, logout } = useAuth();
  const location = useLocation();
  
  if (!user) return null;

  const collapsed = state === 'collapsed';
  const currentPath = location.pathname;
  const userMenuItems = menuItems.filter(item => item.roles.includes(user.tipo));

  const isActive = (path: string) => currentPath === path;
  
  const getNavClass = ({ isActive }: { isActive: boolean }) =>
    isActive 
      ? "bg-sidebar-accent text-sidebar-accent-foreground font-medium" 
      : "hover:bg-sidebar-accent/50 text-sidebar-foreground";

  return (
    <Sidebar className={collapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-sidebar border-r border-sidebar-border">
        {/* Logo Section */}
        <div className="p-4 border-b border-sidebar-border">
          {!collapsed ? (
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sidebar-primary rounded-lg">
                <Building className="w-6 h-6 text-sidebar-primary-foreground" />
              </div>
              <div>
                <h2 className="font-bold text-sidebar-foreground">CondoWay</h2>
                <p className="text-xs text-sidebar-foreground/70 capitalize">
                  {user.tipo}
                </p>
              </div>
            </div>
          ) : (
            <div className="flex justify-center">
              <div className="p-2 bg-sidebar-primary rounded-lg">
                <Building className="w-6 h-6 text-sidebar-primary-foreground" />
              </div>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <SidebarGroup className="flex-1">
          <SidebarGroupLabel className={collapsed ? "sr-only" : ""}>
            Navegação Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-1">
              {userMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <NavLink 
                      to={item.url} 
                      end={item.url === '/'} 
                      className={getNavClass}
                    >
                      <item.icon className="w-5 h-5 flex-shrink-0" />
                      {!collapsed && (
                        <span className="ml-3">{item.title}</span>
                      )}
                    </NavLink>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* User Profile & Logout */}
        <div className="p-4 border-t border-sidebar-border">
          {!collapsed ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3 p-2 bg-sidebar-accent/50 rounded-lg">
                <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
                  <span className="text-sidebar-primary-foreground text-sm font-medium">
                    {user.nome.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-sidebar-foreground truncate">
                    {user.nome}
                  </p>
                  <p className="text-xs text-sidebar-foreground/70 truncate">
                    {user.email}
                  </p>
                </div>
              </div>
              <button
                onClick={logout}
                className="w-full flex items-center gap-3 p-2 text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span className="text-sm">Sair</span>
              </button>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2">
              <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
                <span className="text-sidebar-primary-foreground text-sm font-medium">
                  {user.nome.charAt(0).toUpperCase()}
                </span>
              </div>
              <button
                onClick={logout}
                className="p-2 text-sidebar-foreground hover:bg-destructive/10 hover:text-destructive rounded-lg transition-colors"
                title="Sair"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </SidebarContent>
    </Sidebar>
  );
};