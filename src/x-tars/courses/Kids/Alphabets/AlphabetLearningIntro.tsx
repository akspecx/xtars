import React, { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight, Volume2, Loader } from 'lucide-react';
// Required Firebase imports for the execution environment
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// Define a global Audio object reference to manage playback outside of the component state
declare global {
    interface Window {
        currentAudio: HTMLAudioElement | null;
    }
}
window.currentAudio = window.currentAudio || null;

// Function to immediately stop and clean up any current audio
const stopCurrentAudio = () => {
    if (window.currentAudio) {
        window.currentAudio.pause();
        window.currentAudio.src = '';
        window.currentAudio = null;
    }
};

// --- Global Constants from Canvas Environment (MANDATORY) ---
declare const __app_id: string;
declare const __firebase_config: string;
declare const __initial_auth_token: string | undefined;

// --- Utility Functions for TTS (PCM to WAV Conversion) ---

// Converts a base64 string to an ArrayBuffer
const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i);
    }
    return bytes.buffer;
};

// Converts 16-bit PCM data to a standard WAV Blob
const pcmToWav = (pcm16: Int16Array, sampleRate: number): Blob => {
    const numChannels = 1;
    const bitsPerSample = 16;
    const bytesPerSample = bitsPerSample / 8;
    const numSamples = pcm16.length;
    const buffer = new ArrayBuffer(44 + numSamples * bytesPerSample);
    const view = new DataView(buffer);

    // Helper to write string to DataView
    const writeString = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) {
            view.setUint8(offset + i, str.charCodeAt(i));
        }
    };

    let offset = 0;

    // 1. RIFF chunk
    writeString(offset, 'RIFF'); offset += 4;
    view.setUint32(offset, 36 + numSamples * bytesPerSample, true); offset += 4; // ChunkSize
    writeString(offset, 'WAVE'); offset += 4;

    // 2. fmt chunk
    writeString(offset, 'fmt '); offset += 4;
    view.setUint32(offset, 16, true); offset += 4; // Subchunk1Size (16 for PCM)
    view.setUint16(offset, 1, true); offset += 2; // AudioFormat (1 for PCM)
    view.setUint16(offset, numChannels, true); offset += 2;
    view.setUint32(offset, sampleRate, true); offset += 4;
    view.setUint32(offset, sampleRate * numChannels * bytesPerSample, true); offset += 4; // ByteRate
    view.setUint16(offset, numChannels * bytesPerSample, true); offset += 2; // BlockAlign
    view.setUint16(offset, bitsPerSample, true); offset += 2;

    // 3. data chunk
    writeString(offset, 'data'); offset += 4;
    view.setUint32(offset, numSamples * bytesPerSample, true); offset += 4; // Subchunk2Size (data size)

    // Write PCM data
    for (let i = 0; i < numSamples; i++) {
        view.setInt16(offset, pcm16[i], true); offset += 2;
    }

    return new Blob([view], { type: 'audio/wav' });
};

// --- Alphabet Data ---
const alphabetData = [
    { letter: "A", word: "Apple", icon: "🍎", color: "bg-red-500", shadow: "shadow-red-700" },
    { letter: "B", word: "Ball", icon: "⚽", color: "bg-blue-500", shadow: "shadow-blue-700" },
    { letter: "C", word: "Cat", icon: "🐱", color: "bg-yellow-500", shadow: "shadow-yellow-700" },
    { letter: "D", word: "Dog", icon: "🐶", color: "bg-green-500", shadow: "shadow-green-700" },
    { letter: "E", word: "Egg", icon: "🥚", color: "bg-orange-500", shadow: "shadow-orange-700" },
    { letter: "F", word: "Fish", icon: "🐠", color: "bg-cyan-500", shadow: "shadow-cyan-700" },
    { letter: "G", word: "Grape", icon: "🍇", color: "bg-purple-500", shadow: "shadow-purple-700" },
    { letter: "H", word: "House", icon: "🏠", color: "bg-amber-500", shadow: "shadow-amber-700" },
    { letter: "I", word: "Ice Cream", icon: "🍦", color: "bg-pink-500", shadow: "shadow-pink-700" },
    // J for Joker (Updated)
    { letter: "J", word: "Joker", icon: "🃏", color: "bg-lime-500", shadow: "shadow-lime-700" }, 
    { letter: "K", word: "Kite", icon: "🪁", color: "bg-indigo-500", shadow: "shadow-indigo-700" },
    { letter: "L", word: "Lion", icon: "🦁", color: "bg-red-400", shadow: "shadow-red-600" },
    { letter: "M", word: "Moon", icon: "🌙", color: "bg-yellow-400", shadow: "shadow-yellow-600" },
    // N for Nest (Updated)
    { letter: "N", word: "Nest", icon: "🪹", color: "bg-teal-500", shadow: "shadow-teal-700" }, 
    { letter: "O", word: "Owl", icon: "🦉", color: "bg-fuchsia-500", shadow: "shadow-fuchsia-700" },
    // P for Parrot (Updated)
    { letter: "P", word: "Parrot", icon: "🦜", color: "bg-green-400", shadow: "shadow-green-600" }, 
    { letter: "Q", word: "Queen", icon: "👑", color: "bg-rose-500", shadow: "shadow-rose-700" },
    // R for Rat (Updated)
    { letter: "R", word: "Rat", icon: "🐀", color: "bg-sky-500", shadow: "shadow-sky-700" }, 
    { letter: "S", word: "Star", icon: "⭐", color: "bg-violet-500", shadow: "shadow-violet-700" },
    { letter: "T", word: "Train", icon: "🚂", color: "bg-emerald-500", shadow: "shadow-emerald-700" },
    { letter: "U", word: "Umbrella", icon: "☂️", color: "bg-cyan-400", shadow: "shadow-cyan-600" },
    { letter: "V", word: "Volcano", icon: "🌋", color: "bg-orange-400", shadow: "shadow-orange-600" },
    // W for Watch (Updated)
    { letter: "W", word: "Watch", icon: "⌚", color: "bg-pink-400", shadow: "shadow-pink-600" }, 
    // X for X-mas (Updated)
    { letter: "X", word: "X-mas", icon: "🎄", color: "bg-lime-400", shadow: "shadow-lime-600" }, 
    { letter: "Y", word: "Yacht", icon: "🛥️", color: "bg-indigo-400", shadow: "shadow-indigo-600" },
    { letter: "Z", word: "Zebra", icon: "🦓", color: "bg-amber-400", shadow: "shadow-amber-600" },
];

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=`;

const App: React.FC = () => {
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [auth, setAuth] = useState<ReturnType<typeof getAuth> | null>(null);
    // hasInteracted flag is ONLY set by arrow clicks to start the auto-advance timer
    const [hasInteracted, setHasInteracted] = useState(false); 
    
    // State to track manual navigation which triggers speech
    const [manualTrigger, setManualTrigger] = useState(0); 

    const { letter, word, icon, color, shadow } = alphabetData[currentLetterIndex];

    // 1. Firebase Initialization and Authentication
    useEffect(() => {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');

        if (!firebaseConfig.apiKey) {
            console.error("Firebase config is missing API key. Cannot initialize.");
            setIsAuthReady(true); 
            return;
        }

        try {
            const app = initializeApp(firebaseConfig, appId);
            const authInstance = getAuth(app);
            setAuth(authInstance);

            const authenticate = async () => {
                if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                    await signInWithCustomToken(authInstance, __initial_auth_token);
                } else {
                    await signInAnonymously(authInstance);
                }
                setIsAuthReady(true);
            };
            authenticate();
        } catch (error) {
            console.error("Firebase initialization or authentication failed:", error);
            setIsAuthReady(true);
        }
    }, []);
    
    // 2. TTS Logic
    const speakPhrase = useCallback(async () => {
        if (!isAuthReady) return; 

        // Stop any audio currently playing, which is crucial for multi-trigger requests
        stopCurrentAudio(); 
        setIsSpeaking(true);

        // Special case for X-mas to ensure it is pronounced correctly
        const textToSpeak = (letter === "X" && word === "X-mas") ? "X for Christmas" : `${letter} for ${word}`;

        const payload = {
            contents: [{ parts: [{ text: textToSpeak }] }],
            generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: "Charon" }
                    }
                }
            },
            model: "gemini-2.5-flash-preview-tts"
        };

        try {
            let response: Response;
            let retries = 0;
            const maxRetries = 5;

            while (retries < maxRetries) {
                response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(payload)
                });

                if (response.status === 429) {
                    retries++;
                    const delay = Math.pow(2, retries) * 1000;
                    await new Promise(resolve => setTimeout(resolve, delay));
                    continue;
                }

                if (!response.ok) {
                    throw new Error(`API call failed with status: ${response.status}`);
                }
                
                const result = await response.json();
                const part = result?.candidates?.[0]?.content?.parts?.[0];
                const audioData = part?.inlineData?.data;
                const mimeType = part?.inlineData?.mimeType;

                if (audioData && mimeType && mimeType.startsWith("audio/L16")) {
                    const sampleRateMatch = mimeType.match(/rate=(\d+)/);
                    if (!sampleRateMatch) throw new Error("Could not extract sample rate from mimeType.");
                    const sampleRate = parseInt(sampleRateMatch[1], 10);
                    
                    const pcmData = base64ToArrayBuffer(audioData);
                    const pcm16 = new Int16Array(pcmData);
                    const wavBlob = pcmToWav(pcm16, sampleRate);
                    const audioUrl = URL.createObjectURL(wavBlob);

                    const audio = new Audio(audioUrl);
                    window.currentAudio = audio; // Store reference to the audio object
                    
                    audio.play().catch(e => {
                        console.log("Audio playback failed (usually needs user interaction):", e);
                    });
                    
                    audio.onended = () => {
                        URL.revokeObjectURL(audioUrl);
                        if (window.currentAudio === audio) {
                            window.currentAudio = null;
                        }
                        setIsSpeaking(false);
                    };
                    return;
                } else {
                    throw new Error("Invalid audio response format.");
                }
            }
            if (retries === maxRetries) {
                console.error("TTS API call failed after multiple retries due to throttling.");
            }

        } catch (error) {
            console.error("Error during TTS generation:", error);
            stopCurrentAudio(); // Clean up on error
            setIsSpeaking(false);
        }
        setIsSpeaking(false); 
    }, [letter, word, isAuthReady]);


    // 3. Navigation Handlers
    
    // Silent Advance: Used by the timer (does NOT trigger speech)
    const silentAdvance = useCallback(() => {
        // Stop audio immediately upon advance
        stopCurrentAudio(); 
        setCurrentLetterIndex(prev => (prev + 1) % alphabetData.length);
    }, []);

    // Manual Navigation: Used by the buttons (DOES trigger speech)
    const handleManualNavigate = useCallback((direction: 'next' | 'prev') => {
        // Stop audio immediately upon navigation
        stopCurrentAudio();
        
        setCurrentLetterIndex(prev => {
            return direction === 'next' 
                ? (prev + 1) % alphabetData.length 
                : (prev - 1 + alphabetData.length) % alphabetData.length;
        });
        
        // IMPORTANT: Set hasInteracted to true ONLY here, to start the auto-advance timer
        setHasInteracted(true);
        // Signal a manual change to trigger the speaking useEffect
        setManualTrigger(prev => prev + 1); 
    }, []);


    // 4. Speaking Effect: Triggered only by manual action
    useEffect(() => {
        // Only run if a manual button click has occurred and auth is ready
        if (manualTrigger > 0 && isAuthReady) {
            speakPhrase();
        }
    }, [manualTrigger, isAuthReady, speakPhrase]);


    // 5. Auto-Advance Timer Logic
    const AUTO_ADVANCE_MS = 10000; // 10 seconds

    useEffect(() => {
        // Only start the timer if the user has manually interacted via the arrow buttons
        if (hasInteracted) {
            const timerId = setTimeout(() => {
                // Timer calls the silent advance function
                silentAdvance();
            }, AUTO_ADVANCE_MS);

            // Cleanup: Clear the timer whenever the index changes (manual or auto) or unmounts
            return () => clearTimeout(timerId);
        }
    }, [currentLetterIndex, hasInteracted, silentAdvance]);


    // 6. Component Rendering
    return (
        <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-pink-100 flex flex-col items-center justify-center p-4 font-['Inter']">
            {/* Custom CSS for the pop-in animation */}
            <style>{`
                @keyframes quick-pop {
                    0% { transform: scale(0.8); opacity: 0; }
                    50% { transform: scale(1.1); opacity: 1; }
                    100% { transform: scale(1); }
                }
                .animate-quick-pop {
                    animation: quick-pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) 1;
                }
            `}</style>

            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 mb-8 p-3 rounded-xl bg-white shadow-xl">
                The Alphabet Explorer
            </h1>
            
            <div className={`w-full max-w-4xl p-6 md:p-10 rounded-3xl ${color} transition-all duration-500 ease-in-out shadow-2xl ${shadow} shadow-xl`}>
                
                {/* Main Content Box */}
                <div className="bg-white p-4 md:p-8 rounded-2xl flex flex-col md:flex-row items-stretch gap-6 shadow-inner">
                    
                    {/* Left Side: Letter */}
                    <div className="flex-1 min-h-[200px] flex items-center justify-center border-4 border-gray-200 rounded-xl p-4 md:p-6 bg-yellow-50 shadow-lg transition-transform duration-300 hover:scale-[1.01]">
                        <span className="text-[12rem] md:text-[14rem] font-black leading-none text-gray-900 drop-shadow-lg mobile-text-scale">
                            {letter}
                        </span>
                    </div>

                    {/* Right Side: Word and Icon - Added key and animation class */}
                    <div 
                        key={currentLetterIndex}
                        className="flex-1 min-h-[200px] flex flex-col items-center justify-center rounded-xl p-4 md:p-6 bg-pink-50 shadow-lg animate-quick-pop"
                    >
                        <div className="text-[6rem] md:text-[8rem] leading-none mb-4 mobile-icon-scale">
                            {icon}
                        </div>
                        <p className="text-5xl md:text-6xl font-extrabold text-gray-800 tracking-widest uppercase mt-4 text-center mobile-text-scale">
                            {word}
                        </p>
                    </div>
                </div>

                {/* Controls Area */}
                <div className="flex justify-center items-center mt-6 md:mt-10 gap-4">
                    
                    {/* Previous Button */}
                    <button
                        onClick={() => handleManualNavigate('prev')}
                        className="p-3 md:p-5 bg-yellow-400 text-gray-800 rounded-full shadow-lg hover:bg-yellow-300 transition-all duration-200 active:shadow-inner active:scale-95 border-4 border-yellow-500"
                        aria-label="Previous Alphabet"
                    >
                        <ChevronLeft className="w-8 h-8 md:w-10 md:h-10"/>
                    </button>

                    {/* Voice Button */}
                    <button
                        onClick={speakPhrase}
                        disabled={isSpeaking || !isAuthReady}
                        className={`p-4 md:p-6 rounded-full shadow-xl transition-all duration-300 flex items-center justify-center border-4 ${isSpeaking ? 'bg-gray-400 border-gray-500' : 'bg-green-400 border-green-600 hover:bg-green-300 active:scale-95'}`}
                        aria-label="Speak Phrase"
                    >
                        {isSpeaking ? (
                            <Loader className="w-10 h-10 md:w-12 md:h-12 text-white animate-spin" />
                        ) : (
                            <Volume2 className="w-10 h-10 md:w-12 md:h-12 text-white" />
                        )}
                    </button>

                    {/* Next Button */}
                    <button
                        onClick={() => handleManualNavigate('next')}
                        className="p-3 md:p-5 bg-yellow-400 text-gray-800 rounded-full shadow-lg hover:bg-yellow-300 transition-all duration-200 active:shadow-inner active:scale-95 border-4 border-yellow-500"
                        aria-label="Next Alphabet"
                    >
                        <ChevronRight className="w-8 h-8 md:w-10 md:h-10" />
                    </button>
                </div>
            </div>
            
            <p className="mt-8 text-lg text-gray-600">
                You're on letter {currentLetterIndex + 1} of {alphabetData.length}.
            </p>
            {auth && <p className="text-sm text-gray-500 mt-2">
                User ID: {auth.currentUser?.uid || 'Authenticating...'}
            </p>}
        </div>
    );
};

export default App;