// import React, { useState, useEffect, useCallback, useRef } from 'react';
// import { motion, AnimatePresence } from 'framer-motion';
// import {
//   ChevronLeft,
//   RotateCcw,
//   Trophy,
//   Target,
//   BookOpen,
//   Layers,
//   UserCircle,
//   User,
//   Check,
//   Zap,
//   Baby,
//   ChevronRight,
//   Binary,
//   GitBranch,
//   Crown,
//   ArrowRight,
//   MousePointer2,
//   Dna,
//   X,
//   Square,
//   CheckSquare,
//   Info,
//   RefreshCw
// } from 'lucide-react';
// import { HashRouter as Router, useNavigate } from 'react-router-dom';

// // ==========================================
// // DATA & CONFIG
// // ==========================================

// const RELATIONS = [
//   {
//     id: "father",
//     title: "Father Protocol",
//     gender: "M",
//     definition: "A is the Father of B. This establishes A as a Male (M) sitting exactly one tier above B.",
//     logicPoints: [
//       "Standard: Male is marked as (M).",
//       "Hierarchy: A parent sits ABOVE the child.",
//       "Logic: Knowing the father doesn't reveal the child's gender."
//     ],
//     visual: { type: 'vertical', parent: { id: 'A', gender: 'M', label: 'Father' }, child: { id: 'B', gender: '?', label: 'Child' } }
//   },
//   {
//     id: "mother",
//     title: "Mother Protocol",
//     gender: "F",
//     definition: "A is the Mother of B. This establishes A as a Female (F) sitting one generation tier above B.",
//     logicPoints: [
//       "Standard: Female is marked as (F).",
//       "Hierarchy: The mother sits ABOVE the child.",
//       "Logic: Vertical distance = 1 generation gap."
//     ],
//     visual: { type: 'vertical', parent: { id: 'A', gender: 'F', label: 'Mother' }, child: { id: 'B', gender: '?', label: 'Child' } }
//   },
//   {
//     id: "brother",
//     title: "Brother Protocol",
//     gender: "M",
//     definition: "A is the Brother of B. Both sit on the same horizontal tier (Generation 0).",
//     logicPoints: [
//       "Standard: Brother is marked as (M).",
//       "Hierarchy: Siblings sit beside each other (Horizontal).",
//       "Logic: B's gender remains unknown until defined."
//     ],
//     visual: { type: 'horizontal', node1: { id: 'A', gender: 'M', label: 'Brother' }, node2: { id: 'B', gender: '?', label: 'Sibling' } }
//   },
//   {
//     id: "sister",
//     title: "Sister Protocol",
//     gender: "F",
//     definition: "A is the Sister of B. A is Female (F) and shares the exact same generational level as B.",
//     logicPoints: [
//       "Standard: Sister is marked as (F).",
//       "Same tier = Same generation.",
//       "A horizontal line connects the sibling bond."
//     ],
//     visual: { type: 'horizontal', node1: { id: 'A', gender: 'F', label: 'Sister' }, node2: { id: 'B', gender: '?', label: 'Sibling' } }
//   },
//   {
//     id: "grandfather",
//     title: "Grandfather Protocol",
//     gender: "M",
//     definition: "A is the Grandfather of B. This requires a TWO-TIER vertical jump.",
//     logicPoints: [
//       "Hierarchy: 2 generations difference.",
//       "Standard: Grandfather is marked (M).",
//       "Chain: An intermediate parent node sits in between."
//     ],
//     visual: { type: 'chain', top: { id: 'A', gender: 'M', label: 'Grandfather' }, mid: { id: 'P', gender: '?', label: 'Parent' }, btm: { id: 'B', gender: '?', label: 'Grandchild' } }
//   },
//   {
//     id: "grandmother",
//     title: "Grandmother Protocol",
//     gender: "F",
//     definition: "A is the Grandmother of B. A is Female (F) and is the parent of B's parent.",
//     logicPoints: [
//       "Hierarchy: Sits two levels ABOVE the grandchild.",
//       "Standard: Grandmother is marked (F).",
//       "Logic: Genetic chain links generations 1, 2, and 3."
//     ],
//     visual: { type: 'chain', top: { id: 'A', gender: 'F', label: 'Grandmother' }, mid: { id: 'P', gender: '?', label: 'Parent' }, btm: { id: 'B', gender: '?', label: 'Grandchild' } }
//   }
// ];

// const PRACTICE_TASKS = [
//   {
//     mission: "Construction: 'A is father of B' and 'C is brother of B'",
//     clues: ["Rule 1: A is the father of B.", "Rule 2: C is the brother of B."],
//     characters: [
//       { id: 'A', gender: 'M', label: 'Father A' },
//       { id: 'B', gender: '?', label: 'Child B' },
//       { id: 'C', gender: 'M', label: 'Brother C' }
//     ],
//     template: 'parent-two-children',
//     slots: [
//       { id: 0, expectedId: 'A', label: 'Parent Tier' },
//       { id: 1, expectedId: 'B', label: 'Child Slot' },
//       { id: 2, expectedId: 'C', label: 'Brother Slot' }
//     ],
//     followUp: {
//       q: "Based on your chart, what is the gender of B?",
//       options: ["Male (M)", "Female (F)", "Unknown (?)"],
//       correct: 2,
//       explanation: "A is father (M) and C is brother (M), but B is only identified as a sibling. No clue defines B's specific gender."
//     }
//   },
//   {
//     mission: "Construction: 'M is the mother of N' and 'S is the sister of N'",
//     clues: ["Rule 1: M is the mother of N.", "Rule 2: S is the sister of N."],
//     characters: [
//       { id: 'M', gender: 'F', label: 'Mother M' },
//       { id: 'N', gender: '?', label: 'Child N' },
//       { id: 'S', gender: 'F', label: 'Sister S' }
//     ],
//     template: 'parent-two-children',
//     slots: [
//       { id: 0, expectedId: 'M', label: 'Parent Tier' },
//       { id: 1, expectedId: 'N', label: 'Child Slot' },
//       { id: 2, expectedId: 'S', label: 'Sister Slot' }
//     ],
//     followUp: {
//       q: "Where is S placed relative to N in the laboratory tree?",
//       options: ["Beside (Same Tier)", "Above (Parent Tier)", "Below (Next Tier)"],
//       correct: 0,
//       explanation: "Siblings share the same generational tier and sit beside each other horizontally."
//     }
//   },
//   {
//     mission: "Chain: 'X is the mother of Y' and 'Z is the mother of X'",
//     clues: ["Rule 1: X is the mother of Y.", "Rule 2: Z is the mother of X."],
//     characters: [
//       { id: 'Z', gender: 'F', label: 'Mother Z' },
//       { id: 'X', gender: 'F', label: 'Mother X' },
//       { id: 'Y', gender: '?', label: 'Child Y' }
//     ],
//     template: 'chain',
//     slots: [
//       { id: 0, expectedId: 'Z', label: 'Gen 1' },
//       { id: 1, expectedId: 'X', label: 'Gen 2' },
//       { id: 2, expectedId: 'Y', label: 'Gen 3' }
//     ],
//     followUp: {
//       q: "How is Z related to Y in this structure?",
//       options: ["Mother", "Grandmother", "Sister"],
//       correct: 1,
//       explanation: "Z is the parent of Y's parent (X). This two-tier vertical link defines a Grandmother."
//     }
//   },
//   {
//     mission: "Expert: 'K is grandpa of L', 'M is brother of K' and 'P is father of L'",
//     clues: [
//       "Rule 1: K is the grandfather of L.", 
//       "Rule 2: M is the brother of K.",
//       "Rule 3: P is the father of L."
//     ],
//     characters: [
//       { id: 'K', gender: 'M', label: 'Grandpa K' },
//       { id: 'M', gender: 'M', label: 'Brother M' },
//       { id: 'P', gender: 'M', label: 'Father P' },
//       { id: 'L', gender: '?', label: 'Child L' }
//     ],
//     template: 'expert-siblings',
//     slots: [
//       { id: 0, expectedId: 'M', label: 'Sibling M' },
//       { id: 1, expectedId: 'K', label: 'Grandpa K' },
//       { id: 2, expectedId: 'P', label: 'Father P' },
//       { id: 3, expectedId: 'L', label: 'Child L' }
//     ],
//     followUp: {
//       q: "What is M's relationship to P?",
//       options: ["Father", "Uncle", "Brother"],
//       correct: 1,
//       explanation: "M is the brother of P's father (K). Therefore, M is the paternal Uncle."
//     }
//   }
// ];

// // ==========================================
// // SUB-COMPONENTS
// // ==========================================

// function Node({ data, color, isSmall, isDraggable = false, onDragEnd, onRemove, inSlot }) {
//   return (
//     <motion.div 
//       drag={isDraggable}
//       dragSnapToOrigin={true}
//       onDragEnd={onDragEnd}
//       whileDrag={{ scale: 1.1, zIndex: 100 }}
//       className={`flex flex-col items-center gap-1 sm:gap-2 ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
//     >
//       <div className={`${isSmall ? 'w-12 h-12 sm:w-16 sm:h-16' : 'w-16 h-16 sm:w-24 sm:h-24'} rounded-full ${color} flex items-center justify-center text-white shadow-2xl border-2 border-white/10 relative z-10 transition-transform`}>
        
//         {/* ID at Centre */}
//         <div className={`${isSmall ? 'text-sm' : 'text-xl sm:text-2xl'} font-black drop-shadow-md`}>{data.id}</div>
        
//         {/* Gender at Top */}
//         <div className={`absolute ${isSmall ? '-top-2 w-6 h-6 text-[8px]' : '-top-3 w-8 h-8 sm:w-10 sm:h-10 text-[10px] sm:text-[13px]'} left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 text-black font-black flex items-center justify-center shadow-md border-2 border-[#1a0f0d] z-20`}>
//           ({data.gender})
//         </div>

//         {inSlot && (
//             <button 
//                 onClick={onRemove}
//                 className="absolute -bottom-3 -right-3 bg-rose-600 text-white rounded-full p-1.5 shadow-lg hover:bg-rose-500 active:scale-90 transition-all z-50 border border-white/20"
//             >
//                 <X size={14} strokeWidth={3} />
//             </button>
//         )}
//       </div>
//       {data.label && (
//         <span className="text-white/60 font-black text-[8px] sm:text-[10px] uppercase tracking-widest text-center mt-2 whitespace-nowrap bg-black/30 px-2 py-0.5 rounded-full border border-white/5">
//           {data.label}
//         </span>
//       )}
//     </motion.div>
//   );
// }

// function Slot({ data, placedId, characters, isSmall, onRemove }) {
//     const placedData = placedId ? characters.find(c => c.id === placedId) : null;
//     return (
//         <div data-slot-id={data.id} className="flex flex-col items-center gap-2 relative">
//             {/* The Target Area - Transparent but larger than visual for easier drag/drop */}
//             <div className={`absolute inset-0 z-0 ${isSmall ? 'scale-[2.5]' : 'scale-[2]'} opacity-0 rounded-full bg-white/5`} />
            
//             {placedData ? (
//                 <Node data={placedData} color="bg-indigo-600" isSmall={isSmall} inSlot={true} onRemove={onRemove} />
//             ) : (
//                 <div className={`${isSmall ? 'w-14 h-14 sm:w-16 sm:h-16' : 'w-16 h-16 sm:w-24 sm:h-24'} rounded-full border-2 border-dashed border-white/20 bg-white/5 flex items-center justify-center transition-colors hover:bg-white/10 shadow-inner relative z-10`}>
//                     <MousePointer2 className="text-white/10 w-6 h-6" />
//                 </div>
//             )}
//             <span className="text-white/20 font-black text-[7px] sm:text-[10px] uppercase tracking-widest bg-black/10 px-2 rounded-full mt-1 relative z-10">{data.label}</span>
//         </div>
//     );
// }

// // ==========================================
// // MAIN LOGIC
// // ==========================================

// function LabContent() {
//   const navigate = useNavigate();
//   const [appMode, setAppMode] = useState('concept');
//   const [activeTab, setActiveTab] = useState(0);
//   const [practiceStep, setPracticeStep] = useState(0);
//   const [practicePhase, setPracticePhase] = useState('build');
//   const [placedItems, setPlacedItems] = useState({});
//   const [quizFeedback, setQuizFeedback] = useState(null);
//   const [showExplanation, setShowExplanation] = useState(false);
//   const [lessonFinished, setLessonFinished] = useState(false);
//   const [completedClues, setCompletedClues] = useState([]);
  
//   const containerRef = useRef(null);

//   const handleReset = () => {
//     setActiveTab(0);
//     setPracticeStep(0);
//     setPracticePhase('build');
//     setPlacedItems({});
//     setQuizFeedback(null);
//     setShowExplanation(false);
//     setLessonFinished(false);
//     setCompletedClues([]);
//   };

//   const toggleClue = (idx) => {
//     setCompletedClues(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
//   };

//   const handleDragEnd = (itemId, point) => {
//     const slots = document.querySelectorAll(`[data-slot-id]`);
//     const slotElement = Array.from(slots).find(s => {
//         const rect = s.getBoundingClientRect();
//         // Tolerance padding for easier dropping
//         const pad = 25;
//         return (
//             point.x > rect.left - pad && point.x < rect.right + pad &&
//             point.y > rect.top - pad && point.y < rect.bottom + pad
//         );
//     });

//     if (slotElement) {
//         const sId = parseInt(slotElement.getAttribute('data-slot-id'));
//         if (placedItems[sId]) return;
//         setPlacedItems(prev => ({ ...prev, [sId]: itemId }));
//     }
//   };

//   const removePlaced = (slotId) => {
//     const next = { ...placedItems };
//     delete next[slotId];
//     setPlacedItems(next);
//   };

//   const validateBuild = () => {
//     const task = PRACTICE_TASKS[practiceStep];
//     const isCorrect = task.slots.every(slot => placedItems[slot.id] === slot.expectedId);
//     if (isCorrect) setPracticePhase('quiz');
//   };

//   const handleQuizSelection = (idx) => {
//     const task = PRACTICE_TASKS[practiceStep];
//     const isCorrect = idx === task.followUp.correct;
//     setQuizFeedback({ selected: idx, isCorrect });
//     if (isCorrect) setShowExplanation(true);
//   };

//   const nextPracticeTask = () => {
//     if (practiceStep < PRACTICE_TASKS.length - 1) {
//         setPracticeStep(prev => prev + 1);
//         setPracticePhase('build');
//         setPlacedItems({});
//         setQuizFeedback(null);
//         setShowExplanation(false);
//         setCompletedClues([]);
//     } else {
//         setLessonFinished(true);
//     }
//   };

//   return (
//     <div className="min-h-screen w-full flex flex-col bg-[#e6dccb] font-sans select-none overflow-hidden text-[#5d4037] text-[14px]" ref={containerRef}>
//       <div className="absolute inset-0 opacity-[0.1] pointer-events-none fixed bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

//       <header className="w-full shrink-0 p-2 sticky top-0 z-[100] bg-[#e6dccb]/95 border-b border-black/10">
//         <div className="w-full max-w-7xl mx-auto bg-[#2a1a16] px-3 py-2 rounded-xl border-b-2 sm:border-b-4 border-black/40 shadow-xl flex justify-between items-center text-white gap-2">
//             <div className="flex flex-col items-start leading-tight px-2">
//                 <button onClick={() => navigate(-1)} className="flex items-center gap-1 text-[#a88a6d] font-black uppercase hover:text-white transition-all text-[10px]">
//                     <ChevronLeft size={12} /> Dashboard
//                 </button>
//                 <span className="text-white font-black uppercase text-[14px] sm:text-[18px] tracking-tight">
//                     {appMode === 'concept' ? "Academy Lab" : "Diagnostic Hub"}
//                 </span>
//             </div>
//             <div className="flex items-center gap-2">
//                 <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/10 shadow-inner">
//                     <button onClick={() => { setAppMode('concept'); handleReset(); }} className={`px-4 py-1.5 rounded-md text-[11px] sm:text-[14px] font-black uppercase transition-all ${appMode === 'concept' ? 'bg-yellow-400 text-black' : 'text-[#a88a6d] hover:text-white'}`}>Academy</button>
//                     <button onClick={() => { setAppMode('practice'); handleReset(); }} className={`px-4 py-1.5 rounded-md text-[11px] sm:text-[14px] font-black uppercase transition-all ${appMode === 'practice' ? 'bg-orange-500 text-white' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
//                 </div>
//                 <button onClick={handleReset} className="p-2 bg-rose-600 hover:bg-rose-500 rounded-lg border-b-2 border-rose-900 text-white active:scale-95 transition-all"><RotateCcw size={16} /></button>
//             </div>
//         </div>
//       </header>

//       <main className="flex-1 flex flex-col items-center gap-2 p-2 sm:p-4 w-full max-w-7xl mx-auto relative z-10 overflow-hidden">
        
//         {/* UPPER DIV: STAGE */}
//         <div className="w-full flex-[1.7] overflow-hidden flex flex-col gap-2">
//           <motion.div className="w-full h-full bg-[#1a0f0d] p-4 sm:p-12 rounded-[2rem] sm:rounded-[3rem] border-2 sm:border-4 border-black shadow-2xl flex flex-col items-center justify-center relative overflow-hidden ring-1 ring-white/5">
//             <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            
//             <div className="absolute top-4 left-8 opacity-30 text-[9px] sm:text-[11px] font-black uppercase tracking-[0.4em] text-[#a88a6d] flex items-center gap-3">
//                 <Dna size={16} className="text-amber-400 animate-pulse" /> Construction Stage
//             </div>

//             <div className="w-full h-full flex flex-col items-center justify-center pt-12 overflow-y-auto no-scrollbar relative">
//               <AnimatePresence mode="wait">
//                 {!lessonFinished ? (
//                    <motion.div 
//                     key={`${appMode}-${activeTab}-${practiceStep}-${practicePhase}`}
//                     initial={{ opacity: 0, scale: 0.98 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 1.02 }}
//                     className="w-full flex flex-col items-center justify-center"
//                    >
//                      {appMode === 'concept' ? (
//                        <TreeVisual data={RELATIONS[activeTab].visual} />
//                      ) : (
//                        <div className="flex flex-col items-center gap-10 w-full">
//                          <div className="relative min-h-[300px] w-full flex items-center justify-center">
//                             <PracticeTemplate 
//                                 task={PRACTICE_TASKS[practiceStep]} 
//                                 placedItems={placedItems}
//                                 onRemove={practicePhase === 'build' ? removePlaced : null}
//                             />
//                          </div>

//                          {practicePhase === 'build' && (
//                              <div className="flex gap-4 sm:gap-10 p-6 bg-white/5 rounded-3xl border border-white/5 shadow-2xl backdrop-blur-sm relative z-20">
//                                 {PRACTICE_TASKS[practiceStep].characters.map(char => {
//                                     const isPlaced = Object.values(placedItems).includes(char.id);
//                                     return (
//                                         <div key={char.id} className="relative">
//                                             <div className={isPlaced ? 'opacity-20 grayscale pointer-events-none scale-90' : ''}>
//                                                 <Node data={char} color="bg-indigo-600" isDraggable={!isPlaced} onDragEnd={(_, info) => handleDragEnd(char.id, info.point)} />
//                                             </div>
//                                             {isPlaced && <div className="absolute inset-0 flex items-center justify-center"><Check className="text-white/20" size={32} /></div>}
//                                         </div>
//                                     );
//                                 })}
//                              </div>
//                          )}
//                        </div>
//                      )}
//                    </motion.div>
//                 ) : (
//                   <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-8 text-center p-10">
//                     <Trophy size={120} className="text-yellow-400 animate-bounce" />
//                     <h2 className="text-white text-4xl sm:text-7xl font-black uppercase tracking-tighter">LAB CERTIFIED</h2>
//                     <button onClick={handleReset} className="bg-amber-400 text-black px-16 py-5 rounded-2xl font-black uppercase text-xl shadow-2xl border-b-8 border-amber-600 hover:scale-105 transition-all">Restart Lab</button>
//                   </motion.div>
//                 )}
//               </AnimatePresence>
//             </div>
//           </motion.div>
//         </div>

//         {/* LOWER DIV: PANEL */}
//         <div className="w-full flex-[0.7] bg-[#2a1a16] p-4 sm:p-6 rounded-t-[3rem] border-t-4 border-black shadow-2xl relative z-50 flex flex-col gap-4 overflow-hidden">
//           <div className="absolute inset-0 opacity-[0.05] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/dark-wood.png')]" />

//           <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.8fr] gap-6 h-full relative z-10">
//             <div className="flex flex-col gap-2 min-h-0">
//               <div className="flex items-center gap-2 px-2 opacity-50"><BookOpen size={16} className="text-[#a88a6d]" /><span className="text-[#a88a6d] font-black uppercase text-[11px]">Diagnostic Rules</span></div>
//               <div className="bg-black/40 p-4 rounded-[1.5rem] border border-white/10 flex flex-col gap-2 flex-1 overflow-y-auto custom-scrollbar shadow-inner">
//                 {appMode === 'concept' ? (
//                    <div className="space-y-4">
//                      <p className="text-white text-base sm:text-xl font-black border-b border-white/5 pb-2 flex items-center gap-2 uppercase tracking-tighter"><GitBranch size={16} className="text-yellow-400" /> {RELATIONS[activeTab].title}</p>
//                      <div className="space-y-2">
//                         {RELATIONS[activeTab].logicPoints.map((pt, i) => (
//                            <div key={i} className="flex items-start gap-2 text-left"><Check size={14} className="text-yellow-400 shrink-0 mt-0.5" strokeWidth={4} /><p className="text-white/80 font-bold italic text-[12px] sm:text-[14px] leading-tight">{pt}</p></div>
//                         ))}
//                      </div>
//                    </div>
//                 ) : (
//                    <div className="flex flex-col gap-3">
//                      <span className="text-orange-400 font-black text-[10px] uppercase opacity-60">Trial {practiceStep + 1} Mission</span>
//                      <div className="space-y-2">
//                         {PRACTICE_TASKS[practiceStep].clues.map((clue, i) => (
//                             <div key={i} className="flex items-start gap-3 group cursor-pointer text-left py-1" onClick={() => toggleClue(i)}>
//                                 {completedClues.includes(i) ? <CheckSquare className="text-emerald-500 shrink-0" size={18} /> : <Square className="text-white/20 shrink-0" size={18} />}
//                                 <p className={`text-white font-bold leading-tight ${completedClues.includes(i) ? 'opacity-40 line-through italic' : ''}`}>{clue}</p>
//                             </div>
//                         ))}
//                      </div>
//                    </div>
//                 )}
//               </div>
//             </div>

//             <div className="flex flex-col gap-2 min-h-0">
//               <div className="flex items-center justify-between px-2 opacity-50"><div className="flex items-center gap-2"><Target size={16} className="text-green-400" /><span className="text-[#a88a6d] font-black uppercase text-[11px]">Interactive Hub</span></div></div>
//               <div className="bg-[#3e2723] p-4 rounded-[1.5rem] border border-white/5 flex flex-col items-center justify-center gap-4 shadow-inner flex-1 overflow-hidden relative">
//                 <AnimatePresence mode="wait">
//                   {!lessonFinished ? (
//                     appMode === 'concept' ? (
//                       <motion.div key="academy-tabs" className="w-full h-full flex flex-col gap-4">
//                          <div className="grid grid-cols-3 sm:grid-cols-6 gap-1 bg-black/40 p-1 rounded-xl border border-white/5">
//                             {RELATIONS.map((rel, i) => (<button key={rel.id} onClick={() => setActiveTab(i)} className={`py-2 rounded-lg text-[8px] sm:text-[10px] font-black uppercase transition-all ${activeTab === i ? 'bg-yellow-400 text-black shadow-lg' : 'text-[#a88a6d] hover:text-white'}`}>{rel.id}</button>))}
//                          </div>
//                          <div className="flex-1 bg-black/20 p-5 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center gap-3">
//                             <p className="text-white text-[14px] sm:text-[18px] font-bold leading-relaxed italic">{RELATIONS[activeTab].definition}</p>
//                             {activeTab === RELATIONS.length - 1 ? (
//                                 <button onClick={() => setAppMode('practice')} className="mt-2 flex items-center gap-3 bg-emerald-500 text-white px-8 py-2.5 rounded-full font-black uppercase text-[11px] shadow-xl border-b-4 border-emerald-800">Start Practice <ArrowRight size={16} /></button>
//                             ) : (
//                                 <button onClick={() => setActiveTab(prev => prev + 1)} className="mt-2 flex items-center gap-3 bg-yellow-400/20 text-yellow-400 border border-yellow-400/40 px-8 py-2.5 rounded-full font-black uppercase text-[11px] hover:bg-yellow-400">Observe Next <ChevronRight size={16} /></button>
//                             )}
//                          </div>
//                       </motion.div>
//                     ) : (
//                       <motion.div key="practice-ui" className="w-full flex flex-col gap-3 h-full">
//                          {practicePhase === 'build' ? (
//                              <div className="flex flex-col items-center justify-center flex-1 gap-4">
//                                 <p className="text-stone-400 text-[10px] uppercase font-black text-center px-4 leading-tight">Drag characters to the correct tier above.</p>
//                                 <button onClick={validateBuild} disabled={Object.keys(placedItems).length < PRACTICE_TASKS[practiceStep].slots.length} className={`px-16 py-4 rounded-2xl font-black uppercase text-[13px] shadow-2xl transition-all active:scale-95 flex items-center gap-3 border-b-4 ${Object.keys(placedItems).length >= PRACTICE_TASKS[practiceStep].slots.length ? 'bg-amber-400 text-black border-amber-700' : 'bg-black/20 text-white/20 pointer-events-none'}`}>Validate Arrangement <ChevronRight size={18} /></button>
//                              </div>
//                          ) : (
//                             <div className="flex flex-col gap-2 h-full overflow-y-auto no-scrollbar">
//                                 <div className="bg-black/20 p-3 rounded-xl border border-white/5"><p className="text-white text-base sm:text-lg font-black text-center leading-tight tracking-tight">{PRACTICE_TASKS[practiceStep].followUp.q}</p></div>
//                                 <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
//                                     {PRACTICE_TASKS[practiceStep].followUp.options.map((opt, i) => {
//                                         const isSelected = quizFeedback?.selected === i;
//                                         const isCorrectIdx = i === PRACTICE_TASKS[practiceStep].followUp.correct;
//                                         let btnClass = isSelected ? (quizFeedback.isCorrect ? "bg-emerald-600 border-emerald-400" : "bg-rose-600 border-rose-400") : "bg-black/40 border-white/10 text-white/80";
//                                         if (quizFeedback && isCorrectIdx) btnClass = "bg-emerald-600 border-emerald-400 text-white";
//                                         return (<button key={i} disabled={quizFeedback?.isCorrect} onClick={() => handleQuizSelection(i)} className={`p-3 rounded-xl font-black uppercase transition-all text-[11px] border-2 ${btnClass} ${!quizFeedback ? 'hover:bg-black/80' : ''}`}>{opt}</button>);
//                                     })}
//                                 </div>
//                                 {quizFeedback && (
//                                     <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-2 mt-auto pb-1">
//                                         {showExplanation && <div className="p-2 rounded-xl bg-white/5 border border-white/10 text-center"><p className="text-[11px] sm:text-[13px] font-bold italic text-white/70 leading-tight"><Info size={14} className="inline mr-2 text-amber-400" />{PRACTICE_TASKS[practiceStep].followUp.explanation}</p></div>}
//                                         <div className="flex gap-2 w-full">
//                                             {!quizFeedback.isCorrect && <button onClick={() => setQuizFeedback(null)} className="flex-1 py-2.5 bg-rose-600 text-white rounded-full font-black text-[10px]"><RefreshCw size={14} className="inline mr-1" /> Try Again</button>}
//                                             <button onClick={quizFeedback.isCorrect ? nextPracticeTask : () => setShowExplanation(!showExplanation)} className={`flex-1 py-2.5 text-white rounded-full font-black text-[10px] ${quizFeedback.isCorrect ? 'bg-emerald-600' : 'bg-blue-600'}`}>{quizFeedback.isCorrect ? "Next Mission" : (showExplanation ? "Hide Info" : "Explanation")}</button>
//                                         </div>
//                                     </motion.div>
//                                 )}
//                             </div>
//                          )}
//                       </motion.div>
//                     )
//                   ) : (
//                     <div className="flex flex-col items-center justify-center h-full gap-4 text-center"><Zap size={48} className="text-yellow-400" /><p className="text-[#a88a6d] font-bold italic text-lg px-8">Diagnostic Trial Success.</p><button onClick={handleReset} className="bg-yellow-400 text-black px-16 py-4 rounded-2xl font-black uppercase tracking-[0.2em] text-[13px]">RestartAcademy</button></div>
//                   )}
//                 </AnimatePresence>
//               </div>
//             </div>
//           </div>
//         </div>
//       </main>

//       <style dangerouslySetInnerHTML={{ __html: `
//         .custom-scrollbar::-webkit-scrollbar { width: 4px; }
//         .custom-scrollbar::-webkit-scrollbar-track { background: transparent; }
//         .custom-scrollbar::-webkit-scrollbar-thumb { background: rgba(168, 138, 109, 0.2); border-radius: 10px; }
//         .no-scrollbar::-webkit-scrollbar { display: none; }
//         .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
//       `}} />
//     </div>
//   );
// }

// function PracticeTemplate({ task, placedItems, onRemove }) {
//     const { template, slots, characters } = task;
//     const VerticalLine = ({ h = "h-16" }) => <div className={`${h} w-1 bg-yellow-400/20 relative mx-auto`}><div className="absolute inset-0 bg-yellow-400 w-[1px] mx-auto" /></div>;
    
//     if (template === 'parent-two-children') {
//         return (
//             <div className="flex flex-col items-center">
//                 <Slot data={slots[0]} placedId={placedItems[0]} characters={characters} onRemove={onRemove ? () => onRemove(0) : null} />
//                 <VerticalLine />
//                 <div className="flex items-center gap-32 sm:gap-64 relative border-t-2 border-yellow-400/30 pt-4 px-10">
//                     <Slot data={slots[1]} placedId={placedItems[1]} characters={characters} onRemove={onRemove ? () => onRemove(1) : null} />
//                     <Slot data={slots[2]} placedId={placedItems[2]} characters={characters} onRemove={onRemove ? () => onRemove(2) : null} />
//                 </div>
//             </div>
//         );
//     }
//     if (template === 'chain') {
//         return (
//             <div className="flex flex-col items-center">
//                 <Slot data={slots[0]} placedId={placedItems[0]} characters={characters} isSmall onRemove={onRemove ? () => onRemove(0) : null} />
//                 <VerticalLine h="h-12" />
//                 <Slot data={slots[1]} placedId={placedItems[1]} characters={characters} isSmall onRemove={onRemove ? () => onRemove(1) : null} />
//                 <VerticalLine h="h-12" />
//                 <Slot data={slots[2]} placedId={placedItems[2]} characters={characters} isSmall onRemove={onRemove ? () => onRemove(2) : null} />
//             </div>
//         );
//     }
//     if (template === 'expert-siblings') {
//         return (
//             <div className="flex flex-col items-center">
//                 <div className="flex items-center gap-32 sm:gap-64 relative border-b-2 border-yellow-400/30 pb-4">
//                     <Slot data={slots[0]} placedId={placedItems[0]} characters={characters} isSmall onRemove={onRemove ? () => onRemove(0) : null} />
//                     <div className="relative">
//                         <Slot data={slots[1]} placedId={placedItems[1]} characters={characters} isSmall onRemove={onRemove ? () => onRemove(1) : null} />
//                         <div className="absolute top-[100%] left-1/2 -translate-x-1/2 h-16 w-[1px] bg-yellow-400/40" />
//                     </div>
//                 </div>
//                 <div className="mt-12 flex flex-col items-center">
//                     <Slot data={slots[2]} placedId={placedItems[2]} characters={characters} isSmall onRemove={onRemove ? () => onRemove(2) : null} />
//                     <VerticalLine h="h-10" />
//                     <Slot data={slots[3]} placedId={placedItems[3]} characters={characters} isSmall onRemove={onRemove ? () => onRemove(3) : null} />
//                 </div>
//             </div>
//         );
//     }
//     return null;
// }

// function TreeVisual({ data }) {
//     const VerticalLine = ({ h = "h-24" }) => <div className={`${h} w-1 bg-yellow-400/20 relative mx-auto`}><div className="absolute inset-0 bg-yellow-400 w-[1px] mx-auto" /></div>;
//     if (data.type === 'vertical') return (<div className="flex flex-col items-center"><Node data={data.parent} color="bg-blue-600" /><VerticalLine /><Node data={data.child} color="bg-stone-600" /></div>);
//     if (data.type === 'horizontal') return (<div className="flex items-center gap-32 sm:gap-64 relative border-t-2 border-yellow-400/30 pt-4 px-10"><Node data={data.node1} color="bg-blue-600" /><Node data={data.node2} color="bg-stone-600" /></div>);
//     if (data.type === 'chain') return (<div className="flex flex-col items-center"><Node data={data.top} color="bg-amber-600" isSmall /><VerticalLine h="h-12" /><Node data={data.mid} color="bg-purple-600" isSmall /><VerticalLine h="h-12" /><Node data={data.btm} color="bg-stone-600" isSmall /></div>);
//     return null;
// }

// export default function App() { return ( <Router> <LabContent /> </Router> ); }


import React, { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  RotateCcw,
  Trophy,
  Target,
  BookOpen,
  Layers,
  UserCircle,
  User,
  Check,
  Zap,
  Baby,
  ChevronRight,
  Binary,
  GitBranch,
  Crown,
  ArrowRight,
  MousePointer2,
  Dna,
  X,
  Square,
  CheckSquare,
  Info,
  RefreshCw,
  Search,
  Key,
  Heart,
  Sparkles
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// DATA & CONFIG
// ==========================================

const CONCEPT_PROTOCOLS = [
  {
    id: "parents",
    tab: "Parents",
    title: "Protocol: Direct Lineage (Up)",
    definition: "Parents are direct ancestors sitting exactly one generation above you.",
    logicPoints: [
      "FATHER: Male parent (M).",
      "MOTHER: Female parent (F).",
      "HIERARCHY: Origin is at the Top."
    ],
    visual: { 
      type: 'dual-case-vertical-direct', 
      case1: { title: "FATHER", top: {id:'FATHER', g:'M'}, btm: {id:'CHILD', g:'?'} },
      case2: { title: "MOTHER", top: {id:'MOTHER', g:'F'}, btm: {id:'CHILD', g:'?'} }
    }
  },
  {
    id: "children",
    tab: "Children",
    title: "Protocol: Direct Lineage (Down)",
    definition: "Children are direct descendants sitting exactly one generation below you.",
    logicPoints: [
      "SON: Male descendant (M).",
      "DAUGHTER: Female descendant (F).",
      "HIERARCHY: Descendant is at the Bottom."
    ],
    visual: { 
      type: 'dual-case-vertical-direct', 
      case1: { title: "SON", top: {id:'PARENT', g:'?'}, btm: {id:'SON', g:'M'} },
      case2: { title: "DAUGHTER", top: {id:'PARENT', g:'?'}, btm: {id:'DAUGHTER', g:'F'} }
    }
  },
  {
    id: "inlaws",
    tab: "In-laws",
    title: "Marriage Protocol: In-Laws",
    definition: "Tracing direct relationships through marriage bonds. Identifying Father-in-law and Son-in-law.",
    logicPoints: [
      "FATHER-IN-LAW: Father sits above your Spouse.",
      "SON-IN-LAW: Husband is married to your Daughter.",
      "BOND: Dotted deduction line traces the 'In-law' relation."
    ],
    visual: { 
      type: 'dual-case-inlaw-screenshot-flow', 
      case1: { title: "FATHER-IN-LAW", father: {id:'FATHER', g:'M'}, spouse: {id:'SPOUSE', g:'?'}, me: {id:'ME', g:'?'} },
      case2: { title: "SON-IN-LAW", me: {id:'ME', g:'?'}, daughter: {id:'DAUGHTER', g:'F'}, husband: {id:'HUSBAND', g:'M'} }
    }
  },
  {
    id: "grandparents",
    tab: "Grandparents",
    title: "Protocol: Grand-Generations (Up)",
    definition: "Ancestors sitting two generational steps above you (+2).",
    logicPoints: [
      "GAP: Requires two vertical arrows.",
      "STANDARD: Grandfather (M), Grandmother (F).",
      "MIDDLE: Parent node sits in the center."
    ],
    visual: { 
      type: 'dual-case-chain', 
      case1: { title: "GRANDFATHER", top: {id:'GRANDFATHER', g:'M'}, mid: {id:'PARENT', g:'?'}, btm: {id:'ME', g:'?'} },
      case2: { title: "GRANDMOTHER", top: {id:'GRANDMOTHER', g:'F'}, mid: {id:'PARENT', g:'?'}, btm: {id:'ME', g:'?'} }
    }
  },
  {
    id: "grandkids",
    tab: "Grand-Kids",
    title: "Protocol: Grand-Generations (Down)",
    definition: "Descendants sitting two generational steps below you (-2).",
    logicPoints: [
      "GAP: Requires two vertical steps down.",
      "STANDARD: Grandson (M), Granddaughter (F).",
      "MIDDLE: Child node sits in the center."
    ],
    visual: { 
      type: 'dual-case-chain', 
      case1: { title: "GRANDSON", top: {id:'ME', g:'?'}, mid: {id:'CHILD', g:'?'}, btm: {id:'GRANDSON', g:'M'} },
      case2: { title: "GRANDDAUGHTER", top: {id:'ME', g:'?'}, mid: {id:'CHILD', g:'?'}, btm: {id:'GRANDDAUGHTER', g:'F'} }
    }
  }
];

const PRACTICE_TASKS = [
  {
    mission: "Construction: 'M is the mother of N.'",
    clues: [
      "Rule 1: M is the mother of N (M sits above N).",
      "Rule 2: M is a Female (F)."
    ],
    characters: [
      { id: 'M', gender: 'F', label: 'MOTHER' },
      { id: 'N', gender: '?', label: 'CHILD' }
    ],
    template: 'direct-vertical',
    slots: [
      { id: 0, expectedId: 'M', label: 'Parent Tier' },
      { id: 1, expectedId: 'N', label: 'Child Tier' }
    ],
    followUp: {
      q: "What is the relationship of M to N?",
      options: ["Sister", "Mother", "Grandmother"],
      correct: 1,
      explanation: "M is positioned exactly one tier above N as a female, defining a Mother relationship."
    }
  },
  {
    mission: "Construction: 'P is the father of Q. Q is the mother of R.'",
    clues: [
      "Rule 1: P is the father of Q (P above Q, Male).",
      "Rule 2: Q is the mother of R (Q above R, Female)."
    ],
    characters: [
      { id: 'P', gender: 'M', label: 'FATHER' },
      { id: 'Q', gender: 'F', label: 'MOTHER' },
      { id: 'R', gender: '?', label: 'CHILD' }
    ],
    template: 'vertical-chain',
    slots: [
      { id: 0, expectedId: 'P', label: 'Gen +2' },
      { id: 1, expectedId: 'Q', label: 'Gen +1' },
      { id: 2, expectedId: 'R', label: 'Gen 0' }
    ],
    followUp: {
      q: "How is P related to R?",
      options: ["Father", "Uncle", "Grandfather"],
      correct: 2,
      explanation: "P is the parent of R's parent (Q). This two-tier gap defines a Grandfather."
    }
  },
  {
    mission: "Construction: 'A is married to B. C is the father of A.'",
    clues: [
      "Rule 1: A and B are married (=).",
      "Rule 2: C is the father of A (C above A).",
      "Rule 3: C is Male (M)."
    ],
    characters: [
      { id: 'C', gender: 'M', label: 'FATHER' },
      { id: 'A', gender: '?', label: 'SPOUSE' },
      { id: 'B', gender: '?', label: 'ME' }
    ],
    template: 'inlaw-construction-svg',
    slots: [
      { id: 0, expectedId: 'C', label: 'Spouse Father' },
      { id: 1, expectedId: 'A', label: 'Spouse' },
      { id: 2, expectedId: 'B', label: 'Me' }
    ],
    followUp: {
      q: "Identify the relationship between Father C and Me (B):",
      options: ["Father", "Uncle", "Father-in-law"],
      correct: 2,
      explanation: "C is the father of your spouse. In a logical tree, your spouse's father is your Father-in-law."
    }
  },
  {
    mission: "Construction: 'X is the daughter of Y. Z is married to X.'",
    clues: [
      "Rule 1: X is the daughter of Y (Y above X, X is Female).",
      "Rule 2: Z is married to X (=, Z is Male)."
    ],
    characters: [
      { id: 'Y', gender: '?', label: 'ME' },
      { id: 'X', gender: 'F', label: 'DAUGHTER' },
      { id: 'Z', gender: 'M', label: 'HUSBAND' }
    ],
    template: 'son-inlaw-construction-svg',
    slots: [
      { id: 0, expectedId: 'Y', label: 'Me' },
      { id: 1, expectedId: 'X', label: 'Daughter' },
      { id: 2, expectedId: 'Z', label: 'Husband' }
    ],
    followUp: {
      q: "How is Z related to Y?",
      options: ["Son", "Son-in-law", "Brother-in-law"],
      correct: 1,
      explanation: "Z is married to Y's daughter (X). Therefore, Z is the Son-in-law."
    }
  },
  {
    mission: "Construction: 'S is the son of T. T is the daughter of U.'",
    clues: [
      "Rule 1: U is the parent of T (U above T).",
      "Rule 2: T is the parent of S (T above S).",
      "Rule 3: S is a Male (M)."
    ],
    characters: [
      { id: 'U', gender: '?', label: 'PARENT' },
      { id: 'T', gender: 'F', label: 'DAUGHTER' },
      { id: 'S', gender: 'M', label: 'SON' }
    ],
    template: 'vertical-chain',
    slots: [
      { id: 0, expectedId: 'U', label: 'Gen +2' },
      { id: 1, expectedId: 'T', label: 'Gen +1' },
      { id: 2, expectedId: 'S', label: 'Gen 0' }
    ],
    followUp: {
      q: "How is S related to U?",
      options: ["Son", "Grandson", "Nephew"],
      correct: 1,
      explanation: "S is the child of U's child (T). As a male, S is the Grandson."
    }
  }
];

// ==========================================
// RENDER COMPONENTS
// ==========================================

function Node({ data, color, isSmall, isDraggable = false, onDragEnd, onRemove, showRemove }) {
  if (!data) return null;
  const genderLabel = data.gender || data.g;
  const Icon = genderLabel === 'M' ? UserCircle : genderLabel === 'F' ? User : Baby;

  return (
    <motion.div 
      drag={isDraggable}
      dragSnapToOrigin={true}
      onDragEnd={onDragEnd}
      whileDrag={{ scale: 1.1, zIndex: 100 }}
      className={`flex flex-col items-center gap-1 ${isDraggable ? 'cursor-grab active:cursor-grabbing' : ''}`}
    >
      <div className={`${isSmall ? 'w-20 h-20 sm:w-28 sm:h-28' : 'w-24 h-24 sm:w-36 sm:h-36'} rounded-full ${color} flex items-center justify-center text-white shadow-2xl border-2 border-white/20 relative z-10 transition-transform`}>
        <Icon className="absolute inset-0 m-auto opacity-30 w-3/5 h-3/5" />
        <div className={`${data.id.length <= 2 ? 'text-4xl sm:text-6xl' : (isSmall ? 'text-[10px] sm:text-sm' : 'text-sm sm:text-xl')} font-black drop-shadow-md text-center px-1 z-10 uppercase tracking-tighter`}>{data.id}</div>
        <div className={`absolute ${isSmall ? '-top-2 w-7 h-7 text-[8px]' : '-top-3.5 w-10 h-10 text-[10px] sm:text-[12px]'} left-1/2 -translate-x-1/2 rounded-full bg-yellow-400 text-black font-black flex items-center justify-center shadow-md border-2 border-[#1a0f0d] z-20`}>
          ({genderLabel})
        </div>
        {showRemove && (
            <button 
                onClick={onRemove}
                className="absolute -bottom-3 -right-3 bg-rose-600 text-white rounded-full p-1.5 shadow-lg hover:bg-rose-500 active:scale-90 transition-all z-50 border border-white/20"
            >
                <X size={14} strokeWidth={3} />
            </button>
        )}
      </div>
      {data.label && (
        <span className="text-white/80 font-black text-[9px] sm:text-[11px] uppercase tracking-widest text-center mt-1 whitespace-nowrap bg-black/40 px-3 py-0.5 rounded-full border border-white/5">
          {data.label}
        </span>
      )}
    </motion.div>
  );
}

function Slot({ data, placedId, characters, isSmall, onRemove, showRemove }) {
    const placedData = placedId ? characters.find(c => c.id === placedId) : null;
    return (
        <div data-slot-id={data.id} className="flex flex-col items-center gap-2 relative">
            <div className={`absolute inset-0 z-0 ${isSmall ? 'scale-[2.5]' : 'scale-[2.2]'} opacity-0 rounded-full bg-white/5 pointer-events-none`} />
            {placedData ? (
                <Node data={placedData} color="bg-indigo-600" isSmall={isSmall} showRemove={showRemove} onRemove={onRemove} />
            ) : (
                <div className={`${isSmall ? 'w-20 h-20 sm:w-28 sm:h-28' : 'w-24 h-24 sm:w-36 sm:h-36'} rounded-full border-2 border-dashed border-white/10 bg-white/5 flex items-center justify-center transition-colors hover:bg-white/10 shadow-inner relative z-10`}>
                    <MousePointer2 className="text-white/10 w-8 h-8" />
                </div>
            )}
            <span className="text-white/20 font-black text-[8px] sm:text-[11px] uppercase tracking-widest bg-black/10 px-3 rounded-full mt-1 relative z-10">{data.label}</span>
        </div>
    );
}

export default function LabContent() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept');
  const [activeTab, setActiveTab] = useState(0);
  const [practiceStep, setPracticeStep] = useState(0);
  const [practicePhase, setPracticePhase] = useState('build');
  const [placedItems, setPlacedItems] = useState({});
  const [quizFeedback, setQuizFeedback] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);
  const [completedClues, setCompletedClues] = useState([]);
  
  const containerRef = useRef(null);

  const handleReset = () => {
    setActiveTab(0);
    setPracticeStep(0);
    setPracticePhase('build');
    setPlacedItems({});
    setQuizFeedback(null);
    setShowExplanation(false);
    setLessonFinished(false);
    setCompletedClues([]);
  };

  const toggleClue = (idx) => {
    setCompletedClues(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  const handleDragEnd = (itemId, point) => {
    const slots = document.querySelectorAll(`[data-slot-id]`);
    const slotElement = Array.from(slots).find(s => {
        const rect = s.getBoundingClientRect();
        const pad = 60; 
        return (
            point.x > rect.left - pad && point.x < rect.right + pad &&
            point.y > rect.top - pad && point.y < rect.bottom + pad
        );
    });

    if (slotElement) {
        const sId = parseInt(slotElement.getAttribute('data-slot-id'));
        if (placedItems[sId]) return;
        setPlacedItems(prev => ({ ...prev, [sId]: itemId }));
    }
  };

  const removePlaced = (slotId) => {
    const next = { ...placedItems };
    delete next[slotId];
    setPlacedItems(next);
  };

  const validateBuild = () => {
    const task = PRACTICE_TASKS[practiceStep];
    const isCorrect = task.slots.every(slot => placedItems[slot.id] === slot.expectedId);
    if (isCorrect) setPracticePhase('quiz');
  };

  const handleQuizSelection = (idx) => {
    const task = PRACTICE_TASKS[practiceStep];
    const isCorrect = idx === task.followUp.correct;
    setQuizFeedback({ selected: idx, isCorrect });
    if (isCorrect) setShowExplanation(true);
  };

  const goToPracticeStep = (stepIndex) => {
    setPracticeStep(stepIndex);
    setPracticePhase('build');
    setPlacedItems({});
    setQuizFeedback(null);
    setShowExplanation(false);
    setCompletedClues([]);
  };

  const prevPracticeTask = () => {
    if (practiceStep > 0) goToPracticeStep(practiceStep - 1);
  };

  const skipPracticeTask = () => {
    if (practiceStep < PRACTICE_TASKS.length - 1) {
        goToPracticeStep(practiceStep + 1);
    } else {
        setLessonFinished(true);
    }
  };

  const nextPracticeTask = () => {
    if (practiceStep < PRACTICE_TASKS.length - 1) {
        goToPracticeStep(practiceStep + 1);
    } else {
        setLessonFinished(true);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-[#0f0a09] font-sans select-none overflow-hidden text-[#a88a6d] pb-10" ref={containerRef}>
      <header className="w-full shrink-0 p-2 sticky top-0 z-[100] bg-[#0f0a09]/95 border-b border-white/5 shadow-sm">
        <div className="w-full max-w-7xl mx-auto bg-[#1a0f0d] px-3 py-2 rounded-xl border-b-4 border-black/40 shadow-xl flex justify-between items-center text-white gap-2">
            <div className="flex flex-col items-start leading-tight px-2">
                <button onClick={() => navigate('/learn/logicalReasoning/bloodRelations')} className="flex items-center gap-1 text-[#a88a6d] font-black uppercase hover:text-white transition-all text-[10px]">
                    <ChevronLeft size={12} /> Dashboard
                </button>
                <span className="text-white font-black uppercase text-[14px] sm:text-[18px] tracking-tight flex items-center gap-2">
                    <Search size={18} className="text-amber-400" /> {appMode === 'concept' ? "Concept Lab" : "Diagnostic Hub"}
                </span>
            </div>
            <div className="flex items-center gap-2">
                <div className="flex bg-black/40 p-0.5 rounded-lg border border-white/10 shadow-inner">
                    <button onClick={() => { setAppMode('concept'); handleReset(); }} className={`px-4 py-1.5 rounded-md text-[11px] sm:text-[14px] font-black uppercase transition-all ${appMode === 'concept' ? 'bg-yellow-400 text-black shadow-lg' : 'text-[#a88a6d] hover:text-white'}`}>Concept</button>
                    <button onClick={() => { setAppMode('practice'); handleReset(); }} className={`px-4 py-1.5 rounded-md text-[11px] sm:text-[14px] font-black uppercase transition-all ${appMode === 'practice' ? 'bg-orange-500 text-white shadow-lg' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
                </div>
                <button onClick={handleReset} className="p-2 bg-rose-600 hover:bg-rose-500 rounded-lg border-b-2 border-rose-900 text-white active:scale-95 transition-all shadow-md"><RotateCcw size={16} /></button>
            </div>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center gap-2 p-2 sm:p-4 w-full max-w-7xl mx-auto relative z-10 overflow-hidden">
        <div className="w-full flex-none overflow-hidden flex flex-col gap-2 h-[480px] sm:h-[620px]">
          <motion.div className="w-full h-full bg-[#110c0b] p-4 sm:p-12 rounded-[3rem] border-2 sm:border-4 border-black shadow-2xl flex flex-col items-center justify-center relative overflow-hidden ring-1 ring-white/5">
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: 'radial-gradient(circle, white 1px, transparent 0)', backgroundSize: '40px 40px' }} />
            <div className="w-full h-full flex flex-col items-center justify-center overflow-y-auto no-scrollbar relative pt-12">
              <AnimatePresence mode="wait">
                {!lessonFinished ? (
                   <motion.div 
                    key={`${appMode}-${activeTab}-${practiceStep}-${practicePhase}`}
                    initial={{ opacity: 0, scale: 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.02 }}
                    className="w-full h-full flex flex-col items-center justify-center"
                   >
                     {appMode === 'concept' ? (
                       <div className="w-full h-full flex items-center justify-center">
                          <TreeVisual data={CONCEPT_PROTOCOLS[activeTab].visual} />
                       </div>
                     ) : (
                       <div className="w-full h-full flex flex-col md:grid md:grid-cols-[1fr_auto_1fr] items-center justify-center gap-6 sm:gap-8 pb-4 md:pb-0">
                         <div className="hidden md:block"></div>
                         
                         <div className="relative w-full flex items-center justify-center">
                            <PracticeTemplate 
                                task={PRACTICE_TASKS[practiceStep]} 
                                placedItems={placedItems}
                                onRemove={practicePhase === 'build' ? removePlaced : null}
                                showRemove={practicePhase === 'build'}
                            />
                         </div>
                         
                         <div className="flex items-center justify-center md:justify-end w-full md:pr-4 lg:pr-8">
                             {practicePhase === 'build' && (
                                 <div className="flex md:flex-col gap-4 sm:gap-6 p-4 sm:p-6 bg-[#1a110f] rounded-[2rem] sm:rounded-[3rem] border border-white/5 shadow-2xl backdrop-blur-sm relative z-20 shrink-0">
                                    {PRACTICE_TASKS[practiceStep].characters.map(char => {
                                        const isPlaced = Object.values(placedItems).includes(char.id);
                                        return (
                                            <div key={char.id} className="relative">
                                                <div className={isPlaced ? 'opacity-20 grayscale pointer-events-none scale-90' : ''}>
                                                    <Node data={char} color="bg-indigo-600" isDraggable={!isPlaced} onDragEnd={(_, info) => handleDragEnd(char.id, info.point)} isSmall />
                                                </div>
                                                {isPlaced && <div className="absolute inset-0 flex items-center justify-center"><Check className="text-white/20" size={40} /></div>}
                                            </div>
                                        );
                                    })}
                                 </div>
                             )}
                         </div>
                       </div>
                     )}
                   </motion.div>
                ) : (
                  <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex flex-col items-center gap-8 text-center p-6 sm:p-10 w-full">
                    <Trophy size={100} className="text-yellow-400 animate-bounce shadow-amber-400/20 drop-shadow-xl" />
                    <h2 className="text-white text-4xl sm:text-6xl font-black uppercase tracking-tighter leading-none mb-4">LOGIC CERTIFIED</h2>
                    <div className="flex flex-col sm:flex-row gap-4 w-full justify-center max-w-lg mt-6">
                        <button onClick={handleReset} className="flex-1 bg-black/40 text-[#a88a6d] hover:text-white border-2 border-white/10 px-6 py-4 rounded-2xl font-black uppercase text-sm sm:text-base shadow-xl transition-all">
                            Restart Module
                        </button>
                        <button onClick={() => navigate('/learn/logicalReasoning/bloodRelations/ancilliary')} className="flex-1 bg-amber-400 text-black border-b-8 border-amber-600 px-6 py-4 rounded-2xl font-black uppercase text-sm sm:text-base shadow-xl hover:scale-105 transition-all">
                            Next Module
                        </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>

        <div className="w-full flex-none mt-2 bg-[#1a0f0d] p-4 sm:p-6 rounded-[3rem] border-t-4 border-black shadow-2xl relative z-50 flex flex-col gap-4 overflow-hidden border-b-[10px] border-black/40 min-h-[300px] sm:min-h-[380px]">
          <div className="grid grid-cols-1 md:grid-cols-[1.2fr_1.8fr] gap-6 h-full relative z-10">
            <div className="flex flex-col gap-2 min-h-0">
              <div className="bg-black/40 p-4 rounded-[1.5rem] border border-white/10 flex flex-col gap-2 flex-1 overflow-y-auto custom-scrollbar shadow-inner text-white font-black">
                {appMode === 'concept' ? (
                   <div className="space-y-4">
                     <p className="text-white text-base sm:text-xl font-black border-b border-white/5 pb-2 flex items-center gap-2 uppercase tracking-tighter"><GitBranch size={16} className="text-yellow-400" /> {CONCEPT_PROTOCOLS[activeTab].title}</p>
                     <div className="space-y-2 text-white/80">
                        {CONCEPT_PROTOCOLS[activeTab].logicPoints.map((pt, i) => (
                           <div key={i} className="flex items-start gap-2 text-left py-0.5"><Check size={14} className="text-yellow-400 shrink-0 mt-0.5" strokeWidth={4} /><p className="text-white font-bold italic text-[12px] sm:text-[14px] leading-tight tracking-tight">{pt}</p></div>
                        ))}
                     </div>
                   </div>
                ) : (
                   <div className="flex flex-col gap-3 h-full">
                     <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                        <span className="text-orange-400 font-black text-[10px] sm:text-xs uppercase tracking-[0.2em] opacity-80">
                            Trial {practiceStep + 1} of {PRACTICE_TASKS.length}
                        </span>
                        <div className="flex items-center gap-2">
                            <button onClick={prevPracticeTask} disabled={practiceStep === 0} className="p-1.5 bg-white/5 rounded-lg hover:bg-white/10 disabled:opacity-30 disabled:pointer-events-none transition-all border border-white/5">
                                <ChevronLeft size={16} className="text-orange-400" />
                            </button>
                            <button onClick={skipPracticeTask} className="p-1.5 bg-white/5 rounded-lg hover:bg-white/10 transition-all border border-white/5">
                                <ChevronRight size={16} className="text-orange-400" />
                            </button>
                        </div>
                     </div>
                     <div className="space-y-2 overflow-y-auto custom-scrollbar pr-2">
                        {PRACTICE_TASKS[practiceStep].clues.map((clue, i) => (
                            <div key={i} className="flex items-start gap-3 group cursor-pointer text-left py-1" onClick={() => toggleClue(i)}>
                                {completedClues.includes(i) ? <CheckSquare className="text-emerald-500 shrink-0" size={18} /> : <Square className="text-white/20 shrink-0" size={18} />}
                                <p className={`text-white font-bold leading-tight ${completedClues.includes(i) ? 'opacity-40 line-through italic text-emerald-400' : ''}`}>{clue}</p>
                            </div>
                        ))}
                     </div>
                   </div>
                )}
              </div>
            </div>

            <div className="flex flex-col gap-2 min-h-0">
              <div className="bg-[#2a1a16] p-4 rounded-[1.5rem] border border-white/5 flex flex-col items-center justify-center gap-4 shadow-inner flex-1 overflow-hidden relative">
                <AnimatePresence mode="wait">
                  {!lessonFinished ? (
                    appMode === 'concept' ? (
                      <motion.div key="academy-tabs" className="w-full h-full flex flex-col gap-4">
                         <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5 bg-black/40 p-1.5 rounded-xl border border-white/5">
                            {CONCEPT_PROTOCOLS.map((rel, i) => (<button key={rel.id} onClick={() => setActiveTab(i)} className={`py-2 rounded-lg text-[9px] font-black uppercase transition-all ${activeTab === i ? 'bg-yellow-400 text-black shadow-lg scale-105' : 'text-[#a88a6d] hover:text-white'}`}>{rel.tab}</button>))}
                         </div>
                         <div className="flex-1 bg-black/20 p-5 rounded-2xl border border-white/5 flex flex-col items-center justify-center text-center gap-3 shadow-inner">
                            <p className="text-white text-[14px] sm:text-[18px] font-bold leading-relaxed italic">{CONCEPT_PROTOCOLS[activeTab].definition}</p>
                            <button onClick={() => activeTab === CONCEPT_PROTOCOLS.length - 1 ? setAppMode('practice') : setActiveTab(prev => prev + 1)} className="mt-2 flex items-center gap-3 bg-emerald-500 text-white px-8 py-2.5 rounded-full font-black uppercase text-[11px] shadow-xl border-b-4 border-emerald-800 active:scale-95 transition-all">
                                {activeTab === CONCEPT_PROTOCOLS.length - 1 ? "Engage Practice Hub" : "Observe Next"} <ArrowRight size={16} />
                            </button>
                         </div>
                      </motion.div>
                    ) : (
                      <motion.div key="practice-ui" className="w-full flex flex-col gap-3 h-full">
                         {practicePhase === 'build' ? (
                             <div className="flex flex-col items-center justify-center flex-1 gap-4">
                                <p className="text-stone-400 text-[10px] uppercase font-black text-center px-4 leading-tight tracking-widest">Construct the mapping defined in the log.</p>
                                <button onClick={validateBuild} disabled={Object.keys(placedItems).length < PRACTICE_TASKS[practiceStep].slots.length} className={`px-16 py-4 rounded-2xl font-black uppercase text-[13px] shadow-2xl transition-all active:scale-95 flex items-center gap-3 border-b-4 ${Object.keys(placedItems).length >= PRACTICE_TASKS[practiceStep].slots.length ? 'bg-amber-400 text-black border-amber-700' : 'bg-black/20 text-white/20 border-transparent pointer-events-none'}`}>Validate Arrangement <ChevronRight size={18} /></button>
                             </div>
                         ) : (
                            <div className="flex flex-col gap-2 h-full overflow-y-auto no-scrollbar pt-1 text-white">
                                <div className="bg-black/20 p-3 rounded-xl border border-white/5 mb-1 text-left"><p className="text-white text-[15px] sm:text-lg font-black leading-tight tracking-tight px-2">{PRACTICE_TASKS[practiceStep].followUp.q}</p></div>
                                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                                    {PRACTICE_TASKS[practiceStep].followUp.options.map((opt, i) => {
                                        const isSelected = quizFeedback?.selected === i;
                                        const isCorrectIdx = i === PRACTICE_TASKS[practiceStep].followUp.correct;
                                        let btnClass = isSelected ? (quizFeedback.isCorrect ? "bg-emerald-600 border-emerald-400 scale-105 shadow-emerald-500/20" : "bg-rose-600 border-rose-400 shadow-rose-500/20") : "bg-black/40 border-white/10 text-white/80";
                                        if (quizFeedback && isCorrectIdx) btnClass = "bg-emerald-600 border-emerald-400 text-white scale-105 shadow-emerald-500/20";
                                        return (<button key={i} disabled={quizFeedback?.isCorrect} onClick={() => handleQuizSelection(i)} className={`p-3 rounded-xl font-black uppercase transition-all text-[11px] border-2 ${btnClass} ${!quizFeedback ? 'hover:bg-black/80' : ''}`}>{opt}</button>);
                                    })}
                                </div>
                                {quizFeedback && (
                                    <div className="flex gap-2 w-full mt-auto">
                                        {!quizFeedback.isCorrect && <button onClick={() => setQuizFeedback(null)} className="flex-1 py-2.5 bg-rose-600 text-white rounded-full font-black text-[10px] uppercase shadow-lg flex items-center justify-center gap-2"><RefreshCw size={14} /> Try Again</button>}
                                        <button onClick={quizFeedback.isCorrect ? nextPracticeTask : () => setShowExplanation(!showExplanation)} className={`flex-1 py-2.5 text-white rounded-full font-black text-[10px] uppercase shadow-xl flex items-center justify-center gap-2 transition-all ${quizFeedback.isCorrect ? 'bg-emerald-600 hover:bg-emerald-500' : 'bg-blue-600 hover:bg-blue-500'}`}>{quizFeedback.isCorrect ? "Next Mission" : (showExplanation ? "Hide Logic" : "View Logic")} {quizFeedback.isCorrect && <ChevronRight size={14} />}</button>
                                    </div>
                                )}
                            </div>
                         )}
                      </motion.div>
                    )
                  ) : (
                    <div className="flex flex-col items-center justify-center h-full gap-4 text-center"><Zap size={48} className="text-yellow-400 animate-pulse" /><p className="text-[#a88a6d] font-bold italic text-lg px-8">Diagnostic Trial Success.</p><button onClick={handleReset} className="bg-yellow-400 text-black px-16 py-4 rounded-[2rem] font-black uppercase tracking-[0.2em] text-[13px] shadow-2xl active:scale-95 border-b-8 border-amber-600 hover:scale-105 transition-all">Restart Concept</button></div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

function TreeVisual({ data }) {
    if (data.type === 'dual-case-vertical-direct') return (
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 items-center overflow-x-auto w-full justify-center px-4">
        {[data.case1, data.case2].map((c, i) => (
          <div key={i} className="flex flex-col items-center gap-2 bg-[#1a110f] p-12 rounded-full border border-white/5 shadow-inner min-w-[340px] sm:min-w-[480px] h-[480px] justify-center relative overflow-hidden">
            <span className="text-amber-400 font-black uppercase text-[10px] tracking-widest mb-12 text-center absolute top-12">{c.title}</span>
            <Node data={c.top} color={i === 0 ? "bg-amber-600" : "bg-purple-600"} isSmall />
            <div className="w-[2px] bg-yellow-400 h-24 relative mt-2 mb-2">
                <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[12px] border-l-transparent border-r-transparent border-t-yellow-400" />
            </div>
            <Node data={c.btm} color="bg-stone-600" isSmall />
          </div>
        ))}
      </div>
    );

    if (data.type === 'dual-case-chain') return (
        <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 items-center overflow-x-auto w-full justify-center px-4">
          {[data.case1, data.case2].map((c, i) => (
            <div key={i} className="flex flex-col items-center gap-2 bg-[#1a110f] p-12 rounded-full border border-white/5 shadow-inner min-w-[340px] sm:min-w-[480px] h-[520px] justify-center relative overflow-hidden">
              <span className="text-amber-400 font-black uppercase text-[10px] tracking-widest mb-8 text-center absolute top-12">{c.title}</span>
              <Node data={c.top} color="bg-amber-600" isSmall />
              <div className="w-[1.5px] bg-yellow-400 h-14 relative mt-1 mb-1">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[5px] border-r-[5px] border-t-[10px] border-l-transparent border-r-transparent border-t-yellow-400" />
              </div>
              <Node data={c.mid} color="bg-blue-600" isSmall />
              <div className="w-[1.5px] bg-yellow-400 h-14 relative mt-1 mb-1">
                  <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[5px] border-r-[5px] border-t-[10px] border-l-transparent border-r-transparent border-t-yellow-400" />
              </div>
              <Node data={c.btm} color="bg-stone-600" isSmall />
            </div>
          ))}
        </div>
      );

    if (data.type === 'dual-case-inlaw-screenshot-flow') return (
      <div className="flex flex-col sm:flex-row gap-8 sm:gap-16 items-center overflow-x-auto w-full justify-center px-4">
        {[data.case1, data.case2].map((c, i) => (
          <div key={i} className="flex flex-col items-center bg-[#1a110f] p-12 rounded-full border border-white/5 shadow-inner min-w-[340px] sm:min-w-[480px] h-[480px] sm:h-[540px] justify-center relative overflow-hidden shrink-0">
            <span className="text-amber-400 font-black uppercase text-[10px] tracking-widest mb-10 text-center absolute top-12">{c.title}</span>
            
            <div className="relative w-full max-w-[280px] sm:max-w-[300px] aspect-square mt-12 shrink-0">
                {/* Fixed Grid Nodes (110x110 wrappers for perfect scaling within viewBox 300 300) */}
                <div className="absolute top-0 left-0 w-[110px] h-[110px] flex items-center justify-center z-10">
                    <Node data={i === 0 ? c.father : c.me} color={i === 0 ? "bg-amber-600" : "bg-blue-600"} isSmall />
                </div>
                <div className="absolute bottom-0 left-0 w-[110px] h-[110px] flex items-center justify-center z-10">
                    <Node data={i === 0 ? c.spouse : c.daughter} color="bg-purple-600" isSmall />
                </div>
                <div className="absolute bottom-0 right-0 w-[110px] h-[110px] flex items-center justify-center z-10">
                    <Node data={i === 0 ? c.me : c.husband} color={i === 0 ? "bg-blue-600" : "bg-stone-600"} isSmall />
                </div>

                {/* SVG Connectors Matrix (300x300 viewbox) - Coords matched to 55px centers */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 300 300" preserveAspectRatio="xMidYMid meet">
                    {/* Vertical Arrow */}
                    <line x1="55" y1="115" x2="55" y2="185" stroke="#facc15" strokeWidth="2.5" />
                    <polygon points="48,183 62,183 55,193" fill="#facc15" />

                    {/* Marriage Bond */}
                    <line x1="115" y1="241" x2="185" y2="241" stroke="#facc15" strokeWidth="2" opacity="0.6" />
                    <line x1="115" y1="249" x2="185" y2="249" stroke="#facc15" strokeWidth="2" opacity="0.6" />
                    
                    {/* Dotted Logic Line */}
                    {i === 0 ? (
                        <>
                           {/* Father-in-law: Arrow points from Me (Right, 245, 245) up to Father (Left, 55, 55) */}
                           <path d="M 245 185 L 245 55 L 120 55" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="8 8" />
                           <polygon points="120,48 120,62 110,55" fill="#fbbf24" />
                        </>
                    ) : (
                        <>
                           {/* Son-in-law: Arrow points from Me (Left, 55, 55) down to Husband (Right, 245, 245) */}
                           <path d="M 115 55 L 245 55 L 245 185" fill="none" stroke="#fbbf24" strokeWidth="2.5" strokeDasharray="8 8" />
                           <polygon points="238,185 252,185 245,195" fill="#fbbf24" />
                        </>
                    )}
                </svg>

                {/* Heart Icon centered on Marriage Bond */}
                <div className="absolute bottom-[40px] left-[50%] -translate-x-1/2 z-20 bg-[#1a110f] rounded-full px-1.5 py-0.5 border border-white/5 shadow-inner">
                    <Heart size={14} className="text-rose-500 fill-rose-500" />
                </div>
            </div>
          </div>
        ))}
      </div>
    );

    return null;
}

function PracticeTemplate({ task, placedItems, onRemove, showRemove }) {
    const { template, slots, characters } = task;
    
    if (template === 'inlaw-construction-svg') {
        return (
            <div className="grid grid-cols-[auto_40px_auto] sm:grid-cols-[auto_60px_auto] gap-y-2 items-start mt-4">
                {/* Top Left: Father */}
                <div className="col-start-1 row-start-1 flex justify-center z-10">
                    <Slot data={slots[0]} placedId={placedItems[0]} characters={characters} onRemove={() => onRemove(0)} showRemove={showRemove} isSmall />
                </div>
                {/* Vertical Arrow */}
                <div className="col-start-1 row-start-2 flex justify-center py-1 z-0">
                    <div className="w-[2px] bg-yellow-400 h-10 sm:h-14 relative">
                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent border-t-yellow-400" />
                    </div>
                </div>
                {/* Bottom Left: Spouse */}
                <div className="col-start-1 row-start-3 flex justify-center z-10">
                    <Slot data={slots[1]} placedId={placedItems[1]} characters={characters} onRemove={() => onRemove(1)} showRemove={showRemove} isSmall />
                </div>
                {/* Horizontal Marriage Bond */}
                <div className="col-start-2 row-start-3 flex items-start justify-center mt-[40px] sm:mt-[48px] -mx-4 z-0">
                   <div className="w-full h-0.5 border-t-4 border-double border-yellow-400/40 flex items-center justify-center relative">
                        <Heart size={14} className="text-rose-500 fill-rose-500 absolute bg-transparent px-0.5" />
                   </div>
                </div>
                {/* Bottom Right: Me */}
                <div className="col-start-3 row-start-3 flex justify-center z-10">
                    <Slot data={slots[2]} placedId={placedItems[2]} characters={characters} onRemove={() => onRemove(2)} showRemove={showRemove} isSmall />
                </div>
            </div>
        );
    }

    if (template === 'son-inlaw-construction-svg') {
        return (
            <div className="grid grid-cols-[auto_40px_auto] sm:grid-cols-[auto_60px_auto] gap-y-2 items-start mt-4">
                {/* Top Left: Me */}
                <div className="col-start-1 row-start-1 flex justify-center z-10">
                    <Slot data={slots[0]} placedId={placedItems[0]} characters={characters} onRemove={() => onRemove(0)} showRemove={showRemove} isSmall />
                </div>
                {/* Vertical Arrow */}
                <div className="col-start-1 row-start-2 flex justify-center py-1 z-0">
                    <div className="w-[2px] bg-yellow-400 h-10 sm:h-14 relative">
                       <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[10px] border-l-transparent border-r-transparent border-t-yellow-400" />
                    </div>
                </div>
                {/* Bottom Left: Daughter */}
                <div className="col-start-1 row-start-3 flex justify-center z-10">
                    <Slot data={slots[1]} placedId={placedItems[1]} characters={characters} onRemove={() => onRemove(1)} showRemove={showRemove} isSmall />
                </div>
                {/* Horizontal Marriage Bond */}
                <div className="col-start-2 row-start-3 flex items-start justify-center mt-[40px] sm:mt-[48px] -mx-4 z-0">
                   <div className="w-full h-0.5 border-t-4 border-double border-yellow-400/40 flex items-center justify-center relative">
                        <Heart size={14} className="text-rose-500 fill-rose-500 absolute bg-transparent px-0.5" />
                   </div>
                </div>
                {/* Bottom Right: Husband */}
                <div className="col-start-3 row-start-3 flex justify-center z-10">
                    <Slot data={slots[2]} placedId={placedItems[2]} characters={characters} onRemove={() => onRemove(2)} showRemove={showRemove} isSmall />
                </div>
            </div>
        );
    }
    
    if (template === 'direct-vertical') {
        return (
            <div className="flex flex-col items-center">
                <Slot data={slots[0]} placedId={placedItems[0]} characters={characters} onRemove={() => onRemove(0)} showRemove={showRemove} isSmall />
                <div className="w-[2px] bg-yellow-400 h-20 relative mt-2 mb-2">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[6px] border-r-[6px] border-t-[12px] border-l-transparent border-r-transparent border-t-yellow-400" />
                </div>
                <Slot data={slots[1]} placedId={placedItems[1]} characters={characters} onRemove={() => onRemove(1)} showRemove={showRemove} isSmall />
            </div>
        );
    }
    
    if (template === 'vertical-chain') {
        return (
            <div className="flex flex-col items-center">
                <Slot data={slots[0]} placedId={placedItems[0]} characters={characters} onRemove={() => onRemove(0)} showRemove={showRemove} isSmall />
                <div className="w-[1.5px] bg-yellow-400 h-12 relative mt-1 mb-1">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[5px] border-r-[5px] border-t-[10px] border-l-transparent border-r-transparent border-t-yellow-400" />
                </div>
                <Slot data={slots[1]} placedId={placedItems[1]} characters={characters} onRemove={() => onRemove(1)} showRemove={showRemove} isSmall />
                <div className="w-[1.5px] bg-yellow-400 h-12 relative mt-1 mb-1">
                    <div className="absolute bottom-0 left-1/2 -translate-x-1/2 border-l-[5px] border-r-[5px] border-t-[10px] border-l-transparent border-r-transparent border-t-yellow-400" />
                </div>
                <Slot data={slots[2]} placedId={placedItems[2]} characters={characters} onRemove={() => onRemove(2)} showRemove={showRemove} isSmall />
            </div>
        );
    }

    return null;
}

// export default function App() { return ( <Router> <LabContent /> </Router> ); }