import { createContext, useEffect, useState, useContext } from "react";
import type { ReactNode } from "react";
import { supabase } from "@/integration/supabase/client";
import { ActivityLogService } from "@/services/activityLogService";
import { AuthService } from "@/services/authService";
import type { Session } from "@supabase/supabase-js";
import type { Profile } from "@/types/database";

interface AuthContextType {
  session: Session | null;
  user: Profile | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  // signUpNewUser: (
  //   email: string,
  //   password: string
  // ) => Promise<{ success: boolean; data?: any; error?: string }>;
  signInUser: (
    email: string,
    password: string
  ) => Promise<{ success: boolean; data?: any; error?: string }>;
  signOut: () => Promise<void>;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {
  const [session, setSession] = useState<Session | null>(null);
  const [user, setUser] = useState<Profile | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Input validation helper
  const validateCredentials = (email: string, password: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    
    if (!email || !password) {
      return { isValid: false, error: "Email and password are required" };
    }
    
    if (!emailRegex.test(email)) {
      return { isValid: false, error: "Please enter a valid email address" };
    }
    
    if (password.length < 6) {
      return { isValid: false, error: "Password must be at least 6 characters long" };
    }
    
    return { isValid: true };
  };

  //Sign In
  const signInUser = async (email: string, password: string) => {
    try {
      // Validate input
      const validation = validateCredentials(email, password);
      if (!validation.isValid) {
        return { success: false, error: validation.error };
      }

      const { data, error } = await supabase.auth.signInWithPassword({
        email: email.trim().toLowerCase(),
        password: password,
      });

      if (error) {
        // Don't expose detailed error messages for security
        const userFriendlyError = error.message.includes('Invalid login credentials')
          ? 'Invalid email or password'
          : 'Unable to sign in. Please try again.';
        
        console.error("Authentication failed"); // Don't log sensitive details
        return { success: false, error: userFriendlyError };
      }

      // Check if user is active before proceeding
      if (data.user) {
        const isActive = await AuthService.isUserActive(data.user.id);
        if (!isActive) {
          await supabase.auth.signOut();
          return { success: false, error: "Account is deactivated. Please contact administrator." };
        }

        // // Update login timestamp immediately
        // // Profile will be fetched by onAuthStateChange handler
        // AuthService.updateLoginTimestamp(data.user.id).catch(error => {
        //   console.warn("Failed to update login timestamp:", error);
        // });
      }

      return { success: true, data };
    } catch (error) {
      console.error("Unexpected error during authentication");
      return {
        success: false,
        error: "An unexpected error occurred. Please try again.",
      };
    }
  };

  useEffect(() => {
    let isMounted = true;

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return;

      console.log('Auth state change event:', event);

      // Handle token expiry events
      if (event === 'TOKEN_REFRESHED') {
        console.log('⚠️ Token refreshed automatically (this should not happen with autoRefreshToken: false)');
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out (could be due to token expiry)');
      } else if (event === 'INITIAL_SESSION') {
        console.log('Initial session loaded from storage');
      } else if (event === 'SIGNED_IN') {
        console.log('User signed in');
      }

      setSession(session);
      setIsAuthenticated(!!session);
      
      // Fetch profile when user signs in or session changes
      if (session?.user) {
        // Fetch profile from dlks_profile table
        AuthService.getUserProfile(session.user.id)
          .then(userProfile => {
            if (isMounted) {
              setUser(userProfile);
            }
          })
          .catch(error => {
            console.error("Error fetching user profile:", error);
            if (isMounted) {
              setUser(null);
            }
          });
      } else {
        setUser(null);
      }
      
      if (isMounted) {
        setIsLoading(false);
      }

      // // Log session events
      // if (event === "SIGNED_IN" && session?.user) {
      //   try {
      //     await ActivityLogService.logUserLogin(
      //       session.user.id,
      //       undefined, // Let the service determine the IP
      //       navigator.userAgent
      //     );
      //   } catch (logError) {
      //     console.warn("Failed to log session login:", logError);
      //   }
      // } else if (event === "SIGNED_OUT") {
      //   // Logout logging is handled in signOut function
      // }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  //Sign out
  const signOut = async () => {
    const currentUser = user;

    const { error } = await supabase.auth.signOut();
    if (error) {
      console.error("Error signing out:", error.message);
    } else {
      // Log logout before clearing session
      // if (currentUser) {
      //   try {
      //     await ActivityLogService.logUserLogout(
      //       currentUser.id,
      //       window.location.hostname,
      //       navigator.userAgent
      //     );
      //   } catch (logError) {
      //     console.warn("Failed to log user logout:", logError);
      //   }
      // }

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
        // signUpNewUser,
        signInUser,
        signOut,
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
