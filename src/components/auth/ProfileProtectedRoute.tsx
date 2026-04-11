import React from 'react';
import { Navigate, useLocation } from 'react-router';
import { useProfile } from '../../context/ProfileContext';
import { useMode } from '../../context/ModeContext';

export const ProfileProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { activeProfile, hasSelectedSessionProfile } = useProfile();
  const { isParentMode } = useMode();
  const location = useLocation();

  const isProfileSelectionPath = location.pathname.startsWith('/profiles') || 
                                location.pathname.startsWith('/select-profile');

  const fromProfileSelection = location.state?.fromProfileSelection === true;

  // On every fresh app session (hasSelectedSessionProfile=false in memory),
  // always redirect to profile selection — even if localStorage has a stored profile.
  // This ensures profile selection is shown on each new session start.
  if (!hasSelectedSessionProfile && !fromProfileSelection && !isProfileSelectionPath) {
    return <Navigate to="/profiles" replace />;
  }

  const isKidsZonePath = location.pathname.startsWith('/games');
  const isParentPath = location.pathname.startsWith('/parent');
  const isAuthPath = location.pathname.startsWith('/profiles') || 
                     location.pathname.startsWith('/auth') || 
                     location.pathname.startsWith('/signin');

  if (!activeProfile) return <Navigate to="/profiles" replace />;

  if (activeProfile.type === 'KIDS' && isParentMode && isParentPath) {
    return <>{children}</>;
  }

  if (activeProfile.type === 'KIDS' && !isKidsZonePath && !isAuthPath && !isParentPath) {
    return <Navigate to="/games" replace />;
  }

  if (activeProfile.type !== 'KIDS' && isKidsZonePath) {
    return <Navigate to="/" replace />;
  }

  // All checks passed — render the route
  return <>{children}</>;
};
