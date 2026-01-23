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
  X,
  Home,
  Briefcase,
  Users,
  UserCircle,
  Building2,
  Palette,
  Check
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// DATA CONFIGURATIONS
// ==========================================
const PEOPLE_IDS = ['pA', 'pB', 'pC', 'pD', 'pE', 'pF', 'pG', 'pH'];
const FLOOR_IDS = ['f1', 'f2', 'f3', 'f4', 'f5', 'f6', 'f7', 'f8'];
const COLOR_IDS = ['cBlue', 'cGreen', 'cPink', 'cRed', 'cBlack', 'cWhite', 'cYellow', 'cViolet'];

const PEOPLE_DATA = {
  pA: { initial: 'A', color: 'from-rose-400 to-rose-600', hex: 0xfb7185 },
  pB: { initial: 'B', color: 'from-sky-400 to-sky-600', hex: 0x38bdf8 },
  pC: { initial: 'C', color: 'from-amber-400 to-amber-600', hex: 0xfbbf24 },
  pD: { initial: 'D', color: 'from-emerald-400 to-emerald-600', hex: 0x34d399 },
  pE: { initial: 'E', color: 'from-purple-400 to-purple-600', hex: 0xc084fc },
  pF: { initial: 'F', color: 'from-pink-400 to-pink-600', hex: 0xf472b6 },
  pG: { initial: 'G', color: 'from-cyan-400 to-cyan-600', hex: 0x22d3ee },
  pH: { initial: 'H', color: 'from-orange-400 to-orange-600', hex: 0xfb923c },
};

const COLOR_DATA = {
  cBlue: { name: 'Blue', initial: 'Bl', hex: 0x2563eb, bg: 'bg-blue-600', icon: '🔵' },
  cGreen: { name: 'Green', initial: 'Gr', hex: 0x16a34a, bg: 'bg-green-600', icon: '🟢' },
  cPink: { name: 'Pink', initial: 'Pi', hex: 0xf472b6, bg: 'bg-pink-400', icon: '🌸' },
  cRed: { name: 'Red', initial: 'Re', hex: 0xdc2626, bg: 'bg-red-600', icon: '🔴' },
  cBlack: { name: 'Black', initial: 'Bk', hex: 0x0f172a, bg: 'bg-slate-900', icon: '⚫' },
  cWhite: { name: 'White', initial: 'Wh', hex: 0xf8fafc, bg: 'bg-slate-100', icon: '⚪' },
  cYellow: { name: 'Yellow', initial: 'Ye', hex: 0xfacc15, bg: 'bg-yellow-400', icon: '🟡' },
  cViolet: { name: 'Violet', initial: 'Vi', hex: 0x7c3aed, bg: 'bg-violet-600', icon: '🟣' },
};

const MISSION = {
  title: "3D Vertical Deduction Lab",
  mainHeader: "Track Identity (A-H), Floor (F1-F8), and Color Logic in a 3D linear arrangement.",
  instructions: [
    "1. Violet is immediately above White.",
    "2. Below Pink is an odd floor (not 1 or 3).",
    "3. E is not on Floor 1.",
    "4. One person lives between B (Red) and Pink.",
    "5. Three people live between B and F (Yellow).",
    "6. Two people live between D (Green) and F.",
    "7. D lives on a floor above F.",
    "8. C is immediately above A.",
    "9. Three floors between A and White.",
    "10. E likes Blue. G does not like White."
  ],
  correctMatching: {
    pA: { floorIdx: 4, colorId: 'cBlack' }, 
    pB: { floorIdx: 7, colorId: 'cRed' },   
    pC: { floorIdx: 5, colorId: 'cPink' },  
    pD: { floorIdx: 6, colorId: 'cGreen' }, 
    pE: { floorIdx: 2, colorId: 'cBlue' },  
    pF: { floorIdx: 3, colorId: 'cYellow' },
    pG: { floorIdx: 1, colorId: 'cViolet' },
    pH: { floorIdx: 0, colorId: 'cWhite' }  
  },
  solutionSteps: [
    { why: "Step 1: Strategize! Rule 2 is our primary anchor. Below Pink is an odd floor (5 or 7), so Pink must be on Floor 6 or Floor 8. Let's create our test cases.", ins: 1, casePlacements: [{ row: 0, slot: 5, colorId: 'cPink' }, { row: 1, slot: 7, colorId: 'cPink' }] },
    { why: "Step 2: Let's investigate Case B (Pink at F8) thoroughly. Rule 4 says one student between B and Pink. This forces B(Red) at Floor 6.", ins: 3, casePlacements: [{ row: 1, slot: 5, personId: 'pB', colorId: 'cRed' }] },
    { why: "Step 3: Case B Rule 5 - Three floors between B(6) and F(Yellow). Counting down: F5, F4, F3. So F takes Floor 2.", ins: 4, casePlacements: [{ row: 1, slot: 1, personId: 'pF', colorId: 'cYellow' }] },
    { why: "Step 4: Case B Rule 6/7 - Two floors between D(Green) and F(2). Since D is above F, D takes Floor 5.", ins: 5, casePlacements: [{ row: 1, slot: 4, personId: 'pD', colorId: 'cGreen' }] },
    { why: "Step 5: Case B investigation. Let's try placing C and A at Floors 4 and 3 (Instruction 8).", ins: 7, casePlacements: [{ row: 1, slot: 3, personId: 'pC' }, { row: 1, slot: 2, personId: 'pA' }] },
    { why: "Step 6: Case B - Check Rule 9. If A is Floor 3, 3 floors between A and White makes White Floor 7. Rule 1 needs Violet above White (F8).", ins: 8, casePlacements: [{ row: 1, slot: 6, colorId: 'cWhite' }, { row: 1, slot: 7, colorId: 'cViolet' }] },
    { why: "Step 7: CLASH! Case B Sub-Case 1 fails. Violet would be Floor 8, but F8 is already Pink. Now we test the only other adjacent spot for C and A.", ins: 0, conflict: true, casePlacements: [] },
    { why: "Step 8: Sub-Case 2: Testing C and A at Floors 8 and 7. Notice we've removed them from F4/F3 to try this alternative.", ins: 7, casePlacements: [{ row: 1, slot: 3, personId: null }, { row: 1, slot: 2, personId: null }, { row: 1, slot: 7, personId: 'pC' }, { row: 1, slot: 6, personId: 'pA' }] },
    { why: "Step 9: CLASH! Floor 8 is already anchored to Pink. Case B has no valid spots for the mandatory adjacent blocks and is discarded.", ins: 0, conflict: true, failRows: [1], casePlacements: [] },
    { why: "Step 10: Now solve Case A (Pink at F6). Rule 4 puts B(Red) at Floor 8 (since F4 is needed later).", ins: 3, casePlacements: [{ row: 0, slot: 7, personId: 'pB', colorId: 'cRed' }] },
    { why: "Step 11: Rule 5 - Three floors between B(F8) and F(Yellow). F sits at Floor 4.", ins: 4, casePlacements: [{ row: 0, slot: 3, personId: 'pF', colorId: 'cYellow' }] },
    { why: "Step 12: Rule 6/7 - Two floors between D(Green) and F(4). D sits at Floor 7.", ins: 5, casePlacements: [{ row: 0, slot: 6, personId: 'pD', colorId: 'cGreen' }] },
    { why: "Step 13: Case A Adjacencies - Only F1, F2, F3, F5 are free. Rule 9: If White is Floor 1, A is Floor 5. This fits perfectly!", ins: 8, casePlacements: [{ row: 0, slot: 0, colorId: 'cWhite' }, { row: 0, slot: 4, personId: 'pA' }] },
    { why: "Step 14: Rule 1 - Violet is immediately above White(F1). Violet takes Floor 2.", ins: 0, casePlacements: [{ row: 0, slot: 1, colorId: 'cViolet' }] },
    { why: "Step 15: Rule 8 - C is above A(F5). So C takes Floor 6 (Pink). Everything aligns with the anchor!", ins: 7, casePlacements: [{ row: 0, slot: 5, personId: 'pC' }] },
    { why: "Step 16: Final match - E(Blue) takes Floor 3. H takes Floor 1 (White). G takes Floor 2 (Violet). A takes Black. Build complete!", ins: 9, isComplete: true, casePlacements: [{ row: 0, slot: 2, personId: 'pE', colorId: 'cBlue' }, { row: 0, slot: 1, personId: 'pG' }, { row: 0, slot: 0, personId: 'pH' }, { row: 0, slot: 4, colorId: 'cBlack' }] }
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
      scene.background = new THREE.Color(0x050505);
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(0, 16, 26);
      camera.lookAt(0, 8, 0);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      mountRef.current.appendChild(renderer.domElement);
      
      scene.add(new THREE.AmbientLight(0xffffff, 1.2));
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(100, 50), new THREE.MeshPhongMaterial({ color: 0x111111 }));
      floor.rotation.x = -Math.PI / 2;
      scene.add(floor);

      placedPeople.forEach((pData, idx) => {
        if (!pData?.personId && !pData?.colorId) return;
        const yPos = idx * 3.5;
        const person = pData.personId ? PEOPLE_DATA[pData.personId] : { hex: 0x333333, initial: '?' };
        const colorAttr = pData.colorId ? COLOR_DATA[pData.colorId] : null;

        const base = new THREE.Mesh(new THREE.CylinderGeometry(2.5, 2.5, 1, 32), new THREE.MeshPhongMaterial({ color: person.hex }));
        base.position.set(0, yPos + 0.5, 0);
        scene.add(base);

        const ring = new THREE.Mesh(new THREE.CylinderGeometry(1.8, 1.8, 1, 32), new THREE.MeshPhongMaterial({ color: 0xd4af37 }));
        ring.position.set(0, yPos + 1.2, 0);
        scene.add(ring);

        if (colorAttr) {
            const disc = new THREE.Mesh(new THREE.CylinderGeometry(1.2, 1.2, 1, 32), new THREE.MeshPhongMaterial({ color: colorAttr.hex }));
            disc.position.set(0, yPos + 1.8, 0);
            scene.add(disc);
        }

        const drawLabel = (txt, x, y, scale, color = 'white') => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            canvas.width = 128; canvas.height = 128;
            ctx.fillStyle = color; ctx.font = `bold 75px Noto Sans`;
            ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
            ctx.fillText(txt, 64, 64);
            const texture = new THREE.CanvasTexture(canvas);
            const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }));
            sprite.scale.set(scale, scale, scale);
            sprite.position.set(x, y, 0);
            scene.add(sprite);
        };

        if (pData.personId) drawLabel(person.initial, -5, yPos + 1.5, 3.5);
        drawLabel(`F${idx + 1}`, 0, yPos + 4.5, 4.5, '#fbbf24'); 
        if (colorAttr) drawLabel(colorAttr.initial, 5, yPos + 1.5, 2.5);
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
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-4 bg-black/95 backdrop-blur-md">
      <div className="relative w-full max-w-7xl bg-[#050505] rounded-[3rem] border border-white/10 overflow-hidden h-[85vh] flex flex-col shadow-2xl">
        <div className="p-6 flex justify-between items-center bg-white/5 text-white border-b border-white/5">
          <h2 className="text-xl font-black uppercase flex items-center gap-3"><Building2 className="text-yellow-400" /> Depth Totem Logic (3D)</h2>
          <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full text-white transition-colors"><CloseIcon size={32} /></button>
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
  const colorRefs = useRef([[], [], []]);
  const tutorialTimeouts = useRef([]);
  
  const [appMode, setAppMode] = useState('concept');
  const [activeRowsCount, setActiveRowsCount] = useState(1);

  // States
  const [practiceRows, setPracticeRows] = useState([
    Array(8).fill(null).map(() => ({ personId: null, colorId: null })),
    Array(8).fill(null).map(() => ({ personId: null, colorId: null })),
    Array(8).fill(null).map(() => ({ personId: null, colorId: null }))
  ]);
  const [practiceFails, setPracticeFails] = useState([]);
  const [checkedInstructions, setCheckedInstructions] = useState([]);

  // Concept Logic
  const [tutorialStep, setTutorialStep] = useState(-1);
  const [tutorialNarrative, setTutorialNarrative] = useState("");
  const [highlightedInstruction, setHighlightedInstruction] = useState(-1);
  const [isPaused, setIsPaused] = useState(false);
  const [isTutorialComplete, setIsTutorialComplete] = useState(false);
  const [tutorialPlacements, setTutorialPlacements] = useState([
    Array(8).fill(null).map(() => ({ personId: null, colorId: null })),
    Array(8).fill(null).map(() => ({ personId: null, colorId: null })),
    Array(8).fill(null).map(() => ({ personId: null, colorId: null }))
  ]);
  const [tutorialFails, setTutorialFails] = useState([]);

  // Quiz State
  const [activeQuestionIndex, setActiveQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [isCorrect, setIsCorrect] = useState(false);
  const [isError, setIsError] = useState(false);
  const [showQuestionSol, setShowQuestionSol] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [sessionCompleted, setSessionCompleted] = useState(false);
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);

  const isArrangementCorrect = useMemo(() => {
    return PEOPLE_IDS.every((pId) => {
        const correct = MISSION.correctMatching[pId];
        const slot = practiceRows[0][correct.floorIdx];
        return slot.personId === pId && slot.colorId === correct.colorId;
    });
  }, [practiceRows]);

  const toggleInstruction = (idx) => {
    if (appMode !== 'practice') return;
    setCheckedInstructions(prev => 
        prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]
    );
  };

  const applyTutorialStep = useCallback((index) => {
    const stepData = MISSION.solutionSteps;
    if (index < 0) {
      setTutorialPlacements(Array(3).fill(null).map(() => Array(8).fill(null).map(() => ({ personId: null, colorId: null }))));
      setTutorialFails([]); setTutorialNarrative(""); setHighlightedInstruction(-1); setIsTutorialComplete(false); setTutorialStep(-1);
      return;
    }
    if (index >= stepData.length) return;

    let newRows = Array(3).fill(null).map(() => Array(8).fill(null).map(() => ({ personId: null, colorId: null })));
    let newFails = [];
    for (let i = 0; i <= index; i++) {
      const s = stepData[i];
      if (s?.casePlacements) { 
          s.casePlacements.forEach(p => { 
              if (p.personId !== undefined) newRows[p.row][p.slot].personId = p.personId;
              if (p.colorId !== undefined) newRows[p.row][p.slot].colorId = p.colorId;
          }); 
      }
      if (s?.failRows) newFails = [...new Set([...newFails, ...s.failRows])];
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
            { ref: personRefs.current[r][s], type: 'personId' },
            { ref: colorRefs.current[r][s], type: 'colorId' }
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
        if (type === 'person' && target.field !== 'personId') return;
        if (type === 'color' && target.field !== 'colorId') return;

        setPracticeRows(prev => {
            const next = [...prev];
            const updatedRow = [...next[target.row]];
            const cell = { ...updatedRow[target.slot] };
            cell[target.field] = id;
            updatedRow[target.slot] = cell;
            next[target.row] = updatedRow;
            return next;
        });
    }
  }, [appMode, activeRowsCount, isArrangementCorrect]);

  const handleAnswerSelect = useCallback((index) => {
    if (isCorrect) return;
    setSelectedOption(index);
    if (index === MISSION.questions[activeQuestionIndex]?.correct) {
      setIsCorrect(true); setIsError(false); setAutoNextTimer(10);
    } else {
      setIsError(true); setTimeout(() => setIsError(false), 600);
    }
  }, [isCorrect, activeQuestionIndex]);

  useEffect(() => {
    if (appMode === 'concept' && tutorialStep !== -1 && !isPaused && !isTutorialComplete) {
      const timeout = setTimeout(() => applyTutorialStep(tutorialStep + 1), 9000);
      tutorialTimeouts.current.push(timeout);
      return () => clearTimeout(timeout);
    }
  }, [appMode, tutorialStep, isPaused, isTutorialComplete, applyTutorialStep]);

  const renderSlot = (rowIdx, colIdx, currentPlacements) => {
    const data = currentPlacements[rowIdx][colIdx];
    const person = data.personId ? PEOPLE_DATA[data.personId] : null;
    const colorAttr = data.colorId ? COLOR_DATA[data.colorId] : null;

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
      <div key={`${rowIdx}-${colIdx}`} className={`flex flex-col items-center gap-1.5 p-1 transition-all duration-500 ${isRowFailed ? 'opacity-30 grayscale' : 'opacity-100'}`}>
        <span className="text-[7px] font-black text-white/20 mb-1 uppercase">Floor {colIdx + 1}</span>
        <div ref={el => { personRefs.current[rowIdx][colIdx] = el }} className={`relative w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 transition-all flex items-center justify-center ${person ? `bg-gradient-to-br ${person.color} border-white shadow-lg` : 'border-dashed border-white/10 bg-black/20 shadow-inner'}`}>
          {person && <><span className="text-white font-black text-xs sm:text-xl">{String(person.initial)}</span>{appMode === 'practice' && <button onClick={() => clearField('personId')} className="absolute -top-1 -right-1 bg-red-600 rounded-full p-1 shadow-md hover:scale-110 text-white"><Trash2 size={8} /></button>}</>}
        </div>
        <div ref={el => { colorRefs.current[rowIdx][colIdx] = el }} className={`relative w-8 h-8 sm:w-12 sm:h-12 rounded-lg border-2 flex items-center justify-center transition-all ${colorAttr ? `${colorAttr.bg} border-white shadow-md` : 'border-dashed border-white/20 bg-white/5'}`}>
            {!colorAttr ? <Palette size={16} className="text-white/10" /> : <div className="flex flex-col items-center leading-none text-white"><span className="text-[9px] font-black uppercase">{colorAttr.initial}</span></div>}
            {colorAttr && appMode === 'practice' && <button onClick={() => clearField('colorId')} className="absolute -bottom-1 -right-1 bg-red-600 rounded-full p-0.5 shadow-md hover:scale-110 text-white"><Trash2 size={8} /></button>}
        </div>
      </div>
    );
  };

  const renderRow = (idx, name, currentPlacements) => {
      const isFailed = (appMode === 'practice' ? practiceFails : tutorialFails).includes(idx);
      const isWinner = appMode === 'concept' && isTutorialComplete && idx === 0;
      return (
          <div key={idx} className="w-full flex flex-col items-center relative mb-8" ref={idx === 0 ? containerRef : null}>
              <div className="w-full flex items-center gap-3 justify-center px-4">
                  <div className={`w-24 text-[10px] font-black uppercase text-center ${isFailed ? 'text-rose-500 line-through opacity-50' : isWinner ? 'text-green-500' : 'text-white/40'}`}>{String(name)}</div>
                  <div className="flex-1 max-w-5xl flex justify-center gap-1.5 sm:gap-2.5 relative px-2 py-5 rounded-[3rem] bg-black/20 border border-white/5 shadow-inner overflow-visible">
                      {isFailed && <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 1, scale: 1 }} className="absolute inset-0 z-[40] flex items-center justify-center bg-rose-900/40 backdrop-blur-[1px] rounded-[3rem]"><XCircle className="text-rose-500" size={64} /></motion.div>}
                      {Array(8).fill(0).map((_, col) => renderSlot(idx, col, currentPlacements))}
                  </div>
                  {appMode === 'practice' ? <button onClick={() => setPracticeFails(p => p.includes(idx) ? p.filter(i => i !== idx) : [...p, idx])} className={`p-2 rounded-full transition-all ${isFailed ? 'bg-rose-500 text-white shadow-inner' : 'bg-black/30 text-white/20 hover:text-white/50'}`}><Ban size={20} /></button> : <div className="w-10"/>}
              </div>
          </div>
      );
  };

  return (
    <div className="min-h-screen bg-[#e6dccb] flex flex-col items-center no-scrollbar overflow-x-hidden font-sans relative pb-20">
      <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      <div className="w-full max-w-[1500px] shrink-0 px-4 pt-6 relative z-10">
        <header className="w-full bg-[#2a1a16] p-4 rounded-[2rem] border-b-8 border-black/40 shadow-2xl flex flex-col lg:flex-row justify-between items-center gap-4 text-white">
          <div className="flex flex-col text-left">
            <button onClick={() => navigate('/')} className="flex items-center gap-1.5 text-[#a88a6d] font-black uppercase text-[10px] mb-1 hover:text-white transition-all"><ChevronLeft size={16} /> Dashboard</button>
            <h1 className="text-white text-xl font-black uppercase tracking-tighter text-[#e6dccb]">3D Depth Logic Lab</h1>
          </div>
          <div className="flex bg-black/30 p-1.5 rounded-2xl border border-white/10">
            <button onClick={() => {setAppMode('concept'); applyTutorialStep(-1);}} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${appMode === 'concept' ? 'bg-yellow-400 text-black shadow-lg' : 'text-[#a88a6d] hover:text-white'}`}>Theory</button>
            <button onClick={() => {setAppMode('practice'); setActiveRowsCount(1); setPracticeFails([]); setCheckedInstructions([]); setPracticeRows(Array(3).fill(null).map(() => Array(8).fill(null).map(() => ({ personId: null, colorId: null }))));}} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase transition-all ${appMode === 'practice' ? 'bg-[#8d6e63] text-white shadow-inner' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
          </div>
        </header>
      </div>

      <div className="w-full max-w-[1500px] px-2 sm:px-4 py-2 relative z-10">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-[#2a1a16] p-1 rounded-[2.5rem] shadow-2xl border-4 border-black/40 relative ring-4 ring-black/10 overflow-visible">
          <div className="relative z-10 bg-[#3e2723] pt-6 pb-12 px-1 sm:px-6 rounded-[2rem] flex flex-col items-center justify-center min-h-[750px] shadow-inner overflow-visible">
            <div className="bg-black/50 backdrop-blur-md border border-white/10 p-4 sm:p-8 rounded-[2rem] w-full max-w-6xl mb-4 shadow-2xl">
               <div className="mb-4 p-3 bg-white/5 rounded-2xl border-l-4 border-yellow-400 flex justify-between items-center gap-4">
                 <h2 className="text-white text-xs sm:text-base font-black uppercase">{String(MISSION.mainHeader)}</h2>
                 {appMode === 'concept' && tutorialStep === -1 && <button onClick={() => applyTutorialStep(0)} className="bg-yellow-400 text-black px-4 py-2 rounded-full text-[10px] font-black uppercase flex items-center gap-2 hover:scale-105 active:scale-95 transition-all shadow-lg border-b-2 border-yellow-800"><Play size={12} fill="currentColor" /> Start Logic Guide</button>}
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-x-4 gap-y-2">
                {MISSION.instructions.map((ins, i) => {
                    const isStepActive = appMode === 'concept' && highlightedInstruction === i;
                    const isStepComplete = (appMode === 'concept' && highlightedInstruction >= i && highlightedInstruction !== -1) || (appMode === 'practice' && checkedInstructions.includes(i));
                    
                    const showCheck = appMode === 'practice' ? checkedInstructions.includes(i) : isStepComplete;

                    return (
                        <button 
                            key={i} 
                            onClick={() => toggleInstruction(i)}
                            disabled={appMode === 'concept'}
                            className={`flex items-start text-left gap-3 p-2 rounded-xl border-2 transition-all group ${isStepActive ? 'border-yellow-400 bg-yellow-400/10 scale-105 z-10 shadow-xl' : showCheck ? 'border-green-500/50 bg-green-500/5' : 'border-white/5 bg-transparent'}`}
                        >
                            <div className={`mt-0.5 w-4 h-4 rounded border flex items-center justify-center transition-colors ${showCheck ? 'bg-green-500 border-green-500' : 'border-white/20'}`}>
                                {showCheck && <Check size={12} className="text-white" />}
                            </div>
                            <p className={`text-[8px] sm:text-[10px] font-bold leading-tight ${isStepActive ? 'text-yellow-400 font-black' : showCheck ? 'text-green-200/50 line-through' : 'text-[#e6dccb]/60'}`}>{String(ins)}</p>
                        </button>
                    );
                })}
               </div>
            </div>
            <div className="w-full flex flex-col items-center py-6 gap-2">
                {appMode === 'concept' ? <>{renderRow(0, "Case A (Logical Path)", tutorialPlacements)}{renderRow(1, "Case B (Investigated Branch)", tutorialPlacements)}</> : <>{Array(activeRowsCount).fill(0).map((_, i) => renderRow(i, `Deduction ${i+1}`, practiceRows))}{activeRowsCount < 3 && <button onClick={() => setActiveRowsCount(p => p + 1)} className="mt-4 flex items-center gap-2 bg-white/5 hover:bg-white/10 text-white/40 px-6 py-2 rounded-full border border-dashed border-white/20 transition-all font-black uppercase text-[10px]"><Plus size={16} /> Add Comparison Case</button>}</>}
            </div>
            <AnimatePresence mode="wait">
              {appMode === 'concept' && tutorialStep !== -1 && (
                <motion.div key={tutorialStep} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-cyan-900/90 border border-cyan-400/30 text-white px-6 py-5 rounded-[2rem] text-xs sm:text-sm font-black text-center max-w-2xl mb-6 shadow-2xl relative ring-4 ring-cyan-400/10 flex flex-col items-center gap-4">
                  <div className="flex justify-between items-center w-full px-2 border-b border-white/10 pb-2"><span className="text-[10px] uppercase tracking-widest text-cyan-400 flex items-center gap-2"><Layers size={14}/> 3D Deduction Step</span><span className="bg-cyan-500/20 px-3 py-0.5 rounded-full text-[10px] text-cyan-200">Step {tutorialStep + 1} / {MISSION.solutionSteps.length}</span></div>
                  <p className="leading-relaxed px-4 italic font-bold">"{String(tutorialNarrative)}"</p>
                  <div className="flex items-center gap-6 bg-black/40 p-2 rounded-full border border-white/5">
                      <button onClick={() => applyTutorialStep(tutorialStep - 1)} disabled={tutorialStep <= 0} className="p-3 hover:bg-white/10 rounded-full transition-all disabled:opacity-20"><ChevronLeft size={24} /></button>
                      <button onClick={() => setIsPaused(!isPaused)} className="w-12 h-12 bg-cyan-500 rounded-full flex items-center justify-center hover:scale-105 transition-all shadow-xl">{isPaused ? <Play size={24} fill="currentColor" /> : <Pause size={24} fill="currentColor" />} </button>
                      <button onClick={() => applyTutorialStep(tutorialStep + 1)} disabled={tutorialStep >= MISSION.solutionSteps.length - 1} className="p-3 hover:bg-white/10 rounded-full transition-all disabled:opacity-20"><ChevronRight size={24} /></button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
            <div className="absolute top-6 right-6 z-30 flex gap-3"><button onClick={() => setIs3DModalOpen(true)} className="bg-sky-500 text-white p-4 rounded-3xl shadow-2xl flex items-center gap-3 font-black uppercase text-xs hover:scale-105 active:scale-95 transition-all border-b-4 border-sky-800"><Maximize2 size={18} /><span>3D View</span></button></div>
            <div className="mt-4 flex flex-col lg:flex-row gap-6 w-full max-w-[95%]">
                <div className="flex-1 p-6 bg-black/40 rounded-[3rem] border border-white/10 shadow-2xl relative">
                    <span className="absolute -top-3 left-8 bg-black px-4 py-1 rounded-full text-[9px] font-black text-yellow-400 uppercase tracking-widest border border-white/10">Tray 1: Students</span>
                    <div className="flex flex-wrap justify-center gap-3">
                        {PEOPLE_IDS.map(id => (
                            <motion.div key={id} drag={appMode === 'practice' && !isArrangementCorrect} dragMomentum={false} dragSnapToOrigin={true} onDragEnd={(e, info) => handleDragEnd(e, info, id, 'person')} whileHover={{ scale: 1.15 }} whileDrag={{ scale: 1.25, zIndex: 100 }} className={`w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 flex items-center justify-center bg-gradient-to-br ${PEOPLE_DATA[id].color} shadow-xl cursor-grab active:cursor-grabbing border-white/40`}><span className="text-white font-black text-sm sm:text-xl select-none">{PEOPLE_DATA[id].initial}</span></motion.div>
                        ))}
                    </div>
                </div>
                <div className="flex-1 p-6 bg-black/40 rounded-[3rem] border border-white/10 shadow-2xl relative">
                    <span className="absolute -top-3 left-8 bg-black px-4 py-1 rounded-full text-[9px] font-black text-yellow-400 uppercase tracking-widest border border-white/10">Tray 2: Colors</span>
                    <div className="flex flex-wrap justify-center gap-2">
                        {COLOR_IDS.map(id => (
                            <motion.div key={id} drag={appMode === 'practice' && !isArrangementCorrect} dragMomentum={false} dragSnapToOrigin={true} onDragEnd={(e, info) => handleDragEnd(e, info, id, 'color')} whileHover={{ scale: 1.15 }} whileDrag={{ scale: 1.25, zIndex: 100 }} className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl border-2 flex items-center justify-center ${COLOR_DATA[id].bg} shadow-xl cursor-grab active:cursor-grabbing border-white/40 leading-none`} title={COLOR_DATA[id].name}><span className="text-[9px] font-black text-white">{COLOR_DATA[id].initial}</span></motion.div>
                        ))}
                    </div>
                </div>
            </div>
            {isArrangementCorrect && appMode === 'practice' && <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="mt-8 flex flex-col items-center gap-4 relative z-10"><div className="flex items-center gap-4 bg-green-500/20 px-8 py-4 rounded-3xl border-2 border-green-500/50 shadow-2xl ring-4 ring-green-500/10"><CheckCircle2 className="text-green-500" size={24} /><span className="text-green-400 font-black uppercase text-xs tracking-widest">Logic arrangement Verified!</span></div></motion.div>}
          </div>
        </motion.div>
      </div>
      <ThreeDVisualization isOpen={is3DModalOpen} onClose={() => setIs3DModalOpen(false)} placedPeople={appMode === 'concept' ? tutorialPlacements[0] : practiceRows[0]} />
      <div className="w-full max-w-5xl px-4 py-4 mb-24 relative z-10">
        <div className="bg-[#dfd7cc] p-6 sm:p-12 rounded-[3.5rem] border-4 border-[#c4a484] shadow-xl flex flex-col items-center gap-6 w-full relative overflow-hidden min-h-[300px]">
          {!isArrangementCorrect ? (<div className="relative z-10 flex flex-col items-center text-center gap-4 py-6 px-4"><div className="w-16 h-16 bg-[#3e2723]/10 rounded-full flex items-center justify-center text-[#3e2723] animate-pulse"><Building2 size={40} /></div><h2 className="text-[#3e2723] text-xl sm:text-3xl font-black uppercase tracking-tight text-center">Practice Assessment</h2><p className="text-[#3e2723]/60 font-bold text-sm sm:text-base max-w-sm italic text-center">Solve 'Deduction 1' in Practice mode to unlock the final quiz.</p></div>) : (
            <div className="relative z-10 w-full text-center py-2 px-4">
                <div className="mb-4 flex items-center justify-center gap-2"><span className="bg-[#3e2723] text-white px-5 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest">Verification • Q{activeQuestionIndex + 1}</span></div>
                <h2 className="text-[#3e2723] text-xl sm:text-2xl font-black uppercase mb-10 tracking-tight text-center px-4 leading-tight">{String(MISSION.questions[activeQuestionIndex]?.q || "")}</h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 sm:gap-6 w-full max-w-4xl mx-auto mb-8">{MISSION.questions[activeQuestionIndex]?.options.map((option, idx) => {
                    const isSel = selectedOption === idx; const btnClass = isSel && isCorrect ? 'bg-green-600 border-green-800 text-white shadow-lg' : isSel && isError ? 'bg-red-500 border-red-700 text-white animate-shake' : 'bg-white border-slate-200 text-[#3e2723] hover:bg-slate-50';
                    return <button key={idx} onClick={() => handleAnswerSelect(idx)} className={`group relative p-6 rounded-[1.5rem] border-b-8 font-black text-sm sm:text-lg transition-all ${btnClass}`}>{String(option)}{isSel && isCorrect && <CheckCircle2 className="absolute top-3 right-3 opacity-40" size={16} />}</button>;
                })}</div>
                <AnimatePresence>{showQuestionSol && <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 bg-sky-50 border-l-8 border-sky-500 rounded-2xl text-left shadow-xl max-w-2xl mx-auto mb-8"><h4 className="flex items-center gap-2 text-sky-800 font-black uppercase text-xs mb-2"><Info size={16} /> Logic Evidence</h4><p className="text-sky-900 font-bold italic">"{String(MISSION.questions[activeQuestionIndex]?.sol || "")}"</p></motion.div>}</AnimatePresence>
                <button onClick={() => setShowQuestionSol(!showQuestionSol)} className="text-[#8d6e63] font-black uppercase text-xs flex items-center gap-2 mx-auto hover:text-black transition-colors underline decoration-dotted"><Search size={14} /> View Logical Evidence</button>
            </div>
          )}
        </div>
      </div>
      <div className="w-full max-w-xl px-4 pb-24 flex flex-col sm:flex-row gap-4 relative z-10"><button onClick={() => setSessionCompleted(true)} disabled={!isArrangementCorrect} className={`flex-1 p-6 rounded-3xl font-black uppercase text-[12px] border-b-8 shadow-2xl transition-all flex items-center justify-center gap-3 ${isArrangementCorrect ? 'bg-white text-[#3e2723] border-[#3e2723] opacity-100 hover:scale-105 shadow-xl' : 'bg-gray-200 text-gray-400 border-gray-300 opacity-50 cursor-not-allowed shadow-inner'}`}><Trophy size={20} /> Finish Lab</button><button onClick={() => { if(activeQuestionIndex < 1) setActiveQuestionIndex(p=>p+1); else setSessionCompleted(true); }} disabled={!isArrangementCorrect || sessionCompleted} className={`flex-1 p-6 rounded-3xl font-black uppercase text-[12px] border-b-8 shadow-2xl transition-all flex items-center justify-center gap-3 bg-[#8d6e63] text-white border-[#5d4037]`}>Next Challenge <ChevronRight size={20} /></button></div>
      <AnimatePresence>
        {sessionCompleted && <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 bg-black/60 backdrop-blur-md">
            <div className="w-full max-w-2xl bg-[#e6dccb] p-8 sm:p-14 rounded-[4rem] border-8 border-[#3e2723] text-center shadow-2xl relative overflow-hidden"><div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} /><div className="relative z-10 flex flex-col items-center text-center"><div className="w-28 h-28 sm:w-36 sm:h-36 bg-[#3e2723] rounded-full flex items-center justify-center text-amber-400 mb-8 shadow-2xl border-4 border-white"><Trophy size={72} className="animate-bounce" /></div><h1 className="text-4xl sm:text-6xl font-black text-[#3e2723] uppercase mb-6 tracking-tighter">Lab Complete!</h1><p className="text-[#3e2723] text-lg sm:text-2xl leading-relaxed font-black mb-12 max-w-md mx-auto px-4 text-center">"You successfully applied 3-Dimensional Logic to solve the family mystery. You are now a master of complex scenario elimination!"</p><button onClick={() => window.location.reload()} className="relative z-10 px-12 sm:px-16 py-6 sm:py-8 bg-[#3e2723] text-[#e6dccb] rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-xl border-b-8 border-black hover:scale-105 active:translate-y-2 transition-all">Restart Session</button></div></div>
          </motion.div>}
      </AnimatePresence>
    </div>
  );
}