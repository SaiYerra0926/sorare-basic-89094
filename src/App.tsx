import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { ThemeProvider } from "next-themes";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import BeginnersGuide from "./pages/BeginnersGuide";
import ReferralForms from "./pages/ReferralForms";
import ConsentForm from "./pages/ConsentForm";
import Handbook from "./pages/Handbook";
import Form1 from "./pages/Form1";
import Form2 from "./pages/Form2";
import Form3 from "./pages/Form3";
import Form4 from "./pages/Form4";
import Form5 from "./pages/Form5";
import Dashboard from "./pages/Dashboard";
import AdminDashboard from "./pages/AdminDashboard";
import Billing from "./pages/Billing";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <AuthProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/" element={<ProtectedRoute><Index /></ProtectedRoute>} />
              <Route path="/beginners-guide" element={<ProtectedRoute><BeginnersGuide /></ProtectedRoute>} />
              <Route path="/referrals" element={<ProtectedRoute><ReferralForms /></ProtectedRoute>} />
              <Route path="/consent-form" element={<ProtectedRoute><ConsentForm /></ProtectedRoute>} />
              <Route path="/handbook" element={<ProtectedRoute><Handbook /></ProtectedRoute>} />
              <Route path="/form1" element={<ProtectedRoute><Form1 /></ProtectedRoute>} />
              <Route path="/form2" element={<ProtectedRoute><Form2 /></ProtectedRoute>} />
              <Route path="/form3" element={<ProtectedRoute><Form3 /></ProtectedRoute>} />
              <Route path="/form4" element={<ProtectedRoute><Form4 /></ProtectedRoute>} />
              <Route path="/form5" element={<ProtectedRoute><Form5 /></ProtectedRoute>} />
              <Route path="/dashboard" element={<ProtectedRoute requirePermission="can_access_dashboard"><Dashboard /></ProtectedRoute>} />
              <Route path="/admin" element={<ProtectedRoute requireAdmin><AdminDashboard /></ProtectedRoute>} />
              <Route path="/billing" element={<ProtectedRoute requirePermission="can_access_billing"><Billing /></ProtectedRoute>} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </AuthProvider>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
