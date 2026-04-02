import { useState, useEffect, useCallback, forwardRef, useRef } from "react";
import * as React from "react";
import { ChevronLeft, ChevronRight, Sun, Moon, Volume2 } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useProfile } from "../../../../../context/ProfileContext";

// Utility function
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Button Component
const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

// Shape data
const shapes = [
  { name: "Circle", object: "Ball", emoji: "⚽", text: "A ball is circular!", color: "text-shape-red", voice: "Look! A ball is rolling in!" },
  { name: "Triangle", object: "Nachos", emoji: "🔺", text: "Nachos are like triangles!", color: "text-shape-yellow", voice: "Here come some yummy nachos!" },
  { name: "Oval", object: "Egg", emoji: "🥚", text: "Eggs have oval shapes!", color: "text-shape-blue", voice: "An egg is rolling over!" },
  { name: "Rectangle", object: "Book", emoji: "📕", text: "Books are rectangles!", color: "text-shape-green", voice: "Here comes a book!" },
  { name: "Square", object: "Gift Box", emoji: "🎁", text: "Gift boxes are squares!", color: "text-shape-purple", voice: "Look at this beautiful gift box!" },
  { name: "Star", object: "Star", emoji: "⭐", text: "Stars have pointy shapes!", color: "text-shape-yellow", voice: "A shining star appears!" },
  { name: "Heart", object: "Heart", emoji: "❤️", text: "Hearts have a special shape!", color: "text-shape-pink", voice: "Here's a lovely heart!" },
  { name: "Diamond", object: "Kite", emoji: "🪁", text: "Kites are diamond-shaped!", color: "text-shape-cyan", voice: "A kite is flying in!" },
  { name: "Hexagon", object: "Honeycomb", emoji: "🍯", text: "Honeycombs are hexagons!", color: "text-shape-amber", voice: "Look at this honeycomb!" },
  { name: "Crescent", object: "Moon", emoji: "🌙", text: "The moon can be a crescent!", color: "text-shape-indigo", voice: "The moon is here!" }
];

const getColorValue = (colorClass: string) => {
  const colorMap: Record<string, string> = {
    'text-shape-red': 'hsl(var(--shape-red))',
    'text-shape-orange': 'hsl(var(--shape-orange))',
    'text-shape-yellow': 'hsl(var(--shape-yellow))',
    'text-shape-green': 'hsl(var(--shape-green))',
    'text-shape-blue': 'hsl(var(--shape-blue))',
    'text-shape-purple': 'hsl(var(--shape-purple))',
    'text-shape-pink': 'hsl(var(--shape-pink))',
    'text-shape-cyan': 'hsl(var(--shape-cyan))',
    'text-shape-amber': 'hsl(var(--shape-amber))',
    'text-shape-indigo': 'hsl(var(--shape-indigo))',
  };
  return colorMap[colorClass] || 'hsl(var(--shape-blue))';
};

const ShapeRenderer = ({ shapeName, color }: { shapeName: string; color: string }) => {
  const colorValue = getColorValue(color);
  switch (shapeName) {
    case "Circle": return <div className="w-32 h-32 rounded-full shadow-lg" style={{ backgroundColor: colorValue }} />;
    case "Triangle": return <div className="relative w-32 h-32 flex items-center justify-center"><svg width="128" height="128" viewBox="0 0 128 128"><polygon points="64,10 120,110 8,110" fill={colorValue} className="drop-shadow-lg" /></svg></div>;
    case "Oval": return <div className="w-40 h-28 rounded-full shadow-lg" style={{ backgroundColor: colorValue }} />;
    case "Rectangle": return <div className="w-40 h-24 rounded-lg shadow-lg" style={{ backgroundColor: colorValue }} />;
    case "Square": return <div className="w-32 h-32 rounded-lg shadow-lg" style={{ backgroundColor: colorValue }} />;
    case "Star": return <div className="text-8xl drop-shadow-lg">⭐</div>;
    case "Heart": return <div className="text-8xl drop-shadow-lg">❤️</div>;
    case "Diamond": return <div className="w-28 h-28 rotate-45 rounded-md shadow-lg" style={{ backgroundColor: colorValue }} />;
    case "Hexagon": return <div className="relative w-28 h-32"><svg width="112" height="128" viewBox="0 0 112 128"><polygon points="28,0 84,0 112,64 84,128 28,128 0,64" fill={colorValue} className="drop-shadow-lg" /></svg></div>;
    case "Crescent": return <div className="text-8xl drop-shadow-lg">🌙</div>;
    default: return null;
  }
};

const ObjectDisplay = ({ emoji, text, isRolling, showText, hideText }: { emoji: string; text: string; isRolling: boolean; showText: boolean; hideText?: boolean }) => {
  return (
    <div className="flex flex-col items-center justify-center h-64 md:h-96">
      <div className={`text-[8rem] md:text-9xl transition-all duration-700 ${isRolling ? 'animate-roll-in' : ''}`}>{emoji}</div>
      {showText && !hideText && (
        <div className="mt-8 animate-fade-in-scale">
          <p className="text-2xl md:text-3xl font-bold text-card-foreground text-center px-6 py-3 rounded-2xl bg-secondary/80 backdrop-blur-sm animate-pulse-slow shadow-lg">{text}</p>
        </div>
      )}
    </div>
  );
};

const ShapeDisplay = ({ shapeName, color, showDrawing, hideLabel }: { shapeName: string; color: string; showDrawing: boolean; hideLabel?: boolean }) => {
  if (!showDrawing) return null;
  return (
    <div className="flex flex-col items-center justify-center h-64 md:h-96">
      <div className="animate-fade-in-scale flex flex-col items-center gap-6">
        <div className="transform transition-all duration-500 hover:scale-105 cursor-pointer"><ShapeRenderer shapeName={shapeName} color={color} /></div>
        {!hideLabel && <p className="text-3xl md:text-5xl font-bold text-primary bg-primary/10 px-6 py-3 rounded-2xl">{shapeName}</p>}
      </div>
    </div>
  );
};

const ProgressIndicator = ({ total, current }: { total: number; current: number }) => {
  return (
    <div className="flex gap-2">
      {Array.from({ length: total }).map((_, idx) => (
        <div key={idx} className={`h-3 rounded-full transition-all duration-300 ${idx === current ? 'bg-primary w-10 shadow-lg shadow-primary/50' : 'bg-muted w-3'}`} />
      ))}
    </div>
  );
};

const Index = () => {
  const { activeProfile } = useProfile();
  const [currentShape, setCurrentShape] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showDrawing, setShowDrawing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const timersRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const audioContextRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    if (isDarkMode) document.documentElement.classList.add('dark');
    else document.documentElement.classList.remove('dark');
  }, [isDarkMode]);

  const toggleTheme = () => {
    try {
        if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
        const ctx = audioContextRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain); gain.connect(ctx.destination);
        osc.frequency.setValueAtTime(440, ctx.currentTime);
        gain.gain.setValueAtTime(0.05, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);
        osc.start(); osc.stop(ctx.currentTime + 0.1);
    } catch (e) {}
    setIsDarkMode(!isDarkMode);
  };

  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9; utterance.pitch = 1.2; utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  const clearAllTimers = () => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
  };

  const startAnimation = useCallback(() => {
    setIsRolling(true); setShowText(false); setShowDrawing(false);
    speak(shapes[currentShape].voice);
    const t1 = setTimeout(() => {
      setIsRolling(false);
      const t2 = setTimeout(() => {
        setShowText(true); speak(shapes[currentShape].text);
        const t3 = setTimeout(() => {
          setShowDrawing(true); speak(`This is a ${shapes[currentShape].name}!`);
          const t4 = setTimeout(() => { if (currentShape < shapes.length - 1) setCurrentShape(p => p + 1); }, 5000);
          timersRef.current.push(t4);
        }, 1500);
        timersRef.current.push(t3);
      }, 1000);
      timersRef.current.push(t2);
    }, 2500);
    timersRef.current.push(t1);
  }, [currentShape, speak]);

  useEffect(() => {
    clearAllTimers(); startAnimation();
    return () => clearAllTimers();
  }, [currentShape, startAnimation]);

  const isKids = activeProfile?.type === 'KIDS';

  return (
    <>
      <style>{`
        :root { --shape-red: 0 84% 60%; --shape-orange: 25 95% 53%; --shape-yellow: 48 96% 53%; --shape-green: 142 71% 45%; --shape-blue: 217 91% 60%; --shape-purple: 262 83% 58%; --shape-pink: 330 81% 60%; --shape-cyan: 189 94% 43%; --shape-amber: 38 92% 50%; --shape-indigo: 243 75% 59%; --learning-bg-start: 210 100% 97%; --learning-bg-mid: 200 100% 95%; --learning-bg-end: 190 100% 97%; --background: 0 0% 100%; --foreground: 222.2 84% 4.9%; --card: 0 0% 100%; --card-foreground: 222.2 84% 4.9%; --primary: 221.2 83.2% 53.3%; --primary-foreground: 210 40% 98%; --secondary: 210 40% 96.1%; --secondary-foreground: 222.2 47.4% 11.2%; --muted: 210 40% 96.1%; --muted-foreground: 215.4 16.3% 46.9%; --accent: 210 40% 96.1%; --accent-foreground: 222.2 47.4% 11.2%; --border: 214.3 31.8% 91.4%; --input: 214.3 31.8% 91.4%; --ring: 221.2 83.2% 53.3%; }
        .dark { --learning-bg-start: 222 47% 11%; --learning-bg-mid: 217 33% 17%; --learning-bg-end: 222 47% 11%; --background: 222.2 84% 4.9%; --foreground: 210 40% 98%; --card: 222.2 84% 4.9%; --card-foreground: 210 40% 98%; --primary: 217.2 91.2% 59.8%; --primary-foreground: 222.2 47.4% 11.2%; --secondary: 217.2 32.6% 17.5%; --secondary-foreground: 210 40% 98%; --muted: 217.2 32.6% 17.5%; --muted-foreground: 215 20.2% 65.1%; --accent: 217.2 32.6% 17.5%; --accent-foreground: 210 40% 98%; --border: 217.2 32.6% 17.5%; --input: 217.2 32.6% 17.5%; --ring: 224.3 76.3% 48%; }
        @keyframes roll-in { 0% { transform: translateX(-200%) rotate(0deg); opacity: 0; } 50% { opacity: 1; } 100% { transform: translateX(0) rotate(360deg); opacity: 1; } }
        @keyframes fade-in-scale { 0% { opacity: 0; transform: scale(0.8); } 100% { opacity: 1; transform: scale(1); } }
        @keyframes pulse-slow { 0%, 100% { transform: scale(1); } 50% { transform: scale(1.05); } }
        .animate-roll-in { animation: roll-in 2.5s cubic-bezier(0.34, 1.56, 0.64, 1); }
        .animate-fade-in-scale { animation: fade-in-scale 0.6s ease-out forwards; }
        .animate-pulse-slow { animation: pulse-slow 2s ease-in-out infinite; }
        * { transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease; }
      `}</style>
      <div className="min-h-screen p-4 md:p-8" style={{ background: `linear-gradient(135deg, hsl(var(--learning-bg-start)) 0%, hsl(var(--learning-bg-mid)) 50%, hsl(var(--learning-bg-end)) 100%)` }}>
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-8 md:mb-12 relative flex flex-col items-center">
            {activeProfile?.type !== 'KIDS' && (
                <Button onClick={toggleTheme} variant="outline" size="icon" className="absolute right-0 top-0 rounded-full transition-transform hover:rotate-12">
                    {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </Button>
            )}
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-2 animate-fade-in-scale">
               {isKids ? "SHAPES!" : "Let's Learn Shapes! 🎨"}
            </h1>
            {!isKids && <p className="text-lg md:text-xl text-muted-foreground">Discover shapes through fun objects!</p>}
          </header>

          <main className="bg-card rounded-3xl shadow-2xl p-6 md:p-12 min-h-[400px] md:min-h-[500px] relative overflow-hidden mb-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <ObjectDisplay emoji={shapes[currentShape].emoji} text={shapes[currentShape].text} isRolling={isRolling} showText={showText} hideText={isKids} />
              <ShapeDisplay shapeName={shapes[currentShape].name} color={shapes[currentShape].color} showDrawing={showDrawing} hideLabel={isKids} />
            </div>
            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2"><ProgressIndicator total={shapes.length} current={currentShape} /></div>
          </main>

          <div className="flex flex-col items-center gap-6">
            <div className="flex justify-center gap-6 w-full max-w-xl">
                <Button onClick={() => { if (currentShape > 0) { clearAllTimers(); window.speechSynthesis.cancel(); setCurrentShape(c => c - 1); } }} disabled={currentShape === 0} size="lg" className="flex-1 gap-2 text-xl px-8 py-10 rounded-[2rem] shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50">
                    <ChevronLeft strokeWidth={4} className="w-8 h-8" />
                    {!isKids && "Previous"}
                </Button>
                <Button onClick={() => { if (currentShape < shapes.length - 1) { clearAllTimers(); window.speechSynthesis.cancel(); setCurrentShape(c => c + 1); } }} disabled={currentShape === shapes.length - 1} size="lg" className="flex-1 gap-2 text-xl px-8 py-10 rounded-[2rem] shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 bg-primary text-white">
                    {!isKids && "Next"}
                    <ChevronRight strokeWidth={4} className="w-8 h-8" />
                </Button>
            </div>
            {!isKids && (
                <div className="text-center space-y-2">
                    <p className="text-lg text-muted-foreground font-medium">Shape {currentShape + 1} of {shapes.length}</p>
                    <p className="text-sm text-muted-foreground flex items-center justify-center gap-2"><Volume2 className="w-5 h-5" /> Sound is on!</p>
                </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Index;