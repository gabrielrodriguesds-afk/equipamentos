import EquipmentCard from '../EquipmentCard';

export default function EquipmentCardExample() {
  // Mock equipment data for demo //todo: remove mock functionality
  const mockEquipment = {
    id: "1",
    name: "P0001",
    type: "computer" as const,
    clientName: "Empresa ABC",
    brand: "Dell",
    model: "OptiPlex 3090",
    serialNumber: "ABC123456",
    sector: "Administração",
    operator: "Maria Santos",
    observations: "Equipamento em ótimo estado",
    createdAt: "2024-01-15T10:30:00Z"
  };

  const mockUpsEquipment = {
    id: "2",
    name: "N0001",
    type: "ups" as const,
    clientName: "Empresa XYZ",
    brand: "APC",
    model: "Smart-UPS 1500VA",
    serialNumber: "XYZ789012",
    sector: "Data Center",
    batteryDate: "2024-03-01T00:00:00Z",
    observations: "Bateria substituída recentemente",
    createdAt: "2024-02-01T14:15:00Z"
  };

  const handleEdit = (equipment: any) => {
    console.log('Edit equipment:', equipment.name);
  };

  const handleDelete = (equipmentId: string) => {
    console.log('Delete equipment:', equipmentId);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <EquipmentCard 
        equipment={mockEquipment} 
        canDelete={true}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
      <EquipmentCard 
        equipment={mockUpsEquipment} 
        canDelete={true}
        onEdit={handleEdit}
        onDelete={handleDelete}
      />
    </div>
  );
}