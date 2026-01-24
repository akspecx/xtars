import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  X as CloseIcon,
  Trophy,
  CheckCircle2,
  Trash2,
  Lightbulb,
  ArrowRightLeft,
  Play,
  Pause,
  RotateCcw,
  AlertCircle,
  Search,
  ArrowUp,
  Maximize2,
  HelpCircle,
  Layers,
  BrainCircuit,
  Eye,
  Box,
  XCircle,
  Square,
  GraduationCap,
  Undo2,
  Ban,
  Plus,
  Info
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// DATA CONFIGURATIONS
// ==========================================
const PEOPLE_DATA = {
  pA: { name: 'Aanya', initial: 'A', color: 'from-rose-400 to-rose-600', hex: 0xfb7185 },
  pB: { name: 'Ben', initial: 'B', color: 'from-sky-400 to-sky-600', hex: 0x38bdf8 },
  pC: { name: 'Chintu', initial: 'C', color: 'from-amber-400 to-amber-600', hex: 0xfbbf24 },
  pD: { name: 'Diya', initial: 'D', color: 'from-emerald-400 to-emerald-600', hex: 0x34d399 },
  pE: { name: 'Ethan', initial: 'E', color: 'from-purple-400 to-purple-600', hex: 0xc084fc },
  pF: { name: 'Farah', initial: 'F', color: 'from-pink-400 to-pink-600', hex: 0xf472b6 },
  pG: { name: 'Gautam', initial: 'G', color: 'from-cyan-400 to-cyan-600', hex: 0x22d3ee },
  pH: { name: 'Hina', initial: 'H', color: 'from-orange-400 to-orange-600', hex: 0xfb923c },
  pI: { name: 'Ishaan', initial: 'I', color: 'from-indigo-400 to-indigo-600', hex: 0x818cf8 },
};

const ALL_IDS = ['pA', 'pB', 'pC', 'pD', 'pE', 'pF', 'pG', 'pH', 'pI'];

const MISSION = {
  title: "9-Person Puzzle Lab",
  mainHeader: "Nine persons A through I are standing in a line facing North.",
  note: "Logic Rule: No consecutive alphabet letters (A-B, B-C, G-H, etc.) can stand together.",
  theoryIntro: "At times, we will need to handle multiple cases to come to a conclusion. When a rule like 'F has max 2 people to its left' gives us three possibilities, we create three 'Cases' and test them until only one is left standing!",
  instructions: [
    "1. Consecutive alphabetical persons don't stand adjacent.",
    "2. Not more than two persons stand to the left of F.",
    "3. People to the right of F = people to the left of H.",
    "4. H stands third to the right of I.",
    "5. G is 4th from an end and immediate right of A.",
    "6. People between (F and A) = people between (I and E).",
    "7. Only one person stands between C and D."
  ],
  correctLayout: ['pB', 'pF', 'pA', 'pG', 'pI', 'pE', 'pC', 'pH', 'pD'],
  solutionSteps: [
    { why: "Step 1: Rule 2 says 'not more than 2 people left of F'. This means F can be in Slot 1, 2, or 3. Let's create all three cases!", ins: 1, casePlacements: [{ row: 0, slot: 0, personId: 'pF' }, { row: 1, slot: 1, personId: 'pF' }, { row: 2, slot: 2, personId: 'pF' }] },
    
    // CASE 3 PATH (GRANULAR)
    { why: "Step 2: Let's test Case 3. Farah (F) is in Slot 3. There are 6 people to her right.", ins: 1, casePlacements: [] },
    { why: "Step 3: Rule 3 says H must have 6 people to its left. H sits at Slot 7.", ins: 2, casePlacements: [{ row: 2, slot: 6, personId: 'pH' }] },
    { why: "Step 4: Rule 4 says Hina(7) is 3rd right of Ishaan. This forces Ishaan (I) into Slot 4.", ins: 3, casePlacements: [{ row: 2, slot: 3, personId: 'pI' }] },
    { why: "Step 5: Rule 5 says Gautam (G) is 4th from an end. Slot 4 is taken by I. Let's try 4th from the right end (Slot 6).", ins: 4, casePlacements: [{ row: 2, slot: 5, personId: 'pG' }] },
    { why: "Step 6: CLASH! Gautam (G) and Hina (H) are consecutive alphabet letters. Rule 1 says they CANNOT touch. Case 3 Fails!", ins: 0, casePlacements: [{ row: 2, slot: 5, personId: 'pG' }, { row: 2, slot: 6, personId: 'pH' }], conflict: true },
    { why: "Step 7: Case 3 is impossible. We cross it out.", ins: 0, failRows: [2] },
    
    // CASE 1 PATH (GRANULAR)
    { why: "Step 8: Now let's test Case 1. Farah (F) is in Slot 1. Zero people are to her left.", ins: 1, casePlacements: [] },
    { why: "Step 9: Rule 3 says H must have 0 people to its right. H sits at Slot 9.", ins: 2, casePlacements: [{ row: 0, slot: 8, personId: 'pH' }] },
    { why: "Step 10: Rule 4 says Hina(9) is 3rd right of Ishaan. Ishaan (I) sits at Slot 6.", ins: 3, casePlacements: [{ row: 0, slot: 5, personId: 'pI' }] },
    { why: "Step 11: Rule 5 says Gautam (G) is 4th from an end. Slot 6 is taken, so Gautam must be 4th from left (Slot 4).", ins: 4, casePlacements: [{ row: 0, slot: 3, personId: 'pG' }] },
    { why: "Step 12: Rule 5 also says G is immediate right of Aanya (A). Aanya sits at Slot 3.", ins: 4, casePlacements: [{ row: 0, slot: 2, personId: 'pA' }] },
    { why: "Step 13: Rule 6 says people between F(1) and A(3) is ONE. So between Ishaan(6) and Ethan (E) must be 1 person. Ethan takes Slot 8.", ins: 5, casePlacements: [{ row: 0, slot: 7, personId: 'pE' }] },
    { why: "Step 14: Rule 7 says one person between Chintu and Diya. The only free spots that fit are Slots 5 and 7.", ins: 6, casePlacements: [{ row: 0, slot: 4, personId: 'pC' }, { row: 0, slot: 6, personId: 'pD' }] },
    { why: "Step 15: Finally, we place Ben (B). The only seat left is Slot 2. But Aanya (A) is already at Slot 3!", ins: 0, casePlacements: [{ row: 0, slot: 1, personId: 'pB' }] },
    { why: "Step 16: CLASH! Ben and Aanya are consecutive alphabet letters. Touching each other breaks Rule 1. Case 1 Fails!", ins: 0, casePlacements: [{ row: 0, slot: 1, personId: 'pB' }, { row: 0, slot: 2, personId: 'pA' }], conflict: true },
    { why: "Step 17: Case 1 is eliminated. Only Case 2 remains!", ins: 0, failRows: [0, 2] },

    // CASE 2 PATH
    { why: "Step 18: Testing Case 2. Farah (F) is in Slot 2. Rule 3 mirrors Hina (H) to Slot 8.", ins: 2, casePlacements: [{ row: 1, slot: 7, personId: 'pH' }] },
    { why: "Step 19: Rule 4 puts Ishaan (I) at Slot 5. Rule 5 puts Gautam (G) at Slot 4 and Aanya (A) at Slot 3.", ins: 5, casePlacements: [{ row: 1, slot: 4, personId: 'pI' }, { row: 1, slot: 3, personId: 'pG' }, { row: 1, slot: 2, personId: 'pA' }] },
    { why: "Step 20: Applying Rules 6 and 7, we place Ethan at 6, Chintu at 7, and Diya at 9. Ben takes the last spot at Slot 1.", ins: 7, casePlacements: [{ row: 1, slot: 5, personId: 'pE' }, { row: 1, slot: 6, personId: 'pC' }, { row: 1, slot: 8, personId: 'pD' }, { row: 1, slot: 0, personId: 'pB' }] },
    { why: "Step 21: Look! Every person sits without touching their alphabet neighbor. Case 2 is the correct solution!", ins: 0, isComplete: true, casePlacements: [] }
  ],
  questions: [
    { q: "How many persons stand between Ben (B) and Gautam (G)?", options: ["One", "Two", "Three", "More than three"], correct: 1, sol: "B is at S1 and G is at S4. Between them stand Farah(S2) and Aanya(S3). Total: 2 people." },
    { q: "Who stands second to the left of Diya (D)?", options: ["Chintu (C)", "Immediate left of A", "Second left of B", "Ethan (E)"], correct: 0, sol: "Diya is at S9. Two spots to the left (9-2=7) is S7, where Chintu is sitting." },
    { q: "What is the position of Chintu (C) with respect to Hina (H)?", options: ["Second to the left", "Immediate right", "Third to the left", "Immediate left"], correct: 3, sol: "Chintu is at S7 and Hina is at S8. C is on the immediate left side of H." },
    { q: "Alphabet order Z to A: how many remain in the same position?", options: ["One", "Two", "Three", "None"], correct: 0, sol: "Row: B-F-A-G-I-E-C-H-D. Reversed Alphabet: I-H-G-F-E-D-C-B-A. Only C (S7) stays in the same place." },
    { q: "Find the odd one out based on positions:", options: ["Immediate right of C", "Diya (D)", "Third left of H", "Ethan (E)", "Farah (F)"], correct: 1, sol: "Pos: H(S8), D(S9), I(S5), E(S6), F(S2). All are in even numbered slots EXCEPT Diya (Slot 9), who is in an odd slot." }
  ]
};

// ==========================================
// 3D VISUALIZATION
// ==========================================
function ThreeDVisualization({ isOpen, onClose, placedPeople }) {
  const mountRef = useRef(null);
  useEffect(() => {
    if (!isOpen || !mountRef.current) return;
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = () => {
      const THREE = window.THREE;
      if (!THREE) return;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      const scene = new THREE.Scene();
      scene.background = new THREE.Color(0x1a1a16);
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(0, 6, 12);
      camera.lookAt(0, 0, 0);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      mountRef.current.appendChild(renderer.domElement);
      scene.add(new THREE.AmbientLight(0xffffff, 0.7));
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(30, 15), new THREE.MeshPhongMaterial({ color: 0x222222, side: THREE.DoubleSide }));
      floor.rotation.x = Math.PI / 2;
      scene.add(floor);
      scene.add(new THREE.GridHelper(30, 15, 0x444444, 0x222222));

      placedPeople.forEach((personId, idx) => {
        if (!personId || idx >= 9) return;
        const person = PEOPLE_DATA[personId];
        const xPos = (idx - 4) * 2.8;
        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32), new THREE.MeshPhongMaterial({ color: person.hex }));
        base.position.set(xPos, 0.1, 0); scene.add(base);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 128; canvas.height = 128;
        ctx.fillStyle = 'white'; ctx.font = 'bold 80px Noto Sans';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(person.initial, 64, 64);
        const texture = new THREE.CanvasTexture(canvas);
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }));
        sprite.scale.set(1.5, 1.5, 1.5);
        sprite.position.set(xPos, 1.5, 0);
        scene.add(sprite);

        const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.8, 4), new THREE.MeshBasicMaterial({ color: 0x10b981 }));
        arrow.position.set(xPos, 2.5, 0); arrow.rotation.x = -Math.PI / 2; scene.add(arrow);
      });

      let isMouseDown = false, prevX = 0;
      mountRef.current.addEventListener('mousedown', (e) => { isMouseDown = true; prevX = e.clientX; });
      window.addEventListener('mouseup', () => isMouseDown = false);
      window.addEventListener('mousemove', (e) => { if (isMouseDown) { scene.rotation.y += (e.clientX - prevX) * 0.01; prevX = e.clientX; }});
      const animate = () => { requestAnimationFrame(animate); renderer.render(scene, camera); };
      animate();
    };
    document.head.appendChild(script);
    return () => { if (document.head.contains(script)) document.head.removeChild(script); };
  }, [isOpen, placedPeople]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-6xl bg-[#2a1a16] rounded-[3rem] border-4 border-yellow-400/30 overflow-hidden h-[75vh] flex flex-col shadow-2xl">
        <div className="p-6 flex justify-between items-center bg-black/30 text-white">
          <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3"><Box className="text-yellow-400" /> Perspective 3D</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full"><CloseIcon size={32} /></button>
        </div>
        <div className="flex-1 relative cursor-move" ref={mountRef} />
      </div>
    </div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function LabContent() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const slotRefs = useRef([[], [], []]); 
  const tutorialTimeouts = useRef([]);
  
  const [appMode, setAppMode] = useState('concept');
  const [activeRowsCount, setActiveRowsCount] = useState(1);
  const [placedPeopleRows, setPlacedPeopleRows] = useState([Array(9).fill(null), Array(9).fill(null), Array(9).fill(null)]);
  const [failedRows, setFailedRows] = useState([]);
  const [tutorialStep, setTutorialStep] = useState(-1);
  const [tutorialNarrative, setTutorialNarrative] = useState("");
  const [highlightedInstruction, setHighlightedInstruction] = useState(-1);
  const [isTutorialComplete, setIsTutorialComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [tutorialFails, setTutorialFails] = useState([]);
  const [tutorialPlacements, setTutorialPlacements] = useState([Array(9).fill(null), Array(9).fill(null), Array(9).fill(null)]);

  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showQuestionSol, setShowQuestionSol] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);

  const isArrangementCorrect = useMemo(() => {
    return placedPeopleRows[0].every((p, i) => p === MISSION.correctLayout[i]);
  }, [placedPeopleRows]);

  const clearAllTutorials = useCallback(() => {
    tutorialTimeouts.current.forEach(clearTimeout);
    tutorialTimeouts.current = [];
  }, []);

  const applyTutorialStep = useCallback((index) => {
    const stepData = MISSION.solutionSteps;
    if (index < 0) {
      setTutorialPlacements([Array(9).fill(null), Array(9).fill(null), Array(9).fill(null)]);
      setTutorialFails([]); setTutorialNarrative(""); setHighlightedInstruction(-1); setIsTutorialComplete(false); setTutorialStep(-1);
      return;
    }
    if (index >= stepData.length) return;

    let newRows = [Array(9).fill(null), Array(9).fill(null), Array(9).fill(null)];
    let newFails = [];
    for (let i = 0; i <= index; i++) {
      const s = stepData[i];
      if (s?.casePlacements) { s.casePlacements.forEach(p => { newRows[p.row][p.slot] = p.personId; }); }
      if (s?.failRows) newFails = s.failRows;
    }
    const target = stepData[index];
    setTutorialPlacements(newRows);
    setTutorialFails(newFails);
    setTutorialNarrative(String(target?.why || ""));
    setHighlightedInstruction(target?.ins ?? -1);
    setIsTutorialComplete(!!target?.isComplete);
    setTutorialStep(index);
  }, []);

  const handleDragEnd = useCallback((event, info, personId) => {
    if (appMode !== 'practice' || isArrangementCorrect) return;
    const dropPoint = { x: info.point.x, y: info.point.y };
    let minDistance = 1000;
    let bestRow = -1;
    let bestSlot = -1;

    for (let r = 0; r < activeRowsCount; r++) {
      for (let s = 0; s < 9; s++) {
        const ref = slotRefs.current[r][s];
        if (!ref) continue;
        const rect = ref.getBoundingClientRect();
        const centerX = rect.left + window.scrollX + rect.width / 2;
        const centerY = rect.top + window.scrollY + rect.height / 2;
        const dist = Math.sqrt(Math.pow(dropPoint.x - centerX, 2) + Math.pow(dropPoint.y - centerY, 2));
        if (dist < 55 && dist < minDistance) {
          minDistance = dist; bestRow = r; bestSlot = s;
        }
      }
    }

    if (bestRow !== -1) {
      setPlacedPeopleRows(prev => {
         const next = [...prev];
         const updatedRow = [...next[bestRow]];
         const existingIdx = updatedRow.findIndex(p => p === personId);
         if (existingIdx !== -1) updatedRow[existingIdx] = null;
         updatedRow[bestSlot] = personId;
         next[bestRow] = updatedRow;
         return next;
      });
    }
  }, [appMode, activeRowsCount, isArrangementCorrect]);

  const handleNextAction = useCallback(() => {
    if (activeQuestionIndex < MISSION.questions.length - 1) {
        setActiveQuestionIndex(prev => prev + 1); setSelectedOption(null); setIsCorrect(false); setAutoNextTimer(null); setShowQuestionSol(false);
    } else { setSessionCompleted(true); }
  }, [activeQuestionIndex]);

  const handleAnswerSelect = useCallback((index) => {
    if (isCorrect) return;
    setSelectedOption(index);
    if (index === MISSION.questions[activeQuestionIndex].correct) {
      setIsCorrect(true); setIsError(false); setAutoNextTimer(10);
    } else {
      setIsError(true); setTimeout(() => setIsError(false), 600);
    }
  }, [isCorrect, activeQuestionIndex]);

  useEffect(() => {
    if (appMode === 'concept' && tutorialStep !== -1 && !isPaused && !isTutorialComplete) {
      const timeout = setTimeout(() => applyTutorialStep(tutorialStep + 1), 7500);
      tutorialTimeouts.current.push(timeout);
      return () => clearTimeout(timeout);
    }
  }, [appMode, tutorialStep, isPaused, isTutorialComplete, applyTutorialStep]);

  useEffect(() => {
    let interval; 
    if (autoNextTimer !== null && autoNextTimer > 0) { interval = setInterval(() => setAutoNextTimer(p => p - 1), 1000); } 
    else if (autoNextTimer === 0) { handleNextAction(); } 
    return () => clearInterval(interval);
  }, [autoNextTimer, handleNextAction]);

  const renderSlot = (rowIdx, colIdx, currentPlacements) => {
    const personId = currentPlacements[rowIdx][colIdx];
    const person = personId ? PEOPLE_DATA[personId] : null;
    const stepData = tutorialStep !== -1 ? MISSION.solutionSteps[tutorialStep] : null;
    const isConflict = appMode === 'concept' && tutorialStep !== -1 && stepData?.conflict && stepData?.casePlacements?.some(cp => cp.row === rowIdx && cp.slot === colIdx);
    const isTutoTarget = appMode === 'concept' && tutorialStep !== -1 && stepData?.casePlacements?.some(cp => cp.row === rowIdx && cp.slot === colIdx);
    const isRowFailed = (appMode === 'practice' ? failedRows : tutorialFails).includes(rowIdx);

    return (
      <div key={`${rowIdx}-${colIdx}`} className="flex flex-col items-center relative">
        <div ref={el => { slotRefs.current[rowIdx][colIdx] = el }}
          className={`relative w-9 h-9 sm:w-14 sm:h-14 rounded-full border-2 transition-all duration-500 flex items-center justify-center
            ${person ? `bg-gradient-to-br ${person.color} border-white ring-2 ring-black/20 scale-105 shadow-xl` : 'border-dashed border-white/10 bg-[#2a1a16]/50 shadow-inner'}
            ${isTutoTarget ? 'ring-4 ring-yellow-400 ring-offset-2 scale-110 z-20' : ''}
            ${isConflict ? 'ring-4 ring-red-500 ring-offset-2 animate-shake z-20' : ''}
            ${isRowFailed ? 'opacity-30 grayscale' : 'opacity-100'}`}
        >
          {person ? (
            <div className="flex flex-col items-center justify-center relative w-full h-full">
              <span className="text-white font-black text-xs sm:text-xl drop-shadow-lg select-none">{String(person.initial)}</span>
              <div className="absolute -top-6 p-0.5 rounded-full border shadow-xl bg-emerald-500 border-emerald-300 text-white"><ArrowUp size={8} /></div>
              {appMode === 'practice' && !isArrangementCorrect && (
                <button onClick={() => setPlacedPeopleRows(prev => { const n = [...prev]; const r = [...n[rowIdx]]; r[colIdx] = null; n[rowIdx] = r; return n; })} 
                className="absolute -bottom-2 bg-red-600 p-0.5 rounded-full z-20 shadow-lg border border-white text-white hover:scale-110 transition-transform"><Trash2 size={8}/></button>
              )}
            </div>
          ) : ( <div className="opacity-10 text-white font-black text-[8px]">S{colIdx+1}</div> )}
        </div>
      </div>
    );
  };

  const renderRow = (idx, name, currentPlacements) => {
      const isFailed = (appMode === 'practice' ? failedRows : tutorialFails).includes(idx);
      const isWinner = appMode === 'concept' && isTutorialComplete && idx === 1;

      return (
          <div key={idx} className="w-full flex flex-col items-center relative mb-2">
              <div className="w-full flex items-center gap-2 sm:gap-4 justify-center px-4">
                  <div className={`w-24 text-[9px] font-black uppercase text-center ${isFailed ? 'text-rose-500 line-through opacity-50' : isWinner ? 'text-green-500' : 'text-white/40'}`}>
                      {name}
                  </div>
                  <div className="flex-1 max-w-4xl flex justify-center gap-1.5 sm:gap-4 relative px-3 py-2 rounded-[2rem] bg-black/20 border border-white/5 shadow-inner overflow-visible">
                      {isFailed && (
                          <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-[40] flex items-center justify-center bg-rose-900/40 backdrop-blur-[1px] rounded-[2rem]">
                              <XCircle className="text-rose-500" size={48} />
                          </motion.div>
                      )}
                      {Array(9).fill(0).map((_, col) => renderSlot(idx, col, currentPlacements))}
                  </div>
                  {appMode === 'practice' ? (
                      <button onClick={() => setFailedRows(p => p.includes(idx) ? p.filter(i => i !== idx) : [...p, idx])} className={`p-2 rounded-full transition-all ${isFailed ? 'bg-rose-500 text-white' : 'bg-black/30 text-white/20 hover:text-white/50'}`} title="Mark Invalid"><Ban size={18} /></button>
                  ) : (
                      <div className="w-10" />
                  )}
              </div>
          </div>
      );
  };

  return (
    <div className="min-h-screen bg-[#e6dccb] flex flex-col items-center no-scrollbar overflow-x-hidden font-sans relative pb-20" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      
      <div className="w-full max-w-[1500px] shrink-0 px-4 pt-6 relative z-10">
        <header className="w-full bg-[#2a1a16] p-4 rounded-[2rem] border-b-8 border-black/40 shadow-2xl flex flex-col lg:flex-row justify-between items-center gap-4 text-white">
          <div className="flex flex-col text-left">
            <button onClick={() => navigate('/learn/logicalReasoning/LinearArrangement')} className="flex items-center gap-1.5 text-[#a88a6d] font-black uppercase text-[10px] mb-1 hover:text-white transition-all"><ChevronLeft size={16} /> Dashboard</button>
            <h1 className="text-white text-xl font-black uppercase tracking-tighter text-[#e6dccb]">For multiple cases let's see a bit complex example</h1>
          </div>
          <div className="flex bg-black/30 p-1.5 rounded-2xl border border-white/10">
            <button onClick={() => setAppMode('concept')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${appMode === 'concept' ? 'bg-yellow-400 text-black shadow-lg' : 'text-[#a88a6d] hover:text-white'}`}>Concept</button>
            <button onClick={() => {setAppMode('practice'); setActiveRowsCount(1);}} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${appMode === 'practice' ? 'bg-[#8d6e63] text-white shadow-inner' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
          </div>
        </header>
      </div>

      <div className="w-full max-w-[1500px] px-2 sm:px-4 py-2 relative z-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#2a1a16] p-1 rounded-[2.5rem] shadow-2xl border-4 border-black/40 relative ring-4 ring-black/10 overflow-visible">
          <div className="relative z-10 bg-[#3e2723] pt-6 pb-12 px-1 sm:px-6 rounded-[2rem] flex flex-col items-center justify-center min-h-[750px] shadow-inner overflow-visible">
            
            <div className="bg-black/50 backdrop-blur-md border border-white/10 p-4 sm:p-8 rounded-[2rem] w-full max-w-6xl mb-4 shadow-2xl">
               <div className="mb-4 p-3 bg-white/5 rounded-2xl border-l-4 border-yellow-400 flex justify-between items-center gap-4">
                 <h2 className="text-white text-xs sm:text-base font-black uppercase">{MISSION.mainHeader}</h2>
                 {appMode === 'concept' && tutorialStep === -1 && (
                    <button onClick={() => applyTutorialStep(0)} className="bg-yellow-400 text-black px-4 py-2 rounded-full text-[10px] font-black uppercase flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg border-b-2 border-yellow-800">
                        <Play size={12} fill="currentColor" /> Start Lesson
                    </button>
                 )}
               </div>
               
               {appMode === 'concept' && (
                   <div className="mb-6 p-4 bg-yellow-400/10 rounded-2xl border border-yellow-400/20">
                       <p className="text-yellow-200 text-sm italic font-bold leading-relaxed">"{MISSION.theoryIntro}"</p>
                   </div>
               )}

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2">
                {MISSION.instructions.map((ins, i) => {
                    const isStepActive = appMode === 'concept' && highlightedInstruction === i;
                    const isStepComplete = appMode === 'concept' && highlightedInstruction > i;
                    return (
                        <div key={i} className={`flex items-start text-left gap-3 p-2 rounded-xl border-2 transition-all ${isStepActive ? 'border-yellow-400 bg-yellow-400/10 scale-105 z-10' : 'border-white/5 bg-transparent'}`}>
                            {isStepComplete ? <CheckCircle2 size={12} className="text-green-500 mt-0.5" /> : <Square size={12} className="text-white/20 mt-0.5" />}
                            <p className={`text-[8px] sm:text-[10px] font-bold leading-tight ${isStepActive ? 'text-yellow-400 font-black' : 'text-[#e6dccb]/60'}`}>{ins}</p>
                        </div>
                    );
                })}
               </div>
            </div>

            <div className="w-full flex flex-col items-center py-6 gap-2">
                {appMode === 'concept' ? (
                    <>
                        {renderRow(0, "Case 1 (F at S1)", tutorialPlacements)}
                        {renderRow(1, "Case 2 (F at S2)", tutorialPlacements)}
                        {renderRow(2, "Case 3 (F at S3)", tutorialPlacements)}
                    </>
                ) : (
                    <>
                        {Array(activeRowsCount).fill(0).map((_, i) => renderRow(i, `User Case ${i+1}`, placedPeopleRows))}
                        {activeRowsCount < 3 && (
                            <button onClick={() => setActiveRowsCount(p => p + 1)} className="mt-4 flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/40 px-6 py-2 rounded-full border border-dashed border-white/20 transition-all font-black uppercase text-[10px]">
                                <Plus size={16} /> Add Another Scenario
                            </button>
                        )}
                    </>
                )}
            </div>

            <AnimatePresence mode="wait">
              {appMode === 'concept' && tutorialStep !== -1 && (
                <motion.div key={tutorialStep} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-cyan-900/90 border border-cyan-400/30 text-white px-6 py-5 rounded-[2rem] text-xs sm:text-sm font-black text-center max-w-2xl mb-6 shadow-2xl relative ring-4 ring-cyan-400/10 flex flex-col items-center gap-4">
                  <div className="flex justify-between items-center w-full px-2 border-b border-white/10 pb-2"><span className="text-[10px] uppercase tracking-widest text-cyan-400 flex items-center gap-2"><Layers size={14}/> Lesson Step</span><span className="bg-cyan-500/20 px-3 py-0.5 rounded-full text-[10px] text-cyan-200">Step {tutorialStep + 1} / {MISSION.solutionSteps.length}</span></div>
                  <p className="leading-relaxed px-4 italic font-bold">"{tutorialNarrative}"</p>
                  <div className="flex items-center gap-6 bg-black/40 p-2 rounded-full border border-white/5">
                      <button onClick={() => applyTutorialStep(tutorialStep - 1)} disabled={tutorialStep <= 0} className="p-3 hover:bg-white/10 rounded-full transition-all disabled:opacity-20"><ChevronLeft size={24} /></button>
                      <button onClick={() => setIsPaused(!isPaused)} className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-xl">{isPaused ? <Play size={24} fill="currentColor" /> : <Pause size={24} fill="currentColor" />} </button>
                      <button onClick={() => applyTutorialStep(tutorialStep + 1)} disabled={tutorialStep >= MISSION.solutionSteps.length - 1} className="p-3 hover:bg-white/10 rounded-full transition-all disabled:opacity-20"><ChevronRight size={24} /></button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute top-6 right-6 z-30 flex gap-3"><button onClick={() => setIs3DModalOpen(true)} className="bg-sky-500 text-white p-4 rounded-3xl shadow-2xl flex items-center gap-3 font-black uppercase text-xs hover:scale-105 active:scale-95 transition-all border-b-4 border-sky-800"><Maximize2 size={18} /><span>3D View</span></button></div>

            {/* CHARACTER POOL */}
            <div className="mt-4 p-6 sm:p-10 bg-black/40 rounded-[3.5rem] border border-white/20 w-full max-w-5xl flex flex-col items-center shadow-2xl relative">
              <span className="text-[11px] font-black text-yellow-400 uppercase tracking-[0.6em] mb-4 text-center px-4">Infinite Character Pool</span>
              <div className="flex flex-wrap justify-center gap-3 sm:gap-6">
                  {ALL_IDS.map(id => {
                      const person = PEOPLE_DATA[id]; 
                      return (
                          <motion.div key={id} drag={appMode === 'practice' && !isArrangementCorrect} dragMomentum={false} dragSnapToOrigin={true} onDragEnd={(e, info) => handleDragEnd(e, info, id)} whileHover={{ scale: 1.15, rotate: 5 }} whileDrag={{ scale: 1.25, zIndex: 100 }} className={`w-11 h-11 sm:w-16 sm:h-16 rounded-full border-2 sm:border-4 flex flex-col items-center justify-center bg-gradient-to-br ${person.color} shadow-xl cursor-grab active:cursor-grabbing border-white/40`}><span className="text-white font-black text-lg sm:text-2xl drop-shadow-md select-none">{String(person.initial)}</span></motion.div>
                      );
                  })}
              </div>
            </div>

            {isArrangementCorrect && appMode === 'practice' && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-8 flex flex-col items-center gap-4 relative z-10"><div className="flex items-center gap-4 bg-green-500/20 px-8 py-4 rounded-3xl border-2 border-green-500/50 shadow-2xl ring-4 ring-green-500/10"><CheckCircle2 className="text-green-500" size={24} /><span className="text-green-400 font-black uppercase text-xs tracking-widest">Row Solved!</span></div></motion.div>
            )}
          </div>
        </motion.div>
      </div>

      <ThreeDVisualization isOpen={is3DModalOpen} onClose={() => setIs3DModalOpen(false)} placedPeople={placedPeopleRows[0]} />

      {/* QUIZ SECTION */}
      <div className="w-full max-w-5xl px-4 py-4 mb-24 relative z-10">
        <div className="bg-[#dfd7cc] p-6 sm:p-12 rounded-[3.5rem] border-4 border-[#c4a484] shadow-xl flex flex-col items-center gap-6 w-full relative overflow-hidden min-h-[300px]">
          {!isArrangementCorrect ? (<div className="relative z-10 flex flex-col items-center text-center gap-4 py-6 px-4"><div className="w-16 h-16 bg-[#3e2723]/10 rounded-full flex items-center justify-center text-[#3e2723] animate-pulse"><GraduationCap size={40} /></div><h2 className="text-[#3e2723] text-xl sm:text-3xl font-black uppercase tracking-tight text-center">Practice Assessment</h2><p className="text-[#3e2723]/60 font-bold text-sm sm:text-base max-w-sm italic text-center">Correctly arrange 'User Case 1' to unlock the verification quiz.</p></div>) : (
            <div className="relative z-10 w-full text-center py-2 px-4">
                <div className="mb-4 flex items-center justify-center gap-2"><span className="bg-[#3e2723] text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Verification • Q{activeQuestionIndex + 1}</span></div>
                <h2 className="text-[#3e2723] text-xl sm:text-2xl font-black uppercase mb-10 tracking-tight text-center px-4 leading-tight">{MISSION.questions[activeQuestionIndex].q}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl mx-auto mb-8">
                {MISSION.questions[activeQuestionIndex].options.map((option, idx) => {
                    const isSel = selectedOption === idx; const btnClass = isSel && isCorrect ? 'bg-green-600 border-green-800 text-white shadow-lg' : isSel && isError ? 'bg-red-500 border-red-700 text-white animate-shake' : 'bg-white border-slate-200 text-[#3e2723] hover:bg-slate-50';
                    return <button key={idx} onClick={() => handleAnswerSelect(idx)} className={`group relative p-6 rounded-[1.5rem] border-b-8 font-black text-sm sm:text-lg transition-all ${btnClass}`}>{option}{isSel && isCorrect && <CheckCircle2 className="absolute top-3 right-3 opacity-40" size={16} />}</button>;
                })}
                </div>
                
                <AnimatePresence>
                    {showQuestionSol && (
                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-sky-50 border-l-8 border-sky-500 rounded-2xl text-left shadow-xl max-w-2xl mx-auto mb-8">
                            <h4 className="flex items-center gap-2 text-sky-800 font-black uppercase text-xs mb-2"><Info size={16} /> Solution Explanation</h4>
                            <p className="text-sky-900 font-bold italic">"{MISSION.questions[activeQuestionIndex].sol}"</p>
                        </motion.div>
                    )}
                </AnimatePresence>

                <button onClick={() => setShowQuestionSol(!showQuestionSol)} className="text-[#8d6e63] font-black uppercase text-xs flex items-center gap-2 mx-auto hover:text-black transition-colors underline decoration-dotted"><Search size={14} /> View Answer Logic</button>
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-xl px-4 pb-24 flex flex-col sm:flex-row gap-4 relative z-10">
        <button onClick={() => setSessionCompleted(true)} disabled={!isArrangementCorrect} className={`flex-1 p-6 rounded-3xl font-black uppercase text-[12px] border-b-8 shadow-2xl transition-all flex items-center justify-center gap-3 ${isArrangementCorrect ? 'bg-white text-[#3e2723] border-[#3e2723] opacity-100 hover:scale-105 shadow-xl' : 'bg-gray-200 text-gray-400 border-gray-300 opacity-50 cursor-not-allowed shadow-inner'}`}><Trophy size={20} /> Finish Lab</button>
        <button onClick={handleNextAction} disabled={!isArrangementCorrect || sessionCompleted} className={`flex-1 p-6 rounded-3xl font-black uppercase text-[12px] border-b-8 shadow-2xl transition-all flex items-center justify-center gap-3 ${autoNextTimer !== null ? 'bg-green-600 text-white border-green-800 shadow-green-200' : 'bg-[#8d6e63] text-white border-[#5d4037]'}`}>{autoNextTimer !== null ? `Next (${autoNextTimer}s)` : 'Next Question'} <ChevronRight size={20} /></button>
      </div>

      <AnimatePresence>
        {sessionCompleted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-[#e6dccb] p-8 sm:p-14 rounded-[4rem] border-8 border-[#3e2723] text-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
              <div className="relative z-10 flex flex-col items-center text-center"><div className="w-28 h-28 sm:w-36 sm:h-36 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-8 shadow-2xl border-4 border-white"><Trophy size={72} className="animate-bounce" /></div><h1 className="text-4xl sm:text-6xl font-black text-[#3e2723] uppercase mb-6 tracking-tighter">Lab Complete!</h1><p className="text-[#3e2723] text-lg sm:text-2xl leading-relaxed font-black mb-12 max-w-md mx-auto px-4 text-center">"You successfully applied Multi-Case Logic to solve the 9-person row. You are now a master of logical elimination!"</p><button onClick={() => navigate('/learn/logicalReasoning/LinearArrangement/2DArrangement')} className="relative z-10 px-12 sm:px-16 py-6 sm:py-8 bg-[#3e2723] text-[#e6dccb] rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl border-b-8 border-black hover:scale-105 active:translate-y-2 transition-all">Next Module</button></div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}