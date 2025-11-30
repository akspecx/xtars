import { useCallback, useEffect, useRef } from 'react';
import { useSettings } from '../contexts/SettingsContext';

interface UseGameModuleOptions {
  onMount?: () => void;
  onUnmount?: () => void;
  enableKeyboardNav?: boolean;
}

/**
 * Custom hook for consistent game module behavior
 * Provides speech, sound effects, and accessibility features
 */
export const useGameModule = (options: UseGameModuleOptions = {}) => {
  const { speak, stopSpeech, isSoundEnabled, volume, isDarkMode, isHighContrastMode, fontSize } = useSettings();
  const { onMount, onUnmount, enableKeyboardNav = true } = options;
  
  const audioContextRef = useRef<AudioContext | null>(null);

  // Initialize on mount
  useEffect(() => {
    if (onMount) {
      onMount();
    }

    // Initialize Audio Context for sound effects
    if (typeof window !== 'undefined' && 'AudioContext' in window) {
      audioContextRef.current = new AudioContext();
    }

    return () => {
      if (onUnmount) {
        onUnmount();
      }
      // Clean up audio context
      if (audioContextRef.current) {
        audioContextRef.current.close();
      }
    };
  }, [onMount, onUnmount]);

  // Keyboard navigation setup
  useEffect(() => {
    if (!enableKeyboardNav) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      // Tab navigation
      if (e.key === 'Tab') {
        // Let default behavior handle tab navigation
        return;
      }

      // Enter/Space for activation
      if (e.key === 'Enter' || e.key === ' ') {
        const activeElement = document.activeElement as HTMLElement;
        if (activeElement && activeElement.click) {
          e.preventDefault();
          activeElement.click();
        }
      }

      // Escape to close modals/dialogs
      if (e.key === 'Escape') {
        const closeButtons = document.querySelectorAll('[aria-label*="Close"], [aria-label*="Back"]');
        if (closeButtons.length > 0) {
          (closeButtons[0] as HTMLElement).click();
        }
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [enableKeyboardNav]);

  /**
   * Play a sound effect
   */
  const playSound = useCallback((frequency: number = 440, duration: number = 0.1, type: OscillatorType = 'sine') => {
    if (!isSoundEnabled || !audioContextRef.current) return;

    try {
      const oscillator = audioContextRef.current.createOscillator();
      const gainNode = audioContextRef.current.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContextRef.current.destination);

      oscillator.frequency.value = frequency;
      oscillator.type = type;
      gainNode.gain.value = volume * 0.3; // Scale down for sound effects

      oscillator.start(audioContextRef.current.currentTime);
      oscillator.stop(audioContextRef.current.currentTime + duration);
    } catch (error) {
      console.warn('Error playing sound:', error);
    }
  }, [isSoundEnabled, volume]);

  /**
   * Play success sound
   */
  const playSuccessSound = useCallback(() => {
    playSound(523.25, 0.1); // C5
    setTimeout(() => playSound(659.25, 0.1), 100); // E5
    setTimeout(() => playSound(783.99, 0.2), 200); // G5
  }, [playSound]);

  /**
   * Play error sound
   */
  const playErrorSound = useCallback(() => {
    playSound(200, 0.15, 'square');
  }, [playSound]);

  /**
   * Play click sound
   */
  const playClickSound = useCallback(() => {
    playSound(800, 0.05);
  }, [playSound]);

  /**
   * Play celebration sound
   */
  const playCelebrationSound = useCallback(() => {
    const notes = [523.25, 587.33, 659.25, 783.99, 880.00, 1046.50]; // C-D-E-G-A-C
    notes.forEach((note, i) => {
      setTimeout(() => playSound(note, 0.15), i * 80);
    });
  }, [playSound]);

  /**
   * Announce message for screen readers
   */
  const announce = useCallback((message: string, priority: 'polite' | 'assertive' = 'polite') => {
    const announcement = document.createElement('div');
    announcement.setAttribute('role', 'status');
    announcement.setAttribute('aria-live', priority);
    announcement.setAttribute('aria-atomic', 'true');
    announcement.className = 'sr-only'; // Screen reader only
    announcement.textContent = message;
    
    document.body.appendChild(announcement);
    
    // Remove after announcement
    setTimeout(() => {
      document.body.removeChild(announcement);
    }, 1000);
  }, []);

  /**
   * Get theme classes based on settings
   */
  const getThemeClasses = useCallback(() => {
    const classes: string[] = [];
    
    if (isDarkMode) {
      classes.push('dark');
    }
    
    if (isHighContrastMode) {
      classes.push('high-contrast');
    }
    
    switch (fontSize) {
      case 'small':
        classes.push('text-sm');
        break;
      case 'large':
        classes.push('text-lg');
        break;
      default:
        classes.push('text-base');
    }
    
    return classes.join(' ');
  }, [isDarkMode, isHighContrastMode, fontSize]);

  /**
   * Handle drag and drop with touch support
   */
  const createDragHandlers = useCallback(<T,>(
    item: T,
    onDragStart?: (item: T) => void,
    onDragEnd?: (item: T) => void
  ) => {
    return {
      draggable: true,
      onDragStart: (e: React.DragEvent) => {
        e.dataTransfer.effectAllowed = 'move';
        if (onDragStart) onDragStart(item);
        playClickSound();
      },
      onDragEnd: () => {
        if (onDragEnd) onDragEnd(item);
      },
      onTouchStart: (e: React.TouchEvent) => {
        if (onDragStart) onDragStart(item);
        playClickSound();
        e.preventDefault();
      },
      onTouchEnd: (e: React.TouchEvent) => {
        if (onDragEnd) onDragEnd(item);
        e.preventDefault();
      }
    };
  }, [playClickSound]);

  /**
   * Handle drop zone with touch support
   */
  const createDropHandlers = useCallback(<T,>(
    onDrop: (item: T) => void
  ) => {
    return {
      onDragOver: (e: React.DragEvent) => {
        e.preventDefault();
      },
      onDrop: (e: React.DragEvent) => {
        e.preventDefault();
        // Note: Actual item data needs to be passed through state management
      },
      onTouchEnd: (e: React.TouchEvent) => {
        // Note: Touch drop handling needs to be implemented with state
        e.preventDefault();
      }
    };
  }, []);

  return {
    // Settings
    isDarkMode,
    isHighContrastMode,
    fontSize,
    volume,
    
    // Speech
    speak,
    stopSpeech,
    
    // Sound effects
    playSound,
    playSuccessSound,
    playErrorSound,
    playClickSound,
    playCelebrationSound,
    
    // Accessibility
    announce,
    getThemeClasses,
    
    // Interaction helpers
    createDragHandlers,
    createDropHandlers
  };
};

