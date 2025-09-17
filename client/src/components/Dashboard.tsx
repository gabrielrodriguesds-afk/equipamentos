import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Monitor, 
  Zap, 
  Building2, 
  Users,
  Plus,
  TrendingUp,
  Calendar,
  Activity
} from "lucide-react";
import { Link } from "wouter";

interface DashboardStats {
  totalEquipment: number;
  totalComputers: number;
  totalUps: number;
  totalClients: number;
  recentEquipment: Array<{
    id: string;
    name: string;
    type: 'computer' | 'ups';
    clientName: string;
    createdAt: string;
  }>;
}

interface DashboardProps {
  stats: DashboardStats;
  user?: {
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    role: string;
    profileImageUrl: string | null;
  };
}

export default function Dashboard({ stats, user }: DashboardProps) {
  const isAdmin = user?.role === 'admin';
  const userName = user ? `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email : 'Usuário';
  
  const quickActions = [
    {
      title: "Novo Computador",
      description: "Cadastrar novo computador",
      icon: Monitor,
      href: "/equipment/new?type=computer",
      color: "bg-blue-500"
    },
    {
      title: "Novo Nobreak",
      description: "Cadastrar novo nobreak",
      icon: Zap,
      href: "/equipment/new?type=ups",
      color: "bg-amber-500"
    },
    ...(isAdmin ? [{
      title: "Novo Cliente",
      description: "Cadastrar novo cliente",
      icon: Building2,
      href: "/clients/new",
      color: "bg-green-500"
    }] : []),
    {
      title: "Buscar Equipamentos",
      description: "Pesquisar na base de dados",
      icon: Activity,
      href: "/search",
      color: "bg-purple-500"
    }
  ];

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-welcome">Olá, {userName}!</h1>
          <p className="text-muted-foreground mt-1">Bem-vindo ao sistema de gestão de equipamentos TI</p>
        </div>
        <div className="flex items-center gap-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={user?.profileImageUrl || undefined} alt={userName} />
            <AvatarFallback>
              {userName.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
            </AvatarFallback>
          </Avatar>
          <div>
            <Badge variant={isAdmin ? "default" : "secondary"}>
              {isAdmin ? "Administrador" : "Usuário"}
            </Badge>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="hover-elevate">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Total de Equipamentos</p>
                <p className="text-3xl font-bold" data-testid="stat-total-equipment">{stats.totalEquipment}</p>
              </div>
              <div className="h-12 w-12 bg-primary/10 rounded-full flex items-center justify-center">
                <Monitor className="h-6 w-6 text-primary" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Computadores</p>
                <p className="text-3xl font-bold" data-testid="stat-computers">{stats.totalComputers}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                <Monitor className="h-6 w-6 text-blue-600 dark:text-blue-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Nobreaks</p>
                <p className="text-3xl font-bold" data-testid="stat-ups">{stats.totalUps}</p>
              </div>
              <div className="h-12 w-12 bg-amber-100 dark:bg-amber-900 rounded-full flex items-center justify-center">
                <Zap className="h-6 w-6 text-amber-600 dark:text-amber-300" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="hover-elevate">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-muted-foreground">Clientes</p>
                <p className="text-3xl font-bold" data-testid="stat-clients">{stats.totalClients}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center">
                <Building2 className="h-6 w-6 text-green-600 dark:text-green-300" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Ações Rápidas
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => (
              <Link key={action.title} href={action.href}>
                <Button 
                  variant="outline" 
                  className="h-auto p-4 flex flex-col items-center gap-3 w-full hover-elevate"
                  data-testid={`button-${action.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <div className={`h-10 w-10 ${action.color} rounded-full flex items-center justify-center`}>
                    <action.icon className="h-5 w-5 text-white" />
                  </div>
                  <div className="text-center">
                    <p className="font-semibold text-sm">{action.title}</p>
                    <p className="text-xs text-muted-foreground mt-1">{action.description}</p>
                  </div>
                </Button>
              </Link>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Equipment */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Equipamentos Recentes
            </div>
            <Link href="/equipment">
              <Button variant="outline" size="sm">Ver Todos</Button>
            </Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {stats.recentEquipment.length > 0 ? (
              stats.recentEquipment.map((equipment) => {
                const Icon = equipment.type === 'computer' ? Monitor : Zap;
                return (
                  <div key={equipment.id} className="flex items-center justify-between p-3 rounded-md border hover-elevate">
                    <div className="flex items-center gap-3">
                      <Icon className={`h-8 w-8 p-2 rounded-md ${
                        equipment.type === 'computer' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 
                        'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300'
                      }`} />
                      <div>
                        <p className="font-mono font-semibold" data-testid={`equipment-${equipment.id}`}>{equipment.name}</p>
                        <p className="text-sm text-muted-foreground">{equipment.clientName}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge variant="secondary">
                        {equipment.type === 'computer' ? 'Computador' : 'Nobreak'}
                      </Badge>
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3" />
                        {new Date(equipment.createdAt).toLocaleDateString('pt-BR')}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Monitor className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Nenhum equipamento cadastrado ainda</p>
                <p className="text-sm mt-1">Use as ações rápidas acima para começar</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}