import AppSidebar from '../AppSidebar';

export default function AppSidebarExample() {
  // Mock user data for demo
  const mockUser = {
    firstName: "João",
    lastName: "Silva",
    email: "joao@empresa.com",
    profileImageUrl: null,
    role: "admin"
  };

  return (
    <div className="h-screen w-80">
      <AppSidebar user={mockUser} />
    </div>
  );
}