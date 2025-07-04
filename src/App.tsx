import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthContextProvider } from "@/context/AuthContext";
import { ThemeProvider } from "@/context/ThemeContext";
import { ErrorBoundary } from "@/components/ui/error-boundary";
import { Toaster } from "@/components/ui/sonner";
import Index from "./pages/Index";

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="system" storageKey="dlks-ui-theme">
        <AuthContextProvider>
          <Router>
            <Routes>
              <Route path="/*" element={<Index />} />
            </Routes>
            <Toaster />
          </Router>
        </AuthContextProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
