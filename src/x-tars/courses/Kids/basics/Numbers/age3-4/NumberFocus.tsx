import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
Trophy, RefreshCcw, AlertCircle,
CheckCircle2, Check, Hand, Sparkles,
Play, MousePointer2, Timer,
ChevronRight, Shuffle
} from 'lucide-react';


// --- Constants & Data ---
const COLORS = [
'#e63946', '#f4a261', '#e9c46a', '#2a9d8f', '#264653',
'#6d597a', '#b56576', '#fb8b24', '#3f37c9', '#4cc9f0'
];


const FRUITS = [
{ name: 'Apple', emoji: '🍎', plural: 'Apples' },
{ name: 'Banana', emoji: '🍌', plural: 'Bananas' },
{ name: 'Cherry', emoji: '🍒', plural: 'Cherries' },
{ name: 'Grape', emoji: '🍇', plural: 'Grapes' },
{ name: 'Strawberry', emoji: '🍓', plural: 'Strawberries' },
{ name: 'Orange', emoji: '🍊', plural: 'Oranges' },
{ name: 'Pear', emoji: '🍐', plural: 'Pears' },
{ name: 'Pineapple', emoji: '🍍', plural: 'Pineapples' },
{ name: 'Kiwi', emoji: '🥝', plural: 'Kiwis' },
{ name: 'Watermelon', emoji: '🍉', plural: 'Watermelons' },
];


const NUMBERS = Array.from({ length: 10 }, (_, i) => ({
value: i + 1,
color: COLORS[i],
fruit: FRUITS[i].name,
plural: FRUITS[i].plural,
emoji: FRUITS[i].emoji
}));


export default function App() {
const [mode, setMode] = useState('practice');
const [currentTarget, setCurrentTarget] = useState(null);
const [score, setScore] = useState(0);
const [feedback, setFeedback] = useState(null);
const [isPlaced, setIsPlaced] = useState(false);
const [isDragging, setIsDragging] = useState(false);
const [introStep, setIntroStep] = useState(0);
const [isIntroMode, setIsIntroMode] = useState(false);
const [isAutoDragging, setIsAutoDragging] = useState(false);
const [autoNextTimer, setAutoNextTimer] = useState(null);
const targetRef = useRef(null);
const introTimeoutRef = useRef(null);
const timerIntervalRef = useRef(null);
const storageRefs = useRef({});


// Initialize first target
useEffect(() => {
  const first = NUMBERS[0];
  setCurrentTarget(first);
  startIntroSequence(first);
  return () => {
    if (introTimeoutRef.current) clearTimeout(introTimeoutRef.current);
    if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
  };
}, [mode]);


// Auto-next Timer logic
useEffect(() => {
   if (autoNextTimer !== null && autoNextTimer > 0) {
       timerIntervalRef.current = setInterval(() => {
           setAutoNextTimer(prev => (prev > 0 ? prev - 1 : 0));
       }, 1000);
   } else if (autoNextTimer === 0) {
       handleNextSequential();
   }
   return () => clearInterval(timerIntervalRef.current);
}, [autoNextTimer]);


const speak = (text) => {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8;
    utterance.pitch = 1.2;
    window.speechSynthesis.speak(utterance);
  }
};


const startIntroSequence = (target) => {
   setIsIntroMode(true);
   setIntroStep(0);
   setIsPlaced(false);
   setAutoNextTimer(null);
   setIsAutoDragging(false);
  
   const runStep = (current) => {
       if (current < target.value) {
           const next = current + 1;
           setIntroStep(next);
           speak(`${next}`);
           // Reverted back to 1.2 seconds for snappier experience
           introTimeoutRef.current = setTimeout(() => runStep(next), 1200);
       } else {
           if (mode === 'kid') {
               speak(`That's ${target.value}! Now watch how we drag the block into its place.`);
               setTimeout(() => setIsAutoDragging(true), 1500);
           } else {
               speak(`Now it's your turn! Find number ${target.value} and drag it here.`);
               setIsIntroMode(false);
           }
       }
   };


   setTimeout(() => {
       speak(`Let's count to ${target.value}.`);
       setTimeout(() => runStep(0), 1000);
   }, 500);
};


// Calculate animation path for Kid Mode
const getAutoDragPath = () => {
   if (!currentTarget || !targetRef.current || !storageRefs.current[currentTarget.value]) return { x: 0, y: 0 };
  
   const targetRect = targetRef.current.getBoundingClientRect();
   const sourceRect = storageRefs.current[currentTarget.value].getBoundingClientRect();
  
   return {
       x: targetRect.left - sourceRect.left + (targetRect.width / 2) - (sourceRect.width / 2),
       y: targetRect.top - sourceRect.top + (targetRect.height / 2) - (sourceRect.height / 2)
   };
};


const handleNextSequential = () => {
   const currentIndex = NUMBERS.findIndex(n => n.value === currentTarget.value);
   const nextIndex = (currentIndex + 1) % NUMBERS.length;
   const nextTarget = NUMBERS[nextIndex];
   setCurrentTarget(nextTarget);
   startIntroSequence(nextTarget);
};


const handleNextRandom = () => {
   const available = NUMBERS.filter(n => n.value !== currentTarget.value);
   const random = available[Math.floor(Math.random() * available.length)];
   setCurrentTarget(random);
   startIntroSequence(random);
};


const handleSuccess = (value) => {
   setIsPlaced(true);
   setIsIntroMode(false);
   setIsAutoDragging(false);
   setScore(s => s + 1);
   speak(`Great job! That's number ${value}.`);
   // Success alert removed as per request
   setAutoNextTimer(10);
};


const triggerFeedback = (type, text) => {
  setFeedback({ type, text });
  setTimeout(() => setFeedback(null), 3000);
};


const handleDragEnd = (event, info, value) => {
  setIsDragging(false);
  if (isIntroMode || isPlaced) return;


  const x = info.point.x - window.scrollX;
  const y = info.point.y - window.scrollY;
   if (targetRef.current) {
    const rect = targetRef.current.getBoundingClientRect();
    const isOver = x >= rect.left && x <= rect.right && y >= rect.top && y <= rect.bottom;


    if (isOver) {
      if (value === currentTarget.value) {
        handleSuccess(value);
      } else {
        speak(`Try again! We are looking for number ${currentTarget.value}.`);
        triggerFeedback('error', `Look for number ${currentTarget.value}.`);
      }
    }
  }
};


const resetGame = () => {
  setScore(0);
  const first = NUMBERS[0];
  setCurrentTarget(first);
  startIntroSequence(first);
};


return (
  <div className="min-h-screen bg-[#fcfaf7] p-4 md:p-8 font-sans select-none overflow-x-hidden relative flex flex-col items-center text-[#4e342e]">
  
    <AnimatePresence>
      {feedback && (
        <motion.div
          initial={{ y: -100, opacity: 0, x: '-50%' }}
          animate={{ y: 16, opacity: 1, x: '-50%' }}
          exit={{ y: -100, opacity: 0, x: '-50%' }}
          className={`fixed top-0 left-1/2 z-[200] px-6 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border-b-4 w-[92%] max-w-md ${
            feedback.type === 'success' ? 'bg-[#1b4332] border-emerald-400 text-white' : 'bg-[#780000] border-red-400 text-white'
          }`}
        >
          {feedback.type === 'success' ? <CheckCircle2 size={24} /> : <AlertCircle size={24} />}
          <span className="font-bold text-sm tracking-tight">{feedback.text}</span>
        </motion.div>
      )}
    </AnimatePresence>


    {/* Header */}
    <div className="w-full max-w-5xl flex flex-col md:flex-row justify-between items-center gap-6 mb-8 px-2">
      <div className="flex flex-col items-center md:items-start text-center md:text-left">
          <h1 className="text-3xl md:text-4xl font-black flex items-center gap-3">
              <div className="w-12 h-12 bg-[#bc4749] rounded-xl shadow-lg flex items-center justify-center text-white text-2xl border-b-4 border-black/10">🔢</div>
              <span>Math Lab</span>
          </h1>
          <p className="text-xs font-bold text-[#8d6e63] mt-1 opacity-80 uppercase tracking-widest">Number Introduction & Practice</p>
      </div>


      <div className="bg-[#e2d6c3] p-1.5 rounded-2xl shadow-inner flex items-center gap-2 border border-stone-300">
         <button
           onClick={() => setMode('kid')}
           className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${mode === 'kid' ? 'bg-white text-rose-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
         >
           <Play size={14} fill={mode === 'kid' ? 'currentColor' : 'none'} />
           KID MODE
         </button>
         <button
           onClick={() => setMode('practice')}
           className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-black transition-all ${mode === 'practice' ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-500 hover:text-stone-700'}`}
         >
           <MousePointer2 size={14} fill={mode === 'practice' ? 'currentColor' : 'none'} />
           PRACTICE
         </button>
      </div>
    
      <div className="flex items-center gap-4">
          <div className="bg-white px-6 py-2 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center">
              <span className="text-[10px] uppercase font-black opacity-40 tracking-tighter">Correct</span>
              <span className="text-2xl font-black">{score}</span>
          </div>
          <button onClick={resetGame} className="p-4 bg-[#8d6e63] text-white rounded-xl hover:bg-[#5d4037] shadow-md border-b-4 border-[#5d4037]">
              <RefreshCcw size={20} />
          </button>
      </div>
    </div>


    {/* THE CHALLENGE BOARD */}
    <div className="w-full max-w-4xl bg-[#dfc4a1] rounded-[3rem] md:rounded-[5rem] p-6 md:p-12 shadow-[0_20px_50px_rgba(0,0,0,0.1)] border-b-[16px] md:border-b-[24px] border-[#c4a484] relative mb-10 overflow-hidden">
     
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
           {/* Visual Counting Area */}
           <div className="bg-white/50 backdrop-blur-sm rounded-[2.5rem] p-8 min-h-[300px] flex flex-col items-center justify-center border-2 border-dashed border-[#8d6e63]/30 shadow-inner relative">
               <div className="absolute top-4 bg-[#bc4749] px-6 py-1 rounded-full text-white font-black text-xs tracking-widest uppercase flex items-center gap-2">
                   <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                   {isIntroMode ? `Count: ${introStep}` : 'Ready!'}
               </div>
               <div className="grid grid-cols-3 gap-4 md:gap-6 mt-8">
                   {Array.from({ length: currentTarget?.value || 0 }).map((_, i) => (
                       <AnimatePresence key={i}>
                           {i < introStep && (
                               <motion.div
                                   initial={{ scale: 0, y: -20, rotate: -30 }}
                                   animate={{ scale: 1, y: 0, rotate: 0 }}
                                   className="text-5xl md:text-7xl drop-shadow-md"
                               >
                                   {currentTarget.emoji}
                               </motion.div>
                           )}
                       </AnimatePresence>
                   ))}
               </div>
           </div>


           {/* Target Drop Zone */}
           <div ref={targetRef} className="relative h-64 md:h-80 flex items-center justify-center">
               <motion.div
                   className={`absolute inset-0 rounded-[3rem] md:rounded-[4rem] shadow-[inset_0_12px_30px_rgba(0,0,0,0.1)] flex flex-col items-center justify-center border-4 md:border-[10px] border-dashed transition-all duration-500`}
                   style={{
                       backgroundColor: currentTarget && !isPlaced ? `${currentTarget.color}05` : isPlaced ? currentTarget.color : '#00000005',
                       borderColor: currentTarget ? `${currentTarget.color}40` : '#00000015'
                   }}
               >
                   {!isPlaced && currentTarget && (
                       <div className="relative flex flex-col items-center justify-center w-full h-full">
                           <span className="text-[10rem] md:text-[14rem] font-black opacity-[0.05]" style={{ color: currentTarget.color }}>
                               {currentTarget.value}
                           </span>
                          
                           {!isIntroMode && (
                               <div className="absolute inset-0 flex flex-col items-center justify-center text-[#5d4037]/30">
                                    <Hand size={56} className="animate-bounce" />
                                    <span className="text-[10px] font-black uppercase tracking-widest mt-2">Drop Here</span>
                               </div>
                           )}
                       </div>
                   )}


                   {isPlaced && currentTarget && (
                       <motion.div
                           initial={{ scale: 0.5, rotate: -15 }}
                           animate={{ scale: 1, rotate: 0 }}
                           className="flex flex-col items-center"
                       >
                           <span className="text-[10rem] md:text-[14rem] font-black text-white drop-shadow-2xl">
                               {currentTarget.value}
                           </span>
                           <div className="bg-white/20 p-4 rounded-full backdrop-blur-sm shadow-xl">
                               <Check size={80} className="text-white animate-pulse stroke-[4]" />
                           </div>
                       </motion.div>
                   )}
               </motion.div>
           </div>
      </div>
    </div>


    {/* SUPPLY DRAWER */}
    <div className="w-full max-w-5xl relative">
      <div className="bg-[#e2d6c3] p-8 md:p-12 rounded-[3rem] md:rounded-[4rem] shadow-inner border-4 border-[#bcaaa4]/30 relative">
          <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-white px-8 py-2 rounded-full shadow-md border border-stone-200 font-black text-[10px] uppercase tracking-[0.2em] text-[#8d6e63]">
              Number Storage
          </div>
        
          <div className="flex flex-wrap gap-4 md:gap-6 justify-center">
              {NUMBERS.map(n => (
                  <div
                   key={n.value}
                   ref={el => storageRefs.current[n.value] = el}
                   className="relative"
                  >
                      <DraggablePiece
                          color={n.color}
                          value={n.value}
                          emoji={n.emoji}
                          onDragStart={() => setIsDragging(true)}
                          onDragEnd={(e, i) => handleDragEnd(e, i, n.value)}
                          isDragging={isDragging}
                          isDisabled={isIntroMode && mode !== 'kid'}
                      />
                     
                      {/* KID MODE COMPLETE PATH ANIMATION */}
                      {isAutoDragging && currentTarget?.value === n.value && (
                          <motion.div
                               initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
                               animate={getAutoDragPath()}
                               transition={{
                                   duration: 3,
                                   ease: [0.45, 0.05, 0.55, 0.95]
                               }}
                               onAnimationComplete={() => handleSuccess(currentTarget.value)}
                               className="absolute inset-0 z-[100] pointer-events-none"
                          >
                              <div
                                  className="w-14 h-20 md:w-24 md:h-32 rounded-2xl md:rounded-[2.5rem] flex items-center justify-center text-3xl md:text-6xl font-black text-white shadow-2xl border-b-8 border-black/20"
                                  style={{ backgroundColor: n.color }}
                              >
                                  {n.value}
                                  <div className="absolute -bottom-8 -right-8">
                                      <Hand size={56} fill="white" className="text-stone-800 drop-shadow-lg" />
                                  </div>
                              </div>
                          </motion.div>
                      )}
                  </div>
              ))}
          </div>
      </div>
    </div>


    {/* BOTTOM NAVIGATION */}
    <div className="w-full max-w-4xl mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 items-center px-4">
       <div className="flex flex-col gap-3">
            <button
               onClick={handleNextSequential}
               className="group relative flex items-center justify-between w-full bg-emerald-600 hover:bg-emerald-700 text-white p-6 md:p-8 rounded-[2.5rem] font-black text-xl transition-all active:scale-95 shadow-xl border-b-8 border-emerald-800"
           >
               <div className="flex items-center gap-4">
                   <div className="bg-white/20 p-2 rounded-xl">
                       <ChevronRight size={24} />
                   </div>
                   <span>NEXT LESSON</span>
               </div>
               {autoNextTimer !== null && (
                   <div className="flex items-center gap-2 bg-black/20 px-4 py-2 rounded-full">
                       <Timer size={18} className="animate-spin text-emerald-200" />
                       <span className="text-sm font-mono">{autoNextTimer}s</span>
                   </div>
               )}
           </button>
       </div>


       <div className="flex flex-col gap-3">
           <button
               onClick={handleNextRandom}
               className="flex items-center justify-center gap-4 w-full bg-[#8d6e63] hover:bg-[#5d4037] text-white p-6 md:p-8 rounded-[2.5rem] font-black text-xl transition-all active:scale-95 shadow-xl border-b-8 border-[#5d4037]"
           >
               <Shuffle size={24} />
               NEXT RANDOM
           </button>
       </div>
    </div>


    <AnimatePresence>
      {score >= 20 && (
        <div className="fixed inset-0 z-[300] flex items-center justify-center bg-black/80 backdrop-blur-md p-6">
          <motion.div
            initial={{ scale: 0.8 }} animate={{ scale: 1 }}
            className="bg-white rounded-[4rem] p-12 max-w-md w-full text-center shadow-2xl border-t-[16px] border-[#1b4332]"
          >
            <div className="w-24 h-24 bg-[#ebf2ef] rounded-full flex items-center justify-center mx-auto mb-8">
              <Trophy size={56} className="text-[#1b4332]" />
            </div>
            <h2 className="text-5xl font-black text-[#5d4037] mb-4">Numbers King!</h2>
            <p className="text-[#8d6e63] mb-10 text-lg">You finished all the number blocks!</p>
            <button
              onClick={() => { setScore(0); handleNextSequential(); }}
              className="w-full py-5 bg-[#1b4332] text-white rounded-[2rem] font-black text-2xl hover:bg-[#081c15] shadow-xl border-b-8 border-[#081c15]"
            >
              LEARN AGAIN
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  </div>
);
}


function DraggablePiece({ color, value, emoji, onDragStart, onDragEnd, isDragging, isDisabled }) {
return (
  <motion.div
    drag={!isDisabled}
    dragSnapToOrigin
    onDragStart={onDragStart}
    onDragEnd={onDragEnd}
    whileDrag={{
      scale: 1.5,
      zIndex: 1000,
      rotate: -5,
      y: -60,
      boxShadow: "0 40px 100px -15px rgba(0, 0, 0, 0.5)",
    }}
    whileHover={!isDisabled ? { scale: 1.1, y: -4 } : {}}
    style={{ touchAction: 'none', backgroundColor: color }}
    className={`w-14 h-20 md:w-24 md:h-32 relative flex items-center justify-center rounded-2xl md:rounded-[2.5rem] shadow-lg font-black text-white border-b-8 md:border-b-[12px] border-black/20 overflow-hidden ${isDisabled ? 'opacity-50 cursor-default' : 'cursor-grab active:cursor-grabbing'}`}
  >
    <span className="absolute text-5xl md:text-7xl opacity-10 pointer-events-none">
      {emoji}
    </span>
    <span className="relative text-3xl md:text-6xl leading-none drop-shadow-md">
      {value}
    </span>
  </motion.div>
);
}