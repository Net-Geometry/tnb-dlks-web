import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthContextProvider } from "@/context/AuthContext";
import { publicRoutes } from "@/routes/PublicRoutes";
import { privateRoutes } from "@/routes/PrivateRoutes";

function App() {

  return (
    <AuthContextProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          {publicRoutes}

          {/* Private Routes */}
          {privateRoutes}

          {/* Default Route */}
          <Route
            path="/"
            element={<Navigate to="/dashboard" replace />}
          />

          {/* Unknown Routes - 404 */}
          <Route path="*" element={<div>Page Not Found</div>} />
        </Routes>
      </Router>
    </AuthContextProvider>
  )
}

export default App
