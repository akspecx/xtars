// // // Don't remove this commented code
// // // Don't remove this commented code
// // // Don't remove this commented code
// // // Don't remove this commented code
// // // Don't remove this commented code
// // // Don't remove this commented code
// // // Don't remove this commented code
// // // Don't remove this commented code
// // // Don't remove this commented code
// // // Don't remove this commented code
// // // Don't remove this commented code

// // // import React, { useState, useEffect, CSSProperties } from 'react';

// // // type Language = 'en' | 'hi';

// // // interface PlaceholderSlot {
// // //   id: string;
// // //   position: 'top' | 'right' | 'bottom' | 'left';
// // //   label: string;
// // //   occupant: string | null;
// // //   isFixed: boolean;
// // // }

// // // interface Translation {
// // //   title: string;
// // //   instruction: string;
// // //   explanation: React.ReactNode;
// // //   playButton: string;
// // //   loading: string;
// // //   speaking: string;
// // //   autoplayError: string;
// // //   footer: string;
// // //   rightLabel1st: string;
// // //   rightLabel2nd: string;
// // //   speechText: string;
// // // }

// // // const translations: Record<Language, Translation> = {
// // //   en: {
// // //     title: "Circular Arrangement: Ordinal Direction Lesson (Right)",
// // //     instruction: "Demonstrating 1st Right and 2nd Right positions relative to David.",
// // //     explanation: (
// // //       <div className="space-y-3">
// // //         <p className="font-semibold text-xl text-gray-900 dark:text-gray-50 text-center p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg">
// // //           <span className="text-blue-600 dark:text-blue-400 font-extrabold">Prabhat</span> is the 1st to the **Right** of David.
// // //         </p>
// // //         <p className="font-semibold text-xl text-gray-900 dark:text-gray-50 text-center p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg">
// // //           <span className="text-red-600 dark:text-red-400 font-extrabold">Tom</span> is the 2nd to the **Right** of David.
// // //         </p>
// // //         <p className="text-sm italic text-gray-600 dark:text-gray-300 text-center p-1 border-t dark:border-gray-600 pt-2">
// // //           **Right** means Counter-Clockwise when everyone is facing the center.
// // //         </p>
// // //       </div>
// // //     ),
// // //     playButton: "Play Explanation",
// // //     loading: "Generating Voice...",
// // //     speaking: "Now Speaking...",
// // //     autoplayError: "Autoplay failed. Please click 'Play Explanation' to start the audio lesson.",
// // //     footer: "The arrows show the Counter-Clockwise path (Right) counting positions from David.",
// // //     rightLabel1st: "1st Right",
// // //     rightLabel2nd: "2nd Right",
// // //     speechText: "Starting from David and moving counter-clockwise, Prabhat is the first person to the right of David. After Prabhat, Tom is the second person to the right of David. We count positions sequentially in the counter-clockwise direction.",
// // //   },
// // //   hi: {
// // //     title: "गोलाकार व्यवस्था: क्रमवाचक दिशा पाठ (दाएँ)",
// // //     instruction: "डेविड के सापेक्ष पहला दाएँ और दूसरा दाएँ स्थितियों का प्रदर्शन।",
// // //     explanation: (
// // //       <div className="space-y-3">
// // //         <p className="font-semibold text-xl text-gray-900 dark:text-gray-50 text-center p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg" style={{ lineHeight: '1.8' }}>
// // //           <span className="text-blue-600 dark:text-blue-400 font-extrabold">प्रभात</span> डेविड से **दाएँ में पहला** व्यक्ति है।
// // //         </p>
// // //         <p className="font-semibold text-xl text-gray-900 dark:text-gray-50 text-center p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg" style={{ lineHeight: '1.8' }}>
// // //           <span className="text-red-600 dark:text-red-400 font-extrabold">टॉम</span> डेविड से **दाएँ में दूसरा** व्यक्ति है।
// // //         </p>
// // //         <p className="text-sm italic text-gray-600 dark:text-gray-300 text-center p-1 border-t dark:border-gray-600 pt-2" style={{ fontFamily: 'serif' }}>
// // //           केंद्र की ओर मुख करते समय, **दाएँ** का अर्थ वामावर्त होता है।
// // //         </p>
// // //       </div>
// // //     ),
// // //     playButton: "व्याख्या चलाएँ",
// // //     loading: "आवाज़ उत्पन्न हो रही है...",
// // //     speaking: "अब बोल रहा है...",
// // //     autoplayError: "ऑटोप्ले विफल रहा। ऑडियो पाठ शुरू करने के लिए 'व्याख्या चलाएँ' पर क्लिक करें।",
// // //     footer: "तीर डेविड से शुरू होकर वामावर्त (दाएँ) दिशा में स्थितियों की गिनती दिखाते हैं।",
// // //     rightLabel1st: "1st दाएँ",
// // //     rightLabel2nd: "2nd दाएँ",
// // //     speechText: "डेविड से शुरू करके और वामावर्त चलते हुए, प्रभात डेविड के दाएँ में पहला व्यक्ति है। प्रभात के बाद, टॉम डेविड के दाएँ में दूसरा व्यक्ति है। हम स्थितियों को वामावर्त दिशा में क्रमिक रूप से गिनते हैं।",
// // //   },
// // // };

// // // const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
// // //   const binaryString = atob(base64);
// // //   const len = binaryString.length;
// // //   const bytes = new Uint8Array(len);
// // //   for (let i = 0; i < len; i++) {
// // //     bytes[i] = binaryString.charCodeAt(i);
// // //   }
// // //   return bytes.buffer;
// // // };

// // // const pcmToWav = (pcm16: Int16Array, sampleRate: number): Blob => {
// // //   const buffer = new ArrayBuffer(44 + pcm16.length * 2);
// // //   const view = new DataView(buffer);
  
// // //   const writeString = (offset: number, str: string) => {
// // //     for (let i = 0; i < str.length; i++) {
// // //       view.setUint8(offset + i, str.charCodeAt(i));
// // //     }
// // //   };

// // //   let offset = 0;
// // //   writeString(offset, 'RIFF'); offset += 4;
// // //   view.setUint32(offset, 36 + pcm16.length * 2, true); offset += 4;
// // //   writeString(offset, 'WAVE'); offset += 4;
// // //   view.setUint32(offset, 16, true); offset += 4;
// // //   view.setUint16(offset, 1, true); offset += 2;
// // //   view.setUint16(offset, 1, true); offset += 2;
// // //   view.setUint32(offset, sampleRate, true); offset += 4;
// // //   view.setUint32(offset, sampleRate * 2, true); offset += 4;
// // //   view.setUint16(offset, 2, true); offset += 2;
// // //   view.setUint16(offset, 16, true); offset += 2;
// // //   writeString(offset, 'data'); offset += 4;
// // //   view.setUint32(offset, pcm16.length * 2, true); offset += 4;

// // //   for (let i = 0; i < pcm16.length; i++, offset += 2) {
// // //     view.setInt16(offset, pcm16[i], true);
// // //   }

// // //   return new Blob([buffer], { type: 'audio/wav' });
// // // };

// // // interface CircularArrangementProps {
// // //   slots: PlaceholderSlot[];
// // //   circleSize: number;
// // //   language: Language;
// // //   currentStep: number;
// // //   highlightedPerson: string | null;
// // // }

// // // const CircularArrangement: React.FC<CircularArrangementProps> = ({
// // //   slots,
// // //   circleSize,
// // //   language,
// // //   currentStep,
// // //   highlightedPerson
// // // }) => {
// // //   const personSize = Math.max(circleSize * 0.35, 60); 
// // //   const radius = circleSize / 2;
// // //   const offset = personSize / 2;
// // //   const T = translations[language];

// // //   const getPositionStyle = (position: PlaceholderSlot['position']): CSSProperties => {
// // //     switch (position) {
// // //       case 'top': return { top: -offset, left: radius - offset };
// // //       case 'right': return { top: radius - offset, right: -offset };
// // //       case 'bottom': return { bottom: -offset, left: radius - offset };
// // //       case 'left': return { top: radius - offset, left: -offset };
// // //       default: return {};
// // //     }
// // //   };

// // //   const renderSlots = () => {
// // //     return slots.map((slot) => {
// // //       const slotStyle: CSSProperties = {
// // //         ...getPositionStyle(slot.position),
// // //         width: `${personSize}px`,
// // //         height: `${personSize}px`,
// // //       };

// // //       const size = Math.round(personSize);
// // //       let imageUrl = '';
// // //       let text = '';

// // //       if (slot.occupant === 'Tom') {
// // //         text = 'TOM'; 
// // //         imageUrl = `https://placehold.co/${size}x${size}/dc2626/ffffff?text=${text}`;
// // //       } else if (slot.occupant === 'Prabhat') {
// // //         text = 'PRAB'; 
// // //         imageUrl = `https://placehold.co/${size}x${size}/10b981/ffffff?text=${text}`;
// // //       } else if (slot.occupant === 'Akash') {
// // //         text = 'AKAS'; 
// // //         imageUrl = `https://placehold.co/${size}x${size}/3b82f6/ffffff?text=${text}`;
// // //       } else if (slot.occupant === 'David') {
// // //         text = 'DAVI'; 
// // //         imageUrl = `https://placehold.co/${size}x${size}/f97316/ffffff?text=${text}`;
// // //       }

// // //       const nameDistance = personSize * 0.05;
// // //       const externalOffset = offset * 1.5;
// // //       const isOccupied = slot.occupant;

// // //       return (
// // //         <div key={slot.id}>
// // //           <div
// // //             className={`absolute rounded-full shadow-lg transition-all duration-500 flex justify-center items-center ${
// // //               isOccupied 
// // //                 ? 'border-4 border-white bg-white dark:bg-gray-700' 
// // //                 : 'bg-transparent' // Empty slots are transparent
// // //             } ${isOccupied && highlightedPerson === slot.occupant ? 'ring-4 ring-offset-2 ring-yellow-500 shadow-2xl scale-110' : ''}`}
// // //             style={slotStyle}
// // //           >
// // //             {isOccupied ? (
// // //               <img
// // //                 src={imageUrl}
// // //                 alt={slot.occupant}
// // //                 className="w-full h-full rounded-full object-cover"
// // //               />
// // //             ) : (
// // //               // Display EMPTY label
// // //               <div className="text-gray-400 dark:text-gray-500 text-lg font-bold">
// // //                 {slot.label}
// // //               </div>
// // //             )}
// // //           </div>

// // //           {isOccupied && (
// // //             <span
// // //               className="absolute font-bold"
// // //               style={{
// // //                 zIndex: 20,
// // //                 fontSize: '1.1rem',
// // //                 color: slot.occupant === 'Tom' ? '#dc2626' : slot.occupant === 'Prabhat' ? '#10b981' : slot.occupant === 'Akash' ? '#3b82f6' : '#f97316',
                
// // //                 ...(slot.position === 'top' && { 
// // //                     top: -externalOffset, 
// // //                     left: radius,
// // //                     transform: `translateX(-50%) translateY(-${personSize * 0.8}px)`
// // //                 }),
// // //                 ...(slot.position === 'right' && { 
// // //                     top: radius, 
// // //                     right: -externalOffset,
// // //                     transform: `translateX(${nameDistance * 4}px) translateY(-50%)` 
// // //                 }),
// // //                 ...(slot.position === 'bottom' && {
// // //                     bottom: -externalOffset,
// // //                     left: radius,
// // //                     transform: `translateX(-50%) translateY(${personSize * 0.3}px)`
// // //                 }),
// // //               }}
// // //             >
// // //               {slot.occupant}
// // //             </span>
// // //           )}
// // //         </div>
// // //       );
// // //     });
// // //   };

// // //   const renderDirectionArrow = () => {
// // //     if (currentStep < 1) return null;

// // //     const R_Circle = circleSize / 2;
// // //     const ARROW_OFFSET = 75; 
// // //     const offsetCalc = personSize / 2;
// // //     const mugSize = 48;
// // //     const lineStrokeColor = '#3b82f6';
// // //     const viewBoxSize = circleSize + ARROW_OFFSET * 4; 

// // //     const STROKE_WIDTH = 2;
// // //     const MARKER_SIZE = 8;
// // //     const angleMap: Record<PlaceholderSlot['position'], number> = {
// // //         'top': 1.5 * Math.PI, // 12 PM (270 deg)
// // //         'bottom': 0.5 * Math.PI, // 6 PM (90 deg)
// // //         'left': 1.0 * Math.PI, // 9 PM (180 deg)
// // //         'right': 0 * Math.PI, // 3 PM (0 deg)
// // //     };
    
// // //     // Arrows based on current arrangement: David(Bottom) -> Prabhat(Right) -> Tom(Top)
    
// // //     // 1. 1st Right (David -> Prabhat) - Inner Arc (Blue) - Renders at Step 1
// // //     const arrow1 = {
// // //         start: 'bottom' as const, end: 'right' as const, label: T.rightLabel1st, color: '#3b82f6', isLeft: false, offset: 5, highlightName: 'Prabhat'
// // //     };
// // //     // 2. 2nd Right (David -> Tom) - Outer Arc (Red) - Renders at Step 2
// // //     const arrow2 = {
// // //         start: 'bottom' as const, end: 'top' as const, label: T.rightLabel2nd, color: '#dc2626', isLeft: false, offset: 65, highlightName: 'Tom' 
// // //     };


// // //     const renderSingleArrow = (arrowData: typeof arrow1 | typeof arrow2) => {
// // //         if (arrowData.label === T.rightLabel2nd && currentStep < 2) return null;

// // //         const arrowColor = arrowData.highlightName === highlightedPerson || highlightedPerson === 'David' ? '#ffc107' : arrowData.color;

// // //         const arrowRadius = R_Circle + ARROW_OFFSET + arrowData.offset;
        
// // //         const startAngle = angleMap[arrowData.start];
// // //         const endAngle = angleMap[arrowData.end];
        
// // //         // --- Counter-Clockwise Path Calculation ---
// // //         const sweepFlag = 0; // 0 for Counter-Clockwise (Right)
        
// // //         const startX = R_Circle + arrowRadius * Math.cos(startAngle);
// // //         const startY = R_Circle + arrowRadius * Math.sin(startAngle);

// // //         const endX = R_Circle + arrowRadius * Math.cos(endAngle);
// // //         const endY = R_Circle + arrowRadius * Math.sin(endAngle);

// // //         // Adjusted path to ensure CCW movement is drawn correctly
// // //         const arrowPath = `M ${startX} ${startY} A ${arrowRadius} ${arrowRadius} 0 0 ${sweepFlag} ${endX} ${endY}`;
        
// // //         // --- Label Positioning Logic ---
// // //         // Increased label offset for better separation from the arc
// // //         const labelRadius = arrowRadius + 20; // Reduced separation slightly
// // //         let preciseLabelAngle;

// // //         // Positioning for CCW arcs:
// // //         if (arrowData.label === T.rightLabel1st) { // David -> Prabhat (Inner Arc)
// // //             // Angle set to be near 45 degrees (0.25 PI)
// // //             preciseLabelAngle = 0.25 * Math.PI; 
// // //         } else { // David -> Tom (Outer Arc)
// // //             // Corrected angle for the outer arc to sit in the Top-Right quadrant
// // //             preciseLabelAngle = 0.35 * Math.PI; 
// // //         }

// // //         const labelX = R_Circle + labelRadius * Math.cos(preciseLabelAngle);
// // //         const labelY = R_Circle + labelRadius * Math.sin(preciseLabelAngle);


// // //         return (
// // //             <React.Fragment key={arrowData.label}>
// // //                 <path
// // //                     d={arrowPath}
// // //                     fill="none"
// // //                     stroke={arrowColor} 
// // //                     strokeWidth={STROKE_WIDTH}
// // //                     markerEnd={`url(#mainArrowhead-${arrowData.color.replace('#', '')})`}
// // //                     className={`transition-all duration-300 ${arrowData.highlightName === highlightedPerson || highlightedPerson === 'David' ? 'filter drop-shadow(0 0 4px #ffc107)' : ''}`}
// // //                 />
// // //                 <text
// // //                     x={labelX}
// // //                     y={labelY}
// // //                     className="font-extrabold transition-all duration-300"
// // //                     fill={arrowColor} 
// // //                     style={{ fontSize: '1.1rem', textShadow: '0 0 4px rgba(0,0,0,0.2)' }}
// // //                     textAnchor="middle"
// // //                     dominantBaseline="middle"
// // //                 >
// // //                     {arrowData.label}
// // //                 </text>
// // //             </React.Fragment>
// // //         );
// // //     };

// // //     return (
// // //       <>
// // //         <svg
// // //           className="absolute"
// // //           style={{
// // //             top: -ARROW_OFFSET * 2, 
// // //             left: -ARROW_OFFSET * 2,
// // //             width: viewBoxSize,
// // //             height: viewBoxSize,
// // //             zIndex: 5
// // //           }}
// // //           viewBox={`${-ARROW_OFFSET * 2} ${-ARROW_OFFSET * 2} ${viewBoxSize} ${viewBoxSize}`}
// // //           preserveAspectRatio="xMidYMid meet"
// // //         >
// // //           <defs>
// // //             <marker id="facingArrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
// // //               <path d="M 0 0 L 6 3 L 0 6 z" fill={lineStrokeColor} />
// // //             </marker>
// // //             <marker id="mainArrowhead-3b82f6" markerWidth={MARKER_SIZE} markerHeight={MARKER_SIZE} refX={MARKER_SIZE * 0.8} refY={MARKER_SIZE * 0.5} orient="auto">
// // //               <path d={`M 0 0 L ${MARKER_SIZE} ${MARKER_SIZE * 0.5} L 0 ${MARKER_SIZE} z`} fill="#3b82f6" />
// // //             </marker>
// // //             <marker id="mainArrowhead-dc2626" markerWidth={MARKER_SIZE} markerHeight={MARKER_SIZE} refX={MARKER_SIZE * 0.8} refY={MARKER_SIZE * 0.5} orient="auto">
// // //               <path d={`M 0 0 L ${MARKER_SIZE} ${MARKER_SIZE * 0.5} L 0 ${MARKER_SIZE} z`} fill="#dc2626" />
// // //             </marker>
// // //           </defs>

// // //           {renderSingleArrow(arrow1)} 
// // //           {renderSingleArrow(arrow2)}

// // //           {slots.filter(s => s.occupant).map((slot, i) => {
// // //               const angle = angleMap[slot.position];
// // //               return (
// // //                   <path
// // //                       key={i}
// // //                       d={`M ${R_Circle + radius * Math.cos(angle) * (1 - offsetCalc/radius)} ${R_Circle + radius * Math.sin(angle) * (1 - offsetCalc/radius)} L ${R_Circle + mugSize * 0.5 * Math.cos(angle - Math.PI) * -1} ${R_Circle + mugSize * 0.5 * Math.sin(angle - Math.PI) * -1}`}
// // //                       fill="none"
// // //                       stroke={lineStrokeColor}
// // //                       strokeWidth="2"
// // //                       markerEnd="url(#facingArrowhead)"
// // //                       strokeDasharray="4,3"
// // //                   />
// // //               );
// // //           })}
// // //         </svg>

// // //         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 10 }}>
// // //           <div
// // //             className="relative bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-full shadow-lg flex items-center justify-center"
// // //             style={{ width: mugSize, height: mugSize }}
// // //           >
// // //             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
// // //               <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
// // //             </svg>
// // //           </div>
// // //         </div>
// // //       </>
// // //     );
// // //   };

// // //   return (
// // //     <div className="flex flex-col items-center p-4">
// // //       <div style={{ padding: `${offset + 5 + 130}px` }}>
// // //         <div
// // //           className="relative border-4 border-blue-500 dark:border-blue-300 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-xl transition-all duration-300"
// // //           style={{ width: circleSize, height: circleSize }}
// // //         >
// // //           {renderDirectionArrow()}
// // //           {renderSlots()}
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // const App: React.FC = () => {
// // //   const [audioUrl, setAudioUrl] = useState<string | null>(null);
// // //   const [isLoading, setIsLoading] = useState(false);
// // //   const [isSpeaking, setIsSpeaking] = useState(false);
// // //   const [isDarkMode, useStateIsDarkMode] = useState(false);
// // //   const [circleSize, setCircleSize] = useState(300); 
// // //   const [playbackError, setPlaybackError] = useState<string | null>(null); 
// // //   const [language, setLanguage] = useState<Language>('en'); 
// // //   const [currentStep, setCurrentStep] = useState(0);
// // //   const [highlightedPersonState, setHighlightedPersonState] = useState<string | null>(null);


// // //   const T = translations[language];

// // //   const handleHighlightSequence = () => {
// // //     setIsSpeaking(true);
// // //     setHighlightedPersonState(null);
// // //     setCurrentStep(0);
    
// // //     // Phase 1: 1st Right (Prabhat)
// // //     // Audio: "Starting from David and moving counter-clockwise, Prabhat is the first person to the right of David."
// // //     setTimeout(() => { setCurrentStep(1); }, 1500); 
// // //     setTimeout(() => { setHighlightedPersonState('David'); }, 3500); 
// // //     setTimeout(() => { setHighlightedPersonState('Prabhat'); }, 4500); 
    
// // //     // Phase 2: 2nd Right (Tom)
// // //     // Audio: "After Prabhat, Tom is the second person to the right of David. We count positions sequentially in the counter-clockwise direction."
// // //     setTimeout(() => { setCurrentStep(2); }, 7500); 
// // //     setTimeout(() => { setHighlightedPersonState('David'); }, 8000); 
// // //     setTimeout(() => { setHighlightedPersonState('Tom'); }, 9500); 

// // //     // End sequence
// // //     setTimeout(() => { setHighlightedPersonState(null); setIsSpeaking(false); }, 11500);
// // //   };
  
// // //   const synthesizeSpeech = async () => {
// // //     if (isLoading || isSpeaking) return;
// // //     setPlaybackError(null);

// // //     const playAudio = async (url: string) => {
// // //       const audio = new Audio(url); 
// // //       audio.type = 'audio/wav'; 
      
// // //       return new Promise<void>((resolve, reject) => {
// // //         // Use timeout to handle the case where oncanplaythrough never fires due to decoding error
// // //         const timeout = setTimeout(() => {
// // //             reject(new Error("Audio load timed out"));
// // //         }, 5000); // 5 second timeout

// // //         audio.oncanplaythrough = async () => {
// // //           clearTimeout(timeout);
// // //           try {
// // //             await audio.play();
// // //             resolve();
// // //           } catch (e) {
// // //             reject(e);
// // //           }
// // //         };
// // //         audio.onerror = (e) => {
// // //           clearTimeout(timeout);
// // //           console.error("Audio Load Error:", e);
// // //           reject(new Error("Audio load failed"));
// // //         };
// // //         audio.load();
// // //       });
// // //     };

// // //     if (audioUrl) {
// // //       try {
// // //         await playAudio(audioUrl);
// // //         handleHighlightSequence();
// // //       } catch (e: any) {
// // //         if (e.name === 'NotAllowedError' || e.message?.includes('interact with the document')) {
// // //             setIsSpeaking(false);
// // //             setHighlightedPersonState(null);
// // //             setPlaybackError(T.autoplayError);
// // //         } else {
// // //             console.error("Audio playback failed (2):", e);
// // //         }
// // //       }
// // //       return;
// // //     }

// // //     setIsLoading(true);
// // //     const apiKey = ""; 
    
// // //     const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

// // //     const payload = {
// // //         contents: [{ parts: [{ text: T.speechText }] }],
// // //         generationConfig: {
// // //             responseModalities: ["AUDIO"],
// // //             speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } } 
// // //         },
// // //         model: "gemini-2.5-flash-preview-tts"
// // //     };

// // //     try {
// // //         const response = await fetch(apiUrl, {
// // //             method: 'POST', 
// // //             headers: { 'Content-Type': 'application/json' }, 
// // //             body: JSON.stringify(payload)
// // //         });
        
// // //         if (!response.ok) {
// // //             setIsLoading(false);
// // //             return;
// // //         }

// // //         const result = await response.json();
// // //         const part = result?.candidates?.[0]?.content?.parts?.[0];
// // //         const audioData = part?.inlineData?.data;
// // //         const mimeType = part?.inlineData?.mimeType;

// // //         if (audioData && mimeType && mimeType.startsWith("audio/L16")) {
// // //             const rateMatch = mimeType.match(/rate=(\d+)/);
// // //             const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;
            
// // //             const pcmData = base64ToArrayBuffer(audioData);
// // //             const pcm16 = new Int16Array(pcmData);
// // //             const wavBlob = pcmToWav(pcm16, sampleRate);
// // //             const url = URL.createObjectURL(wavBlob);
            
// // //             setAudioUrl(url);
            
// // //             try {
// // //               await playAudio(url);
// // //               handleHighlightSequence();
// // //             } catch (e: any) {
// // //                if (e.name === 'NotAllowedError' || e.message?.includes('interact with the document')) {
// // //                   setIsSpeaking(false);
// // //                   setHighlightedPersonState(null);
// // //                   setPlaybackError(T.autoplayError);
// // //               } else {
// // //                   console.error("Audio playback failed (3):", e);
// // //                   handleHighlightSequence(); // Start visuals even if audio fails
// // //               }
// // //             }
            
// // //         } else {
// // //             handleHighlightSequence(); // Fallback to visual only
// // //         }
// // //     } catch (error) {
// // //         handleHighlightSequence(); // Fallback to visual only
// // //     } finally {
// // //         setIsLoading(false);
// // //     }
// // //   };


// // //   useEffect(() => {
// // //     // Added dependency cleanup to prevent audio loading in background
// // //     if (audioUrl) {
// // //       URL.revokeObjectURL(audioUrl);
// // //       setAudioUrl(null);
// // //     }
// // //   }, [language]);

// // //   useEffect(() => {
// // //     if (isDarkMode) { 
// // //       document.documentElement.classList.add('dark'); 
// // //     } else { 
// // //       document.documentElement.classList.remove('dark'); 
// // //     }

// // //     const calculateSize = () => {
// // //       const size = Math.min(window.innerWidth * 0.85, 300);
// // //       setCircleSize(size);
// // //     };

// // //     calculateSize();
// // //     window.addEventListener('resize', calculateSize);
// // //     return () => window.removeEventListener('resize', calculateSize);
// // //   }, [isDarkMode]);

// // //   useEffect(() => {
// // //     setAudioUrl(null); 
// // //     setPlaybackError(null);
// // //   }, [language]);
  
// // //   const baseSlots: PlaceholderSlot[] = [
// // //     { id: 'top', position: 'top', label: 'EMPTY', occupant: null, isFixed: false }, // Tom slot
// // //     { id: 'bottom', position: 'bottom', label: 'David', occupant: 'David', isFixed: true }, // Fixed Reference
// // //     { id: 'left', position: 'left', label: 'EMPTY', occupant: null, isFixed: false }, // Akash slot (unused)
// // //     { id: 'right', position: 'right', label: 'EMPTY', occupant: null, isFixed: false }, // Prabhat slot
// // //   ];
  
// // //   const currentSlots = baseSlots.map(slot => {
// // //     if (slot.id === 'right' && currentStep >= 1) {
// // //         return { ...slot, occupant: 'Prabhat', label: 'Prabhat' };
// // //     }
// // //     if (slot.id === 'top' && currentStep >= 2) {
// // //         return { ...slot, occupant: 'Tom', label: 'Tom' };
// // //     }
// // //     return slot;
// // //   });

// // //   const toggleDarkMode = () => useStateIsDarkMode(prev => !prev);

// // //   const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// // //     setLanguage(e.target.value as Language);
// // //   };


// // //   return (
// // //     <div className={isDarkMode ? 'dark' : ''}>
// // //       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500 p-4 sm:p-6 flex flex-col items-center font-sans">
// // //         <div className="w-full max-w-4xl space-y-4 flex flex-col flex-grow">
// // //           <header className="flex flex-col sm:flex-row justify-between items-center w-full space-y-4 sm:space-y-0 pb-4 flex-shrink-0">
// // //             <h1 className="text-xl sm:text-3xl font-extrabold text-gray-800 dark:text-white text-center sm:text-left flex-grow">
// // //               {T.title}
// // //             </h1>
// // //             <div className="flex space-x-4 items-center">
// // //               <select
// // //                 value={language}
// // //                 onChange={handleLanguageChange}
// // //                 className="p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
// // //               >
// // //                 <option value="en">English</option>
// // //                 <option value="hi">हिन्दी (Hindi)</option>
// // //               </select>
// // //               <button
// // //                 onClick={toggleDarkMode}
// // //                 className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-yellow-400 shadow-md hover:ring-2 ring-blue-500 dark:ring-blue-300 transition-all duration-300"
// // //               >
// // //                 {isDarkMode ? (
// // //                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// // //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
// // //                   </svg>
// // //                 ) : (
// // //                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// // //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
// // //                   </svg>
// // //                 )}
// // //               </button>
// // //             </div>
// // //           </header>

// // //           <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border-t-4 border-green-500 flex-grow"> 
            
// // //             {/* Instruction/Status Box */}
// // //             <div className="p-4 sm:p-6 bg-blue-50 dark:bg-blue-900 rounded-lg border-2 border-blue-200 dark:border-blue-700 shadow-inner mb-4">
// // //               <h2 className="text-xl sm:text-2xl font-extrabold text-blue-800 dark:text-blue-200 text-center mb-2">
// // //                 {T.instruction}
// // //               </h2>
// // //               {playbackError && (
// // //                   <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-2 rounded mb-3 text-sm font-medium text-center w-full max-w-sm mx-auto">
// // //                       {playbackError}
// // //                   </div>
// // //               )}
// // //               <div className="flex justify-center">
// // //                 <button
// // //                   onClick={synthesizeSpeech}
// // //                   disabled={isLoading || isSpeaking}
// // //                   className={`flex items-center px-6 py-3 rounded-full font-bold text-white shadow-lg transition duration-200 
// // //                     ${isLoading || isSpeaking ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:bg-green-800'}`}
// // //                 >
// // //                     {isLoading ? (
// // //                         <>
// // //                             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// // //                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// // //                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// // //                             </svg>
// // //                             {T.loading}
// // //                         </>
// // //                     ) : (
// // //                         <>
// // //                             <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
// // //                                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
// // //                             </svg>
// // //                             {isSpeaking ? T.speaking : T.playButton}
// // //                         </>
// // //                     )}
// // //                 </button>
// // //               </div>
// // //             </div>

// // //             <CircularArrangement
// // //               slots={currentSlots}
// // //               circleSize={circleSize}
// // //               language={language}
// // //               currentStep={currentStep}
// // //               highlightedPerson={highlightedPersonState}
// // //             />

// // //             <div className="w-full bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-400 dark:border-blue-600 p-4 rounded-lg shadow-md mt-4">
// // //               <div className="text-gray-700 dark:text-gray-200 leading-relaxed">
// // //                 {T.explanation}
// // //               </div>
// // //             </div>
// // //           </div>

// // //           <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4 pb-2 flex-shrink-0">
// // //             <p>{T.footer}</p>
// // //           </div>
// // //         </div>
// // //       </div>
// // //     </div>
// // //   );
// // // };

// // // export default App;

// // import React, { useState, useEffect, CSSProperties } from 'react';

// // type Language = 'en' | 'hi';

// // interface PlaceholderSlot {
// //   id: string;
// //   position: 'top' | 'right' | 'bottom' | 'left';
// //   label: string;
// //   occupant: string | null;
// //   isFixed: boolean;
// // }

// // interface Translation {
// //   title: string;
// //   instruction: string;
// //   explanation: React.ReactNode;
// //   playButton: string;
// //   loading: string;
// //   speaking: string;
// //   autoplayError: string;
// //   footer: string;
// //   rightLabel1st: string;
// //   rightLabel2nd: string;
// //   speechText: string;
// // }

// // const translations: Record<Language, Translation> = {
// //   en: {
// //     title: "Circular Arrangement: Ordinal Direction Lesson (Right)",
// //     instruction: "Demonstrating 1st Right and 2nd Right positions relative to David.",
// //     explanation: (
// //       <div className="space-y-3">
// //         <p className="font-semibold text-xl text-gray-900 dark:text-gray-50 text-center p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg">
// //           <span className="text-blue-600 dark:text-blue-400 font-extrabold">Prabhat</span> is the 1st to the **Right** of David.
// //         </p>
// //         <p className="font-semibold text-xl text-gray-900 dark:text-gray-50 text-center p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg">
// //           <span className="text-red-600 dark:text-red-400 font-extrabold">Tom</span> is the 2nd to the **Right** of David.
// //         </p>
// //         <p className="text-sm italic text-gray-600 dark:text-gray-300 text-center p-1 border-t dark:border-gray-600 pt-2">
// //           **Right** means Counter-Clockwise when everyone is facing the center.
// //         </p>
// //       </div>
// //     ),
// //     playButton: "Play Explanation",
// //     loading: "Generating Voice...",
// //     speaking: "Now Speaking...",
// //     autoplayError: "Autoplay failed. Please click 'Play Explanation' to start the audio lesson.",
// //     footer: "The arrows show the Counter-Clockwise path (Right) counting positions from David.",
// //     rightLabel1st: "1st Right",
// //     rightLabel2nd: "2nd Right",
// //     speechText: "Starting from David and moving counter-clockwise, Prabhat is the first person to the right of David. After Prabhat, Tom is the second person to the right of David. We count positions sequentially in the counter-clockwise direction.",
// //   },
// //   hi: {
// //     title: "गोलाकार व्यवस्था: क्रमवाचक दिशा पाठ (दाएँ)",
// //     instruction: "डेविड के सापेक्ष पहला दाएँ और दूसरा दाएँ स्थितियों का प्रदर्शन।",
// //     explanation: (
// //       <div className="space-y-3">
// //         <p className="font-semibold text-xl text-gray-900 dark:text-gray-50 text-center p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg" style={{ lineHeight: '1.8' }}>
// //           <span className="text-blue-600 dark:text-blue-400 font-extrabold">प्रभात</span> डेविड से **दाएँ में पहला** व्यक्ति है।
// //         </p>
// //         <p className="font-semibold text-xl text-gray-900 dark:text-gray-50 text-center p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg" style={{ lineHeight: '1.8' }}>
// //           <span className="text-red-600 dark:text-red-400 font-extrabold">टॉम</span> डेविड से **दाएँ में दूसरा** व्यक्ति है।
// //         </p>
// //         <p className="text-sm italic text-gray-600 dark:text-gray-300 text-center p-1 border-t dark:border-gray-600 pt-2" style={{ fontFamily: 'serif' }}>
// //           केंद्र की ओर मुख करते समय, **दाएँ** का अर्थ वामावर्त होता है।
// //         </p>
// //       </div>
// //     ),
// //     playButton: "व्याख्या चलाएँ",
// //     loading: "आवाज़ उत्पन्न हो रही है...",
// //     speaking: "अब बोल रहा है...",
// //     autoplayError: "ऑटोप्ले विफल रहा। ऑडियो पाठ शुरू करने के लिए 'व्याख्या चलाएँ' पर क्लिक करें।",
// //     footer: "तीर डेविड से शुरू होकर वामावर्त (दाएँ) दिशा में स्थितियों की गिनती दिखाते हैं।",
// //     rightLabel1st: "1st दाएँ",
// //     rightLabel2nd: "2nd दाएँ",
// //     speechText: "डेविड से शुरू करके और वामावर्त चलते हुए, प्रभात डेविड के दाएँ में पहला व्यक्ति है। प्रभात के बाद, टॉम डेविड के दाएँ में दूसरा व्यक्ति है। हम स्थितियों को वामावर्त दिशा में क्रमिक रूप से गिनते हैं।",
// //   },
// // };

// // const base64ToArrayBuffer = (base64: string): ArrayBuffer => {
// //   const binaryString = atob(base64);
// //   const len = binaryString.length;
// //   const bytes = new Uint8Array(len);
// //   for (let i = 0; i < len; i++) {
// //     bytes[i] = binaryString.charCodeAt(i);
// //   }
// //   return bytes.buffer;
// // };

// // const pcmToWav = (pcm16: Int16Array, sampleRate: number): Blob => {
// //   const buffer = new ArrayBuffer(44 + pcm16.length * 2);
// //   const view = new DataView(buffer);
  
// //   const writeString = (offset: number, str: string) => {
// //     for (let i = 0; i < str.length; i++) {
// //       view.setUint8(offset + i, str.charCodeAt(i));
// //     }
// //   };

// //   let offset = 0;
// //   writeString(offset, 'RIFF'); offset += 4;
// //   view.setUint32(offset, 36 + pcm16.length * 2, true); offset += 4;
// //   writeString(offset, 'WAVE'); offset += 4;
// //   view.setUint32(offset, 16, true); offset += 4;
// //   view.setUint16(offset, 1, true); offset += 2;
// //   view.setUint16(offset, 1, true); offset += 2;
// //   view.setUint32(offset, sampleRate, true); offset += 4;
// //   view.setUint32(offset, sampleRate * 2, true); offset += 4;
// //   view.setUint16(offset, 2, true); offset += 2;
// //   view.setUint16(offset, 16, true); offset += 2;
// //   writeString(offset, 'data'); offset += 4;
// //   view.setUint32(offset, pcm16.length * 2, true); offset += 4;

// //   for (let i = 0; i < pcm16.length; i++, offset += 2) {
// //     view.setInt16(offset, pcm16[i], true);
// //   }

// //   return new Blob([buffer], { type: 'audio/wav' });
// // };

// // interface CircularArrangementProps {
// //   slots: PlaceholderSlot[];
// //   circleSize: number;
// //   language: Language;
// //   currentStep: number;
// //   highlightedPerson: string | null;
// // }

// // const CircularArrangement: React.FC<CircularArrangementProps> = ({
// //   slots,
// //   circleSize,
// //   language,
// //   currentStep,
// //   highlightedPerson
// // }) => {
// //   const personSize = Math.max(circleSize * 0.35, 60); 
// //   const radius = circleSize / 2;
// //   const offset = personSize / 2;
// //   const T = translations[language];

// //   const getPositionStyle = (position: PlaceholderSlot['position']): CSSProperties => {
// //     switch (position) {
// //       case 'top': return { top: -offset, left: radius - offset };
// //       case 'right': return { top: radius - offset, right: -offset };
// //       case 'bottom': return { bottom: -offset, left: radius - offset };
// //       case 'left': return { top: radius - offset, left: -offset };
// //       default: return {};
// //     }
// //   };

// //   const renderSlots = () => {
// //     return slots.map((slot) => {
// //       const slotStyle: CSSProperties = {
// //         ...getPositionStyle(slot.position),
// //         width: `${personSize}px`,
// //         height: `${personSize}px`,
// //       };

// //       const size = Math.round(personSize);
// //       let imageUrl = '';
// //       let text = '';

// //       if (slot.occupant === 'Tom') {
// //         text = 'TOM'; 
// //         imageUrl = `https://placehold.co/${size}x${size}/dc2626/ffffff?text=${text}`;
// //       } else if (slot.occupant === 'Prabhat') {
// //         text = 'PRAB'; 
// //         imageUrl = `https://placehold.co/${size}x${size}/10b981/ffffff?text=${text}`;
// //       } else if (slot.occupant === 'Akash') {
// //         text = 'AKAS'; 
// //         imageUrl = `https://placehold.co/${size}x${size}/3b82f6/ffffff?text=${text}`;
// //       } else if (slot.occupant === 'David') {
// //         text = 'DAVI'; 
// //         imageUrl = `https://placehold.co/${size}x${size}/f97316/ffffff?text=${text}`;
// //       }

// //       const nameDistance = personSize * 0.05;
// //       const externalOffset = offset * 1.5;
// //       const isOccupied = slot.occupant;

// //       return (
// //         <div key={slot.id}>
// //           <div
// //             className={`absolute rounded-full shadow-lg transition-all duration-500 flex justify-center items-center ${
// //               isOccupied 
// //                 ? 'border-4 border-white bg-white dark:bg-gray-700' 
// //                 : 'bg-transparent'
// //             } ${isOccupied && highlightedPerson === slot.occupant ? 'ring-4 ring-offset-2 ring-yellow-500 shadow-2xl scale-110' : ''}`}
// //             style={slotStyle}
// //           >
// //             {isOccupied ? (
// //               <img
// //                 src={imageUrl}
// //                 alt={slot.occupant}
// //                 className="w-full h-full rounded-full object-cover"
// //               />
// //             ) : (
// //               <div className="text-gray-400 dark:text-gray-500 text-lg font-bold">
// //                 {slot.label}
// //               </div>
// //             )}
// //           </div>

// //           {isOccupied && (
// //             <span
// //               className="absolute font-bold"
// //               style={{
// //                 zIndex: 20,
// //                 fontSize: '1.1rem',
// //                 color: slot.occupant === 'Tom' ? '#dc2626' : slot.occupant === 'Prabhat' ? '#10b981' : slot.occupant === 'Akash' ? '#3b82f6' : '#f97316',
                
// //                 ...(slot.position === 'top' && { 
// //                     top: -externalOffset, 
// //                     left: radius,
// //                     transform: `translateX(-50%) translateY(-${personSize * 0.8}px)`
// //                 }),
// //                 ...(slot.position === 'right' && { 
// //                     top: radius, 
// //                     right: -externalOffset,
// //                     transform: `translateX(${nameDistance * 4}px) translateY(-50%)` 
// //                 }),
// //                 ...(slot.position === 'bottom' && {
// //                     bottom: -externalOffset,
// //                     left: radius,
// //                     transform: `translateX(-50%) translateY(${personSize * 0.3}px)`
// //                 }),
// //               }}
// //             >
// //               {slot.occupant}
// //             </span>
// //           )}
// //         </div>
// //       );
// //     });
// //   };

// //   const renderDirectionArrow = () => {
// //     if (currentStep < 1) return null;

// //     const R_Circle = circleSize / 2;
// //     const ARROW_OFFSET = 75; 
// //     const offsetCalc = personSize / 2;
// //     const mugSize = 48;
// //     const lineStrokeColor = '#3b82f6';
// //     const viewBoxSize = circleSize + ARROW_OFFSET * 4; 

// //     const STROKE_WIDTH = 2;
// //     const MARKER_SIZE = 8;
// //     const angleMap: Record<PlaceholderSlot['position'], number> = {
// //         'top': 1.5 * Math.PI,
// //         'bottom': 0.5 * Math.PI,
// //         'left': 1.0 * Math.PI,
// //         'right': 0 * Math.PI,
// //     };
    
// //     const arrow1 = {
// //         start: 'bottom' as const, end: 'right' as const, label: T.rightLabel1st, color: '#3b82f6', isLeft: false, offset: 5, highlightName: 'Prabhat'
// //     };
// //     const arrow2 = {
// //         start: 'bottom' as const, end: 'top' as const, label: T.rightLabel2nd, color: '#dc2626', isLeft: false, offset: 65, highlightName: 'Tom'
// //     };

// //     const renderSingleArrow = (arrowData: typeof arrow1 | typeof arrow2) => {
// //         // Show 1st Right arrow when step >= 1, show 2nd Right arrow when step >= 2
// //         if (arrowData.label === T.rightLabel1st && currentStep < 1) return null;
// //         if (arrowData.label === T.rightLabel2nd && currentStep < 2) return null;

// //         const arrowColor = arrowData.highlightName === highlightedPerson || highlightedPerson === 'David' ? '#ffc107' : arrowData.color;

// //         const arrowRadius = R_Circle + ARROW_OFFSET + arrowData.offset;
        
// //         const startAngle = angleMap[arrowData.start];
// //         const endAngle = angleMap[arrowData.end];
        
// //         const sweepFlag = 0;
        
// //         const startX = R_Circle + arrowRadius * Math.cos(startAngle);
// //         const startY = R_Circle + arrowRadius * Math.sin(startAngle);

// //         const endX = R_Circle + arrowRadius * Math.cos(endAngle);
// //         const endY = R_Circle + arrowRadius * Math.sin(endAngle);

// //         const arrowPath = `M ${startX} ${startY} A ${arrowRadius} ${arrowRadius} 0 0 ${sweepFlag} ${endX} ${endY}`;
        
// //         const labelRadius = arrowRadius + 20; 
// //         let preciseLabelAngle;

// //         if (arrowData.label === T.rightLabel1st) {
// //             preciseLabelAngle = 0.25 * Math.PI; // First quadrant (bottom-right)
// //         } else {
// //             preciseLabelAngle = 1.75 * Math.PI; // First quadrant (top-right)
// //         }

// //         const labelX = R_Circle + labelRadius * Math.cos(preciseLabelAngle);
// //         const labelY = R_Circle + labelRadius * Math.sin(preciseLabelAngle);

// //         return (
// //             <React.Fragment key={arrowData.label}>
// //                 <path
// //                     d={arrowPath}
// //                     fill="none"
// //                     stroke={arrowColor} 
// //                     strokeWidth={STROKE_WIDTH}
// //                     markerEnd={`url(#mainArrowhead-${arrowData.color.replace('#', '')})`}
// //                     className={`transition-all duration-300 ${arrowData.highlightName === highlightedPerson || highlightedPerson === 'David' ? 'filter drop-shadow(0 0 4px #ffc107)' : ''}`}
// //                 />
// //                 <text
// //                     x={labelX}
// //                     y={labelY}
// //                     className="font-extrabold transition-all duration-300"
// //                     fill={arrowColor} 
// //                     style={{ fontSize: '1.1rem', textShadow: '0 0 4px rgba(0,0,0,0.2)' }}
// //                     textAnchor="middle"
// //                     dominantBaseline="middle"
// //                 >
// //                     {arrowData.label}
// //                 </text>
// //             </React.Fragment>
// //         );
// //     };

// //     return (
// //       <>
// //         <svg
// //           className="absolute"
// //           style={{
// //             top: -ARROW_OFFSET * 2, 
// //             left: -ARROW_OFFSET * 2,
// //             width: viewBoxSize,
// //             height: viewBoxSize,
// //             zIndex: 5
// //           }}
// //           viewBox={`${-ARROW_OFFSET * 2} ${-ARROW_OFFSET * 2} ${viewBoxSize} ${viewBoxSize}`}
// //           preserveAspectRatio="xMidYMid meet"
// //         >
// //           <defs>
// //             <marker id="facingArrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
// //               <path d="M 0 0 L 6 3 L 0 6 z" fill={lineStrokeColor} />
// //             </marker>
// //             <marker id="mainArrowhead-3b82f6" markerWidth={MARKER_SIZE} markerHeight={MARKER_SIZE} refX={MARKER_SIZE * 0.8} refY={MARKER_SIZE * 0.5} orient="auto">
// //               <path d={`M 0 0 L ${MARKER_SIZE} ${MARKER_SIZE * 0.5} L 0 ${MARKER_SIZE} z`} fill="#3b82f6" />
// //             </marker>
// //             <marker id="mainArrowhead-dc2626" markerWidth={MARKER_SIZE} markerHeight={MARKER_SIZE} refX={MARKER_SIZE * 0.8} refY={MARKER_SIZE * 0.5} orient="auto">
// //               <path d={`M 0 0 L ${MARKER_SIZE} ${MARKER_SIZE * 0.5} L 0 ${MARKER_SIZE} z`} fill="#dc2626" />
// //             </marker>
// //           </defs>

// //           {renderSingleArrow(arrow1)} 
// //           {renderSingleArrow(arrow2)}

// //           {slots.filter(s => s.occupant).map((slot, i) => {
// //               const angle = angleMap[slot.position];
// //               return (
// //                   <path
// //                       key={i}
// //                       d={`M ${R_Circle + radius * Math.cos(angle) * (1 - offsetCalc/radius)} ${R_Circle + radius * Math.sin(angle) * (1 - offsetCalc/radius)} L ${R_Circle + mugSize * 0.5 * Math.cos(angle - Math.PI) * -1} ${R_Circle + mugSize * 0.5 * Math.sin(angle - Math.PI) * -1}`}
// //                       fill="none"
// //                       stroke={lineStrokeColor}
// //                       strokeWidth="2"
// //                       markerEnd="url(#facingArrowhead)"
// //                       strokeDasharray="4,3"
// //                   />
// //               );
// //           })}
// //         </svg>

// //         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2" style={{ zIndex: 10 }}>
// //           <div
// //             className="relative bg-gradient-to-br from-blue-500 to-blue-600 dark:from-blue-400 dark:to-blue-500 rounded-full shadow-lg flex items-center justify-center"
// //             style={{ width: mugSize, height: mugSize }}
// //           >
// //             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
// //               <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
// //             </svg>
// //           </div>
// //         </div>
// //       </>
// //     );
// //   };

// //   return (
// //     <div className="flex flex-col items-center p-4">
// //       <div style={{ padding: `${offset + 5 + 130}px` }}>
// //         <div
// //           className="relative border-4 border-blue-500 dark:border-blue-300 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-xl transition-all duration-300"
// //           style={{ width: circleSize, height: circleSize }}
// //         >
// //           {renderDirectionArrow()}
// //           {renderSlots()}
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // const App: React.FC = () => {
// //   const [audioUrl, setAudioUrl] = useState<string | null>(null);
// //   const [isLoading, setIsLoading] = useState(false);
// //   const [isSpeaking, setIsSpeaking] = useState(false);
// //   const [isDarkMode, useStateIsDarkMode] = useState(false);
// //   const [circleSize, setCircleSize] = useState(300); 
// //   const [playbackError, setPlaybackError] = useState<string | null>(null); 
// //   const [language, setLanguage] = useState<Language>('en'); 
// //   const [currentStep, setCurrentStep] = useState(0);
// //   const [highlightedPersonState, setHighlightedPersonState] = useState<string | null>(null);

// //   const T = translations[language];

// //   const handleHighlightSequence = () => {
// //     setIsSpeaking(true);
// //     setHighlightedPersonState(null);
// //     setCurrentStep(0);
    
// //     setTimeout(() => { setCurrentStep(1); }, 500);
// //     setTimeout(() => { setHighlightedPersonState('David'); }, 1500); 
// //     setTimeout(() => { setHighlightedPersonState('Prabhat'); }, 2500); 
    
// //     setTimeout(() => { setCurrentStep(2); }, 4500);
// //     setTimeout(() => { setHighlightedPersonState('David'); }, 5000); 
// //     setTimeout(() => { setHighlightedPersonState('Tom'); }, 6500); 

// //     setTimeout(() => { setHighlightedPersonState(null); setIsSpeaking(false); }, 9000);
// //   };
  
// //   const synthesizeSpeech = async () => {
// //     if (isLoading || isSpeaking) return;
// //     setPlaybackError(null);

// //     const playAudio = async (url: string) => {
// //       const audio = new Audio(url); 
// //       audio.type = 'audio/wav'; 
      
// //       return new Promise<void>((resolve, reject) => {
// //         audio.oncanplaythrough = async () => {
// //           try {
// //             await audio.play();
// //             resolve();
// //           } catch (e) {
// //             reject(e);
// //           }
// //         };
// //         audio.onerror = (e) => {
// //           console.error("Audio Load Error:", e);
// //           reject(new Error("Audio load failed"));
// //         };
// //         audio.load();
// //       });
// //     };

// //     if (audioUrl) {
// //       try {
// //         await playAudio(audioUrl);
// //         handleHighlightSequence();
// //       } catch (e: any) {
// //         if (e.name === 'NotAllowedError' || e.message?.includes('interact with the document')) {
// //             setIsSpeaking(false);
// //             setHighlightedPersonState(null);
// //             setPlaybackError(T.autoplayError);
// //         } else {
// //             console.error("Audio playback failed:", e);
// //             handleHighlightSequence();
// //         }
// //       }
// //       return;
// //     }

// //     setIsLoading(true);
// //     const apiKey = ""; 
    
// //     const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

// //     const payload = {
// //         contents: [{ parts: [{ text: T.speechText }] }],
// //         generationConfig: {
// //             responseModalities: ["AUDIO"],
// //             speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } } 
// //         },
// //         model: "gemini-2.5-flash-preview-tts"
// //     };

// //     try {
// //         const response = await fetch(apiUrl, {
// //             method: 'POST', 
// //             headers: { 'Content-Type': 'application/json' }, 
// //             body: JSON.stringify(payload)
// //         });
        
// //         if (!response.ok) {
// //             setIsLoading(false);
// //             handleHighlightSequence();
// //             return;
// //         }

// //         const result = await response.json();
// //         const part = result?.candidates?.[0]?.content?.parts?.[0];
// //         const audioData = part?.inlineData?.data;
// //         const mimeType = part?.inlineData?.mimeType;

// //         if (audioData && mimeType && mimeType.startsWith("audio/L16")) {
// //             const rateMatch = mimeType.match(/rate=(\d+)/);
// //             const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;
            
// //             const pcmData = base64ToArrayBuffer(audioData);
// //             const pcm16 = new Int16Array(pcmData);
// //             const wavBlob = pcmToWav(pcm16, sampleRate);
// //             const url = URL.createObjectURL(wavBlob);
            
// //             setAudioUrl(url);
            
// //             try {
// //               await playAudio(url);
// //               handleHighlightSequence();
// //             } catch (e: any) {
// //                if (e.name === 'NotAllowedError' || e.message?.includes('interact with the document')) {
// //                   setIsSpeaking(false);
// //                   setHighlightedPersonState(null);
// //                   setPlaybackError(T.autoplayError);
// //               } else {
// //                   console.error("Audio playback failed:", e);
// //                   handleHighlightSequence();
// //               }
// //             }
            
// //         } else {
// //             handleHighlightSequence();
// //         }
// //     } catch (error) {
// //         handleHighlightSequence();
// //     } finally {
// //         setIsLoading(false);
// //     }
// //   };

// //   useEffect(() => {
// //     if (isDarkMode) { 
// //       document.documentElement.classList.add('dark'); 
// //     } else { 
// //       document.documentElement.classList.remove('dark'); 
// //     }

// //     const calculateSize = () => {
// //       const size = Math.min(window.innerWidth * 0.85, 300);
// //       setCircleSize(size);
// //     };

// //     calculateSize();
// //     window.addEventListener('resize', calculateSize);
// //     return () => window.removeEventListener('resize', calculateSize);
// //   }, [isDarkMode]);

// //   useEffect(() => {
// //     setAudioUrl(null); 
// //     setPlaybackError(null);
// //   }, [language]);
  
// //   const baseSlots: PlaceholderSlot[] = [
// //     { id: 'top', position: 'top', label: 'EMPTY', occupant: null, isFixed: false },
// //     { id: 'bottom', position: 'bottom', label: 'David', occupant: 'David', isFixed: true },
// //     { id: 'left', position: 'left', label: 'EMPTY', occupant: null, isFixed: false },
// //     { id: 'right', position: 'right', label: 'EMPTY', occupant: null, isFixed: false },
// //   ];
  
// //   const currentSlots = baseSlots.map(slot => {
// //     if (slot.id === 'right' && currentStep >= 1) {
// //         return { ...slot, occupant: 'Prabhat', label: 'Prabhat' };
// //     }
// //     if (slot.id === 'top' && currentStep >= 2) {
// //         return { ...slot, occupant: 'Tom', label: 'Tom' };
// //     }
// //     return slot;
// //   });

// //   const toggleDarkMode = () => useStateIsDarkMode(prev => !prev);

// //   const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
// //     setLanguage(e.target.value as Language);
// //   };

// //   return (
// //     <div className={isDarkMode ? 'dark' : ''}>
// //       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500 p-4 sm:p-6 flex flex-col items-center font-sans">
// //         <div className="w-full max-w-4xl space-y-4 flex flex-col flex-grow">
// //           <header className="flex flex-col sm:flex-row justify-between items-center w-full space-y-4 sm:space-y-0 pb-4 flex-shrink-0">
// //             <h1 className="text-xl sm:text-3xl font-extrabold text-gray-800 dark:text-white text-center sm:text-left flex-grow">
// //               {T.title}
// //             </h1>
// //             <div className="flex space-x-4 items-center">
// //               <select
// //                 value={language}
// //                 onChange={handleLanguageChange}
// //                 className="p-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 focus:ring-blue-500 focus:border-blue-500"
// //               >
// //                 <option value="en">English</option>
// //                 <option value="hi">हिन्दी (Hindi)</option>
// //               </select>
// //               <button
// //                 onClick={toggleDarkMode}
// //                 className="p-2 rounded-full bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-yellow-400 shadow-md hover:ring-2 ring-blue-500 dark:ring-blue-300 transition-all duration-300"
// //               >
// //                 {isDarkMode ? (
// //                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
// //                   </svg>
// //                 ) : (
// //                   <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
// //                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
// //                   </svg>
// //                 )}
// //               </button>
// //             </div>
// //           </header>

// //           <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border-t-4 border-green-500 flex-grow"> 
            
// //             <div className="p-4 sm:p-6 bg-blue-50 dark:bg-blue-900 rounded-lg border-2 border-blue-200 dark:border-blue-700 shadow-inner mb-4">
// //               <h2 className="text-xl sm:text-2xl font-extrabold text-blue-800 dark:text-blue-200 text-center mb-2">
// //                 {T.instruction}
// //               </h2>
// //               {playbackError && (
// //                   <div className="bg-red-100 dark:bg-red-900 border border-red-400 dark:border-red-600 text-red-700 dark:text-red-300 px-4 py-2 rounded mb-3 text-sm font-medium text-center w-full max-w-sm mx-auto">
// //                       {playbackError}
// //                   </div>
// //               )}
// //               <div className="flex justify-center">
// //                 <button
// //                   onClick={synthesizeSpeech}
// //                   disabled={isLoading || isSpeaking}
// //                   className={`flex items-center px-6 py-3 rounded-full font-bold text-white shadow-lg transition duration-200 
// //                     ${isLoading || isSpeaking ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:bg-green-800'}`}
// //                 >
// //                     {isLoading ? (
// //                         <>
// //                             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
// //                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
// //                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
// //                             </svg>
// //                             {T.loading}
// //                         </>
// //                     ) : (
// //                         <>
// //                             <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
// //                                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
// //                             </svg>
// //                             {isSpeaking ? T.speaking : T.playButton}
// //                         </>
// //                     )}
// //                 </button>
// //               </div>
// //             </div>

// //             <CircularArrangement
// //               slots={currentSlots}
// //               circleSize={circleSize}
// //               language={language}
// //               currentStep={currentStep}
// //               highlightedPerson={highlightedPersonState}
// //             />

// //             <div className="w-full bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-400 dark:border-blue-600 p-4 rounded-lg shadow-md mt-4">
// //               <div className="text-gray-700 dark:text-gray-200 leading-relaxed">
// //                 {T.explanation}
// //               </div>
// //             </div>
// //           </div>

// //           <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4 pb-2 flex-shrink-0">
// //             <p>{T.footer}</p>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // };

// // export default App;

// import React, { useState, useEffect, CSSProperties } from 'react';

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
//   explanation: React.ReactNode;
//   playButton: string;
//   loading: string;
//   speaking: string;
//   autoplayError: string;
//   footer: string;
//   rightLabel1st: string;
//   rightLabel2nd: string;
//   speechText: string;
// }

// const translations: Record<Language, Translation> = {
//   en: {
//     title: "Circular Arrangement: Ordinal Direction Lesson (Right)",
//     instruction: "Demonstrating 1st Right and 2nd Right positions relative to David.",
//     explanation: (
//       <div className="space-y-3">
//         <p className="font-semibold text-xl text-gray-900 dark:text-gray-50 text-center p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg">
//           <span className="text-blue-600 dark:text-blue-400 font-extrabold">Prabhat</span> is the 1st to the **Right** of David.
//         </p>
//         <p className="font-semibold text-xl text-gray-900 dark:text-gray-50 text-center p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg">
//           <span className="text-red-600 dark:text-red-400 font-extrabold">Tom</span> is the 2nd to the **Right** of David.
//         </p>
//         <p className="text-sm italic text-gray-600 dark:text-gray-300 text-center p-1 border-t dark:border-gray-600 pt-2">
//           **Right** means Counter-Clockwise when everyone is facing the center.
//         </p>
//       </div>
//     ),
//     playButton: "Play Explanation",
//     loading: "Generating Voice...",
//     speaking: "Now Speaking...",
//     autoplayError: "Autoplay failed. Please click Play Explanation to start the audio lesson.",
//     footer: "The arrows show the Counter-Clockwise path (Right) counting positions from David.",
//     rightLabel1st: "1st Right",
//     rightLabel2nd: "2nd Right",
//     speechText: "Starting from David and moving counter-clockwise, Prabhat is the first person to the right of David. After Prabhat, Tom is the second person to the right of David. We count positions sequentially in the counter-clockwise direction.",
//   },
//   hi: {
//     title: "गोलाकार व्यवस्था: क्रमवाचक दिशा पाठ (दाएँ)",
//     instruction: "डेविड के सापेक्ष पहला दाएँ और दूसरा दाएँ स्थितियों का प्रदर्शन।",
//     explanation: (
//       <div className="space-y-3">
//         <p className="font-semibold text-xl text-gray-900 dark:text-gray-50 text-center p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg" style={{ lineHeight: '1.8' }}>
//           <span className="text-blue-600 dark:text-blue-400 font-extrabold">प्रभात</span> डेविड से **दाएँ में पहला** व्यक्ति है।
//         </p>
//         <p className="font-semibold text-xl text-gray-900 dark:text-gray-50 text-center p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg" style={{ lineHeight: '1.8' }}>
//           <span className="text-red-600 dark:text-red-400 font-extrabold">टॉम</span> डेविड से **दाएँ में दूसरा** व्यक्ति है।
//         </p>
//         <p className="text-sm italic text-gray-600 dark:text-gray-300 text-center p-1 border-t dark:border-gray-600 pt-2" style={{ fontFamily: 'serif' }}>
//           केंद्र की ओर मुख करते समय, **दाएँ** का अर्थ वामावर्त होता है।
//         </p>
//       </div>
//     ),
//     playButton: "व्याख्या चलाएँ",
//     loading: "आवाज़ उत्पन्न हो रही है...",
//     speaking: "अब बोल रहा है...",
//     autoplayError: "ऑटोप्ले विफल रहा। ऑडियो पाठ शुरू करने के लिए व्याख्या चलाएँ पर क्लिक करें।",
//     footer: "तीर डेविड से शुरू होकर वामावर्त (दाएँ) दिशा में स्थितियों की गिनती दिखाते हैं।",
//     rightLabel1st: "1st दाएँ",
//     rightLabel2nd: "2nd दाएँ",
//     speechText: "डेविड से शुरू करके और वामावर्त चलते हुए, प्रभात डेविड के दाएँ में पहला व्यक्ति है। प्रभात के बाद, टॉम डेविड के दाएँ में दूसरा व्यक्ति है। हम स्थितियों को वामावर्त दिशा में क्रमिक रूप से गिनते हैं।",
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
// }

// const CircularArrangement: React.FC<CircularArrangementProps> = ({
//   slots,
//   circleSize,
//   language,
//   currentStep,
//   highlightedPerson
// }) => {
//   const personSize = Math.max(circleSize * 0.35, 60); 
//   const radius = circleSize / 2;
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

//       if (slot.occupant === 'Tom') {
//         text = 'TOM'; 
//         imageUrl = `https://placehold.co/${size}x${size}/dc2626/ffffff?text=${text}`;
//       } else if (slot.occupant === 'Prabhat') {
//         text = 'PRAB'; 
//         imageUrl = `https://placehold.co/${size}x${size}/10b981/ffffff?text=${text}`;
//       } else if (slot.occupant === 'Akash') {
//         text = 'AKAS'; 
//         imageUrl = `https://placehold.co/${size}x${size}/3b82f6/ffffff?text=${text}`;
//       } else if (slot.occupant === 'David') {
//         text = 'DAVI'; 
//         imageUrl = `https://placehold.co/${size}x${size}/f97316/ffffff?text=${text}`;
//       }

//       const nameDistance = personSize * 0.05;
//       const externalOffset = offset * 1.5;
//       const isOccupied = slot.occupant;

//       return (
//         <div key={slot.id}>
//           <div
//             className={`absolute rounded-full shadow-lg transition-all duration-500 flex justify-center items-center ${
//               isOccupied 
//                 ? 'border-4 border-white bg-white dark:bg-gray-700' 
//                 : 'bg-transparent' // Empty slots are transparent
//             } ${isOccupied && highlightedPerson === slot.occupant ? 'ring-4 ring-offset-2 ring-yellow-500 shadow-2xl scale-110' : ''}`}
//             style={slotStyle}
//           >
//             {isOccupied ? (
//               <img
//                 src={imageUrl}
//                 alt={slot.occupant}
//                 className="w-full h-full rounded-full object-cover"
//               />
//             ) : (
//               // Display EMPTY label
//               <div className="text-gray-400 dark:text-gray-500 text-lg font-bold">
//                 {slot.label}
//               </div>
//             )}
//           </div>

//           {isOccupied && (
//             <span
//               className="absolute font-bold"
//               style={{
//                 zIndex: 20,
//                 fontSize: '1.1rem',
//                 color: slot.occupant === 'Tom' ? '#dc2626' : slot.occupant === 'Prabhat' ? '#10b981' : slot.occupant === 'Akash' ? '#3b82f6' : '#f97316',
                
//                 ...(slot.position === 'top' && { 
//                     top: -externalOffset, 
//                     left: radius,
//                     transform: `translateX(-50%) translateY(-${personSize * 0.8}px)`
//                 }),
//                 ...(slot.position === 'right' && { 
//                     top: radius, 
//                     right: -externalOffset,
//                     transform: `translateX(${nameDistance * 4}px) translateY(-50%)` 
//                 }),
//                 ...(slot.position === 'bottom' && {
//                     bottom: -externalOffset,
//                     left: radius,
//                     transform: `translateX(-50%) translateY(${personSize * 0.3}px)`
//                 }),
//               }}
//             >
//               {slot.occupant}
//             </span>
//           )}
//         </div>
//       );
//     });
//   };

//   const renderDirectionArrow = () => {
//     if (currentStep < 1) return null;

//     const R_Circle = circleSize / 2;
//     const ARROW_OFFSET = 75; 
//     const offsetCalc = personSize / 2;
//     const mugSize = 48;
//     const lineStrokeColor = '#3b82f6';
//     const viewBoxSize = circleSize + ARROW_OFFSET * 4; 

//     const STROKE_WIDTH = 2;
//     const MARKER_SIZE = 8;
//     const angleMap: Record<PlaceholderSlot['position'], number> = {
//         'top': 1.5 * Math.PI, // 12 PM (270 deg)
//         'bottom': 0.5 * Math.PI, // 6 PM (90 deg)
//         'left': 1.0 * Math.PI, // 9 PM (180 deg)
//         'right': 0 * Math.PI, // 3 PM (0 deg)
//     };
    
//     // Arrows based on current arrangement: David(Bottom) -> Prabhat(Right) -> Tom(Top)
    
//     // 1. 1st Right (David -> Prabhat) - Inner Arc (Blue) - Renders at Step 1
//     const arrow1 = {
//         start: 'bottom' as const, end: 'right' as const, label: T.rightLabel1st, color: '#3b82f6', isLeft: false, offset: 5, highlightName: 'Prabhat'
//     };
//     // 2. 2nd Right (David -> Tom) - Outer Arc (Red) - Renders at Step 2
//     const arrow2 = {
//         start: 'bottom' as const, end: 'top' as const, label: T.rightLabel2nd, color: '#dc2626', isLeft: false, offset: 65, highlightName: 'Tom' 
//     };


//     const renderSingleArrow = (arrowData: typeof arrow1 | typeof arrow2) => {
//         if (arrowData.label === T.rightLabel2nd && currentStep < 2) return null;

//         const arrowColor = arrowData.highlightName === highlightedPerson || highlightedPerson === 'David' ? '#ffc107' : arrowData.color;

//         const arrowRadius = R_Circle + ARROW_OFFSET + arrowData.offset;
        
//         const startAngle = angleMap[arrowData.start];
//         const endAngle = angleMap[arrowData.end];
        
//         // --- Counter-Clockwise Path Calculation ---
//         const sweepFlag = 0; // 0 for Counter-Clockwise (Right)
        
//         const startX = R_Circle + arrowRadius * Math.cos(startAngle);
//         const startY = R_Circle + arrowRadius * Math.sin(startAngle);

//         const endX = R_Circle + arrowRadius * Math.cos(endAngle);
//         const endY = R_Circle + arrowRadius * Math.sin(endAngle);

//         // Adjusted path to ensure CCW movement is drawn correctly
//         const arrowPath = `M ${startX} ${startY} A ${arrowRadius} ${arrowRadius} 0 0 ${sweepFlag} ${endX} ${endY}`;
        
//         // --- Label Positioning Logic ---
//         // Increased label offset for better separation from the arc
//         const labelRadius = arrowRadius + 20; // Reduced separation slightly
//         let preciseLabelAngle;

//         // Positioning for CCW arcs:
//         if (arrowData.label === T.rightLabel1st) { // David -> Prabhat (Inner Arc)
//             // Angle set to be near 45 degrees (0.25 PI)
//             preciseLabelAngle = 0.25 * Math.PI; 
//         } else { // David -> Tom (Outer Arc)
//             // Corrected angle for the outer arc to sit in the Top-Right quadrant
//             preciseLabelAngle = 0.35 * Math.PI; 
//         }

//         const labelX = R_Circle + labelRadius * Math.cos(preciseLabelAngle);
//         const labelY = R_Circle + labelRadius * Math.sin(preciseLabelAngle);


//         return (
//             <React.Fragment key={arrowData.label}>
//                 <path
//                     d={arrowPath}
//                     fill="none"
//                     stroke={arrowColor} 
//                     strokeWidth={STROKE_WIDTH}
//                     markerEnd={`url(#mainArrowhead-${arrowData.color.replace('#', '')})`}
//                     className={`transition-all duration-300 ${arrowData.highlightName === highlightedPerson || highlightedPerson === 'David' ? 'filter drop-shadow(0 0 4px #ffc107)' : ''}`}
//                 />
//                 <text
//                     x={labelX}
//                     y={labelY}
//                     className="font-extrabold transition-all duration-300"
//                     fill={arrowColor} 
//                     style={{ fontSize: '1.1rem', textShadow: '0 0 4px rgba(0,0,0,0.2)' }}
//                     textAnchor="middle"
//                     dominantBaseline="middle"
//                 >
//                     {arrowData.label}
//                 </text>
//             </React.Fragment>
//         );
//     };

//     return (
//       <>
//         <svg
//           className="absolute"
//           style={{
//             top: -ARROW_OFFSET * 2, 
//             left: -ARROW_OFFSET * 2,
//             width: viewBoxSize,
//             height: viewBoxSize,
//             zIndex: 5
//           }}
//           viewBox={`${-ARROW_OFFSET * 2} ${-ARROW_OFFSET * 2} ${viewBoxSize} ${viewBoxSize}`}
//           preserveAspectRatio="xMidYMid meet"
//         >
//           <defs>
//             <marker id="facingArrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
//               <path d="M 0 0 L 6 3 L 0 6 z" fill={lineStrokeColor} />
//             </marker>
//             <marker id="mainArrowhead-3b82f6" markerWidth={MARKER_SIZE} markerHeight={MARKER_SIZE} refX={MARKER_SIZE * 0.8} refY={MARKER_SIZE * 0.5} orient="auto">
//               <path d={`M 0 0 L ${MARKER_SIZE} ${MARKER_SIZE * 0.5} L 0 ${MARKER_SIZE} z`} fill="#3b82f6" />
//             </marker>
//             <marker id="mainArrowhead-dc2626" markerWidth={MARKER_SIZE} markerHeight={MARKER_SIZE} refX={MARKER_SIZE * 0.8} refY={MARKER_SIZE * 0.5} orient="auto">
//               <path d={`M 0 0 L ${MARKER_SIZE} ${MARKER_SIZE * 0.5} L 0 ${MARKER_SIZE} z`} fill="#dc2626" />
//             </marker>
//           </defs>

//           {renderSingleArrow(arrow1)} 
//           {renderSingleArrow(arrow2)}

//           {slots.filter(s => s.occupant).map((slot, i) => {
//               const angle = angleMap[slot.position];
//               return (
//                   <path
//                       key={i}
//                       d={`M ${R_Circle + radius * Math.cos(angle) * (1 - offsetCalc/radius)} ${R_Circle + radius * Math.sin(angle) * (1 - offsetCalc/radius)} L ${R_Circle + mugSize * 0.5 * Math.cos(angle - Math.PI) * -1} ${R_Circle + mugSize * 0.5 * Math.sin(angle - Math.PI) * -1}`}
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
//             style={{ width: mugSize, height: mugSize }}
//           >
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
//               <path strokeLinecap="round" strokeLinejoin="round" d="M12 4v16m8-8H4" />
//             </svg>
//           </div>
//         </div>
//       </>
//     );
//   };

//   return (
//     <div className="flex flex-col items-center p-4">
//       <div style={{ padding: `${offset + 5 + 130}px` }}>
//         <div
//           className="relative border-4 border-blue-500 dark:border-blue-300 rounded-full bg-gray-100 dark:bg-gray-800 flex items-center justify-center shadow-xl transition-all duration-300"
//           style={{ width: circleSize, height: circleSize }}
//         >
//           {renderDirectionArrow()}
//           {renderSlots()}
//         </div>
//       </div>
//     </div>
//   );
// };

// const App: React.FC = () => {
//   const [audioUrl, setAudioUrl] = useState<string | null>(null);
//   const [isLoading, setIsLoading] = useState(false);
//   const [isSpeaking, setIsSpeaking] = useState(false);
//   const [isDarkMode, setIsDarkMode] = useState(false);
//   const [circleSize, setCircleSize] = useState(300); 
//   const [playbackError, setPlaybackError] = useState<string | null>(null); 
//   const [language, setLanguage] = useState<Language>('en'); 
//   const [currentStep, setCurrentStep] = useState(0);
//   const [highlightedPersonState, setHighlightedPersonState] = useState<string | null>(null);

//   const T = translations[language];

//   const handleHighlightSequence = () => {
//     setIsSpeaking(true);
//     setHighlightedPersonState(null);
//     setCurrentStep(0);
    
//     setTimeout(() => { setCurrentStep(1); }, 500);
//     setTimeout(() => { setHighlightedPersonState('David'); }, 1500); 
//     setTimeout(() => { setHighlightedPersonState('Prabhat'); }, 2500); 
    
//     setTimeout(() => { setCurrentStep(2); }, 4500);
//     setTimeout(() => { setHighlightedPersonState('David'); }, 5000); 
//     setTimeout(() => { setHighlightedPersonState('Tom'); }, 6500); 

//     setTimeout(() => { setHighlightedPersonState(null); setIsSpeaking(false); }, 9000);
//   };
  
//   const synthesizeSpeech = async () => {
//     if (isLoading || isSpeaking) return;
//     setPlaybackError(null);

//     const playAudio = async (url: string) => {
//       const audio = new Audio(url); 
//       audio.type = 'audio/wav'; 
      
//       return new Promise<void>((resolve, reject) => {
//         audio.oncanplaythrough = async () => {
//           try {
//             await audio.play();
//             resolve();
//           } catch (e) {
//             reject(e);
//           }
//         };
//         audio.onerror = (e) => {
//           console.error("Audio Load Error:", e);
//           reject(new Error("Audio load failed"));
//         };
//         audio.load();
//       });
//     };

//     if (audioUrl) {
//       try {
//         await playAudio(audioUrl);
//         handleHighlightSequence();
//       } catch (e: any) {
//         if (e.name === 'NotAllowedError' || e.message?.includes('interact with the document')) {
//             setIsSpeaking(false);
//             setHighlightedPersonState(null);
//             setPlaybackError(T.autoplayError);
//         } else {
//             console.error("Audio playback failed:", e);
//             handleHighlightSequence();
//         }
//       }
//       return;
//     }

//     setIsLoading(true);
//     const apiKey = ""; 
    
//     const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

//     const payload = {
//         contents: [{ parts: [{ text: T.speechText }] }],
//         generationConfig: {
//             responseModalities: ["AUDIO"],
//             speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Kore' } } } 
//         },
//         model: "gemini-2.5-flash-preview-tts"
//     };

//     try {
//         const response = await fetch(apiUrl, {
//             method: 'POST', 
//             headers: { 'Content-Type': 'application/json' }, 
//             body: JSON.stringify(payload)
//         });
        
//         if (!response.ok) {
//             setIsLoading(false);
//             handleHighlightSequence();
//             return;
//         }

//         const result = await response.json();
//         const part = result?.candidates?.[0]?.content?.parts?.[0];
//         const audioData = part?.inlineData?.data;
//         const mimeType = part?.inlineData?.mimeType;

//         if (audioData && mimeType && mimeType.startsWith("audio/L16")) {
//             const rateMatch = mimeType.match(/rate=(\d+)/);
//             const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;
            
//             const pcmData = base64ToArrayBuffer(audioData);
//             const pcm16 = new Int16Array(pcmData);
//             const wavBlob = pcmToWav(pcm16, sampleRate);
//             const url = URL.createObjectURL(wavBlob);
            
//             setAudioUrl(url);
            
//             try {
//               await playAudio(url);
//               handleHighlightSequence();
//             } catch (e: any) {
//                if (e.name === 'NotAllowedError' || e.message?.includes('interact with the document')) {
//                   setIsSpeaking(false);
//                   setHighlightedPersonState(null);
//                   setPlaybackError(T.autoplayError);
//               } else {
//                   console.error("Audio playback failed:", e);
//                   handleHighlightSequence();
//               }
//             }
            
//         } else {
//             handleHighlightSequence();
//         }
//     } catch (error) {
//         handleHighlightSequence();
//     } finally {
//         setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (isDarkMode) { 
//       document.documentElement.classList.add('dark'); 
//     } else { 
//       document.documentElement.classList.remove('dark'); 
//     }

//     const calculateSize = () => {
//       const size = Math.min(window.innerWidth * 0.85, 300);
//       setCircleSize(size);
//     };

//     calculateSize();
//     window.addEventListener('resize', calculateSize);
//     return () => window.removeEventListener('resize', calculateSize);
//   }, [isDarkMode]);

//   useEffect(() => {
//     setAudioUrl(null); 
//     setPlaybackError(null);
//   }, [language]);
  
//   const baseSlots: PlaceholderSlot[] = [
//     { id: 'top', position: 'top', label: 'EMPTY', occupant: null, isFixed: false },
//     { id: 'bottom', position: 'bottom', label: 'David', occupant: 'David', isFixed: true },
//     { id: 'left', position: 'left', label: 'EMPTY', occupant: null, isFixed: false },
//     { id: 'right', position: 'right', label: 'EMPTY', occupant: null, isFixed: false },
//   ];
  
//   const currentSlots = baseSlots.map(slot => {
//     if (slot.id === 'right' && currentStep >= 1) {
//         return { ...slot, occupant: 'Prabhat', label: 'Prabhat' };
//     }
//     if (slot.id === 'top' && currentStep >= 2) {
//         return { ...slot, occupant: 'Tom', label: 'Tom' };
//     }
//     return slot;
//   });

//   const toggleDarkMode = () => setIsDarkMode(prev => !prev);

//   const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
//     setLanguage(e.target.value as Language);
//   };

//   return (
//     <div className={isDarkMode ? 'dark' : ''}>
//       <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500 p-4 sm:p-6 flex flex-col items-center font-sans">
//         <div className="w-full max-w-4xl space-y-4 flex flex-col flex-grow">
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

//           <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border-t-4 border-green-500 flex-grow"> 
            
//             {/* Instruction/Status Box */}
//             <div className="p-4 sm:p-6 bg-blue-50 dark:bg-blue-900 rounded-lg border-2 border-blue-200 dark:border-blue-700 shadow-inner mb-4">
//               <h2 className="text-xl sm:text-2xl font-extrabold text-blue-800 dark:text-blue-200 text-center mb-2">
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
//                   disabled={isLoading || isSpeaking}
//                   className={`flex items-center px-6 py-3 rounded-full font-bold text-white shadow-lg transition duration-200 
//                     ${isLoading || isSpeaking ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700 active:bg-green-800'}`}
//                 >
//                     {isLoading ? (
//                         <>
//                             <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                             </svg>
//                             {T.loading}
//                         </>
//                     ) : (
//                         <>
//                             <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
//                                 <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
//                             </svg>
//                             {isSpeaking ? T.speaking : T.playButton}
//                         </>
//                     )}
//                 </button>
//               </div>
//             </div>

//             <CircularArrangement
//               slots={currentSlots}
//               circleSize={circleSize}
//               language={language}
//               currentStep={currentStep}
//               highlightedPerson={highlightedPersonState}
//             />

//             <div className="w-full bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-400 dark:border-blue-600 p-4 rounded-lg shadow-md mt-4">
//               <div className="text-gray-700 dark:text-gray-200 leading-relaxed">
//                 {T.explanation}
//               </div>
//             </div>
//           </div>

//           <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4 pb-2 flex-shrink-0">
//             <p>{T.footer}</p>
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
  explanation: React.ReactNode;
  playButton: string;
  stopButton: string;
  loading: string; // Kept for consistency but loading time is instant
  speaking: string;
  autoplayError: string;
  footer: string;
  rightLabel1st: string;
  rightLabel2nd: string;
  speechText: string;
}

const translations: Record<Language, Translation> = {
  en: {
    title: "Circular Arrangement: Ordinal Direction Lesson (Right)",
    instruction: "Demonstrating 1st Right and 2nd Right positions relative to David.",
    explanation: (
      <div className="space-y-3">
        <p className="font-semibold text-xl text-gray-900 dark:text-gray-50 text-center p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg">
          <span className="text-blue-600 dark:text-blue-400 font-extrabold">Prabhat</span> is the 1st to the **Right** of David.
        </p>
        <p className="font-semibold text-xl text-gray-900 dark:text-gray-50 text-center p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg">
          <span className="text-red-600 dark:text-red-400 font-extrabold">Tom</span> is the 2nd to the **Right** of David.
        </p>
        <p className="text-sm italic text-gray-600 dark:text-gray-300 text-center p-1 border-t dark:border-gray-600 pt-2">
          **Right** means Counter-Clockwise when everyone is facing the center.
        </p>
      </div>
    ),
    playButton: "Play Explanation",
    stopButton: "Stop Explanation",
    loading: "Generating Voice...",
    speaking: "Now Speaking...",
    autoplayError: "Voice playback blocked or unavailable. Visual lesson running.",
    footer: "The arrows show the Counter-Clockwise path (Right) counting positions from David.",
    rightLabel1st: "1st Right",
    rightLabel2nd: "2nd Right",
    speechText: "Starting from David and moving counter-clockwise, Prabhat is the first person to the right of David. After Prabhat, Tom is the second person to the right of David. We count positions sequentially in the counter-clockwise direction.",
  },
  hi: {
    title: "गोलाकार व्यवस्था: क्रमवाचक दिशा पाठ (दाएँ)",
    instruction: "डेविड के सापेक्ष पहला दाएँ और दूसरा दाएँ स्थितियों का प्रदर्शन।",
    explanation: (
      <div className="space-y-3">
        <p className="font-semibold text-xl text-gray-900 dark:text-gray-50 text-center p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg" style={{ lineHeight: '1.8' }}>
          <span className="text-blue-600 dark:text-blue-400 font-extrabold">प्रभात</span> डेविड से **दाएँ में पहला** व्यक्ति है।
        </p>
        <p className="font-semibold text-xl text-gray-900 dark:text-gray-50 text-center p-2 bg-yellow-100 dark:bg-yellow-800 rounded-lg" style={{ lineHeight: '1.8' }}>
          <span className="text-red-600 dark:text-red-400 font-extrabold">टॉम</span> डेविड से **दाएँ में दूसरा** व्यक्ति है।
        </p>
        <p className="text-sm italic text-gray-600 dark:text-gray-300 text-center p-1 border-t dark:border-gray-600 pt-2" style={{ fontFamily: 'serif' }}>
          केंद्र की ओर मुख करते समय, **दाएँ** का अर्थ वामावर्त होता है।
        </p>
      </div>
    ),
    playButton: "व्याख्या चलाएँ",
    stopButton: "रोकें",
    loading: "आवाज़ उत्पन्न हो रही है...",
    speaking: "अब बोल रहा है...",
    autoplayError: "आवाज़ अवरुद्ध है या अनुपलब्ध है। दृश्य पाठ चल रहा है।",
    footer: "तीर डेविड से शुरू होकर वामावर्त (दाएँ) दिशा में स्थितियों की गिनती दिखाते हैं।",
    rightLabel1st: "1st दाएँ",
    rightLabel2nd: "2nd दाएँ",
    speechText: "डेविड से शुरू करके और वामावर्त चलते हुए, प्रभात डेविड के दाएँ में पहला व्यक्ति है। प्रभात के बाद, टॉम डेविड के दाएँ में दूसरा व्यक्ति है। हम स्थितियों को वामावर्त दिशा में क्रमिक रूप से गिनते हैं।",
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
}

const CircularArrangement: React.FC<CircularArrangementProps> = ({
  slots,
  circleSize,
  language,
  currentStep,
  highlightedPerson
}) => {
  const personSize = Math.max(circleSize * 0.35, 60); 
  const radius = circleSize / 2;
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

      if (slot.occupant === 'Tom') {
        text = 'TOM'; 
        imageUrl = `https://placehold.co/${size}x${size}/dc2626/ffffff?text=${text}`;
      } else if (slot.occupant === 'Prabhat') {
        text = 'PRAB'; 
        imageUrl = `https://placehold.co/${size}x${size}/10b981/ffffff?text=${text}`;
      } else if (slot.occupant === 'Akash') {
        text = 'AKAS'; 
        imageUrl = `https://placehold.co/${size}x${size}/3b82f6/ffffff?text=${text}`;
      } else if (slot.occupant === 'David') {
        text = 'DAVI'; 
        imageUrl = `https://placehold.co/${size}x${size}/f97316/ffffff?text=${text}`;
      }

      const isOccupied = slot.occupant;

      return (
        <div key={slot.id}>
          <div
            className={`absolute rounded-full shadow-lg transition-all duration-500 flex justify-center items-center ${
              isOccupied 
                ? 'border-4 border-white bg-white dark:bg-gray-700' 
                : 'bg-transparent'
            } ${isOccupied && highlightedPerson === slot.occupant ? 'ring-4 ring-offset-2 ring-yellow-500 shadow-2xl scale-110' : ''}`}
            style={slotStyle}
          >
            {isOccupied ? (
              <img
                src={imageUrl}
                alt={slot.occupant}
                className="w-full h-full rounded-full object-cover"
              />
            ) : (
              // Display EMPTY label - Removed circle border/fill
              <div className="text-gray-400 dark:text-gray-500 text-lg font-bold">
                {slot.label}
              </div>
            )}
          </div>

          {/* Removed External Name Span */}
        </div>
      );
    });
  };

  const renderDirectionArrow = () => {
    if (currentStep < 1) return null;

    const R_Circle = circleSize / 2;
    const ARROW_OFFSET = 75; 
    const offsetCalc = personSize / 2;
    const mugSize = 48;
    const lineStrokeColor = '#3b82f6';
    // Increased viewBox padding to fix clipping of the outer arrow label
    const viewBoxSize = circleSize + ARROW_OFFSET * 5; 

    const STROKE_WIDTH = 2;
    const MARKER_SIZE = 8;
    const angleMap: Record<PlaceholderSlot['position'], number> = {
        'top': 1.5 * Math.PI, // 12 PM (270 deg)
        'bottom': 0.5 * Math.PI, // 6 PM (90 deg)
        'left': 1.0 * Math.PI, // 9 PM (180 deg)
        'right': 0 * Math.PI, // 3 PM (0 deg)
    };
    
    // Arrows based on final Counter-Clockwise order: David(Bottom) -> Prabhat(Right) -> Tom(Top)
    
    // 1. 1st Right (David -> Prabhat) - Inner Arc (Blue) - Renders at Step 1
    const arrow1 = {
        start: 'bottom' as const, end: 'right' as const, label: T.rightLabel1st, color: '#3b82f6', isLeft: false, offset: 5, highlightName: 'Prabhat'
    };
    // 2. 2nd Right (David -> Tom) - Outer Arc (Red) - Renders at Step 2
    const arrow2 = {
        start: 'bottom' as const, end: 'top' as const, label: T.rightLabel2nd, color: '#dc2626', isLeft: false, offset: 65, highlightName: 'Tom' 
    };


    const renderSingleArrow = (arrowData: typeof arrow1 | typeof arrow2) => {
        // Step 2 starts rendering after 1st Right explanation
        if (arrowData.label === T.rightLabel2nd && currentStep < 2) return null; 

        const arrowColor = arrowData.highlightName === highlightedPerson || highlightedPerson === 'David' ? '#ffc107' : arrowData.color;

        const arrowRadius = R_Circle + ARROW_OFFSET + arrowData.offset;
        
        const startAngle = angleMap[arrowData.start];
        const endAngle = angleMap[arrowData.end];
        
        // --- Counter-Clockwise Path Calculation (Right) ---
        const sweepFlag = 0; // 0 for Counter-Clockwise (Right)
        
        const startX = R_Circle + arrowRadius * Math.cos(startAngle);
        const startY = R_Circle + arrowRadius * Math.sin(startAngle);

        const endX = R_Circle + arrowRadius * Math.cos(endAngle);
        const endY = R_Circle + arrowRadius * Math.sin(endAngle);

        // Path drawn Counter-Clockwise
        const arrowPath = `M ${startX} ${startY} A ${arrowRadius} ${arrowRadius} 0 0 ${sweepFlag} ${endX} ${endY}`;
        
        // --- Label Positioning Logic ---
        const labelRadius = arrowRadius * 1.05; // Final adjustment to sit on the arc
        let preciseLabelAngle;

        // Positioning for Counter-Clockwise arcs (Bottom -> Right -> Top)
        if (arrowData.label === T.rightLabel1st) { // David -> Prabhat (Inner Arc) -> 4th Quadrant (0-90 deg)
            // Final verified angle for label placement in 4th quadrant
            preciseLabelAngle = 0.2 * Math.PI; 
        } else { // David -> Tom (Outer Arc) -> 1st Quadrant (90-270 deg)
            // Final verified angle for label placement in 1st/2nd quadrant area
            preciseLabelAngle = 1.9 * Math.PI; // Adjusted to sit clearly on the arc
        }

        const labelX = R_Circle + labelRadius * Math.cos(preciseLabelAngle);
        const labelY = R_Circle + labelRadius * Math.sin(preciseLabelAngle);


        return (
            <React.Fragment key={arrowData.label}>
                <path
                    d={arrowPath}
                    fill="none" // <-- FIX: Ensures only the stroke is visible
                    stroke={arrowColor} 
                    strokeWidth={STROKE_WIDTH}
                    markerEnd={`url(#mainArrowhead-${arrowData.color.replace('#', '')})`}
                    className={`transition-all duration-300 ${arrowData.highlightName === highlightedPerson || highlightedPerson === 'David' ? 'filter drop-shadow(0 0 4px #ffc107)' : ''}`}
                />
                <text
                    x={labelX}
                    y={labelY}
                    className="font-extrabold transition-all duration-300"
                    fill={arrowColor} 
                    style={{ fontSize: '1.1rem', textShadow: '0 0 4px rgba(0,0,0,0.2)' }}
                    textAnchor="middle"
                    dominantBaseline="middle"
                >
                    {arrowData.label}
                </text>
            </React.Fragment>
        );
    };

    return (
      <>
        <svg
          className="absolute"
          style={{
            top: -ARROW_OFFSET * 2, 
            left: -ARROW_OFFSET * 2,
            width: viewBoxSize,
            height: viewBoxSize,
            zIndex: 5
          }}
          viewBox={`${-ARROW_OFFSET * 2} ${-ARROW_OFFSET * 2} ${viewBoxSize} ${viewBoxSize}`}
          preserveAspectRatio="xMidYMid meet"
        >
          <defs>
            <marker id="facingArrowhead" markerWidth="8" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M 0 0 L 6 3 L 0 6 z" fill={lineStrokeColor} />
            </marker>
            <marker id="mainArrowhead-3b82f6" markerWidth={MARKER_SIZE} markerHeight={MARKER_SIZE} refX={MARKER_SIZE * 0.8} refY={MARKER_SIZE * 0.5} orient="auto">
              <path d={`M 0 0 L ${MARKER_SIZE} ${MARKER_SIZE * 0.5} L 0 ${MARKER_SIZE} z`} fill="#3b82f6" />
            </marker>
            <marker id="mainArrowhead-dc2626" markerWidth={MARKER_SIZE} markerHeight={MARKER_SIZE} refX={MARKER_SIZE * 0.8} refY={MARKER_SIZE * 0.5} orient="auto">
              <path d={`M 0 0 L ${MARKER_SIZE} ${MARKER_SIZE * 0.5} L 0 ${MARKER_SIZE} z`} fill="#dc2626" />
            </marker>
          </defs>

          {renderSingleArrow(arrow1)} 
          {renderSingleArrow(arrow2)}

          {slots.filter(s => s.occupant).map((slot, i) => {
              const angle = angleMap[slot.position];
              return (
                  <path
                      key={i}
                      d={`M ${R_Circle + radius * Math.cos(angle) * (1 - offsetCalc/radius)} ${R_Circle + radius * Math.sin(angle) * (1 - offsetCalc/radius)} L ${R_Circle + mugSize * 0.5 * Math.cos(angle - Math.PI) * -1} ${R_Circle + mugSize * 0.5 * Math.sin(angle - Math.PI) * -1}`}
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
            style={{ width: mugSize, height: mugSize }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
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
          {renderSlots()}
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const audioUrlRef = useRef<string | null>(null);
  const audioInstanceRef = useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [circleSize, setCircleSize] = useState(300); 
  const [playbackError, setPlaybackError] = useState<string | null>(null); 
  const [language, setLanguage] = useState<Language>('en'); 
  const [currentStep, setCurrentStep] = useState(0);
  const [highlightedPersonState, setHighlightedPersonState] = useState<string | null>(null);

  const T = translations[language];
  
  const stopAudio = () => {
    if (audioInstanceRef.current) {
        window.speechSynthesis.cancel();
        audioInstanceRef.current = null;
    }
    setIsSpeaking(false);
    setHighlightedPersonState(null);
    setCurrentStep(0);
    clearTimeouts();
  };

  const timeoutsRef = useRef<NodeJS.Timeout[]>([]);
  const clearTimeouts = () => {
      timeoutsRef.current.forEach(clearTimeout);
      timeoutsRef.current = [];
  };

  const handleHighlightSequence = () => {
    // Highlighting sequence times adjusted for browser speech pacing
    
    // 0.5s: Start First Right Phase (Prabhat appears)
    timeoutsRef.current.push(setTimeout(() => { setCurrentStep(1); }, 500));
    // 1.5s: Highlight David (Reference)
    timeoutsRef.current.push(setTimeout(() => { setHighlightedPersonState('David'); }, 1500)); 
    // 2.5s: Highlight Prabhat (1st Target)
    timeoutsRef.current.push(setTimeout(() => { setHighlightedPersonState('Prabhat'); }, 3000)); 
    
    // 5.0s: Start Second Right Phase (Tom appears)
    timeoutsRef.current.push(setTimeout(() => { setCurrentStep(2); }, 5000));
    // 5.5s: Highlight David (Reference)
    timeoutsRef.current.push(setTimeout(() => { setHighlightedPersonState('David'); }, 5500)); 
    // 7.0s: Highlight Tom (2nd Target)
    timeoutsRef.current.push(setTimeout(() => { setHighlightedPersonState('Tom'); }, 7000)); 

    // 9.0s: Reset
    timeoutsRef.current.push(setTimeout(() => { 
        setHighlightedPersonState(null); 
        setIsSpeaking(false);
    }, 9000));
  };
  
  const synthesizeSpeech = () => {
    if (isSpeaking) {
      stopAudio();
      return;
    }
    
    const synth = window.speechSynthesis;
    
    // If speech is still generating or blocked, stop it first
    synth.cancel();

    const utterance = new SpeechSynthesisUtterance(T.speechText);
    utterance.lang = language === 'hi' ? 'hi-IN' : 'en-US';
    
    let speechStarted = false;

    utterance.onstart = () => {
        speechStarted = true;
        setIsSpeaking(true);
        handleHighlightSequence();
    };

    utterance.onend = () => {
        setIsSpeaking(false);
    };

    utterance.onerror = (event) => {
        console.error("Browser Speech Synthesis Error:", event.error);
        setIsSpeaking(false);
        // If speech fails, ensure the visual flow starts immediately
        if (!speechStarted) {
             setPlaybackError(T.autoplayError);
             handleHighlightSequence(); 
        }
    };

    try {
        synth.speak(utterance);
        
        // Fallback check to ensure flow starts if speech is silently blocked (common in browsers)
        setTimeout(() => {
            if (!speechStarted) {
                console.warn("Speech blocked or delayed. Initiating visual flow via fallback.");
                setPlaybackError(T.autoplayError);
                handleHighlightSequence(); 
            }
        }, 300); 

    } catch (e) {
        console.error("Speech Synthesis API is not available or failed:", e);
        setPlaybackError("Voice service unavailable. Starting visual lesson.");
        handleHighlightSequence();
    }
  };

  useEffect(() => {
    if (isDarkMode) { 
      document.documentElement.classList.add('dark'); 
    } else { 
      document.documentElement.classList.remove('dark'); 
    }

    const calculateSize = () => {
      const size = Math.min(window.innerWidth * 0.85, 300);
      setCircleSize(size);
    };

    calculateSize();
    window.addEventListener('resize', calculateSize);
    return () => window.removeEventListener('resize', calculateSize);
  }, [isDarkMode]);

  useEffect(() => {
    // Cleanup existing audio and state when language changes
    stopAudio();
  }, [language]);

  // Cleanup on unmount
  useEffect(() => {
      return () => {
          stopAudio();
      };
  }, []);
  
  const baseSlots: PlaceholderSlot[] = [
    { id: 'top', position: 'top', label: 'EMPTY', occupant: null, isFixed: false }, // Tom
    { id: 'bottom', position: 'bottom', label: 'David', occupant: 'David', isFixed: true }, // David (Fixed Reference)
    { id: 'left', position: 'left', label: 'EMPTY', occupant: null, isFixed: false }, // Akash slot
    { id: 'right', position: 'right', label: 'EMPTY', occupant: null, isFixed: false }, // Prabhat slot
  ];
  
  const currentSlots = baseSlots.map(slot => {
    // 1st Right (Prabhat) goes to the RIGHT slot (3 PM)
    if (slot.id === 'right' && currentStep >= 1) {
        return { ...slot, occupant: 'Prabhat', label: 'Prabhat' };
    }
    // 2nd Right (Tom) goes to the TOP slot (12 PM)
    if (slot.id === 'top' && currentStep >= 2) {
        return { ...slot, occupant: 'Tom', label: 'Tom' };
    }
    return slot;
  });

  const toggleDarkMode = () => setIsDarkMode(prev => !prev);

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLanguage(e.target.value as Language);
  };

  return (
    <div className={isDarkMode ? 'dark' : ''}>
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-500 p-4 sm:p-6 flex flex-col items-center font-sans">
        <div className="w-full max-w-4xl space-y-4 flex flex-col flex-grow">
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

          <div className="w-full bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border-t-4 border-green-500 flex-grow"> 
            
            {/* Instruction/Status Box */}
            <div className="p-4 sm:p-6 bg-blue-50 dark:bg-blue-900 rounded-lg border-2 border-blue-200 dark:border-blue-700 shadow-inner mb-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-blue-800 dark:text-blue-200 text-center mb-2">
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
                  disabled={isLoading}
                  className={`flex items-center px-6 py-3 rounded-full font-bold text-white shadow-lg transition duration-200 
                    ${isLoading ? 'bg-gray-400 cursor-not-allowed' : isSpeaking ? 'bg-red-600 hover:bg-red-700 active:bg-red-800' : 'bg-green-600 hover:bg-green-700 active:bg-green-800'}`}
                >
                    {isLoading ? (
                        <>
                            <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            {T.loading}
                        </>
                    ) : (
                        <>
                            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20">
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                            </svg>
                            {isSpeaking ? T.stopButton : T.playButton}
                        </>
                    )}
                </button>
              </div>
            </div>

            <CircularArrangement
              slots={currentSlots}
              circleSize={circleSize}
              language={language}
              currentStep={currentStep}
              highlightedPerson={highlightedPersonState}
            />

            <div className="w-full bg-blue-50 dark:bg-blue-900 border-l-4 border-blue-400 dark:border-blue-600 p-4 rounded-lg shadow-md mt-4">
              <div className="text-gray-700 dark:text-gray-200 leading-relaxed">
                {T.explanation}
              </div>
            </div>
          </div>

          <div className="text-center text-xs text-gray-500 dark:text-gray-400 pt-4 pb-2 flex-shrink-0">
            <p>{T.footer}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;