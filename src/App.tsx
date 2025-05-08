
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
import TrackingDetails from "@/pages/TrackingDetails";
import Alerts from "@/pages/Alerts";
import Occurrences from "@/pages/Occurrences";
import CreateOccurrence from "@/pages/CreateOccurrence";
import OccurrenceDetails from "@/pages/OccurrenceDetails";
import NotFound from "@/pages/NotFound";
import { NotificationProvider } from "@/contexts/NotificationContext";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <BrowserRouter>
          <AuthProvider>
            <NotificationProvider>
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
                  <Route path="tracking/:id" element={<TrackingDetails />} />
                  <Route path="alerts" element={<Alerts />} /> 
                  <Route path="checklist" element={<Checklist />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="create-invoice" element={<CreateInvoice />} />
                  <Route path="bi" element={<BiDashboard />} />
                  <Route path="occurrences" element={<Occurrences />} />
                  <Route path="occurrences/new" element={<CreateOccurrence />} />
                  <Route path="occurrences/:id" element={<OccurrenceDetails />} />
                </Route>
                
                <Route path="/" element={<Index />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </NotificationProvider>
          </AuthProvider>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
