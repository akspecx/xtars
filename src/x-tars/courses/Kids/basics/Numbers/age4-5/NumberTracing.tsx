import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';

interface TraceCard {
  number: number;
  word: string;
  color: string;
  gradient: string;
  prompt: string;
  steps: string[];
  funTip: string;
  rightDirections: string[];
  watchOut: string[];
}

const traceCards: TraceCard[] = [
  {
    number: 1,
    word: 'One',
    color: 'text-blue-600',
    gradient: 'from-blue-200 to-blue-300',
    prompt: 'Start at the top and draw a straight line all the way down.',
    steps: [
      'Place your crayon on the red dot at the top.',
      'Pull it straight down to the green dot.',
      'Keep the line tall and steady!',
    ],
    funTip: 'Try saying "down" as you draw the line to keep it straight.',
    rightDirections: [
      'Start at the top dot and pull straight down without stopping.',
      'Keep the line in the middle of the dotted path.',
    ],
    watchOut: [
      'If the line wiggles or leans, slow down and try again.',
      'If you stop halfway, press clear and draw in one smooth motion.',
    ],
  },
  {
    number: 2,
    word: 'Two',
    color: 'text-emerald-600',
    gradient: 'from-emerald-200 to-teal-300',
    prompt: 'Make a rainbow curve, then a slide to the right, and a short line across the bottom.',
    steps: [
      'Curve from the top dot around to the right.',
      'Slide down the hill to the bottom.',
      'Finish with a tiny line across the grass!',
    ],
    funTip: 'Say "rainbow, slide, across" while you draw to remember the steps.',
    rightDirections: [
      'Make the rainbow curve first, then the slide, then the tiny line.',
      'Keep the bottom line straight and touch the dots.',
    ],
    watchOut: [
      'If the curve is too pointy, try making it rounder.',
      'If the slide goes past the dots, lift up sooner and start again.',
    ],
  },
  {
    number: 3,
    word: 'Three',
    color: 'text-rose-600',
    gradient: 'from-pink-200 to-rose-300',
    prompt: 'Draw two rainbow bumps that touch in the middle.',
    steps: [
      'Start at the top dot and make a soft rainbow to the middle.',
      'From the middle dot, make another rainbow down to the bottom.',
      'Keep both rainbows round and bouncy!',
    ],
    funTip: 'Three looks like two little clouds stacked together.',
    rightDirections: [
      'Draw two round bumps that touch right in the middle.',
      'Keep both bumps the same size for a balanced three.',
    ],
    watchOut: [
      'If the bumps are flat, trace again with a gentle curve.',
      'If the lines cross the dotted path, slow down and stay inside.',
    ],
  },
  {
    number: 4,
    word: 'Four',
    color: 'text-amber-600',
    gradient: 'from-amber-200 to-yellow-300',
    prompt: 'Make a small down line, then a slide, then a long tall line.',
    steps: [
      'Draw a short line straight down from the top dot.',
      'From that dot, draw a slide going to the right.',
      'Finish with a tall line straight down on the right side.',
    ],
    funTip: 'Four is like a chair with a tall back.',
    rightDirections: [
      'Make the little down line first, then the slide, then the tall line.',
      'Keep the tall line nice and straight from top to bottom.',
    ],
    watchOut: [
      'If the slide sags, try making it a straight line.',
      'If the tall line leans, clear it and draw it slowly again.',
    ],
  },
  {
    number: 5,
    word: 'Five',
    color: 'text-purple-600',
    gradient: 'from-purple-200 to-violet-300',
    prompt: 'Make a short line across, then a straight line down, and finish with a big belly.',
    steps: [
      'Draw a little line across the top.',
      'Drop straight down from the left side.',
      'Make a big round belly that curves to the right.',
    ],
    funTip: 'Say "across, down, around" to keep the rhythm.',
    rightDirections: [
      'Draw the top line first, then the straight line down, then the round belly.',
      'Let the belly touch the dotted path and curve all the way around.',
    ],
    watchOut: [
      'If the belly looks pointy, slow down and make it round.',
      'If the bottom line doesn’t touch the dots, try again and reach them.',
    ],
  },
  {
    number: 6,
    word: 'Six',
    color: 'text-sky-600',
    gradient: 'from-sky-200 to-blue-300',
    prompt: 'Make a small hook and then a big round belly.',
    steps: [
      'Start at the top dot and make a tiny hook going left.',
      'Keep going all the way around to make a circle that closes.',
      'Make sure the circle is smooth and round.',
    ],
    funTip: 'Six is like a snail with a tiny head and round shell.',
    rightDirections: [
      'Make the little hook first, then circle around until you meet the dot.',
      'Keep the circle wide so it fills the dotted path.',
    ],
    watchOut: [
      'If the circle doesn’t close, redraw and connect at the dot.',
      'If the hook is too big, try making it smaller and neater.',
    ],
  },
  {
    number: 7,
    word: 'Seven',
    color: 'text-cyan-600',
    gradient: 'from-cyan-200 to-blue-300',
    prompt: 'Draw a line across the top and then a slide down to the left.',
    steps: [
      'Make a short line across the top from left to right.',
      'From the right dot, slide down to the left.',
      'Lift your finger at the end of the slide!',
    ],
    funTip: 'Seven is a roof with a slide coming down.',
    rightDirections: [
      'Draw the top line first, then the slide in one smooth motion.',
      'Keep the slide straight and point it toward the lower dot.',
    ],
    watchOut: [
      'If the slide curves, try again with a steady hand.',
      'If the slide misses the bottom dot, clear and aim for it next time.',
    ],
  },
  {
    number: 8,
    word: 'Eight',
    color: 'text-red-600',
    gradient: 'from-red-200 to-pink-300',
    prompt: 'Make a little loop on top and a big loop on the bottom.',
    steps: [
      'Start at the middle dot and make a small loop going up.',
      'Without lifting, cross the middle and make a bigger loop below.',
      'Meet back at the middle dot to finish.',
    ],
    funTip: 'Eight is a snowman with two round circles.',
    rightDirections: [
      'Make the small top loop first, then the bigger bottom loop.',
      'Cross right through the middle dot so both loops meet.',
    ],
    watchOut: [
      'If the loops are lumpy, slow down and trace the curve again.',
      'If the loops don’t meet at the middle, try again and touch the dot.',
    ],
  },
  {
    number: 9,
    word: 'Nine',
    color: 'text-indigo-600',
    gradient: 'from-indigo-200 to-blue-300',
    prompt: 'Make a small circle and a straight line down.',
    steps: [
      'Draw a circle starting at the top dot and come back to close it.',
      'From that same top dot, draw a line straight down.',
      'Keep the line neat and tall.',
    ],
    funTip: 'Nine is a balloon with a string.',
    rightDirections: [
      'Draw a neat circle first, finishing right back at the top dot.',
      'Add the straight line down last, keeping it in the dotted path.',
    ],
    watchOut: [
      'If the circle is open, clear it and try to close it tight.',
      'If the straight line wiggles, trace slowly and keep it steady.',
    ],
  },
  {
    number: 10,
    word: 'Ten',
    color: 'text-teal-600',
    gradient: 'from-teal-200 to-green-300',
    prompt: 'Trace a tall "1" and then a round "0".',
    steps: [
      'First, draw a tall straight "1".',
      'Next to it, make a round "0" starting at the top.',
      'Keep both numbers close together like friends!',
    ],
    funTip: 'Ten is a tall stick standing next to a hoop.',
    rightDirections: [
      'Draw the 1 straight down before starting the 0.',
      'Make the 0 round and close, hugging the 1 closely.',
    ],
    watchOut: [
      'If the 1 leans, slow down and draw it straight again.',
      'If the 0 floats away, clear it and redraw closer to the 1.',
    ],
  },
];

const encouragementMessages = [
  'Wonderful tracing! Your numbers look amazing!',
  'Great job! Keep those lines smooth and steady!',
  'You are a tracing superstar!',
  'Fantastic work! Those numbers are coming to life!',
  'Keep going! Every line helps you get better.',
];

interface NumberTraceCanvasProps {
  data: TraceCard;
  isCompleted: boolean;
  onCompleteToggle: () => void;
  onReplayPrompt: () => void;
}

const NumberTraceCanvas: React.FC<NumberTraceCanvasProps> = ({ data, isCompleted, onCompleteToggle, onReplayPrompt }) => {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const drawingContextRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawingRef = useRef(false);

  const setupCanvas = useCallback(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const { width, height } = container.getBoundingClientRect();
    const scale = window.devicePixelRatio || 1;

    canvas.width = width * scale;
    canvas.height = height * scale;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const context = canvas.getContext('2d');
    if (!context) return;

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.scale(scale, scale);
    context.lineCap = 'round';
    context.lineJoin = 'round';
    context.lineWidth = 6;
    context.strokeStyle = '#2563eb';

    drawingContextRef.current = context;
  }, []);

  useEffect(() => {
    setupCanvas();
    window.addEventListener('resize', setupCanvas);
    return () => {
      window.removeEventListener('resize', setupCanvas);
    };
  }, [setupCanvas]);

  const getPoint = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }, []);

  const handlePointerDown = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    const context = drawingContextRef.current;
    if (!canvas || !context) return;

    event.preventDefault();
    canvas.setPointerCapture(event.pointerId);

    const point = getPoint(event);
    if (!point) return;

    isDrawingRef.current = true;
    context.beginPath();
    context.moveTo(point.x, point.y);
  }, [getPoint]);

  const handlePointerMove = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;

    const context = drawingContextRef.current;
    if (!context) return;

    event.preventDefault();
    const point = getPoint(event);
    if (!point) return;

    context.lineTo(point.x, point.y);
    context.stroke();
  }, [getPoint]);

  const stopDrawing = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawingRef.current) return;

    const canvas = canvasRef.current;
    const context = drawingContextRef.current;
    if (!canvas || !context) return;

    event.preventDefault();
    if (canvas.hasPointerCapture(event.pointerId)) {
      canvas.releasePointerCapture(event.pointerId);
    }
    context.closePath();
    isDrawingRef.current = false;
  }, []);

  const handleClear = useCallback(() => {
    const canvas = canvasRef.current;
    const context = drawingContextRef.current;
    if (!canvas || !context) return;

    context.save();
    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.restore();
  }, []);

  return (
    <div className="space-y-6">
      <div className="relative mx-auto w-full max-w-sm">
        <div
          ref={containerRef}
          className="relative w-full aspect-[3/4] rounded-3xl border-4 border-dashed border-blue-200 bg-white shadow-inner overflow-hidden"
        >
          <svg className="absolute inset-0 h-full w-full text-gray-200" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id={`trace-gradient-${data.number}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fde68a" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <text
              x="50%"
              y="58%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="220"
              fill="none"
              stroke={`url(#trace-gradient-${data.number})`}
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="24 18"
            >
              {data.number}
            </text>
          </svg>
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full touch-none"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={stopDrawing}
            onPointerLeave={stopDrawing}
          />
        </div>
      </div>
      <div className="flex flex-wrap justify-center gap-3">
        <button
          onClick={handleClear}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 text-white font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
        >
          Clear Tracing
        </button>
        <button
          onClick={onReplayPrompt}
          className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-semibold shadow-lg transition-transform duration-300 hover:scale-105 inline-flex items-center gap-2"
        >
          <span>🔊</span>
          <span>Play Steps</span>
        </button>
        <button
          onClick={onCompleteToggle}
          className={`px-4 py-2 rounded-full font-semibold shadow-lg transition-transform duration-300 hover:scale-105 ${
            isCompleted
              ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white'
              : 'bg-gradient-to-r from-amber-400 to-amber-500 text-white'
          }`}
        >
          {isCompleted ? 'Great! Trace Again?' : 'I Traced It!'}
        </button>
      </div>
    </div>
  );
};

const NumberTracing: React.FC = () => {
  const [activeNumber, setActiveNumber] = useState<number>(traceCards[0].number);
  const [completedNumbers, setCompletedNumbers] = useState<Set<number>>(new Set());
  const [isSpeaking, setIsSpeaking] = useState(false);

  const traceCardMap = useMemo(() => {
    const map = new Map<number, TraceCard>();
    traceCards.forEach((card) => {
      map.set(card.number, card);
    });
    return map;
  }, []);

  const activeCard = traceCardMap.get(activeNumber) ?? traceCards[0];

  const speak = useCallback(
    (text: string) => {
      if (
        typeof window !== 'undefined' &&
        'speechSynthesis' in window &&
        typeof SpeechSynthesisUtterance !== 'undefined' &&
        !isSpeaking
      ) {
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.9;
        utterance.pitch = 1.3;
        utterance.volume = 0.9;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    },
    [isSpeaking]
  );

  const handleNumberSelect = useCallback((number: number) => {
    setActiveNumber(number);
  }, []);

  const handleWelcomePrompt = useCallback(() => {
    speak('Let us practice tracing numbers together. Choose a number, listen to the steps, and follow the dotted lines with your finger or mouse.');
  }, [speak]);

  const toggleCompleted = useCallback((number: number) => {
    const wasCompleted = completedNumbers.has(number);

    setCompletedNumbers((prev) => {
      const next = new Set(prev);
      if (wasCompleted) {
        next.delete(number);
      } else {
        next.add(number);
      }
      return next;
    });

    const card = traceCardMap.get(number);
    if (wasCompleted) {
      if (card) {
        speak(`Great job wanting to practice ${card.word} again. Remember: ${card.watchOut[0]}`);
      } else {
        speak('Great! Let us trace it again slowly.');
      }
    } else {
      const message = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
      speak(message);
    }
  }, [completedNumbers, speak, traceCardMap]);

  const handleReplaySteps = useCallback(() => {
    const card = traceCardMap.get(activeNumber);
    if (!card) return;
    speak(`${card.word}. ${card.prompt}. ${card.steps.join(' ')} Remember: ${card.rightDirections.join(' ')}. If something looks wiggly, ${card.watchOut[0]}`);
  }, [activeNumber, speak, traceCardMap]);

  const progress = (completedNumbers.size / traceCards.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute -bottom-12 right-4 w-80 h-80 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-10">
          <div className="inline-block mb-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent drop-shadow-lg mb-4">
              Trace the Numbers
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-blue-400 via-indigo-500 to-sky-500 mx-auto rounded-full"></div>
          </div>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-700 font-medium">
            Practice drawing each number by following the friendly dotted path. Use your finger, mouse, or stylus to stay on the lines.
          </p>

          <div className="mt-6 max-w-lg mx-auto">
            <div className="flex justify-between items-center text-sm font-semibold text-gray-700 mb-2">
              <span>Tracing Progress</span>
              <span className="text-blue-600">{completedNumbers.size} / {traceCards.length}</span>
            </div>
            <div className="w-full h-3 bg-white/80 rounded-full overflow-hidden shadow-inner border border-blue-100">
              <div
                className="h-full bg-gradient-to-r from-blue-400 via-indigo-500 to-emerald-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <button
            onClick={handleWelcomePrompt}
            className="mt-6 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-500 text-white font-semibold shadow-xl transition-transform duration-300 hover:scale-105"
          >
            <span>🎧</span>
            <span>Play Welcome Instructions</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-1 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose a Number</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-blue-500 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
              {traceCards.map((card) => {
                const isActive = activeNumber === card.number;
                const isDone = completedNumbers.has(card.number);
                return (
                  <button
                    key={card.number}
                    onClick={() => handleNumberSelect(card.number)}
                    className={`relative rounded-2xl px-4 py-5 text-center transition-all duration-300 transform border-3 ${
                      isActive
                        ? `bg-gradient-to-br ${card.gradient} text-white shadow-2xl scale-105 ring-4 ring-blue-200`
                        : 'bg-white text-gray-800 border-gray-200 hover:border-blue-200 hover:shadow-lg hover:-translate-y-1'
                    }`}
                  >
                    <div className={`text-3xl font-extrabold mb-1 ${isActive ? 'text-white' : card.color}`}>
                      {card.number}
                    </div>
                    <div className={`text-xs font-semibold uppercase tracking-wide ${isActive ? 'text-white/90' : 'text-gray-500'}`}>
                      {card.word}
                    </div>
                    {isDone && (
                      <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center shadow-lg">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-md border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-blue-500 uppercase tracking-wide">Let’s trace</div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                      <span className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br ${activeCard.gradient} text-white text-3xl shadow-lg`}>
                        {activeCard.number}
                      </span>
                      <span>{activeCard.word}</span>
                    </h2>
                    <p className="text-gray-600 mt-2 text-base sm:text-lg">
                      {activeCard.prompt}
                    </p>
                  </div>
                  <div className="flex flex-col items-center sm:items-end gap-2 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-semibold">
                      ✍️ Fine Motor Skill Practice
                    </span>
                    <span className="inline-flex items=center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 font-semibold">
                      🌟 Ages 3 - 4
                    </span>
                  </div>
                </div>

                <NumberTraceCanvas
                  key={activeCard.number}
                  data={activeCard}
                  isCompleted={completedNumbers.has(activeCard.number)}
                  onCompleteToggle={() => toggleCompleted(activeCard.number)}
                  onReplayPrompt={handleReplaySteps}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
                    <h3 className="text-lg font-bold text-blue-700 mb-3">Tracing Steps</h3>
                    <ul className="space-y-2 text-sm text-blue-700 font-medium">
                      {activeCard.steps.map((step, index) => (
                        <li key={index} className="flex gap-3 items-start">
                          <span className="w-6 h-6 flex-shrink-0 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
                            {index + 1}
                          </span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 flex flex-col gap-4">
                    <h3 className="text-lg font-bold text-emerald-700">Helper Tips</h3>
                    <p className="text-sm text-emerald-700 font-medium">{activeCard.funTip}</p>
                    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wide">
                          ✅ Right Way
                        </div>
                        <ul className="text-sm text-emerald-700 space-y-2">
                          {activeCard.rightDirections.map((tip, index) => (
                            <li key={index}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-200 text-red-700 text-xs font-semibold uppercase tracking-wide">
                          ❌ Try Again If
                        </div>
                        <ul className="text-sm text-red-700 space-y-2">
                          {activeCard.watchOut.map((tip, index) => (
                            <li key={index}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="text-xs text-emerald-500 uppercase tracking-wide">Try this:</div>
                    <ul className="text-sm text-emerald-700 space-y-2">
                      <li>• Use a finger, crayon, or stylus for tracing.</li>
                      <li>• Take a deep breath and move slowly along the path.</li>
                      <li>• Say the steps out loud to remember them.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-12">
          <div className="bg-white/80 backdrop-blur-md border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-xl max-w-3xl mx-auto text-center space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">Tracing Tips for Grown-ups</h3>
            <p className="text-base text-gray-600">
              Encourage little learners to hold their finger or stylus gently and trace along the dotted lines. Celebrate each attempt—consistency builds confidence and early writing skills!
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold text-gray-700">
              <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-600">Model each number once</span>
              <span className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-600">Use calm rhythmic words</span>
              <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-600">Take tracing breaks often</span>
            </div>
          </div>
        </section>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -40px) scale(1.05); }
          66% { transform: translate(-20px, 25px) scale(0.95); }
        }
        .animate-blob {
          animation: blob 8s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </div>
  );
};

export default NumberTracing;
