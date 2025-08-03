import React, { useState } from 'react';
import { RefreshCcw, ChevronDown } from 'lucide-react';

// Translations for all text in the application
const translations = {
  'en': {
    title: "Character Arrangement Challenge",
    subtitle: "Drag and drop the characters to arrange them according to the rules below.",
    characterPoolTitle: "Characters",
    chairTitle: "The Chairs",
    instructionsTitle: "Instructions",
    instruction1: "Annie is sitting **left** to Ninnie.",
    instruction2: "Vinnie is to the **immediate left** of Ninnie.",
    submitButton: "Submit",
    submitDisabledMessage: "Please select the instructions and place all characters before submitting.",
    successMessage: "🎉 Congratulations! You solved the puzzle correctly!",
    failureMessage: "❌ Not quite right. Please review the feedback and try again.",
    retryButton: "Re-try",
    correct: "✅ Correct",
    incorrect: "❌ Incorrect",
    validationMessages: {
      instruction1: {
        pass: "✅ Correct! Annie's chair number is less than Ninnie's.",
        fail: "❌ Incorrect! Annie should be in a chair with a number less than Ninnie's."
      },
      instruction2: {
        pass: "✅ Correct! Vinnie's chair is exactly one number less than Ninnie's.",
        fail: "❌ Incorrect! Vinnie must be in the chair immediately to the left of Ninnie's."
      }
    },
    characterNames: {
      annie: "Annie",
      vinnie: "Vinnie",
      ninnie: "Ninnie",
    }
  },
  'hi': {
    title: "चरित्र व्यवस्था चुनौती",
    subtitle: "नीचे दिए गए नियमों के अनुसार पात्रों को खींचकर और छोड़कर व्यवस्थित करें।",
    characterPoolTitle: "पात्र",
    chairTitle: "कुर्सियाँ",
    instructionsTitle: "निर्देश",
    instruction1: "एनी, निन्नी के **बाएँ** बैठी है।",
    instruction2: "विन्नी, निन्नी के **ठीक बाएँ** बैठी है।",
    submitButton: "जमा करें",
    submitDisabledMessage: "जमा करने से पहले कृपया निर्देशों का चयन करें और सभी पात्रों को रखें।",
    successMessage: "🎉 बधाई हो! आपने पहेली को सही ढंग से हल किया!",
    failureMessage: "❌ बिलकुल सही नहीं। कृपया प्रतिक्रिया की समीक्षा करें और पुनः प्रयास करें।",
    retryButton: "पुनः प्रयास",
    correct: "✅ सही",
    incorrect: "❌ गलत",
    validationMessages: {
      instruction1: {
        pass: "✅ सही! एनी की कुर्सी संख्या निन्नी की कुर्सी संख्या से कम है।",
        fail: "❌ गलत! एनी को निन्नी की कुर्सी से कम संख्या वाली कुर्सी में होना चाहिए।"
      },
      instruction2: {
        pass: "✅ सही! विन्नी की कुर्सी की संख्या निन्नी की कुर्सी की संख्या से ठीक एक कम है।",
        fail: "❌ गलत! विन्नी को निन्नी की कुर्सी के ठीक बाईं ओर वाली कुर्सी में होना चाहिए।"
      }
    },
    characterNames: {
      annie: "एनी",
      vinnie: "विन्नी",
      ninnie: "निन्नी",
    }
  }
};

// Character component for Annie
const AnnieImage = ({ isDraggable = false, onDragStart, isIncorrect = false }) => {
  const handleDragStart = (e) => {
    if (isDraggable) {
      e.dataTransfer.setData("character", "annie");
      onDragStart("annie");
    }
  };

  return (
    <div
      className={`
        w-12 h-16 md:w-16 md:h-20 bg-gradient-to-br from-pink-100 to-pink-200 rounded-xl overflow-hidden shadow-lg relative border-2 transition-all duration-300
        ${isDraggable ? 'cursor-grab hover:scale-105' : 'cursor-default opacity-70'}
        ${isIncorrect ? 'border-red-500 ring-2 ring-red-300 animate-pulse' : 'border-pink-200'}
      `}
      draggable={isDraggable}
      onDragStart={handleDragStart}
    >
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-4 md:w-12 md:h-6 bg-gradient-to-br from-amber-400 to-amber-500 rounded-t-full"></div>
      <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-pink-200 to-pink-300 rounded-full border border-pink-300">
        <div className="absolute top-1 left-1 w-1 h-1 md:w-2 md:h-2 bg-gray-800 rounded-full"></div>
        <div className="absolute top-1 right-1 w-1 h-1 md:w-2 md:h-2 bg-gray-800 rounded-full"></div>
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-red-400 rounded-full"></div>
      </div>
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-8 md:w-6 md:h-10 bg-gradient-to-br from-purple-300 to-purple-400 rounded-lg"></div>
    </div>
  );
};

// Character component for Vinnie
const VinnieImage = ({ isDraggable = false, onDragStart, isIncorrect = false }) => {
  const handleDragStart = (e) => {
    if (isDraggable) {
      e.dataTransfer.setData("character", "vinnie");
      onDragStart("vinnie");
    }
  };

  return (
    <div
      className={`
        w-12 h-16 md:w-16 md:h-20 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl overflow-hidden shadow-lg relative border-2 transition-all duration-300
        ${isDraggable ? 'cursor-grab hover:scale-105' : 'cursor-default opacity-70'}
        ${isIncorrect ? 'border-red-500 ring-2 ring-red-300 animate-pulse' : 'border-blue-200'}
      `}
      draggable={isDraggable}
      onDragStart={handleDragStart}
    >
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-4 md:w-12 md:h-6 bg-gradient-to-br from-amber-700 to-amber-800 rounded-t-full"></div>
      <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-blue-200 to-blue-300 rounded-full border border-blue-300">
        <div className="absolute top-1 left-1 w-1 h-1 md:w-2 md:h-2 bg-gray-800 rounded-full"></div>
        <div className="absolute top-1 right-1 w-1 h-1 md:w-2 md:h-2 bg-gray-800 rounded-full"></div>
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-red-400 rounded-full"></div>
      </div>
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-8 md:w-6 md:h-10 bg-gradient-to-br from-green-300 to-green-400 rounded-lg"></div>
    </div>
  );
};

// New character component for Ninnie
const NinnieImage = ({ isDraggable = false, onDragStart, isIncorrect = false }) => {
  const handleDragStart = (e) => {
    if (isDraggable) {
      e.dataTransfer.setData("character", "ninnie");
      onDragStart("ninnie");
    }
  };

  return (
    <div
      className={`
        w-12 h-16 md:w-16 md:h-20 bg-gradient-to-br from-green-100 to-green-200 rounded-xl overflow-hidden shadow-lg relative border-2 transition-all duration-300
        ${isDraggable ? 'cursor-grab hover:scale-105' : 'cursor-default opacity-70'}
        ${isIncorrect ? 'border-red-500 ring-2 ring-red-300 animate-pulse' : 'border-green-200'}
      `}
      draggable={isDraggable}
      onDragStart={handleDragStart}
    >
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-8 h-4 md:w-12 md:h-6 bg-gradient-to-br from-yellow-400 to-yellow-500 rounded-t-full"></div>
      <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-6 h-6 md:w-8 md:h-8 bg-gradient-to-br from-green-200 to-green-300 rounded-full border border-green-300">
        <div className="absolute top-1 left-1 w-1 h-1 md:w-2 md:h-2 bg-gray-800 rounded-full"></div>
        <div className="absolute top-1 right-1 w-1 h-1 md:w-2 md:h-2 bg-gray-800 rounded-full"></div>
        <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-1 bg-red-400 rounded-full"></div>
      </div>
      <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-4 h-8 md:w-6 md:h-10 bg-gradient-to-br from-orange-300 to-orange-400 rounded-lg"></div>
    </div>
  );
};

// Component for the chairs
const Chair = ({ chairNumber, character, onDrop, onDragOver, isIncorrect, onDragStart }) => {
  const isCharacterPresent = character !== null;
  const isCharacterDraggable = isCharacterPresent;
  let characterComponent = null;
  let characterName = '';

  switch (character) {
    case 'annie':
      characterComponent = <AnnieImage isDraggable={isCharacterDraggable} isIncorrect={isIncorrect} onDragStart={onDragStart} />;
      characterName = translations['en'].characterNames.annie;
      break;
    case 'vinnie':
      characterComponent = <VinnieImage isDraggable={isCharacterDraggable} isIncorrect={isIncorrect} onDragStart={onDragStart} />;
      characterName = translations['en'].characterNames.vinnie;
      break;
    case 'ninnie':
      characterComponent = <NinnieImage isDraggable={isCharacterDraggable} isIncorrect={isIncorrect} onDragStart={onDragStart} />;
      characterName = translations['en'].characterNames.ninnie;
      break;
    default:
      break;
  }

  return (
    <div
      className="flex flex-col items-center"
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, chairNumber)}
    >
      <div className={`
        w-20 h-24 rounded-lg border-2 border-dashed relative
        flex flex-col items-center justify-center transition-all duration-300
        ${!isCharacterPresent ? 'border-gray-300 bg-gray-50 hover:border-blue-400 hover:bg-blue-50' : 'border-gray-200 bg-gray-100'}
      `}>
        <div className="text-xs font-bold text-gray-600 mb-1">Chair {chairNumber}</div>
        {!isCharacterPresent && (
          <div className="text-2xl text-gray-400">💺</div>
        )}
      </div>
      <div className="h-20 flex items-end justify-center mt-2">
        {characterComponent && (
          <div className="flex flex-col items-center">
            {characterComponent}
            <span className="text-sm font-medium text-gray-600 mt-1">
              {translations['en'].characterNames[character] || characterName}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};

const LeftImmediateLeftPractice = () => {
  const [chairs, setChairs] = useState([
    { number: 1, occupant: null },
    { number: 2, occupant: null },
    { number: 3, occupant: null },
  ]);
  const [draggedCharacter, setDraggedCharacter] = useState(null);
  const [instruction1Checked, setInstruction1Checked] = useState(false);
  const [instruction2Checked, setInstruction2Checked] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [validationResults, setValidationResults] = useState({
    instruction1: null,
    instruction2: null,
  });
  const [incorrectCharacters, setIncorrectCharacters] = useState([]);
  const [language, setLanguage] = useState('en');
  const t = translations[language];

  const handleDragStart = (character) => {
    setDraggedCharacter(character);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, chairNumber) => {
    e.preventDefault();
    if (!draggedCharacter) return;

    const characterToPlace = draggedCharacter;
    const isCharacterInPool = !chairs.some(c => c.occupant === characterToPlace);
    const targetChair = chairs.find(c => c.number === chairNumber);

    // If the target chair is occupied, we can't drop
    if (targetChair.occupant) {
      return;
    }

    setChairs(prevChairs => {
      const newChairs = prevChairs.map(chair => {
        // Clear the character from its original chair if it was there
        if (chair.occupant === characterToPlace) {
          return { ...chair, occupant: null };
        }
        // Place the character in the new chair
        if (chair.number === chairNumber) {
          return { ...chair, occupant: characterToPlace };
        }
        return chair;
      });
      return newChairs;
    });

    setDraggedCharacter(null);
  };

  const handleDropToPool = (e) => {
    e.preventDefault();
    if (!draggedCharacter) return;

    // Check if the dragged character is coming from a chair
    const isCharacterInChair = chairs.some(c => c.occupant === draggedCharacter);

    if (isCharacterInChair) {
      // Remove character from the chair it was in
      setChairs(prevChairs => prevChairs.map(chair => {
        if (chair.occupant === draggedCharacter) {
          return { ...chair, occupant: null };
        }
        return chair;
      }));
    }

    setDraggedCharacter(null);
  };

  const handleSubmit = () => {
    if (!instruction1Checked || !instruction2Checked) {
      return;
    }

    const anniePos = chairs.find(c => c.occupant === 'annie')?.number;
    const vinniePos = chairs.find(c => c.occupant === 'vinnie')?.number;
    const ninniePos = chairs.find(c => c.occupant === 'ninnie')?.number;

    const instruction1Passed = anniePos < ninniePos;
    const instruction2Passed = vinniePos === ninniePos - 1;

    const incorrectChars = [];
    if (!instruction1Passed) {
      if (anniePos || ninniePos) incorrectChars.push('annie', 'ninnie');
    }
    if (!instruction2Passed) {
      if (vinniePos || ninniePos) incorrectChars.push('vinnie', 'ninnie');
    }
    setIncorrectCharacters([...new Set(incorrectChars)]); // Use Set to get unique characters

    setValidationResults({
      instruction1: instruction1Passed,
      instruction2: instruction2Passed,
    });
    setIsSubmitted(true);
  };

  const handleRetry = () => {
    setChairs([
      { number: 1, occupant: null },
      { number: 2, occupant: null },
      { number: 3, occupant: null },
    ]);
    setInstruction1Checked(false);
    setInstruction2Checked(false);
    setIsSubmitted(false);
    setValidationResults({
      instruction1: null,
      instruction2: null,
    });
    setIncorrectCharacters([]);
  };

  const allCharactersPlaced = chairs.every(c => c.occupant !== null);
  const isSubmitEnabled = instruction1Checked && instruction2Checked && allCharactersPlaced;

  const characterComponents = {
    annie: <AnnieImage isDraggable={!chairs.some(c => c.occupant === 'annie')} onDragStart={handleDragStart} />,
    vinnie: <VinnieImage isDraggable={!chairs.some(c => c.occupant === 'vinnie')} onDragStart={handleDragStart} />,
    ninnie: <NinnieImage isDraggable={!chairs.some(c => c.occupant === 'ninnie')} onDragStart={handleDragStart} />,
  };

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 bg-gradient-to-br from-slate-50 to-indigo-50 min-h-screen">
      <div className="bg-white rounded-2xl shadow-xl p-4 md:p-8">
        <h1 className="text-2xl md:text-3xl font-bold text-center mb-2 text-gray-800">
          {t.title}
        </h1>
        <p className="text-center text-gray-600 mb-6">{t.subtitle}</p>

        {/* Language Selector */}
        <div className="flex justify-end mb-4">
          <div className="relative">
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              className="block appearance-none w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500 cursor-pointer"
            >
              <option value="en">English</option>
              <option value="hi">हिन्दी</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
              <ChevronDown size={16} />
            </div>
          </div>
        </div>

        {/* Character Pool */}
        <div
          className="bg-gray-50 rounded-xl p-4 mb-8 border-2 border-dashed border-gray-200 transition-all duration-300"
          onDragOver={handleDragOver}
          onDrop={handleDropToPool}
        >
          <h2 className="text-xl font-semibold mb-4 text-center text-gray-700">{t.characterPoolTitle}</h2>
          <div className="flex justify-center items-center gap-6 md:gap-10 flex-wrap">
            {Object.keys(characterComponents).map(characterId => (
              <div key={characterId} className="flex flex-col items-center gap-2">
                {characterComponents[characterId]}
                <span className={`text-sm font-medium ${!chairs.some(c => c.occupant === characterId) ? 'text-gray-600' : 'text-gray-400'}`}>
                  {t.characterNames[characterId]}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Seating Arrangement */}
        <div className="bg-gray-50 rounded-xl p-6 md:p-8 mb-8">
          <h2 className="text-xl font-semibold text-center mb-6 text-gray-700">{t.chairTitle}</h2>
          <div className="flex justify-center items-end gap-6 md:gap-10">
            {chairs.map(chair => (
              <Chair
                key={chair.number}
                chairNumber={chair.number}
                character={chair.occupant}
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                isIncorrect={isSubmitted && incorrectCharacters.includes(chair.occupant)}
                onDragStart={handleDragStart}
              />
            ))}
          </div>
        </div>

        {/* Instructions */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8 border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">{t.instructionsTitle}</h2>
          <div className="space-y-4">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={instruction1Checked}
                onChange={() => setInstruction1Checked(!instruction1Checked)}
                className="form-checkbox h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-base font-medium text-gray-800">
                <span dangerouslySetInnerHTML={{ __html: t.instruction1 }}></span>
                {isSubmitted && (
                  <span className={`ml-3 font-semibold ${validationResults.instruction1 ? 'text-green-600' : 'text-red-600'}`}>
                    {validationResults.instruction1 ? t.correct : t.incorrect}
                  </span>
                )}
              </span>
            </label>
            {isSubmitted && !validationResults.instruction1 && (
              <p className="ml-8 text-sm text-red-500">{t.validationMessages.instruction1.fail}</p>
            )}
            {isSubmitted && validationResults.instruction1 && (
              <p className="ml-8 text-sm text-green-500">{t.validationMessages.instruction1.pass}</p>
            )}

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={instruction2Checked}
                onChange={() => setInstruction2Checked(!instruction2Checked)}
                className="form-checkbox h-5 w-5 text-indigo-600 rounded border-gray-300 focus:ring-indigo-500"
              />
              <span className="text-base font-medium text-gray-800">
                <span dangerouslySetInnerHTML={{ __html: t.instruction2 }}></span>
                {isSubmitted && (
                  <span className={`ml-3 font-semibold ${validationResults.instruction2 ? 'text-green-600' : 'text-red-600'}`}>
                    {validationResults.instruction2 ? t.correct : t.incorrect}
                  </span>
                )}
              </span>
            </label>
            {isSubmitted && !validationResults.instruction2 && (
              <p className="ml-8 text-sm text-red-500">{t.validationMessages.instruction2.fail}</p>
            )}
            {isSubmitted && validationResults.instruction2 && (
              <p className="ml-8 text-sm text-green-500">{t.validationMessages.instruction2.pass}</p>
            )}
          </div>
        </div>

        {/* Submit and Retry Buttons */}
        <div className="text-center">
          {!isSubmitted ? (
            <>
              {!isSubmitEnabled && (
                <p className="text-sm text-orange-600 mb-4 font-medium">
                  {t.submitDisabledMessage}
                </p>
              )}
              <button
                onClick={handleSubmit}
                disabled={!isSubmitEnabled}
                className={`
                  px-8 py-3 rounded-full text-lg font-bold text-white transition-all duration-300
                  ${isSubmitEnabled ? 'bg-indigo-600 hover:bg-indigo-700 shadow-lg hover:shadow-xl' : 'bg-gray-400 cursor-not-allowed'}
                `}
              >
                {t.submitButton}
              </button>
            </>
          ) : (
            <div className="mt-4">
              {validationResults.instruction1 && validationResults.instruction2 ? (
                <div className="bg-green-100 text-green-800 p-4 rounded-lg font-semibold text-lg animate-fade-in">
                  {t.successMessage}
                </div>
              ) : (
                <div className="bg-red-100 text-red-800 p-4 rounded-lg font-semibold text-lg animate-fade-in">
                  {t.failureMessage}
                </div>
              )}
              <button
                onClick={handleRetry}
                className="mt-4 px-6 py-2 rounded-full text-base font-medium text-indigo-600 border border-indigo-600 hover:bg-indigo-50 transition-colors flex items-center gap-2 mx-auto"
              >
                <RefreshCcw size={18} /> {t.retryButton}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LeftImmediateLeftPractice;
