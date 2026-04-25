import { useEffect } from 'react';
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ProtectedRoute from "@/components/ProtectedRoute";
import Landing from "@/pages/Landing";
import StudentAuth from "@/pages/StudentAuth";
import AdminAuth from "@/pages/AdminAuth";
import StudentDashboard from "@/pages/StudentDashboard";
import LibraryView from "@/pages/LibraryView";
import SlotBooking from "@/pages/SlotBooking";
import AdminDashboard from "@/pages/AdminDashboard";
import ManageBooks from "@/pages/ManageBooks";
import ManageStudents from "@/pages/ManageStudents";
import AdminLibraryView from "@/pages/AdminLibraryView";
import VigyaanDigitalLibrary from "@/pages/VigyaanDigitalLibrary";
import NotFoundPage from "@/pages/NotFoundPage";
import useAuthStore from "@/store/authStore";
import useVigyaanStore from "@/store/vigyaanStore";

const queryClient = new QueryClient();

const AppShell = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const checkAuth = useAuthStore((s) => s.checkAuth);
  const isVigyaanOpen = useVigyaanStore((s) => s.isOpen);

  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  useEffect(() => {
    if (isVigyaanOpen && location.pathname !== '/vigyaan') {
      navigate('/vigyaan', { replace: true });
    }
  }, [isVigyaanOpen, location.pathname, navigate]);

  const hideChrome = location.pathname === '/vigyaan';

  return (
    <div className="flex min-h-screen flex-col dark">
      {!hideChrome && <Navbar />}
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/auth/student" element={<StudentAuth />} />
          <Route path="/auth/admin" element={<AdminAuth />} />
          <Route path="/dashboard" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/library" element={
            <ProtectedRoute allowedRoles={['student']}>
              <LibraryView />
            </ProtectedRoute>
          } />
          <Route path="/slots" element={
            <ProtectedRoute allowedRoles={['student']}>
              <SlotBooking />
            </ProtectedRoute>
          } />
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/books" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageBooks />
            </ProtectedRoute>
          } />
          <Route path="/admin/students" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManageStudents />
            </ProtectedRoute>
          } />
          <Route path="/admin/library" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminLibraryView />
            </ProtectedRoute>
          } />
          <Route path="/vigyaan" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <VigyaanDigitalLibrary />
            </ProtectedRoute>
          } />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>
      {!hideChrome && <Footer />}
    </div>
  );
};

const AppContent = () => (
  <BrowserRouter>
    <AppShell />
  </BrowserRouter>
);

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Sonner />
      <AppContent />
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
