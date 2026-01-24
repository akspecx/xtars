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
  Info,
  Heart,
  X
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// DATA CONFIGURATIONS
// ==========================================
const PEOPLE_DATA = {
  pH: { initial: 'H', color: 'from-rose-400 to-rose-600', hex: 0xfb7185 },
  pC: { initial: 'C', color: 'from-sky-400 to-sky-600', hex: 0x38bdf8 },
  pN: { initial: 'N', color: 'from-amber-400 to-amber-600', hex: 0xfbbf24 },
  pG: { initial: 'G', color: 'from-emerald-400 to-emerald-600', hex: 0x34d399 },
  pB: { initial: 'B', color: 'from-purple-400 to-purple-600', hex: 0xc084fc },
  pP: { initial: 'P', color: 'from-pink-400 to-pink-600', hex: 0xf472b6 },
  pD: { initial: 'D', color: 'from-cyan-400 to-cyan-600', hex: 0x22d3ee },
  pI: { initial: 'I', color: 'from-orange-400 to-orange-600', hex: 0xfb923c },
};

const COLOR_ATTRS = {
  cRed: { name: 'Red', bg: 'bg-red-600', hex: 0xdc2626 },
  cPink: { name: 'Pink', bg: 'bg-pink-400', hex: 0xf472b6 },
  cOrange: { name: 'Orange', bg: 'bg-orange-500', hex: 0xf97316 },
  cGreen: { name: 'Green', bg: 'bg-green-600', hex: 0x16a34a },
  cYellow: { name: 'Yellow', bg: 'bg-yellow-400', hex: 0xfacc15 },
  cBlack: { name: 'Black', bg: 'bg-slate-900', hex: 0x0f172a },
  cViolet: { name: 'Violet', bg: 'bg-violet-700', hex: 0x6d28d9 },
  cBlue: { name: 'Blue', bg: 'bg-blue-600', hex: 0x2563eb },
};

const ALL_IDS = ['pH', 'pC', 'pN', 'pG', 'pB', 'pP', 'pD', 'pI'];
const ALL_COLORS = Object.keys(COLOR_ATTRS);

const MISSION = {
  title: "2D Dimensional Logic Lab",
  mainHeader: "Eight friends H, C, N, G, B, P, D, and I sit in a row facing North. Each likes a unique color.",
  theoryIntro: "When rules have multiple choices, we create 'Cases'. We track Persons, Likes (❤️), and Dislikes (🚫) simultaneously across these cases until only the truth remains!",
  instructions: [
    "1. The one who likes Green sits at one of the extreme ends.",
    "2. Black is third to the right of Green.",
    "3. Black sits on the immediate right of H.",
    "4. H sits fourth to the left of the one who likes Violet (but H does not like Pink).",
    "5. There is only one person between N and Violet.",
    "6. B sits third to the left of N and likes Yellow.",
    "7. Only one person between Yellow and Black.",
    "8. P is an immediate neighbor of both D and N.",
    "9. Isha sits at an extreme end but does not like Green.",
    "10. Black and Pink are immediate neighbors.",
    "11. Blue sits second to the right of Orange.",
    "12. Chandan (C) does not like Green."
  ],
  correctLayout: ['pG', 'pB', 'pH', 'pC', 'pN', 'pP', 'pD', 'pI'],
  solutionSteps: [
    { why: "Step 1: Rule 1 - Green is at an end. We create Case 1 (Green at S1) and Case 2 (Green at S8).", ins: 0, casePlacements: [{ row: 0, slot: 0, likedId: 'cGreen' }, { row: 1, slot: 7, likedId: 'cGreen' }] },
    { why: "Step 2: Rule 2 - Black is 3rd right of Green. In Case 1, Black is at S4. In Case 2, there is no room to the right of S8. Case 2 Fails!", ins: 1, casePlacements: [{ row: 0, slot: 3, likedId: 'cBlack' }], conflict: true },
    { why: "Step 3: Case 2 eliminated. Proceeding with Case 1: Green(S1) and Black(S4).", ins: 1, failRows: [1], casePlacements: [] },
    { why: "Step 4: Rule 3 - Black is immediate right of H. Since Black is S4, H must sit at Slot 3.", ins: 2, casePlacements: [{ row: 0, slot: 2, personId: 'pH' }] },
    { why: "Step 5: Rule 4 - H(S3) is 4th left of Violet. Counting 4 right from S3 leads to Slot 7. Violet sits at S7.", ins: 3, casePlacements: [{ row: 0, slot: 6, likedId: 'cViolet' }] },
    { why: "Step 6: Rule 5 - One person between N and Violet(S7). N must be S5 (S9 doesn't exist).", ins: 4, casePlacements: [{ row: 0, slot: 4, personId: 'pN' }] },
    { why: "Step 7: Rule 6 - B is 3rd left of N(S5). B takes Slot 2 (5-3=2). B likes Yellow.", ins: 5, casePlacements: [{ row: 0, slot: 1, personId: 'pB', likedId: 'cYellow' }] },
    { why: "Step 8: Rule 7 Check - Yellow(S2) and Black(S4) have H(S3) between them. Verified.", ins: 6, casePlacements: [] },
    { why: "Step 9: Rule 8 - Pranav(P) is neighbor of Dinesh(D) and Nita(N). Since S4 is free and S6 is free, P must be S6 so D can sit at S7.", ins: 7, casePlacements: [{ row: 0, slot: 5, personId: 'pP' }, { row: 0, slot: 6, personId: 'pD' }] },
    { why: "Step 10: Rule 9 - Isha(I) sits at an end. S1 is taken by Green, so Isha sits at Slot 8.", ins: 8, casePlacements: [{ row: 0, slot: 7, personId: 'pI' }] },
    { why: "Step 11: Only G and C are left. S1 and S4 are empty. Rule 12 says Chandan(C) does not like Green.", ins: 11, casePlacements: [] },
    { why: "Step 12: Because C cannot be at S1 (Green), Gaurav(G) must take Slot 1. Chandan(C) takes Slot 4.", ins: 11, casePlacements: [{ row: 0, slot: 0, personId: 'pG' }, { row: 0, slot: 3, personId: 'pC' }] },
    { why: "Step 13: Rule 10 - Black(S4) and Pink are neighbors. Neighbors are S3(H) and S5(N). Rule 4 says Heena(H) does not like Pink. So Nita(N) likes Pink.", ins: 9, casePlacements: [{ row: 0, slot: 4, likedId: 'cPink' }] },
    { why: "Step 14: Rule 11 - Blue is 2nd right of Orange. P(S6) must be Orange, so Isha(S8) can be Blue.", ins: 10, casePlacements: [{ row: 0, slot: 5, likedId: 'cOrange' }, { row: 0, slot: 7, likedId: 'cBlue' }] },
    { why: "Step 15: Final logic: Only Red is left. Heena(S3) likes Red. Row complete!", ins: 0, isComplete: true, casePlacements: [{ row: 0, slot: 2, likedId: 'cRed' }] }
  ],
  questions: [
    { q: "Who among the following stands third from the right end?", options: ["P", "H", "I", "D"], correct: 0, sol: "Final Row: G-B-H-C-N-P-D-I. Counting from right: I(8), D(7), P(6). P is 3rd from right." },
    { q: "Who stands fifth to the left of I?", options: ["H", "G", "N", "B"], correct: 0, sol: "I is at S8. 8 - 5 = Slot 3. H (Heena) sits at Slot 3." },
    { q: "What is the position of Gaurav (G) from the left end?", options: ["First", "Second", "Third", "Fourth"], correct: 0, sol: "G sits at Slot 1, which is the absolute left end." }
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
      camera.position.set(0, 8, 16);
      camera.lookAt(0, 0, 0);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      mountRef.current.appendChild(renderer.domElement);
      scene.add(new THREE.AmbientLight(0xffffff, 0.8));
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(50, 25), new THREE.MeshPhongMaterial({ color: 0x222222 }));
      floor.rotation.x = -Math.PI / 2;
      scene.add(floor);
      scene.add(new THREE.GridHelper(50, 25, 0x444444, 0x222222));

      placedPeople.forEach((pData, idx) => {
        if (!pData?.personId) return;
        const xPos = (idx - 3.5) * 5;
        const person = PEOPLE_DATA[pData.personId];
        const base = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.4, 32), new THREE.MeshPhongMaterial({ color: person.hex }));
        base.position.set(xPos, 0.2, 0);
        scene.add(base);

        const canvas = document.createElement('canvas');
        const ctx = canvas.getContext('2d');
        canvas.width = 128; canvas.height = 128;
        ctx.fillStyle = 'white'; ctx.font = 'bold 80px Noto Sans';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(person.initial, 64, 64);
        const texture = new THREE.CanvasTexture(canvas);
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }));
        sprite.scale.set(3, 3, 3);
        sprite.position.set(xPos, 3.5, 0);
        scene.add(sprite);
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
          <h2 className="text-xl font-black uppercase flex items-center gap-3"><Box className="text-yellow-400" /> Perspective Depth View</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white"><CloseIcon size={32} /></button>
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
  const personRefs = useRef([[], [], []]); 
  const likeRefs = useRef([[], [], []]);
  const dislikeRefs = useRef([[], [], []]);
  const tutorialTimeouts = useRef([]);
  
  const [appMode, setAppMode] = useState('concept');
  const [activeRowsCount, setActiveRowsCount] = useState(1);

  // 2D State
  const [practiceRows, setPracticeRows] = useState([
    Array(8).fill(null).map(() => ({ personId: null, likedId: null, dislikedId: null })),
    Array(8).fill(null).map(() => ({ personId: null, likedId: null, dislikedId: null })),
    Array(8).fill(null).map(() => ({ personId: null, likedId: null, dislikedId: null }))
  ]);
  const [practiceFails, setPracticeFails] = useState([]);

  // Concept lesson states
  const [tutorialStep, setTutorialStep] = useState(-1);
  const [tutorialNarrative, setTutorialNarrative] = useState("");
  const [highlightedInstruction, setHighlightedInstruction] = useState(-1);
  const [isPaused, setIsPaused] = useState(false);
  const [isTutorialComplete, setIsTutorialComplete] = useState(false);
  const [tutorialPlacements, setTutorialPlacements] = useState([
    Array(8).fill(null).map(() => ({ personId: null, likedId: null, dislikedId: null })),
    Array(8).fill(null).map(() => ({ personId: null, likedId: null, dislikedId: null })),
    Array(8).fill(null).map(() => ({ personId: null, likedId: null, dislikedId: null }))
  ]);
  const [tutorialFails, setTutorialFails] = useState([]);

  // Quiz states
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showQuestionSol, setShowQuestionSol] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);

  const isArrangementCorrect = useMemo(() => {
    return practiceRows[0].every((p, i) => p.personId === MISSION.correctLayout[i]);
  }, [practiceRows]);

  const handleNextAction = useCallback(() => {
    if (activeQuestionIndex < MISSION.questions.length - 1) {
        setActiveQuestionIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsCorrect(false);
        setAutoNextTimer(null);
        setShowQuestionSol(false);
    } else {
        setSessionCompleted(true);
    }
  }, [activeQuestionIndex]);

  const applyTutorialStep = useCallback((index) => {
    const stepData = MISSION.solutionSteps;
    if (index < 0) {
      setTutorialPlacements(Array(3).fill(null).map(() => Array(8).fill(null).map(() => ({ personId: null, likedId: null, dislikedId: null }))));
      setTutorialFails([]); setTutorialNarrative(""); setHighlightedInstruction(-1); setIsTutorialComplete(false); setTutorialStep(-1);
      return;
    }
    if (index >= stepData.length) return;

    let newRows = Array(3).fill(null).map(() => Array(8).fill(null).map(() => ({ personId: null, likedId: null, dislikedId: null })));
    let newFails = [];
    for (let i = 0; i <= index; i++) {
      const s = stepData[i];
      if (s?.casePlacements) { 
          s.casePlacements.forEach(p => { 
              if (p.personId) newRows[p.row][p.slot].personId = p.personId;
              if (p.likedId) newRows[p.row][p.slot].likedId = p.likedId;
              if (p.dislikedId) newRows[p.row][p.slot].dislikedId = p.dislikedId;
          }); 
      }
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

  const handleDragEnd = useCallback((event, info, id, type) => {
    if (appMode !== 'practice' || isArrangementCorrect) return;
    const dropPoint = { x: info.point.x, y: info.point.y };
    let minDistance = 1000;
    let target = null;

    for (let r = 0; r < activeRowsCount; r++) {
      for (let s = 0; s < 8; s++) {
        const refs = [
            { ref: personRefs.current[r][s], type: 'person' },
            { ref: likeRefs.current[r][s], type: 'liked' },
            { ref: dislikeRefs.current[r][s], type: 'disliked' }
        ];

        refs.forEach(obj => {
            if (!obj.ref) return;
            const rect = obj.ref.getBoundingClientRect();
            const centerX = rect.left + window.scrollX + rect.width / 2;
            const centerY = rect.top + window.scrollY + rect.height / 2;
            const dist = Math.sqrt(Math.pow(dropPoint.x - centerX, 2) + Math.pow(dropPoint.y - centerY, 2));
            if (dist < 40 && dist < minDistance) {
                minDistance = dist;
                target = { row: r, slot: s, field: obj.type };
            }
        });
      }
    }

    if (target) {
        if (type === 'person' && target.field !== 'person') return;
        if (type === 'color' && target.field === 'person') return;

        setPracticeRows(prev => {
            const next = [...prev];
            const updatedRow = [...next[target.row]];
            const cell = { ...updatedRow[target.slot] };

            if (type === 'person') cell.personId = id;
            else if (target.field === 'liked') cell.likedId = id;
            else if (target.field === 'disliked') cell.dislikedId = id;

            updatedRow[target.slot] = cell;
            next[target.row] = updatedRow;
            return next;
        });
    }
  }, [appMode, activeRowsCount, isArrangementCorrect]);

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
      const timeout = setTimeout(() => applyTutorialStep(tutorialStep + 1), 8000);
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
    const data = currentPlacements[rowIdx][colIdx];
    const person = data.personId ? PEOPLE_DATA[data.personId] : null;
    const likeColor = data.likedId ? COLOR_ATTRS[data.likedId] : null;
    const dislikeColor = data.dislikedId ? COLOR_ATTRS[data.dislikedId] : null;

    const stepData = tutorialStep !== -1 ? MISSION.solutionSteps[tutorialStep] : null;
    const isConflict = appMode === 'concept' && tutorialStep !== -1 && stepData?.conflict && stepData?.casePlacements?.some(cp => cp.row === rowIdx && cp.slot === colIdx);
    const isRowFailed = (appMode === 'practice' ? practiceFails : tutorialFails).includes(rowIdx);

    const clearField = (field) => {
        if (appMode !== 'practice') return;
        setPracticeRows(prev => {
            const next = [...prev];
            const row = [...next[rowIdx]];
            row[colIdx] = { ...row[colIdx], [field]: null };
            next[rowIdx] = row;
            return next;
        });
    };

    return (
      <div key={`${rowIdx}-${colIdx}`} className={`flex flex-col items-center gap-1.5 p-1 rounded-2xl border transition-all duration-500 ${isConflict ? 'ring-4 ring-red-500 animate-shake' : 'border-transparent'} ${isRowFailed ? 'opacity-30 grayscale' : 'opacity-100'}`}>
        {/* Person Tray */}
        <div ref={el => { personRefs.current[rowIdx][colIdx] = el }} className={`relative w-8 h-8 sm:w-12 sm:h-12 rounded-full border-2 transition-all flex items-center justify-center ${person ? `bg-gradient-to-br ${person.color} border-white shadow-lg` : 'border-dashed border-white/10 bg-black/20 shadow-inner'}`}>
          {person && <><span className="text-white font-black text-xs sm:text-lg">{String(person.initial)}</span>{appMode === 'practice' && <button onClick={() => clearField('personId')} className="absolute -top-1 -right-1 bg-red-600 rounded-full p-0.5 shadow-md"><Trash2 size={8} className="text-white"/></button>}</>}
        </div>
        {/* Favorite Color Field ❤️ */}
        <div ref={el => { likeRefs.current[rowIdx][colIdx] = el }} className={`relative w-6 h-6 sm:w-8 sm:h-8 rounded-lg border-2 flex items-center justify-center transition-all ${likeColor ? `${likeColor.bg} border-white shadow-md` : 'bg-white/5 border-dashed border-white/10'}`}>
            {!likeColor && <Heart size={14} className="text-rose-500/20" />}
            {likeColor && appMode === 'practice' && <button onClick={() => clearField('likedId')} className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"><X size={12} className="text-white"/></button>}
        </div>
        {/* Disliked Color Field 🚫 */}
        <div ref={el => { dislikeRefs.current[rowIdx][colIdx] = el }} className={`relative w-6 h-6 sm:w-8 sm:h-8 rounded-lg border-2 flex items-center justify-center transition-all ${dislikeColor ? `${dislikeColor.bg} border-white shadow-md` : 'bg-slate-900/40 border-dashed border-white/10'}`}>
            {!dislikeColor && <Ban size={14} className="text-slate-500/20" />}
            {dislikeColor && <div className="absolute inset-0 flex items-center justify-center"><X size={16} className="text-white drop-shadow-md" />{appMode === 'practice' && <button onClick={() => clearField('dislikedId')} className="absolute inset-0 bg-black/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity"><X size={12} className="text-white"/></button>}</div>}
        </div>
      </div>
    );
  };

  const renderRow = (idx, name, currentPlacements) => {
      const isFailed = (appMode === 'practice' ? practiceFails : tutorialFails).includes(idx);
      const isWinner = appMode === 'concept' && isTutorialComplete && idx === 0;
      return (
          <div key={idx} className="w-full flex flex-col items-center relative mb-2">
              <div className="w-full flex items-center gap-2 justify-center px-2">
                  <div className={`w-16 text-[8px] font-black uppercase text-center ${isFailed ? 'text-rose-500 line-through opacity-50' : isWinner ? 'text-green-500' : 'text-white/40'}`}>{String(name)}</div>
                  <div className="flex-1 max-w-5xl flex justify-center gap-1 sm:gap-2 relative px-2 py-3 rounded-[2rem] bg-black/20 border border-white/5 shadow-inner overflow-visible">
                      {isFailed && <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-[40] flex items-center justify-center bg-rose-900/40 backdrop-blur-[1px] rounded-[2rem]"><XCircle className="text-rose-500" size={64} /></motion.div>}
                      {Array(8).fill(0).map((_, col) => renderSlot(idx, col, currentPlacements))}
                  </div>
                  {appMode === 'practice' ? <button onClick={() => setPracticeFails(p => p.includes(idx) ? p.filter(i => i !== idx) : [...p, idx])} className={`p-2 rounded-full transition-all ${isFailed ? 'bg-rose-500 text-white shadow-inner' : 'bg-black/30 text-white/20 hover:text-white/50'}`}><Ban size={18} /></button> : <div className="w-10"/>}
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
            <h1 className="text-white text-xl font-black uppercase tracking-tighter text-[#e6dccb]">Oh we have 2 dimensions in the sitting arrangement!</h1>
          </div>
          <div className="flex bg-black/30 p-1.5 rounded-2xl border border-white/10">
            <button onClick={() => {setAppMode('concept'); applyTutorialStep(-1);}} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${appMode === 'concept' ? 'bg-yellow-400 text-black shadow-lg' : 'text-[#a88a6d] hover:text-white'}`}>Concept</button>
            <button onClick={() => {setAppMode('practice'); setActiveRowsCount(1); setPracticeFails([]); setPracticeRows(Array(3).fill(null).map(() => Array(8).fill(null).map(() => ({ personId: null, likedId: null, dislikedId: null }))));}} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${appMode === 'practice' ? 'bg-[#8d6e63] text-white shadow-inner' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
          </div>
        </header>
      </div>

      <div className="w-full max-w-[1500px] px-2 sm:px-4 py-2 relative z-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#2a1a16] p-1 rounded-[2.5rem] shadow-2xl border-4 border-black/40 relative ring-4 ring-black/10 overflow-visible">
          <div className="relative z-10 bg-[#3e2723] pt-6 pb-12 px-1 sm:px-6 rounded-[2rem] flex flex-col items-center justify-center min-h-[750px] shadow-inner overflow-visible">
            <div className="bg-black/50 backdrop-blur-md border border-white/10 p-4 sm:p-8 rounded-[2rem] w-full max-w-6xl mb-4 shadow-2xl">
               <div className="mb-4 p-3 bg-white/5 rounded-2xl border-l-4 border-yellow-400 flex justify-between items-center gap-4">
                 <h2 className="text-white text-xs sm:text-base font-black uppercase">{String(MISSION.mainHeader)}</h2>
                 {appMode === 'concept' && tutorialStep === -1 && <button onClick={() => applyTutorialStep(0)} className="bg-yellow-400 text-black px-4 py-2 rounded-full text-[10px] font-black uppercase flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg border-b-2 border-yellow-800"><Play size={12} fill="currentColor" /> Start Lesson</button>}
               </div>
               {appMode === 'concept' && <div className="mb-6 p-4 bg-yellow-400/10 rounded-2xl border border-yellow-400/20"><p className="text-yellow-200 text-sm italic font-bold leading-relaxed">"{String(MISSION.theoryIntro)}"</p></div>}
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2">
                {MISSION.instructions.map((ins, i) => {
                    const isStepActive = appMode === 'concept' && highlightedInstruction === i;
                    const isStepComplete = appMode === 'concept' && highlightedInstruction > i;
                    return (
                        <div key={i} className={`flex items-start text-left gap-3 p-2 rounded-xl border-2 transition-all ${isStepActive ? 'border-yellow-400 bg-yellow-400/10 scale-105 z-10' : 'border-white/5 bg-transparent'}`}>
                            {isStepComplete ? <CheckCircle2 size={12} className="text-green-500 mt-0.5" /> : <Square size={12} className="text-white/20 mt-0.5" />}
                            <p className={`text-[8px] sm:text-[10px] font-bold leading-tight ${isStepActive ? 'text-yellow-400 font-black' : 'text-[#e6dccb]/60'}`}>{String(ins)}</p>
                        </div>
                    );
                })}
               </div>
            </div>
            <div className="w-full flex flex-col items-center py-6 gap-2">
                {appMode === 'concept' ? <>{renderRow(0, "Case 1", tutorialPlacements)}{renderRow(1, "Case 2", tutorialPlacements)}</> : <>{Array(activeRowsCount).fill(0).map((_, i) => renderRow(i, `My Case ${i+1}`, practiceRows))}{activeRowsCount < 3 && <button onClick={() => setActiveRowsCount(p => p + 1)} className="mt-4 flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/40 px-6 py-2 rounded-full border border-dashed border-white/20 transition-all font-black uppercase text-[10px]"><Plus size={16} /> Add Case Path</button>}</>}
            </div>
            <AnimatePresence mode="wait">
              {appMode === 'concept' && tutorialStep !== -1 && (
                <motion.div key={tutorialStep} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-cyan-900/90 border border-cyan-400/30 text-white px-6 py-5 rounded-[2rem] text-xs sm:text-sm font-black text-center max-w-2xl mb-6 shadow-2xl relative ring-4 ring-cyan-400/10 flex flex-col items-center gap-4">
                  <div className="flex justify-between items-center w-full px-2 border-b border-white/10 pb-2"><span className="text-[10px] uppercase tracking-widest text-cyan-400 flex items-center gap-2"><Layers size={14}/> Lesson Step</span><span className="bg-cyan-500/20 px-3 py-0.5 rounded-full text-[10px] text-cyan-200">Step {tutorialStep + 1} / {MISSION.solutionSteps.length}</span></div>
                  <p className="leading-relaxed px-4 italic font-bold">"{String(tutorialNarrative)}"</p>
                  <div className="flex items-center gap-6 bg-black/40 p-2 rounded-full border border-white/5"><button onClick={() => applyTutorialStep(tutorialStep - 1)} disabled={tutorialStep <= 0} className="p-3 tutorial-prev hover:bg-white/10 rounded-full transition-all disabled:opacity-20"><ChevronLeft size={24} /></button><button onClick={() => setIsPaused(!isPaused)} className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-xl">{isPaused ? <Play size={24} fill="currentColor" /> : <Pause size={24} fill="currentColor" />} </button><button onClick={() => applyTutorialStep(tutorialStep + 1)} disabled={tutorialStep >= MISSION.solutionSteps.length - 1} className="p-3 tutorial-next hover:bg-white/10 rounded-full transition-all disabled:opacity-20"><ChevronRight size={24} /></button></div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute top-6 right-6 z-30 flex gap-3"><button onClick={() => setIs3DModalOpen(true)} className="bg-sky-500 text-white p-4 rounded-3xl shadow-2xl flex items-center gap-3 font-black uppercase text-xs hover:scale-105 active:scale-95 transition-all border-b-4 border-sky-800"><Maximize2 size={18} /><span>3D View</span></button></div>
            <div className="mt-4 flex flex-col lg:flex-row gap-6 w-full max-w-6xl">
                <div className="flex-1 p-6 bg-black/40 rounded-[3rem] border border-white/10 shadow-2xl relative"><span className="absolute -top-3 left-8 bg-black px-4 py-1 rounded-full text-[9px] font-black text-yellow-400 uppercase tracking-widest border border-white/10">Tray 1: Friends</span><div className="flex flex-wrap justify-center gap-3">{ALL_IDS.map(id => (<motion.div key={id} drag={appMode === 'practice' && !isArrangementCorrect} dragMomentum={false} dragSnapToOrigin={true} onDragEnd={(e, info) => handleDragEnd(e, info, id, 'person')} whileHover={{ scale: 1.15 }} whileDrag={{ scale: 1.25, zIndex: 100 }} className={`w-10 h-10 sm:w-12 sm:h-12 rounded-full border-2 flex items-center justify-center bg-gradient-to-br ${PEOPLE_DATA[id].color} shadow-xl cursor-grab active:cursor-grabbing border-white/40`}><span className="text-white font-black text-sm sm:text-lg select-none">{PEOPLE_DATA[id].initial}</span></motion.div>))}</div></div>
                <div className="flex-1 p-6 bg-black/40 rounded-[3rem] border border-white/10 shadow-2xl relative"><span className="absolute -top-3 left-8 bg-black px-4 py-1 rounded-full text-[9px] font-black text-yellow-400 uppercase tracking-widest border border-white/10">Tray 2: Color Logic</span><div className="flex flex-wrap justify-center gap-3">{ALL_COLORS.map(id => (<motion.div key={id} drag={appMode === 'practice' && !isArrangementCorrect} dragMomentum={false} dragSnapToOrigin={true} onDragEnd={(e, info) => handleDragEnd(e, info, id, 'color')} whileHover={{ scale: 1.15 }} whileDrag={{ scale: 1.25, zIndex: 100 }} className={`w-10 h-10 sm:w-12 sm:h-12 rounded-xl border-2 flex items-center justify-center ${COLOR_ATTRS[id].bg} shadow-xl cursor-grab active:cursor-grabbing border-white/40`}><div className="w-3 h-3 bg-white/20 rounded-full animate-pulse"/></motion.div>))}</div></div>
            </div>
            {isArrangementCorrect && appMode === 'practice' && <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-8 flex flex-col items-center gap-4 relative z-10"><div className="flex items-center gap-4 bg-green-500/20 px-8 py-4 rounded-3xl border-2 border-green-500/50 shadow-2xl ring-4 ring-green-500/10"><CheckCircle2 className="text-green-500" size={24} /><span className="text-green-400 font-black uppercase text-xs tracking-widest">Logic Verified!</span></div></motion.div>}
          </div>
        </motion.div>
      </div>
      <ThreeDVisualization isOpen={is3DModalOpen} onClose={() => setIs3DModalOpen(false)} placedPeople={appMode === 'concept' ? tutorialPlacements[0] : practiceRows[0]} />
      <div className="w-full max-w-5xl px-4 py-4 mb-24 relative z-10">
        <div className="bg-[#dfd7cc] p-6 sm:p-12 rounded-[3.5rem] border-4 border-[#c4a484] shadow-xl flex flex-col items-center gap-6 w-full relative overflow-hidden min-h-[300px]">
          {!isArrangementCorrect ? (<div className="relative z-10 flex flex-col items-center text-center gap-4 py-6 px-4"><div className="w-16 h-16 bg-[#3e2723]/10 rounded-full flex items-center justify-center text-[#3e2723] animate-pulse"><GraduationCap size={40} /></div><h2 className="text-[#3e2723] text-xl sm:text-3xl font-black uppercase tracking-tight text-center">Practice Assessment</h2><p className="text-[#3e2723]/60 font-bold text-sm sm:text-base max-w-sm italic text-center">Correctly arrange 'My Case 1' to unlock the verification quiz.</p></div>) : (
            <div className="relative z-10 w-full text-center py-2 px-4">
                <div className="mb-4 flex items-center justify-center gap-2"><span className="bg-[#3e2723] text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Verification • Q{activeQuestionIndex + 1}</span></div>
                <h2 className="text-[#3e2723] text-xl sm:text-2xl font-black uppercase mb-10 tracking-tight text-center px-4 leading-tight">{String(MISSION.questions[activeQuestionIndex].q)}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl mx-auto mb-8">{MISSION.questions[activeQuestionIndex].options.map((option, idx) => {
                    const isSel = selectedOption === idx; const btnClass = isSel && isCorrect ? 'bg-green-600 border-green-800 text-white shadow-lg' : isSel && isError ? 'bg-red-500 border-red-700 text-white animate-shake' : 'bg-white border-slate-200 text-[#3e2723] hover:bg-slate-50';
                    return <button key={idx} onClick={() => handleAnswerSelect(idx)} className={`group relative p-6 rounded-[1.5rem] border-b-8 font-black text-sm sm:text-lg transition-all ${btnClass}`}>{String(option)}{isSel && isCorrect && <CheckCircle2 className="absolute top-3 right-3 opacity-40" size={16} />}</button>;
                })}</div>
                <AnimatePresence>{showQuestionSol && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-sky-50 border-l-8 border-sky-500 rounded-2xl text-left shadow-xl max-w-2xl mx-auto mb-8"><h4 className="flex items-center gap-2 text-sky-800 font-black uppercase text-xs mb-2"><Info size={16} /> Lesson Logic</h4><p className="text-sky-900 font-bold italic">"{String(MISSION.questions[activeQuestionIndex].sol)}"</p></motion.div>}</AnimatePresence>
                <button onClick={() => setShowQuestionSol(!showQuestionSol)} className="text-[#8d6e63] font-black uppercase text-xs flex items-center gap-2 mx-auto hover:text-black transition-colors underline decoration-dotted"><Search size={14} /> View Answer Logic</button>
            </div>
          )}
        </div>
      </div>
      <div className="w-full max-w-xl px-4 pb-24 flex flex-col sm:flex-row gap-4 relative z-10"><button onClick={() => setSessionCompleted(true)} disabled={!isArrangementCorrect} className={`flex-1 p-6 rounded-3xl font-black uppercase text-[12px] border-b-8 shadow-2xl transition-all flex items-center justify-center gap-3 ${isArrangementCorrect ? 'bg-white text-[#3e2723] border-[#3e2723] opacity-100 hover:scale-105 shadow-xl' : 'bg-gray-200 text-gray-400 border-gray-300 opacity-50 cursor-not-allowed shadow-inner'}`}><Trophy size={20} /> Finish Lab</button><button onClick={handleNextAction} disabled={!isArrangementCorrect || sessionCompleted} className={`flex-1 p-6 rounded-3xl font-black uppercase text-[12px] border-b-8 shadow-2xl transition-all flex items-center justify-center gap-3 ${autoNextTimer !== null ? 'bg-green-600 text-white border-green-800 shadow-green-200' : 'bg-[#8d6e63] text-white border-[#5d4037]'}`}>{autoNextTimer !== null ? `Next (${autoNextTimer}s)` : 'Next Question'} <ChevronRight size={20} /></button></div>
      <AnimatePresence>
        {sessionCompleted && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-[#e6dccb] p-8 sm:p-14 rounded-[4rem] border-8 border-[#3e2723] text-center shadow-2xl relative overflow-hidden"><div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} /><div className="relative z-10 flex flex-col items-center text-center"><div className="w-28 h-28 sm:w-36 sm:h-36 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-8 shadow-2xl border-4 border-white"><Trophy size={72} className="animate-bounce" /></div><h1 className="text-4xl sm:text-6xl font-black text-[#3e2723] uppercase mb-6 tracking-tighter">Lab Complete!</h1><p className="text-[#3e2723] text-lg sm:text-2xl leading-relaxed font-black mb-12 max-w-md mx-auto px-4 text-center">"You successfully applied Multi-Case Logic to solve a 2D row. You are now a master of logical elimination!"</p><button onClick={() => navigate('/learn/logicalReasoning/LinearArrangement/3DArrangement')} className="relative z-10 px-12 sm:px-16 py-6 sm:py-8 bg-[#3e2723] text-[#e6dccb] rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl border-b-8 border-black hover:scale-105 active:translate-y-2 transition-all">Next Module</button></div></div>
          </motion.div>}
      </AnimatePresence>
    </div>
  );
}