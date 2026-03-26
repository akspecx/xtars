import React, { useState } from "react";
import { Settings, Volume2, VolumeX, Mic, MicOff, Type, Contrast, Sun, Moon } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";

const SettingsDropdown: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
    isSoundEnabled,
    toggleSound,
    isSpeechEnabled,
    toggleSpeech,
    isHighContrastMode,
    toggleHighContrast,
    fontSize,
    setFontSize,
    isDarkMode,
    toggleTheme,
  } = useSettings();

  // Map font size string to slider value (0,1,2)
  const fontSizeValue = fontSize === "small" ? 0 : fontSize === "medium" ? 1 : 2;

  const handleFontSizeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    const nextSize = value === 0 ? "small" : value === 1 ? "medium" : "large";
    if (nextSize !== fontSize) {
      setFontSize(nextSize);
    }
  };

  // Map high contrast boolean to slider (0 = off, 1 = on)
  const contrastValue = isHighContrastMode ? 1 : 0;

  const handleContrastChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(event.target.value);
    const nextIsHighContrast = value === 1;
    if (nextIsHighContrast !== isHighContrastMode) {
      toggleHighContrast();
    }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        aria-label="Settings"
        title="Settings"
      >
        <Settings className="w-4 h-4" />
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-50">
          <div className="p-4">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Settings</h3>
            <div className="space-y-4">
              {/* Sound on/off */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Sound</span>
                <button
                  onClick={toggleSound}
                  className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  aria-label={isSoundEnabled ? "Mute sound effects" : "Unmute sound effects"}
                >
                  {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
                </button>
              </div>

              {/* Voice instructions on/off */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Voice</span>
                <button
                  onClick={toggleSpeech}
                  className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  aria-label={isSpeechEnabled ? "Turn off voice instructions" : "Turn on voice instructions"}
                >
                  {isSpeechEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
                </button>
              </div>

              {/* Font size slider */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Font Size</span>
                <div className="flex items-center gap-2">
                  <Type className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                  <input
                    type="range"
                    min={0}
                    max={2}
                    step={1}
                    value={fontSizeValue}
                    onChange={handleFontSizeChange}
                    className="w-16 h-1 cursor-pointer accent-blue-500"
                  />
                </div>
              </div>

              {/* High contrast slider */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Contrast</span>
                <div className="flex items-center gap-2">
                  <Contrast className="w-3 h-3 text-gray-600 dark:text-gray-300" />
                  <input
                    type="range"
                    min={0}
                    max={1}
                    step={1}
                    value={contrastValue}
                    onChange={handleContrastChange}
                    className="w-16 h-1 cursor-pointer accent-blue-500"
                  />
                </div>
              </div>

              {/* Theme toggle */}
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-700 dark:text-gray-300">Theme</span>
                <button
                  onClick={toggleTheme}
                  className="flex h-8 w-8 items-center justify-center rounded border border-gray-200 bg-white text-gray-600 hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                  aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
                >
                  {isDarkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsDropdown;