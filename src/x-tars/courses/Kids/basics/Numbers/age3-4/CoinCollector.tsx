import React, { useState, useCallback, useEffect } from 'react';

interface Coin {
  id: string;
  type: 'penny' | 'nickel' | 'dime';
  emoji: string;
  color: string;
  name: string;
}

interface Bank {
  type: 'penny' | 'nickel' | 'dime';
  name: string;
  emoji: string;
  color: string;
  gradient: string;
  coins: string[];
}

const coinTypes: Coin[] = [
  { id: 'penny', type: 'penny', emoji: '🟤', color: 'bg-amber-600', name: 'Penny' },
  { id: 'nickel', type: 'nickel', emoji: '⚪', color: 'bg-gray-400', name: 'Nickel' },
  { id: 'dime', type: 'dime', emoji: '⚪', color: 'bg-gray-300', name: 'Dime' }
];

const CoinCollector: React.FC = () => {
  const [banks, setBanks] = useState<Bank[]>([
    { type: 'penny', name: 'Penny Bank', emoji: '🐷', color: 'bg-amber-100', gradient: 'from-amber-200 to-orange-300', coins: [] },
    { type: 'nickel', name: 'Nickel Bank', emoji: '🐷', color: 'bg-gray-100', gradient: 'from-gray-200 to-slate-300', coins: [] },
    { type: 'dime', name: 'Dime Bank', emoji: '🐷', color: 'bg-blue-100', gradient: 'from-blue-200 to-cyan-300', coins: [] }
  ]);
  
  const [shuffledCoins, setShuffledCoins] = useState<Coin[]>([]);
  const [draggedCoin, setDraggedCoin] = useState<Coin | null>(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showError, setShowError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);

  useEffect(() => {
    generateCoins();
  }, [level]);

  const generateCoins = () => {
    const coinsPerType = Math.min(3 + level, 6);
    const allCoins: Coin[] = [];
    
    coinTypes.forEach(coinType => {
      for (let i = 0; i < coinsPerType; i++) {
        allCoins.push({ ...coinType, id: `${coinType.type}-${i}` });
      }
    });

    const shuffled = allCoins.sort(() => Math.random() - 0.5);
    setShuffledCoins(shuffled);
    setBanks(banks.map(bank => ({ ...bank, coins: [] })));
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

  const handleDragStart = (e: React.DragEvent, coin: Coin) => {
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('coinId', coin.id);
    setDraggedCoin(coin);
  };

  const handleTouchStart = (e: React.TouchEvent, coin: Coin) => {
    setDraggedCoin(coin);
    e.preventDefault();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, bankType: 'penny' | 'nickel' | 'dime') => {
    e.preventDefault();
    const coinId = e.dataTransfer.getData('coinId');
    if (draggedCoin) {
      processCoinDrop(draggedCoin, bankType);
    }
    setDraggedCoin(null);
  };

  const handleTouchEnd = (e: React.TouchEvent, bankType: 'penny' | 'nickel' | 'dime') => {
    if (draggedCoin) {
      processCoinDrop(draggedCoin, bankType);
    }
    setDraggedCoin(null);
    e.preventDefault();
  };

  const processCoinDrop = (coin: Coin, bankType: 'penny' | 'nickel' | 'dime') => {
    if (coin.type === bankType) {
      // Correct match
      setShuffledCoins(prev => prev.filter(c => c.id !== coin.id));
      setBanks(prev => prev.map(bank => 
        bank.type === bankType 
          ? { ...bank, coins: [...bank.coins, coin.id] }
          : bank
      ));
      
      speak(`Correct! That's a ${coin.name}!`);
      setScore(prev => prev + 1);

      // Check if all coins are sorted
      setTimeout(() => {
        const remaining = shuffledCoins.filter(c => c.id !== coin.id);
        if (remaining.length === 0) {
          setShowSuccess(true);
          speak('Amazing! You sorted all the coins correctly! Great job!');
          setTimeout(() => {
            setLevel(prev => prev + 1);
          }, 3000);
        }
      }, 100);
    } else {
      // Wrong match
      setShowError(true);
      setErrorMessage(`Oops! That's a ${coin.name}, not a ${bankType}!`);
      speak(`Try again! That's a ${coin.name}.`);
      
      setTimeout(() => {
        setShowError(false);
        setErrorMessage('');
      }, 2000);
    }
  };

  const handlePlayInstructions = () => {
    speak('Drag each coin to its matching piggy bank! Pennies are brown, nickels are silver and bigger, dimes are silver and smaller!');
  };

  const handleReset = () => {
    generateCoins();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 flex items-center justify-center p-4">
      <div className="max-w-6xl w-full bg-white rounded-3xl shadow-2xl p-6 sm:p-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
          <div>
            <h1 className="text-2xl sm:text-4xl font-extrabold text-green-700 flex items-center gap-2">
              <span>🪙 Coin Collector</span>
            </h1>
            <p className="text-sm sm:text-base text-gray-600 mt-1">
              Sort coins into the correct piggy banks!
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
              className="px-4 py-2 rounded-full bg-green-500 hover:bg-green-600 text-white text-sm font-semibold shadow-md active:scale-95 transition-transform"
            >
              🔄 New Game
            </button>
          </div>
        </div>

        {/* Score & Level */}
        <div className="flex justify-center gap-4 mb-6">
          <div className="px-6 py-2 bg-gradient-to-r from-green-400 to-emerald-400 text-white rounded-full font-bold text-lg shadow-lg">
            Level: {level}
          </div>
          <div className="px-6 py-2 bg-gradient-to-r from-yellow-400 to-amber-400 text-white rounded-full font-bold text-lg shadow-lg">
            Coins Sorted: {score}
          </div>
        </div>

        {/* Coin Guide */}
        <div className="mb-6 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-2xl">
          <h3 className="text-center font-bold text-gray-700 mb-3">Coin Guide</h3>
          <div className="flex justify-center gap-6 flex-wrap">
            <div className="text-center">
              <div className="text-4xl mb-1">🟤</div>
              <div className="font-bold text-amber-700">Penny</div>
              <div className="text-xs text-gray-600">Brown</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-1">⚪</div>
              <div className="font-bold text-gray-600">Nickel</div>
              <div className="text-xs text-gray-600">Silver (Big)</div>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-1">⚪</div>
              <div className="font-bold text-gray-500">Dime</div>
              <div className="text-xs text-gray-600">Silver (Small)</div>
            </div>
          </div>
        </div>

        {/* Coins to Sort */}
        <div className="mb-6">
          <h3 className="text-center text-xl font-bold text-gray-700 mb-3">
            Coins to Sort ({shuffledCoins.length} left)
          </h3>
          <div className="flex flex-wrap justify-center gap-3 p-4 bg-gray-50 rounded-2xl min-h-[120px]">
            {shuffledCoins.map((coin) => (
              <div
                key={coin.id}
                draggable
                onDragStart={(e) => handleDragStart(e, coin)}
                onTouchStart={(e) => handleTouchStart(e, coin)}
                className={`w-16 h-16 sm:w-20 sm:h-20 rounded-full ${coin.color} border-4 border-white shadow-lg cursor-grab active:cursor-grabbing transform hover:scale-110 transition-all flex items-center justify-center ${
                  draggedCoin?.id === coin.id ? 'opacity-50 scale-90' : ''
                }`}
              >
                <div className="text-3xl">{coin.emoji}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Piggy Banks */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
          {banks.map((bank) => (
            <div
              key={bank.type}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, bank.type)}
              onTouchEnd={(e) => handleTouchEnd(e, bank.type)}
              className={`p-4 rounded-2xl bg-gradient-to-br ${bank.gradient} border-4 border-dashed border-gray-300 hover:border-gray-500 transition-all`}
            >
              <div className="text-center mb-3">
                <div className="text-5xl mb-2">{bank.emoji}</div>
                <div className="font-bold text-gray-800 text-lg">{bank.name}</div>
              </div>
              <div className={`${bank.color} rounded-xl p-3 min-h-[120px] flex flex-wrap justify-center items-center gap-2`}>
                {bank.coins.map((coinId, i) => {
                  const coinType = coinTypes.find(c => coinId.startsWith(c.type));
                  return (
                    <div key={i} className={`w-12 h-12 rounded-full ${coinType?.color} border-2 border-white shadow-md flex items-center justify-center`}>
                      <span className="text-2xl">{coinType?.emoji}</span>
                    </div>
                  );
                })}
              </div>
              <div className="text-center mt-2 font-bold text-gray-700">
                {bank.coins.length} coin{bank.coins.length !== 1 ? 's' : ''}
              </div>
            </div>
          ))}
        </div>

        {/* Success/Error Messages */}
        {showSuccess && (
          <div className="text-center p-6 bg-gradient-to-r from-green-400 to-emerald-500 rounded-2xl animate-pulse">
            <div className="text-6xl mb-2">🎉</div>
            <div className="text-2xl sm:text-3xl font-extrabold text-white">
              Perfect! All coins sorted correctly!
            </div>
          </div>
        )}

        {showError && (
          <div className="text-center p-4 bg-gradient-to-r from-red-400 to-pink-500 rounded-2xl">
            <div className="text-xl font-bold text-white">{errorMessage}</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CoinCollector;
