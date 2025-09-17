import SearchBar from '../SearchBar';

export default function SearchBarExample() {
  // Mock clients data for demo //todo: remove mock functionality
  const mockClients = [
    { id: "1", name: "Empresa ABC Ltda" },
    { id: "2", name: "Tech Solutions Corp" },
    { id: "3", name: "Inovação Digital" },
  ];

  const handleSearch = (query: string, filters: any) => {
    console.log('Search executed:', { query, filters });
  };

  const handleClearSearch = () => {
    console.log('Search cleared');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <SearchBar 
        onSearch={handleSearch}
        onClearSearch={handleClearSearch}
        clients={mockClients}
      />
    </div>
  );
}