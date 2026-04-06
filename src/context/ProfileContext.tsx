import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export type ProfileType = 'KIDS' | 'STUDENTS' | 'ASPIRANTS';

export interface UserProfile {
  id: string;
  type: ProfileType;
  name: string;
  avatar: string;
  subtitle: string;
}

export const DEFAULT_PROFILES: UserProfile[] = [
  {
    id: 'profile-1',
    type: 'KIDS',
    name: 'Kids',
    subtitle: '3-6 Years',
    avatar: 'bird'
  }
];

// All available avatar options (shared across profile creation & account settings)
export const AVATAR_OPTIONS = [
  { id: 'bird',  label: 'Bird'   },
  { id: '🧒',   label: 'Kid'    },
  { id: '👦',   label: 'Boy'    },
  { id: '👧',   label: 'Girl'   },
  { id: '🦊',   label: 'Fox'    },
  { id: '🐱',   label: 'Cat'    },
  { id: '🐶',   label: 'Dog'    },
  { id: '🐸',   label: 'Frog'   },
  { id: '🦁',   label: 'Lion'   },
  { id: '🐼',   label: 'Panda'  },
  { id: '🦄',   label: 'Unicorn'},
  { id: '🐯',   label: 'Tiger'  },
];

interface ProfileContextType {
  activeProfile: UserProfile | null;
  selectProfile: (profileId: string) => void;
  selectAndSyncProfile: (profileId: string, avatarFromServer?: string) => void;
  clearProfile: () => void;
  addProfile: (name: string, type: ProfileType, activate?: boolean, avatar?: string) => void;
  updateAvatar: (profileId: string, avatar: string) => void;
  removeProfile: (profileId: string) => void;
  availableProfiles: UserProfile[];
  hasSelectedSessionProfile: boolean;
  setHasSelectedSessionProfile: (val: boolean) => void;
}

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};

export const ProfileProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [availableProfiles, setAvailableProfiles] = useState<UserProfile[]>(() => {
    const saved = localStorage.getItem('xtars_available_profiles');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return DEFAULT_PROFILES;
      }
    }
    return DEFAULT_PROFILES;
  });

  const [activeProfile, setActiveProfile] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('xtars_active_profile');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Ensure the saved profile still exists in available profiles
        return availableProfiles.find(p => p.id === parsed.id) || null;
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  // Track if a profile has been selected in THIS session (resets on refresh)
  const [hasSelectedSessionProfile, setHasSelectedSessionProfile] = useState(false);

  useEffect(() => {
    localStorage.setItem('xtars_available_profiles', JSON.stringify(availableProfiles));
  }, [availableProfiles]);

  useEffect(() => {
    if (activeProfile) {
      localStorage.setItem('xtars_active_profile', JSON.stringify(activeProfile));
    } else {
      localStorage.removeItem('xtars_active_profile');
    }
  }, [activeProfile]);

  const selectProfile = (profileId: string) => {
    const profile = availableProfiles.find(p => p.id === profileId);
    if (profile) {
      setActiveProfile(profile);
      setHasSelectedSessionProfile(true);
    }
  };

  // Atomically syncs server avatar + activates profile.
  // avatarFromServer is only applied when it is a real custom avatar (not 'bird'/empty),
  // so locally-chosen avatars are never overwritten by the server default.
  const selectAndSyncProfile = (profileId: string, avatarFromServer?: string) => {
    const realAvatar = avatarFromServer && avatarFromServer !== 'bird' ? avatarFromServer : undefined;
    const updatedProfiles = realAvatar
      ? availableProfiles.map(p => p.id === profileId ? { ...p, avatar: realAvatar } : p)
      : availableProfiles;
    setAvailableProfiles(updatedProfiles);
    const profile = updatedProfiles.find(p => p.id === profileId);
    if (profile) setActiveProfile(profile);
    setHasSelectedSessionProfile(true);
  };

  const clearProfile = () => {
    setActiveProfile(null);
  };

  const addProfile = (name: string, type: ProfileType, activate = false, avatarOverride?: string) => {
    if (availableProfiles.length >= 3) return;

    const defaultAvatars: Record<ProfileType, string> = {
      'KIDS': 'bird',
      'STUDENTS': '🎓',
      'ASPIRANTS': '🚀'
    };

    const subtitles: Record<ProfileType, string> = {
      'KIDS': '3-6 Years',
      'STUDENTS': '7-17 Years',
      'ASPIRANTS': 'Completed Schooling'
    };

    const newProfile: UserProfile = {
      id: `profile-${Date.now()}`,
      type,
      name,
      avatar: avatarOverride ?? defaultAvatars[type],
      subtitle: subtitles[type]
    };

    setAvailableProfiles(prev => [...prev, newProfile]);
    if (activate) {
      setActiveProfile(newProfile);
      setHasSelectedSessionProfile(true);
    }
  };

  const updateAvatar = (profileId: string, avatar: string) => {
    setAvailableProfiles(prev =>
      prev.map(p => p.id === profileId ? { ...p, avatar } : p)
    );
    setActiveProfile(prev =>
      prev?.id === profileId ? { ...prev, avatar } : prev
    );
  };

  const removeProfile = (profileId: string) => {
    setAvailableProfiles(prev => prev.filter(p => p.id !== profileId));
  };

  return (
    <ProfileContext.Provider value={{
      activeProfile,
      selectProfile,
      selectAndSyncProfile,
      clearProfile,
      addProfile,
      updateAvatar,
      removeProfile,
      availableProfiles,
      hasSelectedSessionProfile,
      setHasSelectedSessionProfile
    }}>
      {children}
    </ProfileContext.Provider>
  );
};
