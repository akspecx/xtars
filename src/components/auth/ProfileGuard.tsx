import React from 'react';
import { useProfile, ProfileType } from '../../context/ProfileContext';

interface ProfileGuardProps {
  allowedProfiles: ProfileType[];
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

const ProfileGuard: React.FC<ProfileGuardProps> = ({ 
  allowedProfiles, 
  children, 
  fallback = null 
}) => {
  const { activeProfile } = useProfile();

  // If no profile is active, or the active profile type is not in the allowed list, render fallback.
  if (!activeProfile || !allowedProfiles.includes(activeProfile.type)) {
    return <>{fallback}</>;
  }

  // Otherwise, render the children
  return <>{children}</>;
};

export default ProfileGuard;
