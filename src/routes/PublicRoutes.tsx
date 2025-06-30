import { Route } from "react-router-dom";
import SignUp from '@/pages/auth/SignUp';
import SignIn from '@/pages/auth/SignIn';

export const publicRoutes = [
  <Route key="signup" path="/signup" element={<SignUp />} />,
  <Route key="signin" path="/signin" element={<SignIn />} />,
  // Add more public routes here as needed
];

export default publicRoutes;
