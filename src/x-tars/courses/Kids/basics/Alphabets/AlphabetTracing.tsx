import React, { useCallback, useMemo, useRef, useState, useEffect } from "react";

interface LetterTraceCard {
  letter: string;
  name: string;
  sound: string;
  color: string;
  gradient: string;
  prompt: string;
  steps: string[];
  funTip: string;
  rightDirections: string[];
  watchOut: string[];
}

const letterTraceCards: LetterTraceCard[] = [
  {
    letter: "A",
    name: "Apple",
    sound: "/ă/",
    color: "text-rose-600",
    gradient: "from-rose-200 to-pink-300",
    prompt: "Climb up the mountain, slide down, then build a bridge.",
    steps: [
      "Start at the top dot and slide down to the left bottom dot.",
      "Go back to the top dot and slide down to the right bottom dot.",
      "Draw a short line across the middle to make the bridge."
    ],
    funTip: "Say “up, down, across” while you draw.",
    rightDirections: [
      "Make both mountain sides the same length.",
      "Keep the bridge straight across the middle dots."
    ],
    watchOut: [
      "If the sides miss the top, clear it and touch the peak.",
      "If the bridge leans, draw it slowly from left to right."
    ]
  },
  {
    letter: "B",
    name: "Balloon",
    sound: "/b/",
    color: "text-blue-600",
    gradient: "from-blue-200 to-sky-300",
    prompt: "Draw a tall line and add two big bellies.",
    steps: [
      "Make a tall line straight down.",
      "From the top, draw a bump to the middle.",
      "From the middle, draw another bump to the bottom."
    ],
    funTip: "Pretend the bumps are balloons tied to a stick.",
    rightDirections: [
      "Keep the tall line super straight.",
      "Let each bump touch the line all the way."
    ],
    watchOut: [
      "If the bumps float away, trace closer to the line.",
      "If the line leans, redraw it slowly."
    ]
  },
  {
    letter: "C",
    name: "Cloud",
    sound: "/k/",
    color: "text-emerald-600",
    gradient: "from-emerald-200 to-teal-300",
    prompt: "Make a gentle open curve.",
    steps: [
      "Start above the middle and curve left.",
      "Keep curving around toward the bottom.",
      "Stop before you close the shape."
    ],
    funTip: "Imagine hugging the air but leaving room to breathe.",
    rightDirections: [
      "Keep the curve wide and smooth.",
      "Point both ends forward."
    ],
    watchOut: [
      "If the curve gets pointy, slow down and round it.",
      "If you close the shape, erase and leave it open."
    ]
  },
  {
    letter: "D",
    name: "Drum",
    sound: "/d/",
    color: "text-amber-600",
    gradient: "from-amber-200 to-yellow-300",
    prompt: "Draw a tall line and one giant belly.",
    steps: [
      "Draw the tall line down.",
      "Start at the top and make a big curve to the bottom.",
      "Connect it smoothly back to the tall line."
    ],
    funTip: "Tap the line like a drumstick before tracing the curve.",
    rightDirections: [
      "Let the curve touch the top and bottom dots.",
      "Keep the belly nice and round."
    ],
    watchOut: [
      "If the curve floats away, whisper “hug the line.”",
      "If the line tilts, clear it and draw again slowly."
    ]
  },
  {
    letter: "E",
    name: "Elephant",
    sound: "/ĕ/",
    color: "text-purple-600",
    gradient: "from-purple-200 to-violet-300",
    prompt: "Draw a tall line with three arms.",
    steps: [
      "Make the tall line straight down.",
      "Add a long arm at the top.",
      "Add two shorter arms in the middle and bottom."
    ],
    funTip: "Say “top, middle, bottom” as you add arms.",
    rightDirections: [
      "Keep every arm level.",
      "Make the middle arm shorter."
    ],
    watchOut: [
      "If an arm droops, redraw it slowly.",
      "If the line wiggles, press clear and go slower."
    ]
  },
  {
    letter: "F",
    name: "Feather",
    sound: "/f/",
    color: "text-sky-600",
    gradient: "from-sky-200 to-blue-300",
    prompt: "Draw a tall pole and two flags.",
    steps: [
      "Draw the tall line.",
      "Add a long arm at the top.",
      "Add a short arm in the middle."
    ],
    funTip: "Pretend the arms are flags flapping.",
    rightDirections: [
      "Point the arms straight out.",
      "Keep the middle flag shorter."
    ],
    watchOut: [
      "If an arm points up or down, redraw it slowly.",
      "If the pole leans, go straight down again."
    ]
  },
  {
    letter: "G",
    name: "Gift",
    sound: "/g/",
    color: "text-teal-600",
    gradient: "from-teal-200 to-green-300",
    prompt: "Make a big circle and add a tiny door.",
    steps: [
      "Start near the top and make a wide circle.",
      "Stop close to the starting point.",
      "Draw a short line in toward the middle."
    ],
    funTip: "Imagine adding a ribbon door to a present.",
    rightDirections: [
      "Keep the circle smooth and even.",
      "Point the door toward the center."
    ],
    watchOut: [
      "If the circle looks like an egg, redraw slowly.",
      "If the door is long, make it shorter."
    ]
  },
  {
    letter: "H",
    name: "House",
    sound: "/h/",
    color: "text-indigo-600",
    gradient: "from-indigo-200 to-blue-300",
    prompt: "Build two rails and a bridge.",
    steps: [
      "Draw the first tall line.",
      "Draw the second tall line a little away.",
      "Connect them with a middle bridge."
    ],
    funTip: "Pretend you’re building a ladder.",
    rightDirections: [
      "Keep both rails straight.",
      "Place the bridge on the dotted middle line."
    ],
    watchOut: [
      "If the lines lean, redraw them slowly.",
      "If the bridge is crooked, draw from left to right."
    ]
  },
  {
    letter: "I",
    name: "Igloo",
    sound: "/ĭ/",
    color: "text-pink-600",
    gradient: "from-pink-200 to-rose-300",
    prompt: "Draw a hat, a body, and boots.",
    steps: [
      "Add a short line at the top.",
      "Draw a straight line down the middle.",
      "Add another short line at the bottom."
    ],
    funTip: "Say “hat, body, boots.”",
    rightDirections: [
      "Keep the middle line perfectly straight.",
      "Make the hat and boots the same length."
    ],
    watchOut: [
      "If the line wiggles, slow down.",
      "If the hat tilts, erase and draw it level."
    ]
  },
  {
    letter: "J",
    name: "Jelly",
    sound: "/j/",
    color: "text-amber-700",
    gradient: "from-amber-200 to-orange-300",
    prompt: "Add a hat, draw a line, hook it left.",
    steps: [
      "Draw a short line at the top.",
      "Pull a straight line down.",
      "Curve the bottom left like a hook."
    ],
    funTip: "Pretend the hook is scooping jelly.",
    rightDirections: [
      "Keep the line straight until the hook starts.",
      "Make a gentle hook that faces left."
    ],
    watchOut: [
      "If the hook points right, try again slowly.",
      "If the line wiggles, redraw straight down."
    ]
  },
  {
    letter: "K",
    name: "Kite",
    sound: "/k/",
    color: "text-green-600",
    gradient: "from-lime-200 to-green-300",
    prompt: "Draw a pole and two kicking legs.",
    steps: [
      "Draw a tall line down.",
      "From the middle, draw a slant going up to the right.",
      "From the middle, draw a slant down to the right."
    ],
    funTip: "Pretend the letter is kicking high and low.",
    rightDirections: [
      "Start both legs at the same middle spot.",
      "Keep the tall line steady."
    ],
    watchOut: [
      "If the legs start at different spots, erase and retry.",
      "If the line bends, trace it slower."
    ]
  },
  {
    letter: "L",
    name: "Leaf",
    sound: "/l/",
    color: "text-fuchsia-600",
    gradient: "from-fuchsia-200 to-rose-300",
    prompt: "Draw a tall line and give it a foot.",
    steps: [
      "Draw the tall line down.",
      "Add a short line across the bottom to the right."
    ],
    funTip: "Say “down, foot.”",
    rightDirections: [
      "Keep the tall line straight.",
      "Make the foot perfectly horizontal."
    ],
    watchOut: [
      "If the foot points up, draw it slower.",
      "If the line is short, stretch it to the bottom dot."
    ]
  },
  {
    letter: "M",
    name: "Mountain",
    sound: "/m/",
    color: "text-cyan-600",
    gradient: "from-cyan-200 to-sky-300",
    prompt: "Make two tall mountains that touch.",
    steps: [
      "Draw a tall line down.",
      "Go back up and slant down to the middle.",
      "Slant up again and down to finish."
    ],
    funTip: "Say “up, down, up, down.”",
    rightDirections: [
      "Keep both peaks the same height.",
      "Let every line touch the bottom baseline."
    ],
    watchOut: [
      "If a peak floats, redraw touching the baseline.",
      "If the lines cross, slow down."
    ]
  },
  {
    letter: "N",
    name: "Nest",
    sound: "/n/",
    color: "text-red-600",
    gradient: "from-red-200 to-rose-300",
    prompt: "Make a tall line, draw a slide, add another tall line.",
    steps: [
      "Draw the first tall line.",
      "Draw a diagonal from the top down to the right bottom dot.",
      "Draw the second tall line up."
    ],
    funTip: "Pretend the slide helps a bird reach its nest.",
    rightDirections: [
      "Keep both tall lines straight.",
      "Make the diagonal touch both lines."
    ],
    watchOut: [
      "If the slide floats, erase and draw it carefully.",
      "If the lines lean, slow down."
    ]
  },
  {
    letter: "O",
    name: "Orange",
    sound: "/ŏ/",
    color: "text-orange-600",
    gradient: "from-orange-200 to-amber-300",
    prompt: "Draw a smooth circle.",
    steps: [
      "Start at the top and curve left.",
      "Keep curving all the way around.",
      "Meet the top without leaving a space."
    ],
    funTip: "Pretend you are drawing a juicy orange.",
    rightDirections: [
      "Keep the line smooth and even.",
      "Touch the dotted path the whole way."
    ],
    watchOut: [
      "If there’s a gap, retrace to close it.",
      "If the circle is bumpy, slow down and smooth it."
    ]
  },
  {
    letter: "P",
    name: "Paintbrush",
    sound: "/p/",
    color: "text-rose-700",
    gradient: "from-rose-200 to-pink-300",
    prompt: "Draw a tall line and add one big bump.",
    steps: [
      "Draw the tall line.",
      "From the top, draw a half circle to the middle.",
      "Connect the bump back to the line."
    ],
    funTip: "Pretend the bump is paint on a brush.",
    rightDirections: [
      "Keep the bump touching the line.",
      "Stop the bump right at the middle dot."
    ],
    watchOut: [
      "If the bump droops too low, clear it and retry.",
      "If the line leans, redraw slowly."
    ]
  },
  {
    letter: "Q",
    name: "Queen",
    sound: "/kw/",
    color: "text-lime-600",
    gradient: "from-lime-200 to-green-300",
    prompt: "Draw an O and add a fancy tail.",
    steps: [
      "Draw a round O shape.",
      "Start near the bottom and add a short diagonal tail."
    ],
    funTip: "Imagine the tail is a royal ribbon.",
    rightDirections: [
      "Keep the O closed and smooth.",
      "Let the tail point down to the right."
    ],
    watchOut: [
      "If the tail is long, make it shorter.",
      "If the O has a gap, retrace to close it."
    ]
  },
  {
    letter: "R",
    name: "Rainbow",
    sound: "/r/",
    color: "text-blue-700",
    gradient: "from-blue-200 to-indigo-300",
    prompt: "Draw a tall line, add a bump, then kick out a leg.",
    steps: [
      "Draw the tall line.",
      "Add a bump from the top to the middle.",
      "From the middle, draw a diagonal leg down."
    ],
    funTip: "Pretend the leg is running to paint a rainbow.",
    rightDirections: [
      "Make the bump end at the middle dot.",
      "Start the leg exactly where the bump ends."
    ],
    watchOut: [
      "If the leg starts too high or low, redraw it.",
      "If the tall line leans, slow down."
    ]
  },
  {
    letter: "S",
    name: "Sun",
    sound: "/s/",
    color: "text-yellow-600",
    gradient: "from-yellow-200 to-amber-300",
    prompt: "Draw a smooth snaky curve.",
    steps: [
      "Start at the top and curve left.",
      "Swing back to the right in the middle.",
      "Curve left again to finish at the bottom."
    ],
    funTip: "Hiss softly while you draw.",
    rightDirections: [
      "Keep the curves gentle and even.",
      "Make the middle a little narrower."
    ],
    watchOut: [
      "If the snake gets pointy, go slower.",
      "If the curves cross, erase and stay between the dotted lines."
    ]
  },
  {
    letter: "T",
    name: "Tree",
    sound: "/t/",
    color: "text-slate-700",
    gradient: "from-slate-200 to-slate-400",
    prompt: "Draw the roof, then the trunk.",
    steps: [
      "Draw a straight line across the top.",
      "Find the middle and draw a line straight down."
    ],
    funTip: "Say “roof, trunk.”",
    rightDirections: [
      "Keep the roof level.",
      "Make the trunk centered."
    ],
    watchOut: [
      "If the trunk leans, redraw slowly.",
      "If the roof droops, make it level."
    ]
  },
  {
    letter: "U",
    name: "Umbrella",
    sound: "/ŭ/",
    color: "text-emerald-700",
    gradient: "from-emerald-200 to-green-300",
    prompt: "Slide down, scoop, and go up.",
    steps: [
      "Start on the left and draw straight down.",
      "Curve at the bottom like a smiling scoop.",
      "Go straight up on the right."
    ],
    funTip: "Pretend you are scooping a happy smile.",
    rightDirections: [
      "Keep both sides the same height.",
      "Make the bottom curve round."
    ],
    watchOut: [
      "If one side is taller, erase and try again.",
      "If the bottom is pointy, slow down."
    ]
  },
  {
    letter: "V",
    name: "Violin",
    sound: "/v/",
    color: "text-indigo-700",
    gradient: "from-indigo-200 to-purple-300",
    prompt: "Draw a sharp smile that points down.",
    steps: [
      "Start at the left top dot and slant down.",
      "Slant back up to the right top dot."
    ],
    funTip: "Say “down, up” like a violin bow.",
    rightDirections: [
      "Keep both sides the same length.",
      "Make the point sharp at the bottom."
    ],
    watchOut: [
      "If the point is flat, redraw meeting at the bottom dot.",
      "If one side is longer, go slower."
    ]
  },
  {
    letter: "W",
    name: "Waterfall",
    sound: "/w/",
    color: "text-blue-700",
    gradient: "from-blue-200 to-cyan-300",
    prompt: "Draw two Vs that share points.",
    steps: [
      "Start at the left, slant down, then up to the middle.",
      "Slant down again and up to finish on the right."
    ],
    funTip: "Say “down, up, down, up.”",
    rightDirections: [
      "Keep the middle peaks even.",
      "Let all points touch the baseline."
    ],
    watchOut: [
      "If a point floats, redraw touching the line.",
      "If the lines cross, slow down."
    ]
  },
  {
    letter: "X",
    name: "Xylophone",
    sound: "/ks/",
    color: "text-neutral-700",
    gradient: "from-neutral-200 to-gray-300",
    prompt: "Draw two lines that cross.",
    steps: [
      "Slant down from the left top to the right bottom dot.",
      "Slant down from the right top to the left bottom dot."
    ],
    funTip: "Tap the center like a xylophone key.",
    rightDirections: [
      "Keep the lines centered.",
      "Cross right in the middle."
    ],
    watchOut: [
      "If the lines miss, redraw and meet in the center.",
      "If a line curves, make it straight."
    ]
  },
  {
    letter: "Y",
    name: "Yoyo",
    sound: "/y/",
    color: "text-violet-700",
    gradient: "from-violet-200 to-purple-300",
    prompt: "Make a slingshot shape.",
    steps: [
      "Draw a short slant down to the middle from the left.",
      "Draw another slant down to the middle from the right.",
      "From the center, draw a long line straight down."
    ],
    funTip: "Pretend the yoyo string drops from the middle.",
    rightDirections: [
      "Keep the top slants the same length.",
      "Make the bottom line centered."
    ],
    watchOut: [
      "If the slants are uneven, erase and go slower.",
      "If the bottom line leans, redraw it straight."
    ]
  },
  {
    letter: "Z",
    name: "Zigzag",
    sound: "/z/",
    color: "text-slate-800",
    gradient: "from-slate-200 to-slate-400",
    prompt: "Zip across, zoom down, zip across again.",
    steps: [
      "Draw a line across the top.",
      "Make a diagonal down to the other side.",
      "Add a line across the bottom."
    ],
    funTip: "Say “zip, zoom, zip.”",
    rightDirections: [
      "Keep the top and bottom lines parallel.",
      "Let the diagonal touch both ends."
    ],
    watchOut: [
      "If the diagonal floats, redraw it slower.",
      "If the bottom line slopes, erase and make it level."
    ]
  }
];

const encouragementMessages = [
  "Beautiful tracing! Your letters shine!",
  "Great focus! Keep those lines smooth!",
  "Amazing effort! Each letter looks stronger!",
  "You are a tracing hero today!",
  "Keep going! Your alphabet is coming alive!"
];

interface LetterTraceCanvasProps {
  data: LetterTraceCard;
  isCompleted: boolean;
  onCompleteToggle: () => void;
  onReplayPrompt: () => void;
}

const LetterTraceCanvas: React.FC<LetterTraceCanvasProps> = ({
  data,
  isCompleted,
  onCompleteToggle,
  onReplayPrompt
}) => {
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

    const context = canvas.getContext("2d");
    if (!context) return;

    context.setTransform(1, 0, 0, 1, 0, 0);
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.scale(scale, scale);
    context.lineCap = "round";
    context.lineJoin = "round";
    context.lineWidth = 6;
    context.strokeStyle = "#9333ea";

    drawingContextRef.current = context;
  }, []);

  useEffect(() => {
    setupCanvas();
    window.addEventListener("resize", setupCanvas);
    return () => {
      window.removeEventListener("resize", setupCanvas);
    };
  }, [setupCanvas]);

  const getPoint = useCallback((event: React.PointerEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return null;
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top
    };
  }, []);

  const handlePointerDown = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
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
    },
    [getPoint]
  );

  const handlePointerMove = useCallback(
    (event: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDrawingRef.current) return;
      const context = drawingContextRef.current;
      if (!context) return;

      event.preventDefault();
      const point = getPoint(event);
      if (!point) return;

      context.lineTo(point.x, point.y);
      context.stroke();
    },
    [getPoint]
  );

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
          className="relative w-full aspect-[3/4] rounded-3xl border-4 border-dashed border-purple-200 bg-white shadow-inner overflow-hidden"
        >
          <svg className="absolute inset-0 h-full w-full text-gray-200" viewBox="0 0 300 400" preserveAspectRatio="xMidYMid meet">
            <defs>
              <linearGradient id={`trace-gradient-${data.letter}`} x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#e9d5ff" stopOpacity="0.9" />
                <stop offset="100%" stopColor="#c084fc" stopOpacity="0.9" />
              </linearGradient>
            </defs>
            <text
              x="50%"
              y="58%"
              textAnchor="middle"
              dominantBaseline="middle"
              fontSize="220"
              fill="none"
              stroke={`url(#trace-gradient-${data.letter})`}
              strokeWidth="12"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeDasharray="24 18"
            >
              {data.letter}
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
          className="px-4 py-2 rounded-full bg-gradient-to-r from-purple-300 to-purple-500 text-white font-semibold shadow-lg transition-transform duration-300 hover:scale-105"
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
            isCompleted ? "bg-gradient-to-r from-indigo-400 to-indigo-500 text-white" : "bg-gradient-to-r from-amber-400 to-amber-500 text-white"
          }`}
        >
          {isCompleted ? "Great! Trace Again?" : "I Traced It!"}
        </button>
      </div>
    </div>
  );
};

const AlphabetTracing: React.FC = () => {
  const [activeLetter, setActiveLetter] = useState<string>(letterTraceCards[0].letter);
  const [completedLetters, setCompletedLetters] = useState<Set<string>>(new Set());
  const [isSpeaking, setIsSpeaking] = useState(false);

  const letterMap = useMemo(() => {
    const map = new Map<string, LetterTraceCard>();
    letterTraceCards.forEach((card) => map.set(card.letter, card));
    return map;
  }, []);

  const activeCard = letterMap.get(activeLetter) ?? letterTraceCards[0];

  const speak = useCallback(
    (text: string) => {
      if (
        typeof window !== "undefined" &&
        "speechSynthesis" in window &&
        typeof SpeechSynthesisUtterance !== "undefined" &&
        !isSpeaking
      ) {
        setIsSpeaking(true);
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = 0.95;
        utterance.pitch = 1.25;
        utterance.volume = 0.9;
        utterance.onend = () => setIsSpeaking(false);
        utterance.onerror = () => setIsSpeaking(false);
        window.speechSynthesis.speak(utterance);
      }
    },
    [isSpeaking]
  );

  const handleLetterSelect = useCallback((letter: string) => {
    setActiveLetter(letter);
  }, []);

  const handlePlayWelcome = useCallback(() => {
    speak(
      "Let's trace the alphabet together. Pick a letter, listen to the steps, and follow the dotted path with your finger or stylus."
    );
  }, [speak]);

  const toggleCompleted = useCallback(
    (letter: string) => {
      const wasCompleted = completedLetters.has(letter);
      setCompletedLetters((prev) => {
        const next = new Set(prev);
        if (wasCompleted) {
          next.delete(letter);
        } else {
          next.add(letter);
        }
        return next;
      });

      const card = letterMap.get(letter);
      if (!card) return;

      if (wasCompleted) {
        speak(`Great choice! Let's practice ${card.letter} again. ${card.watchOut[0]}`);
      } else {
        const message = encouragementMessages[Math.floor(Math.random() * encouragementMessages.length)];
        speak(`${card.letter} for ${card.name}. ${message}`);
      }
    },
    [completedLetters, letterMap, speak]
  );

  const handleReplaySteps = useCallback(() => {
    const card = letterMap.get(activeLetter);
    if (!card) return;
    speak(
      `${card.letter} says ${card.sound}. ${card.prompt} ${card.steps.join(" ")} Remember: ${card.rightDirections.join(
        " "
      )}. If it feels tricky, ${card.watchOut[0]}`
    );
  }, [activeLetter, letterMap, speak]);

  const progress = (completedLetters.size / letterTraceCards.length) * 100;

  return (
    <div className="min-h-screen bg-gradient-to-br from-fuchsia-50 via-purple-50 to-sky-50 p-4 sm:p-8 relative overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-10 left-10 w-64 h-64 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob"></div>
        <div className="absolute -bottom-12 right-4 w-80 h-80 bg-sky-200 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000"></div>
      </div>

      <div className="max-w-6xl mx-auto relative z-10">
        <header className="text-center mb-10">
          <div className="inline-block mb-4">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold bg-gradient-to-r from-purple-600 via-pink-600 to-sky-600 bg-clip-text text-transparent drop-shadow-lg mb-4">
              Trace the Letters
            </h1>
            <div className="h-1 w-24 bg-gradient-to-r from-purple-400 via-pink-400 to-sky-400 mx-auto rounded-full"></div>
          </div>
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-gray-700 font-medium">
            Follow the dotted paths to trace each uppercase letter. Use your finger, mouse, or stylus and say the letter sound aloud for extra fun.
          </p>

          <div className="mt-6 max-w-lg mx-auto">
            <div className="flex justify-between items-center text-sm font-semibold text-gray-700 mb-2">
              <span>Tracing Progress</span>
              <span className="text-purple-600">
                {completedLetters.size} / {letterTraceCards.length}
              </span>
            </div>
            <div className="w-full h-3 bg-white/80 rounded-full overflow-hidden shadow-inner border border-purple-100">
              <div
                className="h-full bg-gradient-to-r from-purple-400 via-pink-500 to-sky-500 transition-all duration-500 ease-out rounded-full"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          <button
            onClick={handlePlayWelcome}
            className="mt-6 inline-flex items-center gap-3 px-6 py-3 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-sky-500 text-white font-semibold shadow-xl transition-transform duration-300 hover:scale-105"
          >
            <span>🎧</span>
            <span>Play Welcome Instructions</span>
          </button>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <section className="lg:col-span-1 space-y-6">
            <div className="text-center">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Choose a Letter</h2>
              <div className="h-1 w-16 bg-gradient-to-r from-purple-400 to-sky-400 mx-auto rounded-full"></div>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
              {letterTraceCards.map((card) => {
                const isActive = activeLetter === card.letter;
                const isDone = completedLetters.has(card.letter);
                return (
                  <button
                    key={card.letter}
                    onClick={() => handleLetterSelect(card.letter)}
                    className={`relative rounded-2xl px-2 py-4 text-center transition-all duration-300 transform border ${
                      isActive
                        ? `bg-gradient-to-br ${card.gradient} text-white shadow-2xl scale-105 ring-4 ring-white/60`
                        : "bg-white text-gray-800 border-gray-200 hover:border-purple-200 hover:shadow-lg hover:-translate-y-1"
                    }`}
                  >
                    <div className={`text-2xl font-extrabold mb-1 ${isActive ? "text-white" : card.color}`}>{card.letter}</div>
                    <div className={`text-[10px] font-semibold uppercase tracking-wide ${isActive ? "text-white/80" : "text-gray-500"}`}>
                      {card.name}
                    </div>
                    {isDone && (
                      <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-emerald-500 text-white text-[10px] font-bold flex items-center justify-center shadow-lg">
                        ✓
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </section>

          <section className="lg:col-span-2">
            <div className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="flex flex-col gap-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="text-sm font-semibold text-purple-500 uppercase tracking-wide">Let’s trace</div>
                    <h2 className="text-3xl sm:text-4xl font-extrabold text-gray-900 flex items-center gap-3">
                      <span
                        className={`inline-flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br ${activeCard.gradient} text-white text-3xl shadow-lg`}
                      >
                        {activeCard.letter}
                      </span>
                      <span>{activeCard.name}</span>
                    </h2>
                    <p className="text-gray-600 mt-2 text-base sm:text-lg">{activeCard.prompt}</p>
                  </div>
                  <div className="flex flex-col items-center sm:items-end gap-2 text-sm text-gray-600">
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-100 text-purple-600 font-semibold">✍️ Fine Motor Fun</span>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-600 font-semibold">🌟 Ages 3 - 5</span>
                  </div>
                </div>

                <LetterTraceCanvas
                  key={activeCard.letter}
                  data={activeCard}
                  isCompleted={completedLetters.has(activeCard.letter)}
                  onCompleteToggle={() => toggleCompleted(activeCard.letter)}
                  onReplayPrompt={handleReplaySteps}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-purple-50 rounded-2xl p-5 border border-purple-100">
                    <h3 className="text-lg font-bold text-purple-700 mb-3">Tracing Steps</h3>
                    <ul className="space-y-2 text-sm text-purple-800 font-medium">
                      {activeCard.steps.map((step, index) => (
                        <li key={index} className="flex gap-3 items-start">
                          <span className="w-6 h-6 flex-shrink-0 rounded-full bg-purple-500 text-white flex items-center justify-center text-sm font-bold">{index + 1}</span>
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
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-200 text-emerald-800 text-xs font-semibold uppercase tracking-wide">✅ Right Way</div>
                        <ul className="text-sm text-emerald-700 space-y-2">
                          {activeCard.rightDirections.map((tip, index) => (
                            <li key={index}>• {tip}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="space-y-2">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-200 text-red-700 text-xs font-semibold uppercase tracking-wide">❌ Try Again If</div>
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
                      <li>• Say the letter sound each time you trace.</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        <section className="mt-12">
          <div className="bg-white/80 backdrop-blur-md border border-purple-100 rounded-3xl p-6 sm:p-8 shadow-xl max-w-3xl mx-auto text-center space-y-4">
            <h3 className="text-2xl font-bold text-gray-800">Tips for Helpers</h3>
            <p className="text-base text-gray-600">
              Encourage little learners to hold their finger or stylus gently and trace along the dotted lines. Celebrate every attempt—confidence grows with each stroke!
            </p>
            <div className="flex flex-wrap justify-center gap-3 text-sm font-semibold text-gray-700">
              <span className="px-4 py-2 rounded-full bg-purple-100 text-purple-600">Model the strokes once</span>
              <span className="px-4 py-2 rounded-full bg-emerald-100 text-emerald-600">Say the letter sound together</span>
              <span className="px-4 py-2 rounded-full bg-sky-100 text-sky-600">Take wiggle breaks often</span>
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

export default AlphabetTracing;


