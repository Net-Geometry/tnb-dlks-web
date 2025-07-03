import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import LoginPage from "@/components/auth/LoginPage";
import SignUpPage from "@/components/auth/SignUpPage";
import { DashboardLayout } from "@/components/layout";
import NotFound from "./NotFound";
import { LoadingPage } from "@/components/ui/loading";
import { ProtectedRoutes } from "@/routes/routes";
import ProtectedRoute from "@/routes/ProtectedRoute";

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Routes>
        {/* Public routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignUpPage />} />

        {/* Protected dashboard routes */}
        {ProtectedRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={
              <ProtectedRoute>
                <DashboardLayout>
                  <Suspense fallback={<LoadingPage />}>
                    <route.element />
                  </Suspense>
                </DashboardLayout>
              </ProtectedRoute>
            }
          />
        ))}

        {/* Root route - should redirect based on auth state */}
        <Route path="/" element={<Navigate to="/dashboard" replace />} />

        {/* Catch-all route for 404 */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
};

export default Index;
