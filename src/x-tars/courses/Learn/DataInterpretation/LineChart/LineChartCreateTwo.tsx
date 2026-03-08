import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  RotateCcw,
  Trophy,
  X,
  BookOpen,
  Zap,
  Compass,
  Info,
  TrendingUp,
  Table as TableIcon,
  CheckCircle,
  AlertTriangle,
  FileText,
  Eye,
  MousePointer2,
  ArrowRight
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// SUB-COMPONENTS
// ==========================================

function HeaderSection({ onBack, title, appMode, setAppMode, onReset }) {
  return (
    <header className="w-full shrink-0 p-3 sm:p-4 sticky top-0 z-[100] bg-[#e6dccb]/95 border-b border-black/10 shadow-sm backdrop-blur-sm">
      <div className="w-full max-w-7xl mx-auto bg-[#2a1a16] px-4 py-3 rounded-2xl border-b-[3px] sm:border-b-4 border-black/40 shadow-xl flex justify-between items-center text-white gap-3 transition-all">
        <div className="flex flex-col items-start leading-tight">
          <button onClick={onBack} className="flex items-center gap-1.5 text-[#a88a6d] font-black uppercase hover:text-white transition-all text-[10px] sm:text-[11px] mb-0.5">
            <ChevronLeft size={14} strokeWidth={3} /> Dashboard
          </button>
          <span className="text-white font-black uppercase text-[15px] sm:text-[18px] truncate max-w-[150px] sm:max-w-none leading-none tracking-wide">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2 sm:gap-3">
          <div className="flex bg-black/50 p-1 rounded-xl border border-white/10 shadow-inner">
            <button onClick={() => setAppMode('concept')} className={`px-3 sm:px-4 py-1.5 rounded-lg text-[12px] sm:text-[14px] font-black uppercase transition-all duration-300 ${appMode === 'concept' ? 'bg-yellow-400 text-black shadow-md scale-105' : 'text-[#a88a6d] hover:text-white'}`}>Concept</button>
            <button onClick={() => setAppMode('practice')} className={`px-3 sm:px-4 py-1.5 rounded-lg text-[12px] sm:text-[14px] font-black uppercase transition-all duration-300 ${appMode === 'practice' ? 'bg-orange-500 text-white shadow-md scale-105' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
          </div>
          <button onClick={onReset} className="p-2 sm:p-2.5 bg-rose-600 hover:bg-rose-500 rounded-xl border-b-[3px] border-rose-900 text-white active:scale-95 transition-all shadow-md">
            <RotateCcw size={18} strokeWidth={2.5} />
          </button>
        </div>
      </div>
    </header>
  );
}

// ==========================================
// DATA & CONFIG
// ==========================================

const SCENARIOS = {
  concept: {
    coreDefinition: {
        title: "Concept: Creating a Line Chart",
        text: "Line charts connect dots over time to clearly visualize changes.\n\n• The Table provides exact measurements.\n• Drag each point on the chart UP or DOWN to match the values in the table!"
    },
    table: {
      title: "Daily Temperature",
      xLabels: ["8 AM", "12 PM", "4 PM"],
      values: [15, 30, 20],
      yMin: 0, yMax: 40, yTickCount: 5, snapStep: 5,
      xLabelTitle: "Time of Day", yLabelTitle: "Temp (°C)"
    }
  },
  practice: [
    {
      title: "Exam Marks",
      text: "A student took 3 tests. Drag the points to chart their progress!",
      xLabels: ["Test 1", "Test 2", "Test 3"],
      values: [60, 90, 80],
      yMin: 40, yMax: 100, yTickCount: 4, snapStep: 10,
      xLabelTitle: "Exams", yLabelTitle: "Marks"
    },
    {
      title: "Plant Height",
      text: "Track the growth of a bean plant over 3 weeks.",
      xLabels: ["Wk 1", "Wk 2", "Wk 3"],
      values: [10, 20, 30],
      yMin: 0, yMax: 40, yTickCount: 5, snapStep: 5,
      xLabelTitle: "Weeks", yLabelTitle: "Height (cm)"
    },
    {
      title: "Lemonade Sales",
      text: "Plot how many cups of lemonade were sold each day.",
      xLabels: ["Mon", "Wed", "Fri"],
      values: [20, 10, 50],
      yMin: 0, yMax: 60, yTickCount: 4, snapStep: 10,
      xLabelTitle: "Days", yLabelTitle: "Sales"
    },
    {
      title: "Patient Fever",
      text: "Track a patient's temperature over 3 days to see if the fever is breaking.",
      xLabels: ["Day 1", "Day 2", "Day 3"],
      values: [102, 98, 100],
      yMin: 96, yMax: 104, yTickCount: 5, snapStep: 1, 
      xLabelTitle: "Days", yLabelTitle: "Fever (°F)"
    },
    {
      title: "Monthly Savings",
      text: "Plot the total amount of money saved each month.",
      xLabels: ["Jan", "Feb", "Mar"],
      values: [10, 40, 50],
      yMin: 0, yMax: 50, yTickCount: 6, snapStep: 10,
      xLabelTitle: "Months", yLabelTitle: "Savings ($)"
    }
  ]
};

export default function LabContent() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept');
  
  // Concept State
  const [buildStep, setBuildStep] = useState(0);
  
  // Practice State
  const [practiceStep, setPracticeStep] = useState(0);
  const [lessonFinished, setLessonFinished] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);

  // Chart Interaction State
  const [userValues, setUserValues] = useState([]);
  const [draggingIdx, setDraggingIdx] = useState(null);
  const [actionError, setActionError] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const svgRef = useRef(null);
  const containerRef = useRef(null);

  const currentData = appMode === 'concept' ? SCENARIOS.concept.table : SCENARIOS.practice[practiceStep];
  const { yMin, yMax, yTickCount, snapStep, xLabels, values: targetValues, title: tableTitle, xLabelTitle, yLabelTitle } = currentData;

  // Initialize values when phase or step changes
  useEffect(() => {
      // Start all points at the minimum Y value so user has to drag them
      setUserValues(new Array(xLabels.length).fill(yMin));
      setActionError("");
      setShowSuccess(false);
      if (appMode === 'concept') setBuildStep(0);
  }, [appMode, practiceStep, yMin, xLabels.length]);

  function handleReset(overrideMode = appMode) {
    setBuildStep(0);
    setPracticeStep(0);
    setLessonFinished(false);
    setShowFinishModal(false);
    setDraggingIdx(null);
    
    const dataConf = overrideMode === 'concept' ? SCENARIOS.concept.table : SCENARIOS.practice[0];
    setUserValues(new Array(dataConf.xLabels.length).fill(dataConf.yMin));
    setActionError("");
    setShowSuccess(false);
  }

  function handleSetMode(mode) {
    setAppMode(mode);
    handleReset(mode);
  }

  // ==========================================
  // DRAG INTERACTION LOGIC
  // ==========================================

  const chartWidth = 340;
  const chartHeight = 240;
  const padLeft = 55;
  const padBottom = 35;
  const padTop = 20;
  const padRight = 25;
  const drawWidth = chartWidth - padLeft - padRight;
  const drawHeight = chartHeight - padTop - padBottom;
  const originX = padLeft;
  const originY = chartHeight - padBottom;

  const handlePointerMove = (e) => {
      if (draggingIdx === null || !svgRef.current) return;
      
      // Prevent scrolling while dragging on mobile
      if(e.cancelable) e.preventDefault();

      const rect = svgRef.current.getBoundingClientRect();
      const clientY = e.clientY || (e.touches && e.touches[0].clientY);
      if (!clientY) return;

      const yPx = clientY - rect.top;
      const viewBoxRatio = chartHeight / rect.height; 
      const svgY = yPx * viewBoxRatio;

      let val = yMin + ((originY - svgY) / drawHeight) * (yMax - yMin);
      val = Math.round(val / snapStep) * snapStep;
      val = Math.max(yMin, Math.min(yMax, val));

      setUserValues(prev => {
          const next = [...prev];
          next[draggingIdx] = val;
          return next;
      });
  };

  const handlePointerUp = () => {
      setDraggingIdx(null);
  };

  // Calculate coordinates for rendering
  const points = userValues.map((val, idx) => {
      const x = originX + ((idx + 1) * (drawWidth / (xLabels.length + 1)));
      const yRatio = (val - yMin) / (yMax - yMin);
      const y = originY - (yRatio * drawHeight);
      return { x, y, val, label: xLabels[idx], idx };
  });

  const pathD = points.length > 0 ? `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}` : "";

  // Validation
  const validateChart = () => {
      if (appMode === 'concept') {
          // Check only the current step's point
          if (userValues[buildStep] === targetValues[buildStep]) {
              setActionError("");
              if (buildStep < xLabels.length - 1) {
                  setBuildStep(prev => prev + 1);
              } else {
                  setShowSuccess(true);
              }
          } else {
              setActionError(`Incorrect! Drag the point for ${xLabels[buildStep]} to ${targetValues[buildStep]}.`);
          }
      } else {
          // Practice mode validates all points at once
          const isValid = userValues.every((v, i) => v === targetValues[i]);
          if (isValid) {
              setShowSuccess(true);
              setActionError("");
          } else {
              setActionError("Some points don't match the table! Keep trying.");
          }
      }
  };

  const handleNextPractice = () => {
      if (practiceStep < SCENARIOS.practice.length - 1) {
          setPracticeStep(prev => prev + 1);
      } else {
          setLessonFinished(true);
          setShowFinishModal(true);
      }
  };

  const isChartLocked = showSuccess || lessonFinished;
  const topTag = appMode === 'concept' ? "CONSTRUCTION ZONE" : "PRACTICE DRILL";

  // Determine which points are draggable based on mode and step
  const getIsDraggable = (idx) => {
      if (isChartLocked) return false;
      if (appMode === 'concept') return idx === buildStep;
      return true; // Practice mode allows dragging all points
  };

  // Render Left Panel Content dynamically
  const renderLeftPanel = () => {
    const infoText = appMode === 'concept' ? SCENARIOS.concept.coreDefinition.text : currentData.text;
    
    return (
        <div className="flex flex-col gap-4 h-full">
            {/* Definition Box */}
            <div className={`bg-[#2a1a16]/95 p-5 rounded-[1.5rem] border-2 border-black/50 shadow-lg flex gap-4 items-start text-white shrink-0`}>
                <div className="bg-yellow-400 p-2.5 rounded-xl text-black shrink-0 shadow-md mt-1">
                    <FileText size={24} strokeWidth={2.5}/>
                </div>
                <div className="flex flex-col gap-1">
                    <span className="text-yellow-400 font-black uppercase text-[12px] sm:text-[13px] tracking-widest leading-none mb-1">
                        {appMode === 'concept' ? SCENARIOS.concept.coreDefinition.title : `Drill ${practiceStep + 1}/${SCENARIOS.practice.length}: ${currentData.title}`}
                    </span>
                    <p className="text-[14px] sm:text-[15px] font-medium leading-relaxed tracking-tight text-white/90 whitespace-pre-line">
                        {infoText}
                    </p>
                </div>
            </div>
        </div>
    );
};

  return (
    <div className="min-h-screen w-full bg-[#e6dccb] flex flex-col select-none font-sans text-[14px]" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none fixed bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Chart Builder Lab" : "Data Plotting Drills"} appMode={appMode} setAppMode={handleSetMode} onReset={() => handleReset(appMode)} />

      <main className="flex-1 flex flex-col items-center gap-6 sm:gap-8 lg:gap-10 p-3 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto relative z-10 overflow-hidden">
        
        {/* Div 1: Chart Construction & Visualization (TOP AREA) */}
        <div className="w-full flex-1 flex flex-col gap-3 min-h-[420px] lg:min-h-[480px]">
          <motion.div className="w-full h-full bg-[#2a1a16] p-4 sm:p-6 lg:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 sm:border-4 border-black shadow-2xl flex flex-col justify-between items-center">
            
            <div className="w-full flex flex-col items-center gap-3 h-full max-w-[600px]">
                <div className="flex items-center justify-center gap-2 opacity-40 text-[13px] sm:text-[15px] font-black uppercase tracking-widest leading-none mb-1 text-white">
                    {appMode === 'practice' && <><span className="text-yellow-500 mr-2 bg-yellow-500/20 px-3 py-1 rounded-md">Drill {practiceStep + 1}</span></>}
                    {isChartLocked ? <><Eye size={16} /> Chart Interpreter</> : <><TrendingUp size={16} /> Chart Builder Area</>}
                </div>

                <div className="bg-white/10 px-4 py-1.5 rounded-full text-white/80 font-black uppercase tracking-widest text-[11px] sm:text-[12px] mb-2 flex items-center gap-2">
                    {isChartLocked ? <Eye size={14} className="text-green-400"/> : <MousePointer2 size={14} className="text-yellow-400 animate-bounce"/>}
                    {isChartLocked ? "Analysis Complete" : (appMode === 'concept' ? `Plot Point ${buildStep + 1}` : "Drag Points to Plot Data")}
                </div>
                
                {/* SVG Chart Area */}
                <div 
                    className={`relative bg-[#3e2723] rounded-2xl border-[4px] ${showSuccess ? 'border-green-400 shadow-[0_0_30px_rgba(74,222,128,0.4)]' : 'border-yellow-500/30'} shadow-inner w-full flex-1 flex flex-col items-center justify-center transition-all duration-500 touch-none`}
                    onPointerMove={handlePointerMove}
                    onPointerUp={handlePointerUp}
                    onPointerLeave={handlePointerUp}
                >
                    <svg ref={svgRef} viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full drop-shadow-md overflow-visible">
                        
                        {/* Grid Lines (Faint) */}
                        {Array.from({length: yTickCount}).map((_, i) => {
                            const y = originY - (i * (drawHeight / (yTickCount - 1)));
                            return <line key={`grid-${i}`} x1={originX} y1={y} x2={chartWidth - padRight} y2={y} stroke="white" strokeWidth="1" opacity="0.1" />;
                        })}

                        {/* Axes */}
                        <g>
                            <line x1={originX} y1={originY} x2={chartWidth - padRight + 10} y2={originY} stroke="#a88a6d" strokeWidth="3" strokeLinecap="round" />
                            <line x1={originX} y1={originY} x2={originX} y2={padTop - 10} stroke="#a88a6d" strokeWidth="3" strokeLinecap="round" />
                            
                            {/* Y Labels */}
                            {Array.from({length: yTickCount}).map((_, i) => {
                                const val = yMin + i * ((yMax - yMin)/(yTickCount - 1));
                                const y = originY - (i * (drawHeight / (yTickCount - 1)));
                                return <text key={`yl-${i}`} x={originX - 10} y={y} fill="#a88a6d" fontSize="10" fontWeight="bold" textAnchor="end" dominantBaseline="central">{val}</text>;
                            })}

                            {/* X Labels */}
                            {points.map((p, i) => (
                                <text key={`xl-${i}`} x={p.x} y={originY + 18} fill="#a88a6d" fontSize="10" fontWeight="bold" textAnchor="middle">{p.label}</text>
                            ))}

                            {/* Axis Titles */}
                            <text x={originX + drawWidth/2} y={chartHeight - 4} fill="white" fontSize="11" fontWeight="bold" textAnchor="middle" opacity="0.6" tracking="wider">{xLabelTitle.toUpperCase()}</text>
                            <text x={14} y={originY - drawHeight/2} fill="white" fontSize="11" fontWeight="bold" textAnchor="middle" transform={`rotate(-90 14 ${originY - drawHeight/2})`} opacity="0.6" tracking="wider">{yLabelTitle.toUpperCase()}</text>
                        </g>

                        {/* Visual Dotted Guidelines when dragging */}
                        {draggingIdx !== null && (
                            <g opacity="0.5">
                                <line x1={originX} y1={points[draggingIdx].y} x2={points[draggingIdx].x} y2={points[draggingIdx].y} stroke="#fde047" strokeWidth="1.5" strokeDasharray="4 4" />
                                <line x1={points[draggingIdx].x} y1={originY} x2={points[draggingIdx].x} y2={points[draggingIdx].y} stroke="#fde047" strokeWidth="1.5" strokeDasharray="4 4" />
                            </g>
                        )}

                        {/* The Connecting Line (Only draw up to the buildStep in Concept Mode) */}
                        <path 
                            d={pathD} 
                            fill="none" 
                            stroke={showSuccess ? "#4ade80" : "#fbbf24"} 
                            strokeWidth="4" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            style={{ 
                                filter: showSuccess ? "drop-shadow(0px 0px 8px rgba(74,222,128,0.8))" : "drop-shadow(0px 4px 4px rgba(0,0,0,0.5))", 
                                transition: "stroke 0.3s" 
                            }}
                        />

                        {/* Draggable Points */}
                        {points.map((p, i) => {
                            const isDraggable = getIsDraggable(i);
                            const isCompleted = appMode === 'concept' && i < buildStep;
                            let pointColor = "#f8fafc";
                            
                            if (showSuccess || isCompleted) pointColor = "#4ade80"; // Green if fully done or past step
                            else if (draggingIdx === i) pointColor = "#fde047";     // Yellow if currently dragging
                            else if (appMode === 'concept' && i > buildStep) pointColor = "#52525b"; // Dim future points

                            return (
                                <g key={`p-${i}`} className={isDraggable ? "cursor-ns-resize" : ""}>
                                    {/* Invisible larger target area for easier touch dragging */}
                                    {isDraggable && (
                                    <circle 
                                        cx={p.x} cy={p.y} r="25" 
                                        fill="transparent" 
                                        onPointerDown={(e) => {
                                            setDraggingIdx(i);
                                            handlePointerMove(e);
                                        }} 
                                    />
                                    )}
                                    
                                    {/* Visible Point */}
                                    <circle 
                                        cx={p.x} 
                                        cy={p.y} 
                                        r={draggingIdx === i ? 8 : 6} 
                                        fill={pointColor} 
                                        stroke="#3e2723" 
                                        strokeWidth="2" 
                                        style={{ filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.5))", pointerEvents: "none", transition: "r 0.1s, fill 0.2s" }} 
                                    />
                                    
                                    {/* Value Label Floating Above Point */}
                                    {(appMode === 'practice' || i <= buildStep) && (
                                        <text 
                                            x={p.x} y={p.y - 15} 
                                            fill={pointColor} 
                                            fontSize="12" 
                                            fontWeight="bold" 
                                            textAnchor="middle"
                                            style={{ pointerEvents: "none", transition: "fill 0.2s" }}
                                        >
                                            {p.val}
                                        </text>
                                    )}
                                </g>
                            )
                        })}
                    </svg>
                </div>

                {/* Validation Actions directly below chart */}
                {!isChartLocked && (
                    <div className="flex flex-col w-full max-w-sm gap-2 mt-2">
                        <button 
                            onClick={validateChart}
                            className={`w-full py-3.5 rounded-full font-black uppercase text-[13px] sm:text-[14px] tracking-widest transition-all shadow-xl bg-indigo-600 text-white hover:bg-indigo-500 active:scale-95`}
                        >
                            Check Chart
                        </button>
                        {actionError && (
                            <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-2 text-rose-400 font-bold text-[12px] sm:text-[13px] bg-rose-500/10 py-2 rounded-lg border border-rose-500/20 px-2 text-center">
                                <AlertTriangle size={14} className="shrink-0" /> {actionError}
                            </motion.div>
                        )}
                    </div>
                )}
            </div>
          </motion.div>
        </div>

        {/* Div 2: Guidance Panels (BOTTOM 2-COLUMN AREA) */}
        <div className="w-full bg-[#3e2723] p-4 sm:p-6 lg:p-8 rounded-[2rem] border-t-4 border-black shadow-2xl relative z-[70] flex flex-col gap-2 shrink-0 overflow-hidden min-h-[350px] lg:min-h-[400px]">
          <div className="absolute inset-0 opacity-[0.25] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-4 sm:gap-6 lg:gap-8 h-full relative z-10">
            
            {/* Left Column: Logic Problem */}
            <div className="flex flex-col gap-4 h-full">
                {renderLeftPanel()}
            </div>

            {/* Right Column: Teacher Guidance Panel & Data Table */}
            <div className="flex flex-col bg-[#2a1a16]/95 p-5 sm:p-6 lg:p-8 rounded-[1.5rem] border-2 border-black/50 shadow-lg h-full min-h-[300px] relative overflow-hidden">
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 sm:pr-2 pb-2">
                    <AnimatePresence mode='wait'>
                        
                        {/* STATE 1: Active Building / Instructions */}
                        {!showSuccess && (
                            <motion.div key="build-instructions" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex flex-col h-full gap-4">
                                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-1">
                                    <span className="text-yellow-400 font-black text-[12px] sm:text-[13px] uppercase tracking-widest flex items-center gap-2">
                                        <Compass size={16}/> Interactive Task
                                    </span>
                                    {appMode === 'concept' && (
                                        <span className="text-white/40 font-bold text-[11px] tracking-widest uppercase">Step {buildStep + 1} of {xLabels.length}</span>
                                    )}
                                </div>
                                
                                <div className="bg-yellow-400/10 border border-yellow-400/40 p-4 rounded-xl shadow-inner flex gap-3 items-start">
                                    <MousePointer2 size={22} className="text-yellow-400 shrink-0 mt-0.5" />
                                    <p className="text-yellow-400 text-[13px] sm:text-[14px] italic leading-relaxed font-bold">
                                        {appMode === 'concept' 
                                            ? `Drag the circular point for ${xLabels[buildStep]} up to exactly ${targetValues[buildStep]} ${yLabelTitle.split(' ')[0]}.`
                                            : "Drag all the points on the chart to match the target data below."}
                                    </p>
                                </div>

                                {/* Target Data Table (Moved to Right Column) */}
                                <div className="flex flex-col bg-[#2a1a16]/95 border-[3px] border-yellow-500/30 rounded-xl overflow-hidden shadow-lg mt-1 mb-2">
                                    <div className="bg-yellow-500/20 px-3 py-2.5 flex items-center justify-between border-b border-yellow-500/30">
                                        <div className="flex items-center gap-2">
                                            <TableIcon size={14} className="text-yellow-400"/>
                                            <span className="text-yellow-400 font-black text-[12px] uppercase tracking-wider">Target Data</span>
                                        </div>
                                    </div>
                                    <div className="flex flex-col">
                                        <div className="grid grid-cols-2 bg-black/40 text-white/50 text-[11px] font-black uppercase tracking-wider px-4 py-1.5">
                                            <span>{xLabelTitle}</span>
                                            <span className="text-right">{yLabelTitle}</span>
                                        </div>
                                        {xLabels.map((lbl, i) => {
                                            // Highlight the row we are currently working on in Concept mode
                                            const isActiveRow = appMode === 'concept' && i === buildStep;
                                            return (
                                                <div key={i} className={`grid grid-cols-2 text-white text-[13px] font-bold px-4 py-2 border-t border-white/5 transition-colors ${isActiveRow ? 'bg-yellow-500/20' : 'hover:bg-white/5'}`}>
                                                    <span className={isActiveRow ? "text-yellow-400" : "text-indigo-300"}>{lbl}</span>
                                                    <span className={`text-right ${isActiveRow ? "text-yellow-400" : ""}`}>{targetValues[i]}</span>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* STATE 2: Success Action Required */}
                        {showSuccess && (
                             <motion.div key="success-panel" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col h-full gap-4 justify-center">
                                 <div className="flex flex-col items-center justify-center gap-3">
                                    <CheckCircle size={56} className="text-green-400" />
                                    <p className="text-white font-black uppercase tracking-widest text-[18px] sm:text-[20px]">Perfectly Plotted!</p>
                                    <p className="text-white/70 text-center px-4 leading-relaxed font-medium">
                                        {appMode === 'concept' 
                                            ? "The green line perfectly connects the data points, giving us a clear visual trend over time!"
                                            : "You've successfully mapped the data to the chart."}
                                    </p>
                                 </div>

                                 <button 
                                    onClick={appMode === 'concept' ? () => handleSetMode('practice') : handleNextPractice}
                                    className="w-full mt-4 py-4 rounded-full font-black uppercase text-[14px] tracking-widest transition-all shadow-[0_0_20px_rgba(74,222,128,0.4)] bg-green-600 text-white hover:bg-green-500 active:scale-95 flex justify-center items-center gap-2"
                                 >
                                    {appMode === 'concept' ? 'Navigate to Practice Mode' : (practiceStep < SCENARIOS.practice.length - 1 ? 'Next Drill' : 'Finish Lab')}
                                    <ArrowRight size={18} />
                                 </button>
                             </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>

          </div>
        </div>

      </main>

      {/* Custom Alert Overlay for Finishing the Laboratory */}
      <AnimatePresence>
        {showFinishModal && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
               <motion.div 
                   initial={{ scale: 0.9, y: 20 }} 
                   animate={{ scale: 1, y: 0 }} 
                   exit={{ scale: 0.9, y: 20 }}
                   className="bg-[#2a1a16] border-4 border-yellow-500/50 shadow-2xl p-6 sm:p-8 rounded-3xl flex flex-col items-center gap-5 w-full max-w-md text-center relative"
               >
                  <div className="bg-yellow-500/20 p-4 rounded-full">
                      <Trophy size={64} className="text-yellow-400 animate-bounce" />
                  </div>
                  <div className="flex flex-col gap-2">
                      <h2 className="text-white text-2xl sm:text-3xl font-black uppercase tracking-widest">
                          Lab Complete!
                      </h2>
                      <p className="text-white/80 text-sm sm:text-base font-medium px-4">
                          You have successfully mastered creating Line Charts!
                      </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                     <button onClick={() => { handleReset('concept'); setShowFinishModal(false); }} className="w-full py-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black uppercase text-[14px] tracking-wider transition-all shadow-lg active:scale-95">Restart</button>
                     <button onClick={() => setShowFinishModal(false)} className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-black uppercase text-[14px] tracking-wider transition-all shadow-lg active:scale-95 shadow-[0_0_15px_rgba(34,197,94,0.3)]">Close</button>
                  </div>
                  <button onClick={() => setShowFinishModal(false)} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
                      <X size={24} />
                  </button>
               </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); border-radius: 10px; margin: 0 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #a88a6d; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4b595; }
      `}} />
    </div>
  );
}

// export default function App() { return ( <Router> <LabContent /> </Router> ); }