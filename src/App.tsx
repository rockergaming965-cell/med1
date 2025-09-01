import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";

// Pages
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Patients from "./pages/Patients";
import Surgeries from "./pages/Surgeries";
import NotFound from "./pages/NotFound";

// Components
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            
            {/* Protected Routes */}
            <Route element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }>
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/patients" element={<Patients />} />
              <Route path="/surgeries" element={<Surgeries />} />
              {/* Placeholder routes for other features */}
              <Route path="/doctors" element={<div className="p-6"><h1 className="text-2xl font-bold">Doctors Module</h1><p>Coming soon...</p></div>} />
              <Route path="/wards" element={<div className="p-6"><h1 className="text-2xl font-bold">Ward Allotment</h1><p>Coming soon...</p></div>} />
              <Route path="/inventory" element={<div className="p-6"><h1 className="text-2xl font-bold">Inventory Management</h1><p>Coming soon...</p></div>} />
              <Route path="/prescriptions" element={<div className="p-6"><h1 className="text-2xl font-bold">Prescriptions</h1><p>Coming soon...</p></div>} />
              <Route path="/monitoring" element={<div className="p-6"><h1 className="text-2xl font-bold">Real-time Monitoring</h1><p>Coming soon...</p></div>} />
              <Route path="/emergency" element={<div className="p-6"><h1 className="text-2xl font-bold">Emergency Module</h1><p>Coming soon...</p></div>} />
            </Route>

            <Route path="/unauthorized" element={
              <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                  <h1 className="text-2xl font-bold mb-4">Unauthorized</h1>
                  <p>You don't have permission to access this page.</p>
                </div>
              </div>
            } />
            
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
