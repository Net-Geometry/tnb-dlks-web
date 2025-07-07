import { createContext, useEffect, useState, useContext } from "react";
import type { ReactNode } from "react";
import { supabase } from "@/integration/supabase/client";
import { ActivityLogService } from "@/services/activityLogService";
import type { Session, User } from "@supabase/supabase-js";

interface AuthContextType {
  session: Session | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  signUpNewUser: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; data?: any; error?: string }>;
  signInUser: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; data?: any; error?: string }>;
  signOut: () => Promise<void>;
  login: (email: string, password: string) => Promise<boolean>;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  //Sign Up
  const signUpNewUser = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email: email,
      password: password,
    });

    if (error) {
      console.error("Error signing up:", error.message);
      return { success: false, error: error.message };
    }
    return { success: true, data };
  };

  //Sign In
  const signInUser = async (email: string, password: string) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: email,
        password: password,
      });

      if (error) {
        console.error("Error signing in:", error.message);
        return { success: false, error: error.message };
      }

      // Log successful login
      if (data.user) {
        try {
          await ActivityLogService.logUserLogin(
            data.user.id,
            undefined, // Let the service determine the IP
            navigator.userAgent
          );
        } catch (logError) {
          console.warn("Failed to log user login:", logError);
        }
      }

      console.log("Sign in successful:", data);
      return { success: true, data };
    } catch (error) {
      console.error("Unexpected error during sign in:", error);
      return {
        success: false,
        error: "An unexpected error occurred during sign in",
      };
    }
  };

  // Login function for compatibility
  const login = async (email: string, password: string): Promise<boolean> => {
    const result = await signInUser(email, password);
    return result.success;
  };

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      setIsLoading(false);
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      setSession(session);
      setUser(session?.user ?? null);
      setIsAuthenticated(!!session);
      setIsLoading(false);

      // Log session events
      if (event === "SIGNED_IN" && session?.user) {
        try {
          await ActivityLogService.logUserLogin(
            session.user.id,
            undefined, // Let the service determine the IP
            navigator.userAgent
          );
        } catch (logError) {
          console.warn("Failed to log session login:", logError);
        }
      } else if (event === "SIGNED_OUT") {
        // Logout logging is handled in signOut function
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  //Sign out
  const signOut = async () => {
    const currentUser = user;

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      // Log logout before clearing session
      if (currentUser) {
        try {
          await ActivityLogService.logUserLogout(
            currentUser.id,
            window.location.hostname,
            navigator.userAgent
          );
        } catch (logError) {
          console.warn("Failed to log user logout:", logError);
        }
      }

      setSession(null);
      setUser(null);
      setIsAuthenticated(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        session,
        user,
        isAuthenticated,
        isLoading,
        signUpNewUser,
        signInUser,
        signOut,
        login,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthContextProvider");
  }
  return context;
};

// Keep the old export for backward compatibility
export const UserAuth = useAuth;
