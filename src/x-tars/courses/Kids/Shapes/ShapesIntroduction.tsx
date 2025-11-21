// // import { useState, useEffect, useCallback, forwardRef } from "react";
// // import { ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react";
// // import { cva, type VariantProps } from "class-variance-authority";
// // import { clsx, type ClassValue } from "clsx";
// // import { twMerge } from "tailwind-merge";

// // // Utility function (inlined from @/lib/utils)
// // function cn(...inputs: ClassValue[]) {
// //   return twMerge(clsx(inputs));
// // }

// // // Button Component (inlined and simplified)
// // const buttonVariants = cva(
// //   "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
// //   {
// //     variants: {
// //       variant: {
// //         default: "bg-primary text-primary-foreground hover:bg-primary/90",
// //         destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
// //         outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
// //         secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
// //         ghost: "hover:bg-accent hover:text-accent-foreground",
// //         link: "text-primary underline-offset-4 hover:underline",
// //       },
// //       size: {
// //         default: "h-10 px-4 py-2",
// //         sm: "h-9 rounded-md px-3",
// //         lg: "h-11 rounded-md px-8",
// //         icon: "h-10 w-10",
// //       },
// //     },
// //     defaultVariants: {
// //       variant: "default",
// //       size: "default",
// //     },
// //   },
// // );

// // interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {}

// // const Button = forwardRef<HTMLButtonElement, ButtonProps>(
// //   ({ className, variant, size, ...props }, ref) => {
// //     return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
// //   },
// // );
// // Button.displayName = "Button";

// // // Shape data
// // interface Shape {
// //   name: string;
// //   object: string;
// //   emoji: string;
// //   text: string;
// //   color: string;
// //   voice: string;
// // }

// // const shapes: Shape[] = [
// //   {
// //     name: "Circle",
// //     object: "Ball",
// //     emoji: "⚽",
// //     text: "A ball is circular!",
// //     color: "text-shape-red",
// //     voice: "Look! A ball is rolling in!"
// //   },
// //   {
// //     name: "Triangle",
// //     object: "Nachos",
// //     emoji: "🔺",
// //     text: "Nachos are like triangles!",
// //     color: "text-shape-yellow",
// //     voice: "Here come some yummy nachos!"
// //   },
// //   {
// //     name: "Oval",
// //     object: "Egg",
// //     emoji: "🥚",
// //     text: "Eggs have oval shapes!",
// //     color: "text-shape-blue",
// //     voice: "An egg is rolling over!"
// //   },
// //   {
// //     name: "Rectangle",
// //     object: "Book",
// //     emoji: "📕",
// //     text: "Books are rectangles!",
// //     color: "text-shape-green",
// //     voice: "Here comes a book!"
// //   },
// //   {
// //     name: "Square",
// //     object: "Gift Box",
// //     emoji: "🎁",
// //     text: "Gift boxes are squares!",
// //     color: "text-shape-purple",
// //     voice: "Look at this beautiful gift box!"
// //   },
// //   {
// //     name: "Star",
// //     object: "Star",
// //     emoji: "⭐",
// //     text: "Stars have pointy shapes!",
// //     color: "text-shape-yellow",
// //     voice: "A shining star appears!"
// //   },
// //   {
// //     name: "Heart",
// //     object: "Heart",
// //     emoji: "❤️",
// //     text: "Hearts have a special shape!",
// //     color: "text-shape-pink",
// //     voice: "Here's a lovely heart!"
// //   },
// //   {
// //     name: "Diamond",
// //     object: "Kite",
// //     emoji: "🪁",
// //     text: "Kites are diamond-shaped!",
// //     color: "text-shape-cyan",
// //     voice: "A kite is flying in!"
// //   },
// //   {
// //     name: "Hexagon",
// //     object: "Honeycomb",
// //     emoji: "🍯",
// //     text: "Honeycombs are hexagons!",
// //     color: "text-shape-amber",
// //     voice: "Look at this honeycomb!"
// //   },
// //   {
// //     name: "Crescent",
// //     object: "Moon",
// //     emoji: "🌙",
// //     text: "The moon can be a crescent!",
// //     color: "text-shape-indigo",
// //     voice: "The moon is here!"
// //   }
// // ];

// // // Helper function to get color value
// // const getColorValue = (colorClass: string): string => {
// //   const colorMap: Record<string, string> = {
// //     'text-shape-red': 'hsl(var(--shape-red))',
// //     'text-shape-orange': 'hsl(var(--shape-orange))',
// //     'text-shape-yellow': 'hsl(var(--shape-yellow))',
// //     'text-shape-green': 'hsl(var(--shape-green))',
// //     'text-shape-blue': 'hsl(var(--shape-blue))',
// //     'text-shape-purple': 'hsl(var(--shape-purple))',
// //     'text-shape-pink': 'hsl(var(--shape-pink))',
// //     'text-shape-cyan': 'hsl(var(--shape-cyan))',
// //     'text-shape-amber': 'hsl(var(--shape-amber))',
// //     'text-shape-indigo': 'hsl(var(--shape-indigo))',
// //   };
// //   return colorMap[colorClass] || 'hsl(var(--shape-blue))';
// // };

// // // Shape Renderer Component
// // const ShapeRenderer = ({ shapeName, color }: { shapeName: string; color: string }) => {
// //   const colorValue = getColorValue(color);

// //   switch (shapeName) {
// //     case "Circle":
// //       return (
// //         <div 
// //           className="w-32 h-32 rounded-full shadow-lg" 
// //           style={{ backgroundColor: colorValue }}
// //         />
// //       );
    
// //     case "Triangle":
// //       return (
// //         <div className="relative w-32 h-32 flex items-center justify-center">
// //           <svg width="128" height="128" viewBox="0 0 128 128">
// //             <polygon 
// //               points="64,10 120,110 8,110" 
// //               fill={colorValue}
// //               className="drop-shadow-lg"
// //             />
// //           </svg>
// //         </div>
// //       );
    
// //     case "Oval":
// //       return (
// //         <div 
// //           className="w-40 h-28 rounded-full shadow-lg" 
// //           style={{ backgroundColor: colorValue }}
// //         />
// //       );
    
// //     case "Rectangle":
// //       return (
// //         <div 
// //           className="w-40 h-24 rounded-lg shadow-lg" 
// //           style={{ backgroundColor: colorValue }}
// //         />
// //       );
    
// //     case "Square":
// //       return (
// //         <div 
// //           className="w-32 h-32 rounded-lg shadow-lg" 
// //           style={{ backgroundColor: colorValue }}
// //         />
// //       );
    
// //     case "Star":
// //       return <div className="text-8xl drop-shadow-lg">⭐</div>;
    
// //     case "Heart":
// //       return <div className="text-8xl drop-shadow-lg">❤️</div>;
    
// //     case "Diamond":
// //       return (
// //         <div 
// //           className="w-28 h-28 rotate-45 rounded-md shadow-lg" 
// //           style={{ backgroundColor: colorValue }}
// //         />
// //       );
    
// //     case "Hexagon":
// //       return (
// //         <div className="relative w-28 h-32">
// //           <svg width="112" height="128" viewBox="0 0 112 128">
// //             <polygon 
// //               points="28,0 84,0 112,64 84,128 28,128 0,64" 
// //               fill={colorValue}
// //               className="drop-shadow-lg"
// //             />
// //           </svg>
// //         </div>
// //       );
    
// //     case "Crescent":
// //       return <div className="text-8xl drop-shadow-lg">🌙</div>;
    
// //     default:
// //       return null;
// //   }
// // };

// // // Object Display Component
// // const ObjectDisplay = ({ 
// //   emoji, 
// //   text, 
// //   isRolling, 
// //   showText
// // }: { 
// //   emoji: string; 
// //   text: string; 
// //   isRolling: boolean; 
// //   showText: boolean;
// // }) => {
// //   return (
// //     <div className="flex flex-col items-center justify-center h-96">
// //       <div 
// //         className={`text-9xl transition-all duration-700 ${
// //           isRolling ? 'animate-roll-in' : ''
// //         }`}
// //       >
// //         {emoji}
// //       </div>
      
// //       {showText && (
// //         <div className="mt-8 animate-fade-in-scale">
// //           <p className="text-3xl font-bold text-card-foreground text-center px-6 py-3 rounded-2xl bg-secondary/80 backdrop-blur-sm animate-pulse-slow shadow-lg">
// //             {text}
// //           </p>
// //         </div>
// //       )}
// //     </div>
// //   );
// // };

// // // Shape Display Component
// // const ShapeDisplay = ({ 
// //   shapeName, 
// //   color, 
// //   showDrawing 
// // }: { 
// //   shapeName: string; 
// //   color: string; 
// //   showDrawing: boolean;
// // }) => {
// //   if (!showDrawing) return null;

// //   return (
// //     <div className="flex flex-col items-center justify-center h-96">
// //       <div className="animate-fade-in-scale flex flex-col items-center gap-6">
// //         <div className="transform transition-all duration-500 hover:scale-105 cursor-pointer">
// //           <ShapeRenderer shapeName={shapeName} color={color} />
// //         </div>
// //         <p className="text-5xl font-bold text-primary bg-primary/10 px-6 py-3 rounded-2xl">
// //           {shapeName}
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // // Progress Indicator Component
// // const ProgressIndicator = ({ total, current }: { total: number; current: number }) => {
// //   return (
// //     <div className="flex gap-2">
// //       {Array.from({ length: total }).map((_, idx) => (
// //         <div
// //           key={idx}
// //           className={`h-3 rounded-full transition-all duration-300 ${
// //             idx === current 
// //               ? 'bg-primary w-10 shadow-lg shadow-primary/50' 
// //               : 'bg-muted w-3'
// //           }`}
// //         />
// //       ))}
// //     </div>
// //   );
// // };

// // // Navigation Controls Component
// // const NavigationControls = ({
// //   onPrevious,
// //   onNext,
// //   canGoPrevious,
// //   canGoNext,
// //   currentIndex,
// //   total,
// // }: {
// //   onPrevious: () => void;
// //   onNext: () => void;
// //   canGoPrevious: boolean;
// //   canGoNext: boolean;
// //   currentIndex: number;
// //   total: number;
// // }) => {
// //   return (
// //     <div className="flex flex-col items-center gap-6">
// //       <div className="flex justify-center gap-6">
// //         <Button
// //           onClick={onPrevious}
// //           disabled={!canGoPrevious}
// //           size="lg"
// //           className="gap-2 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
// //         >
// //           <ChevronLeft className="w-6 h-6" />
// //           Previous
// //         </Button>
        
// //         <Button
// //           onClick={onNext}
// //           disabled={!canGoNext}
// //           size="lg"
// //           className="gap-2 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
// //         >
// //           Next
// //           <ChevronRight className="w-6 h-6" />
// //         </Button>
// //       </div>
      
// //       <div className="text-center space-y-2">
// //         <p className="text-lg text-muted-foreground font-medium">
// //           Shape {currentIndex + 1} of {total}
// //         </p>
// //         <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
// //           <span className="text-xl">🔊</span>
// //           Sound is on! Waits 5 seconds after explanation
// //         </p>
// //       </div>
// //     </div>
// //   );
// // };

// // // Main Component
// // const Index = () => {
// //   const [currentShape, setCurrentShape] = useState(0);
// //   const [isRolling, setIsRolling] = useState(false);
// //   const [showText, setShowText] = useState(false);
// //   const [showDrawing, setShowDrawing] = useState(false);
// //   const [isDarkMode, setIsDarkMode] = useState(false);

// //   // Apply dark mode class to document with smooth transition
// //   useEffect(() => {
// //     // Add transition class
// //     document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
// //     if (isDarkMode) {
// //       document.documentElement.classList.add('dark');
// //     } else {
// //       document.documentElement.classList.remove('dark');
// //     }
// //   }, [isDarkMode]);

// //   // Toggle theme with sound effect
// //   const toggleTheme = () => {
// //     // Play click sound
// //     const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
// //     audio.volume = 0.3;
// //     audio.play().catch(() => {});
    
// //     setIsDarkMode(!isDarkMode);
// //   };

// //   const speak = useCallback((text: string) => {
// //     if ('speechSynthesis' in window) {
// //       window.speechSynthesis.cancel();
// //       const utterance = new SpeechSynthesisUtterance(text);
// //       utterance.rate = 0.9;
// //       utterance.pitch = 1.2;
// //       utterance.volume = 1;
// //       window.speechSynthesis.speak(utterance);
// //     }
// //   }, []);

// //   // Background music
// //   useEffect(() => {
// //     const audio = new Audio('https://assets.mixkit.co/music/preview/mixkit-happy-fun-8-4854.mp3');
// //     audio.loop = true;
// //     audio.volume = 0.3;
    
// //     const playAudio = () => {
// //       audio.play().catch(() => {
// //         // Auto-play blocked, user needs to interact
// //       });
// //     };
    
// //     playAudio();
    
// //     return () => {
// //       audio.pause();
// //       audio.src = '';
// //     };
// //   }, []);

// //   useEffect(() => {
// //     startAnimation();
// //   }, [currentShape]);

// //   const startAnimation = () => {
// //     // Reset states
// //     setIsRolling(true);
// //     setShowText(false);
// //     setShowDrawing(false);

// //     // Play voice for object
// //     speak(shapes[currentShape].voice);

// //     // Step 1: Show rolling animation (2.5 seconds)
// //     setTimeout(() => {
// //       setIsRolling(false);
      
// //       // Step 2: Show text explanation (1 second delay)
// //       setTimeout(() => {
// //         setShowText(true);
// //         speak(shapes[currentShape].text);
        
// //         // Step 3: Show shape drawing (1.2 seconds after text)
// //         setTimeout(() => {
// //           setShowDrawing(true);
          
// //           // Step 4: Wait 5 seconds before auto-advancing
// //           setTimeout(() => {
// //             if (currentShape < shapes.length - 1) {
// //               setCurrentShape(currentShape + 1);
// //             }
// //           }, 5000);
// //         }, 1200);
// //       }, 1000);
// //     }, 2500);
// //   };

// //   const nextShape = () => {
// //     if (currentShape < shapes.length - 1) {
// //       setCurrentShape(currentShape + 1);
// //     }
// //   };

// //   const prevShape = () => {
// //     if (currentShape > 0) {
// //       setCurrentShape(currentShape - 1);
// //     }
// //   };

// //   const current = shapes[currentShape];

// //   return (
// //     <div 
// //       className="min-h-screen p-4 md:p-8"
// //       style={{
// //         background: `linear-gradient(135deg, 
// //           hsl(var(--learning-bg-start)) 0%, 
// //           hsl(var(--learning-bg-mid)) 50%, 
// //           hsl(var(--learning-bg-end)) 100%)`
// //       }}
// //     >
// //       <div className="max-w-7xl mx-auto">
// //         <header className="text-center mb-8 md:mb-12 relative">
// //           <Button
// //             onClick={toggleTheme}
// //             variant="outline"
// //             size="icon"
// //             className="absolute right-0 top-0 rounded-full transition-transform hover:rotate-12"
// //           >
// //             {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
// //           </Button>
          
// //           <h1 className="text-4xl md:text-6xl font-bold text-primary mb-2 animate-fade-in-scale">
// //             Let's Learn Shapes! 🎨
// //           </h1>
// //           <p className="text-lg md:text-xl text-muted-foreground">
// //             Discover shapes through fun objects!
// //           </p>
// //         </header>

// //         <main className="bg-card rounded-3xl shadow-2xl p-6 md:p-12 min-h-[500px] relative overflow-hidden mb-8">
// //           <div className="grid md:grid-cols-2 gap-8 items-center">
// //             <ObjectDisplay
// //               emoji={current.emoji}
// //               text={current.text}
// //               isRolling={isRolling}
// //               showText={showText}
// //             />

// //             <ShapeDisplay
// //               shapeName={current.name}
// //               color={current.color}
// //               showDrawing={showDrawing}
// //             />
// //           </div>

// //           <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
// //             <ProgressIndicator total={shapes.length} current={currentShape} />
// //           </div>
// //         </main>

// //         <NavigationControls
// //           onPrevious={prevShape}
// //           onNext={nextShape}
// //           canGoPrevious={currentShape > 0}
// //           canGoNext={currentShape < shapes.length - 1}
// //           currentIndex={currentShape}
// //           total={shapes.length}
// //         />
// //       </div>
// //     </div>
// //   );
// // };

// // export default Index;

// import { useState, useEffect, useCallback, forwardRef } from "react";
// import { ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react";
// import { cva, type VariantProps } from "class-variance-authority";
// import { clsx, type ClassValue } from "clsx";
// import { twMerge } from "tailwind-merge";

// // Utility function (inlined from @/lib/utils)
// function cn(...inputs) {
//   return twMerge(clsx(inputs));
// }

// // Button Component (inlined and simplified)
// const buttonVariants = cva(
//   "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
//   {
//     variants: {
//       variant: {
//         default: "bg-primary text-primary-foreground hover:bg-primary/90",
//         destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90",
//         outline: "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
//         secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80",
//         ghost: "hover:bg-accent hover:text-accent-foreground",
//         link: "text-primary underline-offset-4 hover:underline",
//       },
//       size: {
//         default: "h-10 px-4 py-2",
//         sm: "h-9 rounded-md px-3",
//         lg: "h-11 rounded-md px-8",
//         icon: "h-10 w-10",
//       },
//     },
//     defaultVariants: {
//       variant: "default",
//       size: "default",
//     },
//   },
// );

// const Button = forwardRef(({ className, variant, size, ...props }, ref) => {
//   return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
// });
// Button.displayName = "Button";

// // Shape data
// const shapes = [
//   {
//     name: "Circle",
//     object: "Ball",
//     emoji: "⚽",
//     text: "A ball is circular!",
//     color: "text-shape-red",
//     voice: "Look! A ball is rolling in!"
//   },
//   {
//     name: "Triangle",
//     object: "Nachos",
//     emoji: "🔺",
//     text: "Nachos are like triangles!",
//     color: "text-shape-yellow",
//     voice: "Here come some yummy nachos!"
//   },
//   {
//     name: "Oval",
//     object: "Egg",
//     emoji: "🥚",
//     text: "Eggs have oval shapes!",
//     color: "text-shape-blue",
//     voice: "An egg is rolling over!"
//   },
//   {
//     name: "Rectangle",
//     object: "Book",
//     emoji: "📕",
//     text: "Books are rectangles!",
//     color: "text-shape-green",
//     voice: "Here comes a book!"
//   },
//   {
//     name: "Square",
//     object: "Gift Box",
//     emoji: "🎁",
//     text: "Gift boxes are squares!",
//     color: "text-shape-purple",
//     voice: "Look at this beautiful gift box!"
//   },
//   {
//     name: "Star",
//     object: "Star",
//     emoji: "⭐",
//     text: "Stars have pointy shapes!",
//     color: "text-shape-yellow",
//     voice: "A shining star appears!"
//   },
//   {
//     name: "Heart",
//     object: "Heart",
//     emoji: "❤️",
//     text: "Hearts have a special shape!",
//     color: "text-shape-pink",
//     voice: "Here's a lovely heart!"
//   },
//   {
//     name: "Diamond",
//     object: "Kite",
//     emoji: "🪁",
//     text: "Kites are diamond-shaped!",
//     color: "text-shape-cyan",
//     voice: "A kite is flying in!"
//   },
//   {
//     name: "Hexagon",
//     object: "Honeycomb",
//     emoji: "🍯",
//     text: "Honeycombs are hexagons!",
//     color: "text-shape-amber",
//     voice: "Look at this honeycomb!"
//   },
//   {
//     name: "Crescent",
//     object: "Moon",
//     emoji: "🌙",
//     text: "The moon can be a crescent!",
//     color: "text-shape-indigo",
//     voice: "The moon is here!"
//   }
// ];

// // Helper function to get color value
// const getColorValue = (colorClass) => {
//   const colorMap = {
//     'text-shape-red': 'hsl(var(--shape-red))',
//     'text-shape-orange': 'hsl(var(--shape-orange))',
//     'text-shape-yellow': 'hsl(var(--shape-yellow))',
//     'text-shape-green': 'hsl(var(--shape-green))',
//     'text-shape-blue': 'hsl(var(--shape-blue))',
//     'text-shape-purple': 'hsl(var(--shape-purple))',
//     'text-shape-pink': 'hsl(var(--shape-pink))',
//     'text-shape-cyan': 'hsl(var(--shape-cyan))',
//     'text-shape-amber': 'hsl(var(--shape-amber))',
//     'text-shape-indigo': 'hsl(var(--shape-indigo))',
//   };
//   return colorMap[colorClass] || 'hsl(var(--shape-blue))';
// };

// // Shape Renderer Component
// const ShapeRenderer = ({ shapeName, color }) => {
//   const colorValue = getColorValue(color);

//   switch (shapeName) {
//     case "Circle":
//       return (
//         <div 
//           className="w-32 h-32 rounded-full shadow-lg" 
//           style={{ backgroundColor: colorValue }}
//         />
//       );
    
//     case "Triangle":
//       return (
//         <div className="relative w-32 h-32 flex items-center justify-center">
//           <svg width="128" height="128" viewBox="0 0 128 128">
//             <polygon 
//               points="64,10 120,110 8,110" 
//               fill={colorValue}
//               className="drop-shadow-lg"
//             />
//           </svg>
//         </div>
//       );
    
//     case "Oval":
//       return (
//         <div 
//           className="w-40 h-28 rounded-full shadow-lg" 
//           style={{ backgroundColor: colorValue }}
//         />
//       );
    
//     case "Rectangle":
//       return (
//         <div 
//           className="w-40 h-24 rounded-lg shadow-lg" 
//           style={{ backgroundColor: colorValue }}
//         />
//       );
    
//     case "Square":
//       return (
//         <div 
//           className="w-32 h-32 rounded-lg shadow-lg" 
//           style={{ backgroundColor: colorValue }}
//         />
//       );
    
//     case "Star":
//       return <div className="text-8xl drop-shadow-lg">⭐</div>;
    
//     case "Heart":
//       return <div className="text-8xl drop-shadow-lg">❤️</div>;
    
//     case "Diamond":
//       return (
//         <div 
//           className="w-28 h-28 rotate-45 rounded-md shadow-lg" 
//           style={{ backgroundColor: colorValue }}
//         />
//       );
    
//     case "Hexagon":
//       return (
//         <div className="relative w-28 h-32">
//           <svg width="112" height="128" viewBox="0 0 112 128">
//             <polygon 
//               points="28,0 84,0 112,64 84,128 28,128 0,64" 
//               fill={colorValue}
//               className="drop-shadow-lg"
//             />
//           </svg>
//         </div>
//       );
    
//     case "Crescent":
//       return <div className="text-8xl drop-shadow-lg">🌙</div>;
    
//     default:
//       return null;
//   }
// };

// // Object Display Component
// const ObjectDisplay = ({ emoji, text, isRolling, showText }) => {
//   return (
//     <div className="flex flex-col items-center justify-center h-96">
//       <div 
//         className={`text-9xl transition-all duration-700 ${
//           isRolling ? 'animate-roll-in' : ''
//         }`}
//       >
//         {emoji}
//       </div>
      
//       {showText && (
//         <div className="mt-8 animate-fade-in-scale">
//           <p className="text-3xl font-bold text-card-foreground text-center px-6 py-3 rounded-2xl bg-secondary/80 backdrop-blur-sm animate-pulse-slow shadow-lg">
//             {text}
//           </p>
//         </div>
//       )}
//     </div>
//   );
// };

// // Shape Display Component
// const ShapeDisplay = ({ shapeName, color, showDrawing }) => {
//   if (!showDrawing) return null;

//   return (
//     <div className="flex flex-col items-center justify-center h-96">
//       <div className="animate-fade-in-scale flex flex-col items-center gap-6">
//         <div className="transform transition-all duration-500 hover:scale-105 cursor-pointer">
//           <ShapeRenderer shapeName={shapeName} color={color} />
//         </div>
//         <p className="text-5xl font-bold text-primary bg-primary/10 px-6 py-3 rounded-2xl">
//           {shapeName}
//         </p>
//       </div>
//     </div>
//   );
// };

// // Progress Indicator Component
// const ProgressIndicator = ({ total, current }) => {
//   return (
//     <div className="flex gap-2">
//       {Array.from({ length: total }).map((_, idx) => (
//         <div
//           key={idx}
//           className={`h-3 rounded-full transition-all duration-300 ${
//             idx === current 
//               ? 'bg-primary w-10 shadow-lg shadow-primary/50' 
//               : 'bg-muted w-3'
//           }`}
//         />
//       ))}
//     </div>
//   );
// };

// // Navigation Controls Component
// const NavigationControls = ({
//   onPrevious,
//   onNext,
//   canGoPrevious,
//   canGoNext,
//   currentIndex,
//   total,
// }) => {
//   return (
//     <div className="flex flex-col items-center gap-6">
//       <div className="flex justify-center gap-6">
//         <Button
//           onClick={onPrevious}
//           disabled={!canGoPrevious}
//           size="lg"
//           className="gap-2 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
//         >
//           <ChevronLeft className="w-6 h-6" />
//           Previous
//         </Button>
        
//         <Button
//           onClick={onNext}
//           disabled={!canGoNext}
//           size="lg"
//           className="gap-2 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
//         >
//           Next
//           <ChevronRight className="w-6 h-6" />
//         </Button>
//       </div>
      
//       <div className="text-center space-y-2">
//         <p className="text-lg text-muted-foreground font-medium">
//           Shape {currentIndex + 1} of {total}
//         </p>
//         <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
//           <span className="text-xl">🔊</span>
//           Sound is on! Waits 5 seconds after explanation
//         </p>
//       </div>
//     </div>
//   );
// };

// // Main Component
// const Index = () => {
//   const [currentShape, setCurrentShape] = useState(0);
//   const [isRolling, setIsRolling] = useState(false);
//   const [showText, setShowText] = useState(false);
//   const [showDrawing, setShowDrawing] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [isAdvancing, setIsAdvancing] = useState(false);

//   // Apply dark mode class to document with smooth transition
//   useEffect(() => {
//     document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
//     if (isDarkMode) {
//       document.documentElement.classList.add('dark');
//     } else {
//       document.documentElement.classList.remove('dark');
//     }
//   }, [isDarkMode]);

//   // Toggle theme with sound effect
//   const toggleTheme = () => {
//     const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
//     audio.volume = 0.3;
//     audio.play().catch(() => {});
    
//     setIsDarkMode(!isDarkMode);
//   };

//   const speak = useCallback((text) => {
//     if ('speechSynthesis' in window) {
//       window.speechSynthesis.cancel();
//       const utterance = new SpeechSynthesisUtterance(text);
//       utterance.rate = 0.9;
//       utterance.pitch = 1.2;
//       utterance.volume = 1;
//       window.speechSynthesis.speak(utterance);
//     }
//   }, []);

//   // Background music
//   useEffect(() => {
//     const audio = new Audio('https://assets.mixkit.co/music/preview/mixkit-happy-fun-8-4854.mp3');
//     audio.loop = true;
//     audio.volume = 0.3;
    
//     const playAudio = () => {
//       audio.play().catch(() => {});
//     };
    
//     playAudio();
    
//     return () => {
//       audio.pause();
//       audio.src = '';
//     };
//   }, []);

//   useEffect(() => {
//     if (isAdvancing) return;
//     startAnimation();
//   }, [currentShape]);

//   const startAnimation = () => {
//     setIsRolling(true);
//     setShowText(false);
//     setShowDrawing(false);

//     speak(shapes[currentShape].voice);

//     const timer1 = setTimeout(() => {
//       setIsRolling(false);
      
//       const timer2 = setTimeout(() => {
//         setShowText(true);
//         speak(shapes[currentShape].text);
        
//         const timer3 = setTimeout(() => {
//           setShowDrawing(true);
//           speak(`This is a ${shapes[currentShape].name}!`);
          
//           const timer4 = setTimeout(() => {
//             if (currentShape < shapes.length - 1) {
//               setIsAdvancing(true);
//               setCurrentShape(prev => prev + 1);
//               setTimeout(() => setIsAdvancing(false), 100);
//             }
//           }, 5000);
          
//           return () => clearTimeout(timer4);
//         }, 1500);
        
//         return () => clearTimeout(timer3);
//       }, 1000);
      
//       return () => clearTimeout(timer2);
//     }, 2500);
    
//     return () => clearTimeout(timer1);
//   };

//   const nextShape = () => {
//     if (currentShape < shapes.length - 1) {
//       setCurrentShape(currentShape + 1);
//     }
//   };

//   const prevShape = () => {
//     if (currentShape > 0) {
//       setCurrentShape(currentShape - 1);
//     }
//   };

//   const current = shapes[currentShape];

//   return (
//     <>
//       <style>{`
//         :root {
//           --shape-red: 0 84% 60%;
//           --shape-orange: 25 95% 53%;
//           --shape-yellow: 48 96% 53%;
//           --shape-green: 142 71% 45%;
//           --shape-blue: 217 91% 60%;
//           --shape-purple: 262 83% 58%;
//           --shape-pink: 330 81% 60%;
//           --shape-cyan: 189 94% 43%;
//           --shape-amber: 38 92% 50%;
//           --shape-indigo: 243 75% 59%;
          
//           --learning-bg-start: 210 100% 97%;
//           --learning-bg-mid: 200 100% 95%;
//           --learning-bg-end: 190 100% 97%;
          
//           --background: 0 0% 100%;
//           --foreground: 222.2 84% 4.9%;
//           --card: 0 0% 100%;
//           --card-foreground: 222.2 84% 4.9%;
//           --primary: 221.2 83.2% 53.3%;
//           --primary-foreground: 210 40% 98%;
//           --secondary: 210 40% 96.1%;
//           --secondary-foreground: 222.2 47.4% 11.2%;
//           --muted: 210 40% 96.1%;
//           --muted-foreground: 215.4 16.3% 46.9%;
//           --accent: 210 40% 96.1%;
//           --accent-foreground: 222.2 47.4% 11.2%;
//           --border: 214.3 31.8% 91.4%;
//           --input: 214.3 31.8% 91.4%;
//           --ring: 221.2 83.2% 53.3%;
//         }
        
//         .dark {
//           --learning-bg-start: 222 47% 11%;
//           --learning-bg-mid: 217 33% 17%;
//           --learning-bg-end: 222 47% 11%;
          
//           --background: 222.2 84% 4.9%;
//           --foreground: 210 40% 98%;
//           --card: 222.2 84% 4.9%;
//           --card-foreground: 210 40% 98%;
//           --primary: 217.2 91.2% 59.8%;
//           --primary-foreground: 222.2 47.4% 11.2%;
//           --secondary: 217.2 32.6% 17.5%;
//           --secondary-foreground: 210 40% 98%;
//           --muted: 217.2 32.6% 17.5%;
//           --muted-foreground: 215 20.2% 65.1%;
//           --accent: 217.2 32.6% 17.5%;
//           --accent-foreground: 210 40% 98%;
//           --border: 217.2 32.6% 17.5%;
//           --input: 217.2 32.6% 17.5%;
//           --ring: 224.3 76.3% 48%;
//         }
        
//         @keyframes roll-in {
//           0% {
//             transform: translateX(-200%) rotate(0deg);
//             opacity: 0;
//           }
//           50% {
//             opacity: 1;
//           }
//           100% {
//             transform: translateX(0) rotate(360deg);
//             opacity: 1;
//           }
//         }
        
//         @keyframes fade-in-scale {
//           0% {
//             opacity: 0;
//             transform: scale(0.8);
//           }
//           100% {
//             opacity: 1;
//             transform: scale(1);
//           }
//         }
        
//         @keyframes pulse-slow {
//           0%, 100% {
//             transform: scale(1);
//           }
//           50% {
//             transform: scale(1.05);
//           }
//         }
        
//         .animate-roll-in {
//           animation: roll-in 2.5s cubic-bezier(0.34, 1.56, 0.64, 1);
//         }
        
//         .animate-fade-in-scale {
//           animation: fade-in-scale 0.6s ease-out forwards;
//         }
        
//         .animate-pulse-slow {
//           animation: pulse-slow 2s ease-in-out infinite;
//         }
        
//         * {
//           transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
//         }
//       `}</style>
//       <div 
//         className="min-h-screen p-4 md:p-8"
//         style={{
//           background: `linear-gradient(135deg, 
//             hsl(var(--learning-bg-start)) 0%, 
//             hsl(var(--learning-bg-mid)) 50%, 
//             hsl(var(--learning-bg-end)) 100%)`
//         }}
//       >
//         <div className="max-w-7xl mx-auto">
//           <header className="text-center mb-8 md:mb-12 relative">
//             <Button
//               onClick={toggleTheme}
//               variant="outline"
//               size="icon"
//               className="absolute right-0 top-0 rounded-full transition-transform hover:rotate-12"
//             >
//               {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
//             </Button>
            
//             <h1 className="text-4xl md:text-6xl font-bold text-primary mb-2 animate-fade-in-scale">
//               Let's Learn Shapes! 🎨
//             </h1>
//             <p className="text-lg md:text-xl text-muted-foreground">
//               Discover shapes through fun objects!
//             </p>
//           </header>

//           <main className="bg-card rounded-3xl shadow-2xl p-6 md:p-12 min-h-[500px] relative overflow-hidden mb-8">
//             <div className="grid md:grid-cols-2 gap-8 items-center">
//               <ObjectDisplay
//                 emoji={current.emoji}
//                 text={current.text}
//                 isRolling={isRolling}
//                 showText={showText}
//               />

//               <ShapeDisplay
//                 shapeName={current.name}
//                 color={current.color}
//                 showDrawing={showDrawing}
//               />
//             </div>

//             <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
//               <ProgressIndicator total={shapes.length} current={currentShape} />
//             </div>
//           </main>

//           <NavigationControls
//             onPrevious={prevShape}
//             onNext={nextShape}
//             canGoPrevious={currentShape > 0}
//             canGoNext={currentShape < shapes.length - 1}
//             currentIndex={currentShape}
//             total={shapes.length}
//           />
//         </div>
//       </div>
//     </>
//   );
// };

// export default Index;

import { useState, useEffect, useCallback, forwardRef } from "react";
import * as React from "react";
import { ChevronLeft, ChevronRight, Sun, Moon } from "lucide-react";
import { cva, type VariantProps } from "class-variance-authority";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// Utility function (inlined from @/lib/utils)
function cn(...inputs) {
  return twMerge(clsx(inputs));
}

// Button Component (inlined and simplified)
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

const Button = forwardRef(({ className, variant, size, ...props }, ref) => {
  return <button className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
});
Button.displayName = "Button";

// Shape data
const shapes = [
  {
    name: "Circle",
    object: "Ball",
    emoji: "⚽",
    text: "A ball is circular!",
    color: "text-shape-red",
    voice: "Look! A ball is rolling in!"
  },
  {
    name: "Triangle",
    object: "Nachos",
    emoji: "🔺",
    text: "Nachos are like triangles!",
    color: "text-shape-yellow",
    voice: "Here come some yummy nachos!"
  },
  {
    name: "Oval",
    object: "Egg",
    emoji: "🥚",
    text: "Eggs have oval shapes!",
    color: "text-shape-blue",
    voice: "An egg is rolling over!"
  },
  {
    name: "Rectangle",
    object: "Book",
    emoji: "📕",
    text: "Books are rectangles!",
    color: "text-shape-green",
    voice: "Here comes a book!"
  },
  {
    name: "Square",
    object: "Gift Box",
    emoji: "🎁",
    text: "Gift boxes are squares!",
    color: "text-shape-purple",
    voice: "Look at this beautiful gift box!"
  },
  {
    name: "Star",
    object: "Star",
    emoji: "⭐",
    text: "Stars have pointy shapes!",
    color: "text-shape-yellow",
    voice: "A shining star appears!"
  },
  {
    name: "Heart",
    object: "Heart",
    emoji: "❤️",
    text: "Hearts have a special shape!",
    color: "text-shape-pink",
    voice: "Here's a lovely heart!"
  },
  {
    name: "Diamond",
    object: "Kite",
    emoji: "🪁",
    text: "Kites are diamond-shaped!",
    color: "text-shape-cyan",
    voice: "A kite is flying in!"
  },
  {
    name: "Hexagon",
    object: "Honeycomb",
    emoji: "🍯",
    text: "Honeycombs are hexagons!",
    color: "text-shape-amber",
    voice: "Look at this honeycomb!"
  },
  {
    name: "Crescent",
    object: "Moon",
    emoji: "🌙",
    text: "The moon can be a crescent!",
    color: "text-shape-indigo",
    voice: "The moon is here!"
  }
];

// Helper function to get color value
const getColorValue = (colorClass) => {
  const colorMap = {
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

// Shape Renderer Component
const ShapeRenderer = ({ shapeName, color }) => {
  const colorValue = getColorValue(color);

  switch (shapeName) {
    case "Circle":
      return (
        <div 
          className="w-32 h-32 rounded-full shadow-lg" 
          style={{ backgroundColor: colorValue }}
        />
      );
    
    case "Triangle":
      return (
        <div className="relative w-32 h-32 flex items-center justify-center">
          <svg width="128" height="128" viewBox="0 0 128 128">
            <polygon 
              points="64,10 120,110 8,110" 
              fill={colorValue}
              className="drop-shadow-lg"
            />
          </svg>
        </div>
      );
    
    case "Oval":
      return (
        <div 
          className="w-40 h-28 rounded-full shadow-lg" 
          style={{ backgroundColor: colorValue }}
        />
      );
    
    case "Rectangle":
      return (
        <div 
          className="w-40 h-24 rounded-lg shadow-lg" 
          style={{ backgroundColor: colorValue }}
        />
      );
    
    case "Square":
      return (
        <div 
          className="w-32 h-32 rounded-lg shadow-lg" 
          style={{ backgroundColor: colorValue }}
        />
      );
    
    case "Star":
      return <div className="text-8xl drop-shadow-lg">⭐</div>;
    
    case "Heart":
      return <div className="text-8xl drop-shadow-lg">❤️</div>;
    
    case "Diamond":
      return (
        <div 
          className="w-28 h-28 rotate-45 rounded-md shadow-lg" 
          style={{ backgroundColor: colorValue }}
        />
      );
    
    case "Hexagon":
      return (
        <div className="relative w-28 h-32">
          <svg width="112" height="128" viewBox="0 0 112 128">
            <polygon 
              points="28,0 84,0 112,64 84,128 28,128 0,64" 
              fill={colorValue}
              className="drop-shadow-lg"
            />
          </svg>
        </div>
      );
    
    case "Crescent":
      return <div className="text-8xl drop-shadow-lg">🌙</div>;
    
    default:
      return null;
  }
};

// Object Display Component
const ObjectDisplay = ({ emoji, text, isRolling, showText }) => {
  return (
    <div className="flex flex-col items-center justify-center h-96">
      <div 
        className={`text-9xl transition-all duration-700 ${
          isRolling ? 'animate-roll-in' : ''
        }`}
      >
        {emoji}
      </div>
      
      {showText && (
        <div className="mt-8 animate-fade-in-scale">
          <p className="text-3xl font-bold text-card-foreground text-center px-6 py-3 rounded-2xl bg-secondary/80 backdrop-blur-sm animate-pulse-slow shadow-lg">
            {text}
          </p>
        </div>
      )}
    </div>
  );
};

// Shape Display Component
const ShapeDisplay = ({ shapeName, color, showDrawing }) => {
  if (!showDrawing) return null;

  return (
    <div className="flex flex-col items-center justify-center h-96">
      <div className="animate-fade-in-scale flex flex-col items-center gap-6">
        <div className="transform transition-all duration-500 hover:scale-105 cursor-pointer">
          <ShapeRenderer shapeName={shapeName} color={color} />
        </div>
        <p className="text-5xl font-bold text-primary bg-primary/10 px-6 py-3 rounded-2xl">
          {shapeName}
        </p>
      </div>
    </div>
  );
};

// Progress Indicator Component
const ProgressIndicator = ({ total, current }) => {
  return (
    <div className="flex gap-2">
      {Array.from({ length: total }).map((_, idx) => (
        <div
          key={idx}
          className={`h-3 rounded-full transition-all duration-300 ${
            idx === current 
              ? 'bg-primary w-10 shadow-lg shadow-primary/50' 
              : 'bg-muted w-3'
          }`}
        />
      ))}
    </div>
  );
};

// Navigation Controls Component
const NavigationControls = ({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
  currentIndex,
  total,
}) => {
  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex justify-center gap-6">
        <Button
          onClick={onPrevious}
          disabled={!canGoPrevious}
          size="lg"
          className="gap-2 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          <ChevronLeft className="w-6 h-6" />
          Previous
        </Button>
        
        <Button
          onClick={onNext}
          disabled={!canGoNext}
          size="lg"
          className="gap-2 text-lg px-8 py-6 rounded-full shadow-lg hover:shadow-xl transition-all hover:scale-105 disabled:opacity-50 disabled:hover:scale-100"
        >
          Next
          <ChevronRight className="w-6 h-6" />
        </Button>
      </div>
      
      <div className="text-center space-y-2">
        <p className="text-lg text-muted-foreground font-medium">
          Shape {currentIndex + 1} of {total}
        </p>
        <p className="text-sm text-muted-foreground flex items-center justify-center gap-2">
          <span className="text-xl">🔊</span>
          Sound is on! Waits 5 seconds after explanation
        </p>
      </div>
    </div>
  );
};

// Main Component
const Index = () => {
  const [currentShape, setCurrentShape] = useState(0);
  const [isRolling, setIsRolling] = useState(false);
  const [showText, setShowText] = useState(false);
  const [showDrawing, setShowDrawing] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const timersRef = React.useRef([]);

  // Apply dark mode class to document with smooth transition
  useEffect(() => {
    document.documentElement.style.transition = 'background-color 0.3s ease, color 0.3s ease';
    
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Toggle theme with sound effect
  const toggleTheme = () => {
    const audio = new Audio('https://assets.mixkit.co/active_storage/sfx/2568/2568-preview.mp3');
    audio.volume = 0.3;
    audio.play().catch(() => {});
    
    setIsDarkMode(!isDarkMode);
  };

  const speak = useCallback((text) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = 0.9;
      utterance.pitch = 1.2;
      utterance.volume = 1;
      window.speechSynthesis.speak(utterance);
    }
  }, []);

  // Background music
  useEffect(() => {
    const audio = new Audio('https://assets.mixkit.co/music/preview/mixkit-happy-fun-8-4854.mp3');
    audio.loop = true;
    audio.volume = 0.3;
    
    const playAudio = () => {
      audio.play().catch(() => {});
    };
    
    playAudio();
    
    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  // Clear all timers helper
  const clearAllTimers = () => {
    timersRef.current.forEach(timer => clearTimeout(timer));
    timersRef.current = [];
  };

  useEffect(() => {
    clearAllTimers();
    startAnimation();
    
    return () => clearAllTimers();
  }, [currentShape]);

  const startAnimation = () => {
    // Reset states
    setIsRolling(true);
    setShowText(false);
    setShowDrawing(false);

    // Step 1: Play voice for object and show rolling animation
    speak(shapes[currentShape].voice);

    // Step 2: After 2.5 seconds, stop rolling
    const timer1 = setTimeout(() => {
      setIsRolling(false);
      
      // Step 3: After 1 second, show text and speak it
      const timer2 = setTimeout(() => {
        setShowText(true);
        speak(shapes[currentShape].text);
        
        // Step 4: After 1.5 seconds, show shape drawing and speak shape name
        const timer3 = setTimeout(() => {
          setShowDrawing(true);
          speak(`This is a ${shapes[currentShape].name}!`);
          
          // Step 5: Wait 5 seconds before auto-advancing
          const timer4 = setTimeout(() => {
            if (currentShape < shapes.length - 1) {
              setCurrentShape(prev => prev + 1);
            }
          }, 5000);
          
          timersRef.current.push(timer4);
        }, 1500);
        
        timersRef.current.push(timer3);
      }, 1000);
      
      timersRef.current.push(timer2);
    }, 2500);
    
    timersRef.current.push(timer1);
  };

  const nextShape = () => {
    if (currentShape < shapes.length - 1) {
      clearAllTimers();
      window.speechSynthesis.cancel();
      setCurrentShape(currentShape + 1);
    }
  };

  const prevShape = () => {
    if (currentShape > 0) {
      clearAllTimers();
      window.speechSynthesis.cancel();
      setCurrentShape(currentShape - 1);
    }
  };

  const current = shapes[currentShape];

  return (
    <>
      <style>{`
        :root {
          --shape-red: 0 84% 60%;
          --shape-orange: 25 95% 53%;
          --shape-yellow: 48 96% 53%;
          --shape-green: 142 71% 45%;
          --shape-blue: 217 91% 60%;
          --shape-purple: 262 83% 58%;
          --shape-pink: 330 81% 60%;
          --shape-cyan: 189 94% 43%;
          --shape-amber: 38 92% 50%;
          --shape-indigo: 243 75% 59%;
          
          --learning-bg-start: 210 100% 97%;
          --learning-bg-mid: 200 100% 95%;
          --learning-bg-end: 190 100% 97%;
          
          --background: 0 0% 100%;
          --foreground: 222.2 84% 4.9%;
          --card: 0 0% 100%;
          --card-foreground: 222.2 84% 4.9%;
          --primary: 221.2 83.2% 53.3%;
          --primary-foreground: 210 40% 98%;
          --secondary: 210 40% 96.1%;
          --secondary-foreground: 222.2 47.4% 11.2%;
          --muted: 210 40% 96.1%;
          --muted-foreground: 215.4 16.3% 46.9%;
          --accent: 210 40% 96.1%;
          --accent-foreground: 222.2 47.4% 11.2%;
          --border: 214.3 31.8% 91.4%;
          --input: 214.3 31.8% 91.4%;
          --ring: 221.2 83.2% 53.3%;
        }
        
        .dark {
          --learning-bg-start: 222 47% 11%;
          --learning-bg-mid: 217 33% 17%;
          --learning-bg-end: 222 47% 11%;
          
          --background: 222.2 84% 4.9%;
          --foreground: 210 40% 98%;
          --card: 222.2 84% 4.9%;
          --card-foreground: 210 40% 98%;
          --primary: 217.2 91.2% 59.8%;
          --primary-foreground: 222.2 47.4% 11.2%;
          --secondary: 217.2 32.6% 17.5%;
          --secondary-foreground: 210 40% 98%;
          --muted: 217.2 32.6% 17.5%;
          --muted-foreground: 215 20.2% 65.1%;
          --accent: 217.2 32.6% 17.5%;
          --accent-foreground: 210 40% 98%;
          --border: 217.2 32.6% 17.5%;
          --input: 217.2 32.6% 17.5%;
          --ring: 224.3 76.3% 48%;
        }
        
        @keyframes roll-in {
          0% {
            transform: translateX(-200%) rotate(0deg);
            opacity: 0;
          }
          50% {
            opacity: 1;
          }
          100% {
            transform: translateX(0) rotate(360deg);
            opacity: 1;
          }
        }
        
        @keyframes fade-in-scale {
          0% {
            opacity: 0;
            transform: scale(0.8);
          }
          100% {
            opacity: 1;
            transform: scale(1);
          }
        }
        
        @keyframes pulse-slow {
          0%, 100% {
            transform: scale(1);
          }
          50% {
            transform: scale(1.05);
          }
        }
        
        .animate-roll-in {
          animation: roll-in 2.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        .animate-fade-in-scale {
          animation: fade-in-scale 0.6s ease-out forwards;
        }
        
        .animate-pulse-slow {
          animation: pulse-slow 2s ease-in-out infinite;
        }
        
        * {
          transition: background-color 0.3s ease, color 0.3s ease, border-color 0.3s ease;
        }
      `}</style>
      <div 
        className="min-h-screen p-4 md:p-8"
        style={{
          background: `linear-gradient(135deg, 
            hsl(var(--learning-bg-start)) 0%, 
            hsl(var(--learning-bg-mid)) 50%, 
            hsl(var(--learning-bg-end)) 100%)`
        }}
      >
        <div className="max-w-7xl mx-auto">
          <header className="text-center mb-8 md:mb-12 relative">
            <Button
              onClick={toggleTheme}
              variant="outline"
              size="icon"
              className="absolute right-0 top-0 rounded-full transition-transform hover:rotate-12"
            >
              {isDarkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
            
            <h1 className="text-4xl md:text-6xl font-bold text-primary mb-2 animate-fade-in-scale">
              Let's Learn Shapes! 🎨
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground">
              Discover shapes through fun objects!
            </p>
          </header>

          <main className="bg-card rounded-3xl shadow-2xl p-6 md:p-12 min-h-[500px] relative overflow-hidden mb-8">
            <div className="grid md:grid-cols-2 gap-8 items-center">
              <ObjectDisplay
                emoji={current.emoji}
                text={current.text}
                isRolling={isRolling}
                showText={showText}
              />

              <ShapeDisplay
                shapeName={current.name}
                color={current.color}
                showDrawing={showDrawing}
              />
            </div>

            <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
              <ProgressIndicator total={shapes.length} current={currentShape} />
            </div>
          </main>

          <NavigationControls
            onPrevious={prevShape}
            onNext={nextShape}
            canGoPrevious={currentShape > 0}
            canGoNext={currentShape < shapes.length - 1}
            currentIndex={currentShape}
            total={shapes.length}
          />
        </div>
      </div>
    </>
  );
};

export default Index;