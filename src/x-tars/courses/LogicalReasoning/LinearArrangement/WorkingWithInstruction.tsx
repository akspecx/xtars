import React, { useState, useEffect, useCallback, useRef } from 'react';

// Type Definitions for better code readability and maintainability
interface Character {
  id: string;
  name: string;
  initial: string;
  color: string;
}

interface Instruction {
  id: string;
  text: { en: string; hi: string };
  condition: (seats: (string | null)[], characters: Character[]) => boolean;
  isFulfilled: boolean;
  isChecked: boolean;
}

interface LanguageContent {
  title: string;
  description: string;
  dragInstruction: string;
  emptySeat: string;
  startTutorial: string;
  validateClues: string;
  submit: string;
  allCluesPassed: string;
  notAllCluesPassed: string;
  finalValidationMessage: string;
  positionsCorrect: string;
  voiceMessages: {
    initial: string;
    dragCharacter: string; // Not used in guided mode
    dropCharacter: string; // Not used in guided mode
    validatePrompt: string;
    allConditionsMet: string;
    tutorialFinished: string;
    instructionPrefix: string;
    unplaceCharacter: string; // Not used in guided mode
    // New messages for guided tutorial
    explainPlacementAnnie1: string;
    explainPlacementVinnie1: string;
    explainPlacementNinnie2: string;
    explainPlacementBunny2: string;
    explainPlacementAnnie3: string;
    explainShiftingLogic: string;
    finalValidation: string;
    solutionSubmitted: string;
  };
}

// Initial data for characters and seats
const charactersData: Character[] = [
  { id: 'annie', name: 'Annie', initial: 'A', color: 'bg-red-400 dark:bg-red-500' },
  { id: 'vinnie', name: 'Vinnie', initial: 'V', color: 'bg-blue-400 dark:bg-blue-500' },
  { id: 'ninnie', name: 'Ninnie', initial: 'N', color: 'bg-green-400 dark:bg-green-500' },
  { id: 'bunny', name: 'Bunny', initial: 'B', color: 'bg-purple-400 dark:bg-purple-500' },
];

const initialSeats: (string | null)[] = [null, null, null, null]; // Represents 4 seats

// Instructions for the puzzle
const instructionsData: Instruction[] = [
  {
    id: 'instruction1',
    text: {
      en: 'Vinnie is sitting immediately to the right of Annie.',
      hi: 'विन्नी एनी के ठीक दाहिनी ओर बैठा है।',
    },
    condition: (seats, chars) => {
      const annieIndex = seats.indexOf('annie');
      const vinnieIndex = seats.indexOf('vinnie');
      return annieIndex !== -1 && vinnieIndex !== -1 && vinnieIndex === annieIndex + 1;
    },
    isFulfilled: false,
    isChecked: false,
  },
  {
    id: 'instruction2',
    text: {
      en: 'Ninnie is sitting third to the left of Bunny.',
      hi: 'निन्नी बनी के बाईं ओर तीसरे स्थान पर बैठा है।',
    },
    condition: (seats, chars) => {
      const ninnieIndex = seats.indexOf('ninnie');
      const bunnyIndex = seats.indexOf('bunny');
      return ninnieIndex !== -1 && bunnyIndex !== -1 && ninnieIndex === bunnyIndex - 3;
    },
    isFulfilled: false,
    isChecked: false,
  },
  {
    id: 'instruction3',
    text: {
      en: 'Annie is sitting between Ninnie and Vinnie.',
      hi: 'एनी निन्नी और विन्नी के बीच में बैठी है।',
    },
    condition: (seats, chars) => {
      const annieIndex = seats.indexOf('annie');
      const ninnieIndex = seats.indexOf('ninnie');
      const vinnieIndex = seats.indexOf('vinnie');

      if (annieIndex === -1 || ninnieIndex === -1 || vinnieIndex === -1) {
        return false;
      }

      // Annie is between Ninnie and Vinnie if Ninnie < Annie < Vinnie OR Vinnie < Annie < Ninnie
      return (
        (ninnieIndex < annieIndex && annieIndex < vinnieIndex) ||
        (vinnieIndex < annieIndex && annieIndex < ninnieIndex)
      );
    },
    isFulfilled: false,
    isChecked: false,
  },
];

// Content for different languages
const content: { [key: string]: LanguageContent } = {
  en: {
    title: 'Seating Arrangement Puzzle',
    description: 'Four people - Annie, Vinnie, Ninnie, and Bunny - are sitting in a straight line, facing North.',
    dragInstruction: 'Drag characters to the seats below (or back here to unplace):',
    emptySeat: 'Empty Seat',
    startTutorial: 'Start Tutorial',
    validateClues: 'Read and validate the clues:',
    submit: 'Submit',
    allCluesPassed: 'All clues passed!',
    notAllCluesPassed: 'Not all clues are passed. Please re-check your arrangement and instructions.',
    finalValidationMessage: 'We recommend you validate all instructions again to ensure they are in the correct position. If any instruction is not met, the solution is not right.',
    positionsCorrect: 'Congratulations! All positions are correct. The puzzle is solved successfully!',
    voiceMessages: {
      initial: 'Here we will arrange them as per instruction. Follow each instruction one by one. Drag and drop the characters in their position.',
      dragCharacter: 'Now, follow the instruction and drag the character to the correct seat.',
      dropCharacter: 'Great! Now, let\'s check the next instruction.',
      validatePrompt: 'When all people are placed, click the checkboxes of the instructions. We insist you select the checkbox and validate if the conditions are met.',
      allConditionsMet: 'All conditions are met! You can now submit.',
      tutorialFinished: 'The tutorial is complete. Please validate the conditions by checking the boxes.',
      instructionPrefix: 'Instruction number ',
      unplaceCharacter: 'Character unplaced. Please re-arrange as needed.',
      explainPlacementAnnie1: 'According to instruction one, Vinnie is sitting immediately to the right of Annie. To achieve this, we will begin by placing Annie in Seat 1.',
      explainPlacementVinnie1: 'Now, to make Vinnie immediately to the right of Annie, we place Vinnie in Seat 2.',
      instruction1Complete: 'Perfect! Instruction one is now complete. Annie is in seat 1 and Vinnie is immediately to her right in seat 2.',
      explainPlacementNinnie2: 'Moving to instruction two, "Ninnie is sitting third to the left of Bunny". Let me explain this carefully. If Bunny is in seat 4, then counting three seats to the left: seat 3, seat 2, seat 1. So Ninnie must be in seat 1.',
      explainPlacementBunny2: 'Now, let\'s place Bunny in seat 4. This creates the required arrangement where Ninnie is exactly three seats to the left of Bunny.',
      instruction2Complete: 'Excellent! Instruction two is now satisfied. Let\'s verify: Ninnie is in seat 1, and Bunny is in seat 4. Counting from Bunny backwards - seat 3, seat 2, seat 1 - that\'s exactly three seats to the left where Ninnie sits.',
      explainShiftingLogic: 'Now here\'s the key insight: Since Ninnie must be in seat 1 and Bunny must be in seat 4 to satisfy instruction two, we need to shift Annie and Vinnie. Annie moves to seat 2 and Vinnie moves to seat 3. This is the only way all four people can fit while meeting both instruction one and instruction two.',
      explainPlacementAnnie3: 'Finally, let\'s confirm instruction three, "Annie is sitting between Ninnie and Vinnie". With Ninnie in Seat 1, Annie in Seat 2, and Vinnie in Seat 3, Annie is indeed between Ninnie and Vinnie.',
      instruction3Complete: 'Outstanding! All three instructions are now complete. Annie is perfectly positioned between Ninnie and Vinnie.',
      finalValidation: 'We recommend you validate all instructions again to ensure they are in the correct position. If any instruction is not met, the solution is not right.',
      solutionSubmitted: 'Congratulations! All positions are correct. The puzzle is solved successfully!'
    },
  },
  hi: {
    title: 'बैठने की व्यवस्था पहेली',
    description: 'चार लोग - एनी, विन्नी, निन्नी और बनी - एक सीधी रेखा में उत्तर दिशा की ओर मुंह करके बैठे हैं।',
    dragInstruction: 'पात्रों को नीचे दी गई सीटों पर खींचें (या वापस यहाँ अनप्लेस करने के लिए):',
    emptySeat: 'खाली सीट',
    startTutorial: 'ट्यूटोरियल शुरू करें',
    validateClues: 'सुराग पढ़ें और सत्यापित करें:',
    submit: 'प्रस्तुत करें',
    allCluesPassed: 'सभी सुराग पास हो गए!',
    notAllCluesPassed: 'सभी सुराग पास नहीं हुए हैं। कृपया अपनी व्यवस्था और निर्देशों को फिर से जांचें।',
    finalValidationMessage: 'हम अनुशंसा करते हैं कि आप सभी निर्देशों को फिर से सत्यापित करें ताकि यह सुनिश्चित हो सके कि वे सही स्थिति में हैं। यदि कोई भी निर्देश पूरा नहीं होता है तो समाधान सही नहीं है।',
    positionsCorrect: 'बधाई हो! सभी स्थितियां सही हैं। पहेली सफलतापूर्वक हल हो गई!',
    voiceMessages: {
      initial: 'यहां हम उन्हें निर्देश के अनुसार व्यवस्थित करेंगे। एक-एक करके प्रत्येक निर्देश का पालन करें। पात्रों को उनकी स्थिति में खींचें और छोड़ें।',
      dragCharacter: 'अब, निर्देश का पालन करें और पात्र को सही सीट पर खींचें।',
      dropCharacter: 'महान! अब, अगले निर्देश की जाँच करें।',
      validatePrompt: 'जब सभी लोग बैठ जाएं, तो निर्देशों के चेकबॉक्स पर क्लिक करें। हम आपसे आग्रह करते हैं कि आप चेकबॉक्स का चयन करें और सत्यापित करें कि शर्तें पूरी हुई हैं या नहीं।',
      allConditionsMet: 'सभी शर्तें पूरी हो गई हैं! अब आप जमा कर सकते हैं।',
      tutorialFinished: 'ट्यूटोरियल पूरा हो गया है। कृपया बॉक्स चेक करके शर्तों को सत्यापित करें।',
      instructionPrefix: 'निर्देश संख्या ',
      unplaceCharacter: 'पात्र को हटा दिया गया है। कृपया आवश्यकतानुसार पुनर्व्यवस्थित करें।',
      explainPlacementAnnie1: 'निर्देश एक के अनुसार, विन्नी एनी के ठीक दाहिनी ओर बैठा है। इसे प्राप्त करने के लिए, हम एनी को सीट 1 पर रखेंगे।',
      explainPlacementVinnie1: 'अब, विन्नी को एनी के ठीक दाहिनी ओर रखने के लिए, हम विन्नी को सीट 2 पर रखेंगे।',
      instruction1Complete: 'बिल्कुल सही! निर्देश एक पूरा हो गया। एनी सीट 1 में है और विन्नी उसके ठीक दाहिनी ओर सीट 2 में है।',
      explainPlacementNinnie2: 'निर्देश दो पर चलते हैं, "निन्नी बनी के बाईं ओर तीसरे स्थान पर बैठा है"। मैं इसे ध्यान से समझाता हूं। यदि बनी सीट 4 में है, तो बाईं ओर तीन सीटें गिनते हैं: सीट 3, सीट 2, सीट 1। तो निन्नी सीट 1 में होना चाहिए।',
      explainPlacementBunny2: 'अब, आइए बनी को सीट 4 में रखें। यह आवश्यक व्यवस्था बनाता है जहां निन्नी बनी के ठीक बाईं ओर तीन सीटों पर है।',
      instruction2Complete: 'उत्कृष्ट! निर्देश दो अब पूरा हो गया। आइए सत्यापित करें: निन्नी सीट 1 में है, और बनी सीट 4 में है। बनी से पीछे की ओर गिनते हुए - सीट 3, सीट 2, सीट 1 - यह ठीक तीन सीटें बाईं ओर हैं जहां निन्नी बैठा है।',
      explainShiftingLogic: 'अब यहां मुख्य बात है: चूंकि निर्देश दो को पूरा करने के लिए निन्नी सीट 1 में और बनी सीट 4 में होना चाहिए, हमें एनी और विन्नी को स्थानांतरित करना होगा। एनी सीट 2 में चली जाएगी और विन्नी सीट 3 में। यह एकमात्र तरीका है जिससे सभी चार लोग निर्देश एक और निर्देश दो दोनों को पूरा करते हुए बैठ सकें।',
      explainPlacementAnnie3: 'अंत में, आइए निर्देश तीन की पुष्टि करें, "एनी निन्नी और विन्नी के बीच में बैठी है"। निन्नी सीट 1 पर, एनी सीट 2 पर, और विन्नी सीट 3 पर होने के कारण, एनी वास्तव में निन्नी और विन्नी के बीच में है।',
      instruction3Complete: 'शानदार! सभी तीन निर्देश अब पूरे हो गए। एनी बिल्कुल सही स्थिति में निन्नी और विन्नी के बीच में है।',
      finalValidation: 'हम अनुशंसा करते हैं कि आप सभी निर्देशों को फिर से सत्यापित करें ताकि यह सुनिश्चित हो सके कि वे सही स्थिति में हैं। यदि कोई भी निर्देश पूरा नहीं होता है तो समाधान सही नहीं है।',
      solutionSubmitted: 'बधाई हो! सभी स्थितियां सही हैं। पहेली सफलतापूर्वक हल हो गई!'
    },
  },
};

const App: React.FC = () => {
  // State variables for managing the puzzle's data and UI
  const [currentCharacters, setCurrentCharacters] = useState<Character[]>(charactersData);
  const [seats, setSeats] = useState<(string | null)[]>(initialSeats);
  const [instructions, setInstructions] = useState<Instruction[]>(instructionsData);
  const [tutorialStarted, setTutorialStarted] = useState(false);
  const [currentInstructionIndex, setCurrentInstructionIndex] = useState<number>(0);
  const [language, setLanguage] = useState<'en' | 'hi'>('en');
  const [message, setMessage] = useState<string>('');
  const [allCluesPassed, setAllCluesPassed] = useState<boolean | null>(null); // null, true, false
  const [tutorialCompleted, setTutorialCompleted] = useState(false);

  // Callback function for text-to-speech
  const speak = useCallback((text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = language === 'en' ? 'en-US' : 'hi-IN'; // Set language for speech
      window.speechSynthesis.cancel(); // Stop any ongoing speech to prevent overlap
      window.speechSynthesis.speak(utterance);
    } else {
      console.warn("Speech Synthesis API not supported in this browser.");
    }
  }, [language]); // Recreate if language changes

  // Callback function to validate all instructions based on current seat arrangement
  const validateConditions = useCallback(() => {
    // This function is primarily for user-driven validation.
    // In guided tutorial mode, validation is handled explicitly within the tutorial steps.
    if (tutorialStarted) return; // Skip validation if tutorial is active

    const updatedInstructions = instructions.map((instr) => ({
      ...instr,
      isFulfilled: instr.condition(seats, charactersData), // Check if condition is met
    }));
    setInstructions(updatedInstructions);

    const allFulfilled = updatedInstructions.every((instr) => instr.isFulfilled);
    setAllCluesPassed(allFulfilled); // Update overall clue passing status

    // Provide voice feedback if all checked instructions are fulfilled
    if (allFulfilled && updatedInstructions.every(instr => instr.isChecked)) {
      speak(content[language].voiceMessages.allConditionsMet);
      setMessage(content[language].allCluesPassed);
    } else if (updatedInstructions.every(instr => instr.isChecked)) {
      setMessage(content[language].notAllCluesPassed);
    }
  }, [seats, instructions, language, speak, tutorialStarted]); // Added tutorialStarted to dependencies

  // Effect to automatically validate conditions when seats change, but only if tutorial has NOT started
  useEffect(() => {
    if (!tutorialStarted) { // Changed condition to !tutorialStarted
      validateConditions();
    }
  }, [seats, tutorialStarted, validateConditions]); // Re-run when seats or tutorialStarted changes

  // Handler for when a character drag starts
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, characterId: string) => {
    if (tutorialStarted) return; // Disable drag during tutorial
    e.dataTransfer.setData('characterId', characterId); // Store character ID in data transfer
    speak(content[language].voiceMessages.dragCharacter); // Provide voice feedback
  };

  // Handler for drag over event (prevents default to allow dropping)
  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  // Handler for dropping a character into a seat
  const handleDrop = (e: React.DragEvent<HTMLDivElement>, seatIndex: number) => {
    if (tutorialStarted) return; // Disable drop during tutorial
    e.preventDefault();
    const characterId = e.dataTransfer.getData('characterId');

    setSeats((prevSeats) => {
      const newSeats = [...prevSeats];
      const currentSeatIndex = newSeats.indexOf(characterId); // Find if character is already in a seat

      // If character is already in a seat, remove it from there
      if (currentSeatIndex !== -1) {
        newSeats[currentSeatIndex] = null;
      }

      // If there's already a character in the target seat, move it back to available characters
      const existingCharacterInTargetSeat = newSeats[seatIndex];
      if (existingCharacterInTargetSeat && existingCharacterInTargetSeat !== characterId) {
        const unplacedChar = charactersData.find(c => c.id === existingCharacterInTargetSeat);
        if (unplacedChar) {
          setCurrentCharacters(prev => {
            // Add back to available characters only if not already present
            if (!prev.some(c => c.id === unplacedChar.id)) {
              return [...prev, unplacedChar];
            }
            return prev;
          });
        }
      }

      // Place the character in the new seat
      newSeats[seatIndex] = characterId;

      return newSeats;
    });

    // Remove the dropped character from the available characters list
    setCurrentCharacters(prev => prev.filter(char => char.id !== characterId));

    speak(content[language].voiceMessages.dropCharacter); // Provide voice feedback
  };

  // Handler for dropping a character back to the available characters area (unplace)
  const handleUnplace = (e: React.DragEvent<HTMLDivElement>) => {
    if (tutorialStarted) return; // Disable unplace during tutorial
    e.preventDefault();
    const characterId = e.dataTransfer.getData('characterId');

    setSeats((prevSeats) => {
      const newSeats = [...prevSeats];
      const indexInSeat = newSeats.indexOf(characterId);
      if (indexInSeat !== -1) {
        newSeats[indexInSeat] = null; // Remove character from seat
        const unplacedChar = charactersData.find(c => c.id === characterId);
        if (unplacedChar) {
          setCurrentCharacters(prev => {
            // Add back to available characters only if not already present
            if (!prev.some(c => c.id === unplacedChar.id)) {
              return [...prev, unplacedChar];
            }
            return prev;
          });
        }
      }
      return newSeats;
    });
    speak(content[language].voiceMessages.unplaceCharacter); // Provide voice feedback
  };

  // Function to start the guided tutorial
  const startTutorial = () => {
    setTutorialStarted(true);
    setTutorialCompleted(false);
    setCurrentCharacters(charactersData); // Reset all characters to be available
    setSeats(initialSeats); // Reset all seats to empty
    // Reset instructions to initial state (not fulfilled, not checked)
    setInstructions(instructionsData.map(instr => ({ ...instr, isFulfilled: false, isChecked: false })));
    setCurrentInstructionIndex(0); // Start from the first instruction
    setMessage(''); // Clear any previous messages
    setAllCluesPassed(null); // Reset clue passing status

    // Define the sequence of tutorial steps with actions and delays
    const tutorialSteps = [
      {
        action: () => speak(content[language].voiceMessages.initial),
        delay: 5000,
      },
      {
        action: () => {
          speak(`${content[language].voiceMessages.instructionPrefix} 1: ${instructionsData[0].text[language]}`);
          setCurrentInstructionIndex(0);
        },
        delay: 6000,
      },
      {
        action: () => {
          speak(content[language].voiceMessages.explainPlacementAnnie1);
          setSeats(['annie', null, null, null]); // Annie in seat 0
          setCurrentCharacters(prev => prev.filter(c => c.id !== 'annie'));
        },
        delay: 5000,
      },
      {
        action: () => {
          speak(content[language].voiceMessages.explainPlacementVinnie1);
          setSeats(['annie', 'vinnie', null, null]); // Vinnie in seat 1
          setCurrentCharacters(prev => prev.filter(c => c.id !== 'vinnie'));
          // Mark instruction 1 as checked and fulfilled
          setInstructions(prev => prev.map((instr, idx) => idx === 0 ? { ...instr, isChecked: true, isFulfilled: instr.condition(['annie', 'vinnie', null, null], charactersData) } : instr));
        },
        delay: 5000,
      },
      {
        action: () => {
          speak(content[language].voiceMessages.instruction1Complete);
        },
        delay: 7000, // Extended pause for instruction 1 completion
      },
      // PAUSE BEFORE MOVING TO INSTRUCTION 2
      {
        action: () => {
          // Silent pause to let instruction 1 completion sink in
        },
        delay: 2000,
      },
      {
        action: () => {
          speak(`${content[language].voiceMessages.instructionPrefix} 2: ${instructionsData[1].text[language]}`);
          setCurrentInstructionIndex(1); // Move to next instruction
        },
        delay: 7000,
      },
      {
        action: () => {
          speak(content[language].voiceMessages.explainPlacementNinnie2);
          // Set the final solution directly for Ninnie, Annie, Vinnie
          setSeats(['ninnie', 'annie', 'vinnie', null]);
          setCurrentCharacters(prev => prev.filter(c => c.id !== 'ninnie'));
        },
        delay: 8000, // Extended for the detailed explanation
      },
      {
        action: () => {
          speak(content[language].voiceMessages.explainPlacementBunny2);
          setSeats(['ninnie', 'annie', 'vinnie', 'bunny']); // Bunny in seat 3
          setCurrentCharacters(prev => prev.filter(c => c.id !== 'bunny'));
          // Mark instruction 2 as checked and fulfilled
          setInstructions(prev => prev.map((instr, idx) => idx === 1 ? { ...instr, isChecked: true, isFulfilled: instr.condition(['ninnie', 'annie', 'vinnie', 'bunny'], charactersData) } : instr));
        },
        delay: 6000,
      },
      {
        action: () => {
          speak(content[language].voiceMessages.instruction2Complete);
        },
        delay: 8000, // Extended pause for instruction 2 completion verification
      },
      // PAUSE BEFORE EXPLAINING SHIFTING LOGIC
      {
        action: () => {
          // Silent pause to let instruction 2 completion sink in
        },
        delay: 2000,
      },
      {
        action: () => {
          speak(content[language].voiceMessages.explainShiftingLogic);
        },
        delay: 9000, // Extended for the complex shifting explanation
      },
      // PAUSE BEFORE MOVING TO INSTRUCTION 3
      {
        action: () => {
          // Silent pause after shifting explanation
        },
        delay: 2000,
      },
      {
        action: () => {
          speak(`${content[language].voiceMessages.instructionPrefix} 3: ${instructionsData[2].text[language]}`);
          setCurrentInstructionIndex(2); // Move to next instruction
        },
        delay: 7000,
      },
      {
        action: () => {
          speak(content[language].voiceMessages.explainPlacementAnnie3);
          // Mark instruction 3 as checked and fulfilled
          setInstructions(prev => prev.map((instr, idx) => idx === 2 ? { ...instr, isChecked: true, isFulfilled: instr.condition(['ninnie', 'annie', 'vinnie', 'bunny'], charactersData) } : instr));
        },
        delay: 6000,
      },
      {
        action: () => {
          speak(content[language].voiceMessages.instruction3Complete);
        },
        delay: 7000, // Extended pause for instruction 3 completion
      },
      // PAUSE BEFORE FINAL VALIDATION
      {
        action: () => {
          // Silent pause to let all instructions completion sink in
        },
        delay: 3000,
      },
      {
        action: () => {
          speak(content[language].voiceMessages.finalValidation);
          setMessage(content[language].finalValidationMessage);
        },
        delay: 8000,
      },
      {
        action: () => {
          speak(content[language].voiceMessages.solutionSubmitted);
          setAllCluesPassed(true); // Since it's the correct solution
          setMessage(content[language].positionsCorrect);
          setTutorialStarted(false); // End tutorial mode
          setTutorialCompleted(true);
          setCurrentInstructionIndex(-1); // No current instruction
        },
        delay: 3000,
      },
    ];

    let totalDelay = 0;
    tutorialSteps.forEach((step) => {
      setTimeout(step.action, totalDelay);
      totalDelay += step.delay;
    });
  };

  // Handler for instruction checkbox changes (disabled during tutorial)
  const handleInstructionCheckboxChange = (index: number) => {
    if (tutorialStarted) return; // Disable checkbox interaction during tutorial

    setInstructions((prevInstructions) => {
      const newInstructions = [...prevInstructions];
      newInstructions[index] = {
        ...newInstructions[index],
        isChecked: !newInstructions[index].isChecked, // Toggle checked status
      };
      return newInstructions;
    });

    // If all instructions are checked, prompt the user to validate
    if (instructions.every(instr => instr.isChecked)) {
      speak(content[language].voiceMessages.validatePrompt);
    }
  };

  // Handler for the submit button
  const handleSubmit = () => {
    if (tutorialStarted) return; // Disable submit during tutorial

    // Check if all clues are passed and provide feedback
    if (allCluesPassed) {
      setMessage(content[language].positionsCorrect);
      speak(content[language].voiceMessages.solutionSubmitted);
    } else {
      setMessage(content[language].notAllCluesPassed);
    }
  };

  // Helper function to get character object from seat index
  const getCharacterInSeat = (seatIndex: number) => {
    const charId = seats[seatIndex];
    return charactersData.find((char) => char.id === charId);
  };

  // Sort available characters alphabetically by name for consistent display
  const sortedAvailableCharacters = [...currentCharacters].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex items-center justify-center p-4 font-inter">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 w-full max-w-4xl">
        {/* Header and Language Selector */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">{content[language].title}</h1>
          <div className="relative">
            <select
              className="block appearance-none w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-200 py-2 px-4 pr-8 rounded-lg leading-tight focus:outline-none focus:bg-white dark:focus:bg-gray-700 focus:border-blue-500 dark:focus:border-blue-400 shadow-sm"
              value={language}
              onChange={(e) => setLanguage(e.target.value as 'en' | 'hi')}
              disabled={tutorialStarted}
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700 dark:text-gray-300">
              <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20">
                <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
              </svg>
            </div>
          </div>
        </div>

        {/* Puzzle Description */}
        <p className="text-gray-600 dark:text-gray-300 mb-6">{content[language].description}</p>

        {/* Instructions Section */}
        <div className="bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-700 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-800 dark:text-blue-300 mb-3">{content[language].validateClues}</h2>
          {instructions.map((instr, index) => (
            <div
              key={instr.id}
              className={`flex items-center mb-2 p-2 rounded-lg transition-all duration-300 ${
                tutorialStarted && index === currentInstructionIndex
                  ? 'bg-yellow-100 dark:bg-yellow-900 border border-yellow-300 dark:border-yellow-600'
                  : ''
              }`}
            >
              <input
                type="checkbox"
                id={instr.id}
                checked={instr.isChecked}
                onChange={() => handleInstructionCheckboxChange(index)}
                className="form-checkbox h-5 w-5 text-blue-600 dark:text-blue-400 rounded-md transition duration-150 ease-in-out"
                disabled={tutorialStarted}
              />
              <label
                htmlFor={instr.id}
                className={`ml-3 text-gray-700 dark:text-gray-200 text-base flex-grow ${
                  instr.isFulfilled ? 'line-through text-green-600 dark:text-green-400' : ''
                }`}
              >
                {instr.text[language]}
              </label>
              {tutorialStarted && instr.isChecked && (
                <span
                  className={`ml-2 font-bold ${
                    instr.isFulfilled ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'
                  }`}
                >
                  {instr.isFulfilled ? '✓' : '✗'}
                </span>
              )}
            </div>
          ))}
        </div>

        {/* Draggable Characters Section */}
        <div className="mb-6">
          <p className="text-gray-700 dark:text-gray-200 text-center mb-4">{content[language].dragInstruction}</p>
          <div
            className="flex flex-wrap justify-center gap-4 p-4 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg min-h-[120px]"
            onDragOver={handleDragOver}
            onDrop={handleUnplace}
          >
            {sortedAvailableCharacters.length > 0 ? (
              sortedAvailableCharacters.map((char) => (
                <div
                  key={char.id}
                  draggable={!tutorialStarted}
                  onDragStart={(e) => handleDragStart(e, char.id)}
                  className={`cursor-grab p-4 rounded-xl shadow-md text-white text-center font-bold transition-all duration-200 transform hover:scale-105 ${char.color} ${tutorialStarted ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <div className="text-2xl">{char.initial}</div>
                  <div className="text-sm">{char.name}</div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 dark:text-gray-400 self-center">All characters are in seats.</p>
            )}
          </div>
        </div>

        {/* Seating Arrangement Area */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
          {seats.map((charId, index) => {
            const charInSeat = getCharacterInSeat(index);
            return (
              <div
                key={index}
                className="relative bg-gray-200 dark:bg-gray-700 rounded-xl p-4 h-32 flex flex-col items-center justify-center border-2 border-dashed border-gray-300 dark:border-gray-600 transition-all duration-200 hover:border-blue-400 dark:hover:border-blue-500"
                onDragOver={handleDragOver}
                onDrop={(e) => handleDrop(e, index)}
              >
                {charInSeat ? (
                  <div
                    draggable={!tutorialStarted}
                    onDragStart={(e) => handleDragStart(e, charInSeat.id)}
                    className={`cursor-grab p-4 rounded-xl shadow-md text-white text-center font-bold transition-all duration-200 transform hover:scale-105 ${charInSeat.color} ${tutorialStarted ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    <div className="text-2xl">{charInSeat.initial}</div>
                    <div className="text-sm">{charInSeat.name}</div>
                  </div>
                ) : (
                  <span className="text-gray-500 dark:text-gray-400">{content[language].emptySeat}</span>
                )}
                <div className="absolute bottom-2 text-sm text-gray-600 dark:text-gray-300">Seat {index + 1}</div>
              </div>
            );
          })}
        </div>

        {/* Start Tutorial Button */}
        {!tutorialStarted && !tutorialCompleted && (
          <div className="text-center">
            <button
              onClick={startTutorial}
              className="bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:ring-opacity-50"
            >
              {content[language].startTutorial}
            </button>
          </div>
        )}

        {/* Submit Button and Message */}
        {(tutorialCompleted || (!tutorialStarted && seats.every(seat => seat !== null))) && (
          <div className="text-center mt-6">
            <button
              onClick={handleSubmit}
              className={`py-3 px-8 rounded-full shadow-lg transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-opacity-50
                ${allCluesPassed === true && instructions.every(instr => instr.isChecked)
                  ? 'bg-green-600 dark:bg-green-700 hover:bg-green-700 dark:hover:bg-green-800 text-white focus:ring-green-500 dark:focus:ring-green-400'
                  : 'bg-blue-600 dark:bg-blue-700 hover:bg-blue-700 dark:hover:bg-blue-800 text-white focus:ring-blue-500 dark:focus:ring-blue-400'
                }`}
            >
              {content[language].submit}
            </button>
            {message && (
              <p className={`mt-4 text-lg font-semibold ${allCluesPassed ? 'text-green-700 dark:text-green-400' : 'text-red-700 dark:text-red-400'}`}>
                {message}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default App;