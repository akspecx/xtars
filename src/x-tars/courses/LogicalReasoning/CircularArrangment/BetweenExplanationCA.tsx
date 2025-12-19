// import React, { useState, useEffect, CSSProperties, useRef } from 'react';

// type Language = 'en' | 'hi';

// interface PlaceholderSlot {
//   id: string;
//   position: 'top' | 'right' | 'bottom' | 'left';
//   label: string;
//   occupant: string | null;
//   isFixed: boolean;
// }

// interface Translation {
//   title: string;
//   instruction: string;
//   playButton: string;
//   stopButton: string;
//   loading: string; 
//   speaking: string;
//   autoplayError: string;
//   footer: (scenario: number) => string; 
//   pathLabelLeft: string; 
//   pathLabelRight: string;
//   // Updated speechText structure to handle the two-scenario introduction
//   speechText: (scenario: number) => string; 
//   speechIntro: string; // New introduction message
//   scenarioLabel1: string; 
//   scenarioLabel2: string; 
  
//   // New properties for unified explanation block content
//   s1RelativePos: string;
//   s2RelativePos: string;
//   definitionText: string;
//   explanationTitle: string;
//   betweenMeansLabel: string;
// }

// const translations: Record<Language, Translation> = {
//   en: {
//     title: "Circular Arrangement: The 'Between' Concept (Sequential Comparison)",
//     instruction: "Prabhat is sitting **between** David and Tom.", 
//     playButton: "Play Explanation",
//     stopButton: "Stop Explanation",
//     loading: "Generating Voice...",
//     speaking: "Now Speaking...",
//     autoplayError: "Voice playback blocked or unavailable. Visual lesson running.",
//     footer: (scenario: number) => 
//       scenario === 1 
//         ? "David (Left) and Tom (Right) relative to fixed Prabhat." 
//         : "Tom (Left) and David (Right) relative to fixed Prabhat.",
//     pathLabelLeft: "Left (CW)", 
//     pathLabelRight: "Right (CCW)", 
//     speechIntro: "When a person is seated between two others in a circular arrangement, there are two possible adjacent seating scenarios.",
//     speechText: (scenario: number) => {
//         if (scenario === 1) return "In **Scenario 1**, David is to Prabhat's Left, and Tom is to Prabhat's Right.";
//         if (scenario === 2) return "In **Scenario 2**, the positions are reversed: Tom is to Prabhat's Left, and David is to Prabhat's Right.";
//         return "";
//     },
//     scenarioLabel1: "Scenario 1", 
//     scenarioLabel2: "Scenario 2",
    
//     // Unified explanation content
//     explanationTitle: 'Explanation of "Between"',
//     s1RelativePos: "David is on Prabhat's Left (Clockwise), and Tom is on Prabhat's Right (Counter-Clockwise).",
//     s2RelativePos: "Tom is on Prabhat's Left (Clockwise), and David is on Prabhat's Right (Counter-Clockwise).",
//     definitionText: "The person is immediately adjacent to both others.",
//     betweenMeansLabel: "Between Means",
//   },
//   hi: {
//     title: "गोलाकार व्यवस्था: 'बीच में' की अवधारणा (क्रमिक तुलना)",
//     instruction: "प्रभात डेविड और टॉम के **बीच में** बैठा है।",
//     playButton: "व्याख्या चलाएँ",
//     stopButton: "रोकें",
//     loading: "आवाज़ उत्पन्न हो रही है...",
//     speaking: "अब बोल रहा है...",
//     autoplayError: "आवाज़ अवरुद्ध है या अनुपलब्ध है। दृश्य पाठ चल रहा है।",
//     footer: (scenario: number) => 
//       scenario === 1 
//         ? "डेविड (बाएँ) और टॉम (दाएँ) निश्चित प्रभात के सापेक्ष।" 
//         : "टॉम (बाएँ) और डेविड (दाएँ) निश्चित प्रभात के सापेक्ष।"
//         ,
//     pathLabelLeft: "बायाँ (CW)", 
//     pathLabelRight: "दायाँ (CCW)", 
//     speechIntro: "जब एक व्यक्ति एक गोलाकार व्यवस्था में दो अन्य लोगों के बीच में बैठा होता है, तो दो संभावित आसन्न बैठने के परिदृश्य होते हैं।",
//     speechText: (scenario: number) => {
//         if (scenario === 1) return "परिदृश्य 1 में, डेविड प्रभात के बाएँ है, और टॉम प्रभात के दाएँ है।";
//         if (scenario === 2) return "परिदृश्य 2 में, स्थितियाँ उलट जाती हैं: टॉम प्रभात के बाएँ है, और डेविड प्रभात के दाएँ है।";
//         return "";
//     },
//     scenarioLabel1: "परिदृश्य 1", 
//     scenarioLabel2: "परिदृश्य 2",
    
//     // Unified explanation content
//     explanationTitle: ' "बीच में" की व्याख्या',
//     s1RelativePos: "डेविड प्रभात के बाएँ (दक्षिणावर्त) है, और टॉम प्रभात के दाएँ (वामावर्त) है।",
//     s2RelativePos: "टॉम प्रभात के बाएँ (दक्षिणावर्त) है, और डेविड प्रभात के दाएँ (वामावर्त) है।",
//     definitionText: "वह व्यक्ति दोनों अन्य व्यक्तियों के ठीक बगल में बैठा है।",
//     betweenMeansLabel: "बीच में का अर्थ",
//   },
// };

// const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
//   const binaryString = atob(base64);
//   const len = binaryString.length;
//   const bytes = new Uint8Array(len);
//   for (let i = 0; i < len; i++) {
//     bytes[i] = binaryString.charCodeAt(i);
//   }
//   return bytes.buffer;
// };

// const pcmToWav = (pcm16: Int16Array, sampleRate: number): Blob => {
//   const buffer = new ArrayBuffer(44 + pcm16.length * 2);
//   const view = new DataView(buffer);
  
//   const writeString = (offset: number, str: string) => {
//     for (let i = 0; i < str.length; i++) {
//       view.setUint8(offset + i, str.charCodeAt(i));
//     }
//   };

//   let offset = 0;
//   writeString(offset, 'RIFF'); offset += 4;
//   view.setUint32(offset, 36 + pcm16.length * 2, true); offset += 4;
//   writeString(offset, 'WAVE'); offset += 4;
//   writeString(offset, 'fmt '); offset += 4;
//   view.setUint32(offset, 16, true); offset += 4;
//   view.setUint16(offset, 1, true); offset += 2;
//   view.setUint16(offset, 1, true); offset += 2;
//   view.setUint32(offset, sampleRate, true); offset += 4;
//   view.setUint32(offset, sampleRate * 2, true); offset += 4;
//   view.setUint16(offset, 2, true); offset += 2;
//   view.setUint16(offset, 16, true); offset += 2;
//   writeString(offset, 'data'); offset += 4;
//   view.setUint32(offset, pcm16.length * 2, true); offset += 4;

//   for (let i = 0; i < pcm16.length; i++, offset += 2) {
//     view.setInt16(offset, pcm16[i], true);
//   }

//   return new Blob([buffer], { type: 'audio/wav' });
// };

// interface CircularArrangementProps {
//   slots: PlaceholderSlot[];
//   circleSize: number;
//   language: Language;
//   currentStep: number;
//   highlightedPerson: string | null;
//   scenario: number; 
//   isScenarioHighlighted: boolean; 
// }

// const CircularArrangement: React.FC<CircularArrangementProps> = ({
//   slots,
//   circleSize,
//   language,
//   currentStep,
//   highlightedPerson,
//   scenario,
//   isScenarioHighlighted,
// }) => {
//   // CRITICAL: Increased responsive size for visual stability
//   const responsiveCircleSize = Math.min(circleSize, 260); 
//   const personSize = Math.max(responsiveCircleSize * 0.35, 60); 
//   const radius = responsiveCircleSize / 2;
//   const offset = personSize / 2;
//   const T = translations[language];

//   const getPositionStyle = (position: PlaceholderSlot['position']): CSSProperties => {
//     switch (position) {
//       case 'top': return { top: -offset, left: radius - offset };
//       case 'right': return { top: radius - offset, right: -offset };
//       case 'bottom': return { bottom: -offset, left: radius - offset };
//       case 'left': return { top: radius - offset, left: -offset };
//       default: return {};
//     }
//   };

//   const renderSlots = () => {
//     return slots.map((slot) => {
//       const slotStyle: CSSProperties = {
//         ...getPositionStyle(slot.position),
//         width: `${personSize}px`,
//         height: `${personSize}px`,
//       };

//       const size = Math.round(personSize);
//       let imageUrl = '';
//       let text = '';
//       let color = '';

//       if (slot.occupant === 'Tom') {
//         text = 'TOM'; color = 'dc2626'; // Red
//       } else if (slot.occupant === 'Prabhat') {
//         text = 'PRAB'; color = '10b981'; // Green (Fixed)
//       } else if (slot.occupant === 'David') {
//         text = 'DAVI'; color = 'f97316'; // Orange
//       } else if (slot.occupant === 'Akash') {
//         text = 'AKAS'; color = '3b82f6'; 
//       }
      
//       imageUrl = `https://placehold.co/${size}x${size}/${color}/ffffff?text=${text}`;

//       const isOccupied = slot.occupant;

//       const isCurrentPersonHighlighted = isOccupied && highlightedPerson === slot.occupant;

//       // Only highlight people in the currently highlighted scenario box
//       const isVisibleHighlight = isCurrentPersonHighlighted && isScenarioHighlighted;


//       return (
//         <div key={slot.id}>
//           <div
//             className={`absolute rounded-full shadow-lg transition-all duration-500 flex justify-center items-center ${
//               isOccupied 
//                 ? 'border-4 border-white bg-white dark:bg-gray-700' 
//                 : 'bg-transparent'
//             } ${isVisibleHighlight ? 'ring-4 ring-offset-2 ring-yellow-500 shadow-2xl scale-110' : ''}`}
//             style={slotStyle}
//           >
//             {isOccupied ? (
//               <img
//                 src={imageUrl}
//                 alt={slot.occupant}
//                 className="w-full h-full rounded-full object-cover"
//                 // Fallback for image loading error
//                 onError={(e) => {
//                   const target = e.target as HTMLImageElement;
//                   target.onerror = null; 
//                   target.src = `https://placehold.co/${size}x${size}/000000/ffffff?text=X`; 
//                 }}
//               />
//             ) : (
//               <div className="text-gray-400 dark:text-gray-500 text-lg font-bold">
//                 {slot.label}
//               </div>
//             )}
//           </div>
//         </div>
//       );
//     });
//   };

//   const renderDirectionArrow = () => {
//     // Only render arrows if the scenario box is active
//     if (!isScenarioHighlighted) return null;

//     const R_Circle = responsiveCircleSize / 2;
//     const ARROW_PADDING = 40; // Reduced padding
//     const LABEL_OFFSET_FROM_CIRCLE = R_Circle + 55; // Distance from center for text
//     const ARROW_OFFSET = 180; 
//     const centerMarkerSize = 48;
//     const lineStrokeColor = '#3b82f6';
//     const viewBoxSize = responsiveCircleSize + ARROW_OFFSET * 2; 

//     const STROKE_WIDTH = 3;
//     const MARKER_SIZE = 8;
//     const angleMap: Record<PlaceholderSlot['position'], number> = {
//         'top': 1.5 * Math.PI, // 12 PM (270 deg)
//         'bottom': 0.5 * Math.PI, // 6 PM (90 deg)
//         'left': 1.0 * Math.PI, // 9 PM (180 deg)
//         'right': 0 * Math.PI, // 3 PM (0 deg)
//     };
    
//     // Scenario 1: D Left (CW) at R, T Right (CCW) at L.
//     const s1_arrow_D = { start: 'top' as const, end: 'right' as const, label: T.pathLabelLeft, color: '#dc2626', sweepFlag: 1, highlightName: 'David' }; // CW (D)
//     const s1_arrow_T = { start: 'top' as const, end: 'left' as const, label: T.pathLabelRight, color: '#3b82f6', sweepFlag: 0, highlightName: 'Tom' }; // CCW (T)

//     // Scenario 2: T Left (CW) at R, D Right (CCW) at L.
//     const s2_arrow_T = { start: 'top' as const, end: 'right' as const, label: T.pathLabelLeft, color: '#dc2626', sweepFlag: 1, highlightName: 'Tom' }; // CW (T)
//     const s2_arrow_D = { start: 'top' as const, end: 'left' as const, label: T.pathLabelRight, color: '#3b82f6', sweepFlag: 0, highlightName: 'David' }; // CCW (D)

//     const arrowSet = scenario === 1 ? [s1_arrow_D, s1_arrow_T] : [s2_arrow_T, s2_arrow_D];

//     const renderSingleArrow = (arrowData: typeof s1_arrow_D) => {
        
//         const arcRadius = R_Circle + ARROW_PADDING;
//         const startAngle = angleMap[arrowData.start]; 
//         const endAngle = angleMap[arrowData.end];
//         const sweepFlag = arrowData.sweepFlag; 

//         // Path points
//         const pathStartRadius = arcRadius; 
//         const pathStartX = R_Circle + pathStartRadius * Math.cos(startAngle);
//         const pathStartY = R_Circle + pathStartRadius * Math.sin(startAngle);
        
//         const pathEndRadius = arcRadius;
//         const pathEndX = R_Circle + pathEndRadius * Math.cos(endAngle);
//         const pathEndY = R_Circle + pathEndRadius * Math.sin(endAngle);
        
//         // Use Arc path
//         const path = `M ${pathStartX} ${pathStartY} A ${arcRadius} ${arcRadius} 0 0 ${sweepFlag} ${pathEndX} ${pathEndY}`;
        
//         // Highlight logic
//         const targetPerson = arrowData.highlightName;
//         const isHighlighted = highlightedPerson === targetPerson || highlightedPerson === 'Prabhat';
//         const arrowColor = isHighlighted ? '#ffc107' : arrowData.color;

//         return (
//             <path
//                 key={arrowData.label + targetPerson}
//                 d={path}
//                 fill="none" 
//                 stroke={arrowColor} 
//                 strokeWidth={STROKE_WIDTH}
//                 markerEnd={`url(#mainArrowhead-${arrowColor.replace('#', '')})`}
//                 className={`transition-all duration-300 ${isHighlighted ? 'filter drop-shadow(0 0 4px #ffc107)' : ''}`}
//             />
//         );
//     };
    
//     // --- Fixed External Label Positioning (Corrected Quadrants) ---
    
//     // CCW (Right label) position: Should be in the **Fourth Quadrant** (Top to Left path)
//     // Angle between 1.5*PI (Top) and 1.0*PI (Left). A value around 1.25*PI is 4th quadrant.
//     const labelAngleRight = 1.25 * Math.PI; 
    
//     // CW (Left label) position: Should be in the **First Quadrant** (Top to Right path)
//     // Angle between 1.5*PI (Top) and 0*PI (Right). A value around 1.75*PI is 1st quadrant (when normalized).
//     const labelAngleLeft = 1.75 * Math.PI;
    
//     // Convert angle to be within [0, 2*PI] range if it wraps
//     const normalizeAngle = (angle: number) => (angle + 2 * Math.PI) % (2 * Math.PI);
    
//     const finalLabelAngleRight = normalizeAngle(labelAngleRight);
//     const finalLabelAngleLeft = normalizeAngle(labelAngleLeft);

//     const labelRightX = R_Circle + LABEL_OFFSET_FROM_CIRCLE * Math.cos(finalLabelAngleRight);
//     const labelRightY = R_Circle + LABEL_OFFSET_FROM_CIRCLE * Math.sin(finalLabelAngleRight);
    
//     const labelLeftX = R_Circle + LABEL_OFFSET_FROM_CIRCLE * Math.cos(finalLabelAngleLeft);
//     const labelLeftY = R_Circle + LABEL_OFFSET_FROM_CIRCLE * Math.sin(finalLabelAngleLeft);

//     const leftLabelColor = arrowSet.find(a => a.label === T.pathLabelLeft)?.color || '#dc2626';
//     const rightLabelColor = arrowSet.find(a => a.label === T.pathLabelRight)?.color || '#3b82f6';
    
//     return (
//       <div className="flex justify-center" style={{ padding: `${ARROW_OFFSET / 2}px` }}>
//         <svg
//           className="absolute"
//           style={{
//             top: -ARROW_OFFSET * 0.5, 
//             left: -ARROW_OFFSET * 0.5,
//             width: viewBoxSize,
//             height: viewBoxSize,
//             zIndex: 5
//           }}
//           viewBox={`${-ARROW_OFFSET * 0.5} ${-ARROW_OFFSET * 0.5} ${viewBoxSize} ${viewBoxSize}`}
//           preserveAspectRatio="xMidYMid meet"
//         >
//           <defs>
//             <marker id="facingArrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
//               <path d="M 0 0 L 6 3 L 0 6 z" fill={lineStrokeColor} />
//             </marker>
//             {/* Arrowhead definitions for dynamic colors and highlight color */}
//             <marker id="mainArrowhead-3b82f6" markerWidth={MARKER_SIZE} markerHeight={MARKER_SIZE} refX={MARKER_SIZE * 0.8} refY={MARKER_SIZE * 0.5} orient="auto">
//               <path d={`M 0 0 L ${MARKER_SIZE} ${MARKER_SIZE * 0.5} L 0 ${MARKER_SIZE} z`} fill="#3b82f6" />
//             </marker>
//             <marker id="mainArrowhead-dc2626" markerWidth={MARKER_SIZE} markerHeight={MARKER_SIZE} refX={MARKER_SIZE * 0.8} refY={MARKER_SIZE * 0.5} orient="auto">
//               <path d={`M 0 0 L ${MARKER_SIZE} ${MARKER_SIZE * 0.5} L 0 ${MARKER_SIZE} z`} fill="#dc2626" />
//             </marker>
//              <marker id="mainArrowhead-ffc107" markerWidth={MARKER_SIZE} markerHeight={MARKER_SIZE} refX={MARKER_SIZE * 0.8} refY={MARKER_SIZE * 0.5} orient="auto">
//               <path d={`M 0 0 L ${MARKER_SIZE} ${MARKER_SIZE * 0.5} L 0 ${MARKER_SIZE} z`} fill="#ffc107" />
//             </marker>
//           </defs>

//           {/* Render the arcs */}
//           {arrowSet.map(renderSingleArrow)}
          
//           {/* Render Fixed External Labels */}
//           {isScenarioHighlighted && (
//             <>
//               <text
//                   x={labelRightX}
//                   y={labelRightY}
//                   className="font-extrabold"
//                   fill={rightLabelColor} 
//                   style={{ fontSize: '1rem', textShadow: '0 0 4px rgba(0,0,0,0.2)' }}
//                   textAnchor="middle"
//                   dominantBaseline="middle"
//               >
//                   {T.pathLabelRight}
//               </text>
//               <text
//                   x={labelLeftX}
//                   y={labelLeftY}
//                   className="font-extrabold"
//                   fill={leftLabelColor} 
//                   style={{ fontSize: '1rem', textShadow: '0 0 4px rgba(0,0,0,0.2)' }}
//                   textAnchor="middle"
//                   dominantBaseline="middle"
//               >
//                   {T.pathLabelLeft}
//               </text>
//             </>
//           )}

//           {/* Facing Arrows (from person toward the center) */}
//           {slots.filter(s => s.occupant).map((slot, i) => {
//               const angle = angleMap[slot.position];
//               const startRadius = R_Circle - personSize * 0.35 - 5; // Start a bit further from person
//               const endRadius = centerMarkerSize * 0.5 - 2; // End closer to center icon

//               const startX = R_Circle + startRadius * Math.cos(angle); 
//               const startY = R_Circle + startRadius * Math.sin(angle);

//               const endX = R_Circle + endRadius * Math.cos(angle - Math.PI); 
//               const endY = R_Circle + endRadius * Math.sin(angle - Math.PI);
              
//               return (
//                   <path
//                       key={i}
//                       d={`M ${startX} ${startY} L ${endX} ${endY}`}
//                       fill="none"
//                       stroke={lineStrokeColor}
//                       strokeWidth="2"
//                       markerEnd="url(#facingArrowhead)"
//                       strokeDasharray="4,3"
//                   />
//               );
//           })}
//         </svg>

//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 10 }}>
//           <div
//             className="relative bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-full shadow-lg flex items-center justify-center"
//             style={{ width: centerMarkerSize, height: centerMarkerSize }}
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
//             </svg>
//           </div>
//         </div>
//       </div>
//     );
//   };

//   return (
//     <div className="flex flex-col items-center">
//       <div
//         className="relative border-4 border-blue-500 dark:border-blue-300 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-xl transition-all duration-300"
//         style={{ width: responsiveCircleSize, height: responsiveCircleSize }}
//       >
//         {renderDirectionArrow()}
//         {renderSlots()}
//       </div>
//     </div>
//   );
// };

// // --- Main App Component ---

// const App: React.FC = () => {
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [circleSize, setCircleSize] = useState(300); 
//   const [playbackError, setPlaybackError] = useState<string | null>(null); 
//   const [language, setLanguage] = useState<Language>('en'); 
//   // Step 0: Only Prabhat is visible
//   // Step 1: Scenario 1 fully visible (only in Scenario 1 box)
//   // Step 2: Both Scenario 1 and Scenario 2 fully visible
//   // Step 3: Final state (people remain placed)
//   const [currentStep, setCurrentStep] = useState(0); 
//   const [highlightedPersonState, setHighlightedPersonState] = useState<string | null>(null);
  
//   const T = translations[language];
  
//   const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  
//   const clearTimeouts = () => {
//       timeoutsRef.current.forEach(clearTimeout);
//       timeoutsRef.current = [];
//   };

//   const stopAudio = () => {
//     if (window.speechSynthesis) {
//         window.speechSynthesis.cancel();
//     }
//     // Set to final state (3) after stopping audio so people remain placed
//     setIsSpeaking(false);
//     setHighlightedPersonState(null);
//     setCurrentStep(3); 
//     clearTimeouts();
//   };
  
//   // Custom speech queue management
//   const speakQueue = (messages: { text: string, scenario: number, highlightPerson: string | null, delay?: number }[]) => {
//       const synth = window.speechSynthesis;
//       if (!synth) {
//           setPlaybackError("Browser Speech Synthesis is not available.");
//           return;
//       }
      
//       const processNext = (index: number) => {
//           if (index >= messages.length) {
//               // End of sequence
//               stopAudio(); 
//               return;
//           }

//           const msg = messages[index];
          
//           // Trigger visual sequence step (0, 1, or 2)
//           setCurrentStep(msg.scenario);
//           setHighlightedPersonState(msg.highlightPerson);


//           const utterance = new SpeechSynthesisUtterance(msg.text);
//           utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
          
//           let started = false;

//           utterance.onstart = () => { started = true; setIsSpeaking(true); };

//           utterance.onend = () => {
//               // Delay before starting the next segment
//               const nextDelay = msg.delay || 1500; // Default pause of 1.5s
//               if (index < messages.length - 1) {
//                   const pauseTimeout = setTimeout(() => processNext(index + 1), nextDelay); 
//                   timeoutsRef.current.push(pauseTimeout);
//               } else {
//                   stopAudio();
//               }
//           };

//           utterance.onerror = (event) => {
//               console.error("Speech Error:", event.error);
//               // Fallback for visual flow if speech fails mid-stream
//               setIsSpeaking(false);
//               setPlaybackError(T.autoplayError);
              
//               // Proceed visually with a delay if audio fails
//               const nextTimeout = setTimeout(() => processNext(index + 1), 3000); 
//               timeoutsRef.current.push(nextTimeout);
//           };
          
//           // Use timeout to ensure the UI updates happen slightly before speech starts
//           setTimeout(() => synth.speak(utterance), 50); 
//       };
      
//       processNext(0);
//   };
  
//   const synthesizeSpeech = () => {
//     if (isSpeaking) {
//       stopAudio();
//       return;
//     }
    
//     // 1. Start with reset (Prabhat only)
//     setCurrentStep(0); 
//     clearTimeouts(); 

//     const speechSequence = [
//         // 1. Introduction: State that two scenarios are possible (delay before scenario 1 starts)
//         { text: T.speechIntro, scenario: 0, highlightPerson: 'Prabhat', delay: 2000 },
        
//         // 2. SCENARIO 1 START: Set step to 1 to make David/Tom appear in Scenario 1 box only.
//         { text: T.scenarioLabel1, scenario: 1, highlightPerson: null, delay: 500 },
        
//         // 3. Explain David's position (Left) - highlight David
//         { text: T.speechText(1).split(', ')[0], scenario: 1, highlightPerson: 'David', delay: 500 }, 
        
//         // 4. Explain Tom's position (Right) - highlight Tom
//         { text: T.speechText(1).split(', ')[1].replace('.', ''), scenario: 1, highlightPerson: 'Tom', delay: 5000 }, // **5-second pause after Tom's highlight**
        
//         // 5. SCENARIO 2 START: Set step to 2 to make David/Tom appear in Scenario 2 box as well.
//         { text: T.scenarioLabel2, scenario: 2, highlightPerson: null, delay: 500 },
        
//         // 6. Explain Tom's position (Left) - highlight Tom (in Scenario 2)
//         { text: T.speechText(2).split(', ')[0].replace('reversed: ', ''), scenario: 2, highlightPerson: 'Tom', delay: 500 },
        
//         // 7. Explain David's position (Right) - highlight David (in Scenario 2)
//         { text: T.speechText(2).split(', ')[1].replace('.', ''), scenario: 2, highlightPerson: 'David', delay: 1500 }, // Standard pause at end
//     ];
    
//     const synth = window.speechSynthesis;
//     if (!synth || synth.getVoices().length === 0) {
//         setPlaybackError(T.autoplayError);
//         // Visual Fallback (Faster, continuous flow)
//         // This visual flow needs to be updated to match the new step logic
        
//         // 1. Intro (Prabhat highlighted)
//         timeoutsRef.current.push(setTimeout(() => { setHighlightedPersonState('Prabhat'); }, 500));
        
//         // 2. Scenario 1 appearance + David highlight
//         timeoutsRef.current.push(setTimeout(() => { setCurrentStep(1); setHighlightedPersonState('David'); }, 2500));
        
//         // 3. Tom highlight
//         timeoutsRef.current.push(setTimeout(() => { setHighlightedPersonState('Tom'); }, 4000));
        
//         // 4. Pause (5s)
        
//         // 5. Scenario 2 appearance + Tom highlight
//         timeoutsRef.current.push(setTimeout(() => { setCurrentStep(2); setHighlightedPersonState('Tom'); }, 9500)); 
        
//         // 6. David highlight
//         timeoutsRef.current.push(setTimeout(() => { setHighlightedPersonState('David'); }, 11000));
        
//         // 7. End
//         timeoutsRef.current.push(setTimeout(() => { stopAudio(); }, 12500));


//     } else {
//         setTimeout(() => speakQueue(speechSequence), 100);
//     }
//   };

//   useEffect(() => {
//     if (isDarkMode) { 
//       document.documentElement.classList.add('dark'); 
//     } else { 
//       document.documentElement.classList.remove('dark'); 
//     }

//     const calculateSize = () => {
//       // Increased max size for circles slightly to use space better
//       const maxSize = 280; 
//       const containerWidth = window.innerWidth * 0.45; // Allow for wider scenario boxes
//       const size = Math.min(containerWidth, maxSize);
//       setCircleSize(size);
//     };

//     calculateSize();
//     window.addEventListener('resize', calculateSize);
//     return () => window.removeEventListener('resize', calculateSize);
//   }, [isDarkMode]);

//   useEffect(() => {
//     if (language !== 'en') {
//         stopAudio();
//     }
//   }, [language]);

//   useEffect(() => {
//       setCurrentStep(0); // Start at Step 0 (Prabhat only)
//       return () => {
//           stopAudio();
//       };
//   }, []);
  
//   // Define fixed slots (Prabhat at Top)
//   const baseSlots: PlaceholderSlot[] = [
//     { id: 'top', position: 'top', label: 'Prabhat', occupant: 'Prabhat', isFixed: true }, 
//     { id: 'bottom', position: 'bottom', label: 'EMPTY', occupant: null, isFixed: false }, 
//     { id: 'left', position: 'left', label: 'EMPTY', occupant: null, isFixed: false }, // P's Right (CCW)
//     { id: 'right', position: 'right', label: 'EMPTY', occupant: null, isFixed: false }, // P's Left (CW)
//   ];
  
//   // Logic to apply seating based on scenario
//   const getSlots = (scenario: number, currentStep: number): PlaceholderSlot[] => {
    
//     // Scenario 1: D Left (CW) at R, T Right (CCW) at L.
//     // Scenario 2: T Left (CW) at R, D Right (CCW) at L.
//     const personCW = scenario === 1 ? 'David' : 'Tom'; 
//     const personCCW = scenario === 1 ? 'Tom' : 'David'; 
    
//     const targetSlotIdLeft = 'right'; // CW / Left person sits in the 'right' slot (3 PM)
//     const targetSlotIdRight = 'left'; // CCW / Right person sits in the 'left' slot (9 PM)
    
//     // ---------------------------------------------------------------------------------
//     // CRITICAL FIX: Determine if the people should be visible in THIS specific scenario box
//     // Scenario 1 people are visible if currentStep is 1, 2, or 3.
//     // Scenario 2 people are only visible if currentStep is 2 or 3.
    
//     const isVisibleInThisScenario = (scenario === 1 && currentStep >= 1) || (scenario === 2 && currentStep >= 2);
    
//     if (currentStep === 0 || !isVisibleInThisScenario) {
//          // Only show Prabhat, hide everyone else (including the current person's slots)
//          return baseSlots.map(slot => slot.id === 'top' ? slot : { ...slot, occupant: null, label: 'EMPTY' });
//     }
//     // ---------------------------------------------------------------------------------

//     // Show full scenario
//     return baseSlots.map(slot => {
//         if (slot.id === 'top') return slot; 

//         let occupant: string | null = null;
//         let label: string = 'EMPTY';

//         if (slot.id === targetSlotIdLeft) {
//             occupant = personCW;
//             label = personCW;
//         }

//         if (slot.id === targetSlotIdRight) {
//             occupant = personCCW;
//             label = personCCW;
//         }

//         return { ...slot, occupant, label };
//     });
//   };


//   const toggleDarkMode = () => setIsDarkMode(prev => !prev);

//   const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setLanguage(e.target.value as Language);
//   };
  
//   const isScenario1Active = currentStep === 1;
//   const isScenario2Active = currentStep === 2;
//   const showPeople = currentStep > 0; // People other than Prabhat appear when step > 0


//   return (
//     <div className={isDarkMode ? 'dark' : ''}>
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500 p-4 sm:p-6 flex flex-col items-center font-sans">
//         <div className="w-full max-w-5xl space-y-4 flex flex-col flex-grow">
//           <header className="flex flex-col sm:flex-row justify-between items-center w-full space-y-4 sm:space-y-0 pb-4 flex-shrink-0">
//             <h1 className="text-xl sm:text-3xl font-extrabold text-gray-800 dark:text-white text-center sm:text-left flex-grow">
//               {T.title}
//             </h1>
//             <div className="flex space-x-4 items-center">
//               <select
//                 value={language}
//                 onChange={handleLanguageChange}
//                 className="p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
//               >
//                 <option value="en">English</option>
//                 <option value="hi">हिन्दी (Hindi)</option>
//               </select>
//               <button
//                 onClick={toggleDarkMode}
//                 className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-yellow-400 shadow-md hover:ring-2 ring-blue-500 dark:ring-blue-300 transition-all duration-300"
//                 aria-label="Toggle Dark Mode"
//               >
//                 {isDarkMode ? (
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
//                   </svg>
//                 ) : (
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
//                   </svg>
//                 )}
//               </button>
//             </div>
//           </header>

//           <div className="w-full bg-white dark:bg-gray-800 p-3 rounded-xl shadow-2xl border-4 border-green-500 flex-grow"> 
            
//             {/* Instruction/Status Box and Play Button - Added border/shadow to entire box */}
//             <div className="p-3 sm:p-6 bg-blue-50 dark:bg-blue-900 rounded-xl border-2 border-blue-200 dark:border-blue-700 shadow-lg mb-4">
//               <h2 className="text-xl sm:text-2xl font-extrabold text-blue-800 dark:text-blue-200 text-center mb-4">
//                 {T.instruction}
//               </h2>

//               {playbackError && (
//                   <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-2 rounded mb-3 text-sm font-medium text-center w-full max-w-sm mx-auto">
//                       {playbackError}
//                   </div>
//               )}
//               <div className="flex justify-center">
//                 <button
//                   onClick={synthesizeSpeech}
//                   disabled={isSpeaking}
//                   className={`flex items-center px-6 py-3 rounded-full font-bold text-white shadow-lg transition duration-200 
//                     ${isSpeaking ? 'bg-red-600 hover:bg-red-700 active:bg-red-800' : 'bg-green-600 hover:bg-green-700 active:bg-green-800'}`}
//                 >
//                     <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
//                     </svg>
//                     {isSpeaking ? T.stopButton : T.playButton}
//                 </button>
//               </div>
//             </div>

//             {/* --- Simultaneous Arrangement Display --- */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start justify-center">
              
//               {/* Scenario 1: David Left (CW), Tom Right (CCW) */}
//               <div className="flex flex-col items-center w-full">
//                 <h3 className={`text-xl font-bold mb-2 p-2 rounded-lg transition-colors duration-300 ${isScenario1Active ? 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 shadow-md' : 'text-gray-700 dark:text-gray-200'}`}>
//                     {T.scenarioLabel1}
//                 </h3>
//                 <div className={`p-6 rounded-xl shadow-lg border-4 w-full transition-all duration-300 min-h-[350px]
//                   ${isScenario1Active ? 'bg-red-50 dark:bg-gray-700 border-red-500 ring-2 ring-red-500' : 'bg-red-50 dark:bg-gray-800 border-red-400'}`}>
//                     <CircularArrangement
//                       slots={getSlots(1, currentStep)}
//                       circleSize={circleSize}
//                       language={language}
//                       currentStep={currentStep}
//                       highlightedPerson={highlightedPersonState}
//                       scenario={1}
//                       isScenarioHighlighted={isScenario1Active || currentStep === 3} 
//                     />
//                 </div>
//                 <div className="w-full mt-3 ">
//                   <p className="text-xs text-gray-500 dark:text-gray-400 text-center">{T.footer(1)}</p>
//                 </div>
//               </div>

//               {/* Scenario 2: Tom Left (CW), David Right (CCW) */}
//               <div className="flex flex-col items-center w-full">
//                 <h3 className={`text-xl font-bold mb-2 p-2 rounded-lg transition-colors duration-300 ${isScenario2Active ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 shadow-md' : 'text-gray-700 dark:text-gray-200'}`}>
//                     {T.scenarioLabel2}
//                 </h3>
//                 <div className={`p-6 rounded-xl shadow-lg border-4 w-full transition-all duration-300 min-h-[350px]
//                   ${isScenario2Active ? 'bg-blue-50 dark:bg-gray-700 border-blue-500 ring-2 ring-blue-500' : 'bg-blue-50 dark:bg-gray-800 border-blue-400'}`}>
//                     <CircularArrangement
//                       slots={getSlots(2, currentStep)}
//                       circleSize={circleSize}
//                       language={language}
//                       currentStep={currentStep}
//                       highlightedPerson={highlightedPersonState}
//                       scenario={2}
//                       isScenarioHighlighted={isScenario2Active || currentStep === 3} 
//                     />
//                 </div>
//                 <div className="w-full mt-3">
//                   <p className="text-xs text-gray-500 dark:text-gray-400 text-center">{T.footer(2)}</p>
//                 </div>
//               </div>

//             </div>
            
//             {/* --- Unified Explanation Block (Added shadow/border) --- */}
//             <div className="w-full max-w-3xl mx-auto bg-blue-50 dark:bg-blue-900 rounded-xl shadow-lg border-4 border-blue-400 dark:border-blue-600 mt-6 p-4">
//                 <h3 className="text-lg font-extrabold text-blue-800 dark:text-blue-200 mb-2 text-center">{T.explanationTitle}</h3>
                
//                 <div className="space-y-2">
                    
//                     {/* Scenario 1 Explanation */}
//                     <div className="p-2 bg-white dark:bg-gray-800 rounded border border-red-400 shadow-sm">
//                         <p className="font-bold text-red-700 dark:text-red-300 text-sm mb-1">{T.scenarioLabel1}</p>
//                         <p className="text-gray-800 dark:text-gray-200 text-xs" 
//                            dangerouslySetInnerHTML={{ __html: T.s1RelativePos.replace('David', '<b>David</b>').replace('Tom', '<b>Tom</b>') }} />
//                     </div>

//                     {/* Scenario 2 Explanation */}
//                     <div className="p-2 bg-white dark:bg-gray-800 rounded border border-blue-400 shadow-sm">
//                         <p className="font-bold text-blue-700 dark:text-blue-300 text-sm mb-1">{T.scenarioLabel2}</p>
//                         <p className="text-gray-800 dark:text-gray-200 text-xs" 
//                            dangerouslySetInnerHTML={{ __html: T.s2RelativePos.replace('Tom', '<b>Tom</b>').replace('David', '<b>David</b>') }} />
//                     </div>

//                     {/* Between Means Definition */}
//                     <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 shadow-sm">
//                         <p className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-1">{T.betweenMeansLabel}</p>
//                         <p className="text-gray-600 dark:text-gray-300 italic text-xs">
//                             {T.definitionText}
//                         </p>
//                     </div>
//                 </div>
//             </div>


//           </div>

//           <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4 pb-2 flex-shrink-0">
//             <p>Visual demonstration of the 'Between' concept in circular arrangements.</p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default App;

import React, { useState, useEffect, CSSProperties, useRef } from 'react';

type Language = 'en' | 'hi';

interface PlaceholderSlot {
  id: string;
  position: 'top' | 'right' | 'bottom' | 'left';
  label: string;
  occupant: string | null;
  isFixed: boolean;
}

interface Translation {
  title: string;
  instruction: string;
  playButton: string;
  stopButton: string;
  loading: string; 
  speaking: string;
  autoplayError: string;
  footer: (scenario: number) => string; 
  pathLabelLeft: string; 
  pathLabelRight: string;
  // Updated speechText structure to handle the two-scenario introduction
  speechText: (scenario: number) => string; 
  speechIntro: string; // New introduction message
  scenarioLabel1: string; 
  scenarioLabel2: string; 
  
  // New properties for unified explanation block content
  s1RelativePos: string;
  s2RelativePos: string;
  definitionText: string;
  explanationTitle: string;
  betweenMeansLabel: string;
}

const translations: Record<Language, Translation> = {
  en: {
    title: "Circular Arrangement: The 'Between' Concept (Sequential Comparison)",
    instruction: "Prabhat is sitting **between** David and Tom.", 
    playButton: "Play Explanation",
    stopButton: "Stop Explanation",
    loading: "Generating Voice...",
    speaking: "Now Speaking...",
    autoplayError: "Voice playback blocked or unavailable. Visual lesson running.",
    footer: (scenario: number) => 
      scenario === 1 
        ? "David (Left) and Tom (Right) relative to fixed Prabhat." 
        : "Tom (Left) and David (Right) relative to fixed Prabhat.",
    pathLabelLeft: "Left (CW)", 
    pathLabelRight: "Right (CCW)", 
    speechIntro: "When a person is seated between two others in a circular arrangement, there are two possible adjacent seating scenarios.",
    speechText: (scenario: number) => {
        if (scenario === 1) return "In **Scenario 1**, David is to Prabhat's Left, and Tom is to Prabhat's Right.";
        if (scenario === 2) return "In **Scenario 2**, the positions are reversed: Tom is to Prabhat's Left, and David is to Prabhat's Right.";
        return "";
    },
    scenarioLabel1: "Scenario 1", 
    scenarioLabel2: "Scenario 2",
    
    // Unified explanation content
    explanationTitle: 'Explanation of "Between"',
    s1RelativePos: "David is on Prabhat's Left (Clockwise), and Tom is on Prabhat's Right (Counter-Clockwise).",
    s2RelativePos: "Tom is on Prabhat's Left (Clockwise), and David is on Prabhat's Right (Counter-Clockwise).",
    definitionText: "The person is immediately adjacent to both others.",
    betweenMeansLabel: "Between Means",
  },
  hi: {
    title: "गोलाकार व्यवस्था: 'बीच में' की अवधारणा (क्रमिक तुलना)",
    instruction: "प्रभात डेविड और टॉम के **बीच में** बैठा है।",
    playButton: "व्याख्या चलाएँ",
    stopButton: "रोकें",
    loading: "आवाज़ उत्पन्न हो रही है...",
    speaking: "अब बोल रहा है...",
    autoplayError: "आवाज़ अवरुद्ध है या अनुपलब्ध है। दृश्य पाठ चल रहा है।",
    footer: (scenario: number) => 
      scenario === 1 
        ? "डेविड (बाएँ) और टॉम (दाएँ) निश्चित प्रभात के सापेक्ष।" 
        : "टॉम (बाएँ) और डेविड (दाएँ) निश्चित प्रभात के सापेक्ष।"
        ,
    pathLabelLeft: "बायाँ (CW)", 
    pathLabelRight: "दायाँ (CCW)", 
    speechIntro: "जब एक व्यक्ति एक गोलाकार व्यवस्था में दो अन्य लोगों के बीच में बैठा होता है, तो दो संभावित आसन्न बैठने के परिदृश्य होते हैं।",
    speechText: (scenario: number) => {
        if (scenario === 1) return "परिदृश्य 1 में, डेविड प्रभात के बाएँ है, और टॉम प्रभात के दाएँ है।";
        if (scenario === 2) return "परिदृश्य 2 में, स्थितियाँ उलट जाती हैं: टॉम प्रभात के बाएँ है, और डेविड प्रभात के दाएँ है।";
        return "";
    },
    scenarioLabel1: "परिदृश्य 1", 
    scenarioLabel2: "परिदृश्य 2",
    
    // Unified explanation content
    explanationTitle: ' "बीच में" की व्याख्या',
    s1RelativePos: "डेविड प्रभात के बाएँ (दक्षिणावर्त) है, और टॉम प्रभात के दाएँ (वामावर्त) है।",
    s2RelativePos: "टॉम प्रभात के बाएँ (दक्षिणावर्त) है, और डेविड प्रभात के दाएँ (वामावर्त) है।",
    definitionText: "वह व्यक्ति दोनों अन्य व्यक्तियों के ठीक बगल में बैठा है।",
    betweenMeansLabel: "बीच में का अर्थ",
  },
};

const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
};

const pcmToWav = (pcm16: Int16Array, sampleRate: number): Blob => {
  const buffer = new ArrayBuffer(44 + pcm16.length * 2);
  const view = new DataView(buffer);
  
  const writeString = (offset: number, str: string) => {
    for (let i = 0; i < str.length; i++) {
      view.setUint8(offset + i, str.charCodeAt(i));
    }
  };

  let offset = 0;
  writeString(offset, 'RIFF'); offset += 4;
  view.setUint32(offset, 36 + pcm16.length * 2, true); offset += 4;
  writeString(offset, 'WAVE'); offset += 4;
  writeString(offset, 'fmt '); offset += 4;
  view.setUint32(offset, 16, true); offset += 4;
  view.setUint16(offset, 1, true); offset += 2;
  view.setUint16(offset, 1, true); offset += 2;
  view.setUint32(offset, sampleRate, true); offset += 4;
  view.setUint32(offset, sampleRate * 2, true); offset += 4;
  view.setUint16(offset, 2, true); offset += 2;
  view.setUint16(offset, 16, true); offset += 2;
  writeString(offset, 'data'); offset += 4;
  view.setUint32(offset, pcm16.length * 2, true); offset += 4;

  for (let i = 0; i < pcm16.length; i++, offset += 2) {
    view.setInt16(offset, pcm16[i], true);
  }

  return new Blob([buffer], { type: 'audio/wav' });
};

interface CircularArrangementProps {
  slots: PlaceholderSlot[];
  circleSize: number;
  language: Language;
  currentStep: number;
  highlightedPerson: string | null;
  scenario: number; 
  isScenarioHighlighted: boolean; 
}

const CircularArrangement: React.FC<CircularArrangementProps> = ({
  slots,
  circleSize,
  language,
  currentStep,
  highlightedPerson,
  scenario,
  isScenarioHighlighted,
}) => {
  // CRITICAL: Increased responsive size for visual stability
  const responsiveCircleSize = Math.min(circleSize, 260); 
  const personSize = Math.max(responsiveCircleSize * 0.35, 60); 
  const radius = responsiveCircleSize / 2;
  const offset = personSize / 2;
  const T = translations[language];

  const getPositionStyle = (position: PlaceholderSlot['position']): CSSProperties => {
    switch (position) {
      case 'top': return { top: -offset, left: radius - offset };
      case 'right': return { top: radius - offset, right: -offset };
      case 'bottom': return { bottom: -offset, left: radius - offset };
      case 'left': return { top: radius - offset, left: -offset };
      default: return {};
    }
  };

  const renderSlots = () => {
    return slots.map((slot) => {
      const slotStyle: CSSProperties = {
        ...getPositionStyle(slot.position),
        width: `${personSize}px`,
        height: `${personSize}px`,
      };

      const size = Math.round(personSize);
      let imageUrl = '';
      let text = '';
      let color = '';

      if (slot.occupant === 'Tom') {
        text = 'TOM'; color = 'dc2626'; // Red
      } else if (slot.occupant === 'Prabhat') {
        text = 'PRAB'; color = '10b981'; // Green (Fixed)
      } else if (slot.occupant === 'David') {
        text = 'DAVI'; color = 'f97316'; // Orange
      } else if (slot.occupant === 'Akash') {
        text = 'AKAS'; color = '3b82f6'; 
      }
      
      imageUrl = `https://placehold.co/${size}x${size}/${color}/ffffff?text=${text}`;

      const isOccupied = slot.occupant;

      const isCurrentPersonHighlighted = isOccupied && highlightedPerson === slot.occupant;

      // Only highlight people in the currently highlighted scenario box
      const isVisibleHighlight = isCurrentPersonHighlighted && isScenarioHighlighted;


      return (
        <div key={slot.id}>
          <div
            className={`absolute rounded-full shadow-lg transition-all duration-500 flex justify-center items-center ${
              isOccupied 
                ? 'border-4 border-white bg-white dark:bg-gray-700' 
                : 'bg-transparent'
            } ${isVisibleHighlight ? 'ring-4 ring-offset-2 ring-yellow-500 shadow-2xl scale-110' : ''}`}
            style={slotStyle}
          >
            {isOccupied ? (
              <img
                src={imageUrl}
                alt={slot.occupant}
                className="w-full h-full rounded-full object-cover"
                // Fallback for image loading error
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.onerror = null; 
                  target.src = `https://placehold.co/${size}x${size}/000000/ffffff?text=X`; 
                }}
              />
            ) : (
              <div className="text-gray-400 dark:text-gray-500 text-lg font-bold">
                {slot.label}
              </div>
            )}
          </div>
        </div>
      );
    });
  };

  const renderDirectionArrow = () => {
    // Only render arrows if the scenario box is active
    if (!isScenarioHighlighted) return null;

    const R_Circle = responsiveCircleSize / 2;
    const ARROW_PADDING = 40; // Reduced padding
    const LABEL_OFFSET_FROM_CIRCLE = R_Circle + 55; // Distance from center for text
    const ARROW_OFFSET = 180; 
    const centerMarkerSize = 48;
    const lineStrokeColor = '#3b82f6';
    const viewBoxSize = responsiveCircleSize + ARROW_OFFSET * 2; 

    const STROKE_WIDTH = 3;
    const MARKER_SIZE = 8;
    const angleMap: Record<PlaceholderSlot['position'], number> = {
        'top': 1.5 * Math.PI, // 12 PM (270 deg)
        'bottom': 0.5 * Math.PI, // 6 PM (90 deg)
        'left': 1.0 * Math.PI, // 9 PM (180 deg)
        'right': 0 * Math.PI, // 3 PM (0 deg)
    };
    
    // Scenario 1: D Left (CW) at R, T Right (CCW) at L.
    const s1_arrow_D = { start: 'top' as const, end: 'right' as const, label: T.pathLabelLeft, color: '#dc2626', sweepFlag: 1, highlightName: 'David' }; // CW (D)
    const s1_arrow_T = { start: 'top' as const, end: 'left' as const, label: T.pathLabelRight, color: '#3b82f6', sweepFlag: 0, highlightName: 'Tom' }; // CCW (T)

    // Scenario 2: T Left (CW) at R, D Right (CCW) at L.
    const s2_arrow_T = { start: 'top' as const, end: 'right' as const, label: T.pathLabelLeft, color: '#dc2626', sweepFlag: 1, highlightName: 'Tom' }; // CW (T)
    const s2_arrow_D = { start: 'top' as const, end: 'left' as const, label: T.pathLabelRight, color: '#3b82f6', sweepFlag: 0, highlightName: 'David' }; // CCW (D)

    const arrowSet = scenario === 1 ? [s1_arrow_D, s1_arrow_T] : [s2_arrow_T, s2_arrow_D];

    const renderSingleArrow = (arrowData: typeof s1_arrow_D) => {
        
        const arcRadius = R_Circle + ARROW_PADDING;
        const startAngle = angleMap[arrowData.start]; 
        const endAngle = angleMap[arrowData.end];
        const sweepFlag = arrowData.sweepFlag; 

        // Path points
        const pathStartRadius = arcRadius; 
        const pathStartX = R_Circle + pathStartRadius * Math.cos(startAngle);
        const pathStartY = R_Circle + pathStartRadius * Math.sin(startAngle);
        
        const pathEndRadius = arcRadius;
        const pathEndX = R_Circle + pathEndRadius * Math.cos(endAngle);
        const pathEndY = R_Circle + pathEndRadius * Math.sin(endAngle);
        
        // Use Arc path
        const path = `M ${pathStartX} ${pathStartY} A ${arcRadius} ${arcRadius} 0 0 ${sweepFlag} ${pathEndX} ${pathEndY}`;
        
        // Highlight logic
        const targetPerson = arrowData.highlightName;
        const isHighlighted = highlightedPerson === targetPerson || highlightedPerson === 'Prabhat';
        const arrowColor = isHighlighted ? '#ffc107' : arrowData.color;

        return (
            <path
                key={arrowData.label + targetPerson}
                d={path}
                fill="none" 
                stroke={arrowColor} 
                strokeWidth={STROKE_WIDTH}
                markerEnd={`url(#mainArrowhead-${arrowColor.replace('#', '')})`}
                className={`transition-all duration-300 ${isHighlighted ? 'filter drop-shadow(0 0 4px #ffc107)' : ''}`}
            />
        );
    };
    
    // --- Fixed External Label Positioning (Restored to stable/correct placement) ---
    // Right (CCW) Label position (Between Prabhat and CCW person at 9 PM/Left)
    // This is in the 4th quadrant (225 to 270 degrees)
    const labelAngleRight = 1.25 * Math.PI; 
    
    // Left (CW) Label position (Between Prabhat and CW person at 3 PM/Right)
    // This is in the 1st quadrant (270 to 360/0 degrees)
    const labelAngleLeft = 1.75 * Math.PI;
    
    // Convert angle to be within [0, 2*PI] range if it wraps
    const normalizeAngle = (angle: number) => (angle + 2 * Math.PI) % (2 * Math.PI);
    
    const finalLabelAngleRight = normalizeAngle(labelAngleRight);
    const finalLabelAngleLeft = normalizeAngle(labelAngleLeft);

    const labelRightX = R_Circle + LABEL_OFFSET_FROM_CIRCLE * Math.cos(finalLabelAngleRight);
    const labelRightY = R_Circle + LABEL_OFFSET_FROM_CIRCLE * Math.sin(finalLabelAngleRight);
    
    const labelLeftX = R_Circle + LABEL_OFFSET_FROM_CIRCLE * Math.cos(finalLabelAngleLeft);
    const labelLeftY = R_Circle + LABEL_OFFSET_FROM_CIRCLE * Math.sin(finalLabelAngleLeft);

    const leftLabelColor = arrowSet.find(a => a.label === T.pathLabelLeft)?.color || '#dc2626';
    const rightLabelColor = arrowSet.find(a => a.label === T.pathLabelRight)?.color || '#3b82f6';
    
    return (
      <div className="flex justify-center" style={{ padding: `${ARROW_OFFSET / 2}px` }}>
        <svg
          className="absolute"
          style={{
            top: -ARROW_OFFSET * 0.5, 
            left: -ARROW_OFFSET * 0.5,
            width: viewBoxSize,
            height: viewBoxSize,
            zIndex: 5
          }}
          viewBox={`${-ARROW_OFFSET * 0.5} ${-ARROW_OFFSET * 0.5} ${viewBoxSize} ${viewBoxSize}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker id="facingArrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 z" fill={lineStrokeColor} />
            </marker>
            {/* Arrowhead definitions for dynamic colors and highlight color */}
            <marker id="mainArrowhead-3b82f6" markerWidth={MARKER_SIZE} markerHeight={MARKER_SIZE} refX={MARKER_SIZE * 0.8} refY={MARKER_SIZE * 0.5} orient="auto">
              <path d={`M 0 0 L ${MARKER_SIZE} ${MARKER_SIZE * 0.5} L 0 ${MARKER_SIZE} z`} fill="#3b82f6" />
            </marker>
            <marker id="mainArrowhead-dc2626" markerWidth={MARKER_SIZE} markerHeight={MARKER_SIZE} refX={MARKER_SIZE * 0.8} refY={MARKER_SIZE * 0.5} orient="auto">
              <path d={`M 0 0 L ${MARKER_SIZE} ${MARKER_SIZE * 0.5} L 0 ${MARKER_SIZE} z`} fill="#dc2626" />
            </marker>
             <marker id="mainArrowhead-ffc107" markerWidth={MARKER_SIZE} markerHeight={MARKER_SIZE} refX={MARKER_SIZE * 0.8} refY={MARKER_SIZE * 0.5} orient="auto">
              <path d={`M 0 0 L ${MARKER_SIZE} ${MARKER_SIZE * 0.5} L 0 ${MARKER_SIZE} z`} fill="#ffc107" />
            </marker>
          </defs>

          {/* Render the arcs */}
          {arrowSet.map(renderSingleArrow)}
          
          {/* Render Fixed External Labels */}
          {isScenarioHighlighted && (
            <>
              <text
                  x={labelRightX}
                  y={labelRightY}
                  className="font-extrabold"
                  fill={rightLabelColor} 
                  style={{ fontSize: '1rem', textShadow: '0 0 4px rgba(0,0,0,0.2)' }}
                  textAnchor="middle"
                  dominantBaseline="middle"
              >
                  {T.pathLabelRight}
              </text>
              <text
                  x={labelLeftX}
                  y={labelLeftY}
                  className="font-extrabold"
                  fill={leftLabelColor} 
                  style={{ fontSize: '1rem', textShadow: '0 0 4px rgba(0,0,0,0.2)' }}
                  textAnchor="middle"
                  dominantBaseline="middle"
              >
                  {T.pathLabelLeft}
              </text>
            </>
          )}

          {/* Facing Arrows (from person toward the center) */}
          {slots.filter(s => s.occupant).map((slot, i) => {
              const angle = angleMap[slot.position];
              const startRadius = R_Circle - personSize * 0.35 - 5; // Start a bit further from person
              const endRadius = centerMarkerSize * 0.5 - 2; // End closer to center icon

              const startX = R_Circle + startRadius * Math.cos(angle); 
              const startY = R_Circle + startRadius * Math.sin(angle);

              const endX = R_Circle + endRadius * Math.cos(angle - Math.PI); 
              const endY = R_Circle + endRadius * Math.sin(angle - Math.PI);
              
              return (
                  <path
                      key={i}
                      d={`M ${startX} ${startY} L ${endX} ${endY}`}
                      fill="none"
                      stroke={lineStrokeColor}
                      strokeWidth="2"
                      markerEnd="url(#facingArrowhead)"
                      strokeDasharray="4,3"
                  />
              );
          })}
        </svg>

        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 10 }}>
          <div
            className="relative bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-full shadow-lg flex items-center justify-center"
            style={{ width: centerMarkerSize, height: centerMarkerSize }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
            </svg>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col items-center">
      <div
        className="relative border-4 border-blue-500 dark:border-blue-300 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-xl transition-all duration-300"
        style={{ width: responsiveCircleSize, height: responsiveCircleSize }}
      >
        {renderDirectionArrow()}
        {renderSlots()}
      </div>
    </div>
  );
};

// --- Main App Component ---

const App: React.FC = () => {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [circleSize, setCircleSize] = useState(300); 
  const [playbackError, setPlaybackError] = useState<string | null>(null); 
  const [language, setLanguage] = useState<Language>('en'); 
  // Step 0: Only Prabhat is visible
  // Step 1: Scenario 1 fully visible (only in Scenario 1 box)
  // Step 2: Both Scenario 1 and Scenario 2 fully visible
  // Step 3: Final state (people remain placed)
  const [currentStep, setCurrentStep] = useState(0); 
  const [highlightedPersonState, setHighlightedPersonState] = useState<string | null>(null);
  
  const T = translations[language];
  
  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  let isSpeechStarting = useRef(false);
  
  const clearTimeouts = () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
  };

  const stopAudio = () => {
    if (window.speechSynthesis) {
        window.speechSynthesis.cancel();
    }
    isSpeechStarting.current = false;
    // Set to final state (3) after stopping audio so people remain placed
    setIsSpeaking(false);
    setHighlightedPersonState(null);
    setCurrentStep(3); 
    clearTimeouts();
  };
  
  const startVisualFallback = () => {
      if (isSpeechStarting.current) {
          isSpeechStarting.current = false;
          setPlaybackError(T.autoplayError);
          setIsSpeaking(true); // Treat visual flow as "speaking"
          
          // --- Visual Fallback Flow ---
          // 1. Intro (Prabhat highlighted)
          timeoutsRef.current.push(setTimeout(() => { setHighlightedPersonState('Prabhat'); }, 500));
          
          // 2. Scenario 1 appearance + David highlight
          timeoutsRef.current.push(setTimeout(() => { setCurrentStep(1); setHighlightedPersonState('David'); }, 2500));
          
          // 3. Tom highlight
          timeoutsRef.current.push(setTimeout(() => { setHighlightedPersonState('Tom'); }, 4000));
          
          // 4. Pause (5s)
          
          // 5. Scenario 2 appearance + Tom highlight
          timeoutsRef.current.push(setTimeout(() => { setCurrentStep(2); setHighlightedPersonState('Tom'); }, 9500)); 
          
          // 6. David highlight
          timeoutsRef.current.push(setTimeout(() => { setHighlightedPersonState('David'); }, 11000));
          
          // 7. End
          timeoutsRef.current.push(setTimeout(() => { stopAudio(); }, 12500));
      }
  };

  // Custom speech queue management
  const speakQueue = (messages: { text: string, scenario: number, highlightPerson: string | null, delay?: number }[]) => {
      const synth = window.speechSynthesis;
      
      const processNext = (index: number) => {
          if (index >= messages.length) {
              stopAudio(); 
              return;
          }

          const msg = messages[index];
          
          setCurrentStep(msg.scenario);
          setHighlightedPersonState(msg.highlightPerson);


          const utterance = new SpeechSynthesisUtterance(msg.text);
          utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
          
          utterance.onstart = () => { 
              // If speech successfully starts, cancel the visual fallback timer
              isSpeechStarting.current = false;
              setIsSpeaking(true); 
          };

          utterance.onend = () => {
              const nextDelay = msg.delay || 1500; 
              if (index < messages.length - 1) {
                  const pauseTimeout = setTimeout(() => processNext(index + 1), nextDelay); 
                  timeoutsRef.current.push(pauseTimeout);
              } else {
                  stopAudio();
              }
          };

          utterance.onerror = (event) => {
              console.error("Speech Error:", event.error);
              // If speech fails mid-stream, attempt to switch to visual fallback flow
              if (!synth.speaking) {
                  startVisualFallback();
              } else {
                  // If it fails but speech is still 'speaking', continue the visual sequence timing
                  const nextDelay = msg.delay || 1500; 
                  const pauseTimeout = setTimeout(() => processNext(index + 1), nextDelay); 
                  timeoutsRef.current.push(pauseTimeout);
              }
          };
          
          setTimeout(() => synth.speak(utterance), 50); 
      };
      
      processNext(0);
  };
  
  const synthesizeSpeech = () => {
    if (isSpeaking) {
      stopAudio();
      return;
    }
    
    // 1. Reset state and flow control
    setCurrentStep(0); 
    clearTimeouts(); 
    isSpeechStarting.current = true; // Set flag to expect speech start
    setPlaybackError(null);
    
    const speechSequence = [
        { text: T.speechIntro, scenario: 0, highlightPerson: 'Prabhat', delay: 2000 },
        { text: T.scenarioLabel1, scenario: 1, highlightPerson: null, delay: 500 },
        { text: T.speechText(1).split(', ')[0], scenario: 1, highlightPerson: 'David', delay: 500 }, 
        { text: T.speechText(1).split(', ')[1].replace('.', ''), scenario: 1, highlightPerson: 'Tom', delay: 5000 }, 
        { text: T.scenarioLabel2, scenario: 2, highlightPerson: null, delay: 500 },
        { text: T.speechText(2).split(', ')[0].replace('reversed: ', ''), scenario: 2, highlightPerson: 'Tom', delay: 500 },
        { text: T.speechText(2).split(', ')[1].replace('.', ''), scenario: 2, highlightPerson: 'David', delay: 1500 }, 
    ];
    
    const synth = window.speechSynthesis;
    if (!synth || synth.getVoices().length === 0) {
        startVisualFallback(); // Immediate fallback if API is missing
    } else {
        // Start a watchdog timer. If speech doesn't start in 500ms, start the visual flow
        const watchdog = setTimeout(startVisualFallback, 500);
        timeoutsRef.current.push(watchdog);
        
        // Start the speech queue
        setTimeout(() => speakQueue(speechSequence), 100);
    }
  };

  useEffect(() => {
    if (isDarkMode) { 
      document.documentElement.classList.add('dark'); 
    } else { 
      document.documentElement.classList.remove('dark'); 
    }

    const calculateSize = () => {
      const maxSize = 280; 
      const containerWidth = window.innerWidth * 0.45;
      const size = Math.min(containerWidth, maxSize);
      setCircleSize(size);
    };

    calculateSize();
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, [isDarkMode]);

  useEffect(() => {
    if (language !== 'en') {
        stopAudio();
    }
  }, [language]);

  useEffect(() => {
      setCurrentStep(0); 
      return () => {
          stopAudio();
      };
  }, []);
  
  // Define fixed slots (Prabhat at Top)
  const baseSlots: PlaceholderSlot[] = [
    { id: 'top', position: 'top', label: 'Prabhat', occupant: 'Prabhat', isFixed: true }, 
    { id: 'bottom', position: 'bottom', label: 'EMPTY', occupant: null, isFixed: false }, 
    { id: 'left', position: 'left', label: 'EMPTY', occupant: null, isFixed: false }, // P's Right (CCW)
    { id: 'right', position: 'right', label: 'EMPTY', occupant: null, isFixed: false }, // P's Left (CW)
  ];
  
  // Logic to apply seating based on scenario
  const getSlots = (scenario: number, currentStep: number): PlaceholderSlot[] => {
    
    const personCW = scenario === 1 ? 'David' : 'Tom'; 
    const personCCW = scenario === 1 ? 'Tom' : 'David'; 
    
    const targetSlotIdLeft = 'right'; // CW / Left person sits in the 'right' slot (3 PM)
    const targetSlotIdRight = 'left'; // CCW / Right person sits in the 'left' slot (9 PM)
    
    // Determine visibility based on current step
    const isVisibleInThisScenario = (scenario === 1 && currentStep >= 1) || (scenario === 2 && currentStep >= 2);
    
    if (currentStep === 0 || !isVisibleInThisScenario) {
         return baseSlots.map(slot => slot.id === 'top' ? slot : { ...slot, occupant: null, label: 'EMPTY' });
    }

    // Show full scenario
    return baseSlots.map(slot => {
        if (slot.id === 'top') return slot; 

        let occupant: string | null = null;
        let label: string = 'EMPTY';

        if (slot.id === targetSlotIdLeft) {
            occupant = personCW;
            label = personCW;
        }

        if (slot.id === targetSlotIdRight) {
            occupant = personCCW;
            label = personCCW;
        }

        return { ...slot, occupant, label };
    });
  };


  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };
  
  const isScenario1Active = currentStep === 1;
  const isScenario2Active = currentStep === 2;
  const showPeople = currentStep > 0;


  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500 p-4 sm:p-6 flex flex-col items-center font-sans">
        <div className="w-full max-w-5xl space-y-4 flex flex-col flex-grow">
          <header className="flex flex-col sm:flex-row justify-between items-center w-full space-y-4 sm:space-y-0 pb-4 flex-shrink-0">
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
                aria-label="Toggle Dark Mode"
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

          <div className="w-full bg-white dark:bg-gray-800 p-3 rounded-xl shadow-2xl border-4 border-green-500 flex-grow"> 
            
            {/* Instruction/Status Box and Play Button - Added border/shadow to entire box */}
            <div className="p-3 sm:p-6 bg-blue-50 dark:bg-blue-900 rounded-xl border-2 border-blue-200 dark:border-blue-700 shadow-lg mb-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-blue-800 dark:text-blue-200 text-center mb-4">
                {T.instruction}
              </h2>

              {playbackError && (
                  <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-2 rounded mb-3 text-sm font-medium text-center w-full max-w-sm mx-auto">
                      {playbackError}
                  </div>
              )}
              <div className="flex justify-center">
                <button
                  onClick={synthesizeSpeech}
                  disabled={isSpeaking}
                  className={`flex items-center px-6 py-3 rounded-full font-bold text-white shadow-lg transition duration-200 
                    ${isSpeaking ? 'bg-red-600 hover:bg-red-700 active:bg-red-800' : 'bg-green-600 hover:bg-green-700 active:bg-green-800'}`}
                >
                    <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                    </svg>
                    {isSpeaking ? T.stopButton : T.playButton}
                </button>
              </div>
            </div>

            {/* --- Simultaneous Arrangement Display --- */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start justify-center">
              
              {/* Scenario 1: David Left (CW), Tom Right (CCW) */}
              <div className="flex flex-col items-center w-full">
                <h3 className={`text-xl font-bold mb-2 p-2 rounded-lg transition-colors duration-300 ${isScenario1Active ? 'bg-red-100 dark:bg-red-800 text-red-700 dark:text-red-300 shadow-md' : 'text-gray-700 dark:text-gray-200'}`}>
                    {T.scenarioLabel1}
                </h3>
                <div className={`p-6 rounded-xl shadow-lg border-4 w-full transition-all duration-300 min-h-[350px]
                  ${isScenario1Active ? 'bg-red-50 dark:bg-gray-700 border-red-500 ring-2 ring-red-500' : 'bg-red-50 dark:bg-gray-800 border-red-400'}`}>
                    <CircularArrangement
                      slots={getSlots(1, currentStep)}
                      circleSize={circleSize}
                      language={language}
                      currentStep={currentStep}
                      highlightedPerson={highlightedPersonState}
                      scenario={1}
                      isScenarioHighlighted={isScenario1Active || currentStep === 3} 
                    />
                </div>
                <div className="w-full mt-3 ">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">{T.footer(1)}</p>
                </div>
              </div>

              {/* Scenario 2: Tom Left (CW), David Right (CCW) */}
              <div className="flex flex-col items-center w-full">
                <h3 className={`text-xl font-bold mb-2 p-2 rounded-lg transition-colors duration-300 ${isScenario2Active ? 'bg-blue-100 dark:bg-blue-800 text-blue-700 dark:text-blue-300 shadow-md' : 'text-gray-700 dark:text-gray-200'}`}>
                    {T.scenarioLabel2}
                </h3>
                <div className={`p-6 rounded-xl shadow-lg border-4 w-full transition-all duration-300 min-h-[350px]
                  ${isScenario2Active ? 'bg-blue-50 dark:bg-gray-700 border-blue-500 ring-2 ring-blue-500' : 'bg-blue-50 dark:bg-gray-800 border-blue-400'}`}>
                    <CircularArrangement
                      slots={getSlots(2, currentStep)}
                      circleSize={circleSize}
                      language={language}
                      currentStep={currentStep}
                      highlightedPerson={highlightedPersonState}
                      scenario={2}
                      isScenarioHighlighted={isScenario2Active || currentStep === 3} 
                    />
                </div>
                <div className="w-full mt-3">
                  <p className="text-xs text-gray-500 dark:text-gray-400 text-center">{T.footer(2)}</p>
                </div>
              </div>

            </div>
            
            {/* --- Unified Explanation Block (Added shadow/border) --- */}
            <div className="w-full max-w-3xl mx-auto bg-blue-50 dark:bg-blue-900 rounded-xl shadow-lg border-4 border-blue-400 dark:border-blue-600 mt-6 p-4">
                <h3 className="text-lg font-extrabold text-blue-800 dark:text-blue-200 mb-2 text-center">{T.explanationTitle}</h3>
                
                <div className="space-y-2">
                    
                    {/* Scenario 1 Explanation */}
                    <div className="p-2 bg-white dark:bg-gray-800 rounded border border-red-400 shadow-sm">
                        <p className="font-bold text-red-700 dark:text-red-300 text-sm mb-1">{T.scenarioLabel1}</p>
                        <p className="text-gray-800 dark:text-gray-200 text-xs" 
                           dangerouslySetInnerHTML={{ __html: T.s1RelativePos.replace('David', '<b>David</b>').replace('Tom', '<b>Tom</b>') }} />
                    </div>

                    {/* Scenario 2 Explanation */}
                    <div className="p-2 bg-white dark:bg-gray-800 rounded border border-blue-400 shadow-sm">
                        <p className="font-bold text-blue-700 dark:text-blue-300 text-sm mb-1">{T.scenarioLabel2}</p>
                        <p className="text-gray-800 dark:text-gray-200 text-xs" 
                           dangerouslySetInnerHTML={{ __html: T.s2RelativePos.replace('Tom', '<b>Tom</b>').replace('David', '<b>David</b>') }} />
                    </div>

                    {/* Between Means Definition */}
                    <div className="p-2 bg-white dark:bg-gray-800 rounded border border-gray-300 dark:border-gray-600 shadow-sm">
                        <p className="font-bold text-gray-800 dark:text-gray-200 text-sm mb-1">{T.betweenMeansLabel}</p>
                        <p className="text-gray-600 dark:text-gray-300 italic text-xs">
                            {T.definitionText}
                        </p>
                    </div>
                </div>
            </div>


          </div>

          <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4 pb-2 flex-shrink-0">
            <p>Visual demonstration of the 'Between' concept in circular arrangements.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;