import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Filter, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface SearchFilters {
  type?: string;
  client?: string;
  sector?: string;
}

interface SearchBarProps {
  onSearch: (query: string, filters: SearchFilters) => void;
  onClearSearch: () => void;
  clients?: Array<{ id: string; name: string }>;
  isLoading?: boolean;
}

export default function SearchBar({ 
  onSearch, 
  onClearSearch, 
  clients = [], 
  isLoading = false 
}: SearchBarProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<SearchFilters>({});
  const [showFilters, setShowFilters] = useState(false);

  const handleSearch = () => {
    console.log('Search triggered:', { searchQuery, filters });
    onSearch(searchQuery, filters);
  };

  const handleClear = () => {
    setSearchQuery("");
    setFilters({});
    onClearSearch();
  };

  const hasFilters = Object.values(filters).some(value => value);
  const hasSearch = searchQuery || hasFilters;

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por nome, marca, modelo, número de série..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            className="pl-10"
            data-testid="input-search"
          />
        </div>
        <Button 
          variant="outline" 
          onClick={() => setShowFilters(!showFilters)}
          data-testid="button-toggle-filters"
        >
          <Filter className="h-4 w-4" />
        </Button>
        <Button 
          onClick={handleSearch} 
          disabled={isLoading}
          data-testid="button-search"
        >
          {isLoading ? "Buscando..." : "Buscar"}
        </Button>
        {hasSearch && (
          <Button 
            variant="outline" 
            onClick={handleClear}
            data-testid="button-clear-search"
          >
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {showFilters && (
        <div className="p-4 border rounded-md bg-muted/50 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo</label>
              <Select value={filters.type || ""} onValueChange={(value) => 
                setFilters(prev => ({ ...prev, type: value || undefined }))
              }>
                <SelectTrigger data-testid="select-filter-type">
                  <SelectValue placeholder="Todos os tipos" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os tipos</SelectItem>
                  <SelectItem value="computer">Computador</SelectItem>
                  <SelectItem value="ups">Nobreak</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Cliente</label>
              <Select value={filters.client || ""} onValueChange={(value) => 
                setFilters(prev => ({ ...prev, client: value || undefined }))
              }>
                <SelectTrigger data-testid="select-filter-client">
                  <SelectValue placeholder="Todos os clientes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos os clientes</SelectItem>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Setor</label>
              <Input
                placeholder="Filtrar por setor"
                value={filters.sector || ""}
                onChange={(e) => setFilters(prev => ({ ...prev, sector: e.target.value || undefined }))}
                data-testid="input-filter-sector"
              />
            </div>
          </div>
        </div>
      )}

      {hasFilters && (
        <div className="flex flex-wrap gap-2">
          {filters.type && (
            <Badge variant="secondary" className="gap-1">
              Tipo: {filters.type === 'computer' ? 'Computador' : 'Nobreak'}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setFilters(prev => ({ ...prev, type: undefined }))}
              />
            </Badge>
          )}
          {filters.client && (
            <Badge variant="secondary" className="gap-1">
              Cliente: {clients.find(c => c.id === filters.client)?.name || filters.client}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setFilters(prev => ({ ...prev, client: undefined }))}
              />
            </Badge>
          )}
          {filters.sector && (
            <Badge variant="secondary" className="gap-1">
              Setor: {filters.sector}
              <X 
                className="h-3 w-3 cursor-pointer" 
                onClick={() => setFilters(prev => ({ ...prev, sector: undefined }))}
              />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
}