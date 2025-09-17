import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Plus, Computer, Battery, Users } from "lucide-react";
import { Link } from "wouter";
import type { Client, Equipment } from "@shared/schema";

export default function Dashboard() {
  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
    enabled: true,
  });

  const { data: equipment = [] } = useQuery<Equipment[]>({
    queryKey: ['/api/equipment'],
    enabled: true,
  });

  const stats = {
    totalClients: clients.length,
    totalEquipment: equipment.length,
    computers: equipment.filter((eq) => eq.type === 'computer').length,
    ups: equipment.filter((eq) => eq.type === 'ups').length,
  };

  const recentEquipment = equipment
    .sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime())
    .slice(0, 5);

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
        <p className="text-muted-foreground">
          Visão geral do sistema de gestão de equipamentos P&R
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary" data-testid="stat-clients">
              {stats.totalClients}
            </div>
            <p className="text-xs text-muted-foreground">
              Clientes cadastrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Equipamentos</CardTitle>
            <Computer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary" data-testid="stat-equipment">
              {stats.totalEquipment}
            </div>
            <p className="text-xs text-muted-foreground">
              Equipamentos registrados
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Computadores</CardTitle>
            <Computer className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary" data-testid="stat-computers">
              {stats.computers}
            </div>
            <p className="text-xs text-muted-foreground">
              Série P (computadores)
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">UPS/Nobreaks</CardTitle>
            <Battery className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary" data-testid="stat-ups">
              {stats.ups}
            </div>
            <p className="text-xs text-muted-foreground">
              Série N (nobreaks)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações Rápidas</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Link href="/clientes">
            <Button className="w-full justify-start gap-2" variant="outline" data-testid="button-manage-clients">
              <Users className="h-4 w-4" />
              Gerenciar Clientes
            </Button>
          </Link>
          
          <Link href="/equipamentos">
            <Button className="w-full justify-start gap-2" variant="outline" data-testid="button-manage-equipment">
              <Computer className="h-4 w-4" />
              Gerenciar Equipamentos
            </Button>
          </Link>

          <Link href="/equipamentos/novo">
            <Button className="w-full justify-start gap-2" data-testid="button-add-equipment">
              <Plus className="h-4 w-4" />
              Adicionar Equipamento
            </Button>
          </Link>
        </CardContent>
      </Card>

      {/* Recent Equipment */}
      {recentEquipment.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Equipamentos Recentes</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentEquipment.map((eq) => (
                <div key={eq.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    {eq.type === 'computer' ? (
                      <Computer className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Battery className="h-5 w-5 text-green-500" />
                    )}
                    <div>
                      <p className="font-medium">{eq.name}</p>
                      <p className="text-sm text-muted-foreground">
                        {eq.brand} {eq.model} • {eq.sector}
                      </p>
                    </div>
                  </div>
                  <Badge variant={eq.type === 'computer' ? 'default' : 'secondary'}>
                    {eq.type === 'computer' ? 'Computador' : 'UPS'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}