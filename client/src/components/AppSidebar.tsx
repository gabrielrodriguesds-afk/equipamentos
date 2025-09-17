import { 
  Building2, 
  Home, 
  List, 
  LogOut, 
  Monitor,
  Plus, 
  Search,
  Settings,
  Users,
  Zap
} from "lucide-react";
import prLogo from "@assets/Logo_P&R_Reduzido_Cores_1757550343131.png";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface AppSidebarProps {
  user?: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    profileImageUrl: string | null;
    role: string;
  };
}

export default function AppSidebar({ user }: AppSidebarProps) {
  const isAdmin = user?.role === 'admin';
  const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'Usuário';
  const initials = userName.split(' ').map(n => n[0]).join('').toUpperCase() || 'U';

  const menuItems = [
    {
      title: "Início",
      icon: Home,
      url: "/",
    },
    {
      title: "Buscar",
      icon: Search,
      url: "/search",
    },
    {
      title: "Listar Equipamentos",
      icon: List,
      url: "/equipamentos",
    },
  ];

  const createItems = [
    {
      title: "Novo Equipamento",
      icon: Plus,
      url: "/equipamentos/novo",
    },
    ...(isAdmin ? [
      {
        title: "Novo Cliente",
        icon: Building2,
        url: "/clientes/novo",
      },
      {
        title: "Novo Usuário",
        icon: Users,
        url: "/users/new",
      },
    ] : []),
  ];

  const equipmentTypes = [
    {
      title: "Computadores",
      icon: Monitor,
      url: "/equipamentos?type=computer",
    },
    {
      title: "Nobreaks",
      icon: Zap,
      url: "/equipamentos?type=ups",
    },
  ];

  const adminItems = isAdmin ? [
    {
      title: "Gerenciar Clientes",
      icon: Building2,
      url: "/clientes",
    },
    {
      title: "Gerenciar Usuários",
      icon: Users,
      url: "/users",
    },
    {
      title: "Configurações",
      icon: Settings,
      url: "/settings",
    },
  ] : [];

  return (
    <Sidebar>
      <SidebarHeader className="p-4">
        <div className="flex items-center gap-3">
          <img 
            src={prLogo} 
            alt="P&R Logo" 
            className="h-8 w-8"
          />
          <div>
            <span className="font-bold text-base text-primary">P&R</span>
            <p className="text-xs text-muted-foreground">Gestão de TI</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navegação</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Criar</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {createItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup>
          <SidebarGroupLabel>Tipos de Equipamento</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {equipmentTypes.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {isAdmin && (
          <SidebarGroup>
            <SidebarGroupLabel>Administração</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {adminItems.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton asChild>
                      <a href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                        <item.icon className="h-4 w-4" />
                        <span>{item.title}</span>
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        )}
      </SidebarContent>
      
      <SidebarFooter className="p-4">
        <div className="flex items-center gap-3 mb-2">
          <Avatar className="h-8 w-8">
            <AvatarImage src={user?.profileImageUrl || undefined} alt={userName} />
            <AvatarFallback>{initials}</AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" data-testid="text-username">{userName}</p>
            <div className="flex items-center gap-1">
              <Badge variant={isAdmin ? "default" : "secondary"} className="text-xs">
                {isAdmin ? "Admin" : "Usuário"}
              </Badge>
            </div>
          </div>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="w-full justify-start"
          onClick={() => window.location.href = '/api/logout'}
          data-testid="button-logout"
        >
          <LogOut className="h-4 w-4 mr-2" />
          Sair
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}