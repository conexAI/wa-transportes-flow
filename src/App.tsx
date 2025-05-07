
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from "@/pages/Login";
import Index from "@/pages/Index";
import AppLayout from "@/components/AppLayout";
import Dashboard from "@/pages/Dashboard";
import History from "@/pages/History";
import Checklist from "@/pages/Checklist";
import Settings from "@/pages/Settings";
import CreateInvoice from "@/pages/CreateInvoice";
import BiDashboard from "@/pages/BiDashboard";
import Tracking from "@/pages/Tracking";
import Alerts from "@/pages/Alerts"; // Import the new Alerts page
import NotFound from "@/pages/NotFound";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <Toaster />
            <Sonner />
            <Routes>
              <Route path="/login" element={<Login />} />
              
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <AppLayout />
                  </ProtectedRoute>
                }
              >
                <Route index element={<Dashboard />} />
                <Route path="history" element={<History />} />
                <Route path="tracking" element={<Tracking />} />
                <Route path="alerts" element={<Alerts />} /> {/* New alerts route */}
                <Route path="checklist" element={<Checklist />} />
                <Route path="settings" element={<Settings />} />
                <Route path="create-invoice" element={<CreateInvoice />} />
                <Route path="bi" element={<BiDashboard />} />
              </Route>
              
              <Route path="/" element={<Index />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
