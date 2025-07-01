import Dashboard from '@/pages/Dashboard';
import { Navigate } from 'react-router-dom';

export const privateRoutes = [
  {
    path: "/",
    element: <Navigate to="/dashboard" replace />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
  },
  // Add more private routes here as your app grows
];

export default privateRoutes;
