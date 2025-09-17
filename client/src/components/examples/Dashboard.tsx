import Dashboard from '../Dashboard';

export default function DashboardExample() {
  // Mock stats data for demo //todo: remove mock functionality
  const mockStats = {
    totalEquipment: 47,
    totalComputers: 32,
    totalUps: 15,
    totalClients: 8,
    recentEquipment: [
      {
        id: "1",
        name: "P0045",
        type: "computer" as const,
        clientName: "Empresa ABC Ltda",
        createdAt: "2024-03-15T10:30:00Z"
      },
      {
        id: "2",
        name: "N0012",
        type: "ups" as const,
        clientName: "Tech Solutions",
        createdAt: "2024-03-14T16:20:00Z"
      },
      {
        id: "3",
        name: "P0044",
        type: "computer" as const,
        clientName: "Inovação Digital",
        createdAt: "2024-03-13T09:15:00Z"
      },
    ]
  };

  // Mock user data for demo //todo: remove mock functionality
  const mockUser = {
    firstName: "Maria",
    lastName: "Silva",
    email: "maria@empresa.com",
    role: "admin",
    profileImageUrl: null
  };

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <Dashboard stats={mockStats} user={mockUser} />
    </div>
  );
}