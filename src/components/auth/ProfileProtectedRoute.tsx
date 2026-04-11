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

  const isKidsZonePath = location.pathname.startsWith('/games');
  const isParentPath = location.pathname.startsWith('/parent');
  const isAuthPath = location.pathname.startsWith('/profiles') || 
                     location.pathname.startsWith('/auth') || 
                     location.pathname.startsWith('/signin');

  // Allow if activeProfile already matches the route type —
  // this handles in-app navigation (back buttons inside modules) without
  // forcing the user back to profile selection mid-session.
  const profileMatchesRoute =
    (activeProfile?.type === 'KIDS' && isKidsZonePath) ||
    (activeProfile && activeProfile.type !== 'KIDS' && !isKidsZonePath);

  // On every fresh app session (hasSelectedSessionProfile=false in memory),
  // redirect to profile selection — UNLESS the profile already matches the route
  // (so navigating back from a game module still works).
  if (!hasSelectedSessionProfile && !fromProfileSelection && !isProfileSelectionPath && !profileMatchesRoute) {
    return <Navigate to="/profiles" replace />;
  }

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

