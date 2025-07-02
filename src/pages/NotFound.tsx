import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center space-y-8 p-8">
        {/* Large 404 */}
        <div className="space-y-4">
          <h1 className="text-9xl font-bold text-gray-800 dark:text-gray-200 tracking-tight">
            404
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Page not found
          </p>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 justify-center">
          <Button 
            onClick={() => navigate('/')}
            size="lg"
            className="bg-black hover:bg-gray-800 text-white dark:bg-white dark:text-black dark:hover:bg-gray-200"
          >
            <Home className="w-4 h-4 mr-2" />
            Home
          </Button>
          
          <Button 
            onClick={() => navigate(-1)}
            variant="outline"
            size="lg"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
