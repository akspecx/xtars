import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  ChevronRight,
  X as CloseIcon,
  Trophy,
  CheckCircle2,
  Trash2,
  Play,
  RotateCcw,
  Maximize2,
  Layers,
  XCircle,
  Square,
  Info,
  Check,
  Search,
  GraduationCap,
  Target,
  Sparkles,
  MousePointer2,
  Briefcase,
  Palette,
  User,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  Shuffle,
  ArrowLeftRight
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// DATA CONFIGURATIONS
// ==========================================
const PEOPLE_DATA = {
  pA: { initial: 'A', color: 'from-rose-400 to-rose-600', hex: 0xfb7185 },
  pB: { initial: 'B', color: 'from-sky-400 to-sky-600', hex: 0x38bdf8 },
  pC: { initial: 'C', color: 'from-amber-400 to-amber-600', hex: 0xfbbf24 },
  pD: { initial: 'D', color: 'from-emerald-400 to-emerald-600', hex: 0x34d399 },
  pE: { initial: 'E', color: 'from-purple-400 to-purple-600', hex: 0xc084fc },
  pF: { initial: 'F', color: 'from-pink-400 to-pink-600', hex: 0xf472b6 },
};

const JOB_DATA = {
  jDoctor: { initial: 'Dr', name: 'Doctor' },
  jLawyer: { initial: 'La', name: 'Lawyer' },
  jArtist: { initial: 'Ar', name: 'Artist' },
  jEngineer: { initial: 'En', name: 'Engineer' },
  jManager: { initial: 'Ma', name: 'Manager' },
  jTeacher: { initial: 'Te', name: 'Teacher' },
};

const COLOR_DATA = {
  cRed: { initial: 'Re', hex: 0xdc2626, bg: 'bg-red-600' },
  cBlue: { initial: 'Bl', hex: 0x2563eb, bg: 'bg-blue-600' },
  cGreen: { initial: 'Gr', hex: 0x16a34a, bg: 'bg-green-600' },
  cPink: { initial: 'Pi', hex: 0xf472b6, bg: 'bg-pink-400' },
  cYellow: { initial: 'Ye', hex: 0xfacc15, bg: 'bg-yellow-400' },
  cViolet: { initial: 'Vi', hex: 0x7c3aed, bg: 'bg-violet-600' },
};

const SAMPLES = [
  {
    text: "The Lawyer sits at the 2nd position.",
    isAnchor: true,
    reason: "Yes! This is an anchor. It tells us exactly ONE spot for the Lawyer. There is no other place they can go.",
    elements: { people: [], jobs: ['jLawyer'], colors: [] },
    demoSet1: [{ slot: 1, jobId: 'jLawyer' }],
    demoSet2: null 
  },
  {
    text: "A sits at the 5th position.",
    isAnchor: true,
    reason: "Yes! We know exactly where A sits. Position 5 is the only choice.",
    elements: { people: ['pA'], jobs: [], colors: [] },
    demoSet1: [{ slot: 4, personId: 'pA' }],
    demoSet2: null
  },
  {
    text: "B sits next to the person who likes Green.",
    isAnchor: false,
    reason: "No. This is not an anchor. They could sit in many different spots. Because we aren't 100% sure which spot is right, we can't call this an anchor.",
    elements: { people: ['pB'], jobs: [], colors: ['cGreen'] },
    demoSet1: [{ slot: 2, personId: 'pB' }, { slot: 3, colorId: 'cGreen' }],
    demoSet2: [{ slot: 0, personId: 'pB' }, { slot: 1, colorId: 'cGreen' }]
  },
  {
    text: "C sits between the Manager and the person who likes Red.",
    isAnchor: false,
    reason: "No. 'Between' can happen in many places. They could be in the first three spots, or the last three spots. This clue doesn't fix them to one position.",
    elements: { people: ['pC'], jobs: ['jManager'], colors: ['cRed'] },
    demoSet1: [{ slot: 1, jobId: 'jManager' }, { slot: 2, personId: 'pC' }, { slot: 3, colorId: 'cRed' }],
    demoSet2: [{ slot: 3, jobId: 'jManager' }, { slot: 4, personId: 'pC' }, { slot: 5, colorId: 'cRed' }]
  }
];

// ==========================================
// 3D VISUALIZATION
// ==========================================
function ThreeDVisualization({ isOpen, onClose, placements }) {
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
      scene.background = new THREE.Color(0x0a0a0a);
      const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
      camera.position.set(0, 10, 18);
      camera.lookAt(0, 2, 0);
      const renderer = new THREE.WebGLRenderer({ antialias: true });
      renderer.setSize(width, height);
      mountRef.current.appendChild(renderer.domElement);
      
      scene.add(new THREE.AmbientLight(0xffffff, 1.2));
      const floor = new THREE.Mesh(new THREE.PlaneGeometry(60, 30), new THREE.MeshPhongMaterial({ color: 0x111111 }));
      floor.rotation.x = -Math.PI / 2;
      scene.add(floor);

      placements.forEach((p, idx) => {
        const xPos = (idx - 2.5) * 8;
        const student = p.personId ? PEOPLE_DATA[p.personId] : { hex: 0x222222, initial: (idx+1).toString() };
        const job = p.jobId ? JOB_DATA[p.jobId] : null;
        const colorAttr = p.colorId ? COLOR_DATA[p.colorId] : null;

        const base = new THREE.Mesh(new THREE.CylinderGeometry(2, 2, 0.5, 32), new THREE.MeshPhongMaterial({ color: student.hex || 0x222222 }));
        base.position.set(xPos, 0.25, 0);
        scene.add(base);

        if (job) {
            const jobDisc = new THREE.Mesh(new THREE.CylinderGeometry(1.5, 1.5, 0.4, 32), new THREE.MeshPhongMaterial({ color: 0xd4af37 }));
            jobDisc.position.set(xPos, 1.2, 0);
            scene.add(jobDisc);
        }

        if (colorAttr) {
            const sphere = new THREE.Mesh(new THREE.SphereGeometry(1, 32, 32), new THREE.MeshPhongMaterial({ color: colorAttr.hex }));
            sphere.position.set(xPos, 2.5, 0);
            scene.add(sphere);
        }

        const labelCanvas = document.createElement('canvas');
        const ctx = labelCanvas.getContext('2d');
        labelCanvas.width = 128; labelCanvas.height = 128;
        ctx.fillStyle = 'white'; ctx.font = 'bold 80px Noto Sans';
        ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
        ctx.fillText(p.personId ? student.initial : (idx + 1).toString(), 64, 64);
        const texture = new THREE.CanvasTexture(labelCanvas);
        const sprite = new THREE.Sprite(new THREE.SpriteMaterial({ map: texture }));
        sprite.scale.set(3, 3, 3);
        sprite.position.set(xPos, 4.5, 0);
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
  }, [isOpen, placements]);

  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center p-2 sm:p-4 bg-black/95 backdrop-blur-md">
      <div className="relative w-full max-w-7xl bg-[#050505] rounded-[2rem] sm:rounded-[3rem] border border-white/10 overflow-hidden h-[90vh] flex flex-col shadow-2xl">
        <div className="p-4 sm:p-6 flex justify-between items-center bg-white/5 text-white border-b border-white/5">
          <h2 className="text-sm sm:text-xl font-black uppercase flex items-center gap-2 sm:gap-3"><Sparkles className="text-yellow-400" size={20} /> Perspective 3D</h2>
          <button onClick={onClose} className="p-1 hover:bg-white/10 rounded-full text-white transition-colors"><CloseIcon size={24} /></button>
        </div>
        <div className="flex-1 relative cursor-move" ref={mountRef} />
      </div>
    </div>
  );
}

// ==========================================
// MAIN LAB COMPONENT
// ==========================================
export default function LabContent() {
  const navigate = useNavigate();
  const slotRefs = useRef({});
  const [appMode, setAppMode] = useState('concept');
  const [stepIndex, setStepIndex] = useState(0);
  
  const [placements, setPlacements] = useState(Array(6).fill(null).map(() => ({ personId: null, jobId: null, colorId: null })));
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [isVerdictVisible, setIsVerdictVisible] = useState(false);
  const [is3DModalOpen, setIs3DModalOpen] = useState(false);

  const [userDecision, setUserDecision] = useState(null); 
  const [showDecisionButtons, setShowDecisionButtons] = useState(false);
  const [cycleIndex, setCycleIndex] = useState(0); 

  const currentClue = SAMPLES[stepIndex];
  const isAtLastSample = stepIndex === SAMPLES.length - 1;

  const resetBoard = useCallback(() => {
    setPlacements(Array(6).fill(null).map(() => ({ personId: null, jobId: null, colorId: null })));
    setIsEvaluating(false);
    setIsVerdictVisible(false);
    setCycleIndex(0);
    setUserDecision(null);
    setShowDecisionButtons(false);
  }, []);

  const switchMode = (mode) => {
    setAppMode(mode);
    setStepIndex(0);
    resetBoard();
  };

  useEffect(() => {
    let interval;
    if (isEvaluating && !currentClue.isAnchor) {
        setCycleIndex(1);
        interval = setInterval(() => {
            setCycleIndex(prev => (prev + 1) % 4);
        }, 1200);
        const timer = setTimeout(() => setIsVerdictVisible(true), 4000);
        return () => { clearInterval(interval); clearTimeout(timer); };
    } else if (isEvaluating) {
        setCycleIndex(1);
        setIsVerdictVisible(true);
    }
  }, [isEvaluating, currentClue]);

  const handleNextStep = () => {
    if (stepIndex < SAMPLES.length - 1) {
      setStepIndex(p => p + 1);
      resetBoard();
    }
  };

  const handleTheoryStart = () => {
    setIsEvaluating(true);
  };

  const handlePracticeEvaluate = () => {
    setShowDecisionButtons(true);
  };

  const handleUserDecision = (decision) => {
    setUserDecision(decision);
    setShowDecisionButtons(false);
    setIsEvaluating(true);
  };

  const handleDragEnd = (event, info, id, type) => {
    if (appMode !== 'practice' || isEvaluating || showDecisionButtons) return;
    const dropPoint = { x: info.point.x, y: info.point.y };
    let minDistance = 1000;
    let targetIdx = null;

    Array(6).fill(0).forEach((_, idx) => {
        const ref = slotRefs.current[`slot-${idx}`];
        if (!ref) return;
        const rect = ref.getBoundingClientRect();
        const centerX = rect.left + window.scrollX + rect.width / 2;
        const centerY = rect.top + window.scrollY + rect.height / 2;
        const dist = Math.sqrt(Math.pow(dropPoint.x - centerX, 2) + Math.pow(dropPoint.y - centerY, 2));
        if (dist < 60 && dist < minDistance) {
            minDistance = dist;
            targetIdx = idx;
        }
    });

    if (targetIdx !== null) {
        setPlacements(prev => {
            const next = [...prev];
            next[targetIdx] = { ...next[targetIdx], [type]: id };
            return next;
        });
    }
  };

  const renderSlot = (idx) => {
    let data = placements[idx];
    let isGhost = false;

    if (isEvaluating) {
        if (currentClue.isAnchor) {
            const item = currentClue.demoSet1.find(d => d.slot === idx);
            if (item) data = item;
        } else {
            if (cycleIndex === 1) {
                const item = currentClue.demoSet1.find(d => d.slot === idx);
                data = item || { personId: null, jobId: null, colorId: null };
            } else if (cycleIndex === 3) {
                const item = currentClue.demoSet2.find(d => d.slot === idx);
                data = item || { personId: null, jobId: null, colorId: null };
                isGhost = true;
            } else {
                data = { personId: null, jobId: null, colorId: null };
            }
        }
    }

    const person = data?.personId ? PEOPLE_DATA[data.personId] : null;
    const job = data?.jobId ? JOB_DATA[data.jobId] : null;
    const colorAttr = data?.colorId ? COLOR_DATA[data.colorId] : null;

    return (
      <div 
        key={idx}
        ref={el => slotRefs.current[`slot-${idx}`] = el}
        className={`relative flex flex-col items-center gap-2 sm:gap-3 p-2 sm:p-3 rounded-xl sm:rounded-2xl transition-all border-2 bg-black/20 border-white/5 overflow-visible min-w-[80px] sm:min-w-[100px]`}
      >
        <span className="text-[7px] sm:text-[9px] font-black text-white/30 uppercase tracking-widest text-center">Pos {idx + 1}</span>
        
        {/* Identity Slot */}
        <div className={`relative w-10 h-10 sm:w-16 sm:h-16 rounded-full border-2 flex items-center justify-center transition-all ${person ? `bg-gradient-to-br ${person.color} border-white shadow-lg` : 'border-dashed border-white/10'}`}>
           {!person && <User size={14} className="text-white/10" />}
           {person && <span className="text-white font-black text-base sm:text-xl">{person.initial}</span>}
           <div className="absolute -top-1 -left-1 bg-black/80 rounded-full p-0.5 border border-white/10">
                <User size={6} sm={8} className="text-white/40" />
           </div>
           <AnimatePresence>
             {isGhost && person && (
                 <motion.div initial={{ opacity: 0, scale: 0.5 }} animate={{ opacity: 0.4, scale: 1.1 }} exit={{ opacity: 0 }} className={`absolute inset-0 rounded-full bg-gradient-to-br ${person.color} border-2 border-dashed border-white flex items-center justify-center`}>
                    <span className="text-white font-black text-sm sm:text-base">{person.initial}</span>
                 </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Job Slot */}
        <div className={`relative w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl border-2 flex items-center justify-center transition-all ${job ? `bg-amber-600/30 border-amber-400 shadow-md` : 'border-dashed border-white/5'}`}>
           {!job && <Briefcase size={12} className="text-white/10" />}
           {job && <span className="text-[8px] sm:text-[10px] font-black text-white uppercase">{String(job.initial)}</span>}
           <div className="absolute -top-1 -left-1 bg-black/80 rounded-full p-0.5 border border-white/10">
                <Briefcase size={6} sm={8} className="text-white/40" />
           </div>
           <AnimatePresence>
             {isGhost && job && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} className="absolute inset-0 rounded-lg sm:rounded-xl bg-amber-600 border-2 border-dashed border-white flex items-center justify-center">
                    <span className="text-white text-[8px] sm:text-[10px] font-black">{job.initial}</span>
                 </motion.div>
             )}
           </AnimatePresence>
        </div>

        {/* Color Slot */}
        <div className={`relative w-8 h-8 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl border-2 flex items-center justify-center transition-all ${colorAttr ? `${colorAttr.bg} border-white shadow-md` : 'border-dashed border-white/5'}`}>
           {!colorAttr && <Palette size={12} className="text-white/10" />}
           {colorAttr && <span className="text-[8px] sm:text-[10px] font-black text-white uppercase">{String(colorAttr.initial)}</span>}
           <div className="absolute -top-1 -left-1 bg-black/80 rounded-full p-0.5 border border-white/10">
                <Palette size={6} sm={8} className="text-white/40" />
           </div>
           <AnimatePresence>
             {isGhost && colorAttr && (
                 <motion.div initial={{ opacity: 0 }} animate={{ opacity: 0.4 }} exit={{ opacity: 0 }} className={`absolute inset-0 rounded-lg sm:rounded-xl ${colorAttr.bg} border-2 border-dashed border-white flex items-center justify-center`}>
                    <span className="text-white text-[8px] sm:text-[10px] font-black">{colorAttr.initial}</span>
                 </motion.div>
             )}
           </AnimatePresence>
        </div>
        
        {isGhost && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="absolute -bottom-6 flex flex-col items-center">
                 <ArrowLeftRight size={10} className="text-cyan-400 animate-pulse" />
                 <span className="text-[6px] font-black text-cyan-400 uppercase">Ambiguity</span>
            </motion.div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#e6dccb] flex flex-col items-center no-scrollbar overflow-x-hidden font-sans relative pb-20">
      <div className="absolute inset-0 opacity-[0.4]" style={{ backgroundImage: `url('https://www.transparenttextures.com/patterns/wood-pattern.png')` }} />
      
      <header className="w-full max-w-[1500px] shrink-0 px-2 sm:px-4 pt-4 sm:pt-6 relative z-20">
        <div className="w-full bg-[#2a1a16] p-3 sm:p-4 rounded-[1.5rem] sm:rounded-[2rem] border-b-4 sm:border-b-8 border-black/40 shadow-2xl flex flex-col lg:flex-row justify-between items-center gap-3 sm:gap-4 text-white text-center lg:text-left">
          <div className="flex flex-col">
            <button onClick={() => navigate('/')} className="flex items-center justify-center lg:justify-start gap-1.5 text-[#a88a6d] font-black uppercase text-[8px] sm:text-[10px] mb-1 hover:text-white transition-all"><ChevronLeft size={14} /> Dashboard</button>
            <h1 className="text-white text-lg sm:text-xl font-black uppercase tracking-tighter text-[#e6dccb]">Foundations Lab</h1>
          </div>
          <div className="flex bg-black/30 p-1 rounded-xl sm:rounded-2xl border border-white/10 w-full lg:w-auto">
            <button onClick={() => switchMode('concept')} className={`flex-1 lg:flex-none px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase transition-all ${appMode === 'concept' ? 'bg-yellow-400 text-black shadow-lg' : 'text-[#a88a6d] hover:text-white'}`}>Theory</button>
            <button onClick={() => switchMode('practice')} className={`flex-1 lg:flex-none px-4 sm:px-6 py-2 rounded-lg sm:rounded-xl text-[8px] sm:text-[10px] font-black uppercase transition-all ${appMode === 'practice' ? 'bg-[#8d6e63] text-white shadow-inner' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
          </div>
        </div>
      </header>

      <div className="w-full max-w-[1400px] px-2 sm:px-4 py-4 sm:py-6 relative z-10">
        
        <div className="bg-[#2a1a16] p-1 rounded-[1.5rem] sm:rounded-[2.5rem] shadow-2xl border-4 border-black/40 relative overflow-visible">
          <div className="relative z-10 bg-[#3e2723] pt-6 sm:pt-8 pb-10 sm:pb-12 px-2 sm:px-6 rounded-[1.2rem] sm:rounded-[2rem] flex flex-col items-center min-h-[700px] sm:min-h-[850px] shadow-inner">
            
            {/* Clue Card */}
            <div className="w-full max-w-4xl bg-black/60 backdrop-blur-md border border-white/10 p-6 sm:p-10 rounded-[2rem] sm:rounded-[3rem] shadow-2xl mb-8 sm:mb-12 relative overflow-hidden">
               <div className="absolute top-0 left-0 w-full h-1 bg-yellow-400 opacity-20" />
               <div className="flex items-center gap-3 sm:gap-4 mb-4 sm:mb-6">
                  <span className="bg-yellow-400 text-black px-3 sm:px-4 py-1 rounded-full text-[8px] sm:text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"><Shuffle size={12}/> {appMode === 'concept' ? 'Theory' : 'Practice'} {stepIndex + 1}</span>
                  <div className="h-px flex-1 bg-white/10" />
               </div>
               
               <h2 className="text-white text-xl sm:text-4xl font-black italic tracking-tight mb-6 sm:mb-10 text-center leading-tight px-2">
                  "{currentClue.text}"
               </h2>

               <div className="flex flex-col items-center gap-4">
                  {appMode === 'concept' ? (
                      !isEvaluating ? (
                        <button onClick={handleTheoryStart} className="w-full sm:w-auto bg-cyan-500 text-white px-6 sm:px-10 py-3 sm:py-5 rounded-xl sm:rounded-2xl font-black uppercase text-[10px] sm:text-xs tracking-widest hover:scale-105 transition-all shadow-xl flex items-center justify-center gap-2 sm:gap-3 border-b-4 border-cyan-800">
                            <Play size={16} /> Demonstrate Logic
                        </button>
                      ) : null
                  ) : (
                      !showDecisionButtons && !isEvaluating && (
                        <button onClick={handlePracticeEvaluate} className="w-full sm:w-auto bg-green-600 text-white px-8 sm:px-12 py-3 sm:py-5 rounded-xl sm:rounded-2xl font-black uppercase text-[10px] sm:text-xs tracking-widest hover:scale-105 transition-all shadow-xl border-b-4 border-green-800 flex items-center justify-center gap-2 sm:gap-3">
                            <CheckCircle2 size={16} /> I have placed them
                        </button>
                      )
                  )}

                  <AnimatePresence>
                    {showDecisionButtons && (
                        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center gap-4 bg-white/5 p-4 sm:p-6 rounded-[1.5rem] sm:rounded-[2rem] border border-white/10 shadow-2xl backdrop-blur-md w-full sm:w-auto">
                            <p className="text-yellow-400 font-black uppercase text-[8px] sm:text-xs text-center">Is this the ONLY spot these items can go?</p>
                            <div className="flex gap-2 sm:gap-4 w-full">
                                <button onClick={() => handleUserDecision('yes')} className="flex-1 sm:flex-none bg-white text-black px-4 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl font-black uppercase text-[9px] sm:text-xs hover:bg-slate-100 transition-all border-b-4 border-slate-300">Yes, Fixed</button>
                                <button onClick={() => handleUserDecision('no')} className="flex-1 sm:flex-none bg-black text-white px-4 sm:px-8 py-2 sm:py-3 rounded-lg sm:rounded-xl font-black uppercase text-[9px] sm:text-xs hover:bg-slate-900 transition-all border-b-4 border-slate-800">No, Multiple</button>
                            </div>
                        </motion.div>
                    )}
                  </AnimatePresence>
               </div>

               <AnimatePresence>
                  {isVerdictVisible && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className={`mt-6 sm:mt-10 p-4 sm:p-8 rounded-[1.5rem] sm:rounded-3xl border-l-4 sm:border-l-8 shadow-2xl ${
                          currentClue.isAnchor ? 'bg-green-900/40 border-green-500' : 'bg-rose-900/40 border-rose-500'
                      }`}>
                          <div className="flex items-center gap-2 sm:gap-4 mb-3 sm:mb-4">
                              <h4 className="text-white font-black uppercase text-[10px] sm:text-sm tracking-widest flex items-center gap-1.5 sm:gap-2">
                                  {currentClue.isAnchor ? <CheckCircle2 size={16} className="text-green-400" /> : <XCircle size={16} className="text-rose-400" />}
                                  {currentClue.isAnchor ? "VERDICT: ANCHOR" : "VERDICT: NOT AN ANCHOR"}
                              </h4>
                          </div>
                          
                          {appMode === 'practice' && (
                              <div className="mb-2 sm:mb-4">
                                  {userDecision === (currentClue.isAnchor ? 'yes' : 'no') ? (
                                      <span className="text-green-400 font-black uppercase text-[8px] sm:text-[10px] tracking-widest">Correct Analysis!</span>
                                  ) : (
                                      <span className="text-rose-400 font-black uppercase text-[8px] sm:text-[10px] tracking-widest">Logic Error. See the movements.</span>
                                  )}
                              </div>
                          )}

                          <p className="text-white italic font-bold text-[11px] sm:text-sm leading-relaxed mb-4 sm:mb-6">
                              {currentClue.reason}
                          </p>

                          {(!isAtLastSample || appMode === 'practice') ? (
                              <button onClick={handleNextStep} className="w-full sm:w-auto bg-white text-black px-6 sm:px-10 py-2 sm:py-3 rounded-full font-black uppercase text-[9px] sm:text-[10px] hover:scale-105 transition-all flex items-center justify-center gap-2 shadow-xl">
                                  Next Step <ArrowRight size={14} />
                              </button>
                          ) : (
                              <button onClick={() => switchMode('practice')} className="w-full sm:w-auto bg-yellow-400 text-black px-6 sm:px-10 py-3 sm:py-4 rounded-full font-black uppercase text-[10px] sm:text-xs hover:scale-105 transition-all flex items-center justify-center gap-2 sm:gap-3 shadow-xl border-b-4 border-yellow-800">
                                  <Trophy size={16} sm={18} /> Theory Done! Practice Mode
                              </button>
                          )}
                      </motion.div>
                  )}
               </AnimatePresence>
            </div>

            {/* Placement Workspace - Scrollable on mobile */}
            <div className="w-full overflow-x-auto no-scrollbar pb-6 px-4">
              <div className="flex justify-start sm:justify-center gap-3 sm:gap-6 min-w-max mx-auto">
                 {Array(6).fill(0).map((_, i) => renderSlot(i))}
              </div>
            </div>

            {/* Tray Section */}
            <div className="w-full flex flex-col items-center gap-6 mt-4 px-2">
                <div className="bg-black/30 backdrop-blur-sm p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[3rem] border border-white/10 w-full max-w-5xl shadow-2xl relative">
                    <span className="absolute -top-3 left-4 sm:left-8 bg-black px-3 sm:px-4 py-1 rounded-full text-[7px] sm:text-[9px] font-black text-yellow-400 uppercase tracking-widest border border-white/10 flex items-center gap-1.5 sm:gap-2 whitespace-nowrap">
                        <Palette size={12}/> Variable Tray
                    </span>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
                        {/* People Tray */}
                        <div className="flex flex-col items-center gap-3 sm:gap-4">
                            <span className="text-[8px] sm:text-[10px] font-black text-white/20 uppercase tracking-widest flex items-center gap-1.5"><User size={12}/> People</span>
                            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                                {currentClue.elements.people.length > 0 ? currentClue.elements.people.map(id => (
                                    <motion.div key={id} drag={appMode === 'practice' && !isEvaluating && !showDecisionButtons} dragMomentum={false} dragSnapToOrigin onDragEnd={(e, info) => handleDragEnd(e, info, id, 'personId')} className={`w-10 h-10 sm:w-14 sm:h-14 rounded-full border-2 flex items-center justify-center bg-gradient-to-br ${PEOPLE_DATA[id].color} cursor-grab shadow-xl text-xs sm:text-base`}><span className="text-white font-black">{PEOPLE_DATA[id].initial}</span></motion.div>
                                )) : <div className="h-10 sm:h-14 flex items-center text-white/5 uppercase font-black text-[8px] sm:text-[10px]">None</div>}
                            </div>
                        </div>

                        {/* Jobs Tray */}
                        <div className="flex flex-col items-center gap-3 sm:gap-4">
                            <span className="text-[8px] sm:text-[10px] font-black text-white/20 uppercase tracking-widest flex items-center gap-1.5"><Briefcase size={12}/> Jobs</span>
                            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                                {currentClue.elements.jobs.length > 0 ? currentClue.elements.jobs.map(id => (
                                    <motion.div key={id} drag={appMode === 'practice' && !isEvaluating && !showDecisionButtons} dragMomentum={false} dragSnapToOrigin onDragEnd={(e, info) => handleDragEnd(e, info, id, 'jobId')} className="w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl border-2 border-amber-400/30 flex items-center justify-center bg-amber-900/40 cursor-grab shadow-xl text-[9px] sm:text-xs"><span className="text-white font-black uppercase">{JOB_DATA[id].initial}</span></motion.div>
                                )) : <div className="h-10 sm:h-14 flex items-center text-white/5 uppercase font-black text-[8px] sm:text-[10px]">None</div>}
                            </div>
                        </div>

                        {/* Colors Tray */}
                        <div className="flex flex-col items-center gap-3 sm:gap-4">
                            <span className="text-[8px] sm:text-[10px] font-black text-white/20 uppercase tracking-widest flex items-center gap-1.5"><Palette size={12}/> Colors</span>
                            <div className="flex flex-wrap justify-center gap-2 sm:gap-3">
                                {currentClue.elements.colors.length > 0 ? currentClue.elements.colors.map(id => (
                                    <motion.div key={id} drag={appMode === 'practice' && !isEvaluating && !showDecisionButtons} dragMomentum={false} dragSnapToOrigin onDragEnd={(e, info) => handleDragEnd(e, info, id, 'colorId')} className={`w-10 h-10 sm:w-14 sm:h-14 rounded-lg sm:rounded-xl border-2 border-white/20 flex items-center justify-center ${COLOR_DATA[id].bg} cursor-grab shadow-xl text-[9px] sm:text-xs`}><span className="text-white font-black uppercase">{COLOR_DATA[id].initial}</span></motion.div>
                                )) : <div className="h-10 sm:h-14 flex items-center text-white/5 uppercase font-black text-[8px] sm:text-[10px]">None</div>}
                            </div>
                        </div>
                    </div>

                    <div className="bg-amber-400/10 border border-amber-400/30 p-3 sm:p-4 rounded-[1rem] sm:rounded-2xl flex items-start gap-3 sm:gap-4">
                        <div className="bg-amber-400 p-1.5 sm:p-2 rounded-lg text-black shrink-0">
                            <Info size={16} />
                        </div>
                        <div>
                            <h4 className="text-amber-400 font-black uppercase text-[8px] sm:text-[10px] tracking-widest mb-1">Deduction Rule: Anchor Check</h4>
                            <p className="text-white/70 text-[9px] sm:text-[11px] font-bold leading-relaxed">
                                An instruction is an <span className="text-amber-400">Anchor</span> only if it gives you the <span className="underline decoration-amber-500">exactly fixed spot</span>. If the items can move to different spots, it is NOT an anchor.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <button onClick={() => setIs3DModalOpen(true)} className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-sky-500 text-white p-3 sm:p-4 rounded-2xl sm:rounded-3xl shadow-xl flex items-center gap-2 sm:gap-3 font-black uppercase text-[9px] sm:text-xs hover:scale-110 active:scale-95 transition-all border-b-4 border-sky-800"><Maximize2 size={16} sm={18} /><span>3D View</span></button>
          </div>
        </div>
      </div>

      <ThreeDVisualization isOpen={is3DModalOpen} onClose={() => setIs3DModalOpen(false)} placements={placements} />
      
      <div className="mt-8 flex flex-col items-center text-center opacity-40 px-4">
          <GraduationCap size={40} sm={48} className="text-[#3e2723] mb-2" />
          <h3 className="text-[#3e2723] font-black uppercase text-[10px] sm:text-xs">Analytical Foundation Lab</h3>
          <p className="text-[#3e2723] text-[8px] sm:text-[9px] font-bold max-w-xs leading-relaxed italic">"Identify fixed truths to build a stable logical structure."</p>
      </div>
    </div>
  );
}