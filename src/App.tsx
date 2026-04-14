
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import PDFPage from "./pages/PDFPage";
import OrcamentosPage from "./pages/OrcamentosPage";
import AjudaPage from "./pages/AjudaPage";
import SobrePage from "./pages/SobrePage";
import LoginPage from "./pages/LoginPage";
import NotFound from "./pages/NotFound";
import { cn } from "@/lib/utils";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <div className={cn("min-h-screen bg-background font-sans antialiased")}>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<LoginPage />} />
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/pdf" element={<ProtectedRoute><PDFPage /></ProtectedRoute>} />
              <Route path="/orcamentos" element={<ProtectedRoute><OrcamentosPage /></ProtectedRoute>} />
              <Route path="/ajuda" element={<ProtectedRoute><AjudaPage /></ProtectedRoute>} />
              <Route path="/sobre" element={<ProtectedRoute><SobrePage /></ProtectedRoute>} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </div>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
