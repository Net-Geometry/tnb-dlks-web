import React, { useEffect } from 'react'
import { UserAuth } from '@/context/AuthContext'
import { useNavigate } from 'react-router-dom';

interface ProtectedRouteProps {
    children: React.ReactNode;
}

const LoadingSpinner = () => (
  <div className="flex items-center justify-center min-h-screen">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

const ProtectedRoute = ({children}:ProtectedRouteProps) => {
    const { session } = UserAuth()
    const navigate = useNavigate();

    useEffect(() => {
        if (session === null) {
            navigate("/signin", { replace: true });
        }
    }, [session, navigate]);

    // Show loading spinner while session is undefined (still checking auth state)
    if (session === undefined) {
        return <LoadingSpinner />;
    }

    // Show children if session exists, otherwise null (will redirect via useEffect)
    return session ? <>{children}</> : null;
}

export default ProtectedRoute