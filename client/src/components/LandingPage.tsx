import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Monitor, Shield, Smartphone } from "lucide-react";
import prLogo from "@assets/Logo_P&R_Reduzido_Cores_1757550343131.png";
import heroBackground from "@assets/Fundo para Capa_1757550343133.jpg";

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div 
        className="relative bg-gradient-to-b from-primary/20 to-background overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.8)), url(${heroBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="container mx-auto px-4 py-20 text-center relative z-10">
          <img 
            src={prLogo} 
            alt="P&R Logo" 
            className="h-20 w-auto mx-auto mb-6"
          />
          <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">
            P&R - Gestão de Equipamentos TI
          </h1>
          <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
            Gerencie seus equipamentos de informática de forma eficiente com tecnologia avançada e controle total
          </p>
          <Button 
            size="lg" 
            onClick={() => window.location.href = '/api/login'}
            data-testid="button-login"
            className="text-lg px-8 py-4"
          >
            Acessar Sistema
          </Button>
        </div>
        
        {/* Tech Pattern Overlay */}
        <div className="absolute inset-0 opacity-10">
          <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-transparent"></div>
        </div>
      </div>

      {/* Features Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="grid md:grid-cols-3 gap-8">
          <Card className="hover-elevate">
            <CardContent className="p-6 text-center">
              <Monitor className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Gestão Completa</h3>
              <p className="text-muted-foreground">
                Cadastre computadores e nobreaks com nomenclatura automática (P0001, N0001)
              </p>
            </CardContent>
          </Card>
          <Card className="hover-elevate">
            <CardContent className="p-6 text-center">
              <Shield className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Controle de Acesso</h3>
              <p className="text-muted-foreground">
                Administradores e usuários com permissões específicas para cada funcionalidade
              </p>
            </CardContent>
          </Card>
          <Card className="hover-elevate">
            <CardContent className="p-6 text-center">
              <Smartphone className="h-12 w-12 mx-auto mb-4 text-primary" />
              <h3 className="text-xl font-semibold mb-2">Mobile First</h3>
              <p className="text-muted-foreground">
                Interface otimizada para dispositivos móveis com suporte a câmera
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}