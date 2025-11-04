import React, { createContext, useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router";

interface User {
  id: string;
  name: string;
  email: string;
  picture?: string;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  const isAuthenticated = !!user;

  useEffect(() => {
    // Check for existing session
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    
    // Initialize Google Sign-In
    const initializeGoogleSignIn = async () => {
      try {
        await new Promise((resolve) => {
          const script = document.createElement("script");
          script.src = "https://accounts.google.com/gsi/client";
          script.async = true;
          script.defer = true;
          script.onload = resolve;
          document.head.appendChild(script);
        });

        window.google?.accounts.id.initialize({
          client_id: "620050792705-qh4p80rr4rpq7iugoi1aj4jt6fmjv7bd.apps.googleusercontent.com",
          callback: handleGoogleResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
          use_fedcm_for_prompt: true, // Enable FedCM (newer API)
          itp_support: true, // Enable for Apple Intelligent Tracking Prevention
          context: "signin", // Use "signin" or "signup" based on your context
        });
        
        // Configure UI for the sign-in button (if you're using one-tap)
        window.google?.accounts.id.configure({
          prompt_parent_id: "g_id_onload", // ID of the div where one-tap UI will be displayed
        });
        
      } catch (error) {
        console.error("Failed to initialize Google Sign-In:", error);
      } finally {
        setIsLoading(false);
        
      }
    };

    initializeGoogleSignIn();
  }, []);

  const handleGoogleResponse = (response: any) => {
    console.log("Google Sign-In response:", response);
    try {
      const decoded = JSON.parse(atob(response.credential.split(".")[1]));
      const userData: User = {
        id: decoded.sub,
        name: decoded.name,
        email: decoded.email,
        picture: decoded.picture,
      };
      setUser(userData);
      localStorage.setItem("user", JSON.stringify(userData));
      navigate("/"); // Redirect to home page after successful sign-in
    } catch (error) {
      console.error("Failed to process Google response:", error);
    }
  };

  const signInWithGoogle = async (): Promise<void> => {
    return new Promise((resolve, reject) => {
      try {
        // Use the newer approach for displaying the sign-in UI
        if (window.google?.accounts.id) {
          // For button click
          window.google.accounts.id.prompt((notification: any) => {
            console.log("Google Sign-In notification:", notification);
            
            if (notification.isNotDisplayed()) {
              console.error("Google Sign-In prompt not displayed:", notification.getNotDisplayedReason());
              reject(new Error(`Google Sign-In prompt not displayed: ${notification.getNotDisplayedReason()}`));
            } else if (notification.isSkippedMoment()) {
              console.warn("Google Sign-In prompt skipped:", notification.getSkippedReason());
              reject(new Error(`Google Sign-In prompt skipped: ${notification.getSkippedReason()}`));
            } else if (notification.isDismissedMoment()) {
              console.warn("Google Sign-In prompt dismissed:", notification.getDismissedReason());
              reject(new Error(`Google Sign-In prompt dismissed: ${notification.getDismissedReason()}`));
            } else {
              resolve();
            }
          });
        } else {
          reject(new Error("Google Sign-In API not available"));
        }
      } catch (error) {
        console.error("Error during Google Sign-In:", error);
        reject(error);
      }
    });
  };

  const signOut = () => {
    setUser(null);
    localStorage.removeItem("user");
    window.google?.accounts.id.disableAutoSelect();
    navigate("/signin");
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    signInWithGoogle,
    signOut,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

declare global {
  interface Window {
    google?: any;
  }
}
