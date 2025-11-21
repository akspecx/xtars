import React from "react";
import { useAuth } from "../../context/AuthContext";

interface GoogleSignInButtonProps {
  text?: string;
  className?: string;
}

const GoogleSignInButton: React.FC<GoogleSignInButtonProps> = ({
  text = "Sign in with Google",
  className = "",
}) => {
  const { signInWithGoogle } = useAuth();

  const handleSignIn = async () => {
    try {
      await signInWithGoogle();
    } catch (error) {
      // Optionally handle error
      console.error("Google Sign-In failed:", error);
    }
  };

  return (
    <button
      type="button"
      onClick={handleSignIn}
      className={`flex items-center justify-center gap-3 w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm bg-white text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${className}`}
    >
      <svg
        className="w-5 h-5"
        viewBox="0 0 48 48"
        xmlns="http://www.w3.org/2000/svg"
      >
        <g>
          <path
            fill="#4285F4"
            d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"
          />
          <path
            fill="#34A853"
            d="M46.98 24.55c0-1.64-.15-3.22-.43-4.74H24v9.01h12.86c-.56 3.02-2.23 5.57-4.76 7.29l7.35 5.72C44.98 37.53 46.98 31.54 46.98 24.55z"
          />
          <path
            fill="#FBBC05"
            d="M9.54 28.41a14.5 14.5 0 0 1 0-8.82l-7.98-6.19A24.01 24.01 0 0 0 0 24c0 3.77.9 7.34 2.56 10.6l7.98-6.19z"
          />
          <path
            fill="#EA4335"
            d="M24 48c6.47 0 11.93-2.14 15.9-5.82l-7.35-5.72c-2.04 1.37-4.66 2.18-8.55 2.18-6.26 0-11.57-4.22-13.46-10.09l-7.98 6.19C6.51 42.62 14.62 48 24 48z"
          />
          <path fill="none" d="M0 0h48v48H0z" />
        </g>
      </svg>
      <span>{text}</span>
    </button>
  );
};

export default GoogleSignInButton;
