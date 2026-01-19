import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  X as CloseIcon,
  Trophy,
  CheckCircle2,
  GraduationCap,
  Trash2,
  Lightbulb,
  ArrowRightLeft,
  Play,
  Pause,
  RotateCcw,
  CheckSquare,
  Square,
  AlertCircle,
  Search,
  ArrowUp,
  ArrowDown,
  RefreshCw,
  Compass,
  Navigation,
  Box,
  Maximize2,
  HelpCircle,
  Layers,
  BrainCircuit
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// DATA CONFIGURATIONS
// ==========================================
const PEOPLE_DATA = {
  pA: { name: 'Person A', initial: 'A', color: 'from-rose-400 to-rose-600', hex: 0xfb7185 },
  pB: { name: 'Person B', initial: 'B', color: 'from-sky-400 to-sky-600', hex: 0x38bdf8 },
  pC: { name: 'Person C', initial: 'C', color: 'from-amber-400 to-amber-600', hex: 0xfbbf24 },
  pD: { name: 'Person D', initial: 'D', color: 'from-emerald-400 to-emerald-600', hex: 0x34d399 },
  pE: { name: 'Person E', initial: 'E', color: 'from-purple-400 to-purple-600', hex: 0xc084fc },
};

const PEOPLE_IDS = ['pA', 'pB', 'pC', 'pD', 'pE'];

const MISSIONS = {
  concept: {
    title: "Perspective Assumption",
    mainHeader: "A, B, C, D and E are sitting in a row facing East.",
    note: "Direction Assumption: Whether the question says East or West, you can choose to face them Away (↑) or Towards (↓). Pick what makes you comfortable!",
    instructions: [
      "1. D is on the left of C.",
      "2. B is on the right of E.",
      "3. A is on the right of C.",
      "4. B is on the left of D.",
      "5. E occupies a corner position."
    ],
    steps: [
      // SCENARIO 1 (TOWARDS)
      { scenario: 's1', why: "Scenario 1: Let's assume 'Facing TOWARDS us (↓)' is East.", ins: -1, done: [] },
      { scenario: 's1', slot: 4, personId: 'pE', facing: 'towards', why: "Anchor: E sits at Slot 5.", ins: 4, done: [] },
      { scenario: 's1', slot: 3, personId: 'pB', facing: 'towards', why: "Facing us, 'Right' points to the observer's LEFT. B takes Slot 4.", ins: 1, done: [4] },
      { scenario: 's1', slot: 2, personId: 'pD', facing: 'towards', why: "Facing us, 'Left' points to the observer's RIGHT. D takes Slot 3.", ins: 3, done: [4, 1] },
      { scenario: 's1', slot: 1, personId: 'pC', facing: 'towards', why: "D(3) is left of C. So C is at Slot 2.", ins: 0, done: [4, 1, 3] },
      { scenario: 's1', slot: 0, personId: 'pA', facing: 'towards', why: "A is right of C. A takes Slot 1.", ins: 2, done: [4, 1, 3, 0] },
      { 
        scenario: 's1', 
        isQuestion: true, 
        q: "In Scenario 1 (Towards), who sits to the RIGHT of Ben (B)?", 
        options: ["Only E", "A, C, and D", "No one"], 
        correct: 1, 
        why: "Correct! For B facing Towards us, his Right points to lower numbers (Slots 1, 2, 3). Remember these names!", 
        ins: -1, done: [0, 1, 2, 3, 4] 
      },
      { scenario: 's1', why: "Remember this result: A, C, and D are to the Right of B. Now let's try Scenario 2.", ins: -1, done: [0, 1, 2, 3, 4] },
      
      // SCENARIO 2 (AWAY)
      { scenario: 's2', why: "Scenario 2: Now assume 'Facing AWAY (↑)' is East for simplicity.", ins: -1, done: [] },
      { scenario: 's2', slot: 0, personId: 'pE', facing: 'away', why: "Anchor: E sits at Slot 1.", ins: 4, done: [] },
      { scenario: 's2', slot: 1, personId: 'pB', facing: 'away', why: "Facing Away, 'Right' matches yours. B takes Slot 2.", ins: 1, done: [4] },
      { scenario: 's2', slot: 2, personId: 'pD', facing: 'away', why: "Clue 4: B is left of D. D takes Slot 3.", ins: 3, done: [4, 1] },
      { scenario: 's2', slot: 3, personId: 'pC', facing: 'away', why: "Clue 1: D is left of C. C takes Slot 4.", ins: 0, done: [4, 1, 3] },
      { scenario: 's2', slot: 4, personId: 'pA', facing: 'away', why: "Clue 3: A is right of C. A takes Slot 5.", ins: 2, done: [4, 1, 3, 0] },
      { 
        scenario: 's2', 
        isQuestion: true, 
        q: "In Scenario 2 (Away), who sits to the RIGHT of Ben (B)?", 
        options: ["Only E", "A, C, and D", "No one"], 
        correct: 1, 
        why: "Exactly! Facing Away, B's Right points to Slots 3, 4, 5. The names are A, C, and D again!", 
        ins: -1, done: [0, 1, 2, 3, 4] 
      },
      { 
        why: "Conclusion: It doesn't matter which direction you pick. The neighbors (A, C, D) are identical. Choose what makes YOU comfortable!", 
        isComplete: true, 
        done: [0, 1, 2, 3, 4] 
      }
    ]
  },
  practice: [
    {
      id: "assumption_practice_final",
      mainHeader: "A, B, C, D and E are sitting in a row facing West.",
      requiredIds: PEOPLE_IDS,
      note: "Hint: The question says 'West'. Ignore the compass, assume they face AWAY (↑) for simplicity.",
      instructions: [
        "1. C is to the IMMEDIATE RIGHT of A.",
        "2. B is sitting BETWEEN E and D.",
        "3. A is at an EXTREME END.",
        "4. D is on the left of C.",
        "5. E is the neighbor of B."
      ],
      correctLayout: {
        r1: ['pA', 'pC', 'pD', 'pB', 'pE'],
        facings: { r1: 'away' }
      },
      explanation: [
        "By assuming the people face Away (North), your Left and Right arms align perfectly with theirs.",
        "Place Person A at the far-left corner (Slot 1).",
        "Place Person C at Slot 2 (Immediate Right of A).",
        "Based on other clues, the sequence naturally flows A-C-D-B-E."
      ],
      questions: [
        { 
          q: "Why is Scenario 2 (Assumption) usually faster than Scenario 1?", 
          options: ["Because North is better than South", "Because you don't have to 'flip' directions in your mind", "It isn't actually faster"], 
          correct: 1,
          explanation: ["When their perspective matches yours, your brain does less work."]
        },
        { 
          q: "In the sequence A-C-D-B-E, who sits at the far-left corner (Slot 1)?", 
          options: ["Person A", "Person E", "Person C"], 
          correct: 0,
          explanation: ["A is anchored at the end and C is to its right."]
        }
      ]
    }
  ]
};

// ==========================================
// 3D VISUALIZATION
// ==========================================
function ThreeDVisualization({ isOpen, onClose, placedPeople, peopleFacings }) {
  const mountRef = useRef(null);
  
  useEffect(() => {
    if (!isOpen || !mountRef.current) return;
    const script = document.createElement('script');
    script.src = 'https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js';
    script.onload = initThree;
    document.head.appendChild(script);

    let renderer, scene, camera, frameId;

    function initThree() {
      const THREE = window.THREE;
      const width = mountRef.current.clientWidth;
      const height = mountRef.current.clientHeight;
      scene = new THREE.Scene();
      scene.background = new THREE.Color(0x1a1a16);
      camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(0, 5, 10);
      camera.lookAt(0, 0, 0);
      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      mountRef.current.appendChild(renderer.domElement);
      scene.add(new THREE.AmbientLight(0xffffff, 0.7));
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(20, 10), new THREE.MeshPhongMaterial({ color: 0x222222, side: THREE.DoubleSide }));
      floor.rotation.x = Math.PI / 2;
      scene.add(floor);
      scene.add(new THREE.GridHelper(20, 10, 0x444444, 0x222222));

      const createLabel = (text) => {
        const canvas = document.createElement('canvas'); const ctx = canvas.getContext('2d');
        canvas.width = 128; canvas.height = 128; ctx.fillStyle = 'white'; ctx.font = 'bold 80px Noto Sans';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle'; ctx.fillText(text, 64, 64);
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas) }));
        sprite.scale.set(1.5, 1.5, 1.5); return sprite;
      };

      placedPeople.forEach((personId, idx) => {
        if (!personId) return;
        const person = PEOPLE_DATA[personId];
        const isS2 = idx >= 5;
        const slotIdx = isS2 ? idx - 5 : idx;
        const xPos = (slotIdx - 2) * 3;
        const zPos = isS2 ? 2 : -2;

        const base = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32), new THREE.MeshPhongMaterial({ color: person.hex }));
        base.position.set(xPos, 0.1, zPos); scene.add(base);
        const label = createLabel(person.initial); label.position.set(xPos, 1.5, zPos); scene.add(label);
        const arrow = new THREE.Mesh(new THREE.ConeGeometry(0.3, 0.8, 4), new THREE.MeshBasicMaterial({ color: peopleFacings[idx] === 'away' ? 0x10b981 : 0xef4444 }));
        arrow.position.set(xPos, 2.5, zPos); arrow.rotation.x = peopleFacings[idx] === 'away' ? -Math.PI / 2 : Math.PI / 2; scene.add(arrow);
      });

      let isMouseDown = false, prevX = 0;
      mountRef.current.addEventListener('mousedown', (e) => { isMouseDown = true; prevX = e.clientX; });
      window.addEventListener('mouseup', () => isMouseDown = false);
      window.addEventListener('mousemove', (e) => { if (!isMouseDown) return; scene.rotation.y += (e.clientX - prevX) * 0.01; prevX = e.clientX; });
      const animate = () => { frameId = requestAnimationFrame(animate); renderer.render(scene, camera); };
      animate();
    }
    return () => { if (frameId) cancelAnimationFrame(frameId); if (document.head.contains(script)) document.head.removeChild(script); };
  }, [isOpen, placedPeople, peopleFacings]);

  if (!isOpen) return null;
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md">
      <div className="relative w-full max-w-5xl bg-[#2a1a16] rounded-[3rem] border-4 border-yellow-400/30 overflow-hidden h-[70vh] flex flex-col shadow-2xl">
        <div className="p-6 flex justify-between items-center bg-black/30 text-white">
          <h2 className="text-xl font-black uppercase tracking-widest flex items-center gap-3"><Box className="text-yellow-400" /> Perspective Comparison</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white"><CloseIcon size={32} /></button>
        </div>
        <div className="flex-1 relative cursor-move" ref={mountRef}>
           <div className="absolute bottom-6 left-6 text-white/40 text-[10px] font-black uppercase tracking-widest bg-black/40 px-4 py-2 rounded-full">Rotate to see the physical layout</div>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// MAIN COMPONENT
// ==========================================
export default function DirectionDoesNotMatter() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const slotRefs = useRef([]);
  const tutorialTimeouts = useRef([]);
  
  // State definitions first
  const [appMode, setAppMode] = useState('concept'); 
  const [activeScenarioTab, setActiveScenarioTab] = useState('s1'); 
  const [placedPeople, setPlacedPeople] = useState(Array(10).fill(null));
  const [peopleFacings, setPeopleFacings] = useState(Array(10).fill('away'));
  const [isArrangementCorrect, setIsArrangementCorrect] = useState(false);
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [userCheckedInstructions, setUserCheckedInstructions] = useState(Array(5).fill(false));
  const [tutorialStep, setTutorialStep] = useState(-1);
  const [tutorialNarrative, setTutorialNarrative] = useState("");
  const [highlightedInstruction, setHighlightedInstruction] = useState(-1);
  const [tutorialDoneIns, setTutorialDoneIns] = useState([]);
  const [isTutorialComplete, setIsTutorialComplete] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);
  const [tutoSelectedOption, setTutoSelectedOption] = useState(null);
  const [tutoIsCorrect, setTutoIsCorrect] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isError, setIsError] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);

  const mission = appMode === 'concept' ? MISSIONS.concept : MISSIONS.practice[0];

  // Callback functions moved to top of LabContent
  const clearAllTutorials = useCallback(() => {
    tutorialTimeouts.current.forEach(clearTimeout);
    tutorialTimeouts.current = [];
  }, []);

  const applyStepState = useCallback((index) => {
    if (index < 0) {
      setPlacedPeople(Array(10).fill(null)); setTutorialNarrative(""); setHighlightedInstruction(-1); setTutorialDoneIns([]); setIsTutorialComplete(false); setTutorialStep(-1);
      return;
    }
    let newPlaced = Array(10).fill(null); let newFacings = Array(10).fill('away');
    for (let i = 0; i <= index; i++) {
      const s = MISSIONS.concept.steps[i];
      if (s && s.scenario) {
        const offset = s.scenario === 's1' ? 0 : 5;
        if (s.personId !== undefined) newPlaced[s.slot + offset] = s.personId;
        if (s.facing) newFacings[s.slot + offset] = s.facing;
      }
    }
    const currentStep = MISSIONS.concept.steps[index];
    if (currentStep && currentStep.scenario) setActiveScenarioTab(currentStep.scenario);
    setPlacedPeople(newPlaced); setPeopleFacings(newFacings); setTutorialNarrative(currentStep?.why || "");
    setHighlightedInstruction(currentStep?.ins ?? -1); setTutorialDoneIns(currentStep?.done || []);
    setIsTutorialComplete(!!currentStep?.isComplete); setTutorialStep(index);
    setTutoSelectedOption(null); setTutoIsCorrect(false);
  }, []);

  const runNextStep = useCallback(() => { 
    const current = MISSIONS.concept.steps[tutorialStep];
    if (current?.isQuestion && !tutoIsCorrect) return;
    if (tutorialStep < MISSIONS.concept.steps.length - 1) {
      applyStepState(tutorialStep + 1);
    }
  }, [tutorialStep, applyStepState, tutoIsCorrect]);

  const runPrevStep = useCallback(() => { if (tutorialStep > 0) applyStepState(tutorialStep - 1); else applyStepState(-1); }, [tutorialStep, applyStepState]);

  const handleNext = useCallback(() => {
    if (appMode === 'concept') { setAppMode('practice'); return; }
    if (activeQuestionIndex < (mission.questions?.length || 0) - 1) {
      setActiveQuestionIndex(prev => prev + 1); setTutoSelectedOption(null); setIsCorrect(false); setIsError(false); setAutoNextTimer(null);
    } else { setSessionCompleted(true); }
  }, [appMode, activeQuestionIndex, mission]);

  const handleTutoAnswer = useCallback((idx) => {
    const current = MISSIONS.concept.steps[tutorialStep];
    if (!current) return;
    setTutoSelectedOption(idx);
    if (idx === current.correct) {
      setTutoIsCorrect(true);
      const autoTimeout = setTimeout(() => {
        if (tutorialStep < MISSIONS.concept.steps.length - 1) {
          applyStepState(tutorialStep + 1);
        }
      }, 3000);
      tutorialTimeouts.current.push(autoTimeout);
    }
  }, [tutorialStep, applyStepState]);

  const handleAnswerSelect = useCallback((index) => {
    if (isCorrect) return; const currentQ = mission.questions?.[activeQuestionIndex]; if (!currentQ) return;
    setSelectedOption(index);
    if (index === currentQ.correct) { setIsCorrect(true); setIsError(false); setAutoNextTimer(8); }
    else { setIsError(true); setTimeout(() => setIsError(false), 600); }
  }, [isCorrect, mission, activeQuestionIndex]);

  const handleDragEnd = useCallback((event, info, personId) => {
    if (appMode === 'concept' || isArrangementCorrect) return;
    const dropPoint = { x: info.point.x, y: info.point.y };
    let targetIdx = -1; let minDistance = 1000;
    slotRefs.current.forEach((ref, index) => {
      if (!ref || index >= 5) return;
      const rect = ref.getBoundingClientRect();
      const slotCenterX = rect.left + window.scrollX + rect.width / 2;
      const slotCenterY = rect.top + window.scrollY + rect.height / 2;
      const dist = Math.sqrt(Math.pow(dropPoint.x - slotCenterX, 2) + Math.pow(dropPoint.y - slotCenterY, 2));
      if (dist < 60 && dist < minDistance) { minDistance = dist; targetIdx = index; }
    });
    if (targetIdx !== -1) {
      setPlacedPeople(prev => {
         const next = [...prev]; const existingIdx = next.findIndex(p => p === personId);
         if (existingIdx !== -1) next[existingIdx] = null; next[targetIdx] = personId; return next;
      });
    }
  }, [appMode, isArrangementCorrect]);

  const toggleDirection = useCallback((idx) => {
    if (isArrangementCorrect || appMode === 'concept') return;
    setPeopleFacings(prev => { const next = [...prev]; next[idx] = next[idx] === 'away' ? 'towards' : 'away'; return next; });
  }, [isArrangementCorrect, appMode]);

  // Effects
  useEffect(() => {
    const current = MISSIONS.concept.steps[tutorialStep];
    if (appMode === 'concept' && tutorialStep !== -1 && !isPaused && !isTutorialComplete && !current?.isQuestion) {
      const timeout = setTimeout(runNextStep, 7000);
      tutorialTimeouts.current.push(timeout);
      return () => clearTimeout(timeout);
    }
  }, [appMode, tutorialStep, isPaused, isTutorialComplete, runNextStep]);

  useEffect(() => {
    let interval; if (autoNextTimer !== null && autoNextTimer > 0 && !isExplaining) { interval = setInterval(() => setAutoNextTimer(p => p - 1), 1000); } 
    else if (autoNextTimer === 0) { handleNext(); } return () => clearInterval(interval);
  }, [autoNextTimer, handleNext, isExplaining]);

  useEffect(() => {
    if (appMode === 'concept') { setIsArrangementCorrect(isTutorialComplete); } 
    else {
        const row = placedPeople.slice(0, 5);
        setIsArrangementCorrect(row.every((p, i) => p === mission.correctLayout.r1?.[i]));
    }
  }, [placedPeople, isTutorialComplete, appMode, mission]);

  const renderSlot = (idx, label) => {
    const personId = placedPeople[idx];
    const person = personId ? PEOPLE_DATA[personId] : null;
    const facing = peopleFacings[idx];
    const isTutoTarget = appMode === 'concept' && tutorialStep !== -1 && (
       idx === (MISSIONS.concept.steps[tutorialStep]?.scenario === 's1' ? MISSIONS.concept.steps[tutorialStep]?.slot : MISSIONS.concept.steps[tutorialStep]?.slot + 5)
    );

    return (
      <div key={idx} className="flex flex-col items-center gap-2 relative z-10">
        <div ref={el => slotRefs.current[idx] = el}
          className={`relative w-14 h-14 sm:w-20 sm:h-20 rounded-full border-4 transition-all duration-500 flex items-center justify-center
            ${person ? `bg-gradient-to-br ${person.color} border-white ring-4 ring-black/20 scale-110 shadow-2xl` : 'border-dashed border-white/10 bg-[#2a1a16]/50 shadow-inner'}
            ${isTutoTarget ? 'ring-4 ring-yellow-400 ring-offset-4 ring-offset-[#3e2723] scale-125 z-20' : ''}`}
        >
          {person ? (
            <div className="flex flex-col items-center justify-center relative w-full h-full">
              <span className="text-white font-black text-xl sm:text-2xl drop-shadow-lg select-none">{person.initial}</span>
              <div className={`absolute -top-8 sm:-top-10 p-1 sm:p-1.5 rounded-full border-2 shadow-xl ${facing === 'away' ? 'bg-emerald-500 border-emerald-300 text-white' : 'bg-rose-600 border-rose-300 text-white'}`}>
                 {facing === 'away' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              </div>
              {!isArrangementCorrect && appMode !== 'concept' && (
                <button onClick={() => setPlacedPeople(prev => { const n = [...prev]; n[idx] = null; return n; })} 
                  className="absolute -bottom-3 bg-red-600 p-1 rounded-full z-20 shadow-lg border border-white text-white hover:scale-110 transition-transform"><Trash2 size={10}/></button>
              )}
            </div>
          ) : ( <div className="opacity-20 text-white font-black text-[10px]">{label}</div> )}
        </div>
        <div className={`w-6 sm:w-10 h-1.5 rounded-full transition-colors ${person ? 'bg-white shadow-[0_0_10px_white]' : 'bg-white/5'}`} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#e6dccb] flex flex-col items-center no-scrollbar overflow-x-hidden font-sans relative pb-20" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      
      <div className="w-full max-w-[1500px] shrink-0 px-4 pt-6 relative z-10">
        <header className="w-full bg-[#2a1a16] p-4 rounded-[2rem] border-b-8 border-black/40 shadow-2xl flex flex-col lg:flex-row justify-between items-center gap-4">
          <div className="flex flex-col text-left">
            <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-[#a88a6d] font-black uppercase text-[10px] mb-1 hover:text-white transition-all"><ChevronLeft size={16} /> Dashboard</button>
            <h1 className="text-white text-xl font-black uppercase tracking-tighter text-[#e6dccb]">Assumption Laboratory</h1>
          </div>
          <div className="flex bg-black/30 p-1 rounded-2xl border border-white/10">
            <button onClick={() => setAppMode('concept')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${appMode === 'concept' ? 'bg-yellow-400 text-[#2a1a16]' : 'text-[#a88a6d] hover:text-white'}`}>Theory</button>
            <button onClick={() => setAppMode('practice')} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${appMode === 'practice' ? 'bg-[#8d6e63] text-white shadow-inner' : 'text-[#a88a6d] hover:text-white'}`}>Solve Puzzle</button>
          </div>
        </header>
      </div>

      <div className="w-full max-w-6xl px-4 py-2 relative z-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#2a1a16] p-1.5 rounded-[2.5rem] shadow-2xl border-4 border-black/40 relative ring-4 ring-black/10 overflow-visible">
          <div className="relative z-10 bg-[#3e2723] pt-6 pb-12 px-2 sm:px-4 rounded-[2rem] flex flex-col items-center justify-center min-h-[750px] shadow-inner overflow-visible">
            
            {appMode === 'concept' && tutorialStep === -1 && (
               <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#3e2723]/60 backdrop-blur-sm rounded-[2rem]">
                  <motion.button whileHover={{ scale: 1.05 }} onClick={() => applyStepState(0)} className="flex flex-col items-center gap-4 bg-yellow-400 p-10 rounded-full shadow-2xl">
                    <div className="bg-[#2a1a16] p-6 rounded-full text-yellow-400"><Play size={48} fill="currentColor" /></div>
                    <span className="text-[#2a1a16] font-black uppercase text-base tracking-widest text-center px-4">Start Case Comparison</span>
                  </motion.button>
               </div>
            )}

            <div className="bg-black/50 backdrop-blur-md border border-white/10 p-4 sm:p-8 rounded-[2rem] w-full max-w-3xl mb-4 shadow-2xl">
               <div className="mb-4 p-3 bg-white/5 rounded-2xl border-l-4 border-yellow-400">
                 <h2 className="text-white text-xs sm:text-base font-black uppercase leading-tight">{mission.mainHeader}</h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  {(mission.instructions || []).map((ins, i) => {
                    const isStepDone = appMode === 'practice' ? userCheckedInstructions[i] : tutorialDoneIns.includes(i);
                    const isHighlight = appMode === 'concept' && highlightedInstruction === i;
                    return (
                      <div key={i} className={`flex items-start text-left gap-3 p-2 rounded-xl border-2 transition-all duration-500 ${isHighlight ? 'bg-yellow-400/10 border-yellow-400 scale-105 z-10 shadow-xl' : isStepDone ? 'bg-green-500/10 border-green-500/40' : 'bg-transparent border-white/5'}`}>
                        {isStepDone ? <CheckCircle2 size={14} className="text-green-500 mt-0.5" /> : <Square size={14} className="text-white/20 mt-0.5" />}
                        <p className={`text-[10px] sm:text-[11px] font-bold leading-tight ${isStepDone ? 'text-green-400' : isHighlight ? 'text-yellow-400 font-black' : 'text-[#e6dccb]/60'}`}>{ins}</p>
                      </div>
                    );
                  })}
               </div>
            </div>

            <div className="flex flex-col items-center gap-2 mb-8 z-30">
                <div className="flex gap-4 bg-black/40 p-1.5 rounded-3xl border border-white/10">
                    <button onClick={() => setActiveScenarioTab('s1')} className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase transition-all ${activeScenarioTab === 's1' ? 'bg-rose-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}>Scenario 1: Face Us ↓</button>
                    <button onClick={() => setActiveScenarioTab('s2')} className={`px-6 py-2 rounded-2xl text-[10px] font-black uppercase transition-all ${activeScenarioTab === 's2' ? 'bg-emerald-500 text-white shadow-lg' : 'text-white/40 hover:text-white'}`}>Scenario 2: Assumption ↑</button>
                </div>
            </div>

            <div className="w-full max-w-3xl px-4 mb-4 text-center">
               <div className="bg-amber-900/40 border border-amber-500/30 p-2.5 rounded-xl inline-flex items-center gap-3 shadow-xl">
                  <HelpCircle size={20} className="text-amber-400" />
                  <p className="text-amber-200 text-[9px] sm:text-[11px] font-bold italic leading-tight">{mission.note}</p>
               </div>
            </div>

            <div className="w-full flex flex-col items-center my-8 px-2 relative">
                <div className="w-full flex justify-center gap-2 sm:gap-14 relative overflow-visible">
                    <div className="absolute -left-4 sm:-left-20 top-1/2 -translate-y-1/2 rotate-90 text-[8px] sm:text-[10px] font-black text-yellow-400 uppercase tracking-widest opacity-40 whitespace-nowrap">The Line</div>
                    <div className="absolute bottom-[-1.5rem] sm:bottom-[-1.8rem] left-[5%] right-[5%] h-1 bg-white/5 rounded-full" />
                    {activeScenarioTab === 's1' 
                      ? Array(5).fill(0).map((_, i) => renderSlot(i, `Slot ${i+1}`)) 
                      : Array(5).fill(0).map((_, i) => renderSlot(i + 5, `Slot ${i+1}`))}
                </div>
            </div>

            <AnimatePresence mode="wait">
              {appMode === 'concept' && tutorialStep !== -1 && (
                <motion.div key={tutorialStep} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-cyan-900/90 border border-cyan-400/30 text-white px-6 py-5 rounded-[2rem] text-xs sm:text-sm font-black text-center max-w-2xl mb-6 shadow-2xl relative ring-4 ring-cyan-400/10 flex flex-col items-center gap-4">
                  <div className="flex justify-between items-center w-full px-2 border-b border-white/10 pb-2">
                     <span className="text-[10px] uppercase tracking-widest text-cyan-400 flex items-center gap-2">
                       {MISSIONS.concept.steps[tutorialStep]?.isQuestion ? <BrainCircuit size={14}/> : <Layers size={14}/>}
                       {MISSIONS.concept.steps[tutorialStep]?.isQuestion ? "Knowledge Check" : "Walkthrough"}
                     </span>
                     <span className="bg-cyan-500/20 px-3 py-0.5 rounded-full text-[10px] text-cyan-200">Step {tutorialStep + 1} / {MISSIONS.concept.steps.length}</span>
                  </div>
                  
                  {MISSIONS.concept.steps[tutorialStep]?.isQuestion ? (
                    <div className="w-full flex flex-col gap-4 py-2">
                      <p className="text-white text-base font-black uppercase text-shadow-sm">{MISSIONS.concept.steps[tutorialStep].q}</p>
                      <div className="grid grid-cols-1 gap-2">
                        {MISSIONS.concept.steps[tutorialStep].options.map((opt, i) => (
                          <button key={i} onClick={() => handleTutoAnswer(i)}
                            className={`p-4 rounded-2xl border-2 font-black transition-all ${tutoSelectedOption === i ? (tutoIsCorrect ? 'bg-green-500 border-green-300' : 'bg-red-500 border-red-300 shake') : 'bg-black/40 border-white/10 hover:border-white/30'}`}
                          >
                            {opt}
                          </button>
                        ))}
                      </div>
                      {tutoIsCorrect && (
                         <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-green-400 text-xs font-black italic">{MISSIONS.concept.steps[tutorialStep].why}</motion.p>
                      )}
                    </div>
                  ) : (
                    <p className="leading-relaxed px-4 italic">"{tutorialNarrative}"</p>
                  )}
                  
                  <div className="flex items-center gap-6 bg-black/40 p-2 rounded-full border border-white/5">
                      <button onClick={runPrevStep} disabled={tutorialStep <= 0} className="p-3 hover:bg-white/10 rounded-full transition-all disabled:opacity-20"><ChevronLeft size={24} /></button>
                      <button onClick={() => setIsPaused(!isPaused)} className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-xl">{isPaused ? <Play size={24} fill="currentColor" /> : <Pause size={24} fill="currentColor" />}</button>
                      <button onClick={runNextStep} disabled={tutorialStep >= MISSIONS.concept.steps.length - 1 || (MISSIONS.concept.steps[tutorialStep]?.isQuestion && !tutoIsCorrect)} className="p-3 hover:bg-white/10 rounded-full transition-all disabled:opacity-20"><ChevronRight size={24} /></button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="absolute top-6 right-6 z-30 flex gap-3">
               <button onClick={() => setIs3DModalOpen(true)} className="bg-sky-500 text-white p-4 rounded-3xl shadow-2xl flex items-center gap-3 font-black uppercase text-xs hover:scale-105 active:scale-95 transition-all border-b-4 border-sky-800"><Maximize2 size={18} /><span>3D View</span></button>
            </div>

            <div className="mt-4 p-6 sm:p-10 bg-black/40 rounded-[3.5rem] border border-white/20 w-full max-w-4xl flex flex-col items-center shadow-2xl relative">
              <span className="text-[11px] font-black text-yellow-400 uppercase tracking-[0.6em] mb-4">Character Pool</span>
              <div className="flex flex-wrap justify-center gap-4">
                  {PEOPLE_IDS.map(id => {
                      const person = PEOPLE_DATA[id]; 
                      const isPlaced = appMode === 'practice' ? placedPeople.slice(0, 5).includes(id) : (activeScenarioTab === 's1' ? placedPeople.slice(0, 5).includes(id) : placedPeople.slice(5, 10).includes(id));
                      return (
                          <motion.div key={id} layoutId={`tag-${id}`}
                              drag={!isArrangementCorrect && !isPlaced && appMode !== 'concept'} dragMomentum={false} onDragEnd={(e, info) => handleDragEnd(e, info, id)}
                              whileHover={{ scale: isPlaced ? 1 : 1.1 }}
                              className={`w-14 h-14 sm:w-20 sm:h-20 rounded-full border-4 flex flex-col items-center justify-center bg-gradient-to-br ${person.color} ${isPlaced ? 'opacity-10 grayscale pointer-events-none' : 'shadow-xl cursor-grab active:cursor-grabbing border-white/40'}`}
                          >
                              <span className="text-white font-black text-2xl drop-shadow-md">{person.initial}</span>
                          </motion.div>
                      );
                  })}
              </div>
            </div>

            {isArrangementCorrect && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-8 flex flex-col items-center gap-4 relative z-10">
                 <div className="flex items-center gap-4 bg-green-500/20 px-8 py-4 rounded-3xl border-2 border-green-500/50 shadow-2xl ring-4 ring-green-500/10">
                    <CheckCircle2 className="text-green-500" size={24} />
                    <span className="text-green-400 font-black uppercase text-xs tracking-widest">Logic Verified!</span>
                 </div>
                 {appMode === 'concept' && <button onClick={() => applyStepState(0)} className="text-[#a88a6d] hover:text-white flex items-center gap-2 font-black uppercase text-[10px] transition-all underline decoration-white/20"><RotateCcw size={14} /> Replay Session</button>}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      <ThreeDVisualization isOpen={is3DModalOpen} onClose={() => setIs3DModalOpen(false)} placedPeople={placedPeople} peopleFacings={peopleFacings} />

      <div className="w-full max-w-5xl px-4 py-4 mb-24 relative z-10">
        <div className="bg-[#dfd7cc] p-6 sm:p-12 rounded-[3.5rem] border-4 border-[#c4a484] shadow-xl flex flex-col items-center gap-6 w-full relative overflow-hidden min-h-[300px]">
          {!isArrangementCorrect ? (
            <div className="relative z-10 flex flex-col items-center text-center gap-4 py-6">
               <div className="w-16 h-16 bg-[#3e2723]/10 rounded-full flex items-center justify-center text-[#3e2723] animate-pulse"><GraduationCap size={40} /></div>
               <h2 className="text-[#3e2723] text-xl sm:text-3xl font-black uppercase tracking-tight text-center px-4">Standard Logic Assessment</h2>
               <p className="text-[#3e2723]/60 font-bold text-sm sm:text-base max-w-sm italic text-center px-4">Solve the puzzle. Even if a direction like 'West' is mentioned, simply align the line to your comfort (Facing Away) to solve it efficiently.</p>
            </div>
          ) : (
            <div className="relative z-10 w-full text-center py-2 px-4">
              {mission.questions && mission.questions.length > 0 ? (
                <>
                  <div className="mb-4 flex items-center justify-center gap-2"><span className="bg-[#3e2723] text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Mastery • Q{activeQuestionIndex + 1}</span></div>
                  <h2 className="text-[#3e2723] text-xl sm:text-2xl font-black uppercase mb-10 tracking-tight text-center">{mission.questions[activeQuestionIndex]?.q}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl mx-auto">
                    {mission.questions[activeQuestionIndex]?.options.map((option, idx) => {
                      const isSel = selectedOption === idx; const btnClass = isSel && isCorrect ? 'bg-green-600 border-green-800 text-white shadow-lg' : isSel && isError ? 'bg-red-500 border-red-700 text-white animate-shake' : 'bg-white border-slate-200 text-[#3e2723] hover:bg-slate-50';
                      return <button key={idx} onClick={() => handleAnswerSelect(idx)} className={`group relative p-6 rounded-[1.5rem] border-b-8 font-black text-sm sm:text-lg transition-all ${btnClass}`}>{option}{isSel && isCorrect && <CheckCircle2 className="absolute top-3 right-3 opacity-40" size={16} />}</button>;
                    })}
                  </div>
                </>
              ) : (
                <div className="py-8 flex flex-col items-center">
                   <h2 className="text-[#3e2723] text-3xl font-black uppercase mb-8 tracking-tight text-center px-4 leading-tight">Comfort Principle Mastered!</h2>
                   <button onClick={() => window.location.reload()} className="bg-[#2a1a16] text-[#e6dccb] px-12 py-4 rounded-2xl font-black uppercase border-b-8 border-black shadow-xl hover:scale-105 transition-all text-lg tracking-widest">Restart Training</button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="w-full max-w-xl px-4 pb-24 flex flex-col sm:flex-row gap-4 relative z-10">
         <button onClick={() => setIsExplaining(true)} disabled={!isArrangementCorrect} className={`flex-1 p-6 rounded-3xl font-black uppercase text-[12px] border-b-8 shadow-2xl transition-all flex items-center justify-center gap-3 ${isArrangementCorrect ? 'bg-white text-[#3e2723] border-[#3e2723] opacity-100 hover:scale-105 shadow-xl' : 'bg-gray-200 text-gray-400 border-gray-300 opacity-50 cursor-not-allowed shadow-inner'}`}><Lightbulb size={20} /> View Logic</button>
         <button onClick={handleNext} className={`flex-1 p-6 rounded-3xl font-black uppercase text-[12px] border-b-8 shadow-2xl transition-all flex items-center justify-center gap-3 ${autoNextTimer !== null ? 'bg-green-600 text-white border-green-800 shadow-green-200' : 'bg-[#8d6e63] text-white border-[#5d4037]'}`}>{autoNextTimer !== null ? `Next (${autoNextTimer}s)` : (appMode === 'concept' ? 'Start Practice' : 'Skip Step')} <ChevronRight size={20} /></button>
      </div>

      <AnimatePresence>
        {sessionCompleted && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-[#e6dccb] p-8 sm:p-14 rounded-[4rem] border-8 border-[#3e2723] text-center shadow-2xl relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
              <div className="relative z-10 flex flex-col items-center">
                <div className="w-28 h-28 sm:w-36 sm:h-36 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-8 shadow-2xl border-4 border-white"><Trophy size={72} className="animate-bounce" /></div>
                <h1 className="text-4xl sm:text-6xl font-black text-[#3e2723] uppercase mb-6 tracking-tighter text-center px-4 leading-tight">Perspective Genius!</h1>
                <p className="text-[#3e2723] text-lg sm:text-2xl leading-relaxed font-black mb-12 max-w-md mx-auto text-center px-4">"You mastered the Assumption Rule. Aligning everything to a single row facing Away (North) is the most efficient path to logic mastery!"</p>
                <button onClick={() => window.location.reload()} className="relative z-10 px-12 sm:px-16 py-6 sm:py-8 bg-[#3e2723] text-[#e6dccb] rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl border-b-8 border-black hover:scale-105 active:translate-y-2 transition-all">Restart Lab Session</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {isExplaining && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/70 backdrop-blur-md">
            <div className="w-full max-w-4xl bg-[#dfd7cc] rounded-[3.5rem] p-6 sm:p-14 shadow-2xl relative border-8 border-[#3e2723] max-h-[90vh] flex flex-col overflow-hidden text-center">
              <button onClick={() => setIsExplaining(false)} className="absolute top-6 sm:top-8 right-6 sm:right-8 p-3 sm:p-4 bg-[#3e2723] text-white rounded-full transition-transform hover:rotate-90 shadow-xl z-20"><CloseIcon size={28} /></button>
              <h3 className="text-2xl sm:text-4xl font-black text-[#3e2723] uppercase mb-8 sm:mb-12 flex items-center justify-center gap-4 sm:gap-6 text-center"><ArrowRightLeft size={48} className="text-[#8d6e63]" /> Logic Mapping</h3>
              <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-5 sm:gap-8 text-left px-2 sm:px-4">
                {(mission.explanation || []).map((line, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="bg-white/60 p-6 sm:p-10 rounded-[2rem] border-l-[16px] sm:border-l-[20px] border-yellow-400 shadow-xl">
                    <p className="text-[#3e2723] text-sm sm:text-xl leading-relaxed font-black italic">"{typeof line === 'string' ? line : JSON.stringify(line)}"</p>
                  </motion.div>
                ))}
              </div>
              <button onClick={() => setIsExplaining(false)} className="w-full mt-8 sm:mt-12 py-6 sm:py-8 bg-[#3e2723] text-[#e6dccb] font-black rounded-[2rem] sm:rounded-[3rem] uppercase border-b-8 border-black text-lg sm:text-xl tracking-widest shadow-2xl transition-all active:translate-y-1">Understood!</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
