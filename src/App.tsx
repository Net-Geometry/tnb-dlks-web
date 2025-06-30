import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { publicRoutes } from "@/routes/PublicRoutes";
import { privateRoutes } from "@/routes/PrivateRoutes";
import DashboardLayout from "@/component/layout/DashboardLayout";
import ProtectedRoute from "@/pages/auth/ProtectedRoute";


function App() {

  return (
    <ThemeProvider defaultTheme="light" storageKey="dlks-ui-theme">
      <AuthContextProvider>
        <Router>
          <Routes>

            {/* Public Routes */}
            {publicRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={route.element}
              />
            ))}

            {/* Private Routes */}
            {privateRoutes.map((route) => (
              <Route
                key={route.path}
                path={route.path}
                element={
                  <ProtectedRoute>
                    <DashboardLayout>
                      {route.element}
                    </DashboardLayout>
                  </ProtectedRoute>
                }
              />
            ))}

            {/* Unknown Routes - 404 */}
            <Route path="*" element={<div>Page Not Found</div>} />
          </Routes>
        </Router>
      </AuthContextProvider>
    </ThemeProvider>
  )
}

export default App
