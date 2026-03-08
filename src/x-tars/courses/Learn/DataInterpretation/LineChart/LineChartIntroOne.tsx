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
  Compass,
  Info,
  MousePointer2,
  Eye,
  FileText,
  TrendingUp,
  ArrowLeft,
  Table as TableIcon
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
    coreDefinition: {
        title: "Concept: The Line Chart",
        text: "Things constantly change over time! A Line Chart connects data points over time to clearly visualize these changes.\n\n• The horizontal (bottom) axis tracks categories or time.\n• The vertical (side) axis tracks the measured value."
    },
    question: "Let's learn how to build and read a Line Chart by tracking a student's height from 6th grade to 10th grade!",
    clues: [
      { id: 1, step: 0, concept: "Daily Changes", explanation: "Temperature fluctuates throughout the day, rising in the morning and dropping at night.", text: "Realize that temperature is not constant." },
      { id: 2, step: 1, concept: "Performance Variance", explanation: "Test marks change because your performance varies. We need a way to track this variance.", text: "Realize that test marks are not constant." },
      { id: 3, step: 2, concept: "Continuous Growth", explanation: "Plants grow over time, meaning their height is a variable that constantly increases.", text: "Realize that plant height is not constant." },
      { id: 4, step: 3, concept: "The First Point", explanation: "We have our first data point: 60 cm in 6th grade. We plot this value vertically aligned with 6th grade.", text: "Plot the starting value." },
      { id: 5, step: 4, concept: "Connecting Dots", explanation: "By 8th grade, he is 80 cm. We plot the new point and draw a line connecting them.", text: "See how connecting points reveals the direction of change." },
      { id: 6, step: 5, concept: "Extending the Line", explanation: "By 10th grade, he is 100 cm. We plot the final point and extend the line to see the complete growth journey.", text: "Plot the final point to complete the data set." },
      { id: 7, step: 6, concept: "Reading Data", explanation: "Look where the dot aligns horizontally to find the grade, and vertically to find the exact height in cm.", text: "Extract values directly from the chart." },
      { id: 8, step: 7, concept: "Tracking Progress", explanation: "By checking different points, we can see exactly what the value was at any given moment in time.", text: "Read another specific data point." }
    ],
    teachingSteps: [
      { 
        id: "step-1",
        selectionPrompt: "Step 1: Temperature. Think about the world around you. Does the temperature stay exactly the same all day long?",
        options: ["Yes, it's always the same.", "No, it changes from morning to night."],
        correct: 1,
        feedback: ["Not quite! A morning is much cooler than the afternoon.", "Exactly! The temperature goes up and down throughout the day."],
        why: "Temperature is a variable that constantly changes over time.",
        instruction: "Logic Confirmed. Proceed to the next question.",
        requiredActionState: 'none'
      },
      { 
        id: "step-2",
        selectionPrompt: "Step 2: Test Marks. What about your test marks? Do you score exactly the same on every single test you take?",
        options: ["Yes, my marks never change.", "No, my marks go up and down depending on the test."],
        correct: 1,
        feedback: ["That would be highly unusual!", "Correct! Your performance varies from test to test."],
        why: "Test scores are another example of data that changes over sequential events.",
        instruction: "Logic Confirmed. Proceed to the next question.",
        requiredActionState: 'none'
      },
      { 
        id: "step-3",
        selectionPrompt: "Step 3: Plant Height. Does a plant's height stay the same every week?",
        options: ["No, it grows taller over time.", "Yes, it never changes size."],
        correct: 0,
        feedback: ["Exactly! As weeks pass, the plant's height increases.", "Only if it's an artificial plant!"],
        why: "Growth is a continuous change over a period of time.",
        instruction: "Logic Confirmed. Let's see how we visualize this kind of data.",
        requiredActionState: 'none'
      },
      { 
        id: "step-4",
        noQuiz: true,
        selectionPrompt: "Step 4: Building the Chart. Let's see how we visually track data! We will map the height of a student in 6th, 8th, and 10th grade. First, let's assume his height in 6th grade is 60 cm.",
        instruction: "Click 'View Chart' to plot the first point for the 6th grade.",
        requiredActionState: 'plot_6',
        buttonText: 'View Chart',
        buttonStyle: 'bg-indigo-600 text-white',
        why: "A single data point perfectly maps the category (6th grade) to the value (60 cm)."
      },
      { 
        id: "step-5",
        noQuiz: true,
        selectionPrompt: "Step 5: Expanding the Chart. When he is in 8th grade, let's say his height has increased to 80 cm.",
        instruction: "Click 'Extend Chart' to draw the 8th grade data.",
        requiredActionState: 'plot_8',
        buttonText: 'Extend Chart',
        buttonStyle: 'bg-emerald-600 text-white',
        why: "Connecting sequential points with a line reveals the visual trend."
      },
      { 
        id: "step-6",
        noQuiz: true,
        selectionPrompt: "Step 6: Completing the Chart. Finally, by 10th grade, his height reaches 100 cm.",
        instruction: "Click 'Complete Chart' to finish the data mapping.",
        requiredActionState: 'plot_10',
        buttonText: 'Complete Chart',
        buttonStyle: 'bg-rose-600 text-white',
        why: "As the values continue to increase, the line continues to stretch upwards."
      },
      { 
        id: "step-7",
        selectionPrompt: "What is the height of the user in class 8th?",
        options: ["60 cm", "80 cm", "100 cm"],
        correct: 1,
        feedback: [
          "Incorrect! That was his height in the 6th grade.",
          "Exactly! If you find '8th' on the bottom and go up to the dot, it perfectly aligns with 80 cm.",
          "Incorrect! That was his height in the 10th grade."
        ],
        why: "A data point perfectly intersects its horizontal category and its vertical value.",
        instruction: "Logic Confirmed. Proceed to the final step.",
        requiredActionState: 'none',
        inspection: { type: 'guess_y', xIndex: 1, yVals: [60, 80, 100] } // 8th grade is index 1
      },
      { 
        id: "step-8",
        selectionPrompt: "What was his height in the 10th class?",
        options: ["60 cm", "80 cm", "100 cm"],
        correct: 2,
        feedback: [
          "Incorrect! Follow the tracking lines up from 10th grade.",
          "Incorrect! That was his height in the 8th grade.",
          "Perfect! The dot above 10th grade aligns directly with 100 cm on the vertical axis."
        ],
        why: "Chart reading relies on finding the exact intersection of the axes for any given dot.",
        instruction: "Chart reading mastered! You are ready for the practice scenarios.",
        requiredActionState: 'none',
        inspection: { type: 'guess_y', xIndex: 2, yVals: [60, 80, 100] } // 10th grade is index 2
      }
    ],
    postQuiz: []
  },
  practice: {
    coreDefinition: {
        title: "Concept: Reading Line Charts",
        text: "Line charts tell a story visually.\n\n• Look where the dot aligns horizontally to find the Time/Category.\n• Look where the dot aligns vertically to find the measured Value."
    },
    practiceQuestions: [
      { 
        scenario: "temperature",
        chartData: {
            xLabels: ["8 AM", "11 AM", "2 PM", "5 PM", "8 PM"],
            values: [15, 25, 30, 20, 10],
            yMin: 0, yMax: 40, yTickCount: 5,
            xLabelTitle: "Time of Day", yLabelTitle: "Temp (°C)"
        },
        q: "Looking at the Temperature chart, at what exact time was the temperature 20°C?",
        options: ["11 AM", "2 PM", "5 PM"], correct: 2, 
        correctText: "20°C AT 5 PM",
        explanation: "The dot aligned horizontally with 20°C drops straight down to 5 PM.",
        inspection: { type: 'guess_x', yVal: 20, xIndices: [1, 2, 3] } // 11AM is 1, 2PM is 2, 5PM is 3
      },
      { 
        scenario: "marks",
        chartData: {
            xLabels: ["Test 1", "Test 2", "Test 3", "Test 4", "Test 5"],
            values: [70, 60, 85, 95, 95],
            yMin: 40, yMax: 100, yTickCount: 4,
            xLabelTitle: "Exams", yLabelTitle: "Marks"
        },
        q: "Analyze the Marks chart. What was the student's exact score on Test 3?",
        options: ["60 marks", "85 marks", "95 marks"], correct: 1, 
        correctText: "85 MARKS ON TEST 3",
        explanation: "Following the vertical line up from Test 3, the dot aligns with 85 on the left.",
        inspection: { type: 'guess_y', xIndex: 2, yVals: [60, 85, 95] } 
      },
      { 
        scenario: "plant",
        chartData: {
            xLabels: ["Wk 1", "Wk 2", "Wk 3", "Wk 4", "Wk 5"],
            values: [5, 12, 18, 25, 30],
            yMin: 0, yMax: 40, yTickCount: 5,
            xLabelTitle: "Weeks", yLabelTitle: "Height (cm)"
        },
        q: "Look at the Plant Height chart. In which week was the plant exactly 25 cm tall?",
        options: ["Week 3", "Week 4", "Week 5"], correct: 1, 
        correctText: "25 CM AT WEEK 4",
        explanation: "The dot resting exactly on the 25 cm line drops down to Week 4.",
        inspection: { type: 'guess_x', yVal: 25, xIndices: [2, 3, 4] } 
      },
      { 
        scenario: "temperature_drop",
        chartData: {
            xLabels: ["Day 1", "Day 2", "Day 3", "Day 4", "Day 5"],
            values: [102, 101, 99, 98, 98],
            yMin: 96, yMax: 104, yTickCount: 5,
            xLabelTitle: "Days", yLabelTitle: "Fever (°F)"
        },
        q: "This chart tracks a patient's fever. What was the exact temperature reading on Day 2?",
        options: ["102 °F", "101 °F", "99 °F"], correct: 1, 
        correctText: "101°F ON DAY 2",
        explanation: "Following the line up from Day 2 shows the point rests on the 101°F mark.",
        inspection: { type: 'guess_y', xIndex: 1, yVals: [102, 101, 99] } 
      },
      { 
        scenario: "sales",
        chartData: {
            xLabels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
            values: [10, 30, 20, 40, 50],
            yMin: 0, yMax: 60, yTickCount: 4,
            xLabelTitle: "Days", yLabelTitle: "Sales"
        },
        q: "Look at the Lemonade Sales chart. On which day were exactly 40 lemonades sold?",
        options: ["Tuesday", "Wednesday", "Thursday"], correct: 2, 
        correctText: "40 SALES ON THURSDAY",
        explanation: "The point resting exactly on the 40 sales line maps straight down to Thursday.",
        inspection: { type: 'guess_x', yVal: 40, xIndices: [1, 2, 3] } // Tue=1, Wed=2, Thu=3
      }
    ]
  }
};

export default function LabContent() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept');
  const [conceptPhase, setConceptPhase] = useState('selecting'); 
  
  const [activeStep, setActiveStep] = useState(0);
  const [conceptSelectedOption, setConceptSelectedOption] = useState(null);
  const [feedback, setFeedback] = useState({ type: null, msg: "", reason: "" });
  const [actionError, setActionError] = useState("");
  const [activeConceptInfo, setActiveConceptInfo] = useState(null);
  
  // Chart Interaction State
  const [chartState, setChartState] = useState('idle'); 

  const [quizMode, setQuizMode] = useState(false);
  const [quizStep, setQuizStep] = useState(0);
  const [quizSelection, setQuizSelection] = useState(null);
  const [quizFeedbackMode, setQuizFeedbackMode] = useState(false);
  const [showExplanationForIncorrect, setShowExplanationForIncorrect] = useState(false);
  const [lessonFinished, setLessonFinished] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState([0, 1, 2]);
  
  // State to track which option the user just clicked, so we can draw guidelines
  const [lastClickedOrigIdx, setLastClickedOrigIdx] = useState(null);

  const containerRef = useRef(null);

  const currentScenData = appMode === 'concept' ? LOGIC_DATA.concept : LOGIC_DATA.practice;
  const currentStepData = quizMode ? null : (LOGIC_DATA.concept.teachingSteps[activeStep] || {});
  const isNoQuiz = currentStepData?.noQuiz || false;

  const currentQuizSet = appMode === 'concept' ? LOGIC_DATA.concept.postQuiz : LOGIC_DATA.practice.practiceQuestions;

  // Dynamically shuffle options whenever the question changes
  useEffect(() => {
      let optionsLength = 0;
      if (quizMode) {
          optionsLength = currentQuizSet[quizStep]?.options?.length || 0;
      } else {
          optionsLength = LOGIC_DATA.concept.teachingSteps[activeStep]?.options?.length || 0;
      }
      
      if (optionsLength > 0) {
          const arr = Array.from({length: optionsLength}, (_, i) => i);
          for (let i = arr.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [arr[i], arr[j]] = [arr[j], arr[i]];
          }
          setShuffledIndices(arr);
      }
  }, [activeStep, quizStep, quizMode, appMode, currentQuizSet]);

  useEffect(() => {
     if (appMode === 'practice') {
         setQuizMode(true);
     }
  }, [appMode]);

  function handleReset(overrideMode = appMode) {
    setActiveStep(0);
    setConceptSelectedOption(null);
    setFeedback({ type: null, msg: "", reason: "" });
    setActionError("");
    setActiveConceptInfo(null);
    setChartState('idle');
    setConceptPhase('selecting');
    setQuizStep(0);
    setQuizSelection(null);
    setQuizFeedbackMode(false);
    setShowExplanationForIncorrect(false);
    setLessonFinished(false);
    setShowFinishModal(false);
    setLastClickedOrigIdx(null);
    if (overrideMode === 'practice') {
        setQuizMode(true);
    } else {
        setQuizMode(false);
    }
  }

  function handleSetMode(mode) {
    setAppMode(mode);
    handleReset(mode);
  }

  const handleChartButton = (action) => {
    if (appMode === 'practice' || quizMode || lessonFinished) return;
    
    if (feedback.type !== 'success' && !isNoQuiz) {
        setActionError("Please answer the logic question before interacting with the chart.");
        return;
    }
    const expectedAction = currentStepData?.requiredActionState;
    if (!expectedAction || expectedAction === 'none') return;
    
    if (action === expectedAction) {
        setChartState(action);
        setActionError("");
        if (isNoQuiz) {
            setFeedback({ type: 'success', msg: "Chart Updated", reason: "Chart successfully extended." });
        }
    } else {
        setActionError("That is not the correct action for this step.");
    }
  };

  function handleSelectionQuiz(idx) {
    const step = currentScenData.teachingSteps[activeStep];
    if (!step || !step.feedback) return;
    setConceptSelectedOption(idx);
    setLastClickedOrigIdx(idx);
    
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
    setLastClickedOrigIdx(idx);
    setQuizFeedbackMode(true);
    setShowExplanationForIncorrect(false); 
  }

  function prevStep() {
    if (activeStep > 0) {
      const newStep = activeStep - 1;
      setActiveStep(newStep);
      setConceptSelectedOption(null);
      setFeedback({ type: null, msg: "", reason: "" });
      setActionError("");
      setActiveConceptInfo(null);
      setLastClickedOrigIdx(null);
      
      const stepToState = ['idle', 'idle', 'idle', 'idle', 'plot_6', 'plot_8', 'plot_10', 'plot_10'];
      setChartState(stepToState[newStep] || 'idle');
    }
  }

  function nextStep() {
    if (activeStep < LOGIC_DATA.concept.teachingSteps.length - 1) {
      setActiveStep(activeStep + 1);
      setConceptSelectedOption(null);
      setFeedback({ type: null, msg: "", reason: "" });
      setActionError("");
      setLastClickedOrigIdx(null);
    } else {
      setConceptPhase('finalCheck');
    }
  }

  const isQuizPassed = feedback.type === 'success';
  const expectedAction = currentStepData?.requiredActionState;
  const isBoardValid = appMode === 'concept' ? (!expectedAction || expectedAction === 'none' || chartState === expectedAction) : false;

  const isCorrectAnswer = quizFeedbackMode && quizSelection === currentQuizSet[quizStep]?.correct;
  const shouldShowExplanation = isCorrectAnswer || showExplanationForIncorrect;

  // ==========================================
  // CHART RENDERING LOGIC
  // ==========================================
  
  const chartWidth = 340;
  const chartHeight = 240;
  const padLeft = 45;
  const padBottom = 30;
  const padTop = 20;
  const padRight = 20;
  
  const drawWidth = chartWidth - padLeft - padRight;
  const drawHeight = chartHeight - padTop - padBottom;
  
  const originX = padLeft;
  const originY = chartHeight - padBottom;

  let yMin = 0;
  let yMax = 140;
  let yTickCount = 6;
  let xLabels = [];
  let rawValues = [];
  let yLabelTitle = "";
  let xLabelTitle = "";
  
  // Concept Logic Config
  if (appMode === 'concept') {
      yMin = 40;
      yMax = 120;
      yTickCount = 5; // Dynamically forms: 40, 60, 80, 100, 120
      xLabels = ["6th", "8th", "10th"];
      rawValues = [60, 80, 100];
      yLabelTitle = "Height (cm)";
      xLabelTitle = "School Grade";
  } else if (appMode === 'practice') {
      const pData = currentQuizSet[quizStep]?.chartData;
      if (pData) {
          yMin = pData.yMin;
          yMax = pData.yMax;
          yTickCount = pData.yTickCount || 5;
          xLabels = pData.xLabels;
          rawValues = pData.values;
          yLabelTitle = pData.yLabelTitle;
          xLabelTitle = pData.xLabelTitle;
      }
  }

  // Calculate coordinates
  // Use (idx + 1) and (length + 1) to distribute points evenly WITHOUT touching the Y-axis
  const allPoints = rawValues.map((val, idx) => {
      const x = originX + ((idx + 1) * (drawWidth / (xLabels.length + 1)));
      const yRatio = val !== null ? (val - yMin) / (yMax - yMin) : null;
      const y = val !== null ? originY - (yRatio * drawHeight) : null;
      return { x, y, val, label: xLabels[idx], idx };
  });

  // Filter visible points based on state
  let visiblePoints = [];
  let showAxes = false;
  let showTable = false;

  let showRow1 = false;
  let showRow2 = false;
  let showRow3 = false;

  if (appMode === 'concept') {
      if (chartState !== 'idle') {
          showAxes = true;
          showTable = true;
      }
      
      // Cascading logic for chart elements
      if (['plot_6', 'plot_8', 'plot_10'].includes(chartState)) {
          showRow1 = true;
          visiblePoints.push(allPoints[0]); // 6th Grade
      }
      if (['plot_8', 'plot_10'].includes(chartState)) {
          showRow2 = true;
          visiblePoints.push(allPoints[1]); // 8th Grade
      }
      if (['plot_10'].includes(chartState)) {
          showRow3 = true;
          visiblePoints.push(allPoints[2]); // 10th Grade
      }

  } else {
      showAxes = true;
      visiblePoints = allPoints.filter(p => p.val !== null);
  }

  const pathD = visiblePoints.length > 0 ? `M ${visiblePoints.map(p => `${p.x} ${p.y}`).join(' L ')}` : "";

  // Dynamic Dotted Guidelines Logic based on User Guess
  let guideLines = null;
  if (lastClickedOrigIdx !== null && (chartState === 'plot_10' || appMode === 'practice')) {
      const stepData = quizMode ? currentQuizSet[quizStep] : LOGIC_DATA.concept.teachingSteps[activeStep];
      const inspection = stepData?.inspection;
      
      if (inspection) {
          let targetXIndex, targetYVal;
          
          if (inspection.type === 'guess_y') {
              targetXIndex = inspection.xIndex;
              targetYVal = inspection.yVals[lastClickedOrigIdx];
          } else if (inspection.type === 'guess_x') {
              targetXIndex = inspection.xIndices[lastClickedOrigIdx];
              targetYVal = inspection.yVal;
          }

          if (targetXIndex !== undefined && targetYVal !== undefined) {
              const isCorrect = lastClickedOrigIdx === stepData.correct;
              const xCoord = originX + ((targetXIndex + 1) * (drawWidth / (xLabels.length + 1)));
              const yRatio = (targetYVal - yMin) / (yMax - yMin);
              const yCoord = originY - (yRatio * drawHeight);
              
              guideLines = { x: xCoord, y: yCoord, color: isCorrect ? '#22c55e' : '#ef4444' };
          }
      }
  }

  let topTag = appMode === 'concept' ? "DATA TRACKING" : "PRACTICE SCENARIO";
  if (appMode === 'practice' && isCorrectAnswer) {
      topTag = currentQuizSet[quizStep]?.correctText || "CORRECT!";
  }

  return (
    <div className="min-h-screen w-full bg-[#e6dccb] flex flex-col select-none font-sans text-[14px]" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none fixed bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Line Chart Lab" : "Data Analysis Drills"} appMode={appMode} setAppMode={handleSetMode} onReset={() => handleReset(appMode)} />

      <main className="flex-1 flex flex-col items-center gap-6 sm:gap-8 lg:gap-10 p-3 sm:p-6 lg:p-8 w-full max-w-7xl mx-auto relative z-10 overflow-hidden">
        
        {/* Div 1: Chart Construction & Visualization */}
        <div className="w-full flex-1 flex flex-col gap-3 min-h-[400px] lg:min-h-[450px]">
          <motion.div className="w-full h-full bg-[#2a1a16] p-4 sm:p-6 lg:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] border-2 sm:border-4 border-black shadow-2xl flex flex-col justify-between items-center">
            
            <div className="w-full flex flex-col items-center gap-3 h-full">
                <div className="flex items-center justify-center gap-2 opacity-40 text-[13px] sm:text-[15px] font-black uppercase tracking-widest leading-none mb-1 text-white">
                    {quizMode ? <><Eye size={16} /> Chart Interpreter</> : <><TrendingUp size={16} /> Construction Zone</>}
                </div>

                <div className="bg-white/10 px-4 py-1.5 rounded-full text-white/80 font-black uppercase tracking-widest text-[11px] sm:text-[12px] mb-3">
                    {topTag}
                </div>
                
                {/* Horizontal Layout for Chart and Table in Concept Mode */}
                <div className="flex flex-col lg:flex-row w-full gap-4 items-center justify-center">
                    
                    {/* The HTML Data Table (Only in Concept Mode) */}
                    {appMode === 'concept' && showAxes && (
                        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} className="bg-[#3e2723] border-[3px] border-yellow-500/30 rounded-xl overflow-hidden shadow-lg min-w-[160px]">
                            <div className="bg-yellow-500/20 px-3 py-2 flex items-center justify-center gap-2 border-b border-yellow-500/30">
                                <TableIcon size={14} className="text-yellow-400"/>
                                <span className="text-yellow-400 font-black text-[11px] uppercase tracking-wider">Data Log</span>
                            </div>
                            <div className="flex flex-col">
                                <div className="grid grid-cols-2 bg-black/40 text-white/50 text-[10px] font-black uppercase tracking-wider px-2 py-1.5">
                                    <span className="text-center">Grade</span>
                                    <span className="text-center">Height</span>
                                </div>
                                {/* Row 1 */}
                                {showRow1 && (
                                    <div className="grid grid-cols-2 text-white text-[13px] font-bold px-2 py-2 border-t border-white/5">
                                        <span className="text-center text-indigo-300">6th</span>
                                        <span className="text-center">60 cm</span>
                                    </div>
                                )}
                                {/* Row 2 */}
                                {showRow2 && (
                                    <div className="grid grid-cols-2 text-white text-[13px] font-bold px-2 py-2 border-t border-white/5">
                                        <span className="text-center text-emerald-300">8th</span>
                                        <span className="text-center">80 cm</span>
                                    </div>
                                )}
                                {/* Row 3 */}
                                {showRow3 && (
                                    <div className="grid grid-cols-2 text-white text-[13px] font-bold px-2 py-2 border-t border-white/5">
                                        <span className="text-center text-rose-300">10th</span>
                                        <span className="text-center">100 cm</span>
                                    </div>
                                )}
                                {/* Empty State Padding */}
                                {visiblePoints.length === 0 && (
                                    <div className="text-center text-white/20 italic text-[11px] py-4">Waiting for data...</div>
                                )}
                            </div>
                        </motion.div>
                    )}
                    
                    {appMode === 'concept' && !showAxes && (
                         <div className="flex flex-col items-center justify-center opacity-30 gap-4 h-[240px]">
                              <TrendingUp size={64} className="text-white" />
                              <span className="text-white font-black tracking-widest uppercase">Awaiting Data</span>
                         </div>
                    )}

                    {/* SVG Chart Area */}
                    {(showAxes || appMode === 'practice') && (
                        <div className={`relative bg-[#3e2723] rounded-2xl border-[4px] border-yellow-500/30 shadow-inner flex flex-col items-center justify-center w-full max-w-[450px] transition-all duration-500`}>
                          <svg viewBox="0 0 340 240" className="w-full h-full drop-shadow-md">
                              
                              {/* Grid Lines (Faint) */}
                              {showAxes && Array.from({length: yTickCount}).map((_, i) => {
                                  const y = originY - (i * (drawHeight / (yTickCount - 1)));
                                  return <line key={`grid-${i}`} x1={originX} y1={y} x2={chartWidth - padRight} y2={y} stroke="white" strokeWidth="1" opacity="0.1" />;
                              })}

                              {/* Axes */}
                              {showAxes && (
                                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                      {/* X Axis */}
                                      <line x1={originX} y1={originY} x2={chartWidth - padRight + 10} y2={originY} stroke="#a88a6d" strokeWidth="3" strokeLinecap="round" />
                                      {/* Y Axis */}
                                      <line x1={originX} y1={originY} x2={originX} y2={padTop - 10} stroke="#a88a6d" strokeWidth="3" strokeLinecap="round" />
                                      
                                      {/* Y Labels */}
                                      {Array.from({length: yTickCount}).map((_, i) => {
                                          const val = yMin + i * ((yMax - yMin)/(yTickCount - 1));
                                          const y = originY - (i * (drawHeight / (yTickCount - 1)));
                                          return <text key={`yl-${i}`} x={originX - 8} y={y} fill="#a88a6d" fontSize="10" fontWeight="bold" textAnchor="end" dominantBaseline="central">{val}</text>;
                                      })}

                                      {/* X Labels */}
                                      {allPoints.map((p, i) => (
                                          <text key={`xl-${i}`} x={p.x} y={originY + 16} fill="#a88a6d" fontSize="10" fontWeight="bold" textAnchor="middle">{p.label}</text>
                                      ))}

                                      {/* Axis Titles */}
                                      <text x={originX + drawWidth/2} y={chartHeight - 5} fill="white" fontSize="11" fontWeight="bold" textAnchor="middle" opacity="0.6" tracking="wider">{xLabelTitle.toUpperCase()}</text>
                                      <text x={12} y={originY - drawHeight/2} fill="white" fontSize="11" fontWeight="bold" textAnchor="middle" transform={`rotate(-90 12 ${originY - drawHeight/2})`} opacity="0.6" tracking="wider">{yLabelTitle.toUpperCase()}</text>
                                  </motion.g>
                              )}

                              {/* Interactive Dotted Guidelines */}
                              {guideLines && (
                                  <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                      {/* Horizontal Line */}
                                      <line x1={originX} y1={guideLines.y} x2={guideLines.x} y2={guideLines.y} stroke={guideLines.color} strokeWidth="2.5" strokeDasharray="6 6" />
                                      {/* Vertical Line */}
                                      <line x1={guideLines.x} y1={originY} x2={guideLines.x} y2={guideLines.y} stroke={guideLines.color} strokeWidth="2.5" strokeDasharray="6 6" />
                                      {/* Intersection Point */}
                                      <circle cx={guideLines.x} cy={guideLines.y} r="8" fill={guideLines.color} style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.8))" }} />
                                  </motion.g>
                              )}

                              {/* The Line */}
                              {visiblePoints.length > 1 && (
                                  <motion.path 
                                      initial={{ pathLength: 0 }}
                                      animate={{ pathLength: 1 }}
                                      transition={{ duration: 1.2, ease: "easeInOut" }}
                                      d={pathD} 
                                      fill="none" 
                                      stroke="#fbbf24" 
                                      strokeWidth="4" 
                                      strokeLinecap="round" 
                                      strokeLinejoin="round" 
                                      style={{ filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.5))" }}
                                  />
                              )}

                              {/* Points */}
                              {visiblePoints.map((p, i) => (
                                  <motion.g key={`p-${i}`} initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: "spring", delay: 0.2 }}>
                                      <circle cx={p.x} cy={p.y} r="5" fill="#f8fafc" stroke="#3e2723" strokeWidth="2" style={{ filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.5))" }} />
                                      <text x={p.x} y={p.y - 10} fill="#f8fafc" fontSize="11" fontWeight="bold" textAnchor="middle">{p.val}</text>
                                  </motion.g>
                              ))}

                          </svg>
                        </div>
                    )}
                </div>

                {/* Contextual Action Buttons for Chart Steps */}
                {!quizMode && !lessonFinished && appMode === 'concept' && (isQuizPassed || isNoQuiz) && (
                    <div className="flex gap-3 mt-4 flex-wrap justify-center animate-in fade-in zoom-in duration-300">
                        {expectedAction !== 'none' && !isBoardValid && (
                            <button onClick={() => handleChartButton(expectedAction)} className={`px-6 py-2 rounded-full font-black uppercase text-[12px] shadow-lg hover:scale-105 active:scale-95 transition-all ${currentStepData.buttonStyle}`}>
                                {currentStepData.buttonText}
                            </button>
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
                
                {/* The Logic Problem / Core Definition Box */}
                <div className={`bg-[#2a1a16]/95 p-5 sm:p-6 rounded-[1.5rem] border-2 border-black/50 shadow-lg flex gap-4 sm:gap-5 items-start text-white`}>
                    <div className="bg-yellow-400 p-2.5 rounded-xl text-black shrink-0 shadow-md mt-1">
                        {quizMode ? <Info size={26} strokeWidth={2.5}/> : <FileText size={26} strokeWidth={2.5}/>}
                    </div>
                    <div className="flex flex-col gap-1">
                        <span className="text-yellow-400 font-black uppercase text-[12px] sm:text-[13px] tracking-widest leading-none mb-1">
                            {quizMode ? currentScenData.coreDefinition.title : "The Scenario"}
                        </span>
                        <p className="text-[14px] sm:text-[16px] font-medium leading-relaxed tracking-tight text-white/90 whitespace-pre-line">
                            {quizMode ? currentScenData.coreDefinition.text : LOGIC_DATA.concept.question}
                        </p>
                    </div>
                </div>

                {/* Solution Explanation / Concept Clues Box */}
                <div className="flex-1 flex flex-col gap-3 p-5 sm:p-6 bg-[#2a1a16]/95 rounded-[1.5rem] border-2 border-black/50 overflow-hidden shadow-lg">
                    <div className="flex items-center gap-2 opacity-50 mb-2">
                        <BookOpen size={18} className={quizMode ? "text-yellow-400" : "text-[#a88a6d]"} />
                        <span className="text-[#a88a6d] font-black uppercase text-[12px] sm:text-[13px] tracking-wider">
                            {quizMode ? "Solution Explanation" : "Active Concept"}
                        </span>
                    </div>

                    <div className="flex-1 flex flex-col gap-4 overflow-y-auto custom-scrollbar text-[14px]">
                        {quizMode ? (
                            <div className="flex flex-col h-full justify-center pb-4">
                                {shouldShowExplanation ? (
                                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="bg-yellow-400/10 border border-yellow-400/40 p-4 sm:p-5 rounded-xl shadow-inner flex gap-3 sm:gap-4 items-start">
                                        <Zap size={22} className="text-yellow-400 shrink-0 mt-0.5" />
                                        <p className="text-yellow-400 text-[14px] sm:text-[15px] italic leading-relaxed font-bold">
                                            "{currentQuizSet[quizStep]?.explanation}"
                                        </p>
                                    </motion.div>
                                ) : (
                                    <div className="flex flex-col items-center justify-center opacity-30 gap-3 pt-4">
                                        <FileText size={40} />
                                        <p className="text-center font-medium tracking-wide max-w-[200px] text-[13px] sm:text-[14px]">Detailed explanation will appear here after you solve the question, or if you request it.</p>
                                    </div>
                                )}
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
            </div>

            {/* Right Column: Teacher Guidance Panel */}
            <div className="flex flex-col bg-[#2a1a16]/95 p-5 sm:p-6 lg:p-8 rounded-[1.5rem] border-2 border-black/50 shadow-lg h-full min-h-[350px] relative overflow-hidden">
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 sm:pr-2 pb-2">
                    <AnimatePresence mode='wait'>

                        {quizMode && !lessonFinished && (
                            <motion.div key="quiz-panel" className="flex flex-col gap-4 h-full">
                                <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-1">
                                    <span className="text-yellow-400 font-black text-[12px] sm:text-[13px] uppercase tracking-widest flex items-center gap-2">
                                        <Compass size={16}/> {appMode === 'practice' ? `Practice Drill ${quizStep + 1}/${currentQuizSet.length}` : `Concept Quiz ${quizStep + 1}/${currentQuizSet.length}`}
                                    </span>
                                </div>
                                <p className="text-white font-bold text-[16px] sm:text-[18px] leading-snug tracking-tight px-2 text-center">
                                    {currentQuizSet[quizStep]?.q}
                                </p>

                                <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center py-3">
                                    {shuffledIndices.map((origIdx) => {
                                        const opt = currentQuizSet[quizStep]?.options?.[origIdx];
                                        if (!opt) return null;
                                        
                                        const isCorrect = quizFeedbackMode && origIdx === currentQuizSet[quizStep].correct;
                                        const isWrong = quizFeedbackMode && origIdx === quizSelection && origIdx !== currentQuizSet[quizStep].correct;
                                        const isDisabled = quizFeedbackMode;

                                        let btnClass = "bg-black/40 border border-white/10 text-white hover:bg-black/60 hover:scale-105 active:scale-95";
                                        if (isCorrect) btnClass = "bg-green-600 border-green-400 text-white shadow-lg scale-105";
                                        else if (isWrong) btnClass = "bg-red-600 border-red-400 text-white shadow-lg";
                                        else if (isDisabled) btnClass = "bg-black/20 border-transparent text-white/30 opacity-50 cursor-not-allowed";

                                        return (
                                            <button 
                                                key={origIdx} 
                                                disabled={isDisabled}
                                                onClick={() => handleQuizSelection(origIdx)} 
                                                className={`px-5 sm:px-8 py-3.5 sm:py-5 rounded-xl font-black uppercase text-[13px] sm:text-[15px] transition-all shadow-md border-[2px] ${btnClass}`}
                                            >
                                                {opt}
                                            </button>
                                        );
                                    })}
                                </div>

                                {quizFeedbackMode && quizSelection !== currentQuizSet[quizStep].correct && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-3 mt-auto">
                                        <p className="text-rose-400 text-[14px] font-bold italic animate-pulse text-center leading-tight">"Incorrect. Check the chart again!"</p>
                                        <div className="flex flex-col sm:flex-row gap-3">
                                            <button onClick={() => { setQuizFeedbackMode(false); setQuizSelection(null); setShowExplanationForIncorrect(false); setLastClickedOrigIdx(null); }} className="flex-1 py-3.5 rounded-full font-black uppercase text-[13px] sm:text-[14px] tracking-widest transition-all bg-rose-600 text-white shadow-[0_0_20px_rgba(225,29,72,0.4)] border-2 border-rose-400 hover:scale-105 active:scale-95">
                                                Try Again
                                            </button>
                                            {!showExplanationForIncorrect && (
                                                <button onClick={() => setShowExplanationForIncorrect(true)} className="flex-1 py-3.5 rounded-full font-black uppercase text-[13px] sm:text-[14px] tracking-widest transition-all bg-indigo-600 text-white shadow-lg border-2 border-indigo-400 hover:scale-105 active:scale-95">
                                                    View Explain
                                                </button>
                                            )}
                                        </div>
                                    </motion.div>
                                )}

                                {isCorrectAnswer && (
                                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 mt-auto">
                                        <div className="bg-green-400/10 p-4 sm:p-5 flex items-start gap-4 shadow-inner rounded-xl border border-green-500/20">
                                            <CheckCircleIcon />
                                            <div className="flex flex-col">
                                                <span className="text-green-400 font-black uppercase text-[11px] tracking-widest mb-1.5">Correct Answer</span>
                                                <span className="text-white text-[14px] sm:text-[15px] font-medium leading-relaxed">
                                                    Brilliant! Review the explanation on the left.
                                                </span>
                                            </div>
                                        </div>
                                        <button onClick={() => {
                                            if (quizStep < currentQuizSet.length - 1) { 
                                                setQuizStep(quizStep + 1); 
                                                setQuizSelection(null); 
                                                setQuizFeedbackMode(false); 
                                                setShowExplanationForIncorrect(false);
                                                setLastClickedOrigIdx(null);
                                            } else { 
                                                setLessonFinished(true); 
                                                setShowFinishModal(true);
                                            }
                                        }} className="w-full py-4 sm:py-5 rounded-full font-black uppercase text-[14px] sm:text-[15px] tracking-widest transition-all bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] border-2 border-green-400 hover:scale-105 active:scale-95">
                                            {quizStep === currentQuizSet.length - 1 ? 'Finish Module' : 'Next Question'}
                                        </button>
                                    </motion.div>
                                )}
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

                        {conceptPhase === 'selecting' && appMode === 'concept' && !lessonFinished && !quizMode && (
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
                               {activeStep > 0 && <button onClick={prevStep} className="text-yellow-400 hover:scale-110 active:scale-95 transition-transform bg-white/5 p-1.5 rounded-lg"><ArrowLeft size={18}/></button>}
                            </div>
                            
                            <p className="text-white font-bold text-[16px] sm:text-[18px] leading-snug tracking-tight px-2">{currentStepData?.selectionPrompt}</p>
                            
                            {/* We always render MCQ block unless the chart action is strictly not met. */}
                            {(!isQuizPassed && !isNoQuiz) ? (
                                <>
                                    <div className="flex flex-wrap gap-2.5 sm:gap-3 justify-center py-4">
                                      {shuffledIndices.map((origIdx) => {
                                          const opt = currentStepData?.options?.[origIdx];
                                          if (!opt) return null;
                                          
                                          const isSelected = conceptSelectedOption === origIdx;
                                          const isWrong = isSelected && feedback.type === 'error';
                                          
                                          let btnClass = "bg-black/40 border border-white/10 text-white hover:bg-black/60 hover:scale-105 active:scale-95";
                                          if (isWrong) btnClass = "bg-red-600 border-red-400 text-white shadow-lg";

                                          return (
                                            <button 
                                                key={origIdx} 
                                                onClick={() => handleSelectionQuiz(origIdx)} 
                                                className={`px-5 sm:px-6 py-3.5 sm:py-4 rounded-xl font-black uppercase text-[12px] sm:text-[13px] transition-all shadow-md border-[2px] ${btnClass}`}
                                            >
                                                {opt}
                                            </button>
                                          );
                                      })}
                                    </div>
                                    {feedback.type === 'error' && <p className="text-rose-400 text-[14px] font-bold italic animate-pulse text-center leading-tight">"{feedback.reason}"</p>}
                                </>
                            ) : (
                                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-4 mt-3">
                                    
                                    <div className="flex flex-col rounded-xl overflow-hidden border-[2px] border-green-500/50 shadow-xl">
                                        {(!isNoQuiz) && (
                                            <div className="bg-green-500/10 px-5 py-4 border-b border-green-500/20">
                                                <p className="text-green-400 text-[14px] sm:text-[15px] font-medium leading-relaxed">
                                                    <strong className="uppercase tracking-widest text-[11px] block mb-1.5 text-green-500">Logic Confirmed</strong>
                                                    "{feedback.reason}"
                                                </p>
                                            </div>
                                        )}
                                        {currentStepData?.instruction && !isBoardValid && expectedAction !== 'none' && (
                                            <div className="bg-yellow-400/10 p-5 flex gap-4 items-start">
                                                <MousePointer2 size={26} className="text-yellow-400 shrink-0 mt-0.5" />
                                                <div className="flex flex-col">
                                                    <span className="text-yellow-400 font-black uppercase text-[11px] tracking-widest mb-1.5">Required Action</span>
                                                    <span className="text-white text-[15px] font-bold tracking-tight leading-snug">
                                                        {currentStepData.instruction}
                                                    </span>
                                                </div>
                                            </div>
                                        )}
                                        {isBoardValid && (
                                            <div className="bg-green-400/10 p-5 flex items-start gap-4 shadow-inner">
                                                <CheckCircleIcon />
                                                <div className="flex flex-col">
                                                    <span className="text-green-400 font-black uppercase text-[11px] tracking-widest mb-1.5">Step Completed</span>
                                                    <span className="text-white text-[15px] font-medium leading-relaxed">
                                                        "{currentStepData.why}"
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
                                            {expectedAction === 'none' ? (
                                                <button onClick={nextStep} className="w-full py-4 sm:py-5 rounded-full font-black uppercase text-[14px] sm:text-[15px] tracking-widest transition-all bg-green-600 text-white shadow-[0_0_20px_rgba(34,197,94,0.4)] border-2 border-green-400 hover:scale-105 active:scale-95">
                                                    Proceed to Next Step
                                                </button>
                                            ) : (
                                                <button disabled={true} className="w-full py-4 sm:py-5 rounded-full font-black uppercase text-[14px] sm:text-[15px] tracking-widest transition-all bg-white/5 text-white/30 cursor-not-allowed border-2 border-white/10">
                                                    Complete Action on the Chart
                                                </button>
                                            )}
                                            {actionError && <p className="text-rose-400 text-[14px] font-bold italic animate-pulse text-center leading-tight mt-1.5">"{actionError}"</p>}
                                        </div>
                                    )}
                                </motion.div>
                            )}
                          </motion.div>
                        )}

                        {conceptPhase === 'finalCheck' && appMode === 'concept' && !quizMode && !lessonFinished && (
                          <motion.div key="check" className="flex flex-col items-center justify-center h-full text-center gap-5 min-h-[250px]">
                             <div className="bg-green-400/20 p-6 sm:p-8 rounded-2xl border border-green-400/50 shadow-xl">
                                <p className="text-white font-bold text-[18px] uppercase tracking-widest">Chart Mastered!</p>
                                <p className="text-white/90 text-[15px] mt-3 tracking-tight leading-relaxed">
                                    You've successfully built a Line Chart and analyzed the data trend. Time to practice!
                                </p>
                             </div>
                             <button onClick={() => { setLessonFinished(true); setShowFinishModal(true); }} className={`w-full py-4 sm:py-5 rounded-full font-black uppercase shadow-xl transition-all text-[15px] bg-green-600 text-white hover:scale-105 tracking-widest`}>
                                Complete Concept
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
                              ? "You've successfully mapped out the line chart fundamentals." 
                              : "You have successfully answered the data analysis drills."}
                      </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                     <button onClick={() => { handleReset(appMode); setShowFinishModal(false); }} className="w-full py-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black uppercase text-[14px] tracking-wider transition-all shadow-lg active:scale-95">Restart</button>
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

// export default function App() { return ( <Router> <LabContent /> </Router> ); }