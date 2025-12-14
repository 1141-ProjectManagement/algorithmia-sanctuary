import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AudioProvider } from "@/contexts/AudioContext";
import CursorGlow from "@/components/CursorGlow";
import Index from "./pages/Index";
import Module1_1 from "./pages/Module1-1";
import Chapter1Hub from "./pages/Chapter1Hub";
import Chapter1Gate1 from "./pages/Chapter1Gate1";
import Chapter1Gate2 from "./pages/Chapter1Gate2";
import Chapter1Gate3 from "./pages/Chapter1Gate3";
import Chapter1Gate4 from "./pages/Chapter1Gate4";
import Chapter1Gate5 from "./pages/Chapter1Gate5";
import Chapter2Hub from "./pages/Chapter2Hub";
import Chapter2Gate1 from "./pages/Chapter2Gate1";
import Chapter2Gate2 from "./pages/Chapter2Gate2";
import Chapter2Gate3 from "./pages/Chapter2Gate3";
import Chapter2Gate4 from "./pages/Chapter2Gate4";
import Chapter2Gate5 from "./pages/Chapter2Gate5";
import Chapter3Hub from "./pages/Chapter3Hub";
import Chapter3Gate1 from "./pages/Chapter3Gate1";
import Chapter3Gate2 from "./pages/Chapter3Gate2";
import Chapter3Gate3 from "./pages/Chapter3Gate3";
import Chapter3Gate4 from "./pages/Chapter3Gate4";
import Chapter3Gate5 from "./pages/Chapter3Gate5";
import Chapter4Hub from "./pages/Chapter4Hub";
import Chapter4Gate1 from "./pages/Chapter4Gate1";
import Chapter4Gate2 from "./pages/Chapter4Gate2";
import Chapter4Gate3 from "./pages/Chapter4Gate3";
import Chapter4Gate4 from "./pages/Chapter4Gate4";
import Chapter4Gate5 from "./pages/Chapter4Gate5";
import Chapter5Hub from "./pages/Chapter5Hub";
import Chapter5Gate1 from "./pages/Chapter5Gate1";
import Chapter5Gate2 from "./pages/Chapter5Gate2";
import Chapter5Gate3 from "./pages/Chapter5Gate3";
import Chapter5Gate4 from "./pages/Chapter5Gate4";
import Chapter6Hub from "./pages/Chapter6Hub";
import Chapter6Gate1 from "./pages/Chapter6Gate1";
import Chapter6Gate2 from "./pages/Chapter6Gate2";
import Chapter6Gate3 from "./pages/Chapter6Gate3";
import Chapter6Gate4 from "./pages/Chapter6Gate4";
import NotFound from "./pages/NotFound";
import ProgressDashboard from "./pages/ProgressDashboard";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AudioProvider>
      <TooltipProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/progress" element={<ProgressDashboard />} />
            <Route path="/realm/1-1" element={<Module1_1 />} />
            <Route path="/chapter1" element={<Chapter1Hub />} />
            <Route path="/chapter1/gate1" element={<Chapter1Gate1 />} />
            <Route path="/chapter1/gate2" element={<Chapter1Gate2 />} />
            <Route path="/chapter1/gate3" element={<Chapter1Gate3 />} />
            <Route path="/chapter1/gate4" element={<Chapter1Gate4 />} />
            <Route path="/chapter1/gate5" element={<Chapter1Gate5 />} />
            <Route path="/chapter2" element={<Chapter2Hub />} />
            <Route path="/chapter2/gate1" element={<Chapter2Gate1 />} />
            <Route path="/chapter2/gate2" element={<Chapter2Gate2 />} />
            <Route path="/chapter2/gate3" element={<Chapter2Gate3 />} />
            <Route path="/chapter2/gate4" element={<Chapter2Gate4 />} />
            <Route path="/chapter2/gate5" element={<Chapter2Gate5 />} />
            <Route path="/chapter3" element={<Chapter3Hub />} />
            <Route path="/chapter3/gate1" element={<Chapter3Gate1 />} />
            <Route path="/chapter3/gate2" element={<Chapter3Gate2 />} />
            <Route path="/chapter3/gate3" element={<Chapter3Gate3 />} />
            <Route path="/chapter3/gate4" element={<Chapter3Gate4 />} />
            <Route path="/chapter3/gate5" element={<Chapter3Gate5 />} />
            <Route path="/chapter4" element={<Chapter4Hub />} />
            <Route path="/chapter4/gate1" element={<Chapter4Gate1 />} />
            <Route path="/chapter4/gate2" element={<Chapter4Gate2 />} />
            <Route path="/chapter4/gate3" element={<Chapter4Gate3 />} />
            <Route path="/chapter4/gate4" element={<Chapter4Gate4 />} />
            <Route path="/chapter4/gate5" element={<Chapter4Gate5 />} />
            <Route path="/chapter5" element={<Chapter5Hub />} />
            <Route path="/chapter5/gate1" element={<Chapter5Gate1 />} />
            <Route path="/chapter5/gate2" element={<Chapter5Gate2 />} />
            <Route path="/chapter5/gate3" element={<Chapter5Gate3 />} />
            <Route path="/chapter5/gate4" element={<Chapter5Gate4 />} />
            <Route path="/chapter6" element={<Chapter6Hub />} />
            <Route path="/chapter6/gate1" element={<Chapter6Gate1 />} />
            <Route path="/chapter6/gate2" element={<Chapter6Gate2 />} />
            <Route path="/chapter6/gate3" element={<Chapter6Gate3 />} />
            <Route path="/chapter6/gate4" element={<Chapter6Gate4 />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
        {/* Global cursor glow effect */}
        <CursorGlow />
        {/* Global notification components - rendered at root level with fixed positioning */}
        <Toaster />
        <Sonner />
      </TooltipProvider>
    </AudioProvider>
  </QueryClientProvider>
);

export default App;
