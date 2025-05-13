
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import PDFPage from "./pages/PDFPage";
import OrcamentosPage from "./pages/OrcamentosPage";
import AjudaPage from "./pages/AjudaPage";
import SobrePage from "./pages/SobrePage";
import NotFound from "./pages/NotFound";

import { cn } from "@/lib/utils";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <div className={cn("min-h-screen bg-background font-sans antialiased")}>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/pdf" element={<PDFPage />} />
            <Route path="/orcamentos" element={<OrcamentosPage />} />
            <Route path="/ajuda" element={<AjudaPage />} />
            <Route path="/sobre" element={<SobrePage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </div>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
