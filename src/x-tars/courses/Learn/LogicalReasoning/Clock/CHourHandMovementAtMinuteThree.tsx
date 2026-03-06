import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  RotateCcw,
  Trophy,
  X,
  BookOpen,
  HelpCircle,
  Zap,
  ArrowUpRight,
  Compass,
  Info,
  MousePointer2,
  Eye,
  FileText,
  Clock,
  CircleDot,
  ArrowLeft
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

const LOGIC_DATA = {
  concept: {
    question: "A clock is started at noon. By 10 minutes past 5, the hour hand has turned through how many degrees?",
    clues: [
      { id: 1, step: 0, concept: "Start Time", explanation: "At 'noon' (12:00), both hands point straight up at the 12.", text: "Identify the starting position of the Hour Hand." },
      { id: 2, step: 1, concept: "Full Hours", explanation: "From 12:00 to 5:00, exactly 5 full hours have passed.", text: "Calculate the rotation for the full hours passed." },
      { id: 3, step: 2, concept: "Hour Rotation", explanation: "5 hours × 30° per hour = 150°.", text: "Calculate the degrees covered by the full hours." },
      { id: 4, step: 3, concept: "Minute Rate", explanation: "In 60 minutes, the hour hand moves 30°. So in 1 minute, it moves 0.5° (30 ÷ 60).", text: "Find the hour hand's rotation speed per minute." },
      { id: 5, step: 4, concept: "Minute Rotation", explanation: "10 extra minutes × 0.5° per minute = 5°.", text: "Calculate the tiny extra rotation caused by the 10 minutes." },
      { id: 6, step: 5, concept: "Total Rotation", explanation: "Total Rotation = (Hours × 30°) + (Minutes × 0.5°).", text: "Add the hour rotation and the minute rotation together." }
    ],
    teachingSteps: [
      { 
        id: "step-1",
        selectionPrompt: "Step 1: Start Time Position. The clock starts at exactly 'noon' (12:00). Where does the HOUR hand point at this time?",
        options: ["At 3", "At 6", "At 12"],
        correct: 2,
        feedback: [
          "That would be 3 o'clock.",
          "That would be 6 o'clock.",
          "Correct! At noon, the hour hand points straight up at the 12."
        ],
        why: "Noon is exactly 12:00, so the hour hand is anchored at 12.",
        instruction: "Click on the number '12' on the clock face to place the starting Hour Hand.",
        requiredActionState: 'start_hour_placed'
      },
      { 
        id: "step-2",
        selectionPrompt: "Step 2: Full Hours Passed. The time is now 10 minutes past 5. Let's ignore the minutes for a second. How many FULL hours have passed since 12:00?",
        options: ["4 hours", "5 hours", "6 hours"],
        correct: 1,
        feedback: [
          "Count from 12: 1, 2, 3, 4, 5.",
          "Exactly! 5 full hours have passed.",
          "6 hours would take you to 6:00."
        ],
        why: "We first calculate the massive chunk of rotation caused by the full hours.",
        instruction: "Click the 'Calculate 5 Hours' button to see how far the hour hand rotated just to reach the 5.",
        requiredActionState: 'hours_calculated'
      },
      { 
        id: "step-3",
        selectionPrompt: "Step 3: Hour Rotation Math. We know the hour hand rotates 30° every full hour gap. What is the rotation for just those 5 full hours?",
        options: ["120°", "150°", "180°"],
        correct: 1,
        feedback: [
          "120° is 4 hours (4 × 30).",
          "Correct! 5 hours × 30° = 150°. The hand rotates 150° to reach the 5.",
          "180° is 6 hours (6 × 30)."
        ],
        why: "5 hours × 30 degrees per hour = 150 degrees.",
        instruction: "Click the 'Show Extra Minutes' button to reveal the final part of the time: the 10 minutes.",
        requiredActionState: 'minutes_revealed'
      },
      { 
        id: "step-4",
        selectionPrompt: "Step 4: Degrees Per Minute. The hour hand doesn't stay still between hours! It takes 60 minutes for the hour hand to move across one 30° gap. How many degrees does the hour hand move in just 1 minute?",
        options: ["0.5°", "1°", "2°"],
        correct: 0,
        feedback: [
          "Correct! 30° ÷ 60 minutes = 0.5°. The hour hand moves exactly half a degree every minute.",
          "If it moved 1° per minute, it would cover 60° in an hour, which is too fast!",
          "If it moved 2° per minute, it would cover 120° in an hour!"
        ],
        why: "Since 1 full hour (30 degrees) takes 60 minutes, the minute rate is 30/60 = 0.5 degrees per minute.",
        instruction: "Click the 'Acknowledge Rate' button to use this math for our problem.",
        requiredActionState: 'minute_rate_understood'
      },
      { 
        id: "step-5",
        selectionPrompt: "Step 5: Minute Rotation Math. We now know the hour hand creeps forward 0.5° for every minute that passes. For the extra 10 minutes, how many extra degrees did the hour hand rotate?",
        options: ["2°", "5°", "10°"],
        correct: 1,
        feedback: [
          "That would only be 4 minutes (4 × 0.5).",
          "Correct! 10 minutes × 0.5° per minute = 5° of extra rotation.",
          "That would happen if the hand moved 1 degree per minute, but it moves 0.5 degrees!"
        ],
        why: "10 minutes × 0.5 degrees per minute = 5 extra degrees of rotation.",
        instruction: "Click the 'Add 5°' button to inch the hour hand slightly past the 5.",
        requiredActionState: 'minute_rotation_added'
      },
      { 
        id: "step-6",
        selectionPrompt: "Step 6: Total Rotation. We have 150° from the full hours, and 5° from the extra minutes. What is the total rotation from 12:00 to 5:10?",
        options: ["150°", "155°", "160°"],
        correct: 1,
        feedback: [
          "You forgot to add the extra 5 degrees!",
          "Exactly! 150° + 5° = 155°. You have successfully calculated the exact angle!",
          "Check your addition: 150 + 5."
        ],
        why: "Total Rotation = (Hours × 30°) + (Minutes × 0.5°). 150° + 5° = 155°.",
        instruction: "Click the 'Draw Final Angle' button below the clock to complete the proof!",
        requiredActionState: 'final_angle_drawn'
      }
    ],
    postQuiz: [
      { 
        q: "Why does the hour hand move when minutes pass?", 
        options: ["It doesn't.", "Because the clock is broken.", "Because it must continuously travel the 30° gap toward the next hour over the course of 60 minutes."], 
        correct: 2, 
        explanation: "The hour hand doesn't just snap to numbers; it slowly travels the 30° space between them as the 60 minutes tick by."
      },
      { 
        q: "At a rate of 0.5° per minute, how many degrees does the hour hand rotate in 20 minutes?", 
        options: ["5°", "10°", "20°"], 
        correct: 1, 
        explanation: "20 minutes × 0.5° per minute = 10°."
      }
    ]
  },
  practice: {
    question: "A clock is started at noon. By 20 minutes past 3, the hour hand has turned through how many degrees?",
    clues: [
      { id: 1, step: 0, concept: "Full Hours", explanation: "From 12:00 to 3:00 is 3 hours.", text: "Calculate the rotation for the 3 full hours." },
      { id: 2, step: 0, concept: "Extra Minutes", explanation: "There are 20 extra minutes.", text: "Calculate the tiny rotation caused by the 20 minutes." },
      { id: 3, step: 0, concept: "Total", explanation: "Add the hour and minute rotations together.", text: "Combine both values for the final answer." }
    ],
    quiz: [
      { 
        q: "How many degrees does the hour hand rotate for the 3 full hours?", 
        options: ["60°", "90°", "120°"], 
        correct: 1, 
        explanation: "3 hours × 30° per hour = 90°."
      },
      { 
        q: "At a rate of 0.5° per minute, how many extra degrees does the hour hand rotate for the 20 minutes?", 
        options: ["5°", "10°", "20°"], 
        correct: 1, 
        explanation: "20 minutes × 0.5° per minute = 10°."
      },
      { 
        q: "What is the total rotation of the hour hand at 3:20?", 
        options: ["90°", "100°", "110°"], 
        correct: 1, 
        explanation: "90° (from hours) + 10° (from minutes) = 100° total rotation."
      }
    ]
  }
};

// --- Math Helpers for SVG Clock ---
const polarToCartesian = (centerX, centerY, radius, angleInDegrees) => {
  const angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
  return {
    x: centerX + (radius * Math.cos(angleInRadians)),
    y: centerY + (radius * Math.sin(angleInRadians))
  };
};

const describeArc = (x, y, radius, startAngle, endAngle) => {
  const start = polarToCartesian(x, y, radius, endAngle);
  const end = polarToCartesian(x, y, radius, startAngle);
  const largeArcFlag = endAngle - startAngle <= 180 ? "0" : "1";
  return [
    "M", x, y, 
    "L", start.x, start.y, 
    "A", radius, radius, 0, largeArcFlag, 0, end.x, end.y,
    "Z"
  ].join(" ");
};


function LabContent() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept');
  const [conceptPhase, setConceptPhase] = useState('selecting'); 
  
  const [activeStep, setActiveStep] = useState(0);
  const [conceptSelectedOption, setConceptSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState({ type: null, msg: "", reason: "" });
  const [actionError, setActionError] = useState("");
  const [activeConceptInfo, setActiveConceptInfo] = useState(null);
  const [stepStatus, setStepStatus] = useState('idle');
  
  // Clock Interaction State
  const [clockState, setClockState] = useState('idle'); // idle -> start_hour_placed -> hours_calculated -> minutes_revealed -> minute_rate_understood -> minute_rotation_added -> final_angle_drawn

  const [quizMode, setQuizMode] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizSelection, setQuizSelection] = useState(null);
  const [quizFeedbackMode, setQuizFeedbackMode] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);

  const containerRef = useRef(null);

  const currentScenData = appMode === 'concept' ? LOGIC_DATA.concept : LOGIC_DATA.practice;
  const currentQuizSet = appMode === 'practice' ? LOGIC_DATA.practice.quiz : LOGIC_DATA.concept.postQuiz;

  function handleReset(overrideMode = appMode) {
    setActiveStep(0);
    setConceptSelectedOption(null);
    setFeedback({ type: null, msg: "", reason: "" });
    setActionError("");
    setActiveConceptInfo(null);
    setClockState('idle');
    setConceptPhase('selecting');
    setQuizMode(false);
    setQuizStep(0);
    setQuizSelection(null);
    setQuizFeedbackMode(false);
    setLessonFinished(false);
    setShowFinishModal(false);
    setStepStatus('idle');
  }

  function handleSetMode(mode) {
    setAppMode(mode);
    handleReset(mode);
  }

  // --- Clock Interaction Handlers ---
  const handleClockNumberClick = (num) => {
      if (appMode === 'practice' || quizMode || lessonFinished) return;
      if (feedback.type !== 'success') {
          setActionError("Please answer the logic question before interacting with the clock.");
          return;
      }

      const expectedAction = LOGIC_DATA.concept.teachingSteps[activeStep].requiredActionState;

      if (expectedAction === 'start_hour_placed' && num === 12) {
          setClockState('start_hour_placed');
          setActionError("");
      } else if (expectedAction === 'start_hour_placed' && num !== 12) {
          setActionError("Incorrect. Noon means the hour hand starts at 12.");
      } 
  };

  const handleClockButton = (action) => {
    if (appMode === 'practice' || quizMode || lessonFinished) return;
    if (feedback.type !== 'success') {
        setActionError("Please answer the logic question before interacting with the clock.");
        return;
    }
    const expectedAction = LOGIC_DATA.concept.teachingSteps[activeStep].requiredActionState;
    
    if (action === expectedAction) {
        setClockState(action);
        setActionError("");
    } else {
        setActionError("That is not the correct action for this step.");
    }
  };

  function handleSelectionQuiz(idx) {
    const step = currentScenData.teachingSteps[activeStep];
    if (!step || !step.feedback) return;
    setConceptSelectedOption(idx);
    const fbReason = step.feedback[idx];
    if (idx === step.correct) {
      setFeedback({ type: 'success', msg: "Logic Applied!", reason: String(fbReason) });
      setActionError("");
    } else {
      setFeedback({ type: 'error', msg: "Try Again", reason: String(fbReason) });
      setActionError("");
    }
  }

  function handleQuizSelection(idx) {
    setQuizSelection(idx);
    setQuizFeedbackMode(true);
  }

  function nextStep() {
    if (activeStep < LOGIC_DATA.concept.teachingSteps.length - 1) {
      setActiveStep(activeStep + 1);
      setConceptSelectedOption(null);
      setFeedback({ type: null, msg: "", reason: "" });
      setActionError("");
    } else {
      setConceptPhase('finalCheck');
    }
  }

  const isQuizPassed = feedback.type === 'success';
  const isBoardValid = appMode === 'concept' && clockState === LOGIC_DATA.concept.teachingSteps[activeStep]?.requiredActionState;

  // Render SVG Clock Elements
  const renderClockNumbers = () => {
      const numbers = [];
      for (let i = 1; i <= 12; i++) {
          const pos = polarToCartesian(150, 150, 120, i * 30);
          numbers.push(
              <g key={`num-${i}`} 
                 onClick={() => handleClockNumberClick(i)}
                 className={`cursor-pointer transition-all duration-300 ${appMode === 'concept' && isQuizPassed && !isBoardValid ? 'hover:opacity-70' : ''}`}
              >
                  <circle cx={pos.x} cy={pos.y} r="16" fill="#2a1a16" stroke="#a88a6d" strokeWidth="2" className="transition-all hover:fill-[#a88a6d] hover:stroke-white"/>
                  <text x={pos.x} y={pos.y} fill="white" fontSize="16" fontWeight="bold" textAnchor="middle" dominantBaseline="central">{i}</text>
              </g>
          );
      }
      return numbers;
  };

  // Determine current rotation angle for the hour hand based on state
  let currentRotation = 0;
  if (appMode === 'concept') {
      if (clockState === 'start_hour_placed') currentRotation = 0;
      if (['hours_calculated', 'minutes_revealed', 'minute_rate_understood'].includes(clockState)) currentRotation = 150; // 5 hours * 30
      if (['minute_rotation_added', 'final_angle_drawn'].includes(clockState)) currentRotation = 155; // 150 + 5
  } else if (appMode === 'practice') {
      currentRotation = 100; // 3 hours (90) + 20 mins (10)
  }

  return (
    <div className="min-h-screen w-full bg-[#e6dccb] flex flex-col select-none font-sans text-[14px]" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none fixed bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Clock Minute Lab" : "Rotation Calculation"} appMode={appMode} setAppMode={handleSetMode} onReset={() => handleReset(appMode)} />

      <main className="flex-1 flex flex-col items-center gap-6 sm:gap-8 lg:gap-10 p-3 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto relative z-10 overflow-hidden">
        
        {/* Div 1: Clock Construction & Visualization */}
        <div className="w-full flex-1 flex flex-col gap-3 min-h-[400px] lg:min-h-[450px]">
          <motion.div className="w-full h-full bg-[#2a1a16] p-5 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 sm:border-4 border-black shadow-2xl flex flex-col justify-between items-center">
            
            <div className="w-full flex flex-col items-center gap-3 h-full">
                <div className="flex items-center justify-center gap-2 opacity-40 text-[13px] sm:text-[15px] font-black uppercase tracking-widest leading-none mb-2 text-white">
                    {quizMode ? <><Eye size={16} /> Question Simulation</> : <><Clock size={16} /> Construction Zone</>}
                </div>
                
                {/* SVG Clock Area */}
                <div className="relative bg-[#3e2723] rounded-full border-[8px] border-yellow-500/30 shadow-[inset_0_20px_50px_rgba(0,0,0,0.5),_0_10px_30px_rgba(0,0,0,0.5)] flex flex-col items-center justify-center w-[280px] h-[280px] sm:w-[340px] sm:h-[340px]">
                  
                  <svg viewBox="0 0 300 300" className="w-full h-full drop-shadow-2xl">
                      {/* Inner Clock Face */}
                      <circle cx="150" cy="150" r="140" fill="#3e2723" />
                      
                      {/* Wedges/Arcs Rendering */}
                      {(['hours_calculated', 'minutes_revealed', 'minute_rate_understood', 'minute_rotation_added', 'final_angle_drawn'].includes(clockState) || appMode === 'practice') && (
                          <g opacity="0.8">
                             {appMode === 'concept' && (
                                 <>
                                     <path d={describeArc(150, 150, 140, 0, 150)} fill="rgba(56, 189, 248, 0.2)" stroke="#38bdf8" strokeWidth="2" />
                                     {['minute_rotation_added', 'final_angle_drawn'].includes(clockState) && (
                                         <path d={describeArc(150, 150, 140, 150, 155)} fill="rgba(234, 179, 8, 0.8)" stroke="#eab308" strokeWidth="2" />
                                     )}
                                     {clockState === 'final_angle_drawn' && (
                                         <path d={describeArc(150, 150, 140, 0, 155)} fill="rgba(234, 179, 8, 0.3)" stroke="transparent" />
                                     )}
                                 </>
                             )}

                             {appMode === 'practice' && (
                                 <path d={describeArc(150, 150, 140, 0, 100)} fill="rgba(234, 179, 8, 0.3)" stroke="#eab308" strokeWidth="2" />
                             )}
                          </g>
                      )}

                      {/* Tick Marks */}
                      {Array.from({length: 60}).map((_, i) => {
                          const isHour = i % 5 === 0;
                          const posStart = polarToCartesian(150, 150, isHour ? 135 : 138, i * 6);
                          const posEnd = polarToCartesian(150, 150, 140, i * 6);
                          return <line key={i} x1={posStart.x} y1={posStart.y} x2={posEnd.x} y2={posEnd.y} stroke="white" strokeWidth={isHour ? 3 : 1} opacity={isHour ? 0.6 : 0.2} />;
                      })}

                      {/* Clickable Numbers */}
                      {renderClockNumbers()}

                      {/* Hands */}
                      {(clockState !== 'idle' || appMode === 'practice') && (
                          <g style={{ filter: "drop-shadow(2px 4px 6px rgba(0,0,0,0.5))" }}>
                              
                              {/* Minute Hand (Only shown in steps 3-6/practice to avoid cluttering start) */}
                              {((appMode === 'concept' && ['minutes_revealed', 'minute_rate_understood', 'minute_rotation_added', 'final_angle_drawn'].includes(clockState)) || appMode === 'practice') && (
                                  <line 
                                    x1="150" y1="150" 
                                    x2={polarToCartesian(150, 150, 100, appMode === 'practice' ? 120 : 60).x} 
                                    y2={polarToCartesian(150, 150, 100, appMode === 'practice' ? 120 : 60).y} 
                                    stroke="#f8fafc" strokeWidth="3" strokeLinecap="round" opacity="0.6"
                                  />
                              )}

                              {/* Start Hand Reference (12) */}
                              <line x1="150" y1="150" x2={polarToCartesian(150, 150, 80, 0).x} y2={polarToCartesian(150, 150, 80, 0).y} stroke="#f8fafc" strokeWidth="6" strokeLinecap="round" strokeDasharray="4 4" opacity="0.5" />

                              {/* Hour Hand (Dynamic) */}
                              <motion.line 
                                x1="150" y1="150" 
                                animate={{
                                    x2: polarToCartesian(150, 150, 80, currentRotation).x,
                                    y2: polarToCartesian(150, 150, 80, currentRotation).y
                                }}
                                transition={{ type: "spring", stiffness: 60, damping: 12 }}
                                stroke="#fbbf24" strokeWidth="6" strokeLinecap="round" 
                              />
                              
                              {/* Center Pin */}
                              <circle cx="150" cy="150" r="6" fill="#ef4444" />
                          </g>
                      )}

                      {/* Final Angle Text */}
                      {clockState === 'final_angle_drawn' && appMode === 'concept' && (
                          <text x="210" y="210" fill="#fde047" fontSize="24" fontWeight="black" textAnchor="middle" style={{ filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.8))" }}>155°</text>
                      )}
                      {appMode === 'practice' && lessonFinished && (
                          <text x="210" y="150" fill="#fde047" fontSize="24" fontWeight="black" textAnchor="middle" style={{ filter: "drop-shadow(1px 2px 2px rgba(0,0,0,0.8))" }}>100°</text>
                      )}
                  </svg>
                </div>

                {/* Contextual Action Buttons for Clock Steps */}
                {!quizMode && !lessonFinished && appMode === 'concept' && (
                    <div className="flex gap-3 mt-4 flex-wrap justify-center">
                        {activeStep === 1 && (
                            <button onClick={() => handleClockButton('hours_calculated')} className="px-6 py-2 rounded-full bg-indigo-600 text-white font-black uppercase text-[12px] shadow-lg hover:scale-105 active:scale-95 transition-all">Calculate 5 Hours</button>
                        )}
                        {activeStep === 2 && (
                            <button onClick={() => handleClockButton('minutes_revealed')} className="px-6 py-2 rounded-full bg-indigo-600 text-white font-black uppercase text-[12px] shadow-lg hover:scale-105 active:scale-95 transition-all">Show Extra Minutes</button>
                        )}
                        {activeStep === 3 && (
                            <button onClick={() => handleClockButton('minute_rate_understood')} className="px-6 py-2 rounded-full bg-emerald-600 text-white font-black uppercase text-[12px] shadow-lg hover:scale-105 active:scale-95 transition-all">Acknowledge Rate</button>
                        )}
                        {activeStep === 4 && (
                            <button onClick={() => handleClockButton('minute_rotation_added')} className="px-6 py-2 rounded-full bg-rose-600 text-white font-black uppercase text-[12px] shadow-lg hover:scale-105 active:scale-95 transition-all">Add 5°</button>
                        )}
                        {activeStep === 5 && (
                            <button onClick={() => handleClockButton('final_angle_drawn')} className="px-6 py-2 rounded-full bg-yellow-500 text-black font-black uppercase text-[12px] shadow-lg hover:scale-105 active:scale-95 transition-all">Draw Final Angle</button>
                        )}
                    </div>
                )}
            </div>
          </motion.div>
        </div>

        {/* Div 2: Guidance Panels (2-Column Layout with Wooden Theme) */}
        <div className="w-full bg-[#3e2723] p-4 sm:p-6 lg:p-8 rounded-[2rem] border-t-4 border-black shadow-2xl relative z-[70] flex flex-col gap-2 shrink-0 overflow-hidden min-h-[400px] lg:min-h-[450px]">
          <div className="absolute inset-0 opacity-[0.25] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

          <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1.8fr] gap-4 sm:gap-6 lg:gap-8 h-full relative z-10">
            
            {/* Left Column: Logic Problem & Dynamic Quiz */}
            <div className="flex flex-col gap-4 h-full">
                
                {/* The Logic Problem Box */}
                <div className={`bg-[#2a1a16]/95 p-5 sm:p-6 rounded-[1.5rem] border-2 border-black/50 shadow-lg flex gap-4 sm:gap-5 items-start text-white ${appMode === 'practice' && !quizMode ? 'flex-1' : ''}`}>
                    <div className="bg-yellow-400 p-2.5 rounded-xl text-black shrink-0 shadow-md mt-1">
                        <FileText size={26} strokeWidth={2.5}/>
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-yellow-400 font-black uppercase text-[12px] sm:text-[13px] tracking-widest leading-none mb-1">The Logic Problem</span>
                        <p className="text-[14px] sm:text-[16px] font-medium leading-relaxed tracking-tight text-white/90">
                            {appMode === 'concept' ? LOGIC_DATA.concept.question : LOGIC_DATA.practice.question}
                        </p>
                    </div>
                </div>

                {/* Reasoning Quiz / Concept Flow Box */}
                {!(appMode === 'practice' && !quizMode) && (
                    <div className="flex-1 flex flex-col gap-3 p-5 sm:p-6 bg-[#2a1a16]/95 rounded-[1.5rem] border-2 border-black/50 overflow-hidden shadow-lg">
                        <div className="flex items-center gap-2 opacity-50 mb-2">
                            {quizMode ? <HelpCircle size={18} className="text-yellow-400" /> : <BookOpen size={18} className="text-[#a88a6d]" />}
                            <span className="text-[#a88a6d] font-black uppercase text-[12px] sm:text-[13px] tracking-wider">{quizMode ? "Reasoning Quiz" : "Active Concept"}</span>
                        </div>

                        <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar text-[14px]">
                            {quizMode ? (
                              <div className="flex flex-col gap-4 h-full">
                                <span className="text-yellow-400 font-black text-[12px] sm:text-[13px] uppercase opacity-70 tracking-widest leading-none">Question {quizStep + 1}/{currentQuizSet.length}</span>
                                <p className="text-white text-[16px] sm:text-[18px] font-bold leading-snug tracking-tight">{currentQuizSet[quizStep]?.q}</p>
                                <div className="grid grid-cols-1 gap-3 mt-2">
                                    {currentQuizSet[quizStep]?.options?.map((opt, idx) => {
                                        let style = "bg-black/40 border-transparent text-white";
                                        if (quizFeedbackMode) {
                                            if (idx === currentQuizSet[quizStep].correct) style = "bg-green-600 border-green-400 text-white shadow-lg";
                                            else if (idx === quizSelection) style = "bg-red-600 border-red-400 text-white shadow-lg";
                                            else style = "bg-black/20 border-transparent text-white/20 opacity-40";
                                        }
                                        return (<button key={idx} disabled={quizFeedbackMode} onClick={() => handleQuizSelection(idx)} className={`p-3.5 sm:p-4 rounded-xl font-black uppercase transition-all text-[13px] sm:text-[14px] border-2 text-left ${style} ${!quizFeedbackMode ? 'hover:bg-black/60 hover:scale-[1.02]' : ''}`}>{opt}</button>);
                                    })}
                                </div>
                              </div>
                            ) : (
                              (currentScenData.clues || []).filter(clue => appMode === 'practice' || clue.step === activeStep).map((clue) => {
                                const showFull = lessonFinished || appMode === 'practice' || conceptPhase === 'selecting';
                                
                                return (
                                  <div key={clue.id} className={`flex flex-col gap-1.5 transition-all ${showFull ? 'opacity-100' : 'opacity-100'}`}>
                                    <button 
                                      onClick={() => setActiveConceptInfo(clue.concept)}
                                      className={`w-fit px-3.5 py-1.5 rounded-full bg-yellow-400 text-black font-black text-[10px] sm:text-[11px] uppercase tracking-wider hover:scale-105 active:scale-95 transition-all flex items-center gap-1.5 shadow-md`}
                                    >
                                      <Info size={12} strokeWidth={3} /> Concept: {clue.concept}
                                    </button>
                                    <p className={`text-white text-[14px] sm:text-[15px] leading-snug tracking-tight font-medium pl-3 border-l-[3px] border-white/10 mt-1`}>{clue.text}</p>
                                  </div>
                                );
                              })
                            )}
                            {activeConceptInfo && !quizMode && (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="bg-yellow-400/10 border border-yellow-400/40 p-4 rounded-xl mt-3 flex items-start gap-3 shadow-inner">
                                    <Zap size={16} className="text-yellow-400 shrink-0 mt-0.5" />
                                    <p className="text-yellow-400 text-[13px] sm:text-[14px] italic leading-relaxed font-bold">"{currentScenData.clues?.find(c => c.concept === activeConceptInfo)?.explanation}"</p>
                                </motion.div>
                            )}
                        </div>
                    </div>
                )}
            </div>

            {/* Right Column: Teacher Guidance Panel */}
            <div className="flex flex-col bg-[#2a1a16]/95 p-5 sm:p-6 lg:p-8 rounded-[1.5rem] border-2 border-black/50 shadow-lg h-full min-h-[350px] relative overflow-hidden">
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 sm:pr-2 pb-2">
                    <AnimatePresence mode='wait'>
                        
                        {quizFeedbackMode && (
                            <motion.div key="practice-quiz-fb" className="flex flex-col items-center justify-center gap-5 text-center h-full min-h-[250px]">
                                <p className="text-yellow-400 text-[15px] sm:text-[17px] italic leading-snug tracking-tight font-medium text-center px-4">"{currentQuizSet[quizStep]?.explanation}"</p>
                                <button onClick={() => {
                                    if (quizSelection === currentQuizSet[quizStep].correct) {
                                        if (quizStep < currentQuizSet.length - 1) { 
                                            setQuizStep(quizStep + 1); setQuizSelection(null); setQuizFeedbackMode(false); 
                                        } else { 
                                            setLessonFinished(true); setQuizMode(false); setShowFinishModal(true);
                                        }
                                    } else { setQuizFeedbackMode(false); setQuizSelection(null); }
                                }} className="bg-indigo-500 text-white px-10 py-3.5 sm:py-4 rounded-full font-black uppercase text-[14px] sm:text-[15px] shadow-xl hover:scale-105 transition-all mt-4 tracking-wider">
                                    {quizSelection === currentQuizSet[quizStep].correct ? (quizStep === currentQuizSet.length - 1 ? 'Finish Laboratory' : 'Next Discovery') : 'Try Again'}
                                </button>
                            </motion.div>
                        )}

                        {quizMode && !quizFeedbackMode && (
                            <motion.div key="practice-quiz-wait" className="flex flex-col items-center justify-center gap-5 h-full opacity-50 min-h-[250px]">
                                <MousePointer2 size={56} className="text-indigo-400 animate-bounce" />
                                <p className="text-white text-[15px] sm:text-[16px] font-medium tracking-wide">Select your answer from the options on the left!</p>
                            </motion.div>
                        )}

                        {lessonFinished && (
                          <motion.div key="finished" className="flex flex-col items-center justify-center h-full text-center gap-5 min-h-[250px]">
                             <Trophy size={70} className="text-yellow-400 opacity-50" />
                             <h3 className="text-white text-[20px] sm:text-[24px] font-black uppercase tracking-widest">Completed</h3>
                             <p className="text-white/70 text-[15px] sm:text-[16px] tracking-tight leading-snug px-6 max-w-md">You've successfully completed this section.</p>
                             <button onClick={() => setShowFinishModal(true)} className="bg-green-600 text-white px-8 py-3.5 rounded-full font-black uppercase shadow-xl tracking-widest text-[14px] sm:text-[15px] hover:scale-105 transition-all mt-2">
                                 Open Finish Menu
                             </button>
                          </motion.div>
                        )}

                        {conceptPhase === 'selecting' && appMode === 'concept' && !lessonFinished && (
                          <motion.div 
                              key={`concept-sel-${activeStep}`} 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              exit={{ opacity: 0 }}
                              transition={{ duration: 0.2 }}
                              className="flex flex-col gap-4 h-full"
                          >
                            <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-2">
                               <span className="text-yellow-400 font-black text-[12px] sm:text-[13px] uppercase tracking-widest flex items-center gap-2"><Compass size={16}/> Interactive Lesson • Step {activeStep + 1}/{LOGIC_DATA.concept.teachingSteps.length}</span>
                            </div>
                            
                            <p className="text-white font-bold text-[16px] sm:text-[18px] leading-snug tracking-tight px-2">{LOGIC_DATA.concept.teachingSteps[activeStep]?.selectionPrompt}</p>
                            
                            {stepStatus !== 'correct' ? (
                                <>
                                    <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center py-4">
                                      {LOGIC_DATA.concept.teachingSteps[activeStep]?.options?.map((opt, i) => {
                                          const isSelected = conceptSelectedOption === i;
                                          const isCorrect = isSelected && isQuizPassed;
                                          const isWrong = isSelected && feedback.type === 'error';
                                          
                                          let btnClass = "bg-black/40 border border-white/10 text-white hover:bg-black/60 hover:scale-105 active:scale-95";
                                          if (isCorrect) btnClass = "bg-green-600 border-green-400 text-white shadow-lg scale-105";
                                          else if (isWrong) btnClass = "bg-red-600 border-red-400 text-white shadow-lg";
                                          else if (isQuizPassed) btnClass = "bg-black/20 border-transparent text-white/30 opacity-50 cursor-not-allowed";

                                          return (
                                            <button 
                                                key={i} 
                                                disabled={isQuizPassed}
                                                onClick={() => handleSelectionQuiz(i)} 
                                                className={`px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl font-black uppercase text-[12px] sm:text-[13px] transition-all shadow-md border-[2px] ${btnClass}`}
                                            >
                                                {opt}
                                            </button>
                                          );
                                      })}
                                    </div>
                                    
                                    {!isQuizPassed && feedback.type === 'error' && <p className="text-rose-400 text-[14px] font-bold italic animate-pulse text-center leading-tight">"{feedback.reason}"</p>}
                                    
                                    {isQuizPassed && (
                                        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 mt-3">
                                            
                                            <div className="flex flex-col rounded-xl overflow-hidden border-[2px] border-green-500/50 shadow-xl">
                                                <div className="bg-green-500/10 px-5 py-4 border-b border-green-500/20">
                                                    <p className="text-green-400 text-[14px] sm:text-[15px] font-medium leading-relaxed">
                                                        <strong className="uppercase tracking-widest text-[11px] block mb-1.5 text-green-500">Logic Confirmed</strong>
                                                        "{feedback.reason}"
                                                    </p>
                                                </div>
                                                {LOGIC_DATA.concept.teachingSteps[activeStep]?.instruction && (
                                                    <div className="bg-yellow-400/10 p-5 flex gap-4 items-start">
                                                        <MousePointer2 size={26} className="text-yellow-400 shrink-0 mt-0.5" />
                                                        <div className="flex flex-col">
                                                            <span className="text-yellow-400 font-black uppercase text-[11px] tracking-widest mb-1.5">Required Action</span>
                                                            <span className="text-white text-[15px] font-bold tracking-tight leading-snug">
                                                                {LOGIC_DATA.concept.teachingSteps[activeStep]?.instruction}
                                                            </span>
                                                        </div>
                                                    </div>
                                                )}
                                            </div>

                                            {isBoardValid ? (
                                                <button onClick={nextStep} className="w-full py-4 sm:py-5 rounded-full font-black uppercase text-[14px] sm:text-[15px] tracking-widest transition-all bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] border-2 border-green-400 hover:scale-105 active:scale-95 mt-3">
                                                    {activeStep === LOGIC_DATA.concept.teachingSteps.length - 1 ? 'Finish Concept Mode' : 'Proceed to Next Step'}
                                                </button>
                                            ) : (
                                                <div className="flex flex-col gap-2 mt-3">
                                                    <button disabled={true} className="w-full py-4 sm:py-5 rounded-full font-black uppercase text-[14px] sm:text-[15px] tracking-widest transition-all bg-white/5 text-white/30 cursor-not-allowed border-2 border-white/10">
                                                        Complete Action on the Clock
                                                    </button>
                                                    {actionError && <p className="text-rose-400 text-[14px] font-bold italic animate-pulse text-center leading-tight mt-1.5">"{actionError}"</p>}
                                                </div>
                                            )}
                                        </motion.div>
                                    )}
                                </>
                            ) : (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-5 mt-3 h-full">
                                   
                                   {/* Keep the options visible but disabled */}
                                   <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center py-4">
                                      {LOGIC_DATA.concept.teachingSteps[activeStep]?.options?.map((opt, i) => {
                                          const isCorrect = conceptSelectedOption === i;
                                          let btnClass = isCorrect ? "bg-green-600 border-green-400 text-white shadow-lg scale-105" : "bg-black/20 border-transparent text-white/30 opacity-50 cursor-not-allowed";
                                          return (
                                            <button key={i} disabled={true} className={`px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl font-black uppercase text-[12px] sm:text-[13px] transition-all shadow-md border-[2px] ${btnClass}`}>
                                                {opt}
                                            </button>
                                          );
                                      })}
                                   </div>

                                   <div className="bg-green-400/10 border border-green-400/30 p-5 rounded-xl flex items-start gap-4 mt-auto shadow-inner">
                                       <CheckCircleIcon />
                                       <div>
                                           <p className="text-green-400 font-black text-[12px] sm:text-[13px] uppercase tracking-widest mb-1.5">Step Completed</p>
                                           <p className="text-white text-[15px] font-medium leading-relaxed">"{LOGIC_DATA.concept.teachingSteps[activeStep]?.why}"</p>
                                       </div>
                                   </div>
                                   
                                   <button onClick={nextStep} className={`w-full py-4 sm:py-5 rounded-full font-black uppercase text-[14px] sm:text-[15px] tracking-widest transition-all bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] border-2 border-green-400 hover:scale-105 active:scale-95`}>
                                       {activeStep === LOGIC_DATA.concept.teachingSteps.length - 1 ? 'Finish Concept Mode' : 'Proceed to Next Step'}
                                   </button>
                                </motion.div>
                            )}
                          </motion.div>
                        )}

                        {conceptPhase === 'finalCheck' && appMode === 'concept' && !quizMode && !lessonFinished && (
                          <motion.div key="check" className="flex flex-col items-center justify-center h-full text-center gap-5 min-h-[250px]">
                             <div className="bg-green-400/20 p-6 sm:p-8 rounded-2xl border border-green-400/50 shadow-xl">
                                <p className="text-white font-bold text-[18px] uppercase tracking-widest">Clock Logic Mastered!</p>
                                <p className="text-white/90 text-[15px] mt-3 tracking-tight leading-relaxed">
                                    You've successfully mapped the angle using the 30 degree gap rule and minutes rotation. Time for the final quiz!
                                </p>
                             </div>
                             <button onClick={() => setQuizMode(true)} className={`w-full py-4 sm:py-5 rounded-full font-black uppercase shadow-xl transition-all text-[15px] bg-green-600 text-white hover:scale-105 tracking-widest`}>
                                Start Reasoning Quiz
                             </button>
                          </motion.div>
                        )}

                        {appMode === 'practice' && !quizMode && !lessonFinished && (
                            <motion.div key="practice-instruction" className="flex flex-col gap-4 h-full items-center justify-center text-center min-h-[250px]">
                                 <div className="bg-green-400/20 p-6 sm:p-8 rounded-2xl border border-green-400/50 shadow-xl w-full max-w-lg">
                                    <p className="text-white font-bold text-[18px] uppercase tracking-widest">Verify Clock Angle</p>
                                    <p className="text-white/90 text-[15px] mt-3 tracking-tight leading-relaxed">
                                        Read the problem on the left. Look at the clock face showing the time to answer the questions!
                                    </p>
                                 </div>
                                 <button onClick={() => setQuizMode(true)} className={`w-full max-w-lg py-4 sm:py-5 rounded-full font-black uppercase shadow-xl transition-all text-[15px] bg-green-600 text-white hover:scale-105 tracking-widest shadow-[0_0_20px_rgba(34,197,94,0.4)]`}>
                                    Start Practice Quiz
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
                          {appMode === 'concept' ? 'Concept Mastered!' : 'Lab Complete!'}
                      </h2>
                      <p className="text-white/80 text-sm sm:text-base font-medium px-4">
                          {appMode === 'concept' 
                              ? "You've successfully mapped the hour hand rotation using the 30° gap rule." 
                              : "You have successfully finished the Clock Rotation module."}
                      </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                     <button onClick={() => { handleReset(appMode); setShowFinishModal(false); }} className="w-full py-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black uppercase text-[14px] tracking-wider transition-all shadow-lg active:scale-95">Restart Module</button>
                     {appMode === 'concept' ? (
                         <button onClick={() => { handleSetMode('practice'); setShowFinishModal(false); }} className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-black uppercase text-[14px] tracking-wider transition-all shadow-lg active:scale-95 shadow-[0_0_15px_rgba(34,197,94,0.3)]">Start Practice</button>
                     ) : (
                         <button onClick={() => setShowFinishModal(false)} className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-black uppercase text-[14px] tracking-wider transition-all shadow-lg active:scale-95 shadow-[0_0_15px_rgba(34,197,94,0.3)]">Finish Session</button>
                     )}
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

// Helper icon component
function CheckCircleIcon() {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className="text-green-400 shrink-0 mt-0.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path><polyline points="22 4 12 14.01 9 11.01"></polyline></svg>
    )
}

export default function App() { return ( <Router> <LabContent /> </Router> ); }