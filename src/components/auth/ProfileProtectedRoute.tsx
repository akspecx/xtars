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

  // If navigating directly from profile selection, trust it and render immediately
  // (React state may not have propagated yet at this point)
  // Also check localStorage as robust fallback (handles navigation back from modules)
  const storedProfile = (() => {
    try { return JSON.parse(localStorage.getItem('xtars_active_profile') || 'null'); }
    catch { return null; }
  })();

  const fromProfileSelection = location.state?.fromProfileSelection === true;
  if (fromProfileSelection || activeProfile || storedProfile) {
    // Profile exists — fall through to type-based routing below
  } else if (!hasSelectedSessionProfile && !isProfileSelectionPath) {
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

  // No active profile — force profile selection
  return <Navigate to="/profiles" replace />;
};
