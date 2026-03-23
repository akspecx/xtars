import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft,
  RotateCcw,
  Trophy,
  X,
  Compass,
  CheckCircle,
  FileText,
  Eye,
  ArrowRight,
  Target,
  Info,
  BookOpen
} from 'lucide-react';
import { HashRouter as Router, useNavigate } from 'react-router-dom';

// ==========================================
// SUB-COMPONENTS
// ==========================================

function HeaderSection({ onBack, title, appMode, setAppMode, onReset }) {
  return (
    <header className="w-full shrink-0 p-2 sm:p-3 sticky top-0 z-[100] bg-[#e6dccb]/95 border-b border-black/10 shadow-sm backdrop-blur-sm">
      <div className="w-full max-w-6xl mx-auto bg-[#2a1a16] px-3 py-2.5 rounded-xl border-b-[3px] border-black/40 shadow-md flex justify-between items-center text-white gap-2 transition-all">
        <div className="flex flex-col items-start leading-tight">
          <button onClick={onBack} className="flex items-center gap-1 text-[#a88a6d] font-black uppercase hover:text-white transition-all text-[10px] mb-0.5">
            <ChevronLeft size={14} strokeWidth={3} /> Dashboard
          </button>
          <span className="text-white font-black uppercase text-[14px] sm:text-[16px] truncate max-w-[150px] sm:max-w-none leading-none tracking-wide">
            {title}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="flex bg-black/50 p-1 rounded-xl border border-white/10 shadow-inner">
            <button onClick={() => setAppMode('concept')} className={`px-3 py-1.5 rounded-md text-[11px] sm:text-[13px] font-black uppercase transition-all duration-300 ${appMode === 'concept' ? 'bg-yellow-400 text-black shadow-md scale-105' : 'text-[#a88a6d] hover:text-white'}`}>Concept</button>
            <button onClick={() => setAppMode('practice')} className={`px-3 py-1.5 rounded-md text-[11px] sm:text-[13px] font-black uppercase transition-all duration-300 ${appMode === 'practice' ? 'bg-orange-500 text-white shadow-md scale-105' : 'text-[#a88a6d] hover:text-white'}`}>Practice</button>
          </div>
          <button onClick={onReset} className="p-2 bg-rose-600 hover:bg-rose-500 rounded-lg border-b-[3px] border-rose-900 text-white active:scale-95 transition-all shadow-sm">
            <RotateCcw size={16} strokeWidth={2.5} />
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
    chartData: {
      title: "Marks Obtained by Student in Periodical Exams",
      subtitle: "Maximum Marks per Exam = 500",
      xLabels: ["Apr-01", "Jun-01", "Aug-01", "Oct-01", "Dec-01", "Feb-02"],
      values: [360, 365, 370, 385, 400, 405],
      yMin: 330, yMax: 420, yTickCount: 10,
      xLabelTitle: "Periodical Exams", yLabelTitle: "Marks Obtained"
    },
    tabs: [
      {
        id: 'average',
        label: 'Averages',
        objective: "Calculate the average marks obtained across all exams.",
        steps: [
          { 
            id: "avg-0", type: 'mcq', concept: "The Formula", 
            q: "We need to find the average marks across all 6 exams.\n\nWhat is the correct mathematical formula to calculate an average?", 
            options: ["Sum of all values ÷ Total number of values", "(Highest value - Lowest value) ÷ 2", "Total number of values ÷ Sum of all values"],
            correct: 0,
            feedback: [
                "Correct! To find an average, we add everything up and divide by the count.",
                "That calculates the median/midpoint, not the true average.",
                "You flipped the numerator and denominator!"
            ],
            visualAid: { type: 'highlight_points', indices: [0,1,2,3,4,5], alwaysShow: true }
          },
          { 
            id: "avg-1", type: 'mcq', concept: "Sum the Data", 
            q: "Let's read the chart and sum up all the marks:\n360 + 365 + 370 + 385 + 400 + 405.\n\nWhat is the total sum of the marks obtained?", 
            options: ["2,280", "2,285", "2,295"],
            correct: 1,
            feedback: [
                "You missed 5 marks in your addition.",
                "Perfect! The total sum of all 6 exams is 2,285.",
                "That is slightly too high."
            ],
            visualAid: { type: 'highlight_points', indices: [0,1,2,3,4,5], alwaysShow: true }
          },
          { 
            id: "avg-2", type: 'mcq', concept: "Compute Result", 
            q: "Now, apply the formula:\nAverage = Total Sum ÷ Number of Exams\nAverage = 2285 ÷ 6\n\nWhat is the exact average score?", 
            options: ["375.50", "380.83", "385.00"],
            correct: 1,
            feedback: [
                "Check your division: 2285 / 6 is higher than 375.",
                "Perfect! 2285 ÷ 6 = 380.83. The average score across the session is ~381 marks.",
                "385 is the exact score for Oct-01, not the average."
            ],
            visualAid: { type: 'highlight_points', indices: [0,1,2,3,4,5], alwaysShow: true } 
          }
        ]
      },
      {
        id: 'ratio',
        label: 'Ratios',
        objective: "Compare marks from specific periods using simplified ratios.",
        steps: [
          { 
            id: "rat-0", type: 'mcq', concept: "Identify Values", 
            q: "Let's find the ratio of marks obtained in Jun-01 to Aug-01.\n\nLook at the encircled data points. What are the exact values for Jun-01 and Aug-01 respectively?", 
            options: ["360 and 365", "365 and 370", "370 and 385"],
            correct: 1,
            feedback: [
                "Those are the values for Apr and Jun.",
                "Correct! Jun-01 is 365 and Aug-01 is 370.",
                "Those are the values for Aug and Oct."
            ],
            visualAid: { type: 'highlight_points', indices: [1, 2], alwaysShow: true }
          },
          { 
            id: "rat-1", type: 'mcq', concept: "Simplify the Ratio", 
            q: "The raw ratio of Jun to Aug is 365 : 370.\n\nTo simplify a ratio, we divide both sides by their greatest common divisor (which is 5 here). What is the simplified ratio?", 
            options: ["71 : 72", "73 : 74", "74 : 73"],
            correct: 1,
            feedback: [
                "365 ÷ 5 is 73, not 71.",
                "Exactly! 365 ÷ 5 = 73, and 370 ÷ 5 = 74. The ratio is 73:74.",
                "Make sure to keep the order correct (Jun : Aug)."
            ],
            visualAid: { type: 'highlight_points', indices: [1, 2], alwaysShow: true } 
          }
        ]
      },
      {
        id: 'percentage',
        label: 'Direct Percent',
        objective: "Calculate one value as a direct percentage of another.",
        steps: [
          { 
            id: "pct-0", type: 'mcq', concept: "The Formula", 
            q: "If a question asks: 'Value A is what percent of Value B?'\n\nWhich formula should we use?", 
            options: ["(Value B ÷ Value A) × 100", "(Value A ÷ Value B) × 100", "(Value A - Value B) × 100"],
            correct: 1,
            feedback: [
                "You flipped it! The subject (A) is the numerator, and the reference base (B) is the denominator.",
                "Correct! (Subject ÷ Base) × 100.",
                "That formula calculates a raw difference, not a percentage ratio."
            ],
            visualAid: { type: 'highlight_points', indices: [0, 5], alwaysShow: true }
          },
          { 
            id: "pct-1", type: 'mcq', concept: "Identify Values", 
            q: "Question: 'The marks in Feb-02 are what percent of the marks in Apr-01?'\n\nObserve the encircled data points. What are their respective values?", 
            options: ["Feb = 405, Apr = 360", "Feb = 400, Apr = 365", "Feb = 360, Apr = 405"],
            correct: 0,
            feedback: [
                "Correct! Feb-02 is 405 and Apr-01 is 360.",
                "Check the chart again. Dec is 400, Jun is 365.",
                "You swapped the values for the months."
            ],
            visualAid: { type: 'highlight_points', indices: [0, 5], alwaysShow: true }
          },
          { 
            id: "pct-2", type: 'mcq', concept: "Compute Percentage", 
            q: "Formula: (Feb ÷ Apr) × 100\nEquation: (405 ÷ 360) × 100\n\nWhat is the final percentage?", 
            options: ["110.0%", "112.5%", "120.5%"],
            correct: 1,
            feedback: [
                "A bit too low. 405 ÷ 360 = 1.125.",
                "Perfect! (405 ÷ 360) × 100 = 112.5%. Feb marks are 112.5% of Apr marks.",
                "That's a bit too high."
            ],
            visualAid: { type: 'highlight_points', indices: [0, 5], alwaysShow: true } 
          }
        ]
      },
      {
        id: 'max_inc',
        label: 'Max % Increase',
        objective: "Identify the highest percentage increase and understand the base rule.",
        steps: [
          { 
            id: "max-0", type: 'mcq', concept: "Analyze Raw Increases", 
            q: "Let's find the highest *percentage* increase.\n\nObserve the encircled points from Aug to Dec. What is the absolute marks increase for BOTH Aug->Oct and Oct->Dec?", 
            options: ["10 marks", "15 marks", "20 marks"],
            correct: 1,
            feedback: [
                "385 - 370 is more than 10.",
                "Correct! Both Aug->Oct (385-370) and Oct->Dec (400-385) have an absolute increase of exactly 15 marks.",
                "Check the subtraction again. 385 - 370 = 15."
            ],
            visualAid: { type: 'highlight_points', indices: [2, 3, 4], alwaysShow: true }
          },
          { 
            id: "max-1", type: 'mcq', concept: "Calculate Aug -> Oct", 
            q: "Let's calculate the % increase for Aug to Oct.\nFormula: (Increase ÷ Starting Base) × 100\n\nEquation: (15 ÷ 370) × 100\nWhat is the % increase?", 
            options: ["3.89%", "4.05%", "4.50%"],
            correct: 1,
            feedback: [
                "That is the percentage for Oct to Dec.",
                "Exactly! 15 ÷ 370 = 0.0405, which is ~4.05%.",
                "That's a bit too high."
            ],
            visualAid: { type: 'show_difference', index1: 2, index2: 3, alwaysShow: true }
          },
          { 
            id: "max-2", type: 'mcq', concept: "Calculate Oct -> Dec", 
            q: "Now, let's calculate the % increase for Oct to Dec.\nThe starting base is now 385.\n\nEquation: (15 ÷ 385) × 100\nWhat is the % increase?", 
            options: ["3.89%", "4.05%", "4.50%"],
            correct: 0,
            feedback: [
                "Correct! 15 ÷ 385 = 0.0389, which is ~3.89%.",
                "That was the percentage for Aug to Oct.",
                "That's incorrect."
            ],
            visualAid: { type: 'show_difference', index1: 3, index2: 4, alwaysShow: true }
          },
          { 
            id: "max-3", type: 'mcq', concept: "The Golden Rule", 
            q: "Aug to Oct = 4.05%\nOct to Dec = 3.89%\n\nPRINCIPLE: When the absolute increase is the SAME, which period yields the HIGHER percentage increase?", 
            options: ["The period with the HIGHER starting base", "The period with the LOWER starting base", "They are always equal"],
            correct: 1,
            feedback: [
                "A higher base means you are dividing by a larger number, making the % smaller.",
                "Exactly! Dividing by a smaller starting base (370) yields a larger percentage.",
                "Percentage depends heavily on the starting value."
            ],
            visualAid: { type: 'highlight_points', indices: [2, 3, 4], alwaysShow: true }
          }
        ]
      },
      {
        id: 'aggregate',
        label: 'Aggregate %',
        objective: "Calculate the total aggregate percentage for multiple periods combined.",
        steps: [
          { 
            id: "agg-0", type: 'mcq', concept: "The Formula", 
            q: "What does 'Aggregate Percentage' mean for multiple exams combined?", 
            options: ["Average of the individual percentages", "(Sum of Marks Obtained ÷ Sum of Max Marks) × 100", "Sum of all Marks Obtained"],
            correct: 1,
            feedback: [
                "Averaging percentages can lead to mathematical errors if the bases are different.",
                "Spot on! Aggregate means combining all obtained marks and dividing by all possible maximum marks.",
                "That gives you the raw total, but not a percentage."
            ],
            visualAid: { type: 'highlight_points', indices: [2, 3], alwaysShow: true }
          },
          { 
            id: "agg-1", type: 'mcq', concept: "Find Total Obtained", 
            q: "Let's calculate the aggregate percentage for Aug-01 and Oct-01 taken together.\n\nFirst, what is the sum of marks obtained in these two encircled exams?", 
            options: ["755", "760", "770"],
            correct: 0,
            feedback: [
                "Correct! 370 (Aug) + 385 (Oct) = 755 total marks obtained.",
                "Check your addition: 370 + 385.",
                "Check your addition: 370 + 385."
            ],
            visualAid: { type: 'highlight_points', indices: [2, 3], alwaysShow: true }
          },
          { 
            id: "agg-2", type: 'mcq', concept: "Find Total Max", 
            q: "The chart subtitle states: 'Maximum Total Marks in each Periodical Exam = 500'.\n\nWhat is the Total Maximum Marks for TWO exams combined?", 
            options: ["500", "1000", "1500"],
            correct: 1,
            feedback: [
                "500 is the max for only ONE exam.",
                "Exactly! 500 + 500 = 1000 total possible marks.",
                "We are only combining two exams, not three."
            ],
            visualAid: { type: 'highlight_points', indices: [2, 3], alwaysShow: true }
          },
          { 
            id: "agg-3", type: 'mcq', concept: "Compute Aggregate %", 
            q: "We have our totals!\nObtained = 755\nMax Possible = 1000\n\nEquation: (755 ÷ 1000) × 100\nWhat is the aggregate percentage?", 
            options: ["75.5%", "76.5%", "151.0%"],
            correct: 0,
            feedback: [
                "Spot on! (755 ÷ 1000) × 100 = 75.5%. You mastered aggregates!",
                "Check your division.",
                "That is the sum of their individual percentages. You must divide by the combined base!"
            ],
            visualAid: { type: 'highlight_points', indices: [2, 3], alwaysShow: true } 
          }
        ]
      }
    ]
  },
  practice: [
    {
      title: "Average Revenue",
      text: "Analyze the monthly store revenue. Formula: Sum ÷ Count.",
      chartData: {
          title: "Monthly Store Revenue ($)",
          subtitle: "Maximum Target Capacity = 10,000 per month",
          xLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          values: [6000, 6500, 6800, 7000, 7300, 7500],
          yMin: 5000, yMax: 8000, yTickCount: 7, // 5000, 5500, 6000...
          xLabelTitle: "Months", yLabelTitle: "Revenue ($)"
      },
      mcq: {
          q: "What is the average revenue across all 6 months?",
          options: ["6750", "6850", "6950"], correct: 1, 
          explanation: "Sum = 6000 + 6500 + 6800 + 7000 + 7300 + 7500 = 41,100.\nAverage = 41100 ÷ 6 = 6850."
      },
      visualAid: { type: 'show_equation', index: 3, line1: "Sum = 41,100", line2: "41100 ÷ 6 = 6850" }
    },
    {
      title: "Revenue Ratios",
      text: "Compare specific monthly values.",
      chartData: {
          title: "Monthly Store Revenue ($)",
          subtitle: "Maximum Target Capacity = 10,000 per month",
          xLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          values: [6000, 6500, 6800, 7000, 7300, 7500],
          yMin: 5000, yMax: 8000, yTickCount: 7,
          xLabelTitle: "Months", yLabelTitle: "Revenue ($)"
      },
      mcq: {
          q: "What is the simplified ratio of revenue in Feb (6500) to Mar (6800)?",
          options: ["65 : 68", "68 : 65", "13 : 14"], correct: 0, 
          explanation: "Ratio = 6500 : 6800.\nDivide both sides by 100 to simplify.\nResult = 65 : 68."
      },
      visualAid: { type: 'show_equation', index: 2, line1: "6500 : 6800", line2: "Simplified = 65 : 68" }
    },
    {
      title: "Direct Percentage",
      text: "Compare the current value against a past benchmark.",
      chartData: {
          title: "Monthly Store Revenue ($)",
          subtitle: "Maximum Target Capacity = 10,000 per month",
          xLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          values: [6000, 6500, 6800, 7000, 7300, 7500],
          yMin: 5000, yMax: 8000, yTickCount: 7,
          xLabelTitle: "Months", yLabelTitle: "Revenue ($)"
      },
      mcq: {
          q: "The revenue in Jun (7500) is what percent of the revenue in Jan (6000)?",
          options: ["115%", "120%", "125%"], correct: 2, 
          explanation: "Percentage = (Jun ÷ Jan) × 100\n= (7500 ÷ 6000) × 100 = 1.25 × 100 = 125%."
      },
      visualAid: { type: 'show_equation', index: 4, line1: "(7500 ÷ 6000) × 100", line2: "= 125%" }
    },
    {
      title: "Max Percentage Growth",
      text: "Identify the steepest relative growth using the base rule.",
      chartData: {
          title: "Monthly Store Revenue ($)",
          subtitle: "Maximum Target Capacity = 10,000 per month",
          xLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          values: [6000, 6500, 6800, 7000, 7300, 7500],
          yMin: 5000, yMax: 8000, yTickCount: 7,
          xLabelTitle: "Months", yLabelTitle: "Revenue ($)"
      },
      mcq: {
          q: "Notice Mar->Apr (+200) and May->Jun (+200) have the SAME absolute increase.\n\nWithout using a calculator, which period had the HIGHER *percentage* increase?",
          options: ["Mar to Apr", "May to Jun", "They are identical"], correct: 0, 
          explanation: "Rule: When absolute increase is identical, the period with the LOWER starting base has the HIGHER percentage increase. Mar (6800) < May (7300)."
      },
      visualAid: { type: 'show_difference', index1: 2, index2: 3, val1: 6800, val2: 7000 }
    },
    {
      title: "Aggregate Percentage",
      text: "Calculate total performance against combined targets.",
      chartData: {
          title: "Monthly Store Revenue ($)",
          subtitle: "Maximum Target Capacity = 10,000 per month",
          xLabels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
          values: [6000, 6500, 6800, 7000, 7300, 7500],
          yMin: 5000, yMax: 8000, yTickCount: 7,
          xLabelTitle: "Months", yLabelTitle: "Revenue ($)"
      },
      mcq: {
          q: "What is the aggregate revenue percentage for Apr and May combined compared to their total targets?",
          options: ["71.5%", "73.0%", "143.0%"], correct: 0, 
          explanation: "Total Revenue = 7000 (Apr) + 7300 (May) = 14,300.\nTotal Max Target = 10,000 + 10,000 = 20,000.\nAggregate % = (14300 ÷ 20000) × 100 = 71.5%."
      },
      visualAid: { type: 'show_equation', index: 3, line1: "14300 ÷ 20000 × 100", line2: "= 71.5%" }
    }
  ]
};

function LabContent() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept');
  
  // App State for Steps
  const [conceptTabIndex, setConceptTabIndex] = useState(0);
  const [conceptStep, setConceptStep] = useState(0);
  const [practiceStep, setPracticeStep] = useState(0);
  
  const [lessonFinished, setLessonFinished] = useState(false);
  const [showFinishModal, setShowFinishModal] = useState(false);
  const containerRef = useRef(null);

  // MCQ State
  const [quizSelection, setQuizSelection] = useState(null);
  const [quizFeedbackMode, setQuizFeedbackMode] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [shuffledIndices, setShuffledIndices] = useState([0, 1, 2]);

  const currentData = appMode === 'concept' ? SCENARIOS.concept.chartData : SCENARIOS.practice[practiceStep].chartData;
  
  // Resolve current info block based on mode
  let currentStepInfo;
  let currentObjective = "";
  if (appMode === 'concept') {
      const activeTab = SCENARIOS.concept.tabs[conceptTabIndex];
      currentStepInfo = activeTab.steps[conceptStep];
      currentObjective = activeTab.objective;
  } else {
      currentStepInfo = SCENARIOS.practice[practiceStep];
  }
  
  const { yMin, yMax, yTickCount, xLabels, values, xLabelTitle, yLabelTitle, subtitle } = currentData;

  // Initialization & Reset when Drill/Mode/Tab changes
  useEffect(() => {
      setQuizSelection(null);
      setQuizFeedbackMode(false);
      setShowExplanation(false);
  }, [appMode, practiceStep, conceptTabIndex, conceptStep]); 

  // Handle MCQ Shuffle for Questions
  useEffect(() => {
      const currentMCQ = appMode === 'concept' ? (currentStepInfo.type === 'mcq' ? currentStepInfo : null) : currentStepInfo.mcq;
          
      if (currentMCQ?.options) {
          const arr = Array.from({length: currentMCQ.options.length}, (_, i) => i);
          for (let i = arr.length - 1; i > 0; i--) {
              const j = Math.floor(Math.random() * (i + 1));
              [arr[i], arr[j]] = [arr[j], arr[i]];
          }
          setShuffledIndices(arr);
      }
  }, [appMode, conceptStep, practiceStep, currentStepInfo]);

  function handleReset(overrideMode = appMode) {
    setConceptTabIndex(0);
    setConceptStep(0);
    setPracticeStep(0);
    setLessonFinished(false);
    setShowFinishModal(false);
    setQuizSelection(null);
    setQuizFeedbackMode(false);
    setShowExplanation(false);
  }

  function handleSetMode(mode) {
    setAppMode(mode);
    handleReset(mode);
  }

  // ==========================================
  // CHART RENDERING LOGIC
  // ==========================================

  const chartWidth = 400;
  const chartHeight = 250;
  const padLeft = 55; // Increased to fit larger numbers like "6000"
  const padBottom = 35;
  const padTop = 20;
  const padRight = 20;
  const drawWidth = chartWidth - padLeft - padRight;
  const drawHeight = chartHeight - padTop - padBottom;
  const originX = padLeft;
  const originY = chartHeight - padBottom;

  // Calculate coordinates
  const points = values.map((val, idx) => {
      const x = originX + ((idx + 0.5) * (drawWidth / xLabels.length));
      const yRatio = (val - yMin) / (yMax - yMin);
      const y = originY - (yRatio * drawHeight);
      return { x, y, val, label: xLabels[idx], idx };
  });

  const pathD = points.length > 0 ? `M ${points.map(p => `${p.x} ${p.y}`).join(' L ')}` : "";

  // Visual Aids Calculation
  let visualAidNode = null;
  const isConceptTeach = appMode === 'concept' && currentStepInfo.type === 'teach';
  const currentMCQ = appMode === 'concept' ? (currentStepInfo.type === 'mcq' ? currentStepInfo : null) : currentStepInfo.mcq;
  const isCorrectAnswer = quizFeedbackMode && currentMCQ && quizSelection === currentMCQ.correct;
  
  const aid = currentStepInfo.visualAid;
  const shouldShowVisualAid = aid?.alwaysShow || isConceptTeach || isCorrectAnswer || showExplanation;
  
  if (shouldShowVisualAid && aid) {
      if (aid.type === 'highlight_point' || aid.type === 'show_equation') {
          const p = points[aid.index];
          visualAidNode = (
              <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  <circle cx={p.x} cy={p.y} r="14" fill="none" stroke="#4ade80" strokeWidth="3" strokeDasharray="4 4" className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
              </motion.g>
          );
      } else if (aid.type === 'highlight_points') {
          visualAidNode = (
              <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  {aid.indices.map(idx => {
                      const p = points[idx];
                      return <circle key={`hp-${idx}`} cx={p.x} cy={p.y} r="14" fill="none" stroke="#4ade80" strokeWidth="3" strokeDasharray="4 4" className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
                  })}
              </motion.g>
          );
      } else if (aid.type === 'highlight_segment') {
          const p1 = points[aid.startIndex];
          const p2 = points[aid.endIndex];
          visualAidNode = (
              <motion.g initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
                  <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#4ade80" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
              </motion.g>
          );
      } else if (aid.type === 'show_difference') {
          const p1 = points[aid.index1];
          const p2 = points[aid.index2];
          const highP = p1.y < p2.y ? p1 : p2;
          const lowP = p1.y > p2.y ? p1 : p2;

          visualAidNode = (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  <circle cx={p1.x} cy={p1.y} r="14" fill="none" stroke="#4ade80" strokeWidth="3" strokeDasharray="4 4" className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: `${p1.x}px ${p1.y}px` }} />
                  <circle cx={p2.x} cy={p2.y} r="14" fill="none" stroke="#4ade80" strokeWidth="3" strokeDasharray="4 4" className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: `${p2.x}px ${p2.y}px` }} />
                  <line x1={lowP.x} y1={lowP.y} x2={highP.x} y2={lowP.y} stroke="#4ade80" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1={highP.x} y1={lowP.y} x2={highP.x} y2={highP.y} stroke="#4ade80" strokeWidth="4" />
                  <line x1={highP.x - 6} y1={lowP.y} x2={highP.x + 6} y2={lowP.y} stroke="#4ade80" strokeWidth="3" />
                  <line x1={highP.x - 6} y1={highP.y} x2={highP.x + 6} y2={highP.y} stroke="#4ade80" strokeWidth="3" />
              </motion.g>
          );
      }
  }

  // Interaction Handlers
  const handleQuizSelection = (idx) => {
      setQuizSelection(idx);
      setQuizFeedbackMode(true);
      setShowExplanation(false);
  };

  const handleNextStep = () => {
      if (appMode === 'concept') {
          const currentTab = SCENARIOS.concept.tabs[conceptTabIndex];
          if (conceptStep < currentTab.steps.length - 1) {
              setConceptStep(conceptStep + 1);
          } else if (conceptTabIndex < SCENARIOS.concept.tabs.length - 1) {
              setConceptTabIndex(conceptTabIndex + 1);
              setConceptStep(0);
          } else {
              setLessonFinished(true);
          }
      } else {
          handleNextPracticeDrill();
      }
  };

  const handlePrevStep = () => {
      if (appMode === 'concept') {
          if (conceptStep > 0) {
              setConceptStep(conceptStep - 1);
              setQuizSelection(null);
              setQuizFeedbackMode(false);
              setShowExplanation(false);
          } else if (conceptTabIndex > 0) {
              setConceptTabIndex(conceptTabIndex - 1);
              setConceptStep(SCENARIOS.concept.tabs[conceptTabIndex - 1].steps.length - 1);
              setQuizSelection(null);
              setQuizFeedbackMode(false);
              setShowExplanation(false);
          }
      }
  };

  const handleNextPracticeDrill = () => {
      if (practiceStep < SCENARIOS.practice.length - 1) {
          setPracticeStep(practiceStep + 1);
          setQuizSelection(null);
          setQuizFeedbackMode(false);
          setShowExplanation(false);
      } else {
          setLessonFinished(true);
          setShowFinishModal(true);
      }
  }

  return (
    <div className="h-screen w-full bg-[#e6dccb] flex flex-col select-none font-sans text-[14px] overflow-hidden" ref={containerRef}>
      <div className="absolute inset-0 opacity-[0.1] pointer-events-none fixed bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

      <HeaderSection onBack={() => navigate(-1)} title="Mixed Concepts Lab" appMode={appMode} setAppMode={handleSetMode} onReset={() => handleReset(appMode)} />

      <main className="flex-1 flex flex-col gap-2 sm:gap-3 p-2 sm:p-3 w-full max-w-5xl mx-auto relative z-10 overflow-hidden">
        
        {/* Div 1: The Chart Viewer (TOP AREA - 50% split) */}
        <div className="w-full flex-1 flex flex-col bg-[#2a1a16] p-3 sm:p-4 rounded-2xl border-[3px] sm:border-4 border-black shadow-xl items-center min-h-[250px] relative overflow-hidden">
            
            <div className="w-full flex flex-col items-center gap-2 h-full max-w-[700px]">
                
                {/* Data Title Overlay Above Chart */}
                <div className="flex flex-col items-center mb-1 shrink-0 px-4">
                    <div className="text-white/80 font-black text-[11px] sm:text-[13px] uppercase tracking-widest text-center leading-tight">
                        {currentData.title}
                    </div>
                    {subtitle && (
                        <div className="text-yellow-400/80 font-bold text-[10px] sm:text-[11px] uppercase tracking-wider text-center mt-0.5">
                            {subtitle}
                        </div>
                    )}
                </div>
                
                {/* SVG Chart Area */}
                <div className={`relative bg-[#3e2723] rounded-xl border-[3px] ${shouldShowVisualAid ? 'border-green-400 shadow-[0_0_20px_rgba(74,222,128,0.2)]' : 'border-yellow-500/30'} shadow-inner w-full max-w-[600px] flex-1 flex flex-col items-center justify-center transition-all duration-500`}>
                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full drop-shadow-md overflow-visible py-2">
                        
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
                                return <text key={`yl-${i}`} x={originX - 8} y={y} fill="#a88a6d" fontSize="10" fontWeight="bold" textAnchor="end" dominantBaseline="central">{parseFloat(val.toFixed(2))}</text>;
                            })}

                            {/* X Labels */}
                            {points.map((p, i) => {
                                let isHighlightedYear = false;
                                if (shouldShowVisualAid && aid) {
                                    if ((aid.type === 'highlight_point' || aid.type === 'show_equation') && aid.index === i) isHighlightedYear = true;
                                    if (aid.type === 'highlight_points' && aid.indices && aid.indices.includes(i)) isHighlightedYear = true;
                                    if (aid.type === 'highlight_segment' && (i >= aid.startIndex && i <= aid.endIndex)) isHighlightedYear = true;
                                    if (aid.type === 'show_difference' && (aid.index1 === i || aid.index2 === i)) isHighlightedYear = true;
                                }

                                return (
                                    <g key={`xl-${i}`}>
                                        {isHighlightedYear && (
                                            <rect x={p.x - 22} y={originY + 4} width="44" height="18" rx="8" fill="#4ade80" opacity="0.25" stroke="#4ade80" strokeWidth="1" />
                                        )}
                                        <text x={p.x} y={originY + 16} fill={isHighlightedYear ? "#4ade80" : "#a88a6d"} fontSize="9" fontWeight="bold" textAnchor="middle">{p.label}</text>
                                    </g>
                                )
                            })}

                            {/* Axis Titles */}
                            <text x={originX + drawWidth/2} y={chartHeight - 4} fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" opacity="0.6" tracking="wider">{xLabelTitle.toUpperCase()}</text>
                            <text x={12} y={originY - drawHeight/2} fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" transform={`rotate(-90 12 ${originY - drawHeight/2})`} opacity="0.6" tracking="wider">{yLabelTitle.toUpperCase()}</text>
                        </g>

                        {/* The Connecting Line */}
                        <path 
                            d={pathD} 
                            fill="none" 
                            stroke={shouldShowVisualAid ? "#4ade80" : "#fbbf24"} 
                            strokeWidth="4" 
                            strokeLinecap="round" 
                            strokeLinejoin="round" 
                            style={{ filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.5))" }}
                        />

                        {/* Static & Highlighted Points */}
                        {points.map((p, i) => {
                            let isHighlightedPoint = false;
                            if (shouldShowVisualAid && aid) {
                                if ((aid.type === 'highlight_point' || aid.type === 'show_equation') && aid.index === i) isHighlightedPoint = true;
                                if (aid.type === 'highlight_points' && aid.indices && aid.indices.includes(i)) isHighlightedPoint = true;
                                if (aid.type === 'highlight_segment' && (i >= aid.startIndex && i <= aid.endIndex)) isHighlightedPoint = true;
                                if (aid.type === 'show_difference' && (aid.index1 === i || aid.index2 === i)) isHighlightedPoint = true;
                            }
                            
                            let pointColor = isHighlightedPoint ? "#4ade80" : "#f8fafc";
                            
                            return (
                                <g key={`p-${i}`}>                                    
                                    <circle 
                                        cx={p.x} 
                                        cy={p.y} 
                                        r="6" 
                                        fill={pointColor} 
                                        stroke="#3e2723" 
                                        strokeWidth="2" 
                                        style={{ filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.5))", pointerEvents: "none" }} 
                                    />
                                    <text 
                                        x={p.x} y={p.y - 10} 
                                        fill={pointColor} 
                                        fontSize="10" 
                                        fontWeight="bold" 
                                        textAnchor="middle"
                                        style={{ pointerEvents: "none" }}
                                    >
                                        {parseFloat(p.val.toFixed(2))}
                                    </text>
                                </g>
                            )
                        })}
                        
                        {/* Visual Aid (Rendered LAST so it appears ON TOP) */}
                        {visualAidNode}
                    </svg>
                </div>
            </div>
        </div>

        {/* Div 2: Guidance Panels (BOTTOM AREA - 50% split) */}
        <div className="w-full flex-1 flex flex-col min-h-[250px] bg-[#3e2723] p-3 sm:p-4 rounded-2xl border-[3px] sm:border-4 border-black shadow-2xl relative overflow-hidden">
          <div className="absolute inset-0 opacity-[0.25] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/wood-pattern.png')]" />

          <div className="w-full max-w-4xl mx-auto h-full relative z-10 flex flex-col">

            <div className="flex flex-col bg-[#2a1a16]/95 p-4 sm:p-5 rounded-xl border-2 border-black/50 shadow-lg h-full relative overflow-hidden">
                <div className="flex-1 overflow-y-auto custom-scrollbar pr-1 sm:pr-2">
                    <AnimatePresence mode='wait'>
                        
                        {/* STATE 1: Lesson Finished */}
                        {lessonFinished && appMode === 'concept' ? (
                            <motion.div key="concept-finished" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center h-full text-center gap-4 min-h-[200px]">
                                <Trophy size={60} className="text-yellow-400 opacity-50" />
                                <h3 className="text-white text-[18px] sm:text-[22px] font-black uppercase tracking-widest">Concept Mastered!</h3>
                                <p className="text-white/70 text-[13px] sm:text-[15px] tracking-tight leading-snug px-4 max-w-md">You successfully learned how to extract averages, calculate ratios, and compute various percentages from a single line chart.</p>
                                <button onClick={() => handleSetMode('practice')} className="bg-green-600 text-white px-6 py-3 rounded-full font-black uppercase shadow-xl tracking-widest text-[13px] sm:text-[14px] hover:scale-105 transition-all mt-2">
                                    Start Practice Drills
                                </button>
                            </motion.div>
                        ) : (
                            /* STATE 2A: Concept Mode (Tabs + Content) */
                            appMode === 'concept' ? (
                                <motion.div key={`panel-concept-${conceptTabIndex}-${conceptStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col sm:flex-row gap-4 h-full">
                                    
                                    {/* Left: Tabs Header */}
                                    <div className="flex flex-row sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto hide-scrollbar sm:w-[150px] shrink-0 border-b sm:border-b-0 sm:border-r border-white/10 pb-2 sm:pb-0 sm:pr-3">
                                        {SCENARIOS.concept.tabs.map((tab, idx) => (
                                            <button
                                              key={tab.id}
                                              onClick={() => { setConceptTabIndex(idx); setConceptStep(0); setQuizSelection(null); setQuizFeedbackMode(false); }}
                                              className={`px-3 py-2.5 rounded-lg text-[11px] sm:text-[12px] font-black uppercase tracking-wider whitespace-nowrap sm:whitespace-normal text-left transition-all ${
                                                conceptTabIndex === idx ? 'bg-indigo-600 text-white shadow-md' : 'bg-black/20 text-white/50 hover:text-white hover:bg-black/40'
                                              }`}
                                            >
                                              {tab.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Right: Content Step */}
                                    <div className="flex flex-col flex-1 min-w-0">
                                        
                                        {/* Highlighted Objective Block */}
                                        <div className="bg-indigo-900/40 border border-indigo-500/50 p-2.5 sm:p-3 rounded-lg mb-3 flex gap-2.5 items-start shadow-sm relative">
                                            {(conceptStep > 0 || conceptTabIndex > 0) && (
                                                <button onClick={handlePrevStep} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-indigo-400 hover:text-white hover:bg-indigo-500/30 transition-colors">
                                                    <ChevronLeft size={20} />
                                                </button>
                                            )}
                                            <div className={`flex gap-3 items-start ${ (conceptStep > 0 || conceptTabIndex > 0) ? 'ml-8' : ''}`}>
                                                <Target size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                                                <div className="flex flex-col">
                                                    <span className="text-indigo-400 uppercase tracking-widest text-[10px] font-black mb-0.5">Objective</span>
                                                    <span className="text-indigo-50 text-[12px] sm:text-[13px] leading-snug font-medium">
                                                        {currentObjective}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Step Title */}
                                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                                            {currentStepInfo.type === 'mcq' ? <Compass size={14} className="text-yellow-400"/> : <BookOpen size={14} className="text-yellow-400"/>}
                                            <span className="text-yellow-400 font-black text-[12px] sm:text-[13px] uppercase tracking-widest leading-none">
                                                Step {conceptStep + 1}: {currentStepInfo.concept}
                                            </span>
                                        </div>

                                        {currentStepInfo.type === 'mcq' ? (
                                            /* Concept MCQ Form */
                                            <div className="flex flex-col flex-1">
                                                <p className="text-white font-bold text-[13px] sm:text-[15px] leading-relaxed tracking-tight mb-4 whitespace-pre-line">
                                                    {currentStepInfo.q}
                                                </p>

                                                <div className="flex flex-col gap-2 mb-4">
                                                    {shuffledIndices.map((origIdx) => {
                                                        const opt = currentStepInfo.options[origIdx];
                                                        const isCorrect = quizFeedbackMode && origIdx === currentStepInfo.correct;
                                                        const isWrong = quizFeedbackMode && origIdx === quizSelection && origIdx !== currentStepInfo.correct;
                                                        
                                                        let btnClass = "bg-black/40 border border-white/10 text-white hover:bg-black/60 hover:scale-[1.02] active:scale-95";
                                                        if (isCorrect) btnClass = "bg-green-600 border-green-400 text-white shadow-lg scale-[1.02]";
                                                        else if (isWrong) btnClass = "bg-red-600 border-red-400 text-white shadow-lg";
                                                        
                                                        return (
                                                            <button 
                                                                key={origIdx} 
                                                                disabled={quizFeedbackMode}
                                                                onClick={() => handleQuizSelection(origIdx)} 
                                                                className={`w-full py-3 px-4 rounded-lg font-black uppercase text-[12px] sm:text-[13px] tracking-wider transition-all shadow-md border-[2px] text-left ${btnClass}`}
                                                            >
                                                                {opt}
                                                            </button>
                                                        );
                                                    })}
                                                </div>

                                                {/* Feedback Footer Area (Post Answer) */}
                                                <div className="mt-auto pt-2 flex flex-col justify-end min-h-[60px]">
                                                    {quizFeedbackMode && !isCorrectAnswer && (
                                                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-center gap-3 w-full">
                                                            <p className="text-rose-400 text-[12px] sm:text-[13px] font-bold italic flex-1 text-center sm:text-left">
                                                                {`"${currentStepInfo.feedback[quizSelection]}"`}
                                                            </p>
                                                            <button onClick={() => { setQuizFeedbackMode(false); setQuizSelection(null); }} className="w-full sm:w-auto py-2.5 px-6 rounded-full font-black uppercase text-[11px] sm:text-[12px] tracking-widest transition-all bg-rose-600 text-white border-2 border-rose-400 hover:scale-105 active:scale-95 shrink-0">
                                                                Try Again
                                                            </button>
                                                        </motion.div>
                                                    )}

                                                    {isCorrectAnswer && (
                                                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-center gap-3 w-full">
                                                            <div className="bg-green-400/10 py-2 px-4 rounded-lg border border-green-500/20 flex gap-2 items-center justify-center flex-1">
                                                                <CheckCircle className="text-green-400 shrink-0" size={16} />
                                                                <span className="text-green-400 font-black uppercase text-[12px] tracking-widest">Logic Correct!</span>
                                                            </div>
                                                            <button onClick={handleNextStep} className="w-full sm:w-auto py-2.5 px-6 rounded-full font-black uppercase text-[11px] sm:text-[12px] tracking-widest transition-all bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)] border-2 border-green-400 hover:scale-105 active:scale-95 flex justify-center items-center gap-1.5 shrink-0">
                                                                {conceptStep === SCENARIOS.concept.tabs[conceptTabIndex].steps.length - 1 && conceptTabIndex === SCENARIOS.concept.tabs.length - 1 ? 'Finish' : 'Continue'}
                                                                <ArrowRight size={14} />
                                                            </button>
                                                        </motion.div>
                                                    )}
                                                </div>
                                            </div>
                                        ) : (
                                            /* Teach Form */
                                            <div className="flex flex-col flex-1">
                                                <div className="bg-indigo-500/10 border-2 border-indigo-500/30 p-4 rounded-xl shadow-inner mb-4 flex-1">
                                                     <p className="text-indigo-100 font-medium text-[13px] sm:text-[15px] leading-relaxed tracking-wide whitespace-pre-line">
                                                         {currentStepInfo.instruction}
                                                     </p>
                                                </div>
                                                
                                                {/* Navigation Footer */}
                                                <div className="mt-auto pt-2 flex flex-col sm:flex-row justify-end w-full">
                                                    <motion.button initial={{opacity:0, y:5}} animate={{opacity:1, y:0}} onClick={handleNextStep} className="w-full sm:w-auto py-3 px-8 rounded-full font-black uppercase text-[12px] sm:text-[13px] tracking-widest transition-all bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)] border-2 border-green-400 hover:scale-105 active:scale-95 flex justify-center items-center gap-2">
                                                        {currentStepInfo.actionButtonText || 'Continue'}
                                                        <ArrowRight size={16} />
                                                    </motion.button>
                                                </div>
                                            </div>
                                        )}

                                    </div>
                                </motion.div>
                            ) : (
                                /* STATE 2B: Practice Mode (MCQ without tabs) */
                                <motion.div key={`panel-practice-${practiceStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col gap-4 h-full">
                                    <div className="flex items-center justify-between border-b border-white/10 pb-3 mb-1">
                                        <span className="text-yellow-400 font-black text-[12px] sm:text-[13px] uppercase tracking-widest flex items-center gap-2">
                                            <Target size={16}/> Drill {practiceStep + 1}: {currentStepInfo.title}
                                        </span>
                                        <span className="text-white/40 font-black text-[10px] uppercase tracking-widest hidden sm:block">
                                            Practice Analysis
                                        </span>
                                    </div>

                                    <div className="flex flex-col h-full">
                                        <p className="text-white/70 font-medium text-[12px] sm:text-[13px] leading-relaxed mb-2">
                                            {currentStepInfo.text}
                                        </p>
                                        <p className="text-white font-bold text-[14px] sm:text-[16px] leading-snug tracking-tight mb-4 whitespace-pre-line">
                                            {currentStepInfo.mcq.q}
                                        </p>

                                        <div className="flex flex-col gap-2 mb-4">
                                            {shuffledIndices.map((origIdx) => {
                                                const opt = currentStepInfo.mcq.options[origIdx];
                                                const isCorrect = quizFeedbackMode && origIdx === currentStepInfo.mcq.correct;
                                                const isWrong = quizFeedbackMode && origIdx === quizSelection && origIdx !== currentStepInfo.mcq.correct;
                                                
                                                let btnClass = "bg-black/40 border border-white/10 text-white hover:bg-black/60 hover:scale-[1.02] active:scale-95";
                                                if (isCorrect) btnClass = "bg-green-600 border-green-400 text-white shadow-lg scale-[1.02]";
                                                else if (isWrong) btnClass = "bg-red-600 border-red-400 text-white shadow-lg";
                                                
                                                return (
                                                    <button 
                                                        key={origIdx} 
                                                        disabled={quizFeedbackMode}
                                                        onClick={() => handleQuizSelection(origIdx)} 
                                                        className={`w-full py-3 px-4 rounded-xl font-black uppercase text-[12px] sm:text-[13px] tracking-wider transition-all shadow-md border-[2px] text-left ${btnClass}`}
                                                    >
                                                        {opt}
                                                    </button>
                                                );
                                            })}
                                        </div>

                                        {/* Explanation Section (Expands within the panel) */}
                                        <AnimatePresence>
                                            {showExplanation && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -10, height: 0 }}
                                                    animate={{ opacity: 1, y: 0, height: 'auto' }}
                                                    exit={{ opacity: 0, y: -10, height: 0 }}
                                                    className="flex-shrink-0 mb-4"
                                                >
                                                    <div className="bg-indigo-500/10 border-2 border-indigo-500/30 p-3 sm:p-4 rounded-xl shadow-inner flex gap-3 items-start">
                                                        <Info size={18} className="text-indigo-400 shrink-0 mt-0.5"/>
                                                        <div className="flex flex-col">
                                                            <span className="text-indigo-400 font-black uppercase text-[10px] tracking-widest mb-1">Explanation</span>
                                                            <p className="text-indigo-100 text-[12px] sm:text-[13px] font-medium leading-relaxed whitespace-pre-line">
                                                                {currentStepInfo.mcq.explanation}
                                                            </p>
                                                        </div>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>

                                        {/* Feedback Footer Area */}
                                        <div className="mt-auto pt-2 min-h-[60px] flex flex-col justify-end">
                                            {quizFeedbackMode && !isCorrectAnswer && (
                                                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-center gap-3">
                                                    <p className="text-rose-400 text-[12px] sm:text-[13px] font-bold italic w-full text-center sm:text-left flex-1">
                                                        "Not quite right. Check your math again."
                                                    </p>
                                                    <div className="flex gap-2 w-full sm:w-auto shrink-0">
                                                        <button onClick={() => { setQuizFeedbackMode(false); setQuizSelection(null); setShowExplanation(false); }} className="flex-1 sm:flex-none py-2.5 px-4 rounded-full font-black uppercase text-[11px] sm:text-[12px] tracking-widest transition-all bg-rose-600 text-white border-2 border-rose-400 hover:scale-105 active:scale-95">
                                                            Try Again
                                                        </button>
                                                        {!showExplanation && (
                                                            <button onClick={() => setShowExplanation(true)} className="flex-1 sm:flex-none py-2.5 px-4 rounded-full font-black uppercase text-[11px] sm:text-[12px] tracking-widest transition-all bg-indigo-600 text-white border-2 border-indigo-400 hover:scale-105 active:scale-95">
                                                                Explain
                                                            </button>
                                                        )}
                                                    </div>
                                                </motion.div>
                                            )}

                                            {isCorrectAnswer && (
                                                <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-center gap-3">
                                                    <div className="bg-green-400/10 py-2 px-4 rounded-xl border border-green-500/20 flex gap-2 items-center justify-center w-full sm:w-auto flex-1">
                                                        <CheckCircle className="text-green-400 shrink-0" size={18} />
                                                        <span className="text-green-400 font-black uppercase text-[12px] sm:text-[13px] tracking-widest">Correct!</span>
                                                    </div>
                                                    <div className="flex gap-2 w-full sm:w-auto shrink-0">
                                                        {!showExplanation && (
                                                            <button onClick={() => setShowExplanation(true)} className="flex-1 sm:flex-none py-2.5 px-4 rounded-full font-black uppercase text-[11px] sm:text-[12px] tracking-widest transition-all bg-indigo-600 text-white border-2 border-indigo-400 hover:scale-105 active:scale-95">
                                                                Explain
                                                            </button>
                                                        )}
                                                        <button onClick={handleNextPracticeDrill} className="flex-1 sm:flex-none py-2.5 px-4 rounded-full font-black uppercase text-[11px] sm:text-[12px] tracking-widest transition-all bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)] border-2 border-green-400 hover:scale-105 active:scale-95 flex justify-center items-center gap-1.5">
                                                            {practiceStep === SCENARIOS.practice.length - 1 ? 'Finish' : 'Next'}
                                                            <ArrowRight size={14} />
                                                        </button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            )
                        )}

                    </AnimatePresence>
                </div>
            </div>

          </div>
        </div>

      </main>

      {/* Custom Alert Overlay for Finishing the Practice Laboratory */}
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
                          You have successfully mastered Chart Reading!
                      </p>
                  </div>
                  <div className="flex flex-col sm:flex-row gap-3 w-full mt-4">
                     <button onClick={() => { handleReset('concept'); setShowFinishModal(false); }} className="w-full py-4 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-black uppercase text-[14px] tracking-wider transition-all shadow-lg active:scale-95">Restart Lab</button>
                     <button onClick={() => setShowFinishModal(false)} className="w-full py-4 rounded-xl bg-green-600 hover:bg-green-500 text-white font-black uppercase text-[14px] tracking-wider transition-all shadow-lg active:scale-95 shadow-[0_0_15px_rgba(34,197,94,0.3)]">Close Menu</button>
                  </div>
                  <button onClick={() => setShowFinishModal(false)} className="absolute top-4 right-4 text-white/50 hover:text-white transition-colors">
                      <X size={24} />
                  </button>
               </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

      <style dangerouslySetInnerHTML={{ __html: `
        .hide-scrollbar::-webkit-scrollbar { display: none; }
        .hide-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
        .custom-scrollbar::-webkit-scrollbar { height: 8px; width: 6px; }
        .custom-scrollbar::-webkit-scrollbar-track { background: rgba(0,0,0,0.1); border-radius: 10px; margin: 0 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb { background: #a88a6d; border-radius: 10px; }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover { background: #d4b595; }
      `}} />
    </div>
  );
}

export default function App() { return ( <Router> <LabContent /> </Router> ); }