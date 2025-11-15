import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Module1_1 from "./pages/Module1-1";
import Chapter1Hub from "./pages/Chapter1Hub";
import Chapter1Gate1 from "./pages/Chapter1Gate1";
import Chapter1Gate2 from "./pages/Chapter1Gate2";
import Chapter1Gate3 from "./pages/Chapter1Gate3";
import Chapter1Gate4 from "./pages/Chapter1Gate4";
import Chapter1Gate5 from "./pages/Chapter1Gate5";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/realm/1-1" element={<Module1_1 />} />
          <Route path="/chapter1" element={<Chapter1Hub />} />
          <Route path="/chapter1/gate1" element={<Chapter1Gate1 />} />
          <Route path="/chapter1/gate2" element={<Chapter1Gate2 />} />
          <Route path="/chapter1/gate3" element={<Chapter1Gate3 />} />
          <Route path="/chapter1/gate4" element={<Chapter1Gate4 />} />
          <Route path="/chapter1/gate5" element={<Chapter1Gate5 />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
      {/* Global notification components - rendered at root level with fixed positioning */}
      <Toaster />
      <Sonner />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
