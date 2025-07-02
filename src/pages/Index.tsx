import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import LoginPage from "@/components/auth/LoginPage";
import Dashboard from "@/components/dashboard/Dashboard";
import { useAuth } from "@/context/AuthContext";
import { LoadingPage } from "@/components/ui/loading";
import { dashboardRoutes } from "@/routes/routes";

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

const Index = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        {/* Protected dashboard routes */}
        {dashboardRoutes.map((route) => (
          <Route
            key={route.path}
            path={route.path === "/" ? "/dashboard" : route.path}
            element={
              <ProtectedRoute>
                <Dashboard>
                  <Suspense fallback={<LoadingPage />}>
                    <route.element />
                  </Suspense>
                </Dashboard>
              </ProtectedRoute>
            }
          />
        ))}

        <Route path="/" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
};

export default Index;
