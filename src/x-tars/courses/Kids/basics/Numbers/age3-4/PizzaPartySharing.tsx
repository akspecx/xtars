import React, { useState, useCallback, useEffect } from 'react';

interface Friend {
  id: string;
  name: string;
  emoji: string;
  slices: number;
}

interface Level {
  id: string;
  totalSlices: number;
  friendCount: 2 | 3 | 4;
  instruction: string;
}

const levels: Level[] = [
  { id: 'level1', totalSlices: 4, friendCount: 2, instruction: 'Share 4 slices between 2 friends!' },
  { id: 'level2', totalSlices: 6, friendCount: 2, instruction: 'Share 6 slices between 2 friends!' },
  { id: 'level3', totalSlices: 6, friendCount: 3, instruction: 'Share 6 slices between 3 friends!' },
  { id: 'level4', totalSlices: 8, friendCount: 4, instruction: 'Share 8 slices between 4 friends!' },
  { id: 'level5', totalSlices: 12, friendCount: 3, instruction: 'Share 12 slices between 3 friends!' }
];

const friendOptions = [
  { id: 'friend1', name: 'Alex', emoji: '👦' },
  { id: 'friend2', name: 'Maya', emoji: '👧' },
  { id: 'friend3', name: 'Sam', emoji: '🧒' },
  { id: 'friend4', name: 'Zoe', emoji: '👶' }
];

const PizzaPartySharing: React.FC = () => {
  const [currentLevelIndex, setCurrentLevelIndex] = useState(0);
  const [friends, setFriends] = useState<Friend[]>([]);
  const [availableSlices, setAvailableSlices] = useState(0);
  const [draggedSlice, setDraggedSlice] = useState<number | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [score, setScore] = useState(0);

  const currentLevel = levels[currentLevelIndex];

  useEffect(() => {
    initializeLevel();
  }, [currentLevelIndex]);

  const initializeLevel = () => {
    const selectedFriends = friendOptions.slice(0, currentLevel.friendCount).map(f => ({
      ...f,
      slices: 0
    }));
    setFriends(selectedFriends);
    setAvailableSlices(currentLevel.totalSlices);
    setShowSuccess(false);
    setShowError(false);
  };

  const speak = useCallback((text: string) => {
    if (
      typeof window !== 'undefined' &&
      'speechSynthesis' in window &&
      typeof SpeechSynthesisUtterance !== 'undefined' &&
      !isSpeaking
    ) {
      window.speechSynthesis.cancel();
      setIsSpeaking(true);
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.85;
      utterance.pitch = 1.2;
      utterance.volume = 0.9;
      utterance.onend = () => setIsSpeaking(false);
      window.speechSynthesis.speak(utterance);
    }
  }, [isSpeaking]);

  const checkIfEqual = () => {
    if (friends.length === 0) return false;
    const firstCount = friends[0].slices;
    return friends.every(f => f.slices === firstCount) && availableSlices === 0;
  };

  const handleDragStart = (e: React.DragEvent, index: number) => {
    e.dataTransfer.effectAllowed = 'move';
    setDraggedSlice(index);
  };

  const handleTouchStart = (e: React.TouchEvent, index: number) => {
    setDraggedSlice(index);
    e.preventDefault();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, friendId: string) => {
    e.preventDefault();
    if (draggedSlice !== null && availableSlices > 0) {
      giveSliceToFriend(friendId);
    }
    setDraggedSlice(null);
  };

  const handleTouchEnd = (e: React.TouchEvent, friendId: string) => {
    if (draggedSlice !== null && availableSlices > 0) {
      giveSliceToFriend(friendId);
    }
    setDraggedSlice(null);
    e.preventDefault();
  };

  const giveSliceToFriend = (friendId: string) => {
    setFriends(prev => prev.map(f => 
      f.id === friendId ? { ...f, slices: f.slices + 1 } : f
    ));
    setAvailableSlices(prev => prev - 1);

    setTimeout(() => {
      const updatedFriends = friends.map(f => 
        f.id === friendId ? { ...f, slices: f.slices + 1 } : f
      );
      const newAvailable = availableSlices - 1;

      if (newAvailable === 0) {
        const firstCount = updatedFriends[0].slices;
        const allEqual = updatedFriends.every(f => f.slices === firstCount);

        if (allEqual) {
          setShowSuccess(true);
          setScore(prev => prev + 1);
          speak(`Perfect! Everyone gets ${firstCount} slices! That's fair sharing!`);
          
          setTimeout(() => {
            if (currentLevelIndex < levels.length - 1) {
              setCurrentLevelIndex(prev => prev + 1);
            } else {
              setCurrentLevelIndex(0);
            }
          }, 3000);
        } else {
          setShowError(true);
          speak('Oh no! Some friends have more than others. Try again!');
          setTimeout(() => {
            initializeLevel();
          }, 2000);
        }
      }
    }, 100);
  };

  const handlePlayInstructions = () => {
    speak(currentLevel.instruction + ' Make sure everyone gets the same amount!');
  };

  const handleReset = () => {
    initializeLevel();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-100 via-yellow-100 to-red-100 flex items-center justify-center p-4">
      <div className="max-w-5xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-orange-700 flex items-center gap-2">
              <span>🍕 Pizza Party Sharing</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Share pizza slices fairly with your friends!
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePlayInstructions}
              className="px-4 py-2 rounded-full bg-blue-500 hover:bg-blue-600 text-white text-sm font-semibold shadow-md active:scale-95 transition-transform"
            >
              🔊 Instructions
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 rounded-full bg-orange-500 hover:bg-orange-600 text-white text-sm font-semibold shadow-md active:scale-95 transition-transform"
            >
              🔄 Reset
            </button>
          </div>
        </div>

        {/* Score & Level */}
        <div className="flex justify-center gap-4 mb-6">
          <div className="px-6 py-2 bg-gradient-to-r from-orange-400 to-red-400 text-white rounded-full font-bold text-lg shadow-lg">
            Level: {currentLevelIndex + 1}/{levels.length}
          </div>
          <div className="px-6 py-2 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-full font-bold text-lg shadow-lg">
            Score: {score}
          </div>
        </div>

        {/* Instruction */}
        <div className="text-center mb-6 p-4 rounded-2xl bg-gradient-to-r from-yellow-200 to-orange-200">
          <p className="text-lg sm:text-xl font-bold text-gray-800">
            {currentLevel.instruction}
          </p>
        </div>

        {/* Pizza Slices Available */}
        <div className="mb-6">
          <div className="text-center mb-4">
            <h3 className="text-xl font-bold text-gray-700 mb-2">Pizza Slices to Share</h3>
            <div className="text-3xl font-extrabold text-orange-600">
              {availableSlices} slices left
            </div>
          </div>
          <div className="flex flex-wrap justify-center gap-3 p-4 bg-gray-50 rounded-2xl min-h-[120px]">
            {Array.from({ length: availableSlices }).map((_, index) => (
              <div
                key={index}
                draggable
                onDragStart={(e) => handleDragStart(e, index)}
                onTouchStart={(e) => handleTouchStart(e, index)}
                className={`w-16 h-16 sm:w-20 sm:h-20 cursor-grab active:cursor-grabbing transform hover:scale-110 transition-transform ${
                  draggedSlice === index ? 'opacity-50 scale-90' : ''
                }`}
              >
                <div className="text-5xl sm:text-6xl">🍕</div>
              </div>
            ))}
          </div>
        </div>

        {/* Friends' Plates */}
        <div className={`grid grid-cols-${currentLevel.friendCount} gap-4 mb-6`}>
          {friends.map((friend) => (
            <div
              key={friend.id}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, friend.id)}
              onTouchEnd={(e) => handleTouchEnd(e, friend.id)}
              className="p-4 rounded-2xl bg-gradient-to-br from-blue-100 to-cyan-100 border-4 border-dashed border-blue-300 hover:border-blue-500 transition-all"
            >
              <div className="text-center mb-2">
                <div className="text-4xl mb-1">{friend.emoji}</div>
                <div className="font-bold text-gray-700">{friend.name}</div>
              </div>
              <div className="bg-white rounded-xl p-3 min-h-[100px] flex flex-wrap justify-center items-center gap-2">
                {Array.from({ length: friend.slices }).map((_, i) => (
                  <span key={i} className="text-3xl">🍕</span>
                ))}
              </div>
              <div className="text-center mt-2 font-bold text-lg text-blue-700">
                {friend.slices} slice{friend.slices !== 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>

        {/* Success/Error Messages */}
        {showSuccess && (
          <div className="text-center p-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl animate-pulse">
            <div className="text-6xl mb-2">🎉</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              Perfect Sharing! Everyone is happy!
            </div>
          </div>
        )}

        {showError && (
          <div className="text-center p-6 bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl">
            <div className="text-6xl mb-2">😕</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              Oops! Not equal yet. Try again!
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PizzaPartySharing;
