import React, { CSSProperties } from 'react';
import AkashImage from './Images/Akash.png'
import PrabhatImage from './Images/Prabhat.png'
import TomImage from './Images/Tom.png'

// --- Language and Translation Definitions ---
type Language = 'en' | 'hi';

interface Translation {
  instruction: string;
  dragInstruction: string;
  submit: string;
  correct: string;
  incorrect: string;
  viewExplanation: string;
  tryAgain: string;
  explanation: React.ReactNode;
  footer: string;
  leftLabel: string;
  rightLabel: string;
  emptyLabel: string;
}

const translations: Record<Language, Translation> = {
  en: {
    instruction: "Can you arrange Tom and Prabhat in these placeholders so that Tom is sitting to the right of Prabhat?",
    dragInstruction: "Drag and drop the avatars to the placeholders",
    submit: "Submit Answer",
    correct: "Correct! Well done! 🎉",
    incorrect: "Incorrect. Try again!",
    viewExplanation: "View Explanation",
    tryAgain: "Try Again",
    explanation: (
      <div className="space-y-3">
        <p className="font-semibold text-lg text-gray-900 dark:text-gray-50 text-center p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg">
          <span className="text-green-600 dark:text-green-400 font-extrabold">Prabhat</span> should be at the <span className="underline">Right</span> position, and <span className="text-red-600 dark:text-red-400 font-extrabold">Tom</span> should be at the <span className="underline">Top</span> position.
        </p>
        <p className="text-sm italic text-gray-600 dark:text-gray-300 text-center p-1 border-t dark:border-gray-600 pt-2">
          *When facing the center, **Right** means Counter-Clockwise. So Tom is to the right of Prabhat.*
        </p>
      </div>
    ),
    footer: "Drag and drop the avatars to complete the arrangement.",
    leftLabel: "Left",
    rightLabel: "Right",
    emptyLabel: "EMPTY",
  },
  hi: {
    instruction: "क्या आप टॉम और प्रभात को इन प्लेसहोल्डर में इस तरह व्यवस्थित कर सकते हैं कि टॉम, प्रभात के दाएँ बैठा हो?",
    dragInstruction: "अवतारों को प्लेसहोल्डर पर खींचें और छोड़ें",
    submit: "उत्तर जमा करें",
    correct: "सही! बहुत बढ़िया! 🎉",
    incorrect: "गलत। पुनः प्रयास करें!",
    viewExplanation: "व्याख्या देखें",
    tryAgain: "पुनः प्रयास करें",
    explanation: (
      <div className="space-y-3">
        <p className="font-semibold text-lg text-gray-900 dark:text-gray-50 text-center p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg" style={{ lineHeight: '1.8' }}>
          <span className="text-green-600 dark:text-green-400 font-extrabold">प्रभात</span> को <span className="underline">दाएँ</span> स्थिति पर होना चाहिए, और <span className="text-red-600 dark:text-red-400 font-extrabold">टॉम</span> को <span className="underline">ऊपर</span> स्थिति पर होना चाहिए।
        </p>
        <p className="text-sm italic text-gray-600 dark:text-gray-300 text-center p-1 border-t dark:border-gray-600 pt-2" style={{ fontFamily: 'serif' }}>
          *केंद्र की ओर मुख करते समय, दाएँ का अर्थ है वामावर्त। इसलिए टॉम प्रभात के दाएँ है।*
        </p>
      </div>
    ),
    footer: "व्यवस्था पूर्ण करने के लिए अवतारों को खींचें और छोड़ें।",
    leftLabel: "बाएँ",
    rightLabel: "दाएँ",
    emptyLabel: "खाली",
  }
};

interface PlaceholderSlot {
  id: string;
  position: 'top' | 'right' | 'left';
  label: string;
  occupant: string | null;
  isFixed: boolean;
}

interface CircularArrangementProps {
  slots: PlaceholderSlot[];
  circleSize: number;
  onDrop: (slotId: string, person: string) => void;
  showExplanation: boolean;
  language: Language;
}

const CircularArrangement: React.FC<CircularArrangementProps> = ({
  slots,
  circleSize,
  onDrop,
  showExplanation,
  language
}) => {
  // REDUCED: Avatars reduced from 0.45 to 0.40
  const personSize = Math.max(circleSize * 0.40, 60); 
  const radius = circleSize / 2;
  const offset = personSize / 2;
  const T = translations[language];

  const getPositionStyle = (position: 'top' | 'right' | 'left'): CSSProperties => {
    switch (position) {
      case 'top': return { top: -offset, left: radius - offset };
      case 'right': return { top: radius - offset, right: -offset };
      case 'left': return { top: radius - offset, left: -offset };
      default: return {};
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent, slotId: string) => {
    e.preventDefault();
    const person = e.dataTransfer.getData('person');
    if (person) {
      onDrop(slotId, person);
    }
  };

  const renderSlots = () => {
    // Explanation slots show the correct answer
    const explanationSlots: PlaceholderSlot[] = [
      { id: 'top', position: 'top', label: T.emptyLabel, occupant: 'Tom', isFixed: true },
      { id: 'right', position: 'right', label: T.emptyLabel, occupant: 'Prabhat', isFixed: true },
      { id: 'left', position: 'left', label: T.emptyLabel, occupant: 'Akash', isFixed: true }
    ];
    
    // Default slots use the 'EMPTY' label when unoccupied
    const defaultSlots = slots.map(s => ({...s, label: s.occupant ? s.occupant : T.emptyLabel}));

    const activeSlots = showExplanation ? explanationSlots : defaultSlots;


    return activeSlots.map((slot) => {
      const slotStyle: CSSProperties = {
        ...getPositionStyle(slot.position),
        width: `${personSize}px`,
        height: `${personSize}px`,
      };

      const size = Math.round(personSize);
      let imageUrl = '';
      let text = '';

      if (slot.occupant === 'Tom') {
        text = 'TOM';
        imageUrl = TomImage;
      } else if (slot.occupant === 'Prabhat') {
        text = 'PRAB';
        imageUrl = PrabhatImage;
      } else if (slot.occupant === 'Akash') {
        text = 'AKAS';
        imageUrl = AkashImage;
      }

      const nameDistance = personSize * 0.05;
      const externalOffset = offset * 1.5;
      
      const isDroppable = !showExplanation && !slot.occupant && !slot.isFixed;
      const isOccupied = slot.occupant;
      const isDraggable = isOccupied && !slot.isFixed && !showExplanation;

      return (
        <div key={slot.id}>
          <div
            className={`absolute rounded-full shadow-lg transition duration-300 border-4 flex justify-center items-center ${
              isOccupied 
                ? 'border-white bg-white dark:bg-gray-700' 
                : 'border-dashed border-gray-400 dark:border-gray-500 bg-gray-100 dark:bg-gray-800'
            } ${slot.isFixed ? 'opacity-100' : isOccupied ? 'cursor-pointer hover:ring-4 ring-blue-400' : ''}`}
            style={slotStyle}
            onDragOver={isDroppable ? handleDragOver : undefined}
            onDrop={isDroppable ? (e) => handleDrop(e, slot.id) : undefined}
            onClick={isDraggable ? () => onDrop(slot.id, '') : undefined}
          >
            {isOccupied ? (
              <img
                src={imageUrl}
                alt={slot.occupant}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              <div className="text-gray-400 dark:text-gray-500 text-2xl font-bold">
                {slot.label}
              </div>
            )}
          </div>

          {isOccupied && (
            <span
              className="absolute font-bold"
              style={{
                zIndex: 20,
                fontSize: '1.1rem',
                color: slot.occupant === 'Tom' ? '#dc2626' : slot.occupant === 'Prabhat' ? '#10b981' : '#3b82f6',
                
                // Tom (Top position) - Fixed to be very close
                ...(slot.position === 'top' && { 
                    top: -externalOffset, 
                    left: radius,
                    transform: `translateX(-50%) translateY(-${personSize * 0.8-90}px)`
                }),
                // Prabhat (Right position) - Closer, with slightly increased X offset for distance
                ...(slot.position === 'right' && { 
                    top: radius, 
                    right: -externalOffset,
                    transform: `translateX(${nameDistance * 4+40}px) translateY(-50%)`
                }),
                // Akash (Left position) - Closer
                ...(slot.position === 'left' && { 
                    top: radius, 
                    left: -externalOffset,
                    transform: `translateX(-${personSize + nameDistance * 4-100}px) translateY(-50%)` 
                }),
              }}
            >
              {slot.occupant}
            </span>
          )}
        </div>
      );
    });
  };

  const renderExplanationArrow = () => {
    if (!showExplanation) return null;

    const R_Circle = circleSize / 2;
    const ARROW_OFFSET = 90;
    const offsetCalc = personSize / 2;
    const dashedCircleSize = 64;
    const mugSize = 48;
    const lineStrokeColor = '#3b82f6';
    const viewBoxSize = circleSize + ARROW_OFFSET * 3;

    const STROKE_WIDTH = 2;
    const MARKER_SIZE = 8;
    const arrowRadius = R_Circle + ARROW_OFFSET;

    // Right Arrow: Prabhat (3 PM) -> Tom (12 PM) - Counter Clockwise
    const startAngle = 0 * Math.PI; // 3 PM (Right)
    const endAngle = 1.5 * Math.PI; // 12 PM (Top)

    const startX = R_Circle + arrowRadius * Math.cos(startAngle);
    const startY = R_Circle + arrowRadius * Math.sin(startAngle);

    const endX = R_Circle + arrowRadius * Math.cos(endAngle);
    const endY = R_Circle + arrowRadius * Math.sin(endAngle);

    const sweepFlag = 0; // Counter-Clockwise
    const arrowPath = `M ${startX} ${startY} A ${arrowRadius} ${arrowRadius} 0 0 ${sweepFlag} ${endX} ${endY}`;

    const labelRadius = arrowRadius + 10;
    
    // Label placement for Right Arrow (Top-Right quadrant)
    const preciseLabelAngle = 1.75 * Math.PI; 
    const labelX = R_Circle + labelRadius * Math.cos(preciseLabelAngle) * 1.1;
    const labelY = R_Circle + labelRadius * Math.sin(preciseLabelAngle) * 1.1;

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
            <marker id="arrowhead-right" markerWidth={MARKER_SIZE} markerHeight={MARKER_SIZE} refX={MARKER_SIZE * 0.8} refY={MARKER_SIZE * 0.5} orient="auto">
              <path d={`M 0 0 L ${MARKER_SIZE} ${MARKER_SIZE * 0.5} L 0 ${MARKER_SIZE} z`} fill="#9333ea" />
            </marker>
          </defs>

          {/* Directional Arrow (Right) */}
          <path
            d={arrowPath}
            fill="none"
            stroke="#9333ea" // Purple color for Right arrow
            strokeWidth={STROKE_WIDTH}
            markerEnd="url(#arrowhead-right)"
          />
          <text
            x={labelX}
            y={labelY}
            className="font-extrabold"
            fill="#9333ea"
            style={{ fontSize: '18px', textShadow: '0 0 4px rgba(234,179,8,0.5)' }}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {T.rightLabel}
          </text>

          {/* FACING ARROWS FOR ALL THREE USERS (NEW REQUIREMENT) */}
          
          {/* Facing Arrow: Tom (Top) */}
          <path
            d={`M ${R_Circle} ${R_Circle - radius + offsetCalc - 5} L ${R_Circle} ${R_Circle - mugSize * 0.5}`}
            fill="none"
            stroke={lineStrokeColor}
            strokeWidth="2"
            markerEnd="url(#facingArrowhead)"
            strokeDasharray="4,3"
          />

          {/* Facing Arrow: Prabhat (Right) */}
          <path
            d={`M ${R_Circle + radius - offsetCalc + 5} ${R_Circle} L ${R_Circle + mugSize * 0.5} ${R_Circle}`}
            fill="none"
            stroke={lineStrokeColor}
            strokeWidth="2"
            markerEnd="url(#facingArrowhead)"
            strokeDasharray="4,3"
          />

          {/* Facing Arrow: Akash (Left) */}
          <path
            d={`M ${R_Circle - radius + offsetCalc - 5} ${R_Circle} L ${R_Circle - mugSize * 0.5} ${R_Circle}`}
            fill="none"
            stroke={lineStrokeColor}
            strokeWidth="2"
            markerEnd="url(#facingArrowhead)"
            strokeDasharray="4,3"
          />
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
          {renderExplanationArrow()}
          {renderSlots()}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [slots, setSlots] = React.useState<PlaceholderSlot[]>([
    { id: 'top', position: 'top', label: '12', occupant: null, isFixed: false },
    { id: 'right', position: 'right', label: '3', occupant: null, isFixed: false },
    { id: 'left', position: 'left', label: '9', occupant: 'Akash', isFixed: true }
  ]);
  const [availablePeople, setAvailablePeople] = React.useState<string[]>(['Tom', 'Prabhat']);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [showExplanation, setShowExplanation] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  // Max circle size reduced slightly from 400 to 380 for better fit on small devices
  const [circleSize, setCircleSize] = React.useState(380); 
  const [language, setLanguage] = React.useState<Language>('en');

  const T = translations[language];

  const handleDragStart = (e: React.DragEvent, person: string) => {
    e.dataTransfer.setData('person', person);
  };

  const handleDrop = (slotId: string, person: string) => {
    if (person === '') {
      const slot = slots.find(s => s.id === slotId);
      if (slot && !slot.isFixed && slot.occupant) {
        setAvailablePeople(prev => [...prev, slot.occupant!]);
        setSlots(prev => prev.map(s => 
          s.id === slotId ? { ...s, occupant: null } : s
        ));
      }
      return;
    }

    const updatedSlots = slots.map(slot => {
      if (slot.occupant === person && !slot.isFixed) {
        return { ...slot, occupant: null };
      }
      return slot;
    });

    const targetSlot = updatedSlots.find(s => s.id === slotId);
    if (targetSlot && !targetSlot.occupant && !targetSlot.isFixed) {
      targetSlot.occupant = person;
      setSlots(updatedSlots);
      setAvailablePeople(prev => prev.filter(p => p !== person));
    }
  };

  const handleSubmit = () => {
    const allFilled = slots.filter(s => !s.isFixed).every(slot => slot.occupant !== null);
    if (allFilled) {
      setIsSubmitted(true);
    }
  };

  const handleTryAgain = () => {
    setSlots([
      { id: 'top', position: 'top', label: T.emptyLabel, occupant: null, isFixed: false },
      { id: 'right', position: 'right', label: T.emptyLabel, occupant: null, isFixed: false },
      { id: 'left', position: 'left', label: '9', occupant: 'Akash', isFixed: true }
    ]);
    setAvailablePeople(['Tom', 'Prabhat']);
    setIsSubmitted(false);
    setShowExplanation(false);
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
    handleTryAgain();
  };

  React.useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }

    const calculateSize = () => {
      // Adjusted calculation for max size
      const size = Math.min(window.innerWidth * 0.85, 380);
      setCircleSize(size);
    };

    calculateSize();
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, [isDarkMode]);

  const topSlot = slots.find(s => s.id === 'top');
  const rightSlot = slots.find(s => s.id === 'right');
  const isCorrect = topSlot?.occupant === 'Tom' && rightSlot?.occupant === 'Prabhat';

  const allOccupied = availablePeople.length === 0;

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500 p-4 sm:p-6 flex flex-col items-center font-sans">
        <div className="w-full max-w-4xl space-y-2"> {/* space-y-2 retained for overall layout cohesion */}
          <header className="flex flex-col sm:flex-row justify-between items-center w-full space-y-4 sm:space-y-0">
            <h1 className="text-xl sm:text-3xl font-extrabold text-gray-800 dark:text-white text-center sm:text-left flex-grow">
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

          <div className="bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border-t-4 border-green-500">
            {/* Visually appealing question box */}
            <div className="p-4 sm:p-6 bg-blue-50 dark:bg-blue-900 rounded-lg border-2 border-blue-200 dark:border-blue-700 shadow-inner"> 
              <h2 className="text-xl sm:text-2xl font-extrabold text-blue-800 dark:text-blue-200 text-center mb-2">
                {T.instruction}
              </h2>
              <p className="text-sm text-blue-600 dark:text-blue-300 text-center italic font-medium">
                {T.dragInstruction}
              </p>
            </div>

            <CircularArrangement
              slots={slots}
              circleSize={circleSize}
              onDrop={handleDrop}
              showExplanation={showExplanation}
              language={language}
            />

            <div className="mt-1"> 
              <h3 className="text-md font-semibold text-gray-700 dark:text-gray-200 text-center mb-4">
                Available Characters:
              </h3>
              <div className="flex justify-center gap-10">
                {['Tom', 'Prabhat'].map((person) => {
                  // REDUCED: Available character icons reduced from 128px (w-32/h-32) to 112px (w-28/h-28)
                  const size = 112; 
                  const text = person === 'Tom' ? 'TOM' : 'PRAB';
                  const imageUrl = person === 'Tom' 
                    ? TomImage
                    : PrabhatImage;
                  
                  const isAvailable = availablePeople.includes(person);
                  const isPlaced = !isAvailable;

                  return (
                    <div
                      key={person}
                      draggable={isAvailable}
                      onDragStart={(e) => isAvailable && handleDragStart(e, person)}
                      className={`flex flex-col items-center ${
                        isAvailable ? 'cursor-move hover:scale-110' : 'opacity-40 cursor-not-allowed'
                      } transition-all`}
                    >
                      <div className={`w-28 h-28 rounded-full shadow-lg border-4 overflow-hidden ${
                        isAvailable ? 'border-white' : 'border-gray-400'
                      }`}>
                        <img src={imageUrl} alt={person} className="w-full h-full object-cover" />
                      </div>
                      <span className={` font-bold text-lg ${
                        person === 'Tom' ? 'text-red-600' : 'text-green-600'
                      } ${isPlaced ? 'opacity-40' : ''}`}>
                        {person}
                      </span>
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-center text-gray-500 dark:text-gray-400 mt-3 italic">
                Click on placed avatars in the circle to remove them
              </p>
            </div>

            <div className="mt-6 space-y-4">
              {!isSubmitted && (
                <button
                  onClick={handleSubmit}
                  disabled={!allOccupied}
                  className={`w-full py-3 rounded-lg font-bold text-white transition duration-200 ${
                    allOccupied
                      ? 'bg-green-600 hover:bg-green-700 active:bg-green-800'
                      : 'bg-gray-400 cursor-not-allowed'
                  }`}
                >
                  {T.submit}
                </button>
              )}

              {isSubmitted && (
                <div className="space-y-4">
                  <div
                    className={`p-4 rounded-lg text-center font-bold text-lg ${
                      isCorrect
                        ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                        : 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200'
                    }`}
                  >
                    {isCorrect ? T.correct : T.incorrect}
                  </div>

                  <div className="flex gap-4">
                    {!isCorrect && (
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
                    {T.explanation}
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
