import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ThemeProvider } from "@/hooks/use-theme";
import { LanguageProvider } from "@/hooks/use-language";
import { AuthProvider } from "@/hooks/use-auth";
import ProtectedRoute from "@/components/ProtectedRoute";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Practice from "./pages/Practice";
import Analytics from "./pages/Analytics";
import SubjectDetail from "./pages/SubjectDetail";
import Subjects from "./pages/Subjects";
import Leaderboard from "./pages/Leaderboard";
import Challenge from "./pages/Challenge";
import Settings from "./pages/Settings";
import PastPapers from "./pages/PastPapers";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
    <LanguageProvider>
    <BrowserRouter>
    <AuthProvider>
    <TooltipProvider>
      <Toaster />
      <Sonner />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>} />
          <Route path="/dashboard/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/dashboard/subjects" element={<ProtectedRoute><Subjects /></ProtectedRoute>} />
          <Route path="/dashboard/subjects/:subject" element={<ProtectedRoute><SubjectDetail /></ProtectedRoute>} />
          <Route path="/dashboard/leaderboard" element={<ProtectedRoute><Leaderboard /></ProtectedRoute>} />
          <Route path="/dashboard/challenge" element={<ProtectedRoute><Challenge /></ProtectedRoute>} />
          <Route path="/dashboard/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/dashboard/past-papers" element={<ProtectedRoute><PastPapers /></ProtectedRoute>} />
          <Route path="*" element={<NotFound />} />
        </Routes>
    </TooltipProvider>
    </AuthProvider>
    </BrowserRouter>
    </LanguageProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
