// import React, { useCallback, useMemo, useRef, useState, useEffect } from 'react';

// interface TraceCard {
//   number: number;
//   word: string;
//   color: string;
//   gradient: string;
//   prompt: string;
//   steps: string[];
//   funTip: string;
//   rightDirections: string[];
//   watchOut: string[];
// }

// const traceCards: TraceCard[] = [
//   {
//     number: 1,
//     word: 'One',
//     color: 'text-blue-600',
//     gradient: 'from-blue-200 to-blue-300',
//     prompt: 'Start at the top and draw a straight line all the way down.',
//     steps: [
//       'Place your crayon on the red dot at the top.',
//       'Pull it straight down to the green dot.',
//       'Keep the line tall and steady!',
//     ],
//     funTip: 'Try saying "down" as you draw the line to keep it straight.',
//     rightDirections: [
//       'Start at the top dot and pull straight down without stopping.',
//       'Keep the line in the middle of the dotted path.',
//     ],
//     watchOut: [
//       'If the line wiggles or leans, slow down and try again.',
//       'If you stop halfway, press clear and draw in one smooth motion.',
//     ],
//   },
//   {
//     number: 2,
//     word: 'Two',
//     color: 'text-emerald-600',
//     gradient: 'from-emerald-200 to-teal-300',
//     prompt: 'Make a rainbow curve, then a slide to the right, and a short line across the bottom.',
//     steps: [
//       'Curve from the top dot around to the right.',
//       'Slide down the hill to the bottom.',
//       'Finish with a tiny line across the grass!',
//     ],
//     funTip: 'Say "rainbow, slide, across" while you draw to remember the steps.',
//     rightDirections: [
//       'Make the rainbow curve first, then the slide, then the tiny line.',
//       'Keep the bottom line straight and touch the dots.',
//     ],
//     watchOut: [
//       'If the curve is too pointy, try making it rounder.',
//       'If the slide goes past the dots, lift up sooner and start again.',
//     ],
//   },
//   {
//     number: 3,
//     word: 'Three',
//     color: 'text-rose-600',
//     gradient: 'from-pink-200 to-rose-300',
//     prompt: 'Draw two rainbow bumps that touch in the middle.',
//     steps: [
//       'Start at the top dot and make a soft rainbow to the middle.',
//       'From the middle dot, make another rainbow down to the bottom.',
//       'Keep both rainbows round and bouncy!',
//     ],
//     funTip: 'Three looks like two little clouds stacked together.',
//     rightDirections: [
//       'Draw two round bumps that touch right in the middle.',
//       'Keep both bumps the same size for a balanced three.',
//     ],
//     watchOut: [
//       'If the bumps are flat, trace again with a gentle curve.',
//       'If the lines cross the dotted path, slow down and stay inside.',
//     ],
//   },
//   {
//     number: 4,
//     word: 'Four',
//     color: 'text-amber-600',
//     gradient: 'from-amber-200 to-yellow-300',
//     prompt: 'Make a small down line, then a slide, then a long tall line.',
//     steps: [
//       'Draw a short line straight down from the top dot.',
//       'From that dot, draw a slide going to the right.',
//       'Finish with a tall line straight down on the right side.',
//     ],
//     funTip: 'Four is like a chair with a tall back.',
//     rightDirections: [
//       'Make the little down line first, then the slide, then the tall line.',
//       'Keep the tall line nice and straight from top to bottom.',
//     ],
//     watchOut: [
//       'If the slide sags, try making it a straight line.',
//       'If the tall line leans, clear it and draw it slowly again.',
//     ],
//   },
//   {
//     number: 5,
//     word: 'Five',
//     color: 'text-purple-600',
//     gradient: 'from-purple-200 to-violet-300',
//     prompt: 'Make a short line across, then a straight line down, and finish with a big belly.',
//     steps: [
//       'Draw a little line across the top.',
//       'Drop straight down from the left side.',
//       'Make a big round belly that curves to the right.',
//     ],
//     funTip: 'Say "across, down, around" to keep the rhythm.',
//     rightDirections: [
//       'Draw the top line first, then the straight line down, then the round belly.',
//       'Let the belly touch the dotted path and curve all the way around.',
//     ],
//     watchOut: [
//       'If the belly looks pointy, slow down and make it round.',
//       'If the bottom line doesn’t touch the dots, try again and reach them.',
//     ],
//   },
//   {
//     number: 6,
//     word: 'Six',
//     color: 'text-sky-600',
//     gradient: 'from-sky-200 to-blue-300',
//     prompt: 'Make a small hook and then a big round belly.',
//     steps: [
//       'Start at the top dot and make a tiny hook going left.',
//       'Keep going all the way around to make a circle that closes.',
//       'Make sure the circle is smooth and round.',
//     ],
//     funTip: 'Six is like a snail with a tiny head and round shell.',
//     rightDirections: [
//       'Make the little hook first, then circle around until you meet the dot.',
//       'Keep the circle wide so it fills the dotted path.',
//     ],
//     watchOut: [
//       'If the circle doesn’t close, redraw and connect at the dot.',
//       'If the hook is too big, try making it smaller and neater.',
//     ],
//   },
//   {
//     number: 7,
//     word: 'Seven',
//     color: 'text-cyan-600',
//     gradient: 'from-cyan-200 to-blue-300',
//     prompt: 'Draw a line across the top and then a slide down to the left.',
//     steps: [
//       'Make a short line across the top from left to right.',
//       'From the right dot, slide down to the left.',
//       'Lift your finger at the end of the slide!',
//     ],
//     funTip: 'Seven is a roof with a slide coming down.',
//     rightDirections: [
//       'Draw the top line first, then the slide in one smooth motion.',
//       'Keep the slide straight and point it toward the lower dot.',
//     ],
//     watchOut: [
//       'If the slide curves, try again with a steady hand.',
//       'If the slide misses the bottom dot, clear and aim for it next time.',
//     ],
//   },
//   {
//     number: 8,
//     word: 'Eight',
//     color: 'text-red-600',
//     gradient: 'from-red-200 to-pink-300',
//     prompt: 'Make a little loop on top and a big loop on the bottom.',
//     steps: [
//       'Start at the middle dot and make a small loop going up.',
//       'Without lifting, cross the middle and make a bigger loop below.',
//       'Meet back at the middle dot to finish.',
//     ],
//     funTip: 'Eight is a snowman with two round circles.',
//     rightDirections: [
//       'Make the small top loop first, then the bigger bottom loop.',
//       'Cross right through the middle dot so both loops meet.',
//     ],
//     watchOut: [
//       'If the loops are lumpy, slow down and trace the curve again.',
//       'If the loops don’t meet at the middle, try again and touch the dot.',
//     ],
//   },
//   {
//     number: 9,
//     word: 'Nine',
//     color: 'text-indigo-600',
//     gradient: 'from-indigo-200 to-blue-300',
//     prompt: 'Make a small circle and a straight line down.',
//     steps: [
//       'Draw a circle starting at the top dot and come back to close it.',
//       'From that same top dot, draw a line straight down.',
//       'Keep the line neat and tall.',
//     ],
//     funTip: 'Nine is a balloon with a string.',
//     rightDirections: [
//       'Draw a neat circle first, finishing right back at the top dot.',
//       'Add the straight line down last, keeping it in the dotted path.',
//     ],
//     watchOut: [
//       'If the circle is open, clear it and try to close it tight.',
//       'If the straight line wiggles, trace slowly and keep it steady.',
//     ],
//   },
//   {
//     number: 10,
//     word: 'Ten',
//     color: 'text-teal-600',
//     gradient: 'from-teal-200 to-green-300',
//     prompt: 'Trace a tall "1" and then a round "0".',
//     steps: [
//       'First, draw a tall straight "1".',
//       'Next to it, make a round "0" starting at the top.',
//       'Keep both numbers close together like friends!',
//     ],
//     funTip: 'Ten is a tall stick standing next to a hoop.',
//     rightDirections: [
//       'Draw the 1 straight down before starting the 0.',
//       'Make the 0 round and close, hugging the 1 closely.',
//     ],
//     watchOut: [
//       'If the 1 leans, slow down and draw it straight again.',
//       'If the 0 floats away, clear it and redraw closer to the 1.',
//     ],
//   },
// ];

// const encouragementMessages = [
//   'Wonderful tracing! Your numbers look amazing!',
//   'Great job! Keep those lines smooth and steady!',
//   'You are a tracing superstar!',
//   'Fantastic work! Those numbers are coming to life!',
//   'Keep going! Every line helps you get better.',
// ];

// interface NumberTraceCanvasProps {
//   data: TraceCard;
//   isCompleted: boolean;
//   onCompleteToggle: () => void;
//   onReplayPrompt: () => void;
// }

// const NumberTraceCanvas: React.FC<NumberTraceCanvasProps> = ({ data, isCompleted, onCompleteToggle, onReplayPrompt }) => {
//   const containerRef = useRef<HTMLDivElement | null>(null);
//   const canvasRef = useRef<HTMLCanvasElement | null>(null);
//   const drawingContextRef = useRef<CanvasRenderingContext2D | null>(null);
//   const isDrawingRef = useRef(false);

//   const setupCanvas = useCallback(() => {
//     const container = containerRef.current;
//     const canvas = canvasRef.current;
//     if (!container || !canvas) return;

//     const { width, height } = container.getBoundingClientRect();
//     const scale = window.devicePixelRatio || 1;

//     canvas.width = width * scale;
//     canvas.height = height * scale;
//     canvas.style.width = `${width}px`;
//     canvas.style.height = `${height}px`;

//     const context = canvas.getContext('2d');
//     if (!context) return;

//     context.setTransform(1, 0, 0, 1, 0, 0);
//     context.clearRect(0, 0, canvas.width, canvas.height);
//     context.scale(scale, scale);
//     context.lineCap = 'round';
//     context.lineJoin = 'round';
//     context.lineWidth = 6;
//     context.strokeStyle = '#2563eb';

//     drawingContextRef.current = context;
//   }, []);

//   useEffect(() => {
//     setupCanvas();
//     window.addEventListener('resize', setupCanvas);
//     return () => {
//       window.removeEventListener('resize', setupCanvas);
//     };
//   }, [setupCanvas]);

//   const getPoint = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
//     const canvas = canvasRef.current;
//     if (!canvas) return null;
//     const rect = canvas.getBoundingClientRect();
//     return {
//       x: event.clientX - rect.left,
//       y: event.clientY - rect.top,
//     };
//   }, []);

//   const handlePointerDown = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
//     const canvas = canvasRef.current;
//     const context = drawingContextRef.current;
//     if (!canvas || !context) return;

//     event.preventDefault();
//     canvas.setPointerCapture(event.pointerId);

//     const point = getPoint(event);
//     if (!point) return;

//     isDrawingRef.current = true;
//     context.beginPath();
//     context.moveTo(point.x, point.y);
//   }, [getPoint]);

//   const handlePointerMove = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
//     if (!isDrawingRef.current) return;

//     const context = drawingContextRef.current;
//     if (!context) return;

//     event.preventDefault();
//     const point = getPoint(event);
//     if (!point) return;

//     context.lineTo(point.x, point.y);
//     context.stroke();
//   }, [getPoint]);

//   const stopDrawing = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
//     if (!isDrawingRef.current) return;

//     const canvas = canvasRef.current;
//     const context = drawingContextRef.current;
//     if (!canvas || !context) return;

//     event.preventDefault();
//     if (canvas.hasPointerCapture(event.pointerId)) {
//       canvas.releasePointerCapture(event.pointerId);
//     }
//     context.closePath();
//     isDrawingRef.current = false;
//   }, []);

//   const handleClear = useCallback(() => {
//     const canvas = canvasRef.current;
//     const context = drawingContextRef.current;
//     if (!canvas || !context) return;

//     context.save();
//     context.setTransform(1, 0, 0, 1, 0, 0);
//     context.clearRect(0, 0, canvas.width, canvas.height);
//     context.restore();
//   }, []);

//   return (
//     <div className="space-y-6">
//       <div className="relative mx-auto w-full max-w-sm">
//         <div
//           ref={containerRef}
//           className="relative w-full aspect-[3/4] rounded-3xl border-4 border-dashed border-blue-200 bg-white shadow-inner overflow-hidden"
//         >
//           <svg className="absolute inset-0 h-full w-full text-gray-200" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid meet">
//             <defs>
//               <linearGradient id={`trace-gradient-${data.number}`} x1="0%" y1="0%" x2="100%" y2="100%">
//                 <stop offset="0%" stopColor="#fde68a" stopOpacity="0.9" />
//                 <stop offset="100%" stopColor="#fbbf24" stopOpacity="0.9" />
//               </linearGradient>
//             </defs>
//             <text
//               x="50%"
//               y="58%"
//               textAnchor="middle"
//               dominantBaseline="middle"
//               fontSize="220"
//               fill="none"
//               stroke={`url(#trace-gradient-${data.number})`}
//               strokeWidth="12"
//               strokeLinecap="round"
//               strokeLinejoin="round"
//               strokeDasharray="24 18"
//             >
//               {data.number}
//             </text>
//           </svg>
//           <canvas
//             ref={canvasRef}
//             className="absolute inset-0 h-full w-full touch-none"
//             onPointerDown={handlePointerDown}
//             onPointerMove={handlePointerMove}
//             onPointerUp={stopDrawing}
//             onPointerLeave={stopDrawing}
//           />
//         </div>
//       </div>
//       <div className="flex flex-wrap justify-center gap-3">
//         <button
//           onClick={handleClear}
//           className="px-4 py-2 rounded-full bg-gradient-to-r from-sky-400 to-blue-500 text-white font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
//         >
//           Clear Tracing
//         </button>
//         <button
//           onClick={onReplayPrompt}
//           className="px-4 py-2 rounded-full bg-gradient-to-r from-emerald-400 to-emerald-500 text-white font-semibold shadow-lg transition-transform duration-300 hover:scale-105 inline-flex items-center gap-2"
//         >
//           <span>🔊</span>
//           <span>Play Steps</span>
//         </button>
//         <button
//           onClick={onCompleteToggle}
//           className={`px-4 py-2 rounded-full font-semibold shadow-lg transition-transform duration-300 hover:scale-105 ${
//             isCompleted
//               ? 'bg-gradient-to-r from-purple-400 to-purple-500 text-white'
//               : 'bg-gradient-to-r from-amber-400 to-amber-500 text-white'
//           }`}
//         >
//           {isCompleted ? 'Great! Trace Again?' : 'I Traced It!'}
//         </button>
//       </div>
//     </div>
//   );
// };

// const NumberTracing: React.FC = () => {
//   const [activeNumber, setActiveNumber] = useState<number>(traceCards[0].number);
//   const [completedNumbers, setCompletedNumbers] = useState<Set<number>>(new Set());
//   const [isSpeaking, setIsSpeaking] = useState(false);

//   const traceCardMap = useMemo(() => {
//     const map = new Map<number, TraceCard>();
//     traceCards.forEach((card) => {
//       map.set(card.number, card);
//     });
//     return map;
//   }, []);

//   const activeCard = traceCardMap.get(activeNumber) ?? traceCards[0];

//   const speak = useCallback(
//     (text: string) => {
//       if (
//         typeof window !== 'undefined' &&
//         'speechSynthesis' in window &&
//         typeof SpeechSynthesisUtterance !== 'undefined' &&
//         !isSpeaking
//       ) {
//         setIsSpeaking(true);
//         const utterance = new SpeechSynthesisUtterance(text);
//         utterance.rate = 0.9;
//         utterance.pitch = 1.3;
//         utterance.volume = 0.9;
//         utterance.onend = () => setIsSpeaking(false);
//         utterance.onerror = () => setIsSpeaking(false);
//         window.speechSynthesis.speak(utterance);
//       }
//     },
//     [isSpeaking]
//   );

//   const handleNumberSelect = useCallback((number: number) => {
//     setActiveNumber(number);
//   }, []);

//   const handleWelcomePrompt = useCallback(() => {
//     speak('Let us practice tracing numbers together. Choose a number, listen to the steps, and follow the dotted lines with your finger or mouse.');
//   }, [speak]);

//   const toggleCompleted = useCallback((number: number) => {
//     const wasCompleted = completedNumbers.has(number);

//     setCompletedNumbers((prev) => {
//       const next = new Set(prev);
//       if (wasCompleted) {
//         next.delete(number);
//       } else {
//         next.add(number);
//       }
//       return next;
//     });

//     const card = traceCardMap.get(number);
//     if (wasCompleted) {
//       if (card) {
//         speak(`Great job wanting to practice ${card.word} again. Remember: ${card.watchOut[0]}`);
//       } else {
//         speak('Great! Let us trace it again slowly.');
//       }
//     } else {
//       const message = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
//       speak(message);
//     }
//   }, [completedNumbers, speak, traceCardMap]);

//   const handleReplaySteps = useCallback(() => {
//     const card = traceCardMap.get(activeNumber);
//     if (!card) return;
//     speak(`${card.word}. ${card.prompt}. ${card.steps.join(' ')} Remember: ${card.rightDirections.join(' ')}. If something looks wiggly, ${card.watchOut[0]}`);
//   }, [activeNumber, speak, traceCardMap]);

//   const progress = (completedNumbers.size / traceCards.length) * 100;

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-sky-50 via-blue-50 to-indigo-50 p-4 sm:p-8 relative overflow-hidden">
//       <div className="absolute inset-0 pointer-events-none overflow-hidden">
//         <div className="absolute top-10 left-10 w-64 h-64 bg-blue-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
//         <div className="absolute -bottom-12 right-4 w-80 h-80 bg-emerald-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
//       </div>

//       <div className="max-w-6xl mx-auto relative z-10">
//         <header className="text-center mb-10">
//           <div className="inline-block mb-4">
//             <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-600 bg-clip-text text-transparent drop-shadow-lg mb-4">
//               Trace the Numbers
//             </h1>
//             <div className="h-1 w-24 bg-gradient-to-r from-blue-400 via-indigo-500 to-sky-500 mx-auto rounded-full"></div>
//           </div>
//           <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-700 font-medium">
//             Practice drawing each number by following the friendly dotted path. Use your finger, mouse, or stylus to stay on the lines.
//           </p>

//           <div className="mt-6 max-w-lg mx-auto">
//             <div className="flex justify-between items-center text-sm font-semibold text-gray-700 mb-2">
//               <span>Tracing Progress</span>
//               <span className="text-blue-600">{completedNumbers.size} / {traceCards.length}</span>
//             </div>
//             <div className="w-full h-3 bg-white/80 rounded-full overflow-hidden shadow-inner border border-blue-100">
//               <div
//                 className="h-full bg-gradient-to-r from-blue-400 via-indigo-500 to-emerald-500 transition-all duration-500 ease-out rounded-full"
//                 style={{ width: `${progress}%` }}
//               ></div>
//             </div>
//           </div>

//           <button
//             onClick={handleWelcomePrompt}
//             className="mt-6 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-sky-500 text-white font-semibold shadow-xl transition-transform duration-300 hover:scale-105"
//           >
//             <span>🎧</span>
//             <span>Play Welcome Instructions</span>
//           </button>
//         </header>

//         <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
//           <section className="lg:col-span-1 space-y-6">
//             <div className="text-center">
//               <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose a Number</h2>
//               <div className="h-1 w-16 bg-gradient-to-r from-indigo-500 to-blue-500 mx-auto rounded-full"></div>
//             </div>
//             <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
//               {traceCards.map((card) => {
//                 const isActive = activeNumber === card.number;
//                 const isDone = completedNumbers.has(card.number);
//                 return (
//                   <button
//                     key={card.number}
//                     onClick={() => handleNumberSelect(card.number)}
//                     className={`relative rounded-2xl px-4 py-5 text-center transition-all duration-300 transform border-3 ${
//                       isActive
//                         ? `bg-gradient-to-br ${card.gradient} text-white shadow-2xl scale-105 ring-4 ring-blue-200`
//                         : 'bg-white text-gray-800 border-gray-200 hover:border-blue-200 hover:shadow-lg hover:-translate-y-1'
//                     }`}
//                   >
//                     <div className={`text-3xl font-extrabold mb-1 ${isActive ? 'text-white' : card.color}`}>
//                       {card.number}
//                     </div>
//                     <div className={`text-xs font-semibold uppercase tracking-wide ${isActive ? 'text-white/90' : 'text-gray-500'}`}>
//                       {card.word}
//                     </div>
//                     {isDone && (
//                       <div className="absolute -top-2 -right-2 w-7 h-7 rounded-full bg-emerald-500 text-white text-xs font-bold flex items-center justify-center shadow-lg">
//                         ✓
//                       </div>
//                     )}
//                   </button>
//                 );
//               })}
//             </div>
//           </section>

//           <section className="lg:col-span-2">
//             <div className="bg-white/80 backdrop-blur-md border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-2xl">
//               <div className="flex flex-col gap-6">
//                 <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//                   <div>
//                     <div className="text-sm font-semibold text-blue-500 uppercase tracking-wide">Let’s trace</div>
//                     <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 flex items-center gap-3">
//                       <span className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br ${activeCard.gradient} text-white text-3xl shadow-lg`}>
//                         {activeCard.number}
//                       </span>
//                       <span>{activeCard.word}</span>
//                     </h2>
//                     <p className="text-gray-600 mt-2 text-base sm:text-lg">
//                       {activeCard.prompt}
//                     </p>
//                   </div>
//                   <div className="flex flex-col items-center sm:items-end gap-2 text-sm text-gray-600">
//                     <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-100 text-blue-600 font-semibold">
//                       ✍️ Fine Motor Skill Practice
//                     </span>
//                     <span className="inline-flex items=center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 font-semibold">
//                       🌟 Ages 3 - 4
//                     </span>
//                   </div>
//                 </div>

//                 <NumberTraceCanvas
//                   key={activeCard.number}
//                   data={activeCard}
//                   isCompleted={completedNumbers.has(activeCard.number)}
//                   onCompleteToggle={() => toggleCompleted(activeCard.number)}
//                   onReplayPrompt={handleReplaySteps}
//                 />

//                 <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//                   <div className="bg-blue-50 rounded-2xl p-5 border border-blue-100">
//                     <h3 className="text-lg font-bold text-blue-700 mb-3">Tracing Steps</h3>
//                     <ul className="space-y-2 text-sm text-blue-700 font-medium">
//                       {activeCard.steps.map((step, index) => (
//                         <li key={index} className="flex gap-3 items-start">
//                           <span className="w-6 h-6 flex-shrink-0 rounded-full bg-blue-500 text-white flex items-center justify-center text-sm font-bold">
//                             {index + 1}
//                           </span>
//                           <span>{step}</span>
//                         </li>
//                       ))}
//                     </ul>
//                   </div>
//                   <div className="bg-emerald-50 rounded-2xl p-5 border border-emerald-100 flex flex-col gap-4">
//                     <h3 className="text-lg font-bold text-emerald-700">Helper Tips</h3>
//                     <p className="text-sm text-emerald-700 font-medium">{activeCard.funTip}</p>
//                     <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//                       <div className="space-y-2">
//                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-200 text-emerald-700 text-xs font-semibold uppercase tracking-wide">
//                           ✅ Right Way
//                         </div>
//                         <ul className="text-sm text-emerald-700 space-y-2">
//                           {activeCard.rightDirections.map((tip, index) => (
//                             <li key={index}>• {tip}</li>
//                           ))}
//                         </ul>
//                       </div>
//                       <div className="space-y-2">
//                         <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-200 text-red-700 text-xs font-semibold uppercase tracking-wide">
//                           ❌ Try Again If
//                         </div>
//                         <ul className="text-sm text-red-700 space-y-2">
//                           {activeCard.watchOut.map((tip, index) => (
//                             <li key={index}>• {tip}</li>
//                           ))}
//                         </ul>
//                       </div>
//                     </div>
//                     <div className="text-xs text-emerald-500 uppercase tracking-wide">Try this:</div>
//                     <ul className="text-sm text-emerald-700 space-y-2">
//                       <li>• Use a finger, crayon, or stylus for tracing.</li>
//                       <li>• Take a deep breath and move slowly along the path.</li>
//                       <li>• Say the steps out loud to remember them.</li>
//                     </ul>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </section>
//         </div>

//         <section className="mt-12">
//           <div className="bg-white/80 backdrop-blur-md border border-blue-100 rounded-3xl p-6 sm:p-8 shadow-xl max-w-3xl mx-auto text-center space-y-4">
//             <h3 className="text-2xl font-bold text-gray-800">Tracing Tips for Grown-ups</h3>
//             <p className="text-base text-gray-600">
//               Encourage little learners to hold their finger or stylus gently and trace along the dotted lines. Celebrate each attempt—consistency builds confidence and early writing skills!
//             </p>
//             <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold text-gray-700">
//               <span className="px-4 py-2 rounded-full bg-blue-100 text-blue-600">Model each number once</span>
//               <span className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-600">Use calm rhythmic words</span>
//               <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-600">Take tracing breaks often</span>
//             </div>
//           </div>
//         </section>
//       </div>

//       <style>{`
//         @keyframes blob {
//           0%, 100% { transform: translate(0, 0) scale(1); }
//           33% { transform: translate(30px, -40px) scale(1.05); }
//           66% { transform: translate(-20px, 25px) scale(0.95); }
//         }
//         .animate-blob {
//           animation: blob 8s infinite;
//         }
//         .animation-delay-2000 {
//           animation-delay: 2s;
//         }
//       `}</style>
//     </div>
//   );
// };

// export default NumberTracing;
import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Trophy, RefreshCcw, CheckCircle2, 
  Hand, Sparkles, Play, MousePointer2, 
  Timer, ChevronRight, Shuffle, AlertCircle, FastForward
} from 'lucide-react';

// --- Precise Path Data for Numbers (Relative 0-100) ---
// These coordinates are used for both the SVG track and the validation logic
const NUMBER_PATHS = {
  1: "M 50 20 L 50 80",
  2: "M 30 35 C 30 15, 70 15, 70 35 C 70 50, 30 65, 30 80 L 70 80",
  3: "M 35 25 C 65 20, 65 45, 50 45 C 65 45, 65 80, 35 75",
  4: "M 45 20 L 45 55 L 75 55 M 75 20 L 75 85",
  5: "M 65 20 L 35 20 L 35 45 C 65 45, 65 85, 35 80",
  6: "M 55 20 C 30 40, 30 85, 50 85 C 70 85, 70 55, 45 55 C 35 55, 30 70, 30 75",
  7: "M 30 20 L 70 20 L 45 85",
  8: "M 50 50 C 20 30, 80 30, 50 50 C 20 70, 80 70, 50 50",
  9: "M 65 85 L 65 40 C 65 15, 30 15, 30 40 C 30 55, 65 55, 65 40"
};

// Points for validation (extracted/sampled from paths)
const VALIDATION_POINTS = {
  1: [{x: 50, y: 20}, {x: 50, y: 40}, {x: 50, y: 60}, {x: 50, y: 80}],
  2: [{x: 30, y: 35}, {x: 50, y: 20}, {x: 70, y: 35}, {x: 50, y: 55}, {x: 30, y: 80}, {x: 70, y: 80}],
  3: [{x: 35, y: 25}, {x: 55, y: 22}, {x: 50, y: 45}, {x: 65, y: 65}, {x: 35, y: 75}],
  4: [{x: 45, y: 20}, {x: 45, y: 55}, {x: 75, y: 55}, {x: 75, y: 20}, {x: 75, y: 85}],
  5: [{x: 65, y: 20}, {x: 35, y: 20}, {x: 35, y: 45}, {x: 60, y: 55}, {x: 35, y: 80}],
  6: [{x: 55, y: 20}, {x: 35, y: 50}, {x: 45, y: 85}, {x: 65, y: 70}, {x: 45, y: 55}],
  7: [{x: 30, y: 20}, {x: 70, y: 20}, {x: 45, y: 85}],
  8: [{x: 50, y: 50}, {x: 30, y: 30}, {x: 50, y: 20}, {x: 70, y: 30}, {x: 50, y: 50}, {x: 30, y: 70}, {x: 50, y: 80}, {x: 70, y: 70}],
  9: [{x: 65, y: 85}, {x: 65, y: 40}, {x: 50, y: 20}, {x: 30, y: 40}, {x: 50, y: 55}, {x: 65, y: 40}]
};

const COLORS = [
  '#e63946', '#f4a261', '#e9c46a', '#2a9d8f', '#264653',
  '#6d597a', '#b56576', '#fb8b24', '#3f37c9'
];

const THEMES = [
  { emoji: '🍎', name: 'Apple', plural: 'Apples' },
  { emoji: '🐘', name: 'Elephant', plural: 'Elephants' },
  { emoji: '🦁', name: 'Lion', plural: 'Lions' },
  { emoji: '🤖', name: 'Robot', plural: 'Robots' },
  { emoji: '🍬', name: 'Candy', plural: 'Candies' },
  { emoji: '🐱', name: 'Cat', plural: 'Cats' },
  { emoji: '⭐', name: 'Star', plural: 'Stars' },
  { emoji: '⛄', name: 'Snowman', plural: 'Snowmen' },
  { emoji: '🎈', name: 'Balloon', plural: 'Balloons' }
];

const NUMBERS = Array.from({ length: 9 }, (_, i) => ({
  value: i + 1,
  color: COLORS[i],
  theme: THEMES[i],
  svgPath: NUMBER_PATHS[i + 1],
  checkpoints: VALIDATION_POINTS[i + 1]
}));

export default function App() {
  const [mode, setMode] = useState('practice'); 
  const [currentTarget, setCurrentTarget] = useState(NUMBERS[0]);
  const [score, setScore] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);
  const [autoNextTimer, setAutoNextTimer] = useState(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [isAutoTracing, setIsAutoTracing] = useState(false);
  const [hitCheckpoints, setHitCheckpoints] = useState(new Set());
  const [showError, setShowError] = useState(false);
  const [handPos, setHandPos] = useState({ x: 50, y: 50 });

  const canvasRef = useRef(null);
  const contextRef = useRef(null);
  const timerIntervalRef = useRef(null);
  const traceRequestRef = useRef(null);

  // Initialize Canvas
  useEffect(() => {
    const initCanvas = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.parentElement.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
      const ctx = canvas.getContext('2d');
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';
      ctx.lineWidth = window.innerWidth < 640 ? 30 : 45; // Thick paintbrush
      ctx.strokeStyle = currentTarget.color;
      contextRef.current = ctx;
    };

    initCanvas();
    window.addEventListener('resize', initCanvas);
    return () => window.removeEventListener('resize', initCanvas);
  }, [currentTarget]);

  // Kid Mode Auto-trigger logic
  useEffect(() => {
    if (mode === 'kid' && !isCompleted && !isAutoTracing) {
      const timer = setTimeout(() => runKidModeTrace(), 2000);
      return () => clearTimeout(timer);
    }
  }, [currentTarget, mode, isCompleted, isAutoTracing]);

  // Auto-next Timer logic
  useEffect(() => {
    if (autoNextTimer !== null && autoNextTimer > 0) {
      timerIntervalRef.current = setInterval(() => {
        setAutoNextTimer(prev => (prev > 0 ? prev - 1 : 0));
      }, 1000);
    } else if (autoNextTimer === 0) {
      handleNextSequential();
    }
    return () => clearInterval(timerIntervalRef.current);
  }, [autoNextTimer]);

  const speak = (text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.2;
      window.speechSynthesis.speak(utterance);
    }
  };

  const runKidModeTrace = () => {
    if (isAutoTracing) return;
    setIsAutoTracing(true);
    setIsCompleted(false);
    
    const canvas = canvasRef.current;
    const ctx = contextRef.current;
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const checkpoints = currentTarget.checkpoints;
    let pointIdx = 0;
    let progress = 0;

    const animate = () => {
      if (pointIdx < checkpoints.length - 1) {
        const start = checkpoints[pointIdx];
        const end = checkpoints[pointIdx + 1];
        
        const x = start.x + (end.x - start.x) * progress;
        const y = start.y + (end.y - start.y) * progress;
        
        const canvasX = (x / 100) * canvas.width;
        const canvasY = (y / 100) * canvas.height;

        setHandPos({ x, y });

        if (progress === 0) {
          ctx.beginPath();
          ctx.moveTo(canvasX, canvasY);
        } else {
          ctx.lineTo(canvasX, canvasY);
          ctx.stroke();
        }

        progress += 0.04; 
        if (progress >= 1) {
          progress = 0;
          pointIdx++;
        }
        traceRequestRef.current = requestAnimationFrame(animate);
      } else {
        setIsAutoTracing(false);
        handleSuccess();
      }
    };

    speak(`Watch me paint number ${currentTarget.value}!`);
    animate();
  };

  const handleSuccess = () => {
    if (isCompleted) return;
    setIsCompleted(true);
    setShowError(false);
    setScore(s => s + 1);
    speak(`Excellent! That's the number ${currentTarget.value}!`);
    setAutoNextTimer(10);
  };

  const changeTarget = (target) => {
    if (traceRequestRef.current) cancelAnimationFrame(traceRequestRef.current);
    setCurrentTarget(target);
    setIsCompleted(false);
    setIsAutoTracing(false);
    setAutoNextTimer(null);
    setHitCheckpoints(new Set());
    setShowError(false);
    if (contextRef.current) {
      contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
    }
  };

  const handleNextSequential = () => {
    const idx = NUMBERS.findIndex(n => n.value === currentTarget.value);
    const next = NUMBERS[(idx + 1) % NUMBERS.length];
    changeTarget(next);
  };

  const handleNextRandom = () => {
    const available = NUMBERS.filter(n => n.value !== currentTarget.value);
    const next = available[Math.floor(Math.random() * available.length)];
    changeTarget(next);
  };

  const getCoordinates = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const clientX = e.touches ? e.touches[0].clientX : e.clientX;
    const clientY = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: clientX - rect.left,
      y: clientY - rect.top
    };
  };

  const startDrawing = (e) => {
    if (isCompleted || isAutoTracing) return;
    const coords = getCoordinates(e.nativeEvent);
    contextRef.current.beginPath();
    contextRef.current.moveTo(coords.x, coords.y);
    setIsDrawing(true);
    validateTrace(coords.x, coords.y);
  };

  const draw = (e) => {
    if (!isDrawing || isCompleted) return;
    const coords = getCoordinates(e.nativeEvent);
    contextRef.current.lineTo(coords.x, coords.y);
    contextRef.current.stroke();
    validateTrace(coords.x, coords.y);
  };

  const validateTrace = (x, y) => {
    const canvas = canvasRef.current;
    const relX = (x / canvas.width) * 100;
    const relY = (y / canvas.height) * 100;

    currentTarget.checkpoints.forEach((point, idx) => {
      const dist = Math.sqrt(Math.pow(relX - point.x, 2) + Math.pow(relY - point.y, 2));
      if (dist < 22) { // Very lenient 22% radius for kids
        setHitCheckpoints(prev => new Set(prev).add(idx));
      }
    });
  };

  const stopDrawing = () => {
    if (!isDrawing) return;
    setIsDrawing(false);
    
    // Lenient Success: Hit at least 70% of points
    const requiredPoints = Math.ceil(currentTarget.checkpoints.length * 0.7);
    if (hitCheckpoints.size >= requiredPoints) {
      handleSuccess();
    } else {
      setShowError(true);
      speak("Great try! Paint more of the shape!");
      setTimeout(() => {
        setShowError(false);
        if (contextRef.current && !isCompleted) {
          contextRef.current.clearRect(0, 0, canvasRef.current.width, canvasRef.current.height);
          setHitCheckpoints(new Set());
        }
      }, 1500);
    }
  };

  return (
    <div className="min-h-screen bg-[#fcfaf7] p-3 sm:p-6 md:p-8 font-sans select-none overflow-x-hidden flex flex-col items-center text-slate-800">
      
      {/* Header */}
      <div className="w-full max-w-6xl flex flex-col lg:flex-row justify-between items-center gap-4 mb-4 sm:mb-8 px-2">
        <div className="flex flex-col items-center lg:items-start text-center">
          <h1 className="text-2xl sm:text-4xl font-black flex items-center gap-3 text-slate-900 uppercase">
            <div className="w-10 h-10 sm:w-12 sm:h-12 bg-[#2563eb] rounded-xl shadow-lg flex items-center justify-center text-white border-b-4 border-black/10">✏️</div>
            <span>Tracing Lab</span>
          </h1>
          <p className="text-[10px] sm:text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Number Handwriting</p>
        </div>

        <div className="bg-[#e2d6c3] p-1 rounded-2xl shadow-inner flex items-center gap-1 sm:gap-2 border border-stone-300">
          <button 
            onClick={() => { setMode('kid'); changeTarget(currentTarget); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-black transition-all ${mode === 'kid' ? 'bg-white text-blue-600 shadow-sm' : 'text-stone-500'}`}
          >
            <Play size={14} fill={mode === 'kid' ? 'currentColor' : 'none'} />
            KID MODE
          </button>
          <button 
            onClick={() => { setMode('practice'); changeTarget(currentTarget); }}
            className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-[10px] sm:text-xs font-black transition-all ${mode === 'practice' ? 'bg-white text-emerald-600 shadow-sm' : 'text-stone-500'}`}
          >
            <MousePointer2 size={14} fill={mode === 'practice' ? 'currentColor' : 'none'} />
            PRACTICE
          </button>
        </div>
      
        <div className="flex items-center gap-3">
          <div className="bg-white px-4 py-1.5 rounded-xl shadow-sm border border-gray-100 flex flex-col items-center min-w-[70px]">
            <span className="text-[8px] uppercase font-black opacity-40">Correct</span>
            <span className="text-xl font-black text-blue-600">{score}</span>
          </div>
          <button onClick={() => changeTarget(currentTarget)} className="p-3 bg-[#8d6e63] text-white rounded-xl shadow-md border-b-4 border-[#5d4037]">
            <RefreshCcw size={18} />
          </button>
        </div>
      </div>

      {/* Main Board */}
      <div className="w-full max-w-7xl bg-[#dfc4a1] rounded-[2rem] sm:rounded-[4rem] p-3 sm:p-10 shadow-2xl border-b-[12px] sm:border-b-[16px] border-[#c4a484] relative mb-4 sm:mb-8 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-14 items-stretch">
          
          {/* Visual Construct Side */}
          <div className="bg-white/70 backdrop-blur-sm rounded-[2.5rem] p-8 lg:p-12 flex flex-col items-center justify-center border-2 border-dashed border-stone-400/50 shadow-inner relative min-h-[300px] lg:min-h-[580px]">
            <div className="absolute top-4 sm:top-8 bg-[#2563eb] px-5 py-1.5 rounded-full text-white font-black text-[9px] sm:text-xs tracking-widest uppercase shadow-lg">
              Visual Help
            </div>
            <div className="grid grid-cols-3 gap-4 sm:gap-10 mt-12">
              {Array.from({ length: currentTarget.value }).map((_, i) => (
                <motion.div 
                  key={`${currentTarget.value}-emoji-${i}`} 
                  initial={{ scale: 0 }} 
                  animate={{ scale: 1 }} 
                  transition={{ delay: i * 0.05 }}
                  className="text-5xl sm:text-8xl md:text-9xl drop-shadow-xl"
                >
                  {currentTarget.theme.emoji}
                </motion.div>
              ))}
            </div>
            <div className="mt-12 lg:mt-16 text-center">
              <span className="text-7xl sm:text-[12rem] font-black leading-none drop-shadow-lg" style={{ color: currentTarget.color }}>{currentTarget.value}</span>
              <p className="text-xs sm:text-2xl font-black text-stone-600 uppercase tracking-[0.25em] mt-3">
                {currentTarget.value === 1 ? currentTarget.theme.name : currentTarget.theme.plural}
              </p>
            </div>
          </div>

          {/* Tracing Canvas Side */}
          <div className="relative bg-white rounded-[2rem] sm:rounded-[3rem] shadow-2xl border-4 sm:border-8 border-white overflow-hidden min-h-[400px] sm:min-h-[500px] lg:min-h-[600px]">
            
            {/* SOLID TRACK GUIDE - High visibility solid shape */}
            <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" viewBox="0 0 100 100" preserveAspectRatio="none">
               <path 
                d={currentTarget.svgPath}
                fill="none" 
                stroke={currentTarget.color} 
                strokeWidth="15" 
                strokeOpacity="0.1" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
               />
               <path 
                d={currentTarget.svgPath}
                fill="none" 
                stroke="#000" 
                strokeWidth="1" 
                strokeOpacity="0.1" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
               />
            </svg>

            <canvas
              ref={canvasRef}
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={stopDrawing}
              onMouseOut={stopDrawing}
              onTouchStart={startDrawing}
              onTouchMove={draw}
              onTouchEnd={stopDrawing}
              className="absolute inset-0 w-full h-full cursor-crosshair touch-none z-10"
            />

            {/* UI Overlays */}
            <AnimatePresence mode="wait">
              {!isCompleted && !isAutoTracing && (
                <motion.div 
                  key="instruction"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} 
                  className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 z-20 pointer-events-none"
                >
                  <Hand size={40} className="animate-bounce text-blue-500 drop-shadow-md sm:w-16 sm:h-16" />
                  <span className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Paint the Number</span>
                </motion.div>
              )}

              {showError && (
                <motion.div 
                  key="error"
                  initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 bg-rose-500/20 z-30 flex items-center justify-center backdrop-blur-[2px]"
                >
                   <div className="bg-white p-8 sm:p-12 rounded-[2rem] sm:rounded-[3rem] shadow-2xl flex flex-col items-center gap-3 border-b-8 border-rose-200 mx-4 text-center">
                      <AlertCircle size={64} className="text-rose-500" />
                      <span className="font-black text-rose-500 uppercase tracking-widest text-xs sm:text-base">Paint right on the track!</span>
                   </div>
                </motion.div>
              )}

              {isCompleted && (
                <motion.div 
                  key="success"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} 
                  className="absolute inset-0 z-30 bg-emerald-500/10 flex items-center justify-center pointer-events-none"
                >
                  <Sparkles size={140} className="text-emerald-500 animate-pulse" />
                </motion.div>
              )}
            </AnimatePresence>

            {/* Kid Mode Virtual Hand */}
            <AnimatePresence>
              {isAutoTracing && (
                <motion.div 
                  key="hand"
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute z-40 pointer-events-none"
                  style={{ 
                    left: `${handPos.x}%`, 
                    top: `${handPos.y}%`,
                    transform: 'translate(-20%, -20%)'
                  }}
                >
                  <Hand size={64} fill="white" className="text-blue-600 drop-shadow-2xl sm:w-20 sm:h-20" />
                  <div className="absolute inset-0 bg-blue-400/20 rounded-full blur-2xl animate-ping" />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>

      {/* Navigation - Synchronized Pill Timer */}
      <div className="w-full max-w-7xl flex flex-col gap-4 sm:gap-6 mt-2 sm:mt-4 px-2">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-8 items-center">
          
          <div className="flex flex-col gap-2">
            <button 
              onClick={handleNextSequential}
              className={`group relative flex items-center justify-between w-full p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-base sm:text-2xl transition-all active:scale-95 shadow-xl border-b-6 sm:border-b-8 ${
                autoNextTimer !== null ? 'bg-emerald-600 text-white border-emerald-800' : 'bg-emerald-600 hover:bg-emerald-700 text-white border-emerald-800'
              }`}
            >
              <div className="flex items-center gap-3 sm:gap-4 z-10">
                <div className="bg-white/20 p-2 sm:p-3 rounded-xl sm:rounded-2xl text-white">
                   <ChevronRight size={24} />
                </div>
                <div className="text-left text-white">
                  <div className="leading-tight text-sm sm:text-xl font-black">
                    {autoNextTimer !== null ? 'NEXT NOW' : 'NEXT LESSON'}
                  </div>
                  {autoNextTimer !== null && (
                    <div className="text-[8px] sm:text-[10px] opacity-70 tracking-widest uppercase mt-0.5 font-bold">Automatic Move</div>
                  )}
                </div>
              </div>

              <div className="flex items-center relative z-10 text-white">
                {autoNextTimer !== null ? (
                  <div className="flex items-center gap-2 sm:gap-3 bg-black/20 px-4 py-2 sm:px-6 sm:py-2.5 rounded-2xl sm:rounded-3xl border border-white/10 shadow-inner">
                    <Timer size={18} className="animate-spin text-emerald-200" />
                    <span className="text-2xl sm:text-5xl font-mono leading-none">{autoNextTimer}</span>
                  </div>
                ) : (
                  <FastForward size={24} className="opacity-40 group-hover:opacity-100 transition-opacity" />
                )}
              </div>

              {autoNextTimer !== null && (
                <motion.div 
                  initial={{ width: '100%' }} animate={{ width: '0%' }} transition={{ duration: 10, ease: 'linear' }}
                  className="absolute inset-0 bg-emerald-800/30 rounded-[1.5rem] sm:rounded-[2.5rem] pointer-events-none" 
                />
              )}
            </button>
          </div>

          <div className="flex flex-col gap-2">
            <button onClick={handleNextRandom} className="flex items-center justify-center gap-4 w-full bg-[#8d6e63] hover:bg-[#5d4037] text-white p-4 sm:p-8 rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-base sm:text-2xl transition-all active:scale-95 shadow-xl border-b-6 sm:border-b-8 border-[#5d4037]">
              <Shuffle size={24} className="sm:w-8 sm:h-8" />
              <span className="text-sm sm:text-2xl font-black">RANDOM JUMP</span>
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {score >= 9 && (
          <div key="win" className="fixed inset-0 z-[600] flex items-center justify-center bg-black/80 backdrop-blur-md p-6 text-slate-900">
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} className="bg-white rounded-[3rem] sm:rounded-[4rem] p-12 max-w-md w-full text-center shadow-2xl border-t-[16px] border-[#2563eb]">
              <Trophy size={80} className="text-blue-600 mx-auto mb-8 sm:w-32 sm:h-32" />
              <h2 className="text-3xl sm:text-5xl font-black text-slate-800 mb-4 tracking-tighter uppercase">Writing Star!</h2>
              <p className="text-slate-500 mb-10 font-bold uppercase text-xs sm:text-base leading-relaxed">You mastered numbers 1 to 9!</p>
              <button 
                onClick={() => { setScore(0); handleNextSequential(); }} 
                className="w-full py-5 sm:py-6 bg-blue-600 text-white rounded-[1.5rem] sm:rounded-[2.5rem] font-black text-lg sm:text-2xl border-b-8 border-blue-800 active:scale-95 transition-all"
              >
                RESTART JOURNEY
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}