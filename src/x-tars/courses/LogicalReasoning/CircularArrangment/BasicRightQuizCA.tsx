import React, { CSSProperties } from 'react';
import AkashImage from './Images/Akash.png'
import PrabhatImage from './Images/Prabhat.png'
import TomImage from './Images/Tom.png'
import DavidImage from './Images/David.png'
// --- Language and Translation Definitions ---
type Language = 'en' | 'hi';

interface QuestionData {
    id: number;
    questionKey: 'question1' | 'question2' | 'question3';
    correctAnswer: string; // The name of the person who is the correct answer
    // For explanation visuals: determines which arrows to draw (e.g., Left vs Right)
    explanationType: 'Left' | 'Right'; 
    // For explanation visuals: person used as reference point
    referencePerson: 'Akash' | 'Tom' | 'Prabhat' | 'David'; 
}

interface Translation {
  title: string;
  question1: string;
  question2: string;
  question3: string;
  optionA: string; // Tom
  optionB: string; // David
  optionC: string; // Prabhat
  optionD: string; // Akash (NEW)
  submit: string;
  correct: string;
  incorrect: string;
  viewExplanation: string;
  tryAgain: string;
  footer: string;
  facingCenter: string;
  leftLabel: string;
  rightLabel: string;
  // Dynamic explanation content based on type/reference
  explanationText: (ref: string, dir: string, target: string, color: string, refColor: string) => React.ReactNode;
}

const translations: Record<Language, Translation> = {
  en: {
    title: "Circular Arrangement Quiz",
    question1: "Who is sitting to the right of Akash?", 
    question2: "Who is sitting to the right of Tom?", 
    question3: "Who is sitting to the right of David?", 
    optionA: "Tom",
    optionB: "David",
    optionC: "Prabhat",
    optionD: "Akash", // NEW
    submit: "Submit Answer",
    correct: "Correct! Well done! 🎉",
    incorrect: "Incorrect. Try again!",
    viewExplanation: "View Explanation",
    tryAgain: "Try Again",
    footer: "The avatars are customized image placeholders for clarity.",
    facingCenter: "Facing centre",
    leftLabel: "Left",
    rightLabel: "Right",
    explanationText: (ref, dir, target, color, refColor) => (
        <p className="font-semibold text-lg text-gray-900 dark:text-gray-50 text-center p-2 rounded-lg">
            To find the answer, start at <span className={`font-extrabold ${refColor}`}>{ref}</span>. 
            The **{dir}** direction (Counter-Clockwise for Right) leads immediately to <span className={`font-extrabold ${color}`}>{target}</span>.
        </p>
    )
  },
  hi: {
    title: "गोलाकार व्यवस्था प्रश्नोत्तरी",
    question1: "आकाश के दाएँ कौन बैठा है?",
    question2: "टॉम के दाएँ कौन बैठा है?",
    question3: "डेविड के दाएँ कौन बैठा है?",
    optionA: "टॉम",
    optionB: "डेविड",
    optionC: "प्रभात",
    optionD: "आकाश", // NEW
    submit: "उत्तर जमा करें",
    correct: "सही! बहुत बढ़िया! 🎉",
    incorrect: "गलत। पुनः प्रयास करें!",
    viewExplanation: "व्याख्या देखें",
    tryAgain: "पुनः प्रयास करें",
    footer: "स्पष्टता के लिए अवतार अनुकूलित छवि प्लेसहोल्डर हैं।",
    facingCenter: "केंद्र की ओर मुख",
    leftLabel: "बाएँ",
    rightLabel: "दाएँ",
    explanationText: (ref, dir, target, color, refColor) => (
        <p className="font-semibold text-lg text-gray-900 dark:text-gray-50 text-center p-2 rounded-lg" style={{ lineHeight: '1.8' }}>
            उत्तर खोजने के लिए, <span className={`font-extrabold ${refColor}`}>{ref}</span> से शुरू करें। 
            **{dir}** दिशा (दाएँ के लिए वामावर्त) तुरंत <span className={`font-extrabold ${color}`}>{target}</span> की ओर ले जाती है।
        </p>
    )
  }
};

const questions: QuestionData[] = [
    // Order: Tom (T) -> Prabhat (R) -> David (B) -> Akash (L) -> T (Clockwise)
    // Right = Counter-Clockwise (T -> A -> D -> P -> T)
    
    // 1. Right of Akash (L): Counter-Clockwise leads to David (B)
    { id: 1, questionKey: 'question1', correctAnswer: 'David', explanationType: 'Right', referencePerson: 'Akash' },
    
    // 2. Right of Tom (T): Counter-Clockwise leads to Akash (L)
    { id: 2, questionKey: 'question2', correctAnswer: 'Akash', explanationType: 'Right', referencePerson: 'Tom' },
    
    // 3. Right of David (B): Counter-Clockwise leads to Prabhat (R)
    { id: 3, questionKey: 'question3', correctAnswer: 'Prabhat', explanationType: 'Right', referencePerson: 'David' },
];

interface Person {
  name: string;
  position: 'top' | 'right' | 'bottom' | 'left';
  color: string;
}

interface CircularArrangementProps {
  people: Person[];
  circleSize: number;
  showArrows: boolean;
  language: Language;
  referencePerson: string;
  explanationType: 'Left' | 'Right';
}

const CircularArrangement: React.FC<CircularArrangementProps> = ({
  people,
  circleSize,
  showArrows,
  language,
  referencePerson,
  explanationType,
}) => {
  const personSize = Math.max(circleSize * 0.35, 50);
  const radius = circleSize / 2;
  const offset = personSize / 2;
  const T = translations[language];

  const getPositionStyle = (position: Person['position']): CSSProperties => {
    switch (position) {
      case 'top': return { top: -offset, left: radius - offset };
      case 'right': return { top: radius - offset, right: -offset };
      case 'bottom': return { bottom: -offset, left: radius - offset };
      case 'left': return { top: radius - offset, left: -offset };
      default: return {};
    }
  };

  const renderPeople = () => {
    return people.map((person, index) => {
      const personStyle: CSSProperties = {
        ...getPositionStyle(person.position),
        width: `${personSize}px`,
        height: `${personSize}px`,
      };

      let imageUrl = '';
      const size = Math.round(personSize);
      const text = person.name.substring(0, 4).toUpperCase();
      let bgColor = '';
      let textColor = '';

      // Determine colors for image placeholder and external name
      if (person.name === 'Tom') {
        bgColor = 'dc2626'; // Red
        textColor = '#dc2626';
        imageUrl = TomImage;
      } else if (person.name === 'Prabhat') {
        bgColor = '10b981'; // Green
        textColor = '#10b981';
        imageUrl = PrabhatImage;
      } else if (person.name === 'Akash') {
        bgColor = '3b82f6'; // Blue
        textColor = '#3b82f6';
        imageUrl = AkashImage;
      } else if (person.name === 'David') {
        bgColor = 'f97316'; // Orange
        textColor = '#f97316';
        imageUrl = DavidImage;
      } else {
        bgColor = '6b7280'; // Gray fallback
        textColor = '#6b7280';
        imageUrl = `https://placehold.co/${size}x${size}/${bgColor}/ffffff?text=${text}`;
      }

      const nameDistance = personSize * 0.05;
      const externalOffset = offset * 1.5;

      return (
        <div key={index}>
          <div
            className="absolute rounded-full shadow-lg transition duration-300 transform hover:scale-105 overflow-hidden border-2 border-white flex justify-center items-center"
            style={personStyle}
            title={person.name}
          >
            <img
              src={imageUrl}
              alt={person.name}
              className="w-full h-full rounded-full object-cover"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                (e.target as HTMLImageElement).onerror = null;
                (e.target as HTMLImageElement).src = `https://placehold.co/${size}x${size}/6b7280/ffffff?text=X`;
              }}
            />
          </div>

          <span
            className="absolute font-bold"
            style={{
              zIndex: 20,
              fontSize: '1.1rem',
              color: textColor,
              
              // Positioning logic adjusted for the new avatar size and external offset
              // Tom (Top)
              ...(person.position === 'top' && {
                top: -externalOffset,
                left: radius,
                transform: `translateX(-50%) translateY(-${personSize * 0.8 - 80}px)` 
              }),
              // Prabhat (Right)
              ...(person.position === 'right' && {
                top: radius,
                right: -externalOffset,
                transform: `translateX(${nameDistance + 70}px) translateY(-50%)`
              }),
              // Akash (Left)
              ...(person.position === 'left' && {
                top: radius,
                left: -externalOffset,
                transform: `translateX(-${personSize + (nameDistance - 80)}px) translateY(-50%)`
              }),
              // David (Bottom)
              ...(person.position === 'bottom' && {
                bottom: -externalOffset,
                left: radius,
                transform: `translateX(-50%) translateY(${nameDistance + 30}px)`
              }),
            }}
          >
            {person.name}
          </span>
        </div>
      );
    });
  };

  const renderDirectionArrow = () => {
    if (!showArrows) return null;

    // --- Clockwise Map: T -> P -> D -> A -> T (Your required order) ---
    const clockwiseMap: Record<Person['position'], Person['position']> = {
        'top': 'right', // Tom -> Prabhat
        'right': 'bottom', // Prabhat -> David
        'bottom': 'left', // David -> Akash
        'left': 'top' // Akash -> Tom
    };
    
    // Find the reference person and the target person based on the solution
    const refPerson = people.find(p => p.name === referencePerson);
    // Determine target based on explanation type: Left (Clockwise) or Right (Counter-Clockwise)
    const targetPosition = explanationType === 'Left' 
        ? clockwiseMap[refPerson!.position] // Clockwise
        : Object.keys(clockwiseMap).find(key => clockwiseMap[key as Person['position']] === refPerson!.position); // Reverse Clockwise
        
    const targetPerson = people.find(p => p.position === targetPosition);

    if (!refPerson || !targetPerson) return null;

    const R_Circle = circleSize / 2;
    const ARROW_OFFSET = 90;
    const DUAL_ARROW_GAP = 10;
    const offsetCalc = personSize / 2;
    const dashedCircleSize = 64;
    const mugSize = 48;
    const lineStrokeColor = '#3b82f6';
    const viewBoxSize = circleSize + ARROW_OFFSET * 3;

    const STROKE_WIDTH = 3; // Thicker for clarity
    const MARKER_SIZE = 10; // Larger marker

    // --- Arrow Path Logic ---
    const isLeft = explanationType === 'Left';
    // Use the maximum radius for a clear path
    const arrowRadius = R_Circle + ARROW_OFFSET + DUAL_ARROW_GAP; 

    const angleMap: Record<Person['position'], number> = {
        'top': 1.5 * Math.PI, // 12 PM (270 deg)
        'right': 0 * Math.PI, // 3 PM (0 deg)
        'bottom': 0.5 * Math.PI, // 6 PM (90 deg)
        'left': 1.0 * Math.PI, // 9 PM (180 deg)
    };

    const startAngle = angleMap[refPerson.position];
    const endAngle = angleMap[targetPerson.position];

    const startX = R_Circle + arrowRadius * Math.cos(startAngle);
    const startY = R_Circle + arrowRadius * Math.sin(startAngle);

    const endX = R_Circle + arrowRadius * Math.cos(endAngle);
    const endY = R_Circle + arrowRadius * Math.sin(endAngle);

    // Left (Clockwise) = sweepFlag 1. Right (Counter-Clockwise) = sweepFlag 0.
    const sweepFlag = isLeft ? 1 : 0; 

    const arrowPath = `M ${startX} ${startY} A ${arrowRadius} ${arrowRadius} 0 0 ${sweepFlag} ${endX} ${endY}`;

    // --- Label Positioning Logic ---
    const labelRadius = arrowRadius + 15; 
    let preciseLabelAngle: number;
    
    // Calculate the angle exactly halfway along the arc for precise label placement
    // This is the most complex part due to angle wrapping (0 to 2*PI boundary)
    
    const angleDiff = (startAngle - endAngle + 2 * Math.PI) % (2 * Math.PI);
    
    if (isLeft) {
      // Clockwise (sweepFlag 1)
      if (angleDiff > Math.PI) {
        // Long way around, not needed for 90 degree steps
        preciseLabelAngle = (startAngle + endAngle) / 2;
      } else if (startAngle === 1.5 * Math.PI && endAngle === 0 * Math.PI) {
        // Tom (12 PM) -> Prabhat (3 PM)
        preciseLabelAngle = 1.75 * Math.PI;
      } else {
        // Normal clockwise travel
        preciseLabelAngle = (startAngle + endAngle) / 2;
        if (startAngle < endAngle) preciseLabelAngle += Math.PI; // Adjust for crossing 0/2pi if needed
      }
    } else {
      // Counter-Clockwise (sweepFlag 0)
      if (angleDiff > Math.PI) {
        // Long way around, not needed for 90 degree steps
        preciseLabelAngle = (startAngle + endAngle) / 2;
      } else if (startAngle === 0 * Math.PI && endAngle === 1.5 * Math.PI) {
         // Prabhat (3 PM) -> Tom (12 PM)
        preciseLabelAngle = 1.75 * Math.PI;
      } else {
        // Normal counter-clockwise travel
        preciseLabelAngle = (startAngle + endAngle) / 2;
      }
    }

    // Default adjustment for labels to sit correctly outside the curve
    if (isLeft) {
        // Adjust for Left (Clockwise) path label placement (e.g., Q3 David -> Akash)
        if (refPerson.position === 'bottom') preciseLabelAngle -= 0.1; 
        if (refPerson.position === 'left') preciseLabelAngle -= 0.1;
    } else {
        // Adjust for Right (Counter-Clockwise) path label placement (e.g., Q1 Akash -> David)
        if (refPerson.position === 'left') preciseLabelAngle += 0.2; 
        if (refPerson.position === 'bottom') preciseLabelAngle += 0.1; 
    }


    const labelX = R_Circle + labelRadius * Math.cos(preciseLabelAngle);
    const labelY = R_Circle + labelRadius * Math.sin(preciseLabelAngle);

    // Get color for the directional label
    const arrowColor = refPerson.name === 'Akash' ? '#3b82f6' : 
                       refPerson.name === 'Tom' ? '#dc2626' : 
                       refPerson.name === 'David' ? '#f97316' : '#10b981'; // Fallback Prabhat

    return (
      <>
        <svg
          className="absolute"
          style={{
            top: -ARROW_OFFSET * 1.5,
            left: -ARROW_OFFSET * 1.5,
            width: viewBoxSize,
            height: viewBoxSize,
            zIndex: 5
          }}
          viewBox={`${-ARROW_OFFSET * 1.5} ${-ARROW_OFFSET * 1.5} ${viewBoxSize} ${viewBoxSize}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker id="facingArrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 z" fill={lineStrokeColor} />
            </marker>
            <marker id="mainArrowhead" markerWidth={MARKER_SIZE} markerHeight={MARKER_SIZE} refX={MARKER_SIZE * 0.8} refY={MARKER_SIZE * 0.5} orient="auto">
              <path d={`M 0 0 L ${MARKER_SIZE} ${MARKER_SIZE * 0.5} L 0 ${MARKER_SIZE} z`} fill={arrowColor} />
            </marker>
          </defs>

          {/* Directional Arrow */}
          <path
            d={arrowPath}
            fill="none"
            stroke={arrowColor}
            strokeWidth={STROKE_WIDTH}
            markerEnd={`url(#mainArrowhead)`}
          />
          <text
            x={labelX}
            y={labelY}
            className="font-extrabold"
            fill={arrowColor}
            style={{ fontSize: '18px', textShadow: '0 0 4px rgba(234,179,8,0.5)' }}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {isLeft ? T.leftLabel : T.rightLabel}
          </text>


          {/* FACING ARROWS FOR ALL FOUR USERS (Blue/Dashed) */}
          
          {people.map((p, i) => (
              <path
                  key={i}
                  d={`M ${R_Circle + radius * Math.cos(angleMap[p.position]) * (1 - offsetCalc/radius)} ${R_Circle + radius * Math.sin(angleMap[p.position]) * (1 - offsetCalc/radius)} L ${R_Circle + mugSize * 0.5 * Math.cos(angleMap[p.position] - Math.PI) * -1} ${R_Circle + mugSize * 0.5 * Math.sin(angleMap[p.position] - Math.PI) * -1}`}
                  fill="none"
                  stroke={lineStrokeColor}
                  strokeWidth="2"
                  markerEnd="url(#facingArrowhead)"
                  strokeDasharray="4,3"
              />
          ))}
        </svg>

        {/* Center Object */}
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 10 }}>
          <div
            className="absolute border-4 border-dashed border-blue-400 dark:border-blue-500 rounded-full opacity-50"
            style={{
              width: dashedCircleSize,
              height: dashedCircleSize,
              top: `calc(50% - ${dashedCircleSize / 2}px)`,
              left: `calc(50% - ${dashedCircleSize / 2}px)`,
            }}
          ></div>
          <div
            className="relative bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-full shadow-lg flex items-center justify-center"
            style={{ width: mugSize, height: mugSize }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
      </>
    );
  };

  return (
    <div className="flex flex-col items-center p-4">
      <div style={{ padding: `${offset + 5 + 130}px` }}>
        <div
          className="relative border-4 border-blue-500 dark:border-blue-300 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-xl transition-all duration-300"
          style={{ width: circleSize, height: circleSize }}
        >
          {renderDirectionArrow()}
          {renderPeople()}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [activeQuestionId, setActiveQuestionId] = React.useState(1);
  const [answers, setAnswers] = React.useState<Record<number, string | null>>({ 1: null, 2: null, 3: null });
  const [isSubmitted, setIsSubmitted] = React.useState<Record<number, boolean>>({ 1: false, 2: false, 3: false });
  const [showExplanation, setShowExplanation] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [circleSize, setCircleSize] = React.useState(400);
  const [language, setLanguage] = React.useState<Language>('en');

  const T = translations[language];

  const people: Person[] = [
    { name: 'Tom', position: 'top', color: 'bg-red-500' }, // 12 PM
    { name: 'Prabhat', position: 'right', color: 'bg-green-500' }, // 3 PM
    { name: 'David', position: 'bottom', color: 'bg-orange-500' }, // 6 PM
    { name: 'Akash', position: 'left', color: 'bg-blue-500' }, // 9 PM
  ];

  const currentQuestion = questions.find(q => q.id === activeQuestionId)!;
  const currentAnswer = answers[activeQuestionId];
  const isQuestionSubmitted = isSubmitted[activeQuestionId];
  const isQuestionCorrect = currentAnswer === currentQuestion.correctAnswer;

  const handleSubmit = () => {
    if (currentAnswer) {
      setIsSubmitted(prev => ({ ...prev, [activeQuestionId]: true }));
      setShowExplanation(false);
      // Automatically navigate to the next question if correct
      if (currentAnswer === currentQuestion.correctAnswer && activeQuestionId < questions.length) {
          setTimeout(() => setActiveQuestionId(activeQuestionId + 1), 1000);
      }
    }
  };

  const handleTryAgain = () => {
    setAnswers(prev => ({ ...prev, [activeQuestionId]: null }));
    setIsSubmitted(prev => ({ ...prev, [activeQuestionId]: false }));
    setShowExplanation(false);
  };

  const handleSelectAnswer = (option: string) => {
    if (!isQuestionSubmitted) {
      setAnswers(prev => ({ ...prev, [activeQuestionId]: option }));
    }
  };
  
  const handleTabClick = (id: number) => {
      // Allow moving between any question tab
      setActiveQuestionId(id);
      setShowExplanation(false);
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
    setAnswers({ 1: null, 2: null, 3: null });
    setIsSubmitted({ 1: false, 2: false, 3: false });
    setShowExplanation(false);
  };

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const calculateSize = () => {
      const size = Math.min(window.innerWidth * 0.85, 400);
      setCircleSize(size);
    };

    calculateSize();
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, [isDarkMode]);

  // Determine colors for explanation text highlighting
  const refPersonColor = people.find(p => p.name === currentQuestion.referencePerson)!.color.replace('bg-', 'text-');
  const targetPersonColor = people.find(p => p.name === currentQuestion.correctAnswer)!.color.replace('bg-', 'text-');
  
  const explanationTextContent = T.explanationText(
      currentQuestion.referencePerson,
      currentQuestion.explanationType,
      currentQuestion.correctAnswer,
      targetPersonColor,
      refPersonColor
  );

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500 p-4 sm:p-6 flex flex-col items-center font-sans">
        <div className="w-full max-w-4xl space-y-8">
          
          <header className="flex flex-col sm:flex-row justify-between items-center w-full mb-4 space-y-4 sm:space-y-0">
            <h1 className="text-xl sm:text-3xl font-extrabold text-gray-800 dark:text-white text-center sm:text-left flex-grow">
              {T.title}
            </h1>
            <div className="flex space-x-4 items-center">
              <select
                value={language}
                onChange={handleLanguageChange}
                className="p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी (Hindi)</option>
              </select>
              <button
                onClick={toggleDarkMode}
                className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-yellow-400 shadow-md hover:ring-2 ring-blue-500 dark:ring-blue-300 transition-all duration-300"
              >
                {isDarkMode ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                  </svg>
                )}
              </button>
            </div>
          </header>

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border-t-4 border-green-500 overflow-x-hidden">
            
            <CircularArrangement
              people={people}
              circleSize={circleSize}
              showArrows={showExplanation}
              language={language}
              referencePerson={currentQuestion.referencePerson}
              explanationType={currentQuestion.explanationType}
            />

            <div className="mt-6 space-y-4">
              
              {/* Question Tabs moved here */}
              <div className="flex justify-center mb-4 border-b border-gray-200 dark:border-gray-700">
                  {questions.map((q) => {
                      const isActive = q.id === activeQuestionId;
                      const isCompleted = isSubmitted[q.id] && q.correctAnswer === answers[q.id];

                      return (
                          <button
                              key={q.id}
                              onClick={() => handleTabClick(q.id)}
                              className={`px-4 py-2 text-sm font-semibold transition-all duration-200 
                                  ${isActive 
                                      ? 'border-b-4 border-blue-600 text-blue-600 dark:text-blue-400' 
                                      : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-300'}
                              `}
                          >
                              Q {q.id}
                              {isCompleted && <span className="ml-2 text-green-500">✓</span>}
                          </button>
                      );
                  })}
              </div>
              
              <h2 className="text-xl font-bold text-gray-800 dark:text-white text-center">
                  {T[currentQuestion.questionKey]}
              </h2>

              <div className="space-y-3">
                {['Tom', 'Akash', 'Prabhat', 'David'].filter(name => name !== currentQuestion.referencePerson).map((option) => (
                  <button
                    key={option}
                    onClick={() => handleSelectAnswer(option)}
                    disabled={isQuestionSubmitted}
                    className={`w-full p-4 rounded-lg border-2 text-left font-medium transition duration-200 
                    ${currentAnswer === option
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-500'
                    }
                    ${isQuestionSubmitted && option === currentQuestion.correctAnswer && isQuestionCorrect ? 'bg-green-100 dark:bg-green-800 border-green-500' : ''}
                    ${isSubmitted[currentQuestion.id] && currentAnswer === option && !isQuestionCorrect ? 'bg-red-100 dark:bg-red-800 border-red-500' : ''}
                    ${isQuestionSubmitted ? 'cursor-not-allowed opacity-80' : 'cursor-pointer'}
                    `}
                  >
                    <span className="text-gray-800 dark:text-white">
                      {option === 'Tom' ? T.optionA : option === 'David' ? T.optionB : option === 'Prabhat' ? T.optionC : T.optionD}
                    </span>
                  </button>
                ))}
              </div>

              {!isQuestionSubmitted && (
                <button
                  onClick={handleSubmit}
                  disabled={!currentAnswer}
                  className={`w-full py-3 rounded-lg font-bold text-white transition duration-200 ${
                    currentAnswer
                      ? 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {T.submit}
                </button>
              )}

              {isQuestionSubmitted && (
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-lg text-center font-bold text-lg ${
                      isQuestionCorrect
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}
                  >
                    {isQuestionCorrect ? T.correct : T.incorrect}
                  </div>

                  <div className="flex gap-4">
                    {!isQuestionCorrect && (
                      <button
                        onClick={handleTryAgain}
                        className="flex-1 py-3 rounded-lg font-bold text-white bg-orange-600 hover:bg-orange-700 active:bg-orange-800 transition duration-200"
                      >
                        {T.tryAgain}
                      </button>
                    )}
                    <button
                      onClick={() => setShowExplanation(!showExplanation)}
                      className="flex-1 py-3 rounded-lg font-bold text-white bg-blue-600 hover:bg-blue-700 active:bg-blue-800 transition duration-200"
                    >
                      {showExplanation ? T.tryAgain : T.viewExplanation}
                    </button>
                  </div>
                </div>
              )}

              {showExplanation && (
                <div className="w-full bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-400 dark:border-blue-600 p-4 rounded-lg shadow-md">
                  <div className="text-gray-700 dark:text-gray-200 leading-relaxed">
                    {explanationTextContent}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4">
            <p>{T.footer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;