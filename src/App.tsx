import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider, useAuth } from "@/context/AuthContext";
import { Layout } from "@/components/layout/Layout";
import { Login } from "@/pages/Login";
import { Dashboard } from "@/pages/Dashboard";
import { Moradores } from "@/pages/Moradores";
import { Encomendas } from "@/pages/Encomendas";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRouter = () => {
  const { isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/moradores" element={<Moradores />} />
      <Route path="/visitantes" element={<div className="p-6"><h1 className="text-2xl font-bold">Controle de Visitantes</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>} />
      <Route path="/encomendas" element={<Encomendas />} />
      <Route path="/reservas" element={<div className="p-6"><h1 className="text-2xl font-bold">Reservas de Ambientes</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>} />
      <Route path="/comunicacao" element={<div className="p-6"><h1 className="text-2xl font-bold">Comunicação</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>} />
      <Route path="/estrutura" element={<div className="p-6"><h1 className="text-2xl font-bold">Gestão Estrutural</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>} />
      <Route path="/financeiro" element={<div className="p-6"><h1 className="text-2xl font-bold">Financeiro</h1><p className="text-muted-foreground">Em desenvolvimento...</p></div>} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
        <BrowserRouter>
          <Layout>
            <Toaster />
            <Sonner />
            <AppRouter />
          </Layout>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
