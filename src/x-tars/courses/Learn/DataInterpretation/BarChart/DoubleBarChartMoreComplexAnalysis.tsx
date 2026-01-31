// import React, { useState, useCallback, useRef, memo } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   ChevronLeft,
//   Trophy,
//   RotateCcw,
//   GraduationCap,
//   ArrowRight,
//   RefreshCcw,
//   IceCream,
//   BarChart3,
//   XCircle,
//   CheckCircle2,
//   Cookie,
//   ArrowRightCircle,
//   Users,
//   RotateCw,
//   Dessert,
//   ChevronRight,
//   TrendingUp
// } from 'lucide-react';
// import { HashRouter as Router, useNavigate } from 'react-router-dom';

// // ==========================================
// // UI CONFIGURATION
// // ==========================================
// const UI_CONFIG = {
//   headerSize: '18px',
//   textSize: '16px',
//   smallText: '14px',
//   classAColor: '#4f46e5', // Indigo
//   classBColor: '#fbbf24', // Gold
//   classAGradient: 'from-indigo-500 to-indigo-800',
//   classBGradient: 'from-amber-300 to-amber-500',
// };

// // ==========================================
// // DATA CONFIGURATIONS
// // ==========================================
// const SWEETS = [
//   { id: 'chocolate', label: 'Chocolate', icon: <Cookie size={24} />, baseColor: 'bg-amber-900' },
//   { id: 'iceCream', label: 'Ice Cream', icon: <IceCream size={24} />, baseColor: 'bg-sky-600' },
//   { id: 'donut', label: 'Donut', icon: <Dessert size={24} />, baseColor: 'bg-pink-600' }
// ];

// // Data updated to ensure only Chocolate has > 10 total votes
// const CLASS_DATA = {
//   classA: { chocolate: 4, iceCream: 8, donut: 4 }, 
//   classB: { chocolate: 8, iceCream: 2, donut: 5 }  
// };

// const SCENARIOS = [
//   {
//     id: 'both_groups_10',
//     question: "Which item is liked by both groups and has more than 10 votes?",
//     teacherIntro: "Look at the combined totals! One sweet is very popular in both classes and adds up to more than 10.",
//     answer: 'chocolate',
//     explanation: "Excellent! Chocolate has 12 votes (4 + 8), which is the only sweet with more than 10 total votes.",
//     wrongExplanation: "Check the totals again! Add Indigo + Gold for each sweet. Only one goes above 10.",
//     highlightType: 'sweet'
//   },
//   {
//     id: 'greatest_diff',
//     question: "In which item is the difference between the two classes the greatest?",
//     teacherIntro: "Look for the biggest gap! Which sweet has one very tall bar and one very short bar?",
//     answer: 'iceCream',
//     explanation: "Spot on! The difference for Ice Cream is 6 (8 - 2). That's much bigger than the gaps for Chocolate or Donut.",
//     wrongExplanation: "Compare the heights within each group. One sweet has a huge gap between the Indigo and Gold bars.",
//     highlightType: 'sweet'
//   },
//   {
//     id: 'max_total_a_less_b',
//     question: "Which category has maximum total, but Class A < Class B?",
//     teacherIntro: "This is a tough one! Find the sweet with the highest total where the Gold bar (B) is taller than the Indigo bar (A).",
//     answer: 'chocolate',
//     explanation: "Brilliant! Chocolate has the maximum total (12) and satisfies the condition that Class A (4) is less than Class B (8).",
//     wrongExplanation: "Two sweets have A < B (Chocolate and Donut), but which one has the higher combined total?",
//     highlightType: 'sweet'
//   }
// ];

// // ==========================================
// // OPTIMIZED CHART COMPONENT
// // ==========================================
// const GroupedChart = memo(({ activeVisual, currentScenario }) => {
//   return (
//     <div className="flex-1 flex flex-col relative px-12 sm:px-16 overflow-hidden min-h-0 pt-10">
//       <div className="flex-1 flex items-end justify-around border-b-2 border-white/10 relative h-full">
        
//         {/* Fixed Guideline Layer */}
//         <div className="absolute inset-0 pointer-events-none">
//           {[0, 2, 4, 6, 8, 10].map((val) => (
//             <div 
//               key={val} 
//               className="absolute w-full h-[1px] bg-white/5 flex items-center" 
//               style={{ bottom: `${(val / 10) * 100}%` }}
//             >
//               <span 
//                 className="absolute -left-10 font-black text-white/80 text-right w-8 leading-none transform -translate-y-[0.5px]" 
//                 style={{ fontSize: '14px' }}
//               >
//                 {val}
//               </span>
//             </div>
//           ))}
//         </div>

//         {/* Dynamic Tracking Overlay */}
//         <div className="absolute inset-0 pointer-events-none z-20">
//           <AnimatePresence>
//             {activeVisual.type && SWEETS.map((sweet, sIdx) => {
//               const isActive = activeVisual.sweetId === sweet.id;
//               if (!isActive) return null;

//               const valA = CLASS_DATA.classA[sweet.id];
//               const valB = CLASS_DATA.classB[sweet.id];
//               const hA = (valA / 10) * 100;
//               const hB = (valB / 10) * 100;
              
//               const groupWidth = 100 / 3;
//               const centerOfGroup = groupWidth * sIdx + (groupWidth / 2);
//               const barWidthOffset = 4.2;
//               const accentColor = activeVisual.type === 'correct' ? '#22c55e' : '#ef4444';

//               return (
//                 <React.Fragment key={`visuals-${sweet.id}`}>
//                   {/* Class A (Indigo) Track */}
//                   <motion.div 
//                     initial={{ width: 0, opacity: 0 }}
//                     animate={{ width: `${centerOfGroup - barWidthOffset}%`, opacity: 1 }}
//                     exit={{ width: 0, opacity: 0 }}
//                     className="absolute left-0 border-t-2 border-dashed"
//                     style={{ bottom: `${hA}%`, borderColor: accentColor }}
//                   />
//                   <motion.div 
//                     initial={{ scale: 0 }} animate={{ scale: 1 }}
//                     className="absolute font-black text-[10px] text-white bg-indigo-600 px-1.5 py-0.5 rounded shadow-lg flex items-center justify-center min-w-[22px] h-[16px] leading-none z-30"
//                     style={{ bottom: `${hA}%`, left: `${centerOfGroup - barWidthOffset}%`, transform: 'translate(-50%, 50%)' }}
//                   >
//                     {valA}
//                   </motion.div>

//                   {/* Class B (Gold) Track */}
//                   <motion.div 
//                     initial={{ width: 0, opacity: 0 }}
//                     animate={{ width: `${centerOfGroup + barWidthOffset}%`, opacity: 1 }}
//                     exit={{ width: 0, opacity: 0 }}
//                     className="absolute left-0 border-t-2 border-dashed"
//                     style={{ bottom: `${hB}%`, borderColor: accentColor }}
//                   />
//                   <motion.div 
//                     initial={{ scale: 0 }} animate={{ scale: 1 }}
//                     className="absolute font-black text-[10px] text-black bg-amber-400 px-1.5 py-0.5 rounded shadow-lg flex items-center justify-center min-w-[22px] h-[16px] leading-none z-30"
//                     style={{ bottom: `${hB}%`, left: `${centerOfGroup + barWidthOffset}%`, transform: 'translate(-50%, 50%)' }}
//                   >
//                     {valB}
//                   </motion.div>
//                 </React.Fragment>
//               );
//             })}
//           </AnimatePresence>
//         </div>

//         {/* BARS LAYER */}
//         {SWEETS.map((sweet) => {
//           const valA = CLASS_DATA.classA[sweet.id];
//           const valB = CLASS_DATA.classB[sweet.id];
//           const hA = (valA / 10) * 100;
//           const hB = (valB / 10) * 100;

//           const isHighlighted = activeVisual.type && activeVisual.sweetId === sweet.id;

//           return (
//             <div key={sweet.id} className="flex flex-col items-center justify-end h-full flex-1 max-w-[150px] relative z-10 px-2">
//               <div className="flex items-end gap-1 w-full h-full">
//                 <motion.div 
//                   className={`flex-1 rounded-t-md bg-gradient-to-t ${UI_CONFIG.classAGradient} border-x border-t relative`}
//                   initial={{ height: 0 }}
//                   animate={{ 
//                     height: `${hA}%`,
//                     borderColor: isHighlighted ? (activeVisual.type === 'correct' ? '#22c55e' : '#ef4444') : 'rgba(255,255,255,0.1)',
//                     borderWidth: isHighlighted ? '3px' : '1px',
//                   }}
//                   transition={{ type: 'spring', stiffness: 100, damping: 15 }}
//                 />
//                 <motion.div 
//                   className={`flex-1 rounded-t-md bg-gradient-to-t ${UI_CONFIG.classBGradient} border-x border-t relative`}
//                   initial={{ height: 0 }}
//                   animate={{ 
//                     height: `${hB}%`,
//                     borderColor: isHighlighted ? (activeVisual.type === 'correct' ? '#22c55e' : '#ef4444') : 'rgba(255,255,255,0.1)',
//                     borderWidth: isHighlighted ? '3px' : '1px',
//                   }}
//                   transition={{ type: 'spring', stiffness: 100, damping: 15 }}
//                 />
//               </div>
//             </div>
//           );
//         })}
//       </div>

//       <div className="flex justify-around items-start pt-4 shrink-0 h-16">
//         {SWEETS.map(sweet => (
//           <div key={sweet.id} className="flex flex-col items-center flex-1 max-w-[150px]">
//             <div className={`${sweet.baseColor} p-1.5 rounded-md text-white shadow-md mb-1`}>
//               {React.cloneElement(sweet.icon, { size: 16 })}
//             </div>
//             <span className="font-black text-white/90 uppercase tracking-tight text-center leading-none" style={{ fontSize: UI_CONFIG.textSize }}>
//               {sweet.label}
//             </span>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// });

// // ==========================================
// // MAIN LAB COMPONENT
// // ==========================================
// export default function LabContent() {
//   const navigate = useNavigate();
//   const [gameState, setGameState] = useState('intro');
//   const [scenarioIndex, setScenarioIndex] = useState(0);
//   const [quizFeedback, setQuizFeedback] = useState(null);
//   const [activeVisual, setActiveVisual] = useState({ sweetId: null, type: null });
  
//   const currentScenario = SCENARIOS[scenarioIndex];

//   const handleAnswerClick = (selectedId) => {
//     if (quizFeedback?.isCorrect) return;
//     const isCorrect = selectedId === currentScenario.answer;

//     if (isCorrect) {
//       setQuizFeedback({ 
//         isCorrect: true, 
//         explanation: currentScenario.explanation, 
//         nextState: scenarioIndex < SCENARIOS.length - 1 ? 'next' : 'mastery' 
//       });
//       setActiveVisual({ type: 'correct', sweetId: selectedId });
//     } else {
//       setQuizFeedback({ isCorrect: false, explanation: currentScenario.wrongExplanation });
//       setActiveVisual({ type: 'error', sweetId: selectedId });
//     }
//   };

//   const proceedFromQuiz = () => {
//     if (quizFeedback?.nextState === 'mastery') {
//       setGameState('mastery');
//     } else {
//       handleNext();
//     }
//   };

//   const handleNext = () => {
//     if (scenarioIndex < SCENARIOS.length - 1) {
//         setScenarioIndex(prev => prev + 1);
//         setQuizFeedback(null);
//         setActiveVisual({ sweetId: null, type: null });
//     }
//   };

//   const handlePrevious = () => {
//     if (scenarioIndex > 0) {
//         setScenarioIndex(prev => prev - 1);
//         setQuizFeedback(null);
//         setActiveVisual({ sweetId: null, type: null });
//     }
//   };

//   const handleRetry = () => {
//     setQuizFeedback(null);
//     setActiveVisual({ sweetId: null, type: null });
//   };

//   const handleRestart = () => {
//     setGameState('intro');
//     setScenarioIndex(0);
//     setQuizFeedback(null);
//     setActiveVisual({ sweetId: null, type: null });
//   };

//   return (
//     <div className="h-screen w-full bg-[#e6dccb] flex flex-col items-center overflow-hidden font-sans relative px-2 sm:px-4 select-none">
//       <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      
//       <header className="w-full max-w-[1500px] shrink-0 pt-2 sm:pt-4 relative z-20">
//         <div className="w-full bg-[#2a1a16] p-2 sm:p-3 rounded-2xl border-b-4 border-black/40 shadow-xl flex justify-between items-center text-white">
//           <div className="flex flex-col">
//             <button onClick={() => navigate('/')} className="flex items-center gap-1 text-[#a88a6d] font-black uppercase hover:text-white transition-all" style={{ fontSize: UI_CONFIG.smallText }}><ChevronLeft size={14} /> Dashboard</button>
//             <h1 className="text-white font-black uppercase tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Advanced Comparison Lab</h1>
//           </div>
//           <div className="flex items-center gap-2 bg-black/30 px-3 py-1 rounded-full border border-white/10 shadow-inner">
//              <TrendingUp className="text-yellow-400" size={16} />
//              <span className="font-black uppercase tracking-widest text-white/70 whitespace-nowrap" style={{ fontSize: UI_CONFIG.textSize }}>Interpretation</span>
//           </div>
//         </div>
//       </header>

//       <div className="flex-1 w-full max-w-[900px] py-2 sm:py-4 flex flex-col gap-3 sm:gap-4 relative z-10 overflow-hidden">
        
//         {/* TOP DIV: Comparison Section */}
//         <div className="flex-[1.4] bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative flex flex-col overflow-hidden min-h-0">
//           <div className="flex-1 bg-[#3e2723] p-3 sm:p-6 rounded-2xl flex flex-col shadow-inner overflow-hidden">
//             <div className="flex justify-between items-center mb-2 shrink-0 px-2">
//                 <div className="flex flex-col">
//                     <h3 className="text-white font-black uppercase tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Advanced Poll Data</h3>
//                     <div className="flex items-center gap-4 mt-1">
//                         <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-indigo-600" /><span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Class A (Indigo)</span></div>
//                         <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-amber-400" /><span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Class B (Gold)</span></div>
//                     </div>
//                 </div>
//                 <button onClick={handleRestart} className="p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white/40 border border-white/10 transition-colors"><RotateCcw size={16} /></button>
//             </div>
//             <GroupedChart activeVisual={activeVisual} currentScenario={currentScenario} />
//           </div>
//         </div>

//         {/* BOTTOM DIV: Interaction & Navigation Area */}
//         <div className="flex-1 shrink-0 bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative overflow-hidden">
//           <div className="h-full bg-[#3e2723] rounded-2xl flex flex-col overflow-hidden shadow-inner">
            
//             {gameState === 'quiz' && (
//                 <div className="w-full bg-black/30 px-4 py-2 border-b border-white/5 flex justify-between items-center shrink-0">
//                     <button onClick={handlePrevious} disabled={scenarioIndex === 0} className="flex items-center gap-2 text-white font-black uppercase tracking-tighter disabled:opacity-10 hover:text-yellow-400 transition-colors" style={{ fontSize: '11px' }}>
//                         <ChevronLeft size={16} /> PREV
//                     </button>
//                     <div className="flex items-center gap-2">
//                         <div className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-pulse" />
//                         <span className="text-white/60 font-black tracking-[0.2em] uppercase" style={{ fontSize: '10px' }}>ANALYSIS {scenarioIndex + 1} / {SCENARIOS.length}</span>
//                     </div>
//                     <button onClick={handleNext} disabled={scenarioIndex === SCENARIOS.length - 1 || !quizFeedback?.isCorrect} className="flex items-center gap-2 text-white font-black uppercase tracking-tighter disabled:opacity-10 hover:text-yellow-400 transition-colors" style={{ fontSize: '11px' }}>
//                         NEXT <ChevronRight size={16} />
//                     </button>
//                 </div>
//             )}

//             <div className="flex-1 p-4 flex flex-col items-center justify-center">
//                 <AnimatePresence mode="wait">
//                     <motion.div key={gameState + scenarioIndex + (quizFeedback ? '-fb' : '')} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 w-full">
                    
//                     {!quizFeedback && (
//                         <div className="flex items-center gap-3 w-full max-w-2xl bg-black/20 p-2 rounded-2xl border border-white/5">
//                             <div className="w-10 h-10 sm:w-14 sm:h-14 bg-amber-100 rounded-full border-2 border-amber-600 shadow-lg overflow-hidden shrink-0">
//                                 <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher&backgroundColor=ffdfbf" alt="Teacher" />
//                             </div>
//                             <h2 className="text-white font-bold italic leading-tight flex-1" style={{ fontSize: UI_CONFIG.textSize }}>
//                                 "{gameState === 'intro' ? "Ready for a deeper dive? Let's analyze our comparative data classes!" : currentScenario.question}"
//                             </h2>
//                         </div>
//                     )}

//                     {gameState === 'intro' && (
//                         <button onClick={() => setGameState('quiz')} className="bg-yellow-400 text-black px-10 py-3 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl border-b-4 border-yellow-700" style={{ fontSize: UI_CONFIG.textSize }}>Start Data Analysis <ArrowRightCircle size={20} /></button>
//                     )}

//                     {gameState === 'quiz' && !quizFeedback && (
//                         <div className="grid grid-cols-3 gap-3 w-full max-w-2xl px-2">
//                             {SWEETS.map(s => (
//                                 <button key={s.id} onClick={() => handleAnswerClick(s.id)} className="bg-white/5 hover:bg-white/10 border-2 border-white/10 p-4 rounded-xl text-white font-bold flex items-center justify-center gap-3 transition-all" style={{ fontSize: UI_CONFIG.textSize }}>
//                                     <div className={`${s.baseColor} p-1 rounded-md`}>{React.cloneElement(s.icon, { size: 16 })}</div>
//                                     {s.label}
//                                 </button>
//                             ))}
//                         </div>
//                     )}

//                     {quizFeedback && (
//                         <div className="flex flex-col items-center gap-3 w-full">
//                             <div className={`flex items-center gap-3 p-3 rounded-2xl border-2 w-full max-w-md ${quizFeedback.isCorrect ? 'bg-green-500/10 border-green-500/50 text-green-100' : 'bg-red-500/10 border-red-500/50 text-red-100'}`}>
//                                 {quizFeedback.isCorrect ? <CheckCircle2 size={20} className="shrink-0" /> : <XCircle size={20} className="shrink-0" />}
//                                 <p className="font-bold leading-tight" style={{ fontSize: UI_CONFIG.smallText }}>{quizFeedback.explanation}</p>
//                             </div>
//                             <button onClick={quizFeedback.isCorrect ? proceedFromQuiz : handleRetry} className={`${quizFeedback.isCorrect ? 'bg-white text-black' : 'bg-amber-500 text-white border-b-4 border-amber-800'} px-12 py-3 rounded-full font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl hover:scale-105`} style={{ fontSize: UI_CONFIG.textSize }}>
//                                 {quizFeedback.isCorrect ? (scenarioIndex < SCENARIOS.length - 1 ? 'Next Analysis' : 'Finish Lab') : 'Try Again'} {quizFeedback.isCorrect ? <ArrowRight size={18} /> : <RotateCw size={18} />}
//                             </button>
//                         </div>
//                     )}
//                     </motion.div>
//                 </AnimatePresence>
//             </div>
//           </div>
//         </div>

//       </div>

//       <AnimatePresence>
//         {gameState === 'mastery' && (
//             <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
//                 <div className="bg-[#e6dccb] w-full max-w-xl p-8 rounded-[2.5rem] border-8 border-[#3e2723] text-center shadow-2xl relative overflow-hidden">
//                     <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
//                     <div className="relative z-10 flex flex-col items-center">
//                         <div className="w-16 h-16 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-6 border-2 border-white shadow-xl"><Trophy size={40} className="animate-bounce" /></div>
//                         <h2 className="text-2xl sm:text-3xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter">Analysis Master!</h2>
//                         <p className="text-[#3e2723] font-bold mb-8 italic px-4 leading-relaxed text-center" style={{ fontSize: UI_CONFIG.textSize }}>
//                             "Phenomenal! You've successfully learned how to interpret complex double bar charts, satisfying multiple conditions at once. You're a true data scientist!"
//                         </p>
//                         <div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4">
//                             <button onClick={handleRestart} className={`bg-[#3e2723] text-[#e6dccb] px-8 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl border-b-4 border-black flex items-center justify-center gap-2`} style={{ fontSize: UI_CONFIG.textSize }}><RefreshCcw size={16} /> Re-start</button>
//                             <button className="bg-green-600 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl border-b-4 border-green-900 flex items-center justify-center gap-2" style={{ fontSize: UI_CONFIG.textSize }}>Finish Lab <ArrowRightCircle size={18} /></button>
//                         </div>
//                     </div>
//                 </div>
//             </motion.div>
//         )}
//       </AnimatePresence>

//       <div className="shrink-0 mb-2 flex flex-col items-center text-center opacity-20">
//           <GraduationCap size={24} className="text-[#3e2723] mb-1" />
//           <h3 className={`text-[#3e2723] font-black uppercase`} style={{ fontSize: UI_CONFIG.smallText }}>Analytical Logic Lab</h3>
//       </div>
//     </div>
//   );
// }

// // export default function App() {
// //   return (
// //     <Router>
// //       <LabContent />
// //       <style>{`
// //         @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700;900&display=swap');
// //         html, body, #root { height: 100%; margin: 0; padding: 0; overflow: hidden; }
// //         body { font-family: 'Noto Sans', sans-serif; background: #f1f0ee; user-select: none; }
// //         .no-scrollbar::-webkit-scrollbar { display: none; }
// //         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
// //         .text-shadow-sm { text-shadow: 0 1px 1px rgba(0,0,0,0.1); }
// //       `}</style>
// //     </Router>
// //   );
// // }

import React, { useState, useCallback, useRef, memo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  Trophy,
  RotateCcw,
  GraduationCap,
  ArrowRight,
  RefreshCcw,
  IceCream,
  BarChart3,
  XCircle,
  CheckCircle2,
  Cookie,
  ArrowRightCircle,
  Users,
  RotateCw,
  Dessert,
  ChevronRight,
  TrendingUp,
  Lightbulb,
  Target,
  MinusCircle,
  PlusCircle
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// UI CONFIGURATION
// ==========================================
const UI_CONFIG = {
  headerSize: '18px',
  textSize: '16px',
  smallText: '14px',
  classAColor: '#4f46e5', // Indigo
  classBColor: '#fbbf24', // Gold
  classAGradient: 'from-indigo-500 to-indigo-800',
  classBGradient: 'from-amber-300 to-amber-500',
};

// ==========================================
// DATA CONFIGURATIONS
// ==========================================
const SWEETS = [
  { id: 'chocolate', label: 'Chocolate', icon: <Cookie size={24} />, baseColor: 'bg-amber-900' },
  { id: 'iceCream', label: 'Ice Cream', icon: <IceCream size={24} />, baseColor: 'bg-sky-600' },
  { id: 'donut', label: 'Donut', icon: <Dessert size={24} />, baseColor: 'bg-pink-600' }
];

// CONCEPT DATA: Choc: 12, Ice: 10, Donut: 9
const CONCEPT_DATA = {
  classA: { chocolate: 4, iceCream: 8, donut: 4 }, 
  classB: { chocolate: 8, iceCream: 2, donut: 5 }  
};

// PRACTICE DATA: Choc: 9, Ice: 13, Donut: 10 (New scenario)
const PRACTICE_DATA = {
  classA: { chocolate: 2, iceCream: 5, donut: 9 }, 
  classB: { chocolate: 7, iceCream: 8, donut: 1 }  
};

// CONCEPT SCENARIOS
const CONCEPT_SCENARIOS = [
  {
    id: 'concept_sum',
    title: "Sum of Total Votes",
    icon: <PlusCircle size={14} />,
    question: "Which has more than 10 votes?",
    conceptExplainer: "Look at Chocolate: 4 + 8 = 12. Since 12 is greater than 10, Chocolate is our answer!",
    answer: 'chocolate',
    highlightType: 'sweet'
  },
  {
    id: 'concept_diff',
    title: "Difference Between Classes",
    icon: <MinusCircle size={14} />,
    question: "Where is the difference greatest?",
    conceptExplainer: "Ice Cream has a gap of 6 (8 vs 2). Chocolate gap is only 4. Donut gap is just 1!",
    answer: 'iceCream',
    highlightType: 'sweet'
  },
  {
    id: 'concept_condition',
    title: "Matching Multi-Conditions",
    icon: <TrendingUp size={14} />,
    question: "Highest total but Class A < Class B?",
    conceptExplainer: "Chocolate has the highest total (12) and its Class B (8) is taller than Class A (4).",
    answer: 'chocolate',
    highlightType: 'sweet'
  }
];

// PRACTICE SCENARIOS (New Logic for Practice Data)
const PRACTICE_SCENARIOS = [
  {
    id: 'prac_sum_ice',
    question: "Which item has more than 12 combined votes?",
    answer: 'iceCream',
    explanation: "Correct! Ice Cream has 13 total votes (5 + 8), which is higher than Chocolate (9) or Donut (10).",
    wrongExplanation: "Add 'em up! Choc: 2+7=9. Ice: 5+8=13. Donut: 9+1=10. Which is > 12?",
    highlightType: 'sweet'
  },
  {
    id: 'prac_great_gap',
    question: "Which sweet has the largest difference (gap) between the classes?",
    answer: 'donut',
    explanation: "Spot on! The gap for Donut is 8 (9 - 1). This is much larger than the gap for Ice Cream (3).",
    wrongExplanation: "Compare the bars within each group. One sweet has a giant gap of 8 students!",
    highlightType: 'sweet'
  },
  {
    id: 'prac_condition',
    question: "Which sweet has a total of 10 or more, but Class A > Class B?",
    answer: 'donut',
    explanation: "Brilliant! Donut has 10 total votes and satisfies Class A (9) being greater than Class B (1).",
    wrongExplanation: "Ice Cream has 13 total, but Class A < Class B. We need Class A to be higher!",
    highlightType: 'sweet'
  }
];

// ==========================================
// OPTIMIZED CHART COMPONENT
// ==========================================
const GroupedChart = memo(({ activeVisual, currentScenario, isConceptMode, data }) => {
  return (
    <div className="flex-1 flex flex-col relative px-12 sm:px-16 overflow-hidden min-h-0 pt-10">
      <div className="flex-1 flex items-end justify-around border-b-2 border-white/10 relative h-full">
        
        {/* Fixed Guideline Layer */}
        <div className="absolute inset-0 pointer-events-none">
          {[0, 2, 4, 6, 8, 10].map((val) => (
            <div key={val} className="absolute w-full h-[1px] bg-white/5 flex items-center" style={{ bottom: `${(val / 10) * 100}%` }}>
              <span className="absolute -left-10 font-black text-white/80 text-right w-8 leading-none transform -translate-y-[0.5px]" style={{ fontSize: '14px' }}>{val}</span>
            </div>
          ))}
        </div>

        {/* Dynamic Tracking Overlay */}
        <div className="absolute inset-0 pointer-events-none z-20">
          <AnimatePresence>
            {(activeVisual.type || isConceptMode) && SWEETS.map((sweet, sIdx) => {
              const isActive = isConceptMode 
                ? sweet.id === currentScenario.answer 
                : activeVisual.sweetId === sweet.id;

              if (!isActive) return null;

              const valA = data.classA[sweet.id];
              const valB = data.classB[sweet.id];
              const hA = (valA / 10) * 100;
              const hB = (valB / 10) * 100;
              
              const groupWidth = 100 / 3;
              const centerOfGroup = groupWidth * sIdx + (groupWidth / 2);
              const barWidthOffset = 4.2;
              const accentColor = isConceptMode ? '#fbbf24' : (activeVisual.type === 'correct' ? '#22c55e' : '#ef4444');

              return (
                <React.Fragment key={`visuals-${sweet.id}`}>
                  <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: `${centerOfGroup - barWidthOffset}%`, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="absolute left-0 border-t-2 border-dashed" style={{ bottom: `${hA}%`, borderColor: accentColor }} />
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute font-black text-[10px] text-white bg-indigo-600 px-1.5 py-0.5 rounded shadow-lg flex items-center justify-center min-w-[22px] h-[16px] leading-none z-30" style={{ bottom: `${hA}%`, left: `${centerOfGroup - barWidthOffset}%`, transform: 'translate(-50%, 50%)' }}>{valA}</motion.div>
                  <motion.div initial={{ width: 0, opacity: 0 }} animate={{ width: `${centerOfGroup + barWidthOffset}%`, opacity: 1 }} exit={{ width: 0, opacity: 0 }} className="absolute left-0 border-t-2 border-dashed" style={{ bottom: `${hB}%`, borderColor: accentColor }} />
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="absolute font-black text-[10px] text-black bg-amber-400 px-1.5 py-0.5 rounded shadow-lg flex items-center justify-center min-w-[22px] h-[16px] leading-none z-30" style={{ bottom: `${hB}%`, left: `${centerOfGroup + barWidthOffset}%`, transform: 'translate(-50%, 50%)' }}>{valB}</motion.div>

                  {(isConceptMode || (activeVisual.type === 'correct')) && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="absolute top-[-35px] font-black text-white bg-black/80 px-3 py-1 rounded-full border border-yellow-400/50 whitespace-nowrap z-50 flex items-center gap-2" style={{ left: `${centerOfGroup}%`, transform: 'translateX(-50%)', fontSize: '11px' }}>
                        {currentScenario.id.includes('diff') || currentScenario.id.includes('gap') ? (
                            <span className="text-pink-400">GAP: {Math.abs(valA - valB)}</span>
                        ) : (
                            <span className="text-yellow-400">TOTAL: {valA + valB}</span>
                        )}
                    </motion.div>
                  )}
                </React.Fragment>
              );
            })}
          </AnimatePresence>
        </div>

        {/* BARS LAYER */}
        {SWEETS.map((sweet) => {
          const valA = data.classA[sweet.id];
          const valB = data.classB[sweet.id];
          const hA = (valA / 10) * 100;
          const hB = (valB / 10) * 100;

          const isHighlighted = isConceptMode 
            ? sweet.id === currentScenario.answer 
            : (activeVisual.type && activeVisual.sweetId === sweet.id);

          return (
            <div key={sweet.id} className="flex flex-col items-center justify-end h-full flex-1 max-w-[150px] relative z-10 px-2">
              <div className="flex items-end gap-1 w-full h-full">
                <motion.div 
                  className={`flex-1 rounded-t-md bg-gradient-to-t ${UI_CONFIG.classAGradient} border-x border-t relative`}
                  initial={{ height: 0 }}
                  animate={{ height: `${hA}%`, borderColor: isHighlighted ? (isConceptMode ? '#fbbf24' : (activeVisual.type === 'correct' ? '#22c55e' : '#ef4444')) : 'rgba(255,255,255,0.1)', borderWidth: isHighlighted ? '3px' : '1px' }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                />
                <motion.div 
                  className={`flex-1 rounded-t-md bg-gradient-to-t ${UI_CONFIG.classBGradient} border-x border-t relative`}
                  initial={{ height: 0 }}
                  animate={{ height: `${hB}%`, borderColor: isHighlighted ? (isConceptMode ? '#fbbf24' : (activeVisual.type === 'correct' ? '#22c55e' : '#ef4444')) : 'rgba(255,255,255,0.1)', borderWidth: isHighlighted ? '3px' : '1px' }}
                  transition={{ type: 'spring', stiffness: 100, damping: 15 }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex justify-around items-start pt-4 shrink-0 h-16">
        {SWEETS.map(sweet => (
          <div key={sweet.id} className="flex flex-col items-center flex-1 max-w-[150px]">
            <div className={`${sweet.baseColor} p-1.5 rounded-md text-white shadow-md mb-1`}>
              {React.cloneElement(sweet.icon, { size: 16 })}
            </div>
            <span className="font-black text-white/90 uppercase tracking-tight text-center leading-none" style={{ fontSize: UI_CONFIG.textSize }}>
              {sweet.label}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
});

// ==========================================
// MAIN LAB COMPONENT
// ==========================================
export default function LabContent() {
  const navigate = useNavigate();
  const [gameState, setGameState] = useState('intro'); 
  const [mode, setMode] = useState('concept'); 
  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [activeVisual, setActiveVisual] = useState({ sweetId: null, type: null });
  
  const scenarios = mode === 'concept' ? CONCEPT_SCENARIOS : PRACTICE_SCENARIOS;
  const currentScenario = scenarios[scenarioIndex];
  const activeData = mode === 'concept' ? CONCEPT_DATA : PRACTICE_DATA;

  const handleNext = useCallback(() => {
    if (scenarioIndex < scenarios.length - 1) {
        setScenarioIndex(prev => prev + 1);
        setQuizFeedback(null);
        setActiveVisual({ sweetId: null, type: null });
    } else {
        if (mode === 'concept') {
            setMode('practice');
            setScenarioIndex(0);
            setQuizFeedback(null);
            setActiveVisual({ sweetId: null, type: null });
        } else {
            setGameState('mastery');
        }
    }
  }, [scenarioIndex, mode, scenarios.length]);

  const handleAnswerClick = (selectedId) => {
    if (quizFeedback?.isCorrect) return;
    const isCorrect = selectedId === currentScenario.answer;

    if (isCorrect) {
      setQuizFeedback({ 
        isCorrect: true, 
        explanation: currentScenario.explanation, 
        nextState: scenarioIndex < scenarios.length - 1 ? 'next' : 'mastery' 
      });
      setActiveVisual({ type: 'correct', sweetId: selectedId });
    } else {
      setQuizFeedback({ isCorrect: false, explanation: currentScenario.wrongExplanation });
      setActiveVisual({ type: 'error', sweetId: selectedId });
    }
  };

  const handleRestart = () => {
    setGameState('intro');
    setMode('concept');
    setScenarioIndex(0);
    setQuizFeedback(null);
    setActiveVisual({ sweetId: null, type: null });
  };

  return (
    <div className="h-screen w-full bg-[#e6dccb] flex flex-col items-center overflow-hidden font-sans relative px-2 sm:px-4 select-none">
      <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      
      <header className="w-full max-w-[1500px] shrink-0 pt-2 sm:pt-4 relative z-20">
        <div className="w-full bg-[#2a1a16] p-2 sm:p-3 rounded-2xl border-b-4 border-black/40 shadow-xl flex justify-between items-center text-white">
          <div className="flex flex-col">
            <button onClick={() => navigate('/')} className={`flex items-center gap-1 text-[#a88a6d] font-black uppercase hover:text-white transition-all`} style={{ fontSize: UI_CONFIG.smallText }}><ChevronLeft size={14} /> Dashboard</button>
            <h1 className="text-white font-black uppercase tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Double Chart Mastery</h1>
          </div>
          <div className="flex items-center gap-2 bg-black/30 p-1 rounded-full border border-white/10 shadow-inner">
             <button 
                onClick={() => { setMode('concept'); setScenarioIndex(0); setQuizFeedback(null); setActiveVisual({sweetId: null, type: null}); }}
                className={`px-4 py-1.5 rounded-full font-black uppercase text-[10px] transition-all flex items-center gap-1.5 ${mode === 'concept' ? 'bg-yellow-400 text-black shadow-lg' : 'text-white/40 hover:text-white'}`}
             >
                <Lightbulb size={12} /> Concept
             </button>
             <button 
                onClick={() => { setMode('practice'); setScenarioIndex(0); setQuizFeedback(null); setActiveVisual({sweetId: null, type: null}); }}
                className={`px-4 py-1.5 rounded-full font-black uppercase text-[10px] transition-all flex items-center gap-1.5 ${mode === 'practice' ? 'bg-green-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}
             >
                <Target size={12} /> Practice
             </button>
          </div>
        </div>
      </header>

      <div className="flex-1 w-full max-w-[900px] py-2 sm:py-4 flex flex-col gap-3 sm:gap-4 relative z-10 overflow-hidden">
        
        {/* TOP DIV: Visual Data */}
        <div className="flex-[1.4] bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative flex flex-col overflow-hidden min-h-0">
          <div className="flex-1 bg-[#3e2723] p-3 sm:p-6 rounded-2xl flex flex-col shadow-inner overflow-hidden">
            <div className="flex justify-between items-center mb-2 shrink-0 px-2">
                <div className="flex flex-col">
                    <h3 className="text-white font-black uppercase tracking-tighter" style={{ fontSize: UI_CONFIG.headerSize }}>Statistical Insight</h3>
                    <div className="flex items-center gap-4 mt-1">
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-indigo-600" /><span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Class A (Indigo)</span></div>
                        <div className="flex items-center gap-1.5"><div className="w-3 h-3 rounded-sm bg-amber-400" /><span className="text-white/40 font-bold uppercase tracking-widest text-[10px]">Class B (Gold)</span></div>
                    </div>
                </div>
                <button onClick={handleRestart} className="p-1.5 bg-black/40 hover:bg-black/60 rounded-full text-white/40 border border-white/10 transition-colors"><RotateCcw size={16} /></button>
            </div>
            <GroupedChart 
                activeVisual={activeVisual} 
                currentScenario={currentScenario} 
                isConceptMode={gameState !== 'intro' && mode === 'concept'} 
                data={activeData}
            />
          </div>
        </div>

        {/* BOTTOM DIV: Interaction area */}
        <div className="flex-1 shrink-0 bg-[#2a1a16] p-1 rounded-3xl shadow-2xl border-4 border-black/40 relative overflow-hidden">
          <div className="h-full bg-[#3e2723] rounded-2xl flex flex-col overflow-hidden shadow-inner">
            
            {gameState !== 'intro' && (
                <div className="w-full bg-black/30 px-4 py-2 border-b border-white/5 flex justify-between items-center shrink-0">
                    <button onClick={() => setScenarioIndex(prev => Math.max(0, prev - 1))} disabled={scenarioIndex === 0} className="flex items-center gap-2 text-white font-black uppercase tracking-tighter disabled:opacity-10 hover:text-yellow-400 transition-colors" style={{ fontSize: '11px' }}>
                        <ChevronLeft size={16} /> PREV
                    </button>
                    <div className="flex items-center gap-2 bg-white/5 px-4 py-1 rounded-full border border-white/10">
                        <span className="text-white/60 font-black tracking-[0.1em] uppercase" style={{ fontSize: '10px' }}>
                            {mode === 'concept' ? 'GUIDED' : 'SOLO'} {scenarioIndex + 1} / {scenarios.length}
                        </span>
                    </div>
                    <button onClick={handleNext} disabled={mode === 'practice' && !quizFeedback?.isCorrect} className="flex items-center gap-2 text-white font-black uppercase tracking-tighter disabled:opacity-10 hover:text-yellow-400 transition-colors" style={{ fontSize: '11px' }}>
                        {scenarioIndex === scenarios.length - 1 ? (mode === 'concept' ? 'TO PRACTICE' : 'FINISH') : 'NEXT'} <ChevronRight size={16} />
                    </button>
                </div>
            )}

            <div className="flex-1 p-4 flex flex-col items-center justify-center">
                <AnimatePresence mode="wait">
                    <motion.div key={gameState + mode + scenarioIndex + (quizFeedback ? '-fb' : '')} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col items-center gap-3 w-full">
                    
                    {gameState === 'intro' ? (
                        <div className="flex flex-col items-center gap-4 text-center">
                            <div className="flex gap-4">
                                <div className="p-4 bg-yellow-400/10 border-2 border-yellow-400/30 rounded-2xl text-yellow-400 flex flex-col items-center gap-2 w-40">
                                    <Lightbulb size={32} />
                                    <span className="font-black text-[10px] uppercase">Concept Mode</span>
                                    <p className="text-[10px] font-bold leading-tight opacity-70 italic">Guided walkthrough of data patterns.</p>
                                </div>
                                <div className="p-4 bg-green-500/10 border-2 border-green-500/30 rounded-2xl text-green-500 flex flex-col items-center gap-2 w-40">
                                    <Target size={32} />
                                    <span className="font-black text-[10px] uppercase">Practice Mode</span>
                                    <p className="text-[10px] font-bold leading-tight opacity-70 italic">Test your analytical skills independently.</p>
                                </div>
                            </div>
                            <button onClick={() => setGameState('main')} className="bg-yellow-400 text-black px-10 py-3 rounded-full font-black uppercase tracking-widest hover:scale-105 transition-all flex items-center gap-2 shadow-xl border-b-4 border-yellow-700" style={{ fontSize: UI_CONFIG.textSize }}>Start Lesson <ArrowRightCircle size={20} /></button>
                        </div>
                    ) : (
                        <>
                        {!quizFeedback && (
                            <div className="flex items-center gap-3 w-full max-w-2xl bg-black/20 p-2 rounded-2xl border border-white/5">
                                <div className="w-10 h-10 sm:w-14 sm:h-14 bg-amber-100 rounded-full border-2 border-amber-600 shadow-lg overflow-hidden shrink-0">
                                    <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Teacher&backgroundColor=ffdfbf" alt="Teacher" />
                                </div>
                                <div className="flex-1 flex flex-col">
                                    <div className="flex items-center gap-2 text-yellow-400 font-black uppercase tracking-widest text-[11px] mb-1">
                                        {mode === 'concept' ? currentScenario.icon : <Target size={12} />}
                                        {mode === 'concept' ? currentScenario.title : 'Independent Challenge'}
                                    </div>
                                    <div className="flex flex-col gap-1">
                                        {mode === 'concept' && (
                                            <span className="text-white/40 text-[10px] uppercase font-bold">Goal: {currentScenario.question}</span>
                                        )}
                                        <h2 className="text-white font-bold italic leading-tight" style={{ fontSize: UI_CONFIG.textSize }}>
                                            "{mode === 'concept' ? currentScenario.conceptExplainer : currentScenario.question}"
                                        </h2>
                                    </div>
                                </div>
                            </div>
                        )}

                        {mode === 'practice' && !quizFeedback && (
                            <div className="grid grid-cols-3 gap-3 w-full max-w-2xl px-2">
                                {SWEETS.map(s => (
                                    <button key={s.id} onClick={() => handleAnswerClick(s.id)} className="bg-white/5 hover:bg-white/10 border-2 border-white/10 p-4 rounded-xl text-white font-bold flex items-center justify-center gap-3 transition-all" style={{ fontSize: UI_CONFIG.textSize }}>
                                        <div className={`${s.baseColor} p-1 rounded-md`}>{React.cloneElement(s.icon, { size: 16 })}</div>
                                        {s.label}
                                    </button>
                                ))}
                            </div>
                        )}

                        {mode === 'concept' && !quizFeedback && (
                            <button onClick={handleNext} className="bg-yellow-400 text-black px-10 py-3 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all flex items-center gap-2 shadow-xl border-b-4 border-yellow-700" style={{ fontSize: UI_CONFIG.textSize }}>
                                {scenarioIndex === scenarios.length - 1 ? 'Start Practice' : 'Next Concept'} <ArrowRight size={20} />
                            </button>
                        )}

                        {quizFeedback && (
                            <div className="flex flex-col items-center gap-3 w-full">
                                <div className={`flex items-center gap-3 p-3 rounded-2xl border-2 w-full max-w-md ${quizFeedback.isCorrect ? 'bg-green-500/10 border-green-500/50 text-green-100' : 'bg-red-500/10 border-red-500/50 text-red-100'}`}>
                                    {quizFeedback.isCorrect ? <CheckCircle2 size={20} className="shrink-0" /> : <XCircle size={20} className="shrink-0" />}
                                    <p className="font-bold leading-tight" style={{ fontSize: UI_CONFIG.smallText }}>{quizFeedback.explanation || quizFeedback.wrongExplanation}</p>
                                </div>
                                <button onClick={quizFeedback.isCorrect ? handleNext : () => setQuizFeedback(null)} className={`${quizFeedback.isCorrect ? 'bg-white text-black' : 'bg-amber-500 text-white border-b-4 border-amber-800'} px-12 py-3 rounded-full font-black uppercase tracking-widest transition-all flex items-center gap-2 shadow-xl hover:scale-105`} style={{ fontSize: UI_CONFIG.textSize }}>
                                    {quizFeedback.isCorrect ? (scenarioIndex < scenarios.length - 1 ? 'Continue' : 'Finish Lab') : 'Try Again'} {quizFeedback.isCorrect ? <ArrowRight size={18} /> : <RotateCw size={18} />}
                                </button>
                            </div>
                        )}
                        </>
                    )}
                    </motion.div>
                </AnimatePresence>
            </div>
          </div>
        </div>

      </div>

      <AnimatePresence>
        {gameState === 'mastery' && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[300] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                <div className="bg-[#e6dccb] w-full max-w-xl p-8 rounded-[2.5rem] border-8 border-[#3e2723] text-center shadow-2xl relative overflow-hidden">
                    <div className="absolute inset-0 opacity-[0.3]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
                    <div className="relative z-10 flex flex-col items-center">
                        <div className="w-16 h-16 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-6 border-2 border-white shadow-xl"><Trophy size={40} className="animate-bounce" /></div>
                        <h2 className="text-2xl sm:text-3xl font-black text-[#3e2723] uppercase mb-4 tracking-tighter">Analytical Master!</h2>
                        <p className="text-[#3e2723] font-bold mb-8 italic px-4 leading-relaxed text-center" style={{ fontSize: UI_CONFIG.textSize }}>
                            "Phenomenal! You've transitioned from guided concepts to independent practice with perfect logic. You're a true data scientist!"
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 w-full justify-center px-4">
                            <button onClick={handleRestart} className={`bg-[#3e2723] text-[#e6dccb] px-8 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl border-b-4 border-black flex items-center justify-center gap-2`} style={{ fontSize: UI_CONFIG.textSize }}><RefreshCcw size={16} /> Re-start Lab</button>
                            <button className="bg-green-600 text-white px-8 py-4 rounded-full font-black uppercase tracking-widest hover:scale-105 active:scale-95 transition-all shadow-xl border-b-4 border-green-900 flex items-center justify-center gap-2" style={{ fontSize: UI_CONFIG.textSize }}>Finish <ArrowRightCircle size={18} /></button>
                        </div>
                    </div>
                </div>
            </motion.div>
        )}
      </AnimatePresence>

      <div className="shrink-0 mb-2 flex flex-col items-center text-center opacity-20">
          <GraduationCap size={24} className="text-[#3e2723] mb-1" />
          <h3 className={`text-[#3e2723] font-black uppercase`} style={{ fontSize: UI_CONFIG.smallText }}>Data Science Interpretation Lab</h3>
      </div>
    </div>
  );
}

// export default function App() {
//   return (
//     <Router>
//       <LabContent />
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@400;700;900&display=swap');
//         html, body, #root { height: 100%; margin: 0; padding: 0; overflow: hidden; }
//         body { font-family: 'Noto Sans', sans-serif; background: #f1f0ee; user-select: none; }
//         .no-scrollbar::-webkit-scrollbar { display: none; }
//         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//         .text-shadow-sm { text-shadow: 0 1px 1px rgba(0,0,0,0.1); }
//       `}</style>
//     </Router>
//   );
// }