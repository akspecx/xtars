import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface SettingsContextType {
  // Dark Mode
  isDarkMode: boolean;
  toggleDarkMode: () => void;
  
  // Audio Settings
  isSoundEnabled: boolean;
  toggleSound: () => void;
  isMusicEnabled: boolean;
  toggleMusic: () => void;
  volume: number;
  setVolume: (volume: number) => void;
  
  // Speech Synthesis
  isSpeechEnabled: boolean;
  toggleSpeech: () => void;
  speechRate: number;
  setSpeechRate: (rate: number) => void;
  speechPitch: number;
  setSpeechPitch: (pitch: number) => void;
  
  // Accessibility
  isHighContrastMode: boolean;
  toggleHighContrast: () => void;
  fontSize: 'small' | 'medium' | 'large';
  setFontSize: (size: 'small' | 'medium' | 'large') => void;
  
  // Helper functions for speech
  speak: (text: string) => void;
  stopSpeech: () => void;
}

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (!context) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};

interface SettingsProviderProps {
  children: React.ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {

  // Load settings from localStorage or use defaults
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) return saved === 'true';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  const [isSoundEnabled, setIsSoundEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('soundEnabled');
    return saved !== null ? saved === 'true' : true;
  });

  const [isMusicEnabled, setIsMusicEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('musicEnabled');
    return saved !== null ? saved === 'true' : true;
  });

  const [volume, setVolumeState] = useState<number>(() => {
    const saved = localStorage.getItem('volume');
    return saved !== null ? parseFloat(saved) : 0.8;
  });

  const [isSpeechEnabled, setIsSpeechEnabled] = useState<boolean>(() => {
    const saved = localStorage.getItem('speechEnabled');
    return saved !== null ? saved === 'true' : true;
  });

  const [speechRate, setSpeechRateState] = useState<number>(() => {
    const saved = localStorage.getItem('speechRate');
    return saved !== null ? parseFloat(saved) : 0.85;
  });

  const [speechPitch, setSpeechPitchState] = useState<number>(() => {
    const saved = localStorage.getItem('speechPitch');
    return saved !== null ? parseFloat(saved) : 1.2;
  });

  const [isHighContrastMode, setIsHighContrastMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('highContrastMode');
    return saved !== null ? saved === 'true' : false;
  });

  const [fontSize, setFontSizeState] = useState<'small' | 'medium' | 'large'>(() => {
    const saved = localStorage.getItem('fontSize');
    return (saved as 'small' | 'medium' | 'large') || 'medium';
  });

  // Apply dark mode to document
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('darkMode', isDarkMode.toString());
  }, [isDarkMode]);

  // Save settings to localStorage
  useEffect(() => {
    localStorage.setItem('soundEnabled', isSoundEnabled.toString());
  }, [isSoundEnabled]);

  useEffect(() => {
    localStorage.setItem('musicEnabled', isMusicEnabled.toString());
  }, [isMusicEnabled]);

  useEffect(() => {
    localStorage.setItem('volume', volume.toString());
  }, [volume]);

  useEffect(() => {
    localStorage.setItem('speechEnabled', isSpeechEnabled.toString());
  }, [isSpeechEnabled]);

  useEffect(() => {
    localStorage.setItem('speechRate', speechRate.toString());
  }, [speechRate]);

  useEffect(() => {
    localStorage.setItem('speechPitch', speechPitch.toString());
  }, [speechPitch]);

  useEffect(() => {
    localStorage.setItem('highContrastMode', isHighContrastMode.toString());
  }, [isHighContrastMode]);

  useEffect(() => {
    localStorage.setItem('fontSize', fontSize);
  }, [fontSize]);

  // Apply high contrast class to document
  useEffect(() => {
    const root = document.documentElement;
    if (isHighContrastMode) {
      root.classList.add('high-contrast');
    } else {
      root.classList.remove('high-contrast');
    }
  }, [isHighContrastMode]);

  // Apply font size classes to document
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('font-size-small', 'font-size-medium', 'font-size-large');
    root.classList.add(`font-size-${fontSize}`);
  }, [fontSize]);

  // Toggle functions
  const toggleDarkMode = useCallback(() => {
    setIsDarkMode(prev => !prev);
  }, []);

  const toggleSound = useCallback(() => {
    setIsSoundEnabled(prev => !prev);
  }, []);

  const toggleMusic = useCallback(() => {
    setIsMusicEnabled(prev => !prev);
  }, []);

  const toggleSpeech = useCallback(() => {
    setIsSpeechEnabled(prev => !prev);
    if (isSpeechEnabled) {
      // Cancel any ongoing speech when disabling
      if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
        window.speechSynthesis.cancel();
      }
    }
  }, [isSpeechEnabled]);

  const toggleHighContrast = useCallback(() => {
    setIsHighContrastMode(prev => !prev);
  }, []);

  const setVolume = useCallback((newVolume: number) => {
    setVolumeState(Math.max(0, Math.min(1, newVolume)));
  }, []);

  const setSpeechRate = useCallback((rate: number) => {
    setSpeechRateState(Math.max(0.1, Math.min(2, rate)));
  }, []);

  const setSpeechPitch = useCallback((pitch: number) => {
    setSpeechPitchState(Math.max(0, Math.min(2, pitch)));
  }, []);

  const setFontSize = useCallback((size: 'small' | 'medium' | 'large') => {
    setFontSizeState(size);
  }, []);

  // Speech synthesis helper
  const speak = useCallback((text: string) => {
    if (!isSpeechEnabled) return;
    
    if (
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      typeof SpeechSynthesisUtterance !== 'undefined'
    ) {
      window.speechSynthesis.cancel(); // Cancel any ongoing speech
      
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = speechRate;
      utterance.pitch = speechPitch;
      utterance.volume = volume;
      utterance.lang = 'en-US';
      
      window.speechSynthesis.speak(utterance);
    }
  }, [isSpeechEnabled, speechRate, speechPitch, volume]);

  const stopSpeech = useCallback(() => {
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
  }, []);

  const value: SettingsContextType = {
    isDarkMode,
    toggleDarkMode,
    isSoundEnabled,
    toggleSound,
    isMusicEnabled,
    toggleMusic,
    volume,
    setVolume,
    isSpeechEnabled,
    toggleSpeech,
    speechRate,
    setSpeechRate,
    speechPitch,
    setSpeechPitch,
    isHighContrastMode,
    toggleHighContrast,
    fontSize,
    setFontSize,
    speak,
    stopSpeech
  };

  return (
    <SettingsContext.Provider value={value}>
      {children}
    </SettingsContext.Provider>
  );
};

