import { createContext, useEffect, useState, useContext } from "react";
import type { ReactNode } from "react";
import { supabase } from "@/integration/supabase/client";

interface AuthContextType {
    session: any;
    signUpNewUser: (email: string, password: string) => Promise<{ success: boolean; data?: any; error?: string }>;
    signInUser: (email: string, password: string) => Promise<{ success: boolean; data?: any; error?: string }>;
    signOut: () => Promise<void>;
}

interface AuthContextProviderProps {
    children: ReactNode;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthContextProvider = ({ children }: AuthContextProviderProps) => {

    const [session, setSession] = useState<any>(undefined)

    //Sign Up 
    const signUpNewUser = async (email:string,password:string ) => {
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
            const { data,error } = await supabase.auth.signInWithPassword({
                email: email,
                password: password,
            });

            if (error) {
                console.error("Error signing in:", error.message);
                return { success: false, error: error.message };
            }
            console.log("Sign in successful:", data);
            return { success: true, data };
        } catch (error) {
            console.error("Unexpected error during sign in:", error);
            return { success: false, error: "An unexpected error occurred during sign in" };
        }
    };

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session);
        });

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session);
        });
    }, []);

    //Sign out
    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Error signing out:", error.message);
        } else {
            setSession(null);
        }
    };

    return (
        <AuthContext.Provider value={{ session, signUpNewUser,signInUser, signOut }}>
            {children}
        </AuthContext.Provider>
    )
}

export const UserAuth = (): AuthContextType => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthContextProvider");
    }
    return context;
}