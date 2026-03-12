import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/hooks/useAuth";
import { AuthGuard } from "@/components/AuthGuard";
import { MobileShell } from "@/components/layout/MobileShell";
import Index from "./pages/Index";
import Respirar from "./pages/Respirar";
import Sesion from "./pages/Sesion";
import Perfil from "./pages/Perfil";
import Auth from "./pages/Auth";
import Onboarding from "./pages/Onboarding";
import Practica from "./pages/Practica";
import Player from "./pages/Player";
import Programa from "./pages/Programa";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <BrowserRouter>
        <AuthProvider>
          <Routes>
            {/* Public routes */}
            <Route path="/auth" element={<Auth />} />

            {/* Protected: onboarding */}
            <Route path="/onboarding" element={<AuthGuard><Onboarding /></AuthGuard>} />
            <Route path="/player/:id" element={<AuthGuard><Player /></AuthGuard>} />

            {/* Protected routes with bottom nav */}
            <Route element={<AuthGuard><MobileShell /></AuthGuard>}>
              <Route path="/" element={<Index />} />
              <Route path="/respirar" element={<Respirar />} />
              <Route path="/sesion" element={<Sesion />} />
              <Route path="/perfil" element={<Perfil />} />
              <Route path="/practica/:id" element={<Practica />} />
              <Route path="/programa/:id" element={<Programa />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
