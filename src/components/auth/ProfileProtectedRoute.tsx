import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useProfile } from '../../context/ProfileContext';
import { useMode } from '../../context/ModeContext';

export const ProfileProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeProfile, hasSelectedSessionProfile } = useProfile();
  const { isParentMode } = useMode();
  const location = useLocation();

  // Force profile selection screen on fresh session/reload (Restores user requirement)
  const isProfileSelectionPath = location.pathname.startsWith('/profiles') || 
                                location.pathname.startsWith('/select-profile');

  if (!hasSelectedSessionProfile && !isProfileSelectionPath) {
    return <Navigate to="/profiles" replace />;
  }

  // If no profile is selected at all, redirect to the profile selection screen
  if (!activeProfile && !isProfileSelectionPath) {
    return <Navigate to="/profiles" replace />;
  }

  // Define route types
  const isKidsZonePath = location.pathname.startsWith('/games');
  const isParentPath = location.pathname.startsWith('/parent');
  const isAuthPath = location.pathname.startsWith('/profiles') || 
                     location.pathname.startsWith('/auth') || 
                     location.pathname.startsWith('/signin');

  // If we reach here and activeProfile is null (TS check), something is wrong, redirect to /profiles
  if (!activeProfile) return <Navigate to="/profiles" replace />;

  // KIDS profile restriction bypass (Parent Mode)
  if (activeProfile.type === 'KIDS' && isParentMode && isParentPath) {
    return <>{children}</>;
  }

  // KIDS can only access Kids Zone (/games), Auth, and Parent Mode (if active)
  if (activeProfile.type === 'KIDS' && !isKidsZonePath && !isAuthPath && !isParentPath) {
    return <Navigate to="/games" replace />;
  }

  // STUDENTS and ASPIRANTS cannot access Kids Zone (/games)
  if (activeProfile.type !== 'KIDS' && isKidsZonePath) {
    return <Navigate to="/" replace />;
  }

  // Render the actual layout if checks pass
  return <>{children}</>;
};
