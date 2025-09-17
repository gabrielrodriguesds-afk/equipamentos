import EquipmentForm from '../EquipmentForm';

export default function EquipmentFormExample() {
  // Mock clients data for demo //todo: remove mock functionality
  const mockClients = [
    { id: "1", name: "Empresa ABC Ltda" },
    { id: "2", name: "Tech Solutions Corp" },
    { id: "3", name: "Inovação Digital" },
  ];

  const handleSubmit = (data: any) => {
    console.log('Equipment form submitted:', data);
    alert(`Equipamento salvo com sucesso! Nome gerado: P0005`);
  };

  const handleCancel = () => {
    console.log('Form cancelled');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <EquipmentForm 
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        clients={mockClients}
        generatedName="P0005"
      />
    </div>
  );
}