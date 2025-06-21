import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import AdminUsers from "./pages/AdminUsers";
import { useAuth } from "@/hooks/useAuth";
import { GraduationCap } from "lucide-react";

const queryClient = new QueryClient();

const App = () => {
  const { user, profile, loading, signOut } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-100 via-blue-100 to-purple-100 flex items-center justify-center">
        <div className="text-center">
          <GraduationCap className="h-16 w-16 text-green-600 mx-auto mb-4 animate-bounce" />
          <p className="text-gray-700 text-lg font-semibold">Chargement du portail...</p>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/admin/users" element={<AdminUsers user={user} profile={profile} />} />
            <Route path="/" element={<Index user={user} profile={profile} signOut={signOut} />} />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  );
};

export default App;
