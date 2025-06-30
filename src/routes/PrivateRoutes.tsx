import { Route } from "react-router-dom";
import Dashboard from '@/pages/Dashboard';
import DashboardLayout from "@/component/layout/DashboardLayout";
import ProtectedRoute from "@/pages/auth/ProtectedRoute";

export const privateRoutes = [
  <Route
    key="dashboard"
    path="/dashboard"
    element={
      <ProtectedRoute>
        <DashboardLayout>
          <Dashboard />
        </DashboardLayout>
      </ProtectedRoute>
    }
  />,
  // Add more private routes here as your app grows
];

export default privateRoutes;
