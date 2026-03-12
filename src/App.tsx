import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
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
        <Routes>
          {/* Full-screen routes (no bottom nav) */}
          <Route path="/auth" element={<Auth />} />
          <Route path="/onboarding" element={<Onboarding />} />
          <Route path="/player/:id" element={<Player />} />

          {/* Routes with bottom nav */}
          <Route element={<MobileShell />}>
            <Route path="/" element={<Index />} />
            <Route path="/respirar" element={<Respirar />} />
            <Route path="/sesion" element={<Sesion />} />
            <Route path="/perfil" element={<Perfil />} />
            <Route path="/practica/:id" element={<Practica />} />
            <Route path="/programa/:id" element={<Programa />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
