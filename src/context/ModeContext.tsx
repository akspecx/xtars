import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type ChildProfile = {
  name: string;
  age: number;
  avatar: string;
  interests: string[];
};

type ModeContextType = {
  isParentMode: boolean;
  toggleMode: (path?: string) => void;
  showParentalGate: boolean;
  openParentalGate: () => void;
  closeParentalGate: () => void;
  childProfile: ChildProfile;
  updateProfile: (profile: Partial<ChildProfile>) => void;
  lastProfilePath: string | null;
};

const DEFAULT_PROFILE: ChildProfile = {
  name: "Little Explorer",
  age: 4,
  avatar: "🎨",
  interests: ["Shapes", "Colors", "Animals"]
};

const ModeContext = createContext<ModeContextType | undefined>(undefined);

export const useMode = () => {
  const context = useContext(ModeContext);
  if (!context) {
    throw new Error('useMode must be used within a ModeProvider');
  }
  return context;
};

type ModeProviderProps = {
  children: ReactNode;
};

export const ModeProvider: React.FC<ModeProviderProps> = ({ children }) => {
  // Persistence for Mode
  const [isParentMode, setIsParentMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('xtars_is_parent_mode');
    return saved ? JSON.parse(saved) : false;
  });

  // Persistence for Profile
  const [childProfile, setChildProfile] = useState<ChildProfile>(() => {
    const saved = localStorage.getItem('xtars_child_profile');
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const [showParentalGate, setShowParentalGate] = useState(false);
  const [lastProfilePath, setLastProfilePath] = useState<string | null>(null);

  useEffect(() => {
    localStorage.setItem('xtars_is_parent_mode', JSON.stringify(isParentMode));
  }, [isParentMode]);

  useEffect(() => {
    localStorage.setItem('xtars_child_profile', JSON.stringify(childProfile));
  }, [childProfile]);

  const toggleMode = (path?: string) => {
    if (path) setLastProfilePath(path);
    setIsParentMode(prevMode => !prevMode);
  };

  const openParentalGate = () => {
    setShowParentalGate(true);
  };

  const closeParentalGate = () => {
    setShowParentalGate(false);
  };

  const updateProfile = (updates: Partial<ChildProfile>) => {
    setChildProfile(prev => ({ ...prev, ...updates }));
  };

  return (
    <ModeContext.Provider value={{ 
      isParentMode, 
      toggleMode, 
      showParentalGate, 
      openParentalGate, 
      closeParentalGate,
      childProfile,
      updateProfile,
      lastProfilePath
    }}>
      {children}
    </ModeContext.Provider>
  );
};
