import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import RegisterPage from "./pages/RegisterPage";
import { useIsMobile } from "@/hooks/use-mobile";
import { LiffProvider, useLiff } from "@/contexts/LiffContext";
import { LiffLoading } from "@/components/auth/LiffLoading";
import { LiffError } from "@/components/auth/LiffError";
import { DesktopViewToggle } from "@/components/DesktopViewToggle";

const queryClient = new QueryClient();

const AppContent = () => {
  const { isLoading, error, membershipStatus } = useLiff();

  if (isLoading) {
    return <LiffLoading />;
  }

  if (error) {
    return <LiffError message={error} />;
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={membershipStatus === 'store_member' ? <Index /> : <Navigate to="/register" replace />} />
        <Route path="/register" element={membershipStatus !== 'store_member' ? <RegisterPage /> : <Navigate to="/" replace />} />
        {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
};

const App = () => {
  const isMobile = useIsMobile();

  return (
    <QueryClientProvider client={queryClient}>
      <LiffProvider>
        <TooltipProvider>
          <Sonner 
            position={isMobile ? "top-center" : "bottom-center"} 
            offset={isMobile ? 20 : 100}
            visibleToasts={1}
            toastOptions={{
              style: {
                zIndex: 99999,
              },
            }}
          />
          <AppContent />
          <DesktopViewToggle />
        </TooltipProvider>
      </LiffProvider>
    </QueryClientProvider>
  );
};

export default App;