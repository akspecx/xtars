import { useState, useEffect } from "react";
import { toast } from "sonner";
import confetti from "canvas-confetti";
import { Volume2, VolumeX } from "lucide-react";
import { SchoolBusVehicle } from "./BuShapesComponent/SchoolBusVehicle";
import { FireTruckVehicle } from "./BuShapesComponent/FireTruckVehicle";
import { PoliceCarVehicle } from "./BuShapesComponent/PoliceCarVehicle";
import { IceCreamTruckVehicle } from "./BuShapesComponent/IceCreamTruckVehicle";
import { Button } from "./BuShapesComponent/button";

export type ShapeType = "circle" | "triangle" | "rectangle" | "pentagon" | "hexagon" | "oval" | "cloud";

type BusTheme = "school" | "fire" | "police" | "icecream";

const busThemes = {
  school: {
    name: "School Bus",
    color: "from-yellow-400 to-yellow-500",
    topColor: "from-yellow-400 to-yellow-500",
    borderColor: "border-orange-500",
    label: "SCHOOL BUS",
    labelBg: "bg-orange-500",
    icon: "🚌",
  },
  fire: {
    name: "Fire Truck",
    color: "from-red-500 to-red-600",
    topColor: "from-red-500 to-red-600",
    borderColor: "border-red-800",
    label: "FIRE TRUCK",
    labelBg: "bg-red-800",
    icon: "🚒",
  },
  police: {
    name: "Police Car",
    color: "from-blue-500 to-blue-600",
    topColor: "from-blue-500 to-blue-600",
    borderColor: "border-blue-800",
    label: "POLICE",
    labelBg: "bg-blue-800",
    icon: "🚓",
  },
  icecream: {
    name: "Ice Cream Truck",
    color: "from-pink-400 to-pink-500",
    topColor: "from-pink-400 to-pink-500",
    borderColor: "border-pink-700",
    label: "ICE CREAM",
    labelBg: "bg-pink-700",
    icon: "🍦",
  },
};

const shapes: { type: ShapeType; label: string }[] = [
  { type: "circle", label: "Circle" },
  { type: "triangle", label: "Triangle" },
  { type: "rectangle", label: "Rectangle" },
  { type: "pentagon", label: "Pentagon" },
  { type: "hexagon", label: "Hexagon" },
  { type: "oval", label: "Oval" },
  { type: "cloud", label: "Cloud" },
];

const shapeColors: Record<ShapeType, string> = {
  circle: "#1e293b", // Dark gray for wheels
  triangle: "#dc2626", // Bright red
  rectangle: "#38bdf8", // Sky blue
  pentagon: "#8b5cf6", // Purple
  hexagon: "#f59e0b", // Amber
  oval: "#ec4899", // Pink
  cloud: "#e5e7eb", // Light gray
};

// Sound effect functions using Web Audio API
const playSound = (frequency: number, duration: number, type: OscillatorType = "sine") => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  const oscillator = audioContext.createOscillator();
  const gainNode = audioContext.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioContext.destination);

  oscillator.frequency.value = frequency;
  oscillator.type = type;

  gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);

  oscillator.start(audioContext.currentTime);
  oscillator.stop(audioContext.currentTime + duration);
};

// Playful engine sound effect
const playEngineSound = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Create a playful "beep beep" sound
  const playBeep = (frequency: number, startTime: number) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.2, audioContext.currentTime + startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + 0.15);

    oscillator.start(audioContext.currentTime + startTime);
    oscillator.stop(audioContext.currentTime + startTime + 0.15);
  };
  
  // Play two cheerful beeps
  playBeep(659.25, 0); // E5
  playBeep(783.99, 0.2); // G5
};

// Theme-specific sound effects
const playFireTruckSiren = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const playSirenWail = (startFreq: number, endFreq: number, startTime: number, duration: number) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.setValueAtTime(startFreq, audioContext.currentTime + startTime);
    oscillator.frequency.exponentialRampToValueAtTime(endFreq, audioContext.currentTime + startTime + duration);
    oscillator.type = "sawtooth";

    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime + startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + duration);

    oscillator.start(audioContext.currentTime + startTime);
    oscillator.stop(audioContext.currentTime + startTime + duration);
  };
  
  // Fire truck siren: woo-woo-woo
  playSirenWail(600, 900, 0, 0.4);
  playSirenWail(900, 600, 0.4, 0.4);
  playSirenWail(600, 900, 0.8, 0.4);
};

const playPoliceSiren = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const playSirenTone = (frequency: number, startTime: number, duration: number) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "square";

    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime + startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + duration);

    oscillator.start(audioContext.currentTime + startTime);
    oscillator.stop(audioContext.currentTime + startTime + duration);
  };
  
  // Police siren: nee-naw-nee-naw
  playSirenTone(800, 0, 0.25);
  playSirenTone(650, 0.25, 0.25);
  playSirenTone(800, 0.5, 0.25);
  playSirenTone(650, 0.75, 0.25);
};

const playIceCreamJingle = () => {
  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  const playNote = (frequency: number, startTime: number, duration: number) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.15, audioContext.currentTime + startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + duration);

    oscillator.start(audioContext.currentTime + startTime);
    oscillator.stop(audioContext.currentTime + startTime + duration);
  };
  
  // Ice cream truck jingle: classic cheerful melody
  const melody = [
    { freq: 523.25, time: 0, dur: 0.2 },      // C
    { freq: 659.25, time: 0.2, dur: 0.2 },    // E
    { freq: 783.99, time: 0.4, dur: 0.2 },    // G
    { freq: 1046.50, time: 0.6, dur: 0.3 },   // C
    { freq: 783.99, time: 0.9, dur: 0.2 },    // G
    { freq: 659.25, time: 1.1, dur: 0.3 },    // E
  ];
  
  melody.forEach(note => playNote(note.freq, note.time, note.dur));
};

const playThemeSound = (theme: BusTheme) => {
  switch (theme) {
    case "school":
      playEngineSound();
      break;
    case "fire":
      playFireTruckSiren();
      break;
    case "police":
      playPoliceSiren();
      break;
    case "icecream":
      playIceCreamJingle();
      break;
  }
};

// Voice instruction
const playVoiceInstruction = () => {
  if ('speechSynthesis' in window) {
    const utterance = new SpeechSynthesisUtterance("Drag and drop shapes at the specified place on the bus!");
    utterance.rate = 0.9;
    utterance.pitch = 1.1;
    utterance.volume = 1;
    window.speechSynthesis.speak(utterance);
  }
};

// Background music - Wheels on the Bus melody
let backgroundMusicInterval: any = null;
let isMusicMuted = false;

const playBackgroundMusic = () => {
  // Stop any existing music
  if (backgroundMusicInterval) {
    clearInterval(backgroundMusicInterval);
  }
  
  if (isMusicMuted) return;

  const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
  
  // Simplified "Wheels on the Bus" melody
  const melody = [
    { note: 523.25, duration: 0.3 }, // C
    { note: 523.25, duration: 0.3 }, // C
    { note: 523.25, duration: 0.3 }, // C
    { note: 392.00, duration: 0.2 }, // G
    { note: 440.00, duration: 0.2 }, // A
    { note: 523.25, duration: 0.4 }, // C
    { note: 392.00, duration: 0.3 }, // G
    { note: 523.25, duration: 0.5 }, // C
  ];

  let currentTime = 0;
  
  const playMelodyNote = (frequency: number, duration: number, startTime: number) => {
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = "sine";

    gainNode.gain.setValueAtTime(0.08, audioContext.currentTime + startTime);
    gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + startTime + duration);

    oscillator.start(audioContext.currentTime + startTime);
    oscillator.stop(audioContext.currentTime + startTime + duration);
  };

  const playMelody = () => {
    if (isMusicMuted) return;
    currentTime = 0;
    melody.forEach((note) => {
      playMelodyNote(note.note, note.duration, currentTime);
      currentTime += note.duration + 0.05;
    });
  };

  // Play immediately
  playMelody();
  
  // Loop every 3.5 seconds
  backgroundMusicInterval = setInterval(() => {
    playMelody();
  }, 3500);
};

const toggleMusic = (muted: boolean) => {
  isMusicMuted = muted;
  if (muted) {
    stopBackgroundMusic();
  } else {
    playBackgroundMusic();
  }
};

const stopBackgroundMusic = () => {
  if (backgroundMusicInterval) {
    clearInterval(backgroundMusicInterval);
    backgroundMusicInterval = null;
  }
};

const playCorrectSound = () => {
  playSound(523.25, 0.1); // C5
  setTimeout(() => playSound(659.25, 0.1), 100); // E5
  setTimeout(() => playSound(783.99, 0.15), 200); // G5
};

const playIncorrectSound = () => {
  playSound(200, 0.2, "sawtooth");
};

const playCelebrationSound = () => {
  const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
  notes.forEach((note, index) => {
    setTimeout(() => playSound(note, 0.15), index * 100);
  });
  setTimeout(() => {
    notes.reverse().forEach((note, index) => {
      setTimeout(() => playSound(note, 0.15), index * 80);
    });
  }, 500);
};

// Confetti animation
const fireConfetti = () => {
  const duration = 3000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

  const randomInRange = (min: number, max: number) => {
    return Math.random() * (max - min) + min;
  };

  const interval: any = setInterval(() => {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 }
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 }
    });
  }, 250);
};

// Draggable Shape Component
const DraggableShape = ({ 
  type, 
  label, 
  isUsed 
}: { 
  type: ShapeType; 
  label: string; 
  isUsed: boolean;
}) => {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragStart = (e: React.DragEvent) => {
    if (isUsed) return;
    e.dataTransfer.setData("shapeType", type);
    setIsDragging(true);
  };

  const renderShape = () => {
    const color = shapeColors[type];
    
    switch (type) {
      case "circle":
        return <div className="w-full h-full rounded-full" style={{ backgroundColor: color }} />;
      case "triangle":
        return (
          <div
            style={{
              width: 0,
              height: 0,
              borderLeft: "50px solid transparent",
              borderRight: "50px solid transparent",
              borderBottom: `86px solid ${color}`,
              margin: "0 auto",
            }}
          />
        );
      case "rectangle":
        return <div className="w-full h-20 my-2.5" style={{ backgroundColor: color }} />;
      case "pentagon":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,15 90,40 75,85 25,85 10,40" fill={color} />
          </svg>
        );
      case "hexagon":
        return (
          <svg viewBox="0 0 100 100" className="w-full h-full">
            <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill={color} />
          </svg>
        );
      case "oval":
        return <div className="w-full h-3/4 rounded-full" style={{ backgroundColor: color }} />;
      case "cloud":
        return (
          <svg viewBox="0 0 100 60" className="w-full h-full">
            <ellipse cx="50" cy="40" rx="35" ry="20" fill={color} />
            <ellipse cx="30" cy="35" rx="20" ry="15" fill={color} />
            <ellipse cx="70" cy="35" rx="20" ry="15" fill={color} />
            <ellipse cx="50" cy="25" rx="25" ry="18" fill={color} />
          </svg>
        );
    }
  };

  return (
    <div className="flex flex-col items-center gap-3">
      <div
        draggable={!isUsed}
        onDragStart={handleDragStart}
        onDragEnd={() => setIsDragging(false)}
        className={`
          w-32 h-32 bg-white rounded-3xl flex items-center justify-center p-5
          transition-all duration-300 ease-out border-4
          ${!isUsed 
            ? "cursor-grab active:cursor-grabbing hover:scale-110 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.3)] hover:shadow-[0_15px_40px_-10px_rgba(0,0,0,0.4)] border-yellow-400 hover:border-orange-400" 
            : "opacity-30 cursor-not-allowed shadow-[0_8px_24px_-4px_rgba(0,0,0,0.15)] border-gray-300"}
          ${isDragging ? "opacity-50 scale-95" : ""}
        `}
      >
        {renderShape()}
      </div>
      <span className="text-lg font-fredoka font-bold text-gray-800 bg-white/80 px-4 py-1 rounded-full shadow-md">{label}</span>
    </div>
  );
};

// Drop Zone Component
const DropZone = ({
  expectedShape,
  onDrop,
  isMatched,
  style,
  className = "",
  label,
}: {
  expectedShape: ShapeType;
  onDrop: (shape: ShapeType) => void;
  isMatched: boolean;
  style?: React.CSSProperties;
  className?: string;
  label?: string;
}) => {
  const [isOver, setIsOver] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (!isMatched) setIsOver(true);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsOver(false);
    if (!isMatched) {
      const droppedShape = e.dataTransfer.getData("shapeType") as ShapeType;
      onDrop(droppedShape);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={() => setIsOver(false)}
      onDrop={handleDrop}
      className={`
        absolute transition-all duration-300 ease-out
        ${!isMatched ? "border-4 border-dashed" : "border-0"}
        ${isOver ? "border-pink-500 bg-pink-100/20 scale-105" : "border-gray-800/30"}
        ${isMatched ? "animate-[fade-in_0.4s_ease-out]" : ""}
        ${className}
      `}
      style={style}
    >
      {label && !isMatched && (
        <span className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-xs font-bold text-pink-600 whitespace-nowrap">
          {label}
        </span>
      )}
    </div>
  );
};

// Render shape helper
const renderShape = (type: ShapeType, color: string, size: number = 60) => {
  const halfSize = size / 2;
  
  switch (type) {
    case "circle":
      return (
        <div
          className="rounded-full w-full h-full"
          style={{ backgroundColor: color }}
        />
      );
    case "triangle":
      return (
        <div
          style={{
            width: 0,
            height: 0,
            borderLeft: `${halfSize}px solid transparent`,
            borderRight: `${halfSize}px solid transparent`,
            borderBottom: `${size * 0.86}px solid ${color}`,
          }}
        />
      );
    case "rectangle":
      return (
        <div
          className="w-full"
          style={{
            backgroundColor: color,
            height: `${size * 0.6}px`,
          }}
        />
      );
    case "pentagon":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="block">
          <polygon points="50,15 90,40 75,85 25,85 10,40" fill={color} />
        </svg>
      );
    case "hexagon":
      return (
        <svg width={size} height={size} viewBox="0 0 100 100" className="block">
          <polygon points="50,10 90,30 90,70 50,90 10,70 10,30" fill={color} />
        </svg>
      );
    case "oval":
      return (
        <div
          className="rounded-full"
          style={{
            backgroundColor: color,
            width: `${size}px`,
            height: `${size * 0.6}px`,
          }}
        />
      );
    case "cloud":
      return (
        <svg width={size} height={size * 0.6} viewBox="0 0 100 60" className="block">
          <ellipse cx="50" cy="40" rx="35" ry="20" fill={color} />
          <ellipse cx="30" cy="35" rx="20" ry="15" fill={color} />
          <ellipse cx="70" cy="35" rx="20" ry="15" fill={color} />
          <ellipse cx="50" cy="25" rx="25" ry="18" fill={color} />
        </svg>
      );
  }
};

// Main Game Component
const Index = () => {
  // Independent state for each vehicle
  const [schoolMatchedShapes, setSchoolMatchedShapes] = useState<Record<string, boolean>>({
    wheel1: false,
    wheel2: false,
    window: false,
    driverWindow: false,
    triangle: false,
  });
  
  const [fireMatchedShapes, setFireMatchedShapes] = useState<Record<string, boolean>>({
    wheel1: false,
    wheel2: false,
    window: false,
    driverWindow: false,
    hexagon: false,
  });
  
  const [policeMatchedShapes, setPoliceMatchedShapes] = useState<Record<string, boolean>>({
    wheel1: false,
    wheel2: false,
    window: false,
    driverWindow: false,
    oval: false,
  });
  
  const [icecreamMatchedShapes, setIcecreamMatchedShapes] = useState<Record<string, boolean>>({
    wheel1: false,
    wheel2: false,
    window: false,
    driverWindow: false,
    cloud: false,
  });
  
  const [busAnimating, setBusAnimating] = useState(true);
  const [schoolWaving, setSchoolWaving] = useState(false);
  const [fireWaving, setFireWaving] = useState(false);
  const [policeWaving, setPoliceWaving] = useState(false);
  const [icecreamWaving, setIcecreamWaving] = useState(false);
  const [musicMuted, setMusicMuted] = useState(false);
  const [showSchoolBubble, setShowSchoolBubble] = useState(false);
  const [showFireBubble, setShowFireBubble] = useState(false);
  const [showPoliceBubble, setShowPoliceBubble] = useState(false);
  const [showIcecreamBubble, setShowIcecreamBubble] = useState(false);

  const schoolMatchedCount = Object.values(schoolMatchedShapes).filter(Boolean).length;
  const fireMatchedCount = Object.values(fireMatchedShapes).filter(Boolean).length;
  const policeMatchedCount = Object.values(policeMatchedShapes).filter(Boolean).length;
  const icecreamMatchedCount = Object.values(icecreamMatchedShapes).filter(Boolean).length;

  useEffect(() => {
    // Play engine sound when component mounts
    playEngineSound();
    
    // Start background music
    playBackgroundMusic();
    
    // Play voice instruction after bus animation
    setTimeout(() => {
      setBusAnimating(false);
      playVoiceInstruction();
    }, 3000);

    // Show speech bubbles periodically for each vehicle
    const bubbleIntervals = [
      setInterval(() => {
        setShowSchoolBubble(true);
        setTimeout(() => setShowSchoolBubble(false), 3000);
      }, 8000),
      setInterval(() => {
        setShowFireBubble(true);
        setTimeout(() => setShowFireBubble(false), 3000);
      }, 10000),
      setInterval(() => {
        setShowPoliceBubble(true);
        setTimeout(() => setShowPoliceBubble(false), 3000);
      }, 12000),
      setInterval(() => {
        setShowIcecreamBubble(true);
        setTimeout(() => setShowIcecreamBubble(false), 3000);
      }, 14000),
    ];

    // Cleanup on unmount
    return () => {
      stopBackgroundMusic();
      bubbleIntervals.forEach(interval => clearInterval(interval));
    };
  }, []);

  const handleShapeDrop = (
    vehicleType: 'school' | 'fire' | 'police' | 'icecream',
    zone: string, 
    expectedShape: ShapeType, 
    droppedShape: ShapeType
  ) => {
    if (expectedShape === droppedShape) {
      playCorrectSound();
      
      // Update the correct vehicle state
      switch (vehicleType) {
        case 'school':
          setSchoolMatchedShapes((prev) => ({ ...prev, [zone]: true }));
          setSchoolWaving(true);
          setTimeout(() => setSchoolWaving(false), 600);
          break;
        case 'fire':
          setFireMatchedShapes((prev) => ({ ...prev, [zone]: true }));
          setFireWaving(true);
          setTimeout(() => setFireWaving(false), 600);
          break;
        case 'police':
          setPoliceMatchedShapes((prev) => ({ ...prev, [zone]: true }));
          setPoliceWaving(true);
          setTimeout(() => setPoliceWaving(false), 600);
          break;
        case 'icecream':
          setIcecreamMatchedShapes((prev) => ({ ...prev, [zone]: true }));
          setIcecreamWaving(true);
          setTimeout(() => setIcecreamWaving(false), 600);
          break;
      }
      
      toast.success("Perfect match! 🎉", {
        description: `You found the ${droppedShape}!`,
      });

      // Check if all vehicles are complete
      const newSchoolCount = vehicleType === 'school' && Object.values({...schoolMatchedShapes, [zone]: true}).filter(Boolean).length === Object.keys(schoolMatchedShapes).length;
      const newFireCount = vehicleType === 'fire' && Object.values({...fireMatchedShapes, [zone]: true}).filter(Boolean).length === Object.keys(fireMatchedShapes).length;
      const newPoliceCount = vehicleType === 'police' && Object.values({...policeMatchedShapes, [zone]: true}).filter(Boolean).length === Object.keys(policeMatchedShapes).length;
      const newIcecreamCount = vehicleType === 'icecream' && Object.values({...icecreamMatchedShapes, [zone]: true}).filter(Boolean).length === Object.keys(icecreamMatchedShapes).length;
      
      if (newSchoolCount || newFireCount || newPoliceCount || newIcecreamCount) {
        setTimeout(() => {
          playCelebrationSound();
          fireConfetti();
          toast.success("Vehicle Complete! 🎊", {
            description: `You finished the ${vehicleType} vehicle!`,
            duration: 5000,
          });
        }, 500);
      }
    } else {
      playIncorrectSound();
      toast.error("Try again! 🤔", {
        description: `That's not the right shape for this spot.`,
      });
    }
  };

  const handleReset = () => {
    setSchoolMatchedShapes({
      wheel1: false,
      wheel2: false,
      window: false,
      driverWindow: false,
      triangle: false,
    });
    setFireMatchedShapes({
      wheel1: false,
      wheel2: false,
      window: false,
      driverWindow: false,
      hexagon: false,
    });
    setPoliceMatchedShapes({
      wheel1: false,
      wheel2: false,
      window: false,
      driverWindow: false,
      oval: false,
    });
    setIcecreamMatchedShapes({
      wheel1: false,
      wheel2: false,
      window: false,
      driverWindow: false,
      cloud: false,
    });
    setBusAnimating(true);
    playEngineSound();
    setTimeout(() => {
      setBusAnimating(false);
      playVoiceInstruction();
    }, 3000);
    toast.info("Game reset! 🔄", {
      description: "Try matching all the shapes again!",
    });
  };

  const getUsedShapes = () => {
    const used: Partial<Record<ShapeType, number>> = {};
    // School bus shapes
    if (schoolMatchedShapes.wheel1) used.circle = (used.circle || 0) + 1;
    if (schoolMatchedShapes.wheel2) used.circle = (used.circle || 0) + 1;
    if (schoolMatchedShapes.window) used.rectangle = (used.rectangle || 0) + 1;
    if (schoolMatchedShapes.driverWindow) used.pentagon = (used.pentagon || 0) + 1;
    if (schoolMatchedShapes.triangle) used.triangle = (used.triangle || 0) + 1;
    
    // Fire truck shapes
    if (fireMatchedShapes.wheel1) used.circle = (used.circle || 0) + 1;
    if (fireMatchedShapes.wheel2) used.circle = (used.circle || 0) + 1;
    if (fireMatchedShapes.window) used.rectangle = (used.rectangle || 0) + 1;
    if (fireMatchedShapes.driverWindow) used.pentagon = (used.pentagon || 0) + 1;
    if (fireMatchedShapes.hexagon) used.hexagon = (used.hexagon || 0) + 1;
    
    // Police car shapes
    if (policeMatchedShapes.wheel1) used.circle = (used.circle || 0) + 1;
    if (policeMatchedShapes.wheel2) used.circle = (used.circle || 0) + 1;
    if (policeMatchedShapes.window) used.rectangle = (used.rectangle || 0) + 1;
    if (policeMatchedShapes.driverWindow) used.pentagon = (used.pentagon || 0) + 1;
    if (policeMatchedShapes.oval) used.oval = (used.oval || 0) + 1;
    
    // Ice cream truck shapes
    if (icecreamMatchedShapes.wheel1) used.circle = (used.circle || 0) + 1;
    if (icecreamMatchedShapes.wheel2) used.circle = (used.circle || 0) + 1;
    if (icecreamMatchedShapes.window) used.rectangle = (used.rectangle || 0) + 1;
    if (icecreamMatchedShapes.driverWindow) used.pentagon = (used.pentagon || 0) + 1;
    if (icecreamMatchedShapes.cloud) used.cloud = (used.cloud || 0) + 1;
    
    return used;
  };

  const isShapeUsed = (type: ShapeType): boolean => {
    const used = getUsedShapes();
    const available: Record<ShapeType, number> = {
      circle: 8, // 2 per vehicle × 4 vehicles
      rectangle: 4, // 1 per vehicle × 4 vehicles
      pentagon: 4, // 1 per vehicle × 4 vehicles
      triangle: 1, // Only school bus
      hexagon: 1, // Only fire truck
      oval: 1, // Only police car
      cloud: 1, // Only ice cream truck
    };
    return (used[type] || 0) >= available[type];
  };

  const handleMuteToggle = () => {
    const newMutedState = !musicMuted;
    setMusicMuted(newMutedState);
    toggleMusic(newMutedState);
  };


  const [busTheme, setBusTheme] = useState<BusTheme>("school");
  
  const handleThemeChange = (theme: BusTheme) => {
    setBusTheme(theme);
    playThemeSound(theme);
  };

  const currentTheme = busThemes[busTheme];
  const currentMatchedShapes = busTheme === 'school' ? schoolMatchedShapes : 
                                busTheme === 'fire' ? fireMatchedShapes :
                                busTheme === 'police' ? policeMatchedShapes : icecreamMatchedShapes;
  const currentWaving = busTheme === 'school' ? schoolWaving :
                        busTheme === 'fire' ? fireWaving :
                        busTheme === 'police' ? policeWaving : icecreamWaving;
  const currentBubble = busTheme === 'school' ? showSchoolBubble :
                        busTheme === 'fire' ? showFireBubble :
                        busTheme === 'police' ? showPoliceBubble : showIcecreamBubble;
  const matchedCount = Object.values(currentMatchedShapes).filter(Boolean).length;
  const totalShapes = Object.keys(currentMatchedShapes).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-200 via-blue-100 to-purple-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header with Theme Selector and Mute Button */}
        <div className="text-center space-y-4">
          <div className="flex justify-end mb-2">
            <Button
              onClick={handleMuteToggle}
              size="lg"
              className="bg-white hover:bg-gray-100 text-gray-800 font-fredoka font-bold rounded-full shadow-lg border-4 border-primary"
            >
              {musicMuted ? <VolumeX className="w-6 h-6" /> : <Volume2 className="w-6 h-6" />}
              <span className="ml-2">{musicMuted ? "Unmute" : "Mute"}</span>
            </Button>
          </div>
          
          <h1 className="text-5xl md:text-6xl font-poppins font-black text-transparent bg-clip-text bg-gradient-to-r from-orange-500 via-red-500 to-pink-500 drop-shadow-lg animate-[fade-in_0.6s_ease-out]">
            {currentTheme.icon} Build Your {currentTheme.name}! 🎨
          </h1>
          
          <div className="inline-block bg-gradient-to-r from-yellow-400 to-orange-400 px-10 py-5 rounded-full shadow-[0_10px_30px_-5px_rgba(0,0,0,0.3)] border-4 border-white">
            <p className="text-3xl font-fredoka font-bold text-white drop-shadow-md">
              ⭐ {matchedCount} / {totalShapes} Shapes Found!
            </p>
          </div>
          
          {/* Theme Selector */}
          <div className="flex justify-center gap-4 flex-wrap">
            {(Object.keys(busThemes) as BusTheme[]).map((theme) => (
              <Button
                key={theme}
                onClick={() => handleThemeChange(theme)}
                size="lg"
                className={`font-fredoka font-bold rounded-full shadow-lg border-4 transition-all ${
                  busTheme === theme
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 text-white border-white scale-110"
                    : "bg-white text-gray-800 border-gray-300 hover:scale-105"
                }`}
              >
                <span className="text-2xl mr-2">{busThemes[theme].icon}</span>
                {busThemes[theme].name}
              </Button>
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white/95 rounded-3xl shadow-[0_10px_30px_-5px_rgba(0,0,0,0.2)] p-6 text-center border-4 border-blue-300">
          <p className="text-xl font-fredoka font-semibold text-gray-800">
            🎯 Drag the colorful shapes below to finish building the {currentTheme.name.toLowerCase()}! Find where each shape belongs! {currentTheme.icon}
          </p>
        </div>

        {/* Vehicle Scene */}
        <div className="relative w-full h-[600px] bg-gradient-to-b from-sky-400 via-sky-300 to-green-300 rounded-3xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.3)] overflow-hidden border-4 border-white">
          {/* Sun */}
          <div className="absolute top-10 right-10 w-20 h-20 bg-yellow-300 rounded-full shadow-[0_0_60px_rgba(251,191,36,0.6)]">
            <div className="absolute inset-2 bg-yellow-200 rounded-full" />
          </div>

          {/* Road */}
          <div className="absolute bottom-0 left-0 right-0 h-40 bg-gradient-to-b from-gray-600 to-gray-700">
            <div className="absolute top-1/2 left-0 right-0 h-3 flex justify-around">
              <div className="w-20 h-full bg-yellow-400" />
              <div className="w-20 h-full bg-yellow-400" />
              <div className="w-20 h-full bg-yellow-400" />
              <div className="w-20 h-full bg-yellow-400" />
              <div className="w-20 h-full bg-yellow-400" />
            </div>
          </div>

          {/* Clouds */}
          <div className="absolute top-16 left-24 w-28 h-14 bg-white rounded-full opacity-90 shadow-lg" />
          <div className="absolute top-24 left-20 w-20 h-10 bg-white rounded-full opacity-90" />
          <div className="absolute top-12 right-40 w-36 h-16 bg-white rounded-full opacity-90 shadow-lg" />
          <div className="absolute top-20 right-36 w-24 h-12 bg-white rounded-full opacity-90" />

          {/* Vehicle */}
          <div 
            className={`absolute bottom-40 left-1/2 transition-all duration-[3000ms] ease-out ${
              busAnimating ? '-translate-x-[900px] opacity-0' : '-translate-x-1/2 opacity-100'
            }`}
          >
            {busTheme === "school" && (
              <SchoolBusVehicle
                matchedShapes={schoolMatchedShapes}
                handleShapeDrop={(zone, expected, dropped) => handleShapeDrop('school', zone, expected, dropped)}
                shapeColors={shapeColors}
                renderShape={renderShape}
                isWaving={schoolWaving}
                showBubble={currentBubble}
              />
            )}
            {busTheme === "fire" && (
              <FireTruckVehicle
                matchedShapes={fireMatchedShapes}
                handleShapeDrop={(zone, expected, dropped) => handleShapeDrop('fire', zone, expected, dropped)}
                shapeColors={shapeColors}
                renderShape={renderShape}
                isWaving={fireWaving}
                showBubble={currentBubble}
              />
            )}
            {busTheme === "police" && (
              <PoliceCarVehicle
                matchedShapes={policeMatchedShapes}
                handleShapeDrop={(zone, expected, dropped) => handleShapeDrop('police', zone, expected, dropped)}
                shapeColors={shapeColors}
                renderShape={renderShape}
                isWaving={policeWaving}
                showBubble={currentBubble}
              />
            )}
            {busTheme === "icecream" && (
              <IceCreamTruckVehicle
                matchedShapes={icecreamMatchedShapes}
                handleShapeDrop={(zone, expected, dropped) => handleShapeDrop('icecream', zone, expected, dropped)}
                shapeColors={shapeColors}
                renderShape={renderShape}
                isWaving={icecreamWaving}
                showBubble={currentBubble}
              />
            )}
          </div>

          {/* Birds */}
          <div className="absolute top-32 left-[30%] text-2xl animate-[fade-in_1s_ease-out]">🕊️</div>
          <div className="absolute top-28 left-[35%] text-xl animate-[fade-in_1.2s_ease-out]">🕊️</div>
        </div>

        {/* Draggable Shapes */}
        <div className="bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 rounded-3xl shadow-[0_15px_40px_-10px_rgba(0,0,0,0.4)] p-8 border-4 border-white">
          <h2 className="text-3xl font-fredoka font-bold text-white text-center mb-2 drop-shadow-lg">
            🎨 Drag These Shapes! 🎨
          </h2>
          <p className="text-lg font-fredoka text-white/90 text-center mb-8">
            Grab a shape and drop it where it belongs on the bus!
          </p>
          <div className="flex flex-wrap justify-center gap-10">
            {shapes.map((shape) => (
              <DraggableShape
                key={shape.type}
                type={shape.type}
                label={shape.label}
                isUsed={isShapeUsed(shape.type)}
              />
            ))}
          </div>
        </div>

        {/* Reset Button */}
        <div className="flex justify-center pb-8">
          <Button
            onClick={handleReset}
            size="lg"
            className="bg-gradient-to-r from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600 text-white font-fredoka font-bold text-2xl px-16 py-8 rounded-full shadow-[0_15px_40px_-10px_rgba(0,0,0,0.4)] hover:scale-110 transition-all duration-300 border-4 border-white"
          >
            🔄 Start Over!
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Index;