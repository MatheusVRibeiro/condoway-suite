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
import { Visitantes } from "@/pages/Visitantes";
import { Reservas } from "@/pages/Reservas";
import { Comunicacoes } from "@/pages/Comunicacoes";
import { Financeiro } from "@/pages/Financeiro";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const AppRouter = () => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Login />;
  }

  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/moradores" element={<Moradores />} />
      <Route path="/visitantes" element={<Visitantes />} />
      <Route path="/encomendas" element={<Encomendas />} />
      <Route path="/reservas" element={<Reservas />} />
      <Route path="/comunicacoes" element={<Comunicacoes />} />
      {user?.tipo === 'sindico' && (
        <Route path="/financeiro" element={<Financeiro />} />
      )}
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
