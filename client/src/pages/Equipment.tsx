import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus, Edit, Trash2, Computer, Battery, Search, Filter } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertEquipmentSchema } from "@shared/schema";
import type { Equipment, InsertEquipment, Client } from "@shared/schema";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { z } from "zod";

export default function EquipmentPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState<string>("all");
  const [clientFilter, setClientFilter] = useState<string>("all");
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<Equipment | null>(null);
  const { toast } = useToast();

  const { data: equipment = [], isLoading } = useQuery<Equipment[]>({
    queryKey: ['/api/equipment'],
    enabled: true,
  });

  const { data: clients = [] } = useQuery<Client[]>({
    queryKey: ['/api/clients'],
    enabled: true,
  });

  const form = useForm<InsertEquipment>({
    resolver: zodResolver(insertEquipmentSchema),
    defaultValues: {
      type: "computer",
      clientId: "",
      brand: "",
      model: "",
      serialNumber: "",
      sector: "",
      operator: "",
      batteryDate: undefined,
      observations: undefined,
      photoUrl: undefined,
    },
  });

  const createMutation = useMutation({
    mutationFn: (data: InsertEquipment) => apiRequest('POST', '/api/equipment', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/equipment'] });
      setIsDialogOpen(false);
      form.reset();
      toast({
        title: "Equipamento criado",
        description: "Equipamento cadastrado com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao criar equipamento",
        variant: "destructive",
      });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string, data: InsertEquipment }) => 
      apiRequest('PUT', `/api/equipment/${id}`, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/equipment'] });
      setIsDialogOpen(false);
      setEditingEquipment(null);
      form.reset();
      toast({
        title: "Equipamento atualizado",
        description: "Equipamento atualizado com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro", 
        description: "Falha ao atualizar equipamento",
        variant: "destructive",
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => apiRequest('DELETE', `/api/equipment/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/equipment'] });
      toast({
        title: "Equipamento removido",
        description: "Equipamento removido com sucesso!",
      });
    },
    onError: () => {
      toast({
        title: "Erro",
        description: "Falha ao remover equipamento",
        variant: "destructive",
      });
    },
  });

  const filteredEquipment = equipment.filter((eq) => {
    const matchesSearch = eq.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         eq.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         eq.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         eq.sector.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (eq.operator && eq.operator.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesType = typeFilter === "all" || eq.type === typeFilter;
    const matchesClient = clientFilter === "all" || eq.clientId === clientFilter;
    
    return matchesSearch && matchesType && matchesClient;
  });

  const onSubmit = (data: InsertEquipment) => {
    // Clean up data based on equipment type - keep dates as strings for the API
    const cleanData: InsertEquipment = {
      ...data,
      operator: data.type === "computer" ? data.operator : undefined,
      batteryDate: data.type === "ups" ? data.batteryDate : undefined,
    };

    if (editingEquipment) {
      updateMutation.mutate({ id: editingEquipment.id, data: cleanData });
    } else {
      createMutation.mutate(cleanData);
    }
  };

  const handleEdit = (equipment: Equipment) => {
    setEditingEquipment(equipment);
    form.setValue("type", equipment.type as "computer" | "ups");
    form.setValue("clientId", equipment.clientId);
    form.setValue("brand", equipment.brand);
    form.setValue("model", equipment.model);
    form.setValue("serialNumber", equipment.serialNumber);
    form.setValue("sector", equipment.sector);
    form.setValue("operator", equipment.operator || "");
    form.setValue("batteryDate", equipment.batteryDate ? new Date(equipment.batteryDate).toISOString().split('T')[0] : "");
    form.setValue("observations", equipment.observations ?? "");
    form.setValue("photoUrl", equipment.photoUrl ?? "");
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja remover este equipamento?")) {
      deleteMutation.mutate(id);
    }
  };

  const resetForm = () => {
    setEditingEquipment(null);
    form.reset();
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || "Cliente não encontrado";
  };

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Equipamentos</h1>
          <p className="text-muted-foreground">
            Gerencie computadores e UPS/nobreaks dos clientes
          </p>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) resetForm();
        }}>
          <DialogTrigger asChild>
            <Button data-testid="button-add-equipment">
              <Plus className="h-4 w-4 mr-2" />
              Novo Equipamento
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>
                {editingEquipment ? "Editar Equipamento" : "Novo Equipamento"}
              </DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="type"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Equipamento</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            data-testid="select-equipment-type"
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o tipo" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="computer">Computador</SelectItem>
                              <SelectItem value="ups">UPS/Nobreak</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="clientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cliente</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                            data-testid="select-equipment-client"
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione o cliente" />
                            </SelectTrigger>
                            <SelectContent>
                              {clients.map((client) => (
                                <SelectItem key={client.id} value={client.id}>
                                  {client.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="brand"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Marca</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Dell, HP, APC..."
                            {...field}
                            data-testid="input-equipment-brand"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="model"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Modelo</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: OptiPlex 7090, Smart-UPS 1500..."
                            {...field}
                            data-testid="input-equipment-model"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="serialNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Número de Série</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Número de série do equipamento"
                            {...field}
                            data-testid="input-equipment-serial"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="sector"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Setor</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Ex: Administração, TI, Vendas..."
                            {...field}
                            data-testid="input-equipment-sector"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {form.watch("type") === "computer" && (
                  <FormField
                    control={form.control}
                    name="operator"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Operador/Usuário</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Nome do usuário do computador"
                            {...field}
                            data-testid="input-equipment-operator"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                {form.watch("type") === "ups" && (
                  <FormField
                    control={form.control}
                    name="batteryDate"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Data da Bateria</FormLabel>
                        <FormControl>
                          <Input
                            type="date"
                            {...field}
                            value={field.value ?? ""}
                            data-testid="input-equipment-battery-date"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name="observations"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observações</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Informações adicionais sobre o equipamento"
                          {...field}
                          value={field.value ?? ""}
                          data-testid="input-equipment-observations"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setIsDialogOpen(false);
                      resetForm();
                    }}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    disabled={createMutation.isPending || updateMutation.isPending}
                    data-testid="button-save-equipment"
                  >
                    {editingEquipment ? "Atualizar" : "Criar"}
                  </Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Buscar equipamentos..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-9"
            data-testid="input-search-equipment"
          />
        </div>

        <Select value={typeFilter} onValueChange={setTypeFilter}>
          <SelectTrigger className="w-full sm:w-48" data-testid="select-filter-type">
            <Filter className="h-4 w-4 mr-2" />
            <SelectValue placeholder="Filtrar por tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os tipos</SelectItem>
            <SelectItem value="computer">Computadores</SelectItem>
            <SelectItem value="ups">UPS/Nobreaks</SelectItem>
          </SelectContent>
        </Select>

        <Select value={clientFilter} onValueChange={setClientFilter}>
          <SelectTrigger className="w-full sm:w-48" data-testid="select-filter-client">
            <SelectValue placeholder="Filtrar por cliente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todos os clientes</SelectItem>
            {clients.map((client) => (
              <SelectItem key={client.id} value={client.id}>
                {client.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Equipment Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-muted rounded w-3/4"></div>
                <div className="h-3 bg-muted rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="h-3 bg-muted rounded w-full mb-2"></div>
                <div className="h-3 bg-muted rounded w-2/3"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredEquipment.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center p-6">
            <Computer className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              {searchTerm || typeFilter !== "all" || clientFilter !== "all" 
                ? "Nenhum equipamento encontrado"
                : "Nenhum equipamento cadastrado"
              }
            </h3>
            <p className="text-muted-foreground text-center mb-4">
              {searchTerm || typeFilter !== "all" || clientFilter !== "all"
                ? "Tente ajustar seus filtros ou cadastre um novo equipamento."
                : "Comece cadastrando o primeiro equipamento do sistema."
              }
            </p>
            {!searchTerm && typeFilter === "all" && clientFilter === "all" && (
              <Button onClick={() => setIsDialogOpen(true)}>
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Equipamento
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredEquipment.map((eq) => (
            <Card key={eq.id} className="hover-elevate" data-testid={`card-equipment-${eq.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    {eq.type === 'computer' ? (
                      <Computer className="h-5 w-5 text-blue-500" />
                    ) : (
                      <Battery className="h-5 w-5 text-green-500" />
                    )}
                    <div>
                      <CardTitle className="text-lg">{eq.name}</CardTitle>
                      <p className="text-sm text-muted-foreground">
                        {eq.brand} {eq.model}
                      </p>
                    </div>
                  </div>
                  <Badge variant={eq.type === 'computer' ? 'default' : 'secondary'}>
                    {eq.type === 'computer' ? 'Computador' : 'UPS'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 text-sm">
                  <p><span className="font-medium">Cliente:</span> {getClientName(eq.clientId)}</p>
                  <p><span className="font-medium">Setor:</span> {eq.sector}</p>
                  {eq.operator && (
                    <p><span className="font-medium">Operador:</span> {eq.operator}</p>
                  )}
                  {eq.batteryDate && (
                    <p><span className="font-medium">Data da Bateria:</span> {new Date(eq.batteryDate).toLocaleDateString('pt-BR')}</p>
                  )}
                  <p><span className="font-medium">Série:</span> {eq.serialNumber}</p>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleEdit(eq)}
                    data-testid={`button-edit-equipment-${eq.id}`}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleDelete(eq.id)}
                    disabled={deleteMutation.isPending}
                    data-testid={`button-delete-equipment-${eq.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}