import React, { useState, useEffect, useCallback, useMemo, useRef } from 'react';
import { Volume2, Loader, CheckCircle, XCircle } from 'lucide-react';
// Required Firebase imports (keeping for environment consistency)
import { initializeApp } from 'firebase/app';
import { getAuth, signInAnonymously, signInWithCustomToken } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

// --- Global Audio/Firebase Setup (same as previous file) ---
declare global {
    interface Window { currentAudio: HTMLAudioElement | null; }
}
window.currentAudio = window.currentAudio || null;

const stopCurrentAudio = () => {
    if (window.currentAudio) {
        window.currentAudio.pause();
        window.currentAudio.src = '';
        window.currentAudio = null;
    }
};

declare const __app_id: string;
declare const __firebase_config: string;
declare const __initial_auth_token: string | undefined;

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
    const binaryString = atob(base64);
    const len = binaryString.length;
    const bytes = new Uint8Array(len);
    for (let i = 0; i < len; i++) { bytes[i] = binaryString.charCodeAt(i); }
    return bytes.buffer;
};

const pcmToWav = (pcm16: Int16Array, sampleRate: number): Blob => {
    const numChannels = 1;
    const bitsPerSample = 16;
    const bytesPerSample = bitsPerSample / 8;
    const numSamples = pcm16.length;
    const buffer = new ArrayBuffer(44 + numSamples * bytesPerSample);
    const view = new DataView(buffer);
    const writeString = (offset: number, str: string) => {
        for (let i = 0; i < str.length; i++) { view.setUint8(offset + i, str.charCodeAt(i)); }
    };

    let offset = 0;
    writeString(offset, 'RIFF'); offset += 4;
    view.setUint32(offset, 36 + numSamples * bytesPerSample, true); offset += 4;
    writeString(offset, 'WAVE'); offset += 4;
    writeString(offset, 'fmt '); offset += 4;
    view.setUint32(offset, 16, true); offset += 4;
    view.setUint16(offset, 1, true); offset += 2;
    view.setUint16(offset, numChannels, true); offset += 2;
    view.setUint32(offset, sampleRate, true); offset += 4;
    view.setUint32(offset, sampleRate * numChannels * bytesPerSample, true); offset += 4;
    view.setUint16(offset, numChannels * bytesPerSample, true); offset += 2;
    view.setUint16(offset, bitsPerSample, true); offset += 2;
    writeString(offset, 'data'); offset += 4;
    view.setUint32(offset, numSamples * bytesPerSample, true); offset += 4;
    for (let i = 0; i < numSamples; i++) { view.setInt16(offset, pcm16[i], true); offset += 2; }

    return new Blob([view], { type: 'audio/wav' });
};

// --- Alphabet Data (using the same set) ---
const alphabetData = [
    { letter: "A", word: "Apple", icon: "🍎", id: "Apple" },
    { letter: "B", word: "Ball", icon: "⚽", id: "Ball" },
    { letter: "C", word: "Cat", icon: "🐱", id: "Cat" },
    { letter: "D", word: "Dog", icon: "🐶", id: "Dog" },
    { letter: "E", word: "Egg", icon: "🥚", id: "Egg" },
    { letter: "F", word: "Fish", icon: "🐠", id: "Fish" },
    { letter: "G", word: "Grape", icon: "🍇", id: "Grape" },
    { letter: "H", word: "House", icon: "🏠", id: "House" },
    { letter: "I", word: "Ice Cream", icon: "🍦", id: "IceCream" },
    { letter: "J", word: "Joker", icon: "🃏", id: "Joker" }, 
    { letter: "K", word: "Kite", icon: "🪁", id: "Kite" },
    { letter: "L", word: "Lion", icon: "🦁", id: "Lion" },
    { letter: "M", word: "Moon", icon: "🌙", id: "Moon" },
    { letter: "N", word: "Nest", icon: "🪹", id: "Nest" }, 
    { letter: "O", word: "Owl", icon: "🦉", id: "Owl" },
    { letter: "P", word: "Parrot", icon: "🦜", id: "Parrot" }, 
    { letter: "Q", word: "Queen", icon: "👑", id: "Queen" },
    { letter: "R", word: "Rat", icon: "🐀", id: "Rat" }, 
    { letter: "S", word: "Star", icon: "⭐", id: "Star" },
    { letter: "T", word: "Train", icon: "🚂", id: "Train" },
    { letter: "U", word: "Umbrella", icon: "☂️", id: "Umbrella" },
    { letter: "V", word: "Volcano", icon: "🌋", id: "Volcano" },
    { letter: "W", word: "Watch", icon: "⌚", id: "Watch" }, 
    { letter: "X", word: "X-mas", icon: "🎄", id: "Xmas" }, 
    { letter: "Y", word: "Yacht", icon: "🛥️", id: "Yacht" },
    { letter: "Z", word: "Zebra", icon: "🦓", id: "Zebra" },
];

const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=`;

// Utility function to shuffle an array
const shuffleArray = (array: any[]) => {
    let newArray = [...array];
    for (let i = newArray.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
    }
    return newArray;
};

// --- Component Definition ---
const DragAndDropLearner: React.FC = () => {
    const [currentLetterIndex, setCurrentLetterIndex] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isAuthReady, setIsAuthReady] = useState(false);
    const [feedback, setFeedback] = useState<'correct' | 'incorrect' | null>(null);
    const [droppedItem, setDroppedItem] = useState<{ id: string, icon: string, word: string } | null>(null);
    const [puzzleSolved, setPuzzleSolved] = useState(false);
    const [score, setScore] = useState(0);
    const [streak, setStreak] = useState(0);
    
    // NEW STATE: Track items that have been solved to disable dragging
    const [solvedItemIds, setSolvedItemIds] = useState<Set<string>>(new Set());
    const timeoutRef = useRef<number | null>(null); // Ref for auto-advance timer
    const audioQueueRef = useRef<string[]>([]); // Queue for audio phrases

    // Auth initialization (keeping for structure)
    useEffect(() => {
        const appId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        const firebaseConfig = JSON.parse(typeof __firebase_config !== 'undefined' ? __firebase_config : '{}');

        if (firebaseConfig.apiKey) {
            try {
                const app = initializeApp(firebaseConfig, appId);
                const authInstance = getAuth(app);
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
                console.error("Firebase initialization failed:", error);
            }
        } else {
            setIsAuthReady(true);
        }
    }, []);

    const currentItem = alphabetData[currentLetterIndex];

    // Generate ALL draggable items and shuffle them once.
    const allDraggableItems = useMemo(() => {
        return shuffleArray(alphabetData.map(item => ({
            id: item.id,
            icon: item.icon,
            word: item.word
        })));
    }, []);

    // Cleanup function for the timer
    useEffect(() => {
        return () => {
            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);


    // --- TTS Logic (Modified for instant feedback with background audio) ---
    const speakPhrase = useCallback(async (phrase: string, instant: boolean = false) => {
        if (!isAuthReady) return; 

        // For instant feedback scenarios, don't stop current audio or show loading
        if (!instant) {
            stopCurrentAudio(); 
            setIsSpeaking(true);
        }

        const payload = {
            contents: [{ parts: [{ text: phrase }] }],
            generationConfig: {
                responseModalities: ["AUDIO"],
                speechConfig: {
                    voiceConfig: { prebuiltVoiceConfig: { voiceName: "Puck" } }
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

                if (!response.ok) throw new Error(`API call failed: ${response.status}`);
                
                const result = await response.json();
                const part = result?.candidates?.[0]?.content?.parts?.[0];
                const audioData = part?.inlineData?.data;
                const mimeType = part?.inlineData?.mimeType;

                if (audioData && mimeType && mimeType.startsWith("audio/L16")) {
                    const sampleRateMatch = mimeType.match(/rate=(\d+)/);
                    const sampleRate = parseInt(sampleRateMatch![1], 10);
                    
                    const pcmData = base64ToArrayBuffer(audioData);
                    const pcm16 = new Int16Array(pcmData);
                    const wavBlob = pcmToWav(pcm16, sampleRate);
                    const audioUrl = URL.createObjectURL(wavBlob);

                    const audio = new Audio(audioUrl);
                    window.currentAudio = audio;
                    audio.play().catch(e => console.log("Audio playback failed (interaction needed):", e));
                    audio.onended = () => setIsSpeaking(false);
                    return;
                }
            }
        } catch (error) {
            console.error("Error during TTS generation:", error);
            setIsSpeaking(false);
        }
        setIsSpeaking(false);
    }, [isAuthReady]);

    // Initial message or message on letter change
    useEffect(() => {
        setPuzzleSolved(false);
        setDroppedItem(null);
        setFeedback(null);
        if (timeoutRef.current !== null) {
            clearTimeout(timeoutRef.current); // Clear any pending timeout on letter change
        }
        
        // Special case for X-mas to ensure it is pronounced correctly
        const initialText = (currentItem.letter === "X" && currentItem.word === "X-mas") 
            ? "X for..." 
            : `${currentItem.letter} for...`;
        speakPhrase(initialText);
    }, [currentLetterIndex, speakPhrase, currentItem]);

    // Reset function
    const nextPuzzle = () => {
        const nextIndex = (currentLetterIndex + 1) % alphabetData.length;
        setCurrentLetterIndex(nextIndex);
    };

    // --- Drag and Drop Handlers ---

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, item: { id: string, icon: string, word: string }) => {
        // Prevent dragging if the item is already solved
        if (solvedItemIds.has(item.id)) {
            e.preventDefault();
            return;
        }

        // Store the item's ID in the data transfer object
        e.dataTransfer.setData("text/plain", item.id);
        e.dataTransfer.effectAllowed = "move";
        stopCurrentAudio(); // Stop audio if drag starts
    };

    const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault();
        if (puzzleSolved) return; // Ignore drops if already solved

        const droppedItemId = e.dataTransfer.getData("text/plain");
        const dropped = allDraggableItems.find(item => item.id === droppedItemId);
        if (!dropped) return;

        // INSTANT visual feedback - set immediately
        setDroppedItem(dropped);

        if (dropped.id === currentItem.id) {
            // CORRECT DROP - instant feedback
            setFeedback('correct');
            setPuzzleSolved(true);
            setScore(prev => prev + 10);
            setStreak(prev => prev + 1);
            
            // Add the solved item's ID to the set
            setSolvedItemIds(prev => new Set(prev).add(dropped.id));
            
            // Construct the phrase to be spoken
            const solvedWord = (currentItem.letter === "X" && currentItem.word === "X-mas") 
                ? "Christmas" 
                : currentItem.word;
            
            // Audio loads in background with instant=true flag
            const encouragements = [
                `${currentItem.letter} for ${solvedWord}! Perfect!`,
                `Amazing! ${currentItem.letter} for ${solvedWord}!`,
                `Excellent work! ${currentItem.letter} for ${solvedWord}!`,
                `You got it! ${currentItem.letter} for ${solvedWord}!`
            ];
            const randomEncouragement = encouragements[Math.floor(Math.random() * encouragements.length)];
            speakPhrase(randomEncouragement, true);

            // Auto-advance after 3 seconds (reduced from 5)
            timeoutRef.current = setTimeout(() => {
                nextPuzzle();
            }, 3000) as unknown as number;

        } else {
            // INCORRECT DROP - instant feedback
            setFeedback('incorrect');
            const incorrectText = dropped.word === "X-mas" ? "Christmas" : dropped.word;
            speakPhrase(`Oops! Try again!`, true);

            // Clear the dropped item and feedback after a short delay
            setTimeout(() => {
                setDroppedItem(null);
                setFeedback(null);
                setStreak(0); // Reset streak on error
            }, 1200); // Reduced from 1500
        }
    };

    const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
        e.preventDefault(); // Necessary to allow dropping
        e.dataTransfer.dropEffect = "move";
    };

    // --- Sub-Components ---

    const DraggableIcon: React.FC<{ item: typeof allDraggableItems[0] }> = ({ item }) => {
        const isDisabled = solvedItemIds.has(item.id);

        return (
            <div 
                draggable={!isDisabled}
                onDragStart={(e) => handleDragStart(e, item)}
                // Increased size and adjusted responsiveness with smooth transitions
                className={`p-2 md:p-3 bg-white rounded-lg shadow-lg border-2 transition-all duration-300 flex flex-col items-center justify-center space-y-1 w-14 h-18 md:w-20 md:h-24 text-center 
                    ${isDisabled 
                        ? 'opacity-30 cursor-default bg-gray-100 shadow-inner border-gray-200 grayscale' 
                        : 'hover:scale-110 hover:shadow-2xl active:cursor-grabbing cursor-grab border-purple-300 hover:border-purple-500'}`
                    }
            >
                <div className="text-3xl md:text-5xl leading-none">
                    {item.icon}
                </div>
                {/* Font size increased */}
                <p className="text-[0.6rem] md:text-sm font-bold text-gray-700 uppercase truncate max-w-full">{item.word}</p>
            </div>
        );
    };
    
    // --- Main Render ---

    // Split draggable items into four groups for the perimeter
    const topItems = allDraggableItems.slice(0, 7);
    const bottomItems = allDraggableItems.slice(7, 14);
    const leftItems = allDraggableItems.slice(14, 20); // 6 items
    const rightItems = allDraggableItems.slice(20, 26); // 6 items


    return (
        <div className="min-h-screen bg-gradient-to-br from-purple-200 to-pink-200 flex flex-col items-center p-4 font-['Inter']">
            <h1 className="text-4xl md:text-5xl font-extrabold text-gray-800 my-4 p-3 rounded-xl bg-white shadow-xl border-b-4 border-purple-400">
                Alphabet Match Quiz
            </h1>

            {/* Container for the entire 7x8 grid illusion: 6 left + 7 top/bottom + 2 central cols */}
            <div className="w-full max-w-6xl flex flex-col items-center">

                {/* Top Row (7 items) */}
                <div className="grid grid-cols-7 gap-2 md:gap-4 w-full max-w-4xl mx-auto mb-4">
                    {topItems.map(item => (
                        <DraggableIcon key={item.id} item={item} />
                    ))}
                </div>

                {/* Middle Section: 6 Left Items | Quiz Center | 6 Right Items */}
                <div className="flex w-full max-w-6xl gap-4">
                    
                    {/* Left Items (6 items, stacked vertically) */}
                    <div className="hidden lg:flex flex-col justify-around gap-4 w-1/12 min-w-[100px]">
                        {leftItems.map(item => (
                            <DraggableIcon key={item.id} item={item} />
                        ))}
                    </div>

                    {/* Central Quiz Box (responsive width) - Reduced max-width to 3xl */}
                    <div className="w-full lg:w-10/12 max-w-3xl">
                        <div className={`p-6 md:p-8 rounded-3xl bg-pink-500 transition-all duration-500 ease-in-out shadow-2xl shadow-pink-700 border-4 ${puzzleSolved ? 'border-green-400' : 'border-pink-300'}`}>
                            
                            <div className="bg-white p-4 md:p-6 rounded-2xl flex flex-col md:flex-row items-stretch gap-4 shadow-inner">
                                
                                {/* Left Side: Letter */}
                                <div className="flex-1 flex items-center justify-center border-4 border-gray-200 rounded-xl p-4 md:p-6 bg-yellow-50 shadow-lg">
                                    <span className="text-[8rem] md:text-[12rem] font-black leading-none text-gray-900 drop-shadow-lg">
                                        {currentItem.letter}
                                    </span>
                                </div>

                                {/* Right Side: Drop Zone */}
                                <div 
                                    onDrop={handleDrop}
                                    onDragOver={handleDragOver}
                                    className={`flex-1 min-h-[200px] flex flex-col items-center justify-center rounded-xl p-4 md:p-6 shadow-lg transition-all duration-300 relative
                                        ${feedback === 'correct' ? 'bg-green-100 border-4 border-green-500' : 
                                        feedback === 'incorrect' ? 'bg-red-100 border-4 border-red-500' :
                                        'bg-gray-50 border-4 border-dashed border-gray-400 hover:bg-gray-100'}`}
                                >
                                    
                                    {!puzzleSolved && !droppedItem && (
                                        <p className="text-xl md:text-2xl text-gray-600 font-semibold italic text-center">
                                            Drag the picture for "{currentItem.letter}" here.
                                        </p>
                                    )}

                                    {droppedItem && (
                                        <div className="flex flex-col items-center justify-center">
                                            <div className="text-[5rem] md:text-[7rem] leading-none mb-3">
                                                {droppedItem.icon}
                                            </div>
                                            <p className="text-3xl md:text-4xl font-extrabold text-gray-800 tracking-widest uppercase mt-3 text-center">
                                                {droppedItem.word}
                                            </p>
                                        </div>
                                    )}

                                    {/* Feedback Icons */}
                                    {feedback === 'correct' && (
                                        <CheckCircle className="absolute w-16 h-16 text-green-600 animate-pulse-once" />
                                    )}
                                    {feedback === 'incorrect' && (
                                        <XCircle className="absolute w-16 h-16 text-red-600 animate-wiggle" />
                                    )}
                                </div>
                            </div>

                            {/* Controls and Status */}
                            <div className="flex flex-col gap-4 mt-6 md:mt-8">
                                {/* Score Display */}
                                <div className="flex justify-center items-center gap-6">
                                    <div className="bg-gradient-to-r from-yellow-400 to-orange-400 px-6 py-3 rounded-2xl shadow-lg border-2 border-yellow-600">
                                        <p className="text-sm font-semibold text-gray-800">Score</p>
                                        <p className="text-3xl font-black text-white">{score}</p>
                                    </div>
                                    {streak > 0 && (
                                        <div className="bg-gradient-to-r from-green-400 to-emerald-400 px-6 py-3 rounded-2xl shadow-lg border-2 border-green-600 animate-bounce">
                                            <p className="text-sm font-semibold text-gray-800">Streak</p>
                                            <p className="text-3xl font-black text-white">🔥 {streak}</p>
                                        </div>
                                    )}
                                </div>

                                <div className="flex justify-center items-center gap-4">
                                    <button
                                        onClick={() => speakPhrase(currentItem.letter === "X" && currentItem.word === "X-mas" ? "X for..." : `${currentItem.letter} for...`)}
                                        disabled={isSpeaking || !isAuthReady || puzzleSolved}
                                        className={`p-3 md:p-4 rounded-full shadow-lg transition-all duration-300 flex items-center justify-center border-4 
                                            ${isSpeaking ? 'bg-gray-400 border-gray-500' : 'bg-yellow-400 border-yellow-600 hover:bg-yellow-300 active:scale-95'}`}
                                        aria-label="Repeat Prompt"
                                    >
                                        {isSpeaking ? (
                                            <Loader className="w-8 h-8 md:w-10 md:h-10 text-white animate-spin" />
                                        ) : (
                                            <Volume2 className="w-8 h-8 md:w-10 md:h-10 text-white" />
                                        )}
                                    </button>
                                    
                                    <button
                                        onClick={nextPuzzle}
                                        disabled={!puzzleSolved}
                                        className={`p-3 md:p-4 px-6 text-xl font-bold text-white rounded-xl shadow-lg transition-all duration-300 active:scale-95 
                                            ${puzzleSolved ? 'bg-green-600 hover:bg-green-700 animate-pulse' : 'bg-gray-400 cursor-not-allowed'}`}
                                    >
                                        {puzzleSolved ? "Next Letter ➜" : "Solve to Continue"}
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Items (6 items, stacked vertically) */}
                    <div className="hidden lg:flex flex-col justify-around gap-4 w-1/12 min-w-[100px]">
                        {rightItems.map(item => (
                            <DraggableIcon key={item.id} item={item} />
                        ))}
                    </div>
                </div>

                {/* Bottom Row (7 items) */}
                <div className="grid grid-cols-7 gap-2 md:gap-4 w-full max-w-4xl mx-auto mt-4">
                    {bottomItems.map(item => (
                        <DraggableIcon key={item.id} item={item} />
                    ))}
                </div>
            </div>

            <p className="mt-8 text-sm text-gray-500">
                Note: The full 26-item perimeter view requires a larger screen size.
            </p>
            
            {/* Custom CSS for Feedback Animation */}
            <style>{`
                @keyframes pulse-once {
                    0% { transform: scale(0.5); opacity: 0.5; }
                    50% { transform: scale(1.5); opacity: 1; }
                    100% { transform: scale(1); opacity: 1; }
                }
                .animate-pulse-once {
                    animation: pulse-once 0.5s ease-out 1;
                }
                @keyframes wiggle {
                    0%, 100% { transform: rotate(0deg); }
                    25% { transform: rotate(-5deg); }
                    75% { transform: rotate(5deg); }
                }
                .animate-wiggle {
                    animation: wiggle 0.3s ease-in-out 2;
                }
            `}</style>
        </div>
    );
};

export default DragAndDropLearner;