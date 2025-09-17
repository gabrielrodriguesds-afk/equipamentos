import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Monitor, 
  Zap, 
  Edit, 
  Trash2, 
  Calendar, 
  Building2,
  User,
  Hash,
  MapPin
} from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface Equipment {
  id: string;
  name: string;
  type: 'computer' | 'ups';
  clientName: string;
  brand: string;
  model: string;
  serialNumber: string;
  sector: string;
  operator?: string;
  batteryDate?: string;
  observations?: string;
  photoUrl?: string;
  createdAt: string;
}

interface EquipmentCardProps {
  equipment: Equipment;
  canDelete?: boolean;
  onEdit?: (equipment: Equipment) => void;
  onDelete?: (equipmentId: string) => void;
}

export default function EquipmentCard({ 
  equipment, 
  canDelete = false, 
  onEdit, 
  onDelete 
}: EquipmentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  
  const Icon = equipment.type === 'computer' ? Monitor : Zap;
  
  const handleEdit = () => {
    console.log('Edit equipment:', equipment.id);
    onEdit?.(equipment);
  };
  
  const handleDelete = async () => {
    setIsDeleting(true);
    console.log('Delete equipment:', equipment.id);
    try {
      onDelete?.(equipment.id);
    } finally {
      setIsDeleting(false);
    }
  };
  
  return (
    <Card className="hover-elevate">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <Icon className={`h-10 w-10 p-2 rounded-md ${
              equipment.type === 'computer' ? 'bg-blue-100 text-blue-600 dark:bg-blue-900 dark:text-blue-300' : 
              'bg-amber-100 text-amber-600 dark:bg-amber-900 dark:text-amber-300'
            }`} />
            <div>
              <h3 className="font-mono font-semibold text-lg" data-testid={`text-equipment-name-${equipment.id}`}>
                {equipment.name}
              </h3>
              <Badge variant="secondary">
                {equipment.type === 'computer' ? 'Computador' : 'Nobreak'}
              </Badge>
            </div>
          </div>
          {equipment.photoUrl && (
            <Avatar className="h-12 w-12">
              <AvatarImage src={equipment.photoUrl} alt={`Foto do ${equipment.name}`} />
              <AvatarFallback>
                <Icon className="h-6 w-6" />
              </AvatarFallback>
            </Avatar>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2">
            <Building2 className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Cliente:</span>
            <span className="text-muted-foreground">{equipment.clientName}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <Hash className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Marca:</span>
            <span className="text-muted-foreground">{equipment.brand}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium">Modelo:</span>
            <span className="text-muted-foreground">{equipment.model}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <span className="font-medium">Série:</span>
            <span className="text-muted-foreground font-mono text-xs">{equipment.serialNumber}</span>
          </div>
          
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 text-muted-foreground" />
            <span className="font-medium">Setor:</span>
            <span className="text-muted-foreground">{equipment.sector}</span>
          </div>
          
          {equipment.operator && (
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Operador:</span>
              <span className="text-muted-foreground">{equipment.operator}</span>
            </div>
          )}
          
          {equipment.batteryDate && (
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <span className="font-medium">Data da Bateria:</span>
              <span className="text-muted-foreground">
                {new Date(equipment.batteryDate).toLocaleDateString('pt-BR')}
              </span>
            </div>
          )}
        </div>
        
        {equipment.observations && (
          <div className="pt-2 border-t">
            <p className="text-sm text-muted-foreground">
              <span className="font-medium">Observações:</span> {equipment.observations}
            </p>
          </div>
        )}
        
        <div className="flex justify-between items-center pt-2">
          <span className="text-xs text-muted-foreground">
            Criado em {new Date(equipment.createdAt).toLocaleDateString('pt-BR')}
          </span>
          
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={handleEdit}
              data-testid={`button-edit-${equipment.id}`}
            >
              <Edit className="h-4 w-4" />
            </Button>
            
            {canDelete && (
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button 
                    variant="destructive" 
                    size="sm"
                    data-testid={`button-delete-${equipment.id}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Confirmar Exclusão</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tem certeza que deseja excluir o equipamento <strong>{equipment.name}</strong>? 
                      Esta ação não pode ser desfeita.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction 
                      onClick={handleDelete} 
                      disabled={isDeleting}
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      {isDeleting ? "Excluindo..." : "Excluir"}
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}