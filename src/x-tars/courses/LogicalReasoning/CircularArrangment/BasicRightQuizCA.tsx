import React, { CSSProperties } from 'react';
import AkashImage from './Images/Akash.png'
import PrabhatImage from './Images/Prabhat.png'
import TomImage from './Images/Tom.png'
import DavidImage from './Images/David.png'

// --- Language and Translation Definitions ---
type Language = 'en' | 'hi';

interface Translation {
  title: string;
  question: string;
  optionA: string;
  optionB: string;
  optionC: string;
  submit: string;
  correct: string;
  incorrect: string;
  viewExplanation: string;
  tryAgain: string;
  explanation: React.ReactNode;
  footer: string;
  facingCenter: string;
  leftLabel: string;
  rightLabel: string;
}

const translations: Record<Language, Translation> = {
  en: {
    title: "Circular Arrangement Quiz",
    question: "Who is sitting to the right of Prabhat?",
    optionA: "Tom",
    optionB: "David",
    optionC: "Akash",
    submit: "Submit Answer",
    correct: "Correct! Well done! 🎉",
    incorrect: "Incorrect. Try again!",
    viewExplanation: "View Explanation",
    tryAgain: "Try Again",
    explanation: (
      <div className="space-y-3">
        <p className="font-semibold text-lg text-gray-900 dark:text-gray-50 text-center p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg">
          <span className="text-orange-600 dark:text-orange-400 font-extrabold">David</span> is to the <span className="underline text-green-600 dark:text-green-400">Left</span> of <span className="text-green-600 dark:text-green-400 font-extrabold">Prabhat</span>, and <span className="text-red-600 dark:text-red-400 font-extrabold">Tom</span> is to the <span className="underline text-purple-600 dark:text-purple-400">Right</span> of <span className="text-green-600 dark:text-green-400 font-extrabold">Prabhat</span>.
        </p>
        <p className="text-sm italic text-gray-600 dark:text-gray-300 text-center p-1 border-t dark:border-gray-600 pt-2">
          *Important: We identified Left (Clockwise) and Right (Counter-Clockwise) based on Prabhat facing the center.*
        </p>
      </div>
    ),
    footer: "The avatars are customized image placeholders for clarity.",
    facingCenter: "Facing centre",
    leftLabel: "Left",
    rightLabel: "Right"
  },
  hi: {
    title: "गोलाकार व्यवस्था प्रश्नोत्तरी",
    question: "प्रभात के दाएँ कौन बैठा है?",
    optionA: "टॉम",
    optionB: "डेविड",
    optionC: "आकाश",
    submit: "उत्तर जमा करें",
    correct: "सही! बहुत बढ़िया! 🎉",
    incorrect: "गलत। पुनः प्रयास करें!",
    viewExplanation: "व्याख्या देखें",
    tryAgain: "पुनः प्रयास करें",
    explanation: (
      <div className="space-y-3">
        <p className="font-semibold text-lg text-gray-900 dark:text-gray-50 text-center p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg" style={{ lineHeight: '1.8' }}>
          <span className="text-orange-600 dark:text-orange-400 font-extrabold">डेविड</span>, <span className="text-green-600 dark:text-green-400 font-extrabold">प्रभात</span> के <span className="underline text-green-600 dark:text-green-400">बाएँ</span> बैठा है, और <span className="text-red-600 dark:text-red-400 font-extrabold">टॉम</span>, <span className="text-green-600 dark:text-green-400 font-extrabold">प्रभात</span> के <span className="underline text-purple-600 dark:text-purple-400">दाएँ</span> बैठा है।
        </p>
        <p className="text-sm italic text-gray-600 dark:text-gray-300 text-center p-1 border-t dark:border-gray-600 pt-2" style={{ fontFamily: 'serif' }}>
          *ज़रूरी: हमने ये दिशाएँ प्रभात के केंद्र की ओर मुख करके बैठने के आधार पर पहचानी हैं।*
        </p>
      </div>
    ),
    footer: "स्पष्टता के लिए अवतार अनुकूलित छवि प्लेसहोल्डर हैं।",
    facingCenter: "केंद्र की ओर मुख",
    leftLabel: "बाएँ",
    rightLabel: "दाएँ"
  }
};

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
}

const CircularArrangement: React.FC<CircularArrangementProps> = ({
  people,
  circleSize,
  showArrows,
  language
}) => {
  const personSize = Math.max(circleSize * 0.40, 50);
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

      if (person.name === 'Tom') {
        imageUrl = TomImage;
      } else if (person.name === 'Prabhat') {
        imageUrl = PrabhatImage;
      } else if (person.name === 'Akash') {
        imageUrl = AkashImage;
      } else if (person.name === 'David') {
        imageUrl = DavidImage;
      } else {
        imageUrl = `https://placehold.co/${size}x${size}/6b7280/ffffff?text=U`;
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
            className="absolute text-gray-800 dark:text-gray-200 font-bold"
            style={{
              zIndex: 20,
              fontSize: '1.1rem',
              color: person.name === 'Tom' ? '#dc2626' :
                     person.name === 'Prabhat' ? '#10b981' :
                     person.name === 'Akash' ? '#3b82f6' : '#f97316',
              ...(person.position === 'top' && {
                top: -externalOffset,
                left: radius,
                transform: `translateX(-50%) translateY(-${personSize * 0.8 - 85}px)`
              }),
              ...(person.position === 'right' && {
                top: radius,
                right: -externalOffset,
                transform: `translateX(${nameDistance + 55}px) translateY(-50%)`
              }),
              ...(person.position === 'left' && {
                top: radius,
                left: -externalOffset,
                transform: `translateX(-${personSize + (nameDistance - 95)}px) translateY(-50%)`
              }),
              ...(person.position === 'bottom' && {
                bottom: -externalOffset,
                left: radius,
                transform: `translateX(-50%) translateY(${nameDistance}px)`
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

    const prabhat = people.find(p => p.name === 'Prabhat' && p.position === 'right');
    const tom = people.find(p => p.name === 'Tom' && p.position === 'top');
    const david = people.find(p => p.name === 'David' && p.position === 'bottom');

    if (!prabhat) return null;

    const R_Circle = circleSize / 2;
    const ARROW_OFFSET = 90;
    const DUAL_ARROW_GAP = 10;

    const offsetCalc = personSize / 2;
    const dashedCircleSize = 64;
    const mugSize = 48;
    const lineStrokeColor = '#3b82f6';

    const viewBoxSize = circleSize + ARROW_OFFSET * 3;

    const renderSingleArrow = (startName: string, endName: string, label: string, isLeft: boolean, color: string) => {
      const STROKE_WIDTH = 2;
      const MARKER_SIZE = 8;

      const arrowRadius = R_Circle + ARROW_OFFSET + (isLeft ? DUAL_ARROW_GAP : 0);

      const startPos = people.find(p => p.name === startName)?.position;
      const endPos = people.find(p => p.name === endName)?.position;

      if (!startPos || !endPos) return null;

      const angleMap: Record<Person['position'], number> = {
        'top': 1.5 * Math.PI,
        'right': 0 * Math.PI,
        'bottom': 0.5 * Math.PI,
        'left': 1.0 * Math.PI,
      };

      const startAngle = angleMap[startPos];
      const endAngle = angleMap[endPos];

      const startX = R_Circle + arrowRadius * Math.cos(startAngle);
      const startY = R_Circle + arrowRadius * Math.sin(startAngle);

      const endX = R_Circle + arrowRadius * Math.cos(endAngle);
      const endY = R_Circle + arrowRadius * Math.sin(endAngle);

      const sweepFlag = isLeft ? 1 : 0;

      const arrowPath = `M ${startX} ${startY} A ${arrowRadius} ${arrowRadius} 0 0 ${sweepFlag} ${endX} ${endY}`;

      const labelRadius = arrowRadius + 10;

      let labelX: number;
      let labelY: number;

      if (isLeft) {
        const preciseLabelAngle = 0.25 * Math.PI;
        labelX = R_Circle + labelRadius * Math.cos(preciseLabelAngle) * 1.1;
        labelY = R_Circle + labelRadius * Math.sin(preciseLabelAngle) * 1.1;
      } else {
        const preciseLabelAngle = 1.75 * Math.PI;
        labelX = R_Circle + labelRadius * Math.cos(preciseLabelAngle) * 1.1;
        labelY = R_Circle + labelRadius * Math.sin(preciseLabelAngle) * 1.1;
      }

      return (
        <React.Fragment key={label}>
          <defs>
            <marker id={`arrowhead-${label}`} markerWidth={MARKER_SIZE} markerHeight={MARKER_SIZE} refX={MARKER_SIZE * 0.8} refY={MARKER_SIZE * 0.5} orient="auto">
              <path d={`M 0 0 L ${MARKER_SIZE} ${MARKER_SIZE * 0.5} L 0 ${MARKER_SIZE} z`} fill={color} />
            </marker>
          </defs>
          <path
            d={arrowPath}
            fill="none"
            stroke={color}
            strokeWidth={STROKE_WIDTH}
            markerEnd={`url(#arrowhead-${label})`}
          />
          <text
            x={labelX}
            y={labelY}
            className="font-extrabold"
            fill={color}
            style={{ fontSize: '18px', textShadow: '0 0 4px rgba(234,179,8,0.5)' }}
            textAnchor="middle"
            dominantBaseline="middle"
          >
            {label}
          </text>
        </React.Fragment>
      );
    };

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
          </defs>

          {david && renderSingleArrow('Prabhat', 'David', T.leftLabel, true, '#10b981')}
          {tom && renderSingleArrow('Prabhat', 'Tom', T.rightLabel, false, '#9333ea')}

          <path
            d={`M ${R_Circle} ${R_Circle - radius + offsetCalc - 5} L ${R_Circle} ${R_Circle - mugSize * 0.5}`}
            fill="none"
            stroke={lineStrokeColor}
            strokeWidth="2"
            markerEnd="url(#facingArrowhead)"
            strokeDasharray="4,3"
          />

          <path
            d={`M ${R_Circle + radius - offsetCalc + 5} ${R_Circle} L ${R_Circle + mugSize * 0.5} ${R_Circle}`}
            fill="none"
            stroke={lineStrokeColor}
            strokeWidth="2"
            markerEnd="url(#facingArrowhead)"
            strokeDasharray="4,3"
          />

          <path
            d={`M ${R_Circle - radius + offsetCalc - 5} ${R_Circle} L ${R_Circle - mugSize * 0.5} ${R_Circle}`}
            fill="none"
            stroke={lineStrokeColor}
            strokeWidth="2"
            markerEnd="url(#facingArrowhead)"
            strokeDasharray="4,3"
          />

          <path
            d={`M ${R_Circle} ${R_Circle + radius - offsetCalc + 5} L ${R_Circle} ${R_Circle + mugSize * 0.5}`}
            fill="none"
            stroke={lineStrokeColor}
            strokeWidth="2"
            markerEnd="url(#facingArrowhead)"
            strokeDasharray="4,3"
          />
        </svg>

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
  const [selectedAnswer, setSelectedAnswer] = React.useState<string | null>(null);
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [showExplanation, setShowExplanation] = React.useState(false);
  const [isDarkMode, setIsDarkMode] = React.useState(false);
  const [circleSize, setCircleSize] = React.useState(400);
  const [language, setLanguage] = React.useState<Language>('en');

  const T = translations[language];
  const correctAnswer = 'Tom';

  const people: Person[] = [
    { name: 'Tom', position: 'top', color: 'bg-red-500' },
    { name: 'Prabhat', position: 'right', color: 'bg-green-500' },
    { name: 'David', position: 'bottom', color: 'bg-orange-500' },
    { name: 'Akash', position: 'left', color: 'bg-blue-500' },
  ];

  const handleSubmit = () => {
    if (selectedAnswer) {
      setIsSubmitted(true);
    }
  };

  const handleTryAgain = () => {
    setSelectedAnswer(null);
    setIsSubmitted(false);
    setShowExplanation(false);
  };

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);
  
  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
    setSelectedAnswer(null);
    setIsSubmitted(false);
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

  const isCorrect = selectedAnswer === correctAnswer;

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500 p-4 sm:p-6 flex flex-col items-center font-sans">
        <div className="w-full max-w-4xl space-y-8">
          <header className="flex flex-col sm:flex-row justify-between items-center w-full mb-6 space-y-4 sm:space-y-0">
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
            />

            <div className="mt-6 space-y-4">
              <h2 className="text-xl font-bold text-gray-800 dark:text-white text-center">{T.question}</h2>

              <div className="space-y-3">
                {['Tom', 'David', 'Akash'].map((option) => (
                  <button
                    key={option}
                    onClick={() => !isSubmitted && setSelectedAnswer(option)}
                    disabled={isSubmitted}
                    className={`w-full p-4 rounded-lg border-2 text-left font-medium transition duration-200 ${
                      selectedAnswer === option
                        ? 'border-blue-500 bg-blue-50 dark:bg-blue-900 dark:border-blue-400'
                        : 'border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 hover:border-blue-300 dark:hover:border-blue-500'
                    } ${isSubmitted ? 'cursor-not-allowed opacity-60' : 'cursor-pointer'}`}
                  >
                    <span className="text-gray-800 dark:text-white">
                      {option === 'Tom' ? T.optionA : option === 'David' ? T.optionB : T.optionC}
                    </span>
                  </button>
                ))}
              </div>

              {!isSubmitted && (
                <button
                  onClick={handleSubmit}
                  disabled={!selectedAnswer}
                  className={`w-full py-3 rounded-lg font-bold text-white transition duration-200 ${
                    selectedAnswer
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
                      {T.viewExplanation}
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