import React, { useState } from 'react';
import { Settings, X, Volume2, VolumeX, Moon, Sun, Mic, MicOff, Music, Pause, Contrast, Type } from 'lucide-react';
import { useSettings } from '../contexts/SettingsContext';

const GlobalSettings: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const {
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
    stopSpeech,
  } = useSettings();

  const handleTestSpeech = () => {
    speak('This is a test of the speech synthesis system. Hello!');
  };

  console.log('GlobalSettings component is rendering, isOpen:', isOpen);

  return (
    <>
      {/* Settings Button - Fixed position (placed below header so it's not overlapped) */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed z-[10000] p-4 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 text-white shadow-2xl hover:shadow-3xl transform hover:scale-110 active:scale-95 transition-all duration-200 border-4 border-white"
        aria-label="Open Settings"
        // Place the button slightly below the top app header and away from profile controls
        style={{
          position: 'fixed',
          top: '96px',   // ~ below the main header bar
          right: '32px',
          zIndex: 10000,
        }}
      >
        <Settings className="w-8 h-8" />
        <span className="sr-only">Settings</span>
      </button>

      {/* Settings Modal */}
      {isOpen && (
        <div className="fixed inset-0 z-[10000] flex items-center justify-center p-4 bg-black bg-opacity-50 backdrop-blur-sm">
          <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="sticky top-0 bg-gradient-to-r from-purple-500 to-pink-500 text-white p-6 rounded-t-3xl flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Settings className="w-8 h-8" />
                <h2 className="text-2xl font-bold">Settings</h2>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-white hover:bg-opacity-20 transition-all"
                aria-label="Close Settings"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Display Settings */}
              <section>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Sun className="w-5 h-5" />
                  Display
                </h3>
                
                {/* Dark Mode */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl mb-3">
                  <div className="flex items-center gap-3">
                    {isDarkMode ? <Moon className="w-5 h-5 text-gray-700 dark:text-gray-300" /> : <Sun className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white">Dark Mode</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Reduce eye strain</div>
                    </div>
                  </div>
                  <button
                    onClick={toggleDarkMode}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      isDarkMode ? 'bg-purple-500' : 'bg-gray-300'
                    }`}
                    aria-label={isDarkMode ? 'Disable Dark Mode' : 'Enable Dark Mode'}
                  >
                    <div
                      className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                        isDarkMode ? 'transform translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* High Contrast */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl mb-3">
                  <div className="flex items-center gap-3">
                    <Contrast className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white">High Contrast</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Better visibility</div>
                    </div>
                  </div>
                  <button
                    onClick={toggleHighContrast}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      isHighContrastMode ? 'bg-purple-500' : 'bg-gray-300'
                    }`}
                    aria-label={isHighContrastMode ? 'Disable High Contrast' : 'Enable High Contrast'}
                  >
                    <div
                      className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                        isHighContrastMode ? 'transform translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Font Size */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center gap-3 mb-3">
                    <Type className="w-5 h-5 text-gray-700 dark:text-gray-300" />
                    <div className="font-semibold text-gray-800 dark:text-white">Font Size</div>
                  </div>
                  <div className="flex gap-2">
                    {(['small', 'medium', 'large'] as const).map((size) => (
                      <button
                        key={size}
                        onClick={() => setFontSize(size)}
                        className={`flex-1 py-2 px-4 rounded-lg font-semibold transition-all ${
                          fontSize === size
                            ? 'bg-purple-500 text-white'
                            : 'bg-white dark:bg-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-500'
                        }`}
                      >
                        {size.charAt(0).toUpperCase() + size.slice(1)}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Audio Settings */}
              <section>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Volume2 className="w-5 h-5" />
                  Audio
                </h3>

                {/* Sound Effects */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl mb-3">
                  <div className="flex items-center gap-3">
                    {isSoundEnabled ? <Volume2 className="w-5 h-5 text-gray-700 dark:text-gray-300" /> : <VolumeX className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white">Sound Effects</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Game sounds</div>
                    </div>
                  </div>
                  <button
                    onClick={toggleSound}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      isSoundEnabled ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                    aria-label={isSoundEnabled ? 'Disable Sound' : 'Enable Sound'}
                  >
                    <div
                      className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                        isSoundEnabled ? 'transform translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Background Music */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl mb-3">
                  <div className="flex items-center gap-3">
                    {isMusicEnabled ? <Music className="w-5 h-5 text-gray-700 dark:text-gray-300" /> : <Pause className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white">Background Music</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Ambient music</div>
                    </div>
                  </div>
                  <button
                    onClick={toggleMusic}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      isMusicEnabled ? 'bg-green-500' : 'bg-gray-300'
                    }`}
                    aria-label={isMusicEnabled ? 'Disable Music' : 'Enable Music'}
                  >
                    <div
                      className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                        isMusicEnabled ? 'transform translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Volume Control */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-800 dark:text-white">Volume</div>
                    <div className="text-sm font-bold text-purple-600 dark:text-purple-400">{Math.round(volume * 100)}%</div>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={volume}
                    onChange={(e) => setVolume(parseFloat(e.target.value))}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                    aria-label="Volume Control"
                  />
                </div>
              </section>

              {/* Speech Settings */}
              <section>
                <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-4 flex items-center gap-2">
                  <Mic className="w-5 h-5" />
                  Speech
                </h3>

                {/* Speech Toggle */}
                <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-xl mb-3">
                  <div className="flex items-center gap-3">
                    {isSpeechEnabled ? <Mic className="w-5 h-5 text-gray-700 dark:text-gray-300" /> : <MicOff className="w-5 h-5 text-gray-700 dark:text-gray-300" />}
                    <div>
                      <div className="font-semibold text-gray-800 dark:text-white">Voice Instructions</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">Spoken guidance and instructions</div>
                    </div>
                  </div>
                  <button
                    onClick={toggleSpeech}
                    className={`relative w-14 h-8 rounded-full transition-colors ${
                      isSpeechEnabled ? 'bg-blue-500' : 'bg-gray-300'
                    }`}
                    aria-label={isSpeechEnabled ? 'Disable Speech' : 'Enable Speech'}
                  >
                    <div
                      className={`absolute top-1 left-1 w-6 h-6 bg-white rounded-full transition-transform ${
                        isSpeechEnabled ? 'transform translate-x-6' : ''
                      }`}
                    />
                  </button>
                </div>

                {/* Speech Rate */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-800 dark:text-white">Speech Speed</div>
                    <div className="text-sm font-bold text-blue-600 dark:text-blue-400">{speechRate.toFixed(2)}x</div>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="1.5"
                    step="0.05"
                    value={speechRate}
                    onChange={(e) => setSpeechRate(parseFloat(e.target.value))}
                    disabled={!isSpeechEnabled}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50"
                    aria-label="Speech Rate Control"
                  />
                </div>

                {/* Speech Pitch */}
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-xl mb-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold text-gray-800 dark:text-white">Speech Pitch</div>
                    <div className="text-sm font-bold text-blue-600 dark:text-blue-400">{speechPitch.toFixed(2)}</div>
                  </div>
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={speechPitch}
                    onChange={(e) => setSpeechPitch(parseFloat(e.target.value))}
                    disabled={!isSpeechEnabled}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-600 rounded-lg appearance-none cursor-pointer accent-blue-500 disabled:opacity-50"
                    aria-label="Speech Pitch Control"
                  />
                </div>

                {/* Speech Controls */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-2">
                  <button
                    onClick={handleTestSpeech}
                    disabled={!isSpeechEnabled}
                    className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-blue-500 to-cyan-500 text-white font-bold hover:from-blue-600 hover:to-cyan-600 active:scale-95 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    ▶️ Test Speech
                  </button>
                  <button
                    onClick={stopSpeech}
                    className="w-full py-3 px-4 rounded-xl bg-gray-500 hover:bg-gray-600 text-white font-bold active:scale-95 transition-all"
                  >
                    ⏹ Stop Speaking
                  </button>
                </div>
              </section>
            </div>

            {/* Footer */}
            <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-b-3xl text-center">
              <button
                onClick={() => setIsOpen(false)}
                className="px-8 py-3 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 text-white font-bold hover:from-purple-600 hover:to-pink-600 active:scale-95 transition-all"
              >
                Done
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default GlobalSettings;

