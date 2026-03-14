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
  MousePointer2,
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
          <div className="flex bg-black/50 p-1 rounded-lg border border-white/10 shadow-inner">
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
    coreDefinition: {
        title: "Concept: Profit Line Charts",
        text: "Some line charts plot complex formulas like Profit %!\n\n• Formula: % Profit = [(Income - Exp) ÷ Exp] × 100\n• We can extract averages, calculate percentage changes, and compute missing base values using this formula."
    },
    chartData: {
      title: "Percent Profit Earned by a Company Over the Years",
      xLabels: ["1995", "1996", "1997", "1998", "1999", "2000"],
      values: [40, 55, 45, 65, 70, 60],
      yMin: 10, yMax: 80, yTickCount: 8, // 10, 20, 30, 40, 50, 60, 70, 80
      xLabelTitle: "Years", yLabelTitle: "% Profit"
    },
    tabs: [
      {
        id: 'average',
        label: 'Average Profit',
        objective: "Calculate the average profit across all given years.",
        steps: [
          { 
            id: "avg-0", type: 'teach', concept: "Finding Values", 
            instruction: "To find an average, we need to sum up all the values and divide by the total number of years.\n\nObserve the encircled peak on the chart (1999). It shows the highest profit at 70%. Let's calculate the average for all 6 years.", 
            actionButtonText: "Calculate Average",
            visualAid: { type: 'highlight_point', index: 4, label: "PEAK: 70%" }
          },
          { 
            id: "avg-1", type: 'mcq', concept: "The Average Formula", 
            q: "We have 6 years of data: 40, 55, 45, 65, 70, and 60.\n\nHow do we calculate the average profit?", 
            options: ["Sum of all profits ÷ 6", "Sum of all profits × 6", "(Highest - Lowest) ÷ 2"],
            correct: 0,
            feedback: [
                "Correct! We add all 6 values together and divide by 6.",
                "Multiplying by 6 would give us a massive number!",
                "That formula calculates the median of the range, not the average of all points."
            ]
          },
          { 
            id: "avg-2", type: 'mcq', concept: "Compute the Average", 
            q: "Let's do the math!\n\nSum = 40 + 55 + 45 + 65 + 70 + 60 = 335.\n\nWhat is 335 ÷ 6 ?", 
            options: ["45.5%", "55.83%", "60.0%"],
            correct: 1,
            feedback: [
                "Check your division: 335 ÷ 6 is larger than 45.",
                "Perfect! 335 ÷ 6 = 55.83%. The average profit is 55.83%.",
                "60% is the profit for the year 2000, not the average."
            ],
            visualAid: { type: 'show_equation', index: 2, line1: "Sum = 335", line2: "335 ÷ 6 = 55.83%" } 
          }
        ]
      },
      {
        id: 'change',
        label: 'Percentage Change',
        objective: "Calculate the relative percentage increase between two consecutive years.",
        steps: [
          { 
            id: "chg-0", type: 'teach', concept: "Identify Points", 
            instruction: "Let's calculate how much the profit grew from 1995 to 1996.\n\nObserve the encircled data point for 1996. The profit was 40% in 1995, and it increased to 55% in 1996.", 
            actionButtonText: "Calculate Change",
            visualAid: { type: 'highlight_point', index: 1, label: "1996: 55%" }
          },
          { 
            id: "chg-1", type: 'mcq', concept: "Formula for % Change", 
            q: "To find the relative percentage change, we compare the difference to the ORIGINAL year's value.\n\nWhich formula correctly calculates the % increase from 1995 (40) to 1996 (55)?", 
            options: ["(55 - 40) ÷ 55 × 100", "(55 - 40) ÷ 40 × 100", "(55 + 40) ÷ 2 × 100"],
            correct: 1,
            feedback: [
                "You divided by the *new* value (55). We must divide by the *original* value (40).",
                "Exactly! Change = (Difference ÷ Original) × 100.",
                "That looks like an average calculation."
            ],
            visualAid: { type: 'show_equation', index: 1, line1: "% Change Formula", line2: "(Diff ÷ Orig) × 100" } 
          },
          { 
            id: "chg-2", type: 'mcq', concept: "Compute % Change", 
            q: "Let's execute the formula!\n\nEquation: [(55 - 40) ÷ 40] × 100\nThis becomes: (15 ÷ 40) × 100\n\nWhat is the percentage increase?", 
            options: ["15.0%", "27.5%", "37.5%"],
            correct: 2,
            feedback: [
                "15 is just the raw difference, not the percentage increase.",
                "Check your division: 15 / 40 = 0.375.",
                "Spot on! 0.375 × 100 = 37.5%. The profit margin grew by 37.5%!"
            ],
            visualAid: { type: 'show_equation', index: 1, line1: "15 ÷ 40 = 0.375", line2: "0.375 × 100 = 37.5%" } 
          }
        ]
      },
      {
        id: 'compute',
        label: 'Compute Values',
        objective: "Use the profit formula to find Expenditure when Income is known.",
        steps: [
          { 
            id: "comp-0", type: 'teach', concept: "Select Data Point", 
            instruction: "The formula is: % Profit = [(Inc - Exp) ÷ Exp] × 100.\n\nLet's analyze the year 1998. Observe the encircled data point for 1998. The chart confirms its profit is 65%.", 
            actionButtonText: "Set Up Equation",
            visualAid: { type: 'highlight_point', index: 3, label: "1998: 65%" }
          },
          { 
            id: "comp-1", type: 'mcq', concept: "Set Up Equation", 
            q: "Assume the problem states:\n'The INCOME in 1998 was Rs. 264 crores.'\n\nIf Profit is 65%, how do we substitute these numbers into our formula?", 
            options: ["65 = [(264 - Exp) ÷ 264] × 100", "65 = [(264 - Exp) ÷ Exp] × 100", "65 = [(Exp - 264) ÷ Exp] × 100"],
            correct: 1,
            feedback: [
                "The denominator must be Expenditure, not Income.",
                "Perfect! We substituted 65 for Profit and 264 for Income.",
                "Income comes first in the numerator: (Income - Expenditure)."
            ],
            visualAid: { type: 'show_equation', index: 3, line1: "% Profit = (I - E)÷E × 100", line2: "65 = (264 - E)÷E × 100" } 
          },
          { 
            id: "comp-2", type: 'mcq', concept: "Solve Expenditure", 
            q: "Equation: 0.65 = (264 - Exp) ÷ Exp\nMultiply by Exp: 0.65 × Exp = 264 - Exp\nAdd Exp to both sides: 1.65 × Exp = 264\n\nWhat is the Expenditure?", 
            options: ["160 crores", "180 crores", "200 crores"],
            correct: 0,
            feedback: [
                "Spot on! 264 ÷ 1.65 = 160. You've successfully reverse-engineered the Expenditure!",
                "Check the math: 264 ÷ 1.65 = 160.",
                "1.65 × 200 would be 330, which is too high."
            ],
            visualAid: { type: 'show_equation', index: 3, line1: "1.65 × Exp = 264", line2: "Exp = 160 crores" } 
          }
        ]
      }
    ]
  },
  practice: [
    {
      title: "Average Profit",
      text: "Analyze the 5-year profit data. Formula: Sum ÷ Count.",
      chartData: {
          xLabels: ["Y1", "Y2", "Y3", "Y4", "Y5"],
          values: [30, 50, 40, 60, 45],
          yMin: 0, yMax: 80, yTickCount: 5,
          xLabelTitle: "Years", yLabelTitle: "% Profit"
      },
      mcq: {
          q: "What is the average profit percentage across all 5 years?",
          options: ["40%", "45%", "50%"], correct: 1, 
          explanation: "Sum = 30 + 50 + 40 + 60 + 45 = 225.\nAverage = 225 ÷ 5 = 45%."
      },
      visualAid: { type: 'show_equation', index: 2, line1: "Sum = 225", line2: "225 ÷ 5 = 45%" }
    },
    {
      title: "Profit Increase",
      text: "Calculate the relative percentage growth.",
      chartData: {
          xLabels: ["Y1", "Y2", "Y3", "Y4", "Y5"],
          values: [30, 50, 40, 60, 45],
          yMin: 0, yMax: 80, yTickCount: 5,
          xLabelTitle: "Years", yLabelTitle: "% Profit"
      },
      mcq: {
          q: "What is the percentage INCREASE in profit from Y1 to Y2?\nHint: [(Y2 - Y1) ÷ Y1] × 100",
          options: ["20.0%", "40.0%", "66.67%"], correct: 2, 
          explanation: "Increase = (50 - 30) ÷ 30 × 100\n= (20 ÷ 30) × 100 = 66.67%."
      },
      visualAid: { type: 'show_equation', index: 1, line1: "(50 - 30) ÷ 30 = 0.666", line2: "0.666 × 100 = 66.67%" }
    },
    {
      title: "Profit Decrease",
      text: "Calculate the relative percentage drop.",
      chartData: {
          xLabels: ["Y1", "Y2", "Y3", "Y4", "Y5"],
          values: [30, 50, 40, 60, 45],
          yMin: 0, yMax: 80, yTickCount: 5,
          xLabelTitle: "Years", yLabelTitle: "% Profit"
      },
      mcq: {
          q: "What is the percentage DECREASE in profit from Y4 to Y5?",
          options: ["15%", "25%", "33.3%"], correct: 1, 
          explanation: "Decrease = (60 - 45) ÷ 60 × 100\n= (15 ÷ 60) × 100 = 25% drop."
      },
      visualAid: { type: 'show_equation', index: 4, line1: "(60 - 45) ÷ 60 = 0.25", line2: "0.25 × 100 = 25%" }
    },
    {
      title: "Compute Expenditure",
      text: "Formula: % Profit = [(Inc - Exp) ÷ Exp] × 100",
      chartData: {
          xLabels: ["Y1", "Y2", "Y3", "Y4", "Y5"],
          values: [30, 50, 40, 60, 45],
          yMin: 0, yMax: 80, yTickCount: 5,
          xLabelTitle: "Years", yLabelTitle: "% Profit"
      },
      mcq: {
          q: "In Y2, the profit is 50%. If the Income was Rs. 150 crores, what was the Expenditure?\nHint: 0.50 = (150 - Exp) ÷ Exp",
          options: ["75 crores", "100 crores", "125 crores"], correct: 1, 
          explanation: "0.50 × Exp = 150 - Exp\n1.50 × Exp = 150\nExp = 150 ÷ 1.50 = 100 crores."
      },
      visualAid: { type: 'show_equation', index: 1, line1: "1.50 × Exp = 150", line2: "Exp = 100" }
    },
    {
      title: "Compute Income",
      text: "Formula: % Profit = [(Inc - Exp) ÷ Exp] × 100",
      chartData: {
          xLabels: ["Y1", "Y2", "Y3", "Y4", "Y5"],
          values: [30, 50, 40, 60, 45],
          yMin: 0, yMax: 80, yTickCount: 5,
          xLabelTitle: "Years", yLabelTitle: "% Profit"
      },
      mcq: {
          q: "In Y4, the profit is 60%. If the Expenditure was Rs. 200 crores, what was the Income?\nHint: 0.60 = (Inc - 200) ÷ 200",
          options: ["320 crores", "260 crores", "120 crores"], correct: 0, 
          explanation: "0.60 × 200 = Inc - 200\n120 = Inc - 200\nInc = 120 + 200 = 320 crores."
      },
      visualAid: { type: 'show_equation', index: 3, line1: "120 = Inc - 200", line2: "Inc = 320" }
    }
  ]
};

export default function LabContent() {
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
  
  const { yMin, yMax, yTickCount, xLabels, values, xLabelTitle, yLabelTitle } = currentData;

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
  const chartHeight = 250; // Maintained taller height for 50/50 split
  const padLeft = 45;
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
  const isConceptInteractiveCompleted = appMode === 'concept' && currentStepInfo.type === 'interactive_point';
  const currentMCQ = appMode === 'concept' ? (currentStepInfo.type === 'mcq' ? currentStepInfo : null) : currentStepInfo.mcq;
  const isCorrectAnswer = quizFeedbackMode && currentMCQ && quizSelection === currentMCQ.correct;
  
  const shouldShowVisualAid = isConceptTeach || isConceptInteractiveCompleted || isCorrectAnswer || showExplanation;
  
  if (shouldShowVisualAid && currentStepInfo.visualAid) {
      const aid = currentStepInfo.visualAid;
      
      if (aid.type === 'highlight_point') {
          const p = points[aid.index];
          const isNearTop = p.y < padTop + 40;
          const boxY = isNearTop ? p.y + 25 : p.y - 45;
          const textY = isNearTop ? p.y + 40 : p.y - 30;
          
          let boxX = p.x - 45;
          if (boxX < padLeft - 5) boxX = padLeft - 5;
          if (boxX + 90 > chartWidth - padRight + 5) boxX = chartWidth - padRight - 85;

          visualAidNode = (
              <motion.g initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }}>
                  <circle cx={p.x} cy={p.y} r="14" fill="none" stroke="#4ade80" strokeWidth="3" strokeDasharray="4 4" className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
                  <rect x={boxX} y={boxY} width="90" height="22" rx="4" fill="#4ade80" stroke="#166534" strokeWidth="1" style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.3))" }} />
                  <text x={boxX + 45} y={textY} fill="#064e3b" fontSize="10" fontWeight="900" textAnchor="middle">{aid.label}</text>
              </motion.g>
          );
      } else if (aid.type === 'highlight_segment') {
          const p1 = points[aid.startIndex];
          const p2 = points[aid.endIndex];
          const midX = (p1.x + p2.x) / 2;
          
          const isSegNearTop = p1.y < padTop + 40;
          const segBoxY = isSegNearTop ? p1.y + 20 : p1.y - 40;
          const segTextY = isSegNearTop ? p1.y + 35 : p1.y - 25;
          
          let segBoxX = midX - 100;
          if (segBoxX < padLeft - 5) segBoxX = padLeft - 5;
          if (segBoxX + 200 > chartWidth - padRight + 5) segBoxX = chartWidth - padRight - 195;

          visualAidNode = (
              <motion.g initial={{ pathLength: 0, opacity: 0 }} animate={{ pathLength: 1, opacity: 1 }} transition={{ duration: 0.5 }}>
                  <line x1={p1.x} y1={p1.y} x2={p2.x} y2={p2.y} stroke="#4ade80" strokeWidth="8" strokeLinecap="round" opacity="0.6" />
                  <rect x={segBoxX} y={segBoxY} width="200" height="22" rx="4" fill="#4ade80" stroke="#166534" strokeWidth="1" style={{ filter: "drop-shadow(0px 2px 4px rgba(0,0,0,0.3))" }} />
                  <text x={segBoxX + 100} y={segTextY} fill="#064e3b" fontSize="10" fontWeight="900" textAnchor="middle">{aid.label}</text>
              </motion.g>
          );
      } else if (aid.type === 'show_difference') {
          const p1 = points[aid.index1];
          const p2 = points[aid.index2];
          const highP = p1.y < p2.y ? p1 : p2;
          const lowP = p1.y > p2.y ? p1 : p2;
          const diff = Math.abs(aid.val1 - aid.val2);
          
          const boxWidth = 90;
          const midX = (p1.x + p2.x) / 2;
          let diffBoxX = midX - boxWidth / 2;
          
          if (diffBoxX < padLeft - 5) diffBoxX = padLeft - 5;
          if (diffBoxX + boxWidth > chartWidth - padRight + 5) diffBoxX = chartWidth - padRight - boxWidth + 5;
          
          let diffBoxY = highP.y - 45;
          let isAbove = true;
          if (diffBoxY < 5) {
              diffBoxY = lowP.y + 25;
              isAbove = false;
          }
          
          const diffTextY = diffBoxY + 17;

          visualAidNode = (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  <circle cx={p1.x} cy={p1.y} r="10" fill="none" stroke="#4ade80" strokeWidth="2" />
                  <circle cx={p2.x} cy={p2.y} r="10" fill="none" stroke="#4ade80" strokeWidth="2" />
                  <line x1={lowP.x} y1={lowP.y} x2={highP.x} y2={lowP.y} stroke="#4ade80" strokeWidth="2" strokeDasharray="4 4" />
                  <line x1={highP.x} y1={lowP.y} x2={highP.x} y2={highP.y} stroke="#4ade80" strokeWidth="4" />
                  <line x1={highP.x - 6} y1={lowP.y} x2={highP.x + 6} y2={lowP.y} stroke="#4ade80" strokeWidth="3" />
                  <line x1={highP.x - 6} y1={highP.y} x2={highP.x + 6} y2={highP.y} stroke="#4ade80" strokeWidth="3" />
                  <line x1={midX} y1={isAbove ? diffBoxY + 26 : diffBoxY} x2={highP.x} y2={(highP.y + lowP.y) / 2} stroke="#4ade80" strokeWidth="1.5" strokeDasharray="2 2" />
                  <rect x={diffBoxX} y={diffBoxY} width={boxWidth} height={26} rx="6" fill="#4ade80" stroke="#166534" strokeWidth="1.5" style={{ filter: "drop-shadow(0px 3px 5px rgba(0,0,0,0.5))" }} />
                  <text x={diffBoxX + boxWidth / 2} y={diffTextY} fill="#064e3b" fontSize="12" fontWeight="900" textAnchor="middle">
                      {Math.max(aid.val1, aid.val2)} - {Math.min(aid.val1, aid.val2)} = {parseFloat(diff.toFixed(2))}%
                  </text>
              </motion.g>
          );
      } else if (aid.type === 'show_equation') {
          const p = points[aid.index];
          const boxWidth = 160;
          const hasLine3 = !!aid.line3;
          const boxHeight = hasLine3 ? 60 : 44;
          
          let boxX = p.x - boxWidth / 2;
          if (boxX < padLeft) boxX = padLeft + 5;
          if (boxX + boxWidth > chartWidth - padRight) boxX = chartWidth - padRight - boxWidth - 5;
          
          let boxY = p.y - boxHeight - 20;
          let isAbove = true;
          
          if (boxY < padTop - 5) {
              boxY = p.y + 20;
              isAbove = false;
          }

          visualAidNode = (
              <motion.g initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
                  <circle cx={p.x} cy={p.y} r="12" fill="none" stroke="#4ade80" strokeWidth="3" strokeDasharray="4 4" className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
                  <line 
                      x1={p.x} y1={isAbove ? boxY + boxHeight : boxY} 
                      x2={p.x} y2={isAbove ? p.y - 12 : p.y + 12} 
                      stroke="#4ade80" strokeWidth="1.5" strokeDasharray="2 2" 
                  />
                  <rect x={boxX} y={boxY} width={boxWidth} height={boxHeight} rx="6" fill="#4ade80" stroke="#166534" strokeWidth="2" style={{ filter: "drop-shadow(0px 4px 6px rgba(0,0,0,0.4))" }} />
                  <text x={boxX + boxWidth / 2} y={boxY + 18} fill="#064e3b" fontSize="12" fontWeight="900" textAnchor="middle">{aid.line1}</text>
                  <text x={boxX + boxWidth / 2} y={boxY + 34} fill="#064e3b" fontSize="13" fontWeight="900" textAnchor="middle">{aid.line2}</text>
                  {hasLine3 && <text x={boxX + boxWidth / 2} y={boxY + 50} fill="#064e3b" fontSize="13" fontWeight="900" textAnchor="middle">{aid.line3}</text>}
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

      <HeaderSection onBack={() => navigate(-1)} title={appMode === 'concept' ? "Profit Charts Lab" : "Profit Math Drills"} appMode={appMode} setAppMode={handleSetMode} onReset={() => handleReset(appMode)} />

      <main className="flex-1 flex flex-col gap-2 sm:gap-3 p-2 sm:p-3 w-full max-w-5xl mx-auto relative z-10 overflow-hidden">
        
        {/* Div 1: The Chart Viewer (TOP AREA - 50% split) */}
        <div className="w-full flex-1 flex flex-col bg-[#2a1a16] p-3 sm:p-4 rounded-2xl border-[3px] sm:border-4 border-black shadow-xl items-center min-h-[250px] relative overflow-hidden">
            
            <div className="w-full flex flex-col items-center gap-2 h-full max-w-[700px]">
                
                {/* Data Title Overlay Above Chart */}
                <div className="text-white/80 font-black text-[11px] sm:text-[13px] uppercase tracking-widest text-center mb-1 leading-tight px-4 shrink-0">
                    {currentData.title}
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
                            {points.map((p, i) => (
                                <text key={`xl-${i}`} x={p.x} y={originY + 16} fill="#a88a6d" fontSize="9" fontWeight="bold" textAnchor="middle">{p.label}</text>
                            ))}

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

                        {/* Static Points */}
                        {points.map((p, i) => {
                            let pointColor = shouldShowVisualAid ? "#4ade80" : "#f8fafc";
                            return (
                                <g key={`p-${i}`}>
                                    <circle 
                                        cx={p.x} 
                                        cy={p.y} 
                                        r="5" 
                                        fill={pointColor} 
                                        stroke="#3e2723" 
                                        strokeWidth="2" 
                                        style={{ filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.5))" }} 
                                    />
                                    <text 
                                        x={p.x} y={p.y - 10} 
                                        fill={pointColor} 
                                        fontSize="10" 
                                        fontWeight="bold" 
                                        textAnchor="middle"
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
                                <p className="text-white/70 text-[13px] sm:text-[15px] tracking-tight leading-snug px-4 max-w-md">You successfully learned how to extract averages, calculate percentage changes, and compute absolute values using profit formulas.</p>
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
                                        <div className="bg-indigo-900/40 border border-indigo-500/50 p-2.5 sm:p-3 rounded-lg mb-3 flex gap-2.5 items-start shadow-sm">
                                            <Target size={18} className="text-indigo-400 shrink-0 mt-0.5" />
                                            <div className="flex flex-col">
                                                <span className="text-indigo-400 uppercase tracking-widest text-[10px] font-black mb-0.5">Objective</span>
                                                <span className="text-indigo-50 text-[12px] sm:text-[13px] leading-snug font-medium">
                                                    {currentObjective}
                                                </span>
                                            </div>
                                        </div>

                                        {/* Step Title & Back Arrow */}
                                        <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                                            {(conceptStep > 0 || conceptTabIndex > 0) && (
                                                <button onClick={handlePrevStep} className="p-1.5 rounded-md bg-black/20 text-white/70 hover:text-white hover:bg-black/40 transition-colors mr-1">
                                                    <ChevronLeft size={16} strokeWidth={3}/>
                                                </button>
                                            )}
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

// export default function App() { return ( <Router> <LabContent /> </Router> ); }