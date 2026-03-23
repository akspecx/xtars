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
    coreDefinition: {
        title: "Multi-Line Charts",
        text: "Compare multiple data sets easily.\n• Match line colors to the legend.\n• Compare averages, totals, and gaps!"
    },
    chartData: {
      title: "Exports Over the Years (in Rs. crore)",
      xLabels: ["1993", "1994", "1995", "1996", "1997", "1998", "1999"],
      series: [
          { name: "Company X", color: "#3b82f6", values: [30, 60, 40, 70, 100, 50, 120] },
          { name: "Company Y", color: "#84cc16", values: [80, 40, 60, 60, 80, 100, 140] }
      ],
      yMin: 0, yMax: 160, yTickCount: 9, // 0, 20, 40 ... 160
      xLabelTitle: "Years", yLabelTitle: "Amount (Rs. Crore)"
    },
    tabs: [
      {
        id: 'avg_compare',
        label: 'Average %',
        objective: "Find Company Y's average as a % of Company X's.",
        steps: [
          { 
            id: "avg-0", type: 'mcq', concept: "The Shortcut", 
            q: "We need to find Y's average as a percentage of X's average over the 7 years.\n\nSince both cover the exact same 7 years, what shortcut formula can we use to save time?", 
            options: ["(Sum Y ÷ Sum X) × 100", "(Avg Y + Avg X) ÷ 2", "(Sum X ÷ Sum Y) × 100"],
            correct: 0,
            feedback: ["Correct! Comparing their total sums gives the exact same percentage.", "That calculates a combined average.", "You flipped the numerator and denominator."]
          },
          { 
            id: "avg-1", type: 'interactive_point', concept: "Find Y", targetSeries: 1,
            instruction: "Let's calculate the total sum for Company Y (Green line).\n\n👉 Click ANY dot on Company Y's line to highlight its values for all the years.", 
            successInstruction: "Excellent! The values for Company Y are now highlighted. Let's look at the data."
          },
          { 
            id: "avg-2", type: 'mcq', concept: "Sum of Y", 
            q: "Based on the data table below, what is the total sum for Company Y?", 
            table: {
                headers: ["Year", "93", "94", "95", "96", "97", "98", "99"],
                rows: [ ["Comp Y", "80", "40", "60", "60", "80", "100", "140"] ]
            },
            options: ["540", "560", "580"],
            correct: 1,
            feedback: ["Check your addition.", "Correct! 80+40+60+60+80+100+140 = 560.", "That's a bit too high."],
            visualAid: { type: 'highlight_series', sIdx: 1 }
          },
          { 
            id: "avg-3", type: 'interactive_point', concept: "Find X", targetSeries: 0,
            instruction: "Now let's find the total sum for Company X (Blue line).\n\n👉 Click ANY dot on Company X's line to highlight its values for all the years.", 
            successInstruction: "Great! All values for Company X are highlighted."
          },
          { 
            id: "avg-4", type: 'mcq', concept: "Sum of X", 
            q: "Based on the data table below, what is the total sum for Company X?", 
            table: {
                headers: ["Year", "93", "94", "95", "96", "97", "98", "99"],
                rows: [ ["Comp X", "30", "60", "40", "70", "100", "50", "120"] ]
            },
            options: ["450", "470", "490"],
            correct: 1,
            feedback: ["Check your addition.", "Correct! The total sum for Company X is 470.", "That's a bit too high."],
            visualAid: { type: 'highlight_series', sIdx: 0 }
          },
          { 
            id: "avg-5", type: 'mcq', concept: "Compute Final %", 
            q: "We have our totals!\nSum Y = 560\nSum X = 470\n\nApply the formula: (560 ÷ 470) × 100. What is the final percentage?", 
            options: ["112.5%", "119.1%", "125.0%"],
            correct: 1,
            feedback: ["Too low. 560 / 470 > 1.12.", "Spot on! ≈ 119.15%. Comparing sums instead of averages is a great shortcut!", "Too high."]
          }
        ]
      },
      {
        id: 'equal',
        label: 'Equal Totals',
        objective: "Identify years with perfectly equal combined exports.",
        steps: [
          { 
            id: "eq-0", type: 'interactive_point', concept: "Find X (1994)", targetIndex: 1, targetSeries: 0,
            instruction: "We are looking for two years where the sum of X and Y are exactly equal.\n\nLet's check 1994. 👉 Click the dot for Company X in 1994.", 
            successInstruction: "Company X is 60 in 1994."
          },
          { 
            id: "eq-1", type: 'interactive_point', concept: "Find Y (1994)", targetIndex: 1, targetSeries: 1,
            instruction: "Now find the other value for that year.\n\n👉 Click the dot for Company Y in 1994.", 
            successInstruction: "Company Y is 40 in 1994. Let's look at the total.",
            visualAid: { type: 'highlight_points', points: [{sIdx: 0, pIdx: 1}], alwaysShow: true }
          },
          { 
            id: "eq-2", type: 'mcq', concept: "Total for 1994", 
            q: "Based on the table for 1994, what is the total combined exports?", 
            table: {
                headers: ["Company", "1994 Exports"],
                rows: [ ["Company X", "60"], ["Company Y", "40"] ]
            },
            options: ["90", "100", "110"],
            correct: 1,
            feedback: ["Incorrect.", "Correct! 60 + 40 = 100.", "Incorrect."],
            visualAid: { type: 'highlight_column', pointIndex: 1 }
          },
          { 
            id: "eq-3", type: 'mcq', concept: "Find the Match", 
            q: "1994's combined total is 100.\n\nLook at the table below. Which other year ALSO has a combined total of exactly 100?", 
            table: {
                headers: ["Year", "Company X", "Company Y", "Total"],
                rows: [
                    ["1993", "30", "80", "110"],
                    ["1995", "40", "60", "?"],
                    ["1996", "70", "60", "130"]
                ]
            },
            options: ["1993", "1995", "1996"],
            correct: 1,
            feedback: ["1993 total is 110.", "Yes! In 1995, 40 + 60 = 100. So 1994 and 1995 have equal combined totals!", "1996 total is 130."],
            visualAid: { type: 'highlight_column', pointIndex: 2 }
          }
        ]
      },
      {
        id: 'minimum',
        label: 'Min Gap',
        objective: "Find the smallest gap between Company X and Y.",
        steps: [
          { 
            id: "min-0", type: 'mcq', concept: "Visualizing the Gap", 
            q: "To find the minimum difference between X and Y, we look for where the lines are physically closest together.\n\nVisually, in which year is the gap the smallest?", 
            options: ["1994", "1995", "1996"],
            correct: 2,
            feedback: ["The gap is 20 (60 - 40).", "The gap is 20 (60 - 40).", "Correct! The lines almost touch in 1996."]
          },
          { 
            id: "min-1", type: 'interactive_point', concept: "Verify X (1996)", targetIndex: 3, targetSeries: 0,
            instruction: "Let's verify 1996.\n\n👉 Click the dot for Company X in 1996.", 
            successInstruction: "Company X is 70.",
            visualAid: { type: 'highlight_column', pointIndex: 3 }
          },
          { 
            id: "min-2", type: 'interactive_point', concept: "Verify Y (1996)", targetIndex: 3, targetSeries: 1,
            instruction: "Now get the second value.\n\n👉 Click the dot for Company Y in 1996.", 
            successInstruction: "Company Y is 60.",
            visualAid: { type: 'highlight_points', points: [{sIdx: 0, pIdx: 3}], alwaysShow: true }
          },
          { 
            id: "min-3", type: 'mcq', concept: "Calculate Gap", 
            q: "Based on the table for 1996, what is the absolute mathematical difference between X and Y?", 
            table: {
                headers: ["Company", "1996 Exports"],
                rows: [ ["Company X", "70"], ["Company Y", "60"] ]
            },
            options: ["5", "10", "15"],
            correct: 1,
            feedback: ["Incorrect.", "Perfect! 70 - 60 = 10. This is the smallest gap on the chart.", "Incorrect."],
            visualAid: { type: 'highlight_column', pointIndex: 3 }
          }
        ]
      },
      {
        id: 'diff_avg',
        label: 'Avg Diff',
        objective: "Compare the average performance of specific years.",
        steps: [
          { 
            id: "da-0", type: 'interactive_point', concept: "Find X (1993)", targetIndex: 0, targetSeries: 0,
            instruction: "We need the difference between the average exports of 1993 and 1998.\n\nLet's start with 1993. 👉 Click the dot for Company X in 1993.", 
            successInstruction: "Company X is 30 in 1993."
          },
          { 
            id: "da-1", type: 'interactive_point', concept: "Find Y (1993)", targetIndex: 0, targetSeries: 1,
            instruction: "Now let's find the other value for 1993.\n\n👉 Click the dot for Company Y in 1993.", 
            successInstruction: "Company Y is 80 in 1993.",
            visualAid: { type: 'highlight_points', points: [{sIdx: 0, pIdx: 0}], alwaysShow: true }
          },
          { 
            id: "da-2", type: 'mcq', concept: "Average of 1993", 
            q: "Based on the table for 1993, what is the average export? (Total ÷ 2)", 
            table: {
                headers: ["Company", "1993 Exports"],
                rows: [ ["Company X", "30"], ["Company Y", "80"], ["Total Sum", "110"] ]
            },
            options: ["45", "50", "55"],
            correct: 2,
            feedback: ["Too low.", "That's 100 ÷ 2.", "Correct! 110 ÷ 2 = 55."],
            visualAid: { type: 'highlight_column', pointIndex: 0 }
          },
          { 
            id: "da-3", type: 'interactive_point', concept: "Find X (1998)", targetIndex: 5, targetSeries: 0,
            instruction: "Now let's analyze 1998.\n\n👉 Click the dot for Company X in 1998.", 
            successInstruction: "Company X is 50 in 1998."
          },
          { 
            id: "da-4", type: 'interactive_point', concept: "Find Y (1998)", targetIndex: 5, targetSeries: 1,
            instruction: "And the other value for 1998.\n\n👉 Click the dot for Company Y in 1998.", 
            successInstruction: "Company Y is 100 in 1998.",
            visualAid: { type: 'highlight_points', points: [{sIdx: 0, pIdx: 5}], alwaysShow: true }
          },
          { 
            id: "da-5", type: 'mcq', concept: "Average of 1998", 
            q: "Based on the table for 1998, what is the average export for 1998? (Total ÷ 2)", 
            table: {
                headers: ["Company", "1998 Exports"],
                rows: [ ["Company X", "50"], ["Company Y", "100"], ["Total Sum", "150"] ]
            },
            options: ["65", "70", "75"],
            correct: 2,
            feedback: ["Too low.", "That's 140 ÷ 2.", "Correct! 150 ÷ 2 = 75."],
            visualAid: { type: 'highlight_column', pointIndex: 5 }
          },
          { 
            id: "da-6", type: 'mcq', concept: "Find Difference", 
            q: "We have our two averages:\n1993 Avg = 55\n1998 Avg = 75\n\nWhat is the absolute difference between these two averages?", 
            options: ["10", "15", "20"],
            correct: 2,
            feedback: ["Wrong.", "Wrong.", "Spot on! 75 - 55 = 20."]
          }
        ]
      },
      {
        id: 'above_avg',
        label: 'Above Avg',
        objective: "Count years exceeding the overall average.",
        steps: [
          { 
            id: "aa-0", type: 'interactive_point', concept: "Start X", targetSeries: 0,
            instruction: "We want to know how many years Company X beat its own overall average.\n\n👉 Click ANY dot for Company X (Blue line) to highlight all its values.", 
            successInstruction: "Perfect. Let's look at the data."
          },
          { 
            id: "aa-1", type: 'mcq', concept: "X's Average", 
            q: "We found earlier that Company X's total sum is 470 over 7 years. \n\nWhat is its overall average? (470 ÷ 7)", 
            options: ["~63.5", "~67.1", "~71.4"],
            correct: 1,
            feedback: ["Too low.", "Correct! 470 ÷ 7 ≈ 67.14.", "Too high."],
            visualAid: { type: 'highlight_series', sIdx: 0 }
          },
          { 
            id: "aa-2", type: 'mcq', concept: "Count Years", 
            q: "Company X's average is ~67.14.\n\nLook at the table below. In how many years was the export STRICTLY GREATER than 67.14?", 
            table: {
                headers: ["Year", "93", "94", "95", "96", "97", "98", "99"],
                rows: [ ["Company X", "30", "60", "40", "70", "100", "50", "120"] ]
            },
            options: ["2 years", "3 years", "4 years"],
            correct: 1,
            feedback: ["Look for values >= 70.", "Yes! 1996(70), 1997(100), and 1999(120) are all > 67.14. Total = 3 years.", "Count carefully. 1994 is exactly 60, which is below 67.14."],
            visualAid: { type: 'highlight_points', points: [{sIdx: 0, pIdx: 3}, {sIdx: 0, pIdx: 4}, {sIdx: 0, pIdx: 6}] }
          }
        ]
      }
    ]
  },
  practice: [
    {
      title: "Average Comparison",
      text: "Compare the average performance of two companies.",
      chartData: {
          title: "Exports from Three Companies Over the Years (Rs. Crore)",
          xLabels: ["1993", "1994", "1995", "1996", "1997", "1998", "1999"],
          series: [
              { name: "Company X", color: "#3b82f6", values: [30, 60, 40, 70, 100, 50, 120] },
              { name: "Company Y", color: "#84cc16", values: [80, 40, 60, 60, 80, 100, 140] },
              { name: "Company Z", color: "#ef4444", values: [60, 90, 120, 90, 60, 80, 100] }
          ],
          yMin: 0, yMax: 160, yTickCount: 9,
          xLabelTitle: "Years", yLabelTitle: "Amount (Rs. Crore)"
      },
      mcq: {
          q: "Average annual exports for Company Z is approximately what percent of Company Y?\n(Sum Z ÷ Sum Y × 100)",
          options: ["85.5%", "93.3%", "107.1%"], correct: 2, 
          explanation: "Sum Z = 600. Sum Y = 560.\n(600 ÷ 560) × 100 ≈ 107.14%."
      }
    },
    {
      title: "Equal Combined Totals",
      text: "Analyze the total combined volume.",
      chartData: {
          title: "Exports from Three Companies Over the Years (Rs. Crore)",
          xLabels: ["1993", "1994", "1995", "1996", "1997", "1998", "1999"],
          series: [
              { name: "Company X", color: "#3b82f6", values: [30, 60, 40, 70, 100, 50, 120] },
              { name: "Company Y", color: "#84cc16", values: [80, 40, 60, 60, 80, 100, 140] },
              { name: "Company Z", color: "#ef4444", values: [60, 90, 120, 90, 60, 80, 100] }
          ],
          yMin: 0, yMax: 160, yTickCount: 9,
          xLabelTitle: "Years", yLabelTitle: "Amount (Rs. Crore)"
      },
      mcq: {
          q: "For which pair of years are the total exports from all three Companies equal?",
          options: ["1995 and 1998", "1995 and 1996", "1996 and 1998"], correct: 1, 
          explanation: "Total in 1995: 40+60+120 = 220.\nTotal in 1996: 70+60+90 = 220."
      }
    },
    {
      title: "Minimum Difference",
      text: "Find the smallest gap between two lines.",
      chartData: {
          title: "Exports from Three Companies Over the Years (Rs. Crore)",
          xLabels: ["1993", "1994", "1995", "1996", "1997", "1998", "1999"],
          series: [
              { name: "Company X", color: "#3b82f6", values: [30, 60, 40, 70, 100, 50, 120] },
              { name: "Company Y", color: "#84cc16", values: [80, 40, 60, 60, 80, 100, 140] },
              { name: "Company Z", color: "#ef4444", values: [60, 90, 120, 90, 60, 80, 100] }
          ],
          yMin: 0, yMax: 160, yTickCount: 9,
          xLabelTitle: "Years", yLabelTitle: "Amount (Rs. Crore)"
      },
      mcq: {
          q: "In which year was the difference between exports from Company X and Company Y minimum?",
          options: ["1994", "1996", "1997"], correct: 1, 
          explanation: "In 1996, X=70 and Y=60. Difference is 10, the smallest gap."
      }
    },
    {
      title: "Difference of Averages",
      text: "Compare yearly averages.",
      chartData: {
          title: "Exports from Three Companies Over the Years (Rs. Crore)",
          xLabels: ["1993", "1994", "1995", "1996", "1997", "1998", "1999"],
          series: [
              { name: "Company X", color: "#3b82f6", values: [30, 60, 40, 70, 100, 50, 120] },
              { name: "Company Y", color: "#84cc16", values: [80, 40, 60, 60, 80, 100, 140] },
              { name: "Company Z", color: "#ef4444", values: [60, 90, 120, 90, 60, 80, 100] }
          ],
          yMin: 0, yMax: 160, yTickCount: 9,
          xLabelTitle: "Years", yLabelTitle: "Amount (Rs. Crore)"
      },
      mcq: {
          q: "What was the difference between the average exports of all Companies in 1993 and 1998?",
          options: ["15.0", "20.0", "25.0"], correct: 1, 
          explanation: "1993 Avg: 170÷3 ≈ 56.67.\n1998 Avg: 230÷3 ≈ 76.67.\nDiff = 20."
      }
    },
    {
      title: "Above Average Count",
      text: "Count the years beating the overall average.",
      chartData: {
          title: "Exports from Three Companies Over the Years (Rs. Crore)",
          xLabels: ["1993", "1994", "1995", "1996", "1997", "1998", "1999"],
          series: [
              { name: "Company X", color: "#3b82f6", values: [30, 60, 40, 70, 100, 50, 120] },
              { name: "Company Y", color: "#84cc16", values: [80, 40, 60, 60, 80, 100, 140] },
              { name: "Company Z", color: "#ef4444", values: [60, 90, 120, 90, 60, 80, 100] }
          ],
          yMin: 0, yMax: 160, yTickCount: 9,
          xLabelTitle: "Years", yLabelTitle: "Amount (Rs. Crore)"
      },
      mcq: {
          q: "In how many years were exports from Company Z MORE than its own overall average?",
          options: ["3 years", "4 years", "5 years"], correct: 1, 
          explanation: "Company Z's average is 600÷7 ≈ 85.7.\nYears > 85.7: 1994(90), 1995(120), 1996(90), 1999(100). Total = 4."
      }
    }
  ]
};

function LabContent() {
  const navigate = useNavigate();
  const [appMode, setAppMode] = useState('concept');
  
  // App State for Steps
  const [showIntroModal, setShowIntroModal] = useState(true);
  const [showConceptSummaryModal, setShowConceptSummaryModal] = useState(false);
  const [completedTabs, setCompletedTabs] = useState([]);
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
  
  const { yMin, yMax, yTickCount, xLabels, series, xLabelTitle, yLabelTitle } = currentData;

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
    setShowConceptSummaryModal(false);
    setQuizSelection(null);
    setQuizFeedbackMode(false);
    setShowExplanation(false);
    setCompletedTabs([]);
    if (overrideMode === 'concept') setShowIntroModal(true);
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
  const padLeft = 45;
  const padBottom = 35;
  const padTop = 20;
  const padRight = 20;
  const drawWidth = chartWidth - padLeft - padRight;
  const drawHeight = chartHeight - padTop - padBottom;
  const originX = padLeft;
  const originY = chartHeight - padBottom;

  // Calculate coordinates for all series
  const seriesPoints = series.map((s, sIdx) => {
      return s.values.map((val, idx) => {
          const x = originX + ((idx + 0.5) * (drawWidth / xLabels.length));
          const yRatio = (val - yMin) / (yMax - yMin);
          const y = originY - (yRatio * drawHeight);
          return { x, y, val, label: xLabels[idx], pIdx: idx, sIdx, color: s.color };
      });
  });

  // Determine Interactive Targets
  const [interactiveCompleted, setInteractiveCompleted] = useState(false);
  const isInteractivePhase = appMode === 'concept' && currentStepInfo.type === 'interactive_point' && !interactiveCompleted;

  // Visual Aids Calculation
  let visualAidNode = null;
  const isConceptTeach = appMode === 'concept' && currentStepInfo.type === 'teach';
  const isConceptInteractiveCompleted = appMode === 'concept' && currentStepInfo.type === 'interactive_point' && interactiveCompleted;
  const currentMCQ = appMode === 'concept' ? (currentStepInfo.type === 'mcq' ? currentStepInfo : null) : currentStepInfo.mcq;
  const isCorrectAnswer = quizFeedbackMode && currentMCQ && quizSelection === currentMCQ.correct;
  
  const aid = currentStepInfo.visualAid;
  const shouldShowVisualAid = aid?.alwaysShow || isConceptTeach || isConceptInteractiveCompleted || isCorrectAnswer || showExplanation;
  
  if (shouldShowVisualAid && aid) {
      if (aid.type === 'highlight_series') {
          // Highlight an entire line series
          const pts = seriesPoints[aid.sIdx];
          visualAidNode = (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
                  {pts.map((p, i) => (
                      <circle key={`hs-${i}`} cx={p.x} cy={p.y} r="10" fill="none" stroke={p.color} strokeWidth="3" strokeDasharray="4 4" className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
                  ))}
              </motion.g>
          );
      } else if (aid.type === 'highlight_column') {
          // Highlight a specific year column (all points in that year)
          visualAidNode = (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {seriesPoints.map((sPts, i) => {
                      const p = sPts[aid.pointIndex];
                      return <circle key={`hc-${i}`} cx={p.x} cy={p.y} r="12" fill="none" stroke="#fde047" strokeWidth="3" strokeDasharray="4 4" className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
                  })}
              </motion.g>
          );
      } else if (aid.type === 'highlight_points') {
          // Highlight an array of specific points [{sIdx: 0, pIdx: 1}, ...]
          visualAidNode = (
              <motion.g initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {aid.points.map((pt, i) => {
                      const p = seriesPoints[pt.sIdx][pt.pIdx];
                      return <circle key={`hp-${i}`} cx={p.x} cy={p.y} r="14" fill="none" stroke="#4ade80" strokeWidth="3" strokeDasharray="4 4" className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
                  })}
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
              setCompletedTabs(prev => [...new Set([...prev, conceptTabIndex])]);
              setConceptTabIndex(conceptTabIndex + 1);
              setConceptStep(0);
          } else {
              setCompletedTabs(prev => [...new Set([...prev, conceptTabIndex])]);
              setLessonFinished(true);
              setShowConceptSummaryModal(true);
          }
      } else {
          handleNextPracticeDrill();
      }
      setInteractiveCompleted(false);
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
          setInteractiveCompleted(false);
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
                </div>
                
                {/* SVG Chart Area */}
                <div className={`relative bg-[#3e2723] rounded-xl border-[3px] ${isInteractivePhase ? 'border-yellow-400 shadow-[0_0_20px_rgba(250,204,21,0.2)]' : 'border-yellow-500/30'} shadow-inner w-full max-w-[600px] flex-1 flex flex-col items-center justify-center transition-all duration-500`}>
                    
                    {/* Floating Legend */}
                    <div className="absolute top-2 right-4 flex gap-3 z-10 bg-black/40 px-3 py-1.5 rounded-full border border-white/10 backdrop-blur-sm">
                        {series.map((s, i) => (
                            <div key={i} className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-sm border border-black/50" style={{ backgroundColor: s.color }}></div>
                                <span className="text-white/80 text-[10px] font-bold uppercase tracking-wider">{s.name}</span>
                            </div>
                        ))}
                    </div>

                    <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full h-full drop-shadow-md overflow-visible py-2 mt-2">
                        
                        {/* Grid Lines */}
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
                            {xLabels.map((lbl, i) => {
                                const x = originX + ((i + 0.5) * (drawWidth / xLabels.length));
                                return (
                                    <text key={`xl-${i}`} x={x} y={originY + 16} fill="#a88a6d" fontSize="9" fontWeight="bold" textAnchor="middle">{lbl}</text>
                                )
                            })}

                            {/* Axis Titles */}
                            <text x={originX + drawWidth/2} y={chartHeight - 4} fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" opacity="0.6" tracking="wider">{xLabelTitle.toUpperCase()}</text>
                            <text x={12} y={originY - drawHeight/2} fill="white" fontSize="10" fontWeight="bold" textAnchor="middle" transform={`rotate(-90 12 ${originY - drawHeight/2})`} opacity="0.6" tracking="wider">{yLabelTitle.toUpperCase()}</text>
                        </g>

                        {/* The Connecting Lines */}
                        {seriesPoints.map((sPts, sIdx) => {
                            const d = sPts.length > 0 ? `M ${sPts.map(p => `${p.x} ${p.y}`).join(' L ')}` : "";
                            return (
                                <path 
                                    key={`path-${sIdx}`}
                                    d={d} 
                                    fill="none" 
                                    stroke={series[sIdx].color} 
                                    strokeWidth="3.5" 
                                    strokeLinecap="round" 
                                    strokeLinejoin="round" 
                                    style={{ filter: "drop-shadow(0px 3px 3px rgba(0,0,0,0.4))" }}
                                />
                            )
                        })}

                        {/* Static Points & Success Highlights */}
                        {seriesPoints.map((sPts, sIdx) => {
                            return sPts.map((p, i) => {
                                const isCompletedTarget = appMode === 'concept' 
                                    && currentStepInfo.type === 'interactive_point' 
                                    && interactiveCompleted
                                    && (currentStepInfo.targetIndex === undefined || currentStepInfo.targetIndex === i)
                                    && (currentStepInfo.targetSeries === undefined || currentStepInfo.targetSeries === sIdx);

                                return (
                                    <g key={`p-${sIdx}-${i}`} style={{ pointerEvents: "none" }}> 
                                        {/* Success pulsing circle when correctly clicked */}
                                        {isCompletedTarget && (
                                            <circle cx={p.x} cy={p.y} r="14" fill="none" stroke="#4ade80" strokeWidth="2.5" strokeDasharray="4 4" className="animate-[spin_4s_linear_infinite]" style={{ transformOrigin: `${p.x}px ${p.y}px` }} />
                                        )}
                                                                           
                                        <circle 
                                            cx={p.x} 
                                            cy={p.y} 
                                            r="5" 
                                            fill={isCompletedTarget ? "#4ade80" : "#f8fafc"} 
                                            stroke={p.color} 
                                            strokeWidth="2.5" 
                                            style={{ filter: "drop-shadow(0px 2px 2px rgba(0,0,0,0.5))" }} 
                                        />
                                    </g>
                                )
                            })
                        })}
                        
                        {/* Visual Aid (Rendered LAST so it appears ON TOP, without blocking clicks) */}
                        {visualAidNode && (
                            <g style={{ pointerEvents: "none" }}>
                                {visualAidNode}
                            </g>
                        )}

                        {/* Hit targets for interactivity (Sorted so target is ALWAYS top z-index to prevent overlaps) */}
                        {isInteractivePhase && seriesPoints.flatMap((sPts, sIdx) =>
                            sPts.map((p, i) => {
                                const isTarget = (currentStepInfo.targetIndex === undefined || currentStepInfo.targetIndex === i) 
                                    && (currentStepInfo.targetSeries === undefined || currentStepInfo.targetSeries === sIdx);
                                return { ...p, sIdx, pIdx: i, isTarget };
                            })
                        ).sort((a, b) => (a.isTarget === b.isTarget ? 0 : a.isTarget ? 1 : -1))
                        .map((p) => (
                            <circle
                                key={`hit-${p.sIdx}-${p.pIdx}`}
                                cx={p.x} cy={p.y} r="18" fill="transparent"
                                style={{ cursor: "pointer" }}
                                onClick={() => {
                                    if (p.isTarget) setInteractiveCompleted(true);
                                }}
                            />
                        ))}
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
                        
                        {/* STATE 2A: Concept Mode (Tabs + Content) */}
                        {appMode === 'concept' ? (
                            <motion.div key={`panel-concept-${conceptTabIndex}-${conceptStep}`} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="flex flex-col sm:flex-row gap-4 h-full">
                                
                                {/* Left: Tabs Header */}
                                <div className="flex flex-row sm:flex-col gap-2 overflow-x-auto sm:overflow-y-auto hide-scrollbar sm:w-[150px] shrink-0 border-b sm:border-b-0 sm:border-r border-white/10 pb-2 sm:pb-0 sm:pr-3">
                                    {SCENARIOS.concept.tabs.map((tab, idx) => {
                                        const isCompleted = completedTabs.includes(idx);
                                        const isActive = conceptTabIndex === idx;
                                        
                                        let tabClass = 'bg-black/20 text-white/50 hover:text-white hover:bg-black/40';
                                        if (isActive) tabClass = 'bg-indigo-600 text-white shadow-md ring-2 ring-indigo-400/50';
                                        else if (isCompleted) tabClass = 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/50';

                                        return (
                                            <button
                                                key={tab.id}
                                                onClick={() => { setConceptTabIndex(idx); setConceptStep(0); setQuizSelection(null); setQuizFeedbackMode(false); setInteractiveCompleted(false); }}
                                                className={`px-3 py-2.5 rounded-lg text-[11px] sm:text-[12px] font-black uppercase tracking-wider whitespace-nowrap sm:whitespace-normal text-left transition-all flex justify-between items-center ${tabClass}`}
                                            >
                                                <span>{tab.label}</span>
                                                {isCompleted && !isActive && <CheckCircle size={14} className="ml-2 text-emerald-400 shrink-0" />}
                                            </button>
                                        );
                                    })}
                                </div>

                                {/* Right: Content Step */}
                                <div className="flex flex-col flex-1 min-w-0">
                                    
                                    {/* Highlighted Objective Block */}
                                    <div className="bg-amber-900/40 border border-amber-500/80 p-2.5 sm:p-3 rounded-lg mb-3 flex gap-2.5 items-start shadow-sm relative">
                                        {(conceptStep > 0 || conceptTabIndex > 0) && (
                                            <button onClick={handlePrevStep} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full text-amber-400 hover:text-white hover:bg-amber-500/30 transition-colors">
                                                <ChevronLeft size={20} />
                                            </button>
                                        )}
                                        <div className={`flex gap-3 items-center ${ (conceptStep > 0 || conceptTabIndex > 0) ? 'ml-8' : ''}`}>
                                            <div className="bg-amber-500 p-1.5 rounded-lg shadow-sm">
                                                <Target size={18} className="text-black" />
                                            </div>
                                            <div className="flex flex-col">
                                                <span className="text-amber-400 uppercase tracking-widest text-[10px] font-black mb-0.5">Current Objective</span>
                                                <span className="text-amber-50 text-[12px] sm:text-[13px] leading-snug font-bold">
                                                    {currentObjective}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Step Title */}
                                    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-white/5">
                                        {currentStepInfo.type === 'interactive_point' ? <MousePointer2 size={14} className="text-yellow-400"/> : <Compass size={14} className="text-yellow-400"/>}
                                        <span className="text-yellow-400 font-black text-[12px] uppercase tracking-widest leading-none">
                                            Step {conceptStep + 1}: {currentStepInfo.concept}
                                        </span>
                                    </div>

                                    {currentStepInfo.type === 'mcq' ? (
                                        /* Concept MCQ Form */
                                        <div className="flex flex-col flex-1">
                                            <p className="text-white font-bold text-[13px] sm:text-[14px] leading-relaxed tracking-tight mb-3 whitespace-pre-line">
                                                {currentStepInfo.q}
                                            </p>
                                            
                                            {/* Optional Data Table */}
                                            {currentStepInfo.table && (
                                                <div className="w-full overflow-x-auto mb-4 border-2 border-white/10 rounded-xl shadow-inner bg-black/20">
                                                    <table className="w-full text-left border-collapse min-w-[200px]">
                                                        <thead>
                                                            <tr className="bg-white/10 text-white/90">
                                                                {currentStepInfo.table.headers.map((h, i) => (
                                                                    <th key={i} className={`p-2 sm:p-2.5 border-b border-white/10 text-[11px] sm:text-[12px] font-black uppercase tracking-wider ${i === 0 ? 'text-left' : 'text-center'}`}>{h}</th>
                                                                ))}
                                                            </tr>
                                                        </thead>
                                                        <tbody>
                                                            {currentStepInfo.table.rows.map((row, rIdx) => (
                                                                <tr key={rIdx} className="border-b border-white/5 last:border-0 hover:bg-white/5 transition-colors">
                                                                    {row.map((cell, cIdx) => (
                                                                        <td key={cIdx} className={`p-2 sm:p-2.5 text-[12px] sm:text-[13px] ${cIdx === 0 ? 'font-bold text-white/80 text-left' : 'text-white/60 font-medium text-center'}`}>
                                                                            {cell}
                                                                        </td>
                                                                    ))}
                                                                </tr>
                                                            ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            )}

                                            {/* Horizontal Options Grid */}
                                            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 mt-auto">
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
                                                            className={`w-full py-2.5 px-2 rounded-xl font-black uppercase text-[11px] sm:text-[12px] tracking-wider transition-all shadow-md border-[2px] text-center ${btnClass}`}
                                                        >
                                                            {opt}
                                                        </button>
                                                    );
                                                })}
                                            </div>

                                            {/* Feedback Footer Area (Post Answer) */}
                                            <div className="flex flex-col justify-end min-h-[40px]">
                                                {quizFeedbackMode && !isCorrectAnswer && (
                                                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-center gap-3 w-full">
                                                        <p className="text-rose-400 text-[12px] sm:text-[13px] font-bold italic flex-1 text-center sm:text-left">
                                                            {`"${currentStepInfo.feedback[quizSelection]}"`}
                                                        </p>
                                                        <button onClick={() => { setQuizFeedbackMode(false); setQuizSelection(null); }} className="w-full sm:w-auto py-2 px-5 rounded-full font-black uppercase text-[11px] tracking-widest transition-all bg-rose-600 text-white border-2 border-rose-400 hover:scale-105 active:scale-95 shrink-0">
                                                            Try Again
                                                        </button>
                                                    </motion.div>
                                                )}

                                                {isCorrectAnswer && (
                                                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-center gap-3 w-full">
                                                        <div className="bg-green-400/10 py-1.5 px-3 rounded-lg border border-green-500/20 flex gap-2 items-center justify-center flex-1">
                                                            <CheckCircle className="text-green-400 shrink-0" size={14} />
                                                            <span className="text-green-400 font-black uppercase text-[11px] tracking-widest">Logic Correct!</span>
                                                        </div>
                                                        <button onClick={handleNextStep} className="w-full sm:w-auto py-2 px-5 rounded-full font-black uppercase text-[11px] tracking-widest transition-all bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)] border-2 border-green-400 hover:scale-105 active:scale-95 flex justify-center items-center gap-1.5 shrink-0">
                                                            {conceptStep === SCENARIOS.concept.tabs[conceptTabIndex].steps.length - 1 && conceptTabIndex === SCENARIOS.concept.tabs.length - 1 ? 'Finish' : 'Continue'}
                                                            <ArrowRight size={14} />
                                                        </button>
                                                    </motion.div>
                                                )}
                                            </div>
                                        </div>
                                    ) : (
                                        /* Interactive Point Form */
                                        <div className="flex flex-col flex-1">
                                            <div className="bg-indigo-500/10 border-2 border-indigo-500/30 p-4 rounded-xl shadow-inner mb-4 flex-1">
                                                 <p className="text-indigo-100 font-medium text-[13px] sm:text-[14px] leading-relaxed tracking-wide whitespace-pre-line">
                                                     {interactiveCompleted ? currentStepInfo.successInstruction : currentStepInfo.instruction}
                                                 </p>
                                            </div>
                                            
                                            {/* Navigation Footer */}
                                            <div className="mt-auto pt-2 flex flex-col sm:flex-row justify-end w-full">
                                                {interactiveCompleted && (
                                                    <motion.button initial={{opacity:0, y:5}} animate={{opacity:1, y:0}} onClick={handleNextStep} className="w-full sm:w-auto py-2.5 px-8 rounded-full font-black uppercase text-[11px] tracking-widest transition-all bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)] border-2 border-green-400 hover:scale-105 active:scale-95 flex justify-center items-center gap-2">
                                                        Continue
                                                        <ArrowRight size={14} />
                                                    </motion.button>
                                                )}
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
                                    <p className="text-white font-bold text-[14px] sm:text-[15px] leading-snug tracking-tight mb-4 whitespace-pre-line">
                                        {currentStepInfo.mcq.q}
                                    </p>

                                    {/* Horizontal Options Grid */}
                                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 mb-4 mt-auto">
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
                                                    className={`w-full py-2.5 px-2 rounded-xl font-black uppercase text-[11px] sm:text-[12px] tracking-wider transition-all shadow-md border-[2px] text-center ${btnClass}`}
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
                                                        <span className="text-indigo-400 font-black uppercase text-[10px] tracking-widest mb-0.5">Explanation</span>
                                                        <p className="text-indigo-100 text-[12px] font-medium leading-relaxed whitespace-pre-line">
                                                            {currentStepInfo.mcq.explanation}
                                                        </p>
                                                    </div>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>

                                    {/* Feedback Footer Area */}
                                    <div className="mt-auto pt-2 min-h-[50px] flex flex-col justify-end">
                                        {quizFeedbackMode && !isCorrectAnswer && (
                                            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-center gap-3">
                                                <p className="text-rose-400 text-[12px] sm:text-[13px] font-bold italic w-full text-center sm:text-left flex-1">
                                                    "Not quite right. Check your math again."
                                                </p>
                                                <div className="flex gap-2 w-full sm:w-auto shrink-0">
                                                    <button onClick={() => { setQuizFeedbackMode(false); setQuizSelection(null); setShowExplanation(false); }} className="flex-1 sm:flex-none py-2 px-4 rounded-full font-black uppercase text-[11px] tracking-widest transition-all bg-rose-600 text-white border-2 border-rose-400 hover:scale-105 active:scale-95">
                                                        Try Again
                                                    </button>
                                                    {!showExplanation && (
                                                        <button onClick={() => setShowExplanation(true)} className="flex-1 sm:flex-none py-2 px-4 rounded-full font-black uppercase text-[11px] tracking-widest transition-all bg-indigo-600 text-white border-2 border-indigo-400 hover:scale-105 active:scale-95">
                                                            Explain
                                                        </button>
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}

                                        {isCorrectAnswer && (
                                            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-center gap-3">
                                                <div className="bg-green-400/10 py-1.5 px-3 rounded-xl border border-green-500/20 flex gap-2 items-center justify-center w-full sm:w-auto flex-1">
                                                    <CheckCircle className="text-green-400 shrink-0" size={18} />
                                                    <span className="text-green-400 font-black uppercase text-[11px] tracking-widest">Correct!</span>
                                                </div>
                                                <div className="flex gap-2 w-full sm:w-auto shrink-0">
                                                    {!showExplanation && (
                                                        <button onClick={() => setShowExplanation(true)} className="flex-1 sm:flex-none py-2 px-4 rounded-full font-black uppercase text-[11px] tracking-widest transition-all bg-indigo-600 text-white border-2 border-indigo-400 hover:scale-105 active:scale-95">
                                                            Explain
                                                        </button>
                                                    )}
                                                    <button onClick={handleNextPracticeDrill} className="flex-1 sm:flex-none py-2 px-4 rounded-full font-black uppercase text-[11px] tracking-widest transition-all bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)] border-2 border-green-400 hover:scale-105 active:scale-95 flex justify-center items-center gap-1.5">
                                                        {practiceStep === SCENARIOS.practice.length - 1 ? 'Finish' : 'Next'}
                                                        <ArrowRight size={14} />
                                                    </button>
                                                </div>
                                            </motion.div>
                                        )}
                                    </div>
                                </div>
                            </motion.div>
                        )}

                    </AnimatePresence>
                </div>
            </div>

          </div>
        </div>

      </main>

      {/* Concept Intro Modal */}
      <AnimatePresence>
        {showIntroModal && appMode === 'concept' && (
            <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }} 
                className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4"
            >
               <div className="bg-[#2a1a16] border-4 border-indigo-500/50 shadow-2xl p-6 sm:p-8 rounded-3xl flex flex-col items-center gap-4 w-full max-w-xl text-center relative overflow-hidden">
                  <Compass size={48} className="text-indigo-400 mx-auto" />
                  <h2 className="text-white text-2xl font-black uppercase tracking-widest mt-1">Mastering Multi-Line Charts</h2>
                  <p className="text-white/80 font-medium text-sm">In this module, you will learn how to analyze and compare multiple data series at once.</p>

                  <div className="w-full text-left bg-black/30 p-4 rounded-xl border border-white/10 flex flex-col gap-3 mt-2">
                      <h3 className="text-indigo-300 font-bold uppercase text-[11px] tracking-widest border-b border-white/10 pb-2">What you will learn:</h3>
                      <motion.ul 
                          className="text-white/90 text-[13px] flex flex-col gap-2.5"
                          initial="hidden"
                          animate="show"
                          variants={{
                              hidden: { opacity: 0 },
                              show: { opacity: 1, transition: { staggerChildren: 0.4 } }
                          }}
                      >
                          <motion.li variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }} className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" /> <span>Find one company's average as a % of another's.</span></motion.li>
                          <motion.li variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }} className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" /> <span>Identify years with perfectly equal combined exports.</span></motion.li>
                          <motion.li variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }} className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" /> <span>Find the smallest gap between Company X and Y.</span></motion.li>
                          <motion.li variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }} className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" /> <span>Compare the average performance of specific years.</span></motion.li>
                          <motion.li variants={{ hidden: { opacity: 0, x: -20 }, show: { opacity: 1, x: 0 } }} className="flex items-start gap-2"><CheckCircle size={16} className="text-emerald-400 shrink-0 mt-0.5" /> <span>Count years exceeding the overall average.</span></motion.li>
                      </motion.ul>
                  </div>
                  
                  {/* Detailed static chart visual matching screenshot */}
                  <div className="w-full bg-[#2a1a16] rounded-xl border-2 border-[#a88a6d]/30 relative overflow-hidden mt-1 p-3 sm:p-4 flex flex-col shadow-2xl">
                      {/* Chart Title */}
                      <div className="text-white/90 font-black text-[10px] sm:text-[12px] uppercase tracking-widest text-center mb-2">
                          Exports Over the Years (in Rs. crore)
                      </div>

                      {/* Floating Legend */}
                      <div className="absolute top-10 right-4 sm:right-6 flex gap-3 z-10 bg-[#1a100c]/80 px-3 py-1.5 rounded-lg border border-white/10 backdrop-blur-sm">
                          <div className="flex items-center gap-1.5">
                              <div className="w-3 h-3 rounded-md bg-[#3b82f6]"></div>
                              <span className="text-white font-bold uppercase text-[9px] tracking-wider">Company X</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                              <div className="w-3 h-3 rounded-md bg-[#84cc16]"></div>
                              <span className="text-white font-bold uppercase text-[9px] tracking-wider">Company Y</span>
                          </div>
                      </div>

                      <div className="flex-1 relative w-full aspect-[16/9] max-h-[220px]">
                          <svg viewBox="0 0 400 250" className="w-full h-full overflow-visible">
                              {/* Grid & Y-Axis */}
                              {[0, 20, 40, 60, 80, 100, 120, 140, 160].map((val, i) => {
                                  const y = 210 - (val * 1.125);
                                  return (
                                      <g key={`y-${i}`}>
                                          <text x="40" y={y} fill="#a88a6d" fontSize="10" fontWeight="bold" textAnchor="end" dominantBaseline="central">{val}</text>
                                          {val !== 0 && <line x1="50" y1={y} x2="380" y2={y} stroke="white" strokeWidth="1" opacity="0.05" />}
                                      </g>
                                  );
                              })}

                              {/* X-Axis Labels */}
                              {['1993', '1994', '1995', '1996', '1997', '1998', '1999'].map((yr, i) => {
                                  const x = 50 + ((i + 0.5) * (330 / 7));
                                  return (
                                      <text key={`x-${i}`} x={x} y="228" fill="#a88a6d" fontSize="10" fontWeight="bold" textAnchor="middle">{yr}</text>
                                  );
                              })}

                              {/* Axis Titles */}
                              <text x="215" y="246" fill="#a88a6d" fontSize="10" fontWeight="900" textAnchor="middle" tracking="widest">YEARS</text>
                              <text x="12" y="120" fill="#a88a6d" fontSize="10" fontWeight="900" textAnchor="middle" transform="rotate(-90 12 120)" tracking="widest">AMOUNT (RS. CRORE)</text>

                              {/* Thick Axis Lines */}
                              <line x1="50" y1="210" x2="385" y2="210" stroke="#a88a6d" strokeWidth="3" strokeLinecap="round" />
                              <line x1="50" y1="20" x2="50" y2="210" stroke="#a88a6d" strokeWidth="3" strokeLinecap="round" />

                              {/* Connecting Lines */}
                              <path d="M73.5,176.25 L120.7,142.5 L167.8,165.0 L215,131.25 L262.1,97.5 L309.2,153.75 L356.4,75.0" fill="none" stroke="#3b82f6" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" style={{ filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.5))" }} />
                              <path d="M73.5,120.0 L120.7,165.0 L167.8,142.5 L215,142.5 L262.1,120.0 L309.2,97.5 L356.4,52.5" fill="none" stroke="#84cc16" strokeWidth="3.5" strokeLinejoin="round" strokeLinecap="round" style={{ filter: "drop-shadow(0px 4px 4px rgba(0,0,0,0.5))" }} />

                              {/* White-filled Points for X */}
                              {[176.25, 142.5, 165.0, 131.25, 97.5, 153.75, 75.0].map((cy, i) => (
                                  <circle key={`px-${i}`} cx={50 + ((i + 0.5) * (330 / 7))} cy={cy} r="5.5" fill="#ffffff" stroke="#3b82f6" strokeWidth="3" style={{ filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.5))" }} />
                              ))}
                              
                              {/* White-filled Points for Y */}
                              {[120.0, 165.0, 142.5, 142.5, 120.0, 97.5, 52.5].map((cy, i) => (
                                  <circle key={`py-${i}`} cx={50 + ((i + 0.5) * (330 / 7))} cy={cy} r="5.5" fill="#ffffff" stroke="#84cc16" strokeWidth="3" style={{ filter: "drop-shadow(0px 2px 3px rgba(0,0,0,0.5))" }} />
                              ))}
                          </svg>
                      </div>
                  </div>

                  <button onClick={() => setShowIntroModal(false)} className="mt-2 w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-black uppercase tracking-wider transition-all shadow-[0_0_15px_rgba(79,70,229,0.4)] active:scale-95">
                      Start Learning
                  </button>
               </div>
            </motion.div>
        )}
      </AnimatePresence>

      {/* Concept Summary Modal */}
      <AnimatePresence>
        {showConceptSummaryModal && (
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
                   className="bg-[#2a1a16] border-4 border-yellow-500/50 shadow-2xl p-5 sm:p-8 rounded-3xl flex flex-col gap-4 w-full max-w-xl relative max-h-[90vh]"
               >
                   <div className="flex items-center gap-3 border-b border-white/10 pb-3 shrink-0">
                       <Trophy size={28} className="text-yellow-400" />
                       <h3 className="text-white text-[18px] sm:text-[22px] font-black uppercase tracking-widest">Concept Mastered!</h3>
                   </div>
                   
                   <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 flex flex-col gap-3">
                       <p className="text-white/80 font-medium text-[13px] sm:text-[14px] mb-1">Here is a quick summary of everything you just learned. Review this before practicing:</p>
                       
                       <div className="bg-indigo-500/10 border-l-4 border-indigo-500 p-3 rounded-r-xl">
                           <h4 className="text-indigo-400 font-black text-[12px] uppercase tracking-wider mb-1">1. Average %</h4>
                           <p className="text-indigo-100/80 text-[12px] sm:text-[13px] leading-relaxed">Calculate the true average for each company across all years, then find the percentage. Formula: <code className="bg-black/30 px-1 rounded"> (Avg Y ÷ Avg X) × 100 </code></p>
                       </div>

                       <div className="bg-indigo-500/10 border-l-4 border-indigo-500 p-3 rounded-r-xl">
                           <h4 className="text-indigo-400 font-black text-[12px] uppercase tracking-wider mb-1">2. Equal Totals</h4>
                           <p className="text-indigo-100/80 text-[12px] sm:text-[13px] leading-relaxed">To find years with equal combined exports, stack the values (Company X + Company Y) for each individual year and look for matching sums.</p>
                       </div>

                       <div className="bg-indigo-500/10 border-l-4 border-indigo-500 p-3 rounded-r-xl">
                           <h4 className="text-indigo-400 font-black text-[12px] uppercase tracking-wider mb-1">3. Minimum Gap</h4>
                           <p className="text-indigo-100/80 text-[12px] sm:text-[13px] leading-relaxed">Visually locate where the lines are physically closest together on the chart, then calculate the absolute mathematical difference to confirm.</p>
                       </div>

                       <div className="bg-indigo-500/10 border-l-4 border-indigo-500 p-3 rounded-r-xl">
                           <h4 className="text-indigo-400 font-black text-[12px] uppercase tracking-wider mb-1">4. Difference of Averages</h4>
                           <p className="text-indigo-100/80 text-[12px] sm:text-[13px] leading-relaxed">Calculate the average for the first specific year, calculate the average for the second specific year, and subtract them to find the difference.</p>
                       </div>

                       <div className="bg-indigo-500/10 border-l-4 border-indigo-500 p-3 rounded-r-xl">
                           <h4 className="text-indigo-400 font-black text-[12px] uppercase tracking-wider mb-1">5. Above Average Rule</h4>
                           <p className="text-indigo-100/80 text-[12px] sm:text-[13px] leading-relaxed">First calculate the overall average for a single company across all years, then count how many individual years had a value <strong>strictly greater</strong> than that average.</p>
                       </div>
                   </div>

                   <div className="pt-3 border-t border-white/10 shrink-0 flex flex-col sm:flex-row justify-end gap-3">
                       <button onClick={() => handleSetMode('practice')} className="w-full py-3.5 sm:py-3 px-8 rounded-xl font-black uppercase text-[12px] sm:text-[13px] tracking-widest transition-all bg-green-600 text-white shadow-[0_0_15px_rgba(34,197,94,0.3)] border-2 border-green-400 hover:scale-105 active:scale-95 flex justify-center items-center gap-2">
                           Start Practice Drills <ArrowRight size={16} />
                       </button>
                   </div>
               </motion.div>
            </motion.div>
        )}
      </AnimatePresence>

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