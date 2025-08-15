import React, { useState, useEffect, createContext, useContext } from 'react';
// Removed local image imports as they are not supported in this environment
import Annie from './Images/Annie.jpeg'
import Minnie from './Images/Minnie.jpeg'
import Ninnie from './Images/Ninnie.jpeg'
import Binny from './Images/Binny.jpeg'
import Sunny from './Images/Sunny.jpeg'
import Vinny from './Images/Vinnie.jpeg'


// Create a context for language
const LanguageContext = createContext();

// Language translations
const translations = {
  en: {
    title: "Arrange the Characters",
    welcomeMessage: "Welcome to the next session. Here we are going to practice today sitting arrangement in parallel. So follow the instruction and make the characters sit in the empty spaces below.",
    instructionsIntro: "Instructions:",
    instructions: [ // All instructions combined into one flat list as requested
      { id: 'inst1', text: "Binny, Sunny, and Vinny are in the first line." },
      { id: 'inst2', text: "Annie, Minnie, and Ninnie are in the second line." },
      { id: 'inst3', text: "Sunny is to the left of Binny." },
      { id: 'inst4', text: "Vinny is to the right of Binny." },
      { id: 'inst5', text: "Annie is to the left of Minnie." },
      { id: 'inst6', text: "Ninnie is to the right of Minnie." },
    ],
    instructionsPrompt: "Please drag and drop the characters into the empty spaces according to the instructions above.",
    charactersHeading: "Available Characters:",
    submitButton: "Submit Arrangement",
    resetButton: "Reset",
    feedbackHeading: "Arrangement Feedback:",
    correctPlacement: (name) => `${name} is correctly placed! 🎉`,
    incorrectPlacement: (name, expected) => `${name} is incorrectly placed. Expected: ${expected}. 🤔`,
    emptySpot: (spot) => `Spot ${spot} is empty. �`,
    allCorrect: "Congratulations! All characters are correctly placed! ✨",
    notAllCorrect: "Keep trying! Some characters are not in their correct positions. 🚧",
    speechInstructions: "Drag and drop the characters as per the instructions.",
    speechAllCorrect: "Congratulations! All characters are correctly placed!",
    speechNotAllCorrect: "Keep trying! Some characters are not in their correct positions.",
    toggleTheme: "Toggle Theme",
    selectLanguage: "Select Language:",
    languageEn: "English",
    languageEs: "Spanish",
    languageFr: "French",
    readInstructionsCheckboxOverall: "I have read and understood all instructions."
  },
  es: {
    title: "Organiza los Personajes",
    welcomeMessage: "Bienvenidos a la próxima sesión. Aquí vamos a practicar hoy la disposición de asientos en paralelo. Así que sigue las instrucciones y haz que los personajes se sienten en los espacios vacíos de abajo.",
    instructionsIntro: "Instrucciones:",
    instructions: [ // All instructions combined into one flat list as requested
      { id: 'inst1', text: "Binny, Sunny y Vinny están en la primera línea." },
      { id: 'inst2', text: "Annie, Minnie y Ninnie están en la segunda línea." },
      { id: 'inst3', text: "Sunny está a la izquierda de Binny." },
      { id: 'inst4', text: "Vinny está a la derecha de Binny." },
      { id: 'inst5', text: "Annie está a la izquierda de Minnie." },
      { id: 'inst6', text: "Ninnie está a la derecha de Minnie." },
    ],
    instructionsPrompt: "Arrastra y suelta los personajes en los espacios vacíos según las instrucciones anteriores.",
    charactersHeading: "Personajes Disponibles:",
    submitButton: "Enviar Disposición",
    resetButton: "Reiniciar",
    feedbackHeading: "Comentarios sobre la Disposición:",
    correctPlacement: (name) => `¡${name} está correctamente colocado! 🎉`,
    incorrectPlacement: (name, expected) => `${name} está incorrectamente colocado. Esperado: ${expected}. 🤔`,
    emptySpot: (spot) => `El espacio ${spot} está vacío. 🚨`,
    allCorrect: "¡Felicidades! ¡Todos los personajes están correctamente colocados! ✨",
    notAllCorrect: "¡Sigue intentándolo! Algunos personajes no están en sus posiciones correctas. 🚧",
    speechInstructions: "Arrastra y suelta los personajes según las instrucciones.",
    speechAllCorrect: "¡Felicidades! ¡Todos los personajes están correctamente colocados!",
    speechNotAllCorrect: "¡Sigue intentándolo! Algunos personajes no están en sus posiciones correctas.",
    toggleTheme: "Cambiar Tema",
    selectLanguage: "Seleccionar Idioma:",
    languageEn: "Inglés",
    languageEs: "Español",
    languageFr: "Francés",
    readInstructionsCheckboxOverall: "He leído y entendido todas las instrucciones."
  },
  fr: {
    title: "Organisez les Personnages",
    welcomeMessage: "Bienvenue à la prochaine session. Ici, nous allons pratiquer aujourd'hui la disposition des sièges en parallèle. Alors suivez les instructions et placez les personnages dans les espaces vides ci-dessous.",
    instructionsIntro: "Instructions:",
    instructions: [ // All instructions combined into one flat list as requested
      { id: 'inst1', text: "Binny, Sunny et Vinny sont dans la première ligne." },
      { id: 'inst2', text: "Annie, Minnie et Ninnie sont dans la deuxième ligne." },
      { id: 'inst3', text: "Sunny est à gauche de Binny." },
      { id: 'inst4', text: "Vinny est à droite de Binny." },
      { id: 'inst5', text: "Annie est à gauche de Minnie." },
      { id: 'inst6', text: "Ninnie est à droite de Minnie." },
    ],
    instructionsPrompt: "Veuillez faire glisser et déposer les personnages dans les espaces vides selon les instructions ci-dessus.",
    charactersHeading: "Personnages Disponibles:",
    submitButton: "Soumettre l'Arrangement",
    resetButton: "Réinitialiser",
    feedbackHeading: "Commentaires sur l'Arrangement:",
    correctPlacement: (name) => `${name} est correctement placé ! 🎉`,
    incorrectPlacement: (name, expected) => `${name} est mal placé. Attendu : ${expected}. 🤔`,
    emptySpot: (spot) => `L'emplacement ${spot} est vide. 🚨`,
    allCorrect: "Félicitations ! Tous les personnages sont correctement placés ! ✨",
    notAllCorrect: "Continuez d'essayer ! Certains personnages ne sont pas à leurs bonnes positions. 🚧",
    speechInstructions: "Faites glisser et déposez les personnages selon les instructions.",
    speechAllCorrect: "Félicitations ! Tous les personnages sont correctement placés !",
    speechNotAllCorrect: "Continuez d'essayer ! Certains personnages ne sont pas à leurs bonnes positions.",
    toggleTheme: "Changer de Thème",
    selectLanguage: "Sélectionner la Langue:",
    languageEn: "Anglais",
    languageEs: "Español",
    languageFr: "Francés",
    readInstructionsCheckboxOverall: "J'ai lu et compris toutes les instructions."
  }
};

const useSpeechSynthesis = () => {
  const [synth, setSynth] = useState(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSynth(window.speechSynthesis);
    }
  }, []);

  const speak = (text, lang = 'en') => {
    if (synth && text) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      synth.speak(utterance);
    }
  };

  return { speak };
};

// Component for a draggable character
const DraggableCharacter = ({ character, onDragStart, isPlaced, characterImage }) => {
  return (
    <div
      className={`p-4 bg-gradient-to-br from-purple-600 to-blue-500 text-white rounded-xl shadow-lg transform-gpu flex flex-col items-center justify-center m-2
        ${isPlaced ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-grab hover:scale-105'}
        w-[120px] h-[150px]`} // Fixed outer dimensions
      draggable={!isPlaced} // Only draggable if not placed
      onDragStart={(e) => onDragStart(e, character.id)}
    >
      <img
        src={characterImage}
        alt={character.name}
        className="w-[80px] h-[80px] object-cover mb-2 border-2 border-white rounded-md" // Fixed inner image dimensions
        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/100x100/A78BFA/ffffff?text=Char"; }} // Fallback image
      />
      <span className="font-semibold text-sm sm:text-base">{character.name}</span> {/* Standard font size */}
    </div>
  );
};

// Component for a droppable placeholder
const Placeholder = ({ id, character, onDrop, onDragOver, onRemoveCharacter, characterImages }) => {
  const { t } = useContext(LanguageContext);
  return (
    <div
      className="relative flex items-center justify-center bg-gray-200 dark:bg-gray-700 border-dashed border-4 border-gray-400 dark:border-gray-500 rounded-xl m-2
      w-[120px] h-[150px] transition-all duration-300 ease-in-out overflow-hidden group" // Fixed outer dimensions
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, id)}
    >
      {character ? (
        <div className="absolute inset-0 flex flex-col items-center justify-center p-2">
          <img
            src={characterImages[character.name.toLowerCase()]}
            alt={character.name}
            className="w-[80px] h-[80px] object-cover rounded-md" // Fixed inner image dimensions
            onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/150x150/A78BFA/ffffff?text=Placed"; }} // Fallback
          />
          <button
            onClick={() => onRemoveCharacter(id)}
            className="absolute bottom-2 right-2 p-1 bg-red-500 text-white rounded-full text-xs sm:text-sm shadow-md hover:bg-red-600 transition-colors duration-200 opacity-0 group-hover:opacity-100"
            title={t("removeCharacter")}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
      ) : (
        <span className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-medium"> {/* Standard font size */}
          {`Spot ${id.split('P')[1]}`}
        </span>
      )}
    </div>
  );
};

function App() {
  const initialCharacters = [
    { id: 'annie', name: 'Annie', placed: false },
    { id: 'minnie', name: 'Minnie', placed: false },
    { id: 'ninnie', name: 'Ninnie', placed: false },
    { id: 'binny', name: 'Binny', placed: false },
    { id: 'sunny', name: 'Sunny', placed: false },
    { id: 'vinny', name: 'Vinny', placed: false },
  ];

  const initialPlaceholders = {
    P1: null, P2: null, P3: null, // Top row
    P4: null, P5: null, P6: null, // Bottom row
  };

  // Correct arrangement based on the updated detailed instructions
  const correctArrangement = {
    P1: 'vinny', P2: 'binny', P3: 'sunny',   // First line (Vinny, Binny, Sunny from left to right on screen)
    P4: 'annie', P5: 'minnie', P6: 'ninnie', // Second line (Annie, Minnie, Ninnie from left to right on screen)
  };

// Reverted to placeholder images for compilation in the Canvas environment
// const characterImages = {
//     annie: "https://placehold.co/150x150/FFD700/000000?text=Annie",
//     minnie: "https://placehold.co/150x150/ADFF2F/000000?text=Minnie",
//     ninnie: "https://placehold.co/150x150/40E0D0/000000?text=Ninnie",
//     binny: "https://placehold.co/150x150/FF6347/000000?text=Binny",
//     sunny: "https://placehold.co/150x150/DA70D6/000000?text=Sunny",
//     vinny: "https://placehold.co/150x150/8A2BE2/000000?text=Vinny",
//   };

const characterImages = {
    annie: Annie,
    minnie: Minnie,
    ninnie: Ninnie,
    binny: Binny,
    sunny: Sunny,
    vinny: Vinny
  };

  const [characters, setCharacters] = useState(initialCharacters);
  const [placeholders, setPlaceholders] = useState(initialPlaceholders);
  const [results, setResults] = useState(null);
  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [individualInstructionsRead, setIndividualInstructionsRead] = useState(() => {
    const initialState = {};
    // Initialize state for all instructions in the combined list
    translations.en.instructions.forEach(inst => {
      initialState[inst.id] = false;
    });
    return initialState;
  });
  const [hasSpokenWelcome, setHasSpokenWelcome] = useState(false);


  const { speak } = useSpeechSynthesis();

  // Set initial theme based on system preference
  useEffect(() => {
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      setDarkMode(true);
    }
  }, []);

  // Apply dark mode class to HTML element
  useEffect(() => {
    const html = document.documentElement;
    if (darkMode) {
      html.classList.add('dark');
    } else {
      html.classList.remove('dark');
    }
  }, [darkMode]);

  const t = (key, ...args) => {
    let text = translations[language]?.[key];
    if (typeof text === 'function') {
      return text(...args);
    }
    return text || key; // Fallback to key if not found
  };

  const handleDragStart = (e, characterId) => {
    e.dataTransfer.setData("characterId", characterId);
  };

  const handleDrop = (e, placeholderId) => {
    e.preventDefault();
    const characterId = e.dataTransfer.getData("characterId");
    const draggedCharacter = characters.find(char => char.id === characterId);

    if (!draggedCharacter) return;

    // Check if the target placeholder is already occupied by another character
    // and if the dragged character is already in a different placeholder
    const existingCharacterInTarget = placeholders[placeholderId];
    const oldPlaceholderId = Object.keys(placeholders).find(key => placeholders[key]?.id === characterId);

    // If character is being moved from another placeholder to a new one
    if (oldPlaceholderId && oldPlaceholderId !== placeholderId) {
      setPlaceholders(prev => ({
        ...prev,
        [oldPlaceholderId]: null, // Clear old spot
        [placeholderId]: draggedCharacter, // Place in new spot
      }));
    } else if (!oldPlaceholderId) {
      // If dropping from character pool and the spot is empty
      setPlaceholders(prev => ({
        ...prev,
        [placeholderId]: draggedCharacter,
      }));
      // Mark the character as placed so it becomes visually deactivated
      setCharacters(prev =>
        prev.map(char =>
          char.id === characterId ? { ...char, placed: true } : char
        )
      );
    }
    setResults(null); // Clear results on new drop or movement
  };


  const handleRemoveCharacter = (placeholderId) => {
    const characterToRemove = placeholders[placeholderId];
    if (characterToRemove) {
      setPlaceholders(prev => ({
        ...prev,
        [placeholderId]: null,
      }));
      // Make the character available again in the draggable pool by setting placed to false
      setCharacters(prev =>
        prev.map(char =>
          char.id === characterToRemove.id ? { ...char, placed: false } : char
        )
      );
    }
    setResults(null); // Clear results on removal
  };

  const handleSubmit = () => {
    const newResults = {};
    let allCorrect = true;

    Object.keys(correctArrangement).forEach(spotId => {
      const placedCharacter = placeholders[spotId];
      const expectedCharacterId = correctArrangement[spotId];
      const expectedCharacterName = initialCharacters.find(char => char.id === expectedCharacterId)?.name;

      if (!placedCharacter) {
        newResults[spotId] = { correct: false, message: t("emptySpot", spotId) };
        allCorrect = false;
      } else if (placedCharacter.id === expectedCharacterId) {
        newResults[spotId] = { correct: true, message: t("correctPlacement", placedCharacter.name) };
      } else {
        newResults[spotId] = { correct: false, message: t("incorrectPlacement", placedCharacter.name, expectedCharacterName) };
        allCorrect = false;
      }
    });

    setResults({ feedback: newResults, allCorrect });

    if (allCorrect) {
      speak(t("speechAllCorrect"), language);
    } else {
      speak(t("speechNotAllCorrect"), language);
    }
  };

  const handleReset = () => {
    setCharacters(initialCharacters);
    setPlaceholders(initialPlaceholders);
    setResults(null);
    // Reset individual instruction checkboxes for all instructions
    const resetInstructions = {};
    translations[language].instructions.forEach(inst => {
      resetInstructions[inst.id] = false;
    });
    setIndividualInstructionsRead(resetInstructions);
  };

  // Effect for initial welcome message (only once on load)
  useEffect(() => {
    if (!hasSpokenWelcome) {
      speak(t("welcomeMessage"), language);
      setHasSpokenWelcome(true);
    }
  }, [hasSpokenWelcome, language]); // Dependency on language to allow welcome in chosen language

  // Effect to re-initialize individual instruction checkboxes if language changes
  useEffect(() => {
    const currentInstructionIds = translations[language].instructions.map(inst => inst.id);

    setIndividualInstructionsRead(prev => {
      const newState = {};
      currentInstructionIds.forEach(id => {
        newState[id] = prev[id] || false;
      });
      return newState;
    });
  }, [language]);


  // Handler for individual instruction checkbox
  const handleIndividualInstructionChange = (id, checked) => {
    setIndividualInstructionsRead(prev => ({
      ...prev,
      [id]: checked,
    }));
  };

  // Check if all individual instruction checkboxes are checked across the single list
  const allIndividualInstructionsRead =
    translations[language].instructions.every(inst => individualInstructionsRead[inst.id]);


  // Check if all placeholders are filled
  const allPlaceholdersFilled = Object.values(placeholders).every(Boolean);

  return (
    <LanguageContext.Provider value={{ t, language, setLanguage }}>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-inter p-4 sm:p-6 lg:p-8 transition-colors duration-300">
        <style>
          {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap');
          body { font-family: 'Inter', sans-serif; }
          /* Removed .rounded-full from global styles as it's now controlled on specific elements */
          .rounded-xl { border-radius: 0.75rem; }
          .group:hover .group-hover\\:opacity-100 { opacity: 1; }
          `}
        </style>

        <div className="max-w-4xl mx-auto bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 sm:p-8 lg:p-10 transform transition-all duration-300">
          <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 text-purple-700 dark:text-purple-400">
            {t("title")}
          </h1>

          <div className="flex flex-col sm:flex-row justify-between items-center mb-6 space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-2">
              <label htmlFor="language-select" className="text-gray-700 dark:text-gray-300 font-medium">
                {t("selectLanguage")}
              </label>
              <select
                id="language-select"
                value={language}
                onChange={(e) => setLanguage(e.target.value)}
                className="p-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:outline-none focus:ring-2 focus:ring-purple-500"
              >
                <option value="en">{t("languageEn")}</option>
                <option value="es">{t("languageEs")}</option>
                <option value="fr">{t("languageFr")}</option>
              </select>
            </div>
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="px-4 py-2 bg-gradient-to-r from-blue-500 to-indigo-600 text-white rounded-lg shadow-md hover:from-blue-600 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {darkMode ? (
                <>
                  <span role="img" aria-label="sun">☀️</span> {t("toggleTheme")} (Light)
                </>
              ) : (
                <>
                  <span role="img" aria-label="moon">🌙</span> {t("toggleTheme")} (Dark)
                </>
              )}
            </button>
          </div>

          {/* Instructions Placeholder */}
          <div className="p-6 bg-blue-50 dark:bg-gray-700 rounded-xl shadow-inner border border-blue-200 dark:border-gray-600 mb-8">
            <p className="text-lg font-medium mb-4 text-center text-gray-700 dark:text-gray-300">{t("instructionsIntro")}</p>

            {/* Combined Instructions List */}
            <ul className="list-none space-y-2 text-left mb-4">
              {translations[language].instructions.map(inst => (
                <li key={inst.id} className="flex items-center">
                  <input
                    type="checkbox"
                    id={`instruction-${inst.id}`}
                    checked={individualInstructionsRead[inst.id]}
                    onChange={(e) => handleIndividualInstructionChange(inst.id, e.target.checked)}
                    className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500 dark:bg-gray-600 dark:border-gray-500"
                  />
                  <label htmlFor={`instruction-${inst.id}`} className="ml-2 text-gray-700 dark:text-gray-300 font-normal text-base">
                    {inst.text}
                  </label>
                </li>
              ))}
            </ul>

            <p className="mt-4 text-md text-orange-600 dark:text-orange-300 font-semibold text-center">
              {t("instructionsPrompt")}
            </p>
            <div className="flex items-center justify-center mt-4">
              <input
                type="checkbox"
                id="read-instructions-overall"
                checked={allIndividualInstructionsRead}
                readOnly // Make it read-only as it's controlled by individual checkboxes
                className="h-5 w-5 text-purple-600 rounded focus:ring-purple-500 dark:bg-gray-600 dark:border-gray-500 cursor-not-allowed"
              />
              <label htmlFor="read-instructions-overall" className="ml-2 text-gray-700 dark:text-gray-300 font-medium">
                {t("readInstructionsCheckboxOverall")}
              </label>
            </div>
            {!allIndividualInstructionsRead && (
              <p className="text-center text-red-500 dark:text-red-300 text-sm mt-2">
                Please check all individual instruction boxes to enable the submit button.
              </p>
            )}
          </div>

          {/* Main arrangement area: combines characters and placeholders into one flow */}
          <div className="flex flex-col items-center w-full">
            {/* Characters Section (all in one row) */}
            <div className="w-full text-center mb-4">
              <p className="text-xl font-semibold mb-3 text-green-700 dark:text-green-400">
                {t("charactersHeading")}
              </p>
              <div className="flex justify-center flex-nowrap overflow-x-auto gap-4 py-2">
                {characters.map(char => (
                  <DraggableCharacter
                    key={char.id}
                    character={char}
                    onDragStart={handleDragStart}
                    isPlaced={char.placed}
                    characterImage={characterImages[char.id]}
                  />
                ))}
              </div>
            </div>

            {/* First Line Demarcation */}
            <div className="w-full text-center mb-2">
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">First Line</span>
              <div className="border-t-2 border-dashed border-gray-400 dark:border-gray-500 w-full"></div>
            </div>
            {/* Top row facing bottom row */}
            <div className="flex justify-center gap-4 w-full mb-4">
              <Placeholder
                id="P1"
                character={placeholders.P1}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onRemoveCharacter={handleRemoveCharacter}
                characterImages={characterImages}
              />
              <Placeholder
                id="P2"
                character={placeholders.P2}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onRemoveCharacter={handleRemoveCharacter}
                characterImages={characterImages}
              />
              <Placeholder
                id="P3"
                character={placeholders.P3}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onRemoveCharacter={handleRemoveCharacter}
                characterImages={characterImages}
              />
            </div>
            {/* Arrow/Visual Separator indicating facing */}
            <div className="w-full flex justify-center py-4">
              <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 transform rotate-90 sm:rotate-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
              <svg className="w-16 h-16 text-gray-400 dark:text-gray-500 transform -rotate-90 sm:rotate-180" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3"></path>
              </svg>
            </div>
            {/* Second Line Demarcation */}
            <div className="w-full text-center mb-2 mt-4">
              <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Second Line</span>
              <div className="border-t-2 border-dashed border-gray-400 dark:border-gray-500 w-full"></div>
            </div>
            {/* Bottom row facing top row */}
            <div className="flex justify-center gap-4 w-full">
              <Placeholder
                id="P4"
                character={placeholders.P4}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onRemoveCharacter={handleRemoveCharacter}
                characterImages={characterImages}
              />
              <Placeholder
                id="P5"
                character={placeholders.P5}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onRemoveCharacter={handleRemoveCharacter}
                characterImages={characterImages}
              />
              <Placeholder
                id="P6"
                character={placeholders.P6}
                onDrop={handleDrop}
                onDragOver={(e) => e.preventDefault()}
                onRemoveCharacter={handleRemoveCharacter}
                characterImages={characterImages}
              />
            </div>
          </div>

          <div className="flex justify-center gap-4 mb-8 mt-8">
            <button
              onClick={handleSubmit}
              disabled={!allIndividualInstructionsRead || !allPlaceholdersFilled}
              className={`px-6 py-3 font-bold rounded-lg shadow-md transition-all duration-300 transform ${
                allIndividualInstructionsRead && allPlaceholdersFilled
                  ? 'bg-green-500 text-white hover:bg-green-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
                  : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
              }`}
            >
              {t("submitButton")}
            </button>
            <button
              onClick={handleReset}
              className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
            >
              {t("resetButton")}
            </button>
          </div>

          {results && (
            <div className="mt-8 p-6 bg-blue-50 dark:bg-gray-700 rounded-xl shadow-inner border border-blue-200 dark:border-gray-600">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-700 dark:text-blue-400 text-center">
                {t("feedbackHeading")}
              </h2>
              {results.allCorrect ? (
                <p className="text-center text-lg sm:text-xl text-green-600 dark:text-green-300 font-bold mb-4">
                  {t("allCorrect")}
                </p>
              ) : (
                <p className="text-center text-lg sm:text-xl text-red-600 dark:text-red-300 font-bold mb-4">
                  {t("notAllCorrect")}
                </p>
              )}
              <ul className="space-y-3">
                {Object.keys(results.feedback).map(spotId => (
                  <li
                    key={spotId}
                    className={`p-3 rounded-lg flex items-center justify-between shadow-sm ${
                      results.feedback[spotId].correct
                        ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200'
                        : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 font-bold border-l-4 border-red-500 dark:border-red-400' // Highlight incorrect
                    }`}
                  >
                    <span className="font-medium">{spotId}:</span>
                    <span className="flex-1 ml-3">{results.feedback[spotId].message}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </LanguageContext.Provider>
  );
}

export default App;