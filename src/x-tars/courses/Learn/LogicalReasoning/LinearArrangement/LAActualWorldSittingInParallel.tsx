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
  Maximize2
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// DATA CONFIGURATIONS
// ==========================================
const PEOPLE_DATA = {
  // Men (Cool colors)
  pA: { name: 'Aanya', initial: 'A', color: 'from-blue-400 to-blue-600', hex: 0x60a5fa, type: 'man' },
  pB: { name: 'Ben', initial: 'B', color: 'from-sky-400 to-sky-600', hex: 0x38bdf8, type: 'man' },
  pC: { name: 'Chintu', initial: 'C', color: 'from-cyan-400 to-cyan-600', hex: 0x22d3ee, type: 'man' },
  pD: { name: 'Diya', initial: 'D', color: 'from-indigo-400 to-indigo-600', hex: 0x818cf8, type: 'man' },
  pE: { name: 'Ethan', initial: 'E', color: 'from-slate-400 to-slate-600', hex: 0x94a3b8, type: 'man' },
  // Ladies (Warm colors)
  pM: { name: 'Maya', initial: 'M', color: 'from-rose-400 to-rose-600', hex: 0xfb7185, type: 'lady' },
  pN: { name: 'Nisha', initial: 'N', color: 'from-pink-400 to-pink-600', hex: 0xf472b6, type: 'lady' },
  pO: { name: 'Olia', initial: 'O', color: 'from-amber-400 to-amber-600', hex: 0xfbbf24, type: 'lady' },
  pP: { name: 'Priya', initial: 'P', color: 'from-orange-400 to-orange-600', hex: 0xfb923c, type: 'lady' },
  pQ: { name: 'Quinn', initial: 'Q', color: 'from-purple-400 to-purple-600', hex: 0xc084fc, type: 'lady' },
};

const MEN_IDS = ['pA', 'pB', 'pC', 'pD', 'pE'];
const LADY_IDS = ['pM', 'pN', 'pO', 'pP', 'pQ'];

const MISSIONS = {
  concept: {
    title: "Parallel Row Logic",
    mainHeader: "Men (A,B,C,D,E) facing South & Ladies (M,N,O,P,Q) facing North.",
    note: "Grid Strategy: Use 'Opposite' clues to connect the two rows. When facing each other, Row 1's Left is Row 2's Right from your perspective.",
    instructions: [
      "1. Q is opposite B, who is just to the left of D.",
      "2. C and N are on opposing sides of the diagonal.",
      "3. E is directly across from O, who is on M's right.",
      "4. P (left of Q) is on the opposite side of D.",
      "5. M is at one of the line's ends."
    ],
    correctLayout: {
      men: ['pC', 'pE', 'pD', 'pB', 'pA'],
      ladies: ['pM', 'pO', 'pP', 'pQ', 'pN'],
      facings: { men: 'towards', ladies: 'away' }
    },
    steps: [
      { row: 'ladies', slot: 0, personId: 'pM', facing: 'away', why: "Step 1: Clue 5 anchors M at an end. Let's start with Slot 1 of the Ladies row.", ins: 4, done: [] },
      { row: 'ladies', slot: 1, personId: 'pO', facing: 'away', why: "Step 2: Clue 3 says O is on M's right. For North-facing M, her Right is Slot 2.", ins: 2, done: [4] },
      { row: 'men', slot: 1, personId: 'pE', facing: 'towards', why: "Step 3: Clue 3 also says E is opposite O. E takes Slot 2 in the South Row.", ins: 2, done: [4] },
      { row: 'men', slot: 0, personId: 'pC', facing: 'towards', why: "Step 4: Clue 2 says C and N are diagonal. If M is at (1, Row 2), C is at (1, Row 1).", ins: 1, done: [4, 2] },
      { row: 'ladies', slot: 4, personId: 'pN', facing: 'away', why: "N must be at Slot 5 of Row 2 to complete that diagonal chain with C.", ins: 1, done: [4, 2] },
      { row: 'men', slot: 2, personId: 'pD', facing: 'towards', why: "Step 5: Clue 1 says B is left of D. Facing South, Left points to Slot 4. D at 3, B at 4.", ins: 0, done: [4, 2, 1] },
      { row: 'men', slot: 3, personId: 'pB', facing: 'towards', why: "B is now at Slot 4, which is to the left of D(3) when facing South (Towards ↓).", ins: 0, done: [4, 2, 1] },
      { row: 'ladies', slot: 3, personId: 'pQ', facing: 'away', why: "Step 6: Clue 1 says Q is opposite B. Q takes Slot 4 in Row 2.", ins: 0, done: [4, 2, 1] },
      { row: 'ladies', slot: 2, personId: 'pP', facing: 'away', why: "Step 7: Clue 4 says P (left of Q) is opposite D. P(3) is indeed across from D(3).", ins: 3, done: [4, 2, 1, 0] },
      { row: 'men', slot: 4, personId: 'pA', facing: 'towards', why: "Step 8: Final spot. A takes the remaining seat at Slot 5, Row 1.", isComplete: true, done: [4, 2, 1, 0, 3] }
    ]
  },
  practice: [
    {
      id: "parallel_practice_01",
      mainHeader: "Parallel Quest: Men facing North (Row 1) & Ladies facing South (Row 2).",
      requiredIds: [...MEN_IDS, ...LADY_IDS],
      note: "Note: Men are now facing North (Away ↑) and Ladies face South (Towards ↓).",
      instructions: [
        "1. Q is opposite B, who is at an extreme end.",
        "2. A is sitting directly across from M.",
        "3. D is to the IMMEDIATE RIGHT of B.",
        "4. M is exactly BETWEEN Q and P.",
        "5. N is at an extreme end anchor."
      ],
      correctLayout: {
        men: ['pB', 'pD', 'pC', 'pE', 'pA'],
        ladies: ['pQ', 'pM', 'pP', 'pO', 'pN'],
        facings: { men: 'away', ladies: 'towards' }
      },
      questions: [
        { 
          q: "If B is at Slot 1 (Row 1), where is Q based on Clue 1?", 
          options: ["Slot 1 (Row 2)", "Slot 5 (Row 2)", "Slot 3"], 
          correct: 0,
          explanation: ["Q is opposite B. This means they share the same slot number in different rows."]
        },
        { 
          q: "If M is at Slot 2 and is between Q(1) and P(3), is this a valid chain?", 
          options: ["Yes", "No, M must be at 4"], 
          correct: 0,
          explanation: ["Slot 2 is exactly between Slot 1 and Slot 3."]
        },
        { 
          q: "Who is at the far right corner (Slot 5) of the Men's Row?", 
          options: ["Aanya (A)", "Ethan (E)", "Ben (B)"], 
          correct: 0,
          explanation: ["After following the chain B(1)-D(2)-C(3)-E(4), Aanya (A) takes the final slot."]
        }
      ]
    }
  ]
};

// ==========================================
// 3D VISUALIZATION MODAL
// ==========================================
function ThreeDVisualization({ isOpen, onClose, placedPeople, peopleFacings }) {
  const mountRef = useRef(null);
  
  useEffect(() => {
    if (!isOpen || !mountRef.current) return;

    // Load Three.js dynamically
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
      camera.position.set(0, 8, 12);
      camera.lookAt(0, 0, 0);

      renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      mountRef.current.appendChild(renderer.domElement);

      // Lights
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
      scene.add(ambientLight);
      const pointLight = new THREE.PointLight(0xffffff, 0.8);
      pointLight.position.set(10, 10, 10);
      scene.add(pointLight);

      // Floor
      const floorGeometry = new THREE.PlaneGeometry(20, 10);
      const floorMaterial = new THREE.MeshPhongMaterial({ 
        color: 0x2a1a16, 
        transparent: true, 
        opacity: 0.8,
        side: THREE.DoubleSide 
      });
      const floor = new THREE.Mesh(floorGeometry, floorMaterial);
      floor.rotation.x = Math.PI / 2;
      scene.add(floor);

      // Grid Lines
      const gridHelper = new THREE.GridHelper(20, 10, 0x444444, 0x222222);
      scene.add(gridHelper);

      // Create Label function
      const createLabel = (text) => {
        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 128;
        canvas.height = 128;
        ctx.fillStyle = 'white';
        ctx.font = 'bold 80px Noto Sans';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText(text, 64, 64);
        const texture = new THREE.CanvasTexture(canvas);
        const spriteMaterial = new THREE.SpriteMaterial({ map: texture });
        const sprite = new THREE.Sprite(spriteMaterial);
        sprite.scale.set(1.5, 1.5, 1.5);
        return sprite;
      };

      // Populate Scene
      placedPeople.forEach((personId, idx) => {
        if (!personId) return;
        const person = PEOPLE_DATA[personId];
        const isLady = idx >= 5;
        const slotIdx = isLady ? idx - 5 : idx;
        const xPos = (slotIdx - 2) * 3;
        const zPos = isLady ? 2 : -2;

        // Base Cylinder
        const geo = new THREE.CylinderGeometry(0.8, 0.8, 0.2, 32);
        const mat = new THREE.MeshPhongMaterial({ color: person.hex });
        const base = new THREE.Mesh(geo, mat);
        base.position.set(xPos, 0.1, zPos);
        scene.add(base);

        // Name Initial Floating
        const label = createLabel(person.initial);
        label.position.set(xPos, 1.5, zPos);
        scene.add(label);

        // Arrow Indicator
        const arrowGeo = new THREE.ConeGeometry(0.3, 0.8, 4);
        const arrowMat = new THREE.MeshBasicMaterial({ 
          color: peopleFacings[idx] === 'away' ? 0x10b981 : 0xef4444 
        });
        const arrow = new THREE.Mesh(arrowGeo, arrowMat);
        arrow.position.set(xPos, 2.5, zPos);
        // Face North (away) or South (towards)
        arrow.rotation.x = peopleFacings[idx] === 'away' ? -Math.PI / 2 : Math.PI / 2;
        scene.add(arrow);
      });

      // Simple Camera Controls
      let isMouseDown = false;
      let prevMouseX = 0;
      
      const onMouseDown = (e) => { isMouseDown = true; prevMouseX = e.clientX; };
      const onMouseUp = () => { isMouseDown = false; };
      const onMouseMove = (e) => {
        if (!isMouseDown) return;
        const deltaX = e.clientX - prevMouseX;
        prevMouseX = e.clientX;
        scene.rotation.y += deltaX * 0.01;
      };

      mountRef.current.addEventListener('mousedown', onMouseDown);
      window.addEventListener('mouseup', onMouseUp);
      window.addEventListener('mousemove', onMouseMove);

      const animate = () => {
        frameId = requestAnimationFrame(animate);
        renderer.render(scene, camera);
      };
      animate();

      return () => {
        cancelAnimationFrame(frameId);
        mountRef.current?.removeChild(renderer.domElement);
        window.removeEventListener('mouseup', onMouseUp);
        window.removeEventListener('mousemove', onMouseMove);
      };
    }

    return () => {
        if (frameId) cancelAnimationFrame(frameId);
        document.head.removeChild(script);
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <motion.div 
      initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
      className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md"
    >
      <div className="relative w-full max-w-5xl bg-[#2a1a16] rounded-[3rem] border-4 border-yellow-400/30 overflow-hidden h-[80vh] shadow-2xl flex flex-col">
        <div className="p-6 flex justify-between items-center bg-black/30">
          <div className="flex items-center gap-3 text-yellow-400">
            <Box size={24} />
            <h2 className="text-xl font-black uppercase tracking-widest">3D Parallel Space</h2>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-colors text-white">
            <CloseIcon size={32} />
          </button>
        </div>
        <div className="flex-1 relative cursor-move" ref={mountRef}>
           <div className="absolute bottom-6 left-6 text-white/40 text-[10px] uppercase font-black tracking-widest bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm pointer-events-none">
              Click & Drag to Rotate Scene
           </div>
        </div>
        <div className="p-6 bg-black/30 flex gap-6 overflow-x-auto no-scrollbar">
            <div className="flex items-center gap-2 whitespace-nowrap">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shadow-[0_0_8px_#10b981]" />
                <span className="text-white/60 text-[10px] font-black uppercase">North (Away)</span>
            </div>
            <div className="flex items-center gap-2 whitespace-nowrap">
                <div className="w-3 h-3 rounded-full bg-rose-500 shadow-[0_0_8px_#ef4444]" />
                <span className="text-white/60 text-[10px] font-black uppercase">South (Towards)</span>
            </div>
        </div>
      </div>
    </motion.div>
  );
}

// ==========================================
// MAIN LAB COMPONENT
// ==========================================
export default function LabContent() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const slotRefs = useRef([]);
  const tutorialTimeouts = useRef([]);
  
  const [appMode, setAppMode] = useState('concept'); 
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
  
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isError, setIsError] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [isExplaining, setIsExplaining] = useState(false);
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);

  const mission = appMode === 'concept' ? MISSIONS.concept : MISSIONS.practice[0];

  const clearAllTutorials = useCallback(() => {
    tutorialTimeouts.current.forEach(clearTimeout);
    tutorialTimeouts.current = [];
  }, []);

  const handleNext = useCallback(() => {
    clearAllTutorials();
    if (appMode === 'concept') {
      setAppMode('practice');
      return;
    }
    if (activeQuestionIndex < (mission.questions?.length || 0) - 1) {
      setActiveQuestionIndex(prev => prev + 1);
      setSelectedOption(null);
      setIsCorrect(false);
      setIsError(false);
      setAutoNextTimer(null);
    } else {
      setSessionCompleted(true);
    }
  }, [appMode, activeQuestionIndex, mission, clearAllTutorials]);

  const startTutorial = useCallback(() => {
    clearAllTutorials();
    setPlacedPeople(Array(10).fill(null));
    setPeopleFacings(Array(10).fill('away'));
    setTutorialStep(0);
    setIsTutorialComplete(false);
    
    const runStep = (idx) => {
      if (!MISSIONS.concept.steps[idx]) return;
      const step = MISSIONS.concept.steps[idx];
      
      setTutorialStep(idx);
      setTutorialNarrative(step.why);
      setHighlightedInstruction(step.ins);
      setTutorialDoneIns(step.done || []);
      
      const t1 = setTimeout(() => {
        if (step.personId !== undefined) {
          setPlacedPeople(prev => {
            const next = [...prev];
            const realIdx = step.row === 'men' ? step.slot : step.slot + 5;
            next[realIdx] = step.personId;
            return next;
          });
        }
        if (step.facing) {
          setPeopleFacings(prev => {
            const next = [...prev];
            const realIdx = step.row === 'men' ? step.slot : step.slot + 5;
            next[realIdx] = step.facing;
            return next;
          });
        }
        
        if (step.isComplete) {
          setIsTutorialComplete(true);
          return;
        }

        const t2 = setTimeout(() => {
          if (idx < MISSIONS.concept.steps.length - 1) {
            runStep(idx + 1);
          }
        }, 7000); 
        tutorialTimeouts.current.push(t2);
      }, 3500); 
      tutorialTimeouts.current.push(t1);
    };
    runStep(0);
  }, [clearAllTutorials]);

  useEffect(() => {
    clearAllTutorials();
    setPlacedPeople(Array(10).fill(null));
    setPeopleFacings(Array(10).fill('away'));
    setTutorialStep(-1);
    setTutorialNarrative("");
    setHighlightedInstruction(-1);
    setTutorialDoneIns([]);
    setIsTutorialComplete(false);
    setActiveQuestionIndex(0);
    setAutoNextTimer(null);
    setSelectedOption(null);
    setIsCorrect(false);
    setIsError(false);
    setUserCheckedInstructions(Array(5).fill(false));
  }, [appMode, clearAllTutorials]);

  useEffect(() => {
    if (appMode === 'concept') {
      setIsArrangementCorrect(isTutorialComplete);
    } else {
        const mRow = placedPeople.slice(0, 5);
        const lRow = placedPeople.slice(5, 10);
        const isMCorrect = mRow.every((p, i) => p === mission.correctLayout.men[i]);
        const isLCorrect = lRow.every((p, i) => p === mission.correctLayout.ladies[i]);
        setIsArrangementCorrect(isMCorrect && isLCorrect);
    }
  }, [placedPeople, isTutorialComplete, appMode, mission]);

  const handleAnswerSelect = useCallback((index) => {
    if (isCorrect) return;
    const currentQ = mission.questions?.[activeQuestionIndex];
    if (!currentQ) return;
    setSelectedOption(index);
    if (index === currentQ.correct) {
      setIsCorrect(true);
      setIsError(false);
      setAutoNextTimer(8);
    } else {
      setIsError(true);
      setTimeout(() => setIsError(false), 600);
    }
  }, [isCorrect, mission, activeQuestionIndex]);

  useEffect(() => {
    let interval;
    if (autoNextTimer !== null && autoNextTimer > 0 && !isExplaining) {
      interval = setInterval(() => setAutoNextTimer(p => p - 1), 1000);
    } else if (autoNextTimer === 0) {
      handleNext();
    }
    return () => clearInterval(interval);
  }, [autoNextTimer, handleNext, isExplaining]);

  const toggleDirection = (idx) => {
    if (isArrangementCorrect || appMode === 'concept') return;
    setPeopleFacings(prev => {
      const next = [...prev];
      next[idx] = next[idx] === 'away' ? 'towards' : 'away';
      return next;
    });
  };

  const handleDragEnd = (event, info, personId) => {
    if (appMode === 'concept' || isArrangementCorrect) return;
    const dropPoint = { x: info.point.x, y: info.point.y };
    let targetIdx = -1;
    let minDistance = 1000;
    
    slotRefs.current.forEach((ref, index) => {
      if (!ref) return;
      const rect = ref.getBoundingClientRect();
      const scrollX = window.scrollX || window.pageXOffset;
      const scrollY = window.pageYOffset || window.scrollY;
      const slotCenterX = rect.left + scrollX + rect.width / 2;
      const slotCenterY = rect.top + scrollY + rect.height / 2;
      const dist = Math.sqrt(Math.pow(dropPoint.x - slotCenterX, 2) + Math.pow(dropPoint.y - slotCenterY, 2));

      if (dist < 50 && dist < minDistance) {
        minDistance = dist;
        targetIdx = index;
      }
    });

    if (targetIdx !== -1) {
      setPlacedPeople(prev => {
         const next = [...prev];
         const existingIdx = next.findIndex(p => p === personId);
         if (existingIdx !== -1) next[existingIdx] = null;
         next[targetIdx] = personId;
         return next;
      });
    }
  };

  const renderSlot = (idx, label) => {
    const person = placedPeople[idx] ? PEOPLE_DATA[placedPeople[idx]] : null;
    const facing = peopleFacings[idx];
    const isTutoTarget = appMode === 'concept' && tutorialStep !== -1 && (
       idx === (MISSIONS.concept.steps[tutorialStep]?.row === 'men' ? MISSIONS.concept.steps[tutorialStep]?.slot : MISSIONS.concept.steps[tutorialStep]?.slot + 5)
    );

    return (
      <div key={idx} className="flex flex-col items-center gap-2 relative z-10">
        <div 
          ref={el => slotRefs.current[idx] = el}
          className={`relative w-14 h-14 sm:w-20 sm:h-20 rounded-full border-4 transition-all duration-500 flex items-center justify-center
            ${person ? `bg-gradient-to-br ${person.color} border-white ring-4 ring-black/20 scale-110 shadow-2xl` : 'border-dashed border-white/10 bg-[#2a1a16]/50 shadow-inner'}
            ${isTutoTarget ? 'ring-4 ring-yellow-400 ring-offset-4 ring-offset-[#3e2723] scale-125 z-20' : ''}`}
        >
          {person ? (
            <div className="flex flex-col items-center justify-center relative w-full h-full">
              <span className="text-white font-black text-xl sm:text-2xl drop-shadow-lg">{person.initial}</span>
              <button 
                onClick={() => toggleDirection(idx)}
                className={`absolute -top-8 sm:-top-10 p-1 sm:p-1.5 rounded-full border-2 transition-all hover:scale-110 active:scale-95 shadow-xl group
                  ${facing === 'away' ? 'bg-emerald-500 border-emerald-300 text-white' : 'bg-rose-600 border-rose-300 text-white'}`}
              >
                 {facing === 'away' ? <ArrowUp size={16} /> : <ArrowDown size={16} />}
              </button>
              {!isArrangementCorrect && appMode !== 'concept' && (
                <button onClick={() => setPlacedPeople(prev => { const n = [...prev]; n[idx] = null; return n; })} 
                  className="absolute -bottom-3 bg-red-600 p-1 rounded-full z-20 shadow-lg border border-white text-white hover:scale-110 transition-transform"><Trash2 size={10}/></button>
              )}
            </div>
          ) : (
            <div className="opacity-20 text-white font-black text-[10px]">{label}</div>
          )}
        </div>
        <div className={`w-6 sm:w-10 h-1 rounded-full transition-colors ${person ? 'bg-white shadow-[0_0_10px_white]' : 'bg-white/5'}`} />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#e6dccb] flex flex-col items-center no-scrollbar overflow-x-hidden font-sans relative pb-20" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      
      {/* HEADER */}
      <div className="w-full max-w-[1500px] shrink-0 px-4 pt-6 relative z-10">
        <header className="w-full bg-[#2a1a16] p-4 sm:p-6 rounded-[2rem] border-b-8 border-black/40 relative overflow-hidden shadow-2xl ring-4 ring-black/20">
          <div className="absolute inset-0 opacity-[0.3] pointer-events-none" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
          <div className="relative z-10 flex flex-col lg:flex-row justify-between items-center gap-4">
            <div className="flex flex-col text-left">
              <button onClick={() => navigate('/learn/logicalReasoning/LinearArrangement')} className="flex items-center gap-1.5 text-[#a88a6d] font-black uppercase text-[10px] mb-1 hover:text-white transition-all">
                <ChevronLeft size={16} /> Dashboard
              </button>
              <h1 className="text-white text-xl sm:text-2xl font-black uppercase tracking-tighter text-[#e6dccb] leading-none text-shadow-sm">People are sitting in parallel</h1>
            </div>
            <div className="flex bg-black/30 p-1 rounded-2xl border border-white/10 w-full sm:w-auto">
              <button onClick={() => setAppMode('concept')} className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${appMode === 'concept' ? 'bg-yellow-400 text-[#2a1a16]' : 'text-[#a88a6d] hover:text-white'}`}>Concept Building</button>
              <button onClick={() => setAppMode('practice')} className={`flex-1 sm:flex-none px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${appMode === 'practice' ? 'bg-[#8d6e63] text-white shadow-inner' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
            </div>
          </div>
        </header>
      </div>

      {/* GRID BOARD */}
      <div className="w-full max-w-6xl px-4 py-2 relative z-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
          className="bg-[#2a1a16] p-1.5 sm:p-2 rounded-[2.5rem] sm:rounded-[3.5rem] shadow-2xl border-4 border-black/40 relative ring-4 ring-black/10 overflow-visible">
          
          <div className="relative z-10 bg-[#3e2723] pt-6 pb-12 px-2 sm:px-4 rounded-[2rem] sm:rounded-[3rem] border-4 border-black/20 flex flex-col items-center justify-center min-h-[700px] shadow-inner overflow-visible">
            
            {/* Start Flow Button */}
            {appMode === 'concept' && tutorialStep === -1 && (
               <div className="absolute inset-0 z-50 flex items-center justify-center bg-[#3e2723]/60 backdrop-blur-sm rounded-[2rem] sm:rounded-[3rem]">
                  <motion.button 
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    onClick={startTutorial}
                    className="group flex flex-col items-center gap-4 bg-yellow-400 p-8 sm:p-12 rounded-full shadow-2xl hover:scale-105 transition-all"
                  >
                    <div className="bg-[#2a1a16] p-6 rounded-full text-yellow-400 group-hover:rotate-12 transition-transform shadow-inner">
                        <Play size={48} fill="currentColor" />
                    </div>
                    <span className="text-[#2a1a16] font-black uppercase text-base sm:text-lg tracking-widest">Start Logic Flow</span>
                  </motion.button>
               </div>
            )}

            {/* Instruction Panel */}
            <div className="bg-black/50 backdrop-blur-md border border-white/10 p-4 sm:p-8 rounded-[2rem] sm:rounded-[2.5rem] w-full max-w-3xl mb-4 shadow-2xl">
               <div className="mb-4 p-3 bg-white/5 rounded-2xl border-l-4 border-yellow-400">
                  <h2 className="text-white text-xs sm:text-base font-black uppercase tracking-tight leading-tight">{mission.mainHeader}</h2>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-2">
                  {(mission.instructions || []).map((ins, i) => {
                    const isStepDone = appMode === 'practice' ? userCheckedInstructions[i] : tutorialDoneIns.includes(i);
                    const isHighlight = appMode === 'concept' && highlightedInstruction === i;
                    return (
                      <div key={i}
                        className={`flex items-start text-left gap-3 p-2 rounded-xl transition-all duration-500 border-2
                        ${isHighlight ? 'bg-yellow-400/10 border-yellow-400 scale-105 z-10 shadow-xl' : isStepDone ? 'bg-green-500/10 border-green-500/40' : 'bg-transparent border-white/5'}`}
                      >
                        {isStepDone ? <CheckCircle2 size={14} className="text-green-500 mt-0.5" /> : <Square size={14} className="text-white/20 mt-0.5" />}
                        <p className={`text-[10px] sm:text-[11px] font-bold leading-tight ${isStepDone ? 'text-green-400' : isHighlight ? 'text-yellow-400 font-black' : 'text-[#e6dccb]/60'}`}>
                          {ins}
                        </p>
                      </div>
                    );
                  })}
               </div>
            </div>

            {/* 3D TOGGLE BUTTON */}
            <div className="absolute top-6 right-6 z-30">
               <button 
                  onClick={() => setIs3DModalOpen(true)}
                  className="bg-sky-500 text-white p-4 rounded-3xl shadow-2xl flex items-center gap-3 font-black uppercase text-xs hover:scale-105 active:scale-95 transition-all border-b-4 border-sky-800"
               >
                 <Maximize2 size={18} />
                 <span>View 3D</span>
               </button>
            </div>

            {/* DUAL ROW INTERFACE */}
            <div className="w-full flex flex-col items-center gap-12 sm:gap-20 my-8 px-2 relative">
                <div className="w-full flex justify-center gap-2 sm:gap-8 relative overflow-visible">
                    <div className="absolute -left-4 sm:-left-12 top-1/2 -translate-y-1/2 rotate-90 text-[8px] sm:text-[10px] font-black text-rose-500 uppercase tracking-widest opacity-40 whitespace-nowrap">Row 1 (Top)</div>
                    <div className="absolute bottom-[-1.5rem] sm:bottom-[-2rem] left-[5%] right-[5%] h-1 bg-white/10 rounded-full" />
                    {Array(5).fill(0).map((_, i) => renderSlot(i, `R1-S${i+1}`))}
                </div>

                <div className="w-full flex justify-center gap-2 sm:gap-8 relative overflow-visible">
                    <div className="absolute -left-4 sm:-left-12 top-1/2 -translate-y-1/2 -rotate-90 text-[8px] sm:text-[10px] font-black text-emerald-500 uppercase tracking-widest opacity-40 whitespace-nowrap">Row 2 (Bottom)</div>
                    <div className="absolute bottom-[-1.5rem] sm:bottom-[-2rem] left-[5%] right-[5%] h-1 bg-white/10 rounded-full" />
                    {Array(5).fill(0).map((_, i) => renderSlot(i + 5, `R2-S${i+1}`))}
                </div>
            </div>

            <AnimatePresence mode="wait">
              {appMode === 'concept' && tutorialNarrative && (
                <motion.div key={tutorialNarrative} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                  className="bg-cyan-600 text-white px-6 py-4 rounded-3xl text-xs sm:text-sm font-black text-center max-w-xl mb-6 shadow-2xl relative border-b-4 border-black/40 ring-4 ring-cyan-400/20"
                >
                  <div className="absolute -top-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-cyan-600 rotate-45" />
                  {tutorialNarrative}
                </motion.div>
              )}
            </AnimatePresence>

            <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8 mt-4 px-2 sm:px-6">
                <div className="bg-black/30 p-4 rounded-3xl border border-white/5 flex flex-col items-center">
                    <span className="text-[10px] font-black text-sky-400 uppercase tracking-widest mb-4">Men Reference Pool</span>
                    <div className="flex flex-wrap justify-center gap-4">
                        {MEN_IDS.map(id => {
                            const person = PEOPLE_DATA[id];
                            const isPlaced = placedPeople.includes(id);
                            return (
                                <motion.div key={id} layoutId={`tag-${id}`}
                                    drag={!isArrangementCorrect && !isPlaced && appMode !== 'concept'}
                                    dragConstraints={containerRef} dragMomentum={false}
                                    onDragEnd={(e, info) => handleDragEnd(e, info, id)}
                                    whileHover={{ scale: isPlaced ? 1 : 1.1 }}
                                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 flex items-center justify-center bg-gradient-to-br ${person.color} ${isPlaced ? 'opacity-10 grayscale pointer-events-none' : 'shadow-xl cursor-grab active:cursor-grabbing border-white/40'}`}
                                >
                                    <span className="text-white font-black text-xl">{person.initial}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>

                <div className="bg-black/30 p-4 rounded-3xl border border-white/5 flex flex-col items-center">
                    <span className="text-[10px] font-black text-rose-400 uppercase tracking-widest mb-4">Ladies Reference Pool</span>
                    <div className="flex flex-wrap justify-center gap-4">
                        {LADY_IDS.map(id => {
                            const person = PEOPLE_DATA[id];
                            const isPlaced = placedPeople.includes(id);
                            return (
                                <motion.div key={id} layoutId={`tag-${id}`}
                                    drag={!isArrangementCorrect && !isPlaced && appMode !== 'concept'}
                                    dragConstraints={containerRef} dragMomentum={false}
                                    onDragEnd={(e, info) => handleDragEnd(e, info, id)}
                                    whileHover={{ scale: isPlaced ? 1 : 1.1 }}
                                    className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full border-4 flex items-center justify-center bg-gradient-to-br ${person.color} ${isPlaced ? 'opacity-10 grayscale pointer-events-none' : 'shadow-xl cursor-grab active:cursor-grabbing border-white/40'}`}
                                >
                                    <span className="text-white font-black text-xl">{person.initial}</span>
                                </motion.div>
                            );
                        })}
                    </div>
                </div>
            </div>

            {isArrangementCorrect && (
              <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-8 flex flex-col items-center gap-4 relative z-10">
                 <div className="flex items-center gap-4 bg-green-500/20 px-8 py-4 rounded-3xl border-2 border-green-500/50 shadow-2xl ring-4 ring-green-500/10">
                    <CheckCircle2 className="text-green-500" size={24} />
                    <span className="text-green-400 font-black uppercase text-xs tracking-widest">Logic Verified!</span>
                 </div>
                 {appMode === 'concept' && <button onClick={startTutorial} className="text-[#a88a6d] hover:text-white flex items-center gap-2 font-black uppercase text-[10px] transition-all underline decoration-white/20"><RotateCcw size={14} /> Replay</button>}
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>

      {/* 3D POP-UP MODAL */}
      <AnimatePresence>
        {is3DModalOpen && (
          <ThreeDVisualization 
             isOpen={is3DModalOpen} 
             onClose={() => setIs3DModalOpen(false)} 
             placedPeople={placedPeople} 
             peopleFacings={peopleFacings}
          />
        )}
      </AnimatePresence>

      {/* QUIZ SECTION */}
      <div className="w-full max-w-5xl px-4 py-4 mb-24 relative z-10">
        <div className="bg-[#dfd7cc] p-6 sm:p-12 rounded-[3.5rem] border-4 border-[#c4a484] shadow-xl flex flex-col items-center gap-6 w-full relative overflow-hidden min-h-[300px]">
          {!isArrangementCorrect ? (
            <div className="relative z-10 flex flex-col items-center text-center gap-4 py-6">
               <div className="w-16 h-16 bg-[#3e2723]/10 rounded-full flex items-center justify-center text-[#3e2723] animate-pulse"><GraduationCap size={40} /></div>
               <h2 className="text-[#3e2723] text-xl sm:text-3xl font-black uppercase tracking-tight px-4 text-center">Parallel Row Laboratory</h2>
               <p className="text-[#3e2723]/60 font-bold text-sm sm:text-base max-w-sm italic text-center px-4">Solve the grid. Use the 3D toggle to visualize the parallel lines from a new perspective.</p>
            </div>
          ) : (
            <div className="relative z-10 w-full text-center py-2 px-4">
              {mission.questions && mission.questions.length > 0 ? (
                <>
                  <div className="mb-4 flex items-center justify-center gap-2">
                    <span className="bg-[#3e2723] text-white px-5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest">Assessment • Q{activeQuestionIndex + 1}</span>
                  </div>
                  <h2 className="text-[#3e2723] text-xl sm:text-2xl font-black uppercase mb-10 tracking-tight text-center">{mission.questions[activeQuestionIndex]?.q}</h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl mx-auto">
                    {mission.questions[activeQuestionIndex]?.options.map((option, idx) => {
                      const isSel = selectedOption === idx;
                      const btnClass = isSel && isCorrect ? 'bg-green-600 border-green-800 text-white shadow-lg' : isSel && isError ? 'bg-red-500 border-red-700 text-white animate-shake' : 'bg-white border-slate-200 text-[#3e2723] hover:bg-slate-50';
                      return <button key={idx} onClick={() => handleAnswerSelect(idx)} className={`group relative p-6 rounded-[1.5rem] border-b-8 font-black text-sm sm:text-lg transition-all ${btnClass}`}>{option}{isSel && isCorrect && <CheckCircle2 className="absolute top-3 right-3 opacity-40" size={16} />}</button>;
                    })}
                  </div>
                </>
              ) : (
                <div className="py-8 flex flex-col items-center">
                   <h2 className="text-[#3e2723] text-3xl font-black uppercase mb-8 tracking-tight">Grid Solved!</h2>
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
                <h1 className="text-4xl sm:text-6xl font-black text-[#3e2723] uppercase mb-6 tracking-tighter text-center">Grid Master!</h1>
                <p className="text-[#3e2723] text-lg sm:text-2xl leading-relaxed font-black mb-12 max-w-md mx-auto text-center px-4">"You successfully solved the parallel grid challenges. You can handle inverted perspectives and complex neighbor rules with ease!"</p>
                <button onClick={() => navigate('/learn/logicalReasoning/LinearArrangement/ActualWorldSittingParallel')} className="relative z-10 px-12 sm:px-16 py-6 sm:py-8 bg-[#3e2723] text-[#e6dccb] rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl border-b-8 border-black hover:scale-105 active:translate-y-2 transition-all">Next Module</button>
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
              <h3 className="text-2xl sm:text-4xl font-black text-[#3e2723] uppercase mb-8 sm:mb-12 flex items-center justify-center gap-4 sm:gap-6 text-center"><ArrowRightLeft size={48} className="text-[#8d6e63]" /> Parallel Logic Mapping</h3>
              <div className="flex-1 overflow-y-auto no-scrollbar flex flex-col gap-5 sm:gap-8 text-left px-2 sm:px-4">
                {(mission.explanation || []).map((line, i) => (
                  <motion.div key={i} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} className="bg-white/60 p-6 sm:p-10 rounded-[2rem] border-l-[16px] sm:border-l-[20px] border-yellow-400 shadow-xl">
                    <p className="text-[#3e2723] text-sm sm:text-xl leading-relaxed font-black italic">"{line}"</p>
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