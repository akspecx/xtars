import React from "react";
import { Volume2, VolumeX, Mic, MicOff, Type, Contrast } from "lucide-react";
import { useSettings } from "../../contexts/SettingsContext";

/**
 * Compact header-level controls for global settings.
 * Placed in the top bar, just to the left of the user/profile controls.
 */
const HeaderSettingsControls: React.FC = () => {
  const {
    isSoundEnabled,
    toggleSound,
    isSpeechEnabled,
    toggleSpeech,
    isHighContrastMode,
    toggleHighContrast,
    fontSize,
    setFontSize,
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
    <>
      {/* Sound on/off */}
      <button
        onClick={toggleSound}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        aria-label={isSoundEnabled ? "Mute sound effects" : "Unmute sound effects"}
        title={isSoundEnabled ? "Mute sound effects" : "Unmute sound effects"}
      >
        {isSoundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
      </button>

      {/* Voice instructions on/off */}
      <button
        onClick={toggleSpeech}
        className="flex h-9 w-9 items-center justify-center rounded-full border border-gray-200 bg-white text-gray-600 shadow-sm hover:bg-gray-100 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300 dark:hover:bg-gray-800"
        aria-label={isSpeechEnabled ? "Turn off voice instructions" : "Turn on voice instructions"}
        title={isSpeechEnabled ? "Voice: on (click to turn off)" : "Voice: off (click to turn on)"}
      >
        {isSpeechEnabled ? <Mic className="w-4 h-4" /> : <MicOff className="w-4 h-4" />}
      </button>

      {/* Font size slider: small → medium → large */}
      <div
        className="flex h-9 items-center gap-2 rounded-full border border-gray-200 bg-white px-2 text-gray-600 text-xs shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
      >
        <Type className="w-3 h-3" aria-hidden="true" />
        <input
          type="range"
          min={0}
          max={2}
          step={1}
          value={fontSizeValue}
          onChange={handleFontSizeChange}
          aria-valuemin={0}
          aria-valuemax={2}
          aria-valuenow={fontSizeValue}
          aria-label="Font size"
          className="h-1 w-16 cursor-pointer accent-blue-500"
        />
      </div>

      {/* High contrast slider: off → on */}
      <div
        className="flex h-9 items-center gap-2 rounded-full border border-gray-200 bg-white px-2 text-gray-600 text-xs shadow-sm dark:border-gray-700 dark:bg-gray-900 dark:text-gray-300"
      >
        <Contrast className="w-3 h-3" aria-hidden="true" />
        <input
          type="range"
          min={0}
          max={1}
          step={1}
          value={contrastValue}
          onChange={handleContrastChange}
          aria-valuemin={0}
          aria-valuemax={1}
          aria-valuenow={contrastValue}
          aria-label="High contrast"
          className="h-1 w-12 cursor-pointer accent-blue-500"
        />
      </div>
    </>
  );
};

export default HeaderSettingsControls;


