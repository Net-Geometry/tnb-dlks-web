import SignUp from '@/pages/auth/SignUp';
import SignIn from '@/pages/auth/SignIn';

export const publicRoutes = [
  {
    path: "/signup",
    element: <SignUp />,
  },
  {
    path: "/signin", 
    element: <SignIn />,
  },
  // Add more public routes here as needed
];

export default publicRoutes;
