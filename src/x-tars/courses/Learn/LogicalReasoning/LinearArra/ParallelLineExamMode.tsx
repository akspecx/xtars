import React, { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';

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
    title: "Arrange the Characters - Exam Mode",
    welcomeMessage: "Here we are going to simulate the exam environment. Let's go through the steps and we will solve the problem.",
    instructionsIntro: "Problem Instructions:",
    instructions: [ // All instructions combined into one flat list as requested
      { id: 'inst1', text: "Binny, Sunny, and Vinny are in the first line and facing north." },
      { id: 'inst2', text: "Annie, Minnie, and Ninnie are in the second line and facing south." },
      { id: 'inst3', text: "Sunny is to the left of Binny." },
      { id: 'inst4', text: "Vinny is to the right of Binny." },
      { id: 'inst5', text: "Annie is to the left of Minnie." },
      { id: 'inst6', text: "Ninnie is to the right of Minnie." },
    ],
    facingInstructions: { // This section is now primarily for internal logic, not direct display
      northSouth: {
        line1: "Binny, Sunny, and Vinny are facing north.",
        line2: "Annie, Minnie, and Ninnie are facing south."
      },
      eastWest: {
        line1: "Binny, Sunny, and Vinny are facing east.",
        line2: "Annie, Minnie, and Ninnie are facing west."
      }
    },
    instructionsPrompt: "Please follow the steps below to solve the arrangement problem.",
    charactersHeading: "Available Characters:",
    submitButton: "Submit Arrangement",
    resetButton: "Reset",
    feedbackHeading: "Arrangement Feedback:",
    correctPlacement: (name) => `${name} is correctly placed! 🎉`,
    incorrectPlacement: (name, expected) => `${name} is incorrectly placed. Expected: ${expected}. 🤔`,
    emptySpot: (spot) => `Spot ${spot} is empty. 🚨`,
    allCorrect: "Congratulations! All characters are correctly placed! ✨",
    notAllCorrect: "Keep trying! Some characters are not in their correct positions. ?",
    speechInstructions: "Drag and drop the characters as per the instructions.",
    speechAllCorrect: "Congratulations! All characters are correctly placed!",
    speechNotAllCorrect: "Keep trying! Some characters are not in their correct positions.",
    toggleTheme: "Toggle Theme",
    selectLanguage: "Select Language:",
    languageEn: "English",
    languageEs: "Spanish",
    languageFr: "French",
    readInstructionsCheckboxOverall: "I have read and understood all instructions.",
    step0Voice: "How do we start solving these kinds of questions? We will go step by step and build a framework that will help us make the journey systematic and problem solving efficient.",
    step1Intro: "In an exam, you don't get anything, just the instructions and the subsequent questions. To help you proceed with the implementation, first, you note down all the characters then you bring the characters that we have:",
    step1Voice: "Step one. Note down all the characters involved in the problem.",
    step2Intro: "Next, you can visualize or draw two parallel lines where the characters will sit:",
    step2Voice: "Step two. Create two parallel lines to represent the seating arrangement.",
    step3Intro: "Now, clearly indicate where each line is facing, so you are not confused later:",
    step3Voice: "Step three. Determine the facing directions for each line. Pay attention to the chosen orientation. In the instructions, Direction is given to confuse you. You can imagine people sitting in line 1 or line 2 as facing north and south, and it is not given to test your direction skills. Just to add a bit of confusion.",
    step4Intro: "Then, create the empty spaces within your lines:",
    step4Voice: "Step four. Visualize or draw the empty spots within each line.",
    step5Intro: "Now, start following each instruction one by one and place the characters. Remember, always imagine yourself as the character and then place them!",
    step5Voice: "Step five. Drag and drop the characters into the empty spots according to the instructions. Remember to imagine yourself as the character.",
    step6Intro: "Before proceeding with the questions, revisit the instructions again and validate this with your sitting arrangement. All the arrangements must be satisfied and then only your arrangement is correct and hence you can proceed with solving the questions.",
    step6Voice: "As per the placed characters, tick all the instruction check boxes and proceed with answering the questions in the question section above.",
    step7Intro: "Finally, proceed with the submission and answer the questions.",
    step7Voice: "Step seven. Answer the multiple-choice questions based on your final arrangement.",
    question1: "Who is between Annie and Ninnie?",
    question2: "Who is opposite Sunny?",
    question3: "Who is sitting to the opposite of the person to the immediate left of Binny?",
    options: {
      q1: ["Minnie", "Sunny", "Binny", "Vinny"],
      q2: ["Annie", "Minnie", "Ninnie", "Vinny"],
      q3: ["Ninnie", "Minnie", "Annie", "Vinny"]
    },
    questionFeedback: "Review your answers for the questions.",
    submitAnswers: "Submit Answers",
    restartExam: "Restart Exam Setup"
  },
  es: {
    title: "Organiza los Personajes - Modo Examen",
    welcomeMessage: "Bienvenidos al modo examen. Aquí practicaremos la disposición de asientos paso a paso.",
    instructionsIntro: "Instrucciones del Problema:",
    instructions: [
      { id: 'inst1', text: "Binny, Sunny y Vinny están en la primera línea y mirando al norte." },
      { id: 'inst2', text: "Annie, Minnie y Ninnie están en la segunda línea y mirando al sur." },
      { id: 'inst3', text: "Sunny está a la izquierda de Binny." },
      { id: 'inst4', text: "Vinny está a la derecha de Binny." },
      { id: 'inst5', text: "Annie está a la izquierda de Minnie." },
      { id: 'inst6', text: "Ninnie está a la derecha de Minnie." },
    ],
    facingInstructions: {
      northSouth: {
        line1: "Binny, Sunny y Vinny están mirando al norte.",
        line2: "Annie, Minnie y Ninnie están mirando al sur."
      },
      eastWest: {
        line1: "Binny, Sunny y Vinny están mirando al este.",
        line2: "Annie, Minnie y Ninnie están mirando al oeste."
      }
    },
    instructionsPrompt: "Por favor, sigue los pasos a continuación para resolver el problema de disposición.",
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
    readInstructionsCheckboxOverall: "He leído y entendido todas las instrucciones.",
    step0Voice: "Por favor, lee atentamente las instrucciones del problema y las preguntas. Selecciona la orientación para la disposición de los asientos y luego haz clic en 'Iniciar Configuración del Examen'.",
    step1Intro: "En un examen, no obtienes nada, solo las instrucciones y las preguntas subsiguientes. Para ayudarte a proceder con la implementación, primero, anota todos los personajes y luego trae los personajes que tenemos:",
    step1Voice: "Paso uno. Anota todos los personajes involucrados en el problema.",
    step2Intro: "A continuación, puedes visualizar o dibujar dos líneas paralelas donde se sentarán los personajes:",
    step2Voice: "Paso dos. Crea dos líneas paralelas para representar la disposición de los asientos.",
    step3Intro: "Ahora, indica claramente hacia dónde mira cada línea, para que no te confundas más tarde:",
    step3Voice: "Paso tres. Determina las direcciones de frente para cada línea. Presta atención a la orientación elegida. En las instrucciones, la dirección se da para confundirte. Puedes imaginar a las personas sentadas en la línea 1 o en la línea 2 mirando al norte y al sur, y no se da para probar tus habilidades de dirección. Solo para añadir un poco de confusión.",
    step4Intro: "Luego, crea los espacios vacíos dentro de tus líneas:",
    step4Voice: "Paso cuatro. Visualiza o dibuja los espacios vacíos dentro de cada línea.",
    step5Intro: "Ahora, comienza a seguir cada instrucción una por una y coloca los personajes. ¡Recuerda, siempre imagínate como el personaje y luego colócalos!",
    step5Voice: "Paso cinco. Arrastra y suelta los personajes en los espacios vacíos según las instrucciones. Recuerda imaginarte como el personaje.",
    step6Intro: "Antes de proceder con las preguntas, revisa las instrucciones de nuevo y valida esto con tu disposición de asientos. Todas las disposiciones deben ser satisfechas y solo entonces tu disposición es correcta y puedes proceder a resolver las preguntas.",
    step6Voice: "Paso seis. Antes de proceder con las preguntas, revisa tu disposición cuidadosamente con todas las instrucciones dadas para asegurar la precisión.",
    step7Intro: "Finalmente, procede con el envío y responde las preguntas.",
    step7Voice: "Paso siete. Responde las preguntas de opción múltiple basándote en tu disposición final.",
    question1: "¿Quién está entre Annie y Ninnie?",
    question2: "¿Quién está frente a Sunny?",
    question3: "¿Quién está sentado frente a la persona a la izquierda inmediata de Binny?",
    options: {
      q1: ["Minnie", "Sunny", "Binny", "Vinny"],
      q2: ["Annie", "Minnie", "Ninnie", "Vinny"],
      q3: ["Ninnie", "Minnie", "Annie", "Vinny"]
    },
    questionFeedback: "Revisa tus respuestas para las preguntas.",
    submitAnswers: "Enviar Respuestas",
    restartExam: "Reiniciar Configuración del Examen"
  },
  fr: {
    title: "Organisez les Personnages - Mode Examen",
    welcomeMessage: "Bienvenue en mode examen. Ici, nous allons pratiquer les dispositions des sièges étape par étape.",
    instructionsIntro: "Instructions du Problème :",
    instructions: [
      { id: 'inst1', text: "Binny, Sunny et Vinny sont dans la première ligne et font face au nord." },
      { id: 'inst2', text: "Annie, Minnie et Ninnie sont dans la deuxième ligne et font face au sud." },
      { id: 'inst3', text: "Sunny est à gauche de Binny." },
      { id: 'inst4', text: "Vinny est à droite de Binny." },
      { id: 'inst5', text: "Annie est à gauche de Minnie." },
      { id: 'inst6', text: "Ninnie est à droite de Minnie." },
    ],
    facingInstructions: {
      northSouth: {
        line1: "Binny, Sunny et Vinny font face au nord.",
        line2: "Annie, Minnie et Ninnie font face au sud."
      },
      eastWest: {
        line1: "Binny, Sunny et Vinny font face à l'est.",
        line2: "Annie, Minnie et Ninnie font face à l'ouest."
      }
    },
    instructionsPrompt: "Veuillez suivre les étapes ci-dessous pour résoudre le problème d'arrangement.",
    charactersHeading: "Personnages Disponibles:",
    submitButton: "Soumettre l'Arrangement",
    resetButton: "Réinitialiser",
    feedbackHeading: "Commentaires sur l'Arrangement:",
    correctPlacement: (name) => `${name} est correctement placé ! 🎉`,
    incorrectPlacement: (name, expected) => `${name} est mal placé. Attendu : ${expected}. 🤔`,
    emptySpot: (spot) => `L'emplacement ${spot} est vide. 🚨`,
    allCorrect: "Félicitations ! Tous les personnages sont correctement placés ! ✨",
    notAllCorrect: "Continuez d'essayer ! Certains personnages ne sont pas à leurs bonnes positions. ?",
    speechInstructions: "Faites glisser et déposez les personnages selon les instructions.",
    speechAllCorrect: "Félicitations ! Tous les personnages sont correctement placés !",
    speechNotAllCorrect: "Continuez d'essayer ! Certains personnages ne sont pas à leurs bonnes positions.",
    toggleTheme: "Changer de Thème",
    selectLanguage: "Sélectionner la Langue:",
    languageEn: "Anglais",
    languageEs: "Español",
    languageFr: "Francés",
    readInstructionsCheckboxOverall: "J'ai lu et compris toutes les instructions.",
    step0Voice: "Veuillez lire attentivement les instructions du problème et les questions. Sélectionnez l'orientation pour la disposition des sièges, puis cliquez sur 'Démarrer la configuration de l'examen'.",
    step1Intro: "Dans un examen, vous n'obtenez rien, juste les instructions et les questions ultérieures. Pour vous aider à procéder à la mise en œuvre, vous devez d'abord noter tous les personnages, puis amener les personnages que nous avons :",
    step1Voice: "Étape un. Notez tous les personnages impliqués dans le problème.",
    step2Intro: "Ensuite, vous pouvez visualiser ou dessiner deux lignes parallèles où les personnages s'assiéront :",
    step2Voice: "Étape deux. Créez deux lignes parallèles pour représenter la disposición de los asientos.",
    step3Intro: "Maintenant, indiquez clairement la direction de chaque ligne, afin de ne pas vous laisser embrouiller plus tard :",
    step3Voice: "Étape trois. Déterminez les directions de face pour chaque ligne. Faites attention à l'orientation choisie. Dans les instructions, la direction est donnée pour vous confondre. Vous pouvez imaginer les personnes assises dans la ligne 1 ou la ligne 2 face au nord et au sud, et ce n'est pas donné pour tester vos compétences en direction. Juste pour ajouter un peu de confusion.",
    step4Intro: "Ensuite, créez les espaces vides dans vos lignes :",
    step4Voice: "Étape quatre. Visualisez ou dessinez les espacios vacíos dentro de cada línea.",
    step5Intro: "Maintenant, commencez a suivre cada instrucción una por one et placez les personnages. N'oubliez pas, imaginez-vous toujours comme le personnage, puis placez-les !",
    step5Voice: "Étape cinq. Faites glisser et déposez les personnages dans les espaces vacíos selon les instructions. N'oubliez pas de vous imaginer comme le personaje.",
    step6Intro: "Une fois que vous avez glissé et déposé tout le monde, vous devez revenir à toutes les instructions et vérifier si toutes les instructions sont respectées.",
    step6Voice: "Étape six. Révisez attentivement votre arrangement par rapport à toutes les instructions données pour en assurer l'exactitude.",
    step7Intro: "Enfin, procédez à la soumission et répondez aux questions.",
    step7Voice: "Étape sept. Répondez aux questions à choix multiples en función de votre arrangement final.",
    question1: "Qui est entre Annie et Ninnie?",
    question2: "Qui est en face de Sunny?",
    question3: "Qui est assis en face de la personne à la gauche immédiate de Binny?",
    options: {
      q1: ["Minnie", "Sunny", "Binny", "Vinny"],
      q2: ["Annie", "Minnie", "Ninnie", "Vinny"],
      q3: ["Ninnie", "Minnie", "Annie", "Vinny"]
    },
    questionFeedback: "Passez en revue vos respuestas aux preguntas.",
    submitAnswers: "Soumettre les Réponses",
    restartExam: "Redémarrer la Configuration de l'Examen"
  }
};

const useSpeechSynthesis = () => {
  const [synth, setSynth] = useState(null);

  useEffect(() => {
    if ('speechSynthesis' in window) {
      setSynth(window.speechSynthesis);
    }
  }, []);

  // Memoize the speak function to ensure it's stable across renders
  const speak = useCallback((text, lang = 'en') => {
    if (synth && text) {
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = lang;
      synth.speak(utterance);
    }
  }, [synth]); // Dependency is synth, which is stable after initial setup

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
      className="relative flex flex-col items-center justify-center bg-gray-200 dark:bg-gray-700 border-dashed border-4 border-gray-400 dark:border-gray-500 rounded-xl m-2
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
        <span className="text-gray-500 dark:text-gray-400 text-sm sm:text-base font-medium mb-2"> {/* Standard font size */}
          {`Spot ${id.split('P')[1]}`}
        </span>
      )}
    </div>
  );
};


// Consolidated render function for lines and spots
const renderLinesAndSpots = (currentPlaceholders, isDraggable, showArrows, orientation, handleDrop, handleRemoveCharacter, characterImages) => (
  <div className="flex flex-col items-center w-full">
    {/* Line 1 */}
    <div className="w-full text-center mb-2">
      <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Line 1</span>
    </div>
    <div className="flex items-center justify-center gap-4 w-full mb-4">
      {showArrows && (
        <div className="flex-shrink-0 mr-4 animate-pulse-arrow flex items-center">
          {orientation === 'north-south' ? (
            <>
              <svg className="w-16 h-16 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {/* Down arrow for Line 1 (visually pointing towards Line 2) */}
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19V5m-7 7l7-7 7 7"></path>
              </svg>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">(Facing North)</span>
            </>
          ) : (
            <>
              <svg className="w-16 h-16 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {/* Right arrow for Line 1 (visually pointing towards Line 2) */}
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7l7 7 7-7" transform="rotate(90 12 12)"></path>
              </svg>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">(Facing East)</span>
            </>
          )}
        </div>
      )}
      <div className="flex justify-center gap-4"> {/* Container for spots */}
        {['P1', 'P2', 'P3'].map(id => (
          <Placeholder
            key={id}
            id={id}
            character={currentPlaceholders[id]}
            onDrop={isDraggable ? handleDrop : ()=>{}}
            onDragOver={(e) => e.preventDefault()}
            onRemoveCharacter={isDraggable ? handleRemoveCharacter : ()=>{}}
            characterImages={characterImages}
          />
        ))}
      </div>
    </div>
    
    {/* Line 2 */}
    <div className="w-full text-center mb-2 mt-4">
      <span className="text-lg font-semibold text-gray-700 dark:text-gray-300">Line 2</span>
    </div>
    <div className="flex items-center justify-center gap-4 w-full">
      {showArrows && (
        <div className="flex-shrink-0 mr-4 animate-pulse-arrow flex items-center">
          {orientation === 'north-south' ? (
            <>
              <svg className="w-16 h-16 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {/* Up arrow for Line 2 (visually pointing towards Line 1) */}
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7l7 7 7-7"></path>
              </svg>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">(Facing South)</span>
            </>
          ) : (
            <>
              <svg className="w-16 h-16 text-gray-400 dark:text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                {/* Left arrow for Line 2 (visually pointing towards Line 1) */}
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v14m-7-7l7 7 7-7" transform="rotate(-90 12 12)"></path>
              </svg>
              <span className="ml-2 text-sm text-gray-600 dark:text-gray-300">(Facing West)</span>
            </>
          )}
        </div>
      )}
      <div className="flex justify-center gap-4"> {/* Container for spots */}
        {['P4', 'P5', 'P6'].map(id => (
          <Placeholder
            key={id}
            id={id}
            character={currentPlaceholders[id]}
            onDrop={isDraggable ? handleDrop : ()=>{}}
            onDragOver={(e) => e.preventDefault()}
            onRemoveCharacter={isDraggable ? handleRemoveCharacter : ()=>{}}
            characterImages={characterImages}
          />
        ))}
      </div>
    </div>
  </div>
);

const renderLinesOnly = () => (
  <div className="flex flex-col items-center gap-8 mb-8">
    <div className="w-3/4 h-12 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center border-2 border-dashed border-gray-400 dark:border-gray-500 shadow-inner">
      <span className="text-lg font-bold text-gray-500 dark:text-gray-400">Line 1</span>
    </div>
    <div className="w-3/4 h-12 bg-gray-200 dark:bg-gray-700 rounded-md flex items-center justify-center border-2 border-dashed border-gray-400 dark:border-gray-500 shadow-inner">
      <span className="text-lg font-bold text-gray-500 dark:text-gray-400">Line 2</span>
    </div>
  </div>
);

const renderCharactersList = (initialCharacters) => (
  <div className="w-full text-center mb-4">
      <p className="text-xl font-semibold mb-3 text-green-700 dark:text-green-400">
      Available Characters:
      </p>
      <div className="flex justify-center flex-nowrap overflow-x-auto gap-4 py-2">
        {initialCharacters.map(char => (
          <div key={char.id} className="p-2 bg-purple-100 dark:bg-purple-900 rounded-lg text-purple-800 dark:text-purple-200 font-semibold shadow-md">
            {char.name}
          </div>
        ))}
      </div>
  </div>
);

const renderDraggableCharacters = (characters, handleDragStart, characterImages) => (
  <div className="w-full text-center mb-4">
      <p className="text-xl font-semibold mb-3 text-green-700 dark:text-green-400">
      Available Characters:
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
);


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

  // Correct arrangement based on the fixed relative positions from instructions
  // Line 1: Sunny - Binny - Vinny (regardless of facing, this is their relative order)
  // Line 2: Annie - Minnie - Ninnie. Since Annie is to the left of Minnie (when facing South), 
  // and Ninnie is to the right of Minnie (when facing South),
  // their order on the screen (from left to right for the viewer) will be Ninnie, Minnie, Annie.
  const correctArrangement = {
    P1: 'sunny', P2: 'binny', P3: 'vinny',   // Line 1 (from viewer's left to right)
    P4: 'ninnie', P5: 'minnie', P6: 'annie', // Line 2 (from viewer's left to right)
  };

  // Using placeholder images for compatibility in the Canvas environment
//   const characterImages = {
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

  // Quiz Answers
  const quizAnswers = {
    q1: "minnie", // Who is between Annie and Ninnie? -> Minnie
    q2: "ninnie", // Who is opposite Sunny? -> Ninnie (Sunny is P1, Ninnie is P4)
    q3: "ninnie"  // Who is sitting to the opposite of the person to the immediate left of Binny?
                 // Person to immediate left of Binny (P2) is Sunny (P1).
                 // Person opposite Sunny (P1) is Ninnie (P4). So the answer is Ninnie.
  };

  const [step, setStep] = useState(-1); // -1 for landing page, 0: initial question/instructions, 1: characters, etc.
  const [orientation, setOrientation] = useState('north-south'); // 'north-south' or 'east-west'
  const [characters, setCharacters] = useState(initialCharacters);
  const [placeholders, setPlaceholders] = useState(initialPlaceholders);
  const [arrangementFeedback, setArrangementFeedback] = useState(null); // Feedback for drag-drop
  const [quizAnswersSelected, setQuizAnswersSelected] = useState({ q1: '', q2: '', q3: '' });
  const [quizFeedback, setQuizFeedback] = useState(null); // Feedback for quiz answers
  const [activeQuestionTab, setActiveQuestionTab] = useState('q1'); // State for active question tab on landing page

  const [darkMode, setDarkMode] = useState(false);
  const [language, setLanguage] = useState('en');
  const [individualInstructionsRead, setIndividualInstructionsRead] = useState(() => {
    const initialState = {};
    translations.en.instructions.forEach(inst => {
      initialState[inst.id] = false;
    });
    return initialState;
  });
  const [hasSpokenWelcome, setHasSpokenWelcome] = useState(false);

  // Use a ref to track the previous step to avoid re-playing voice on re-renders within the same step
  const currentStepVoicePlayed = useRef(null);


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

  // Updated t function to handle nested keys (e.g., "options.q1")
  const t = (key, ...args) => {
    const keys = key.split('.');
    let value = translations[language];
    for (const k of keys) {
      if (value && typeof value === 'object' && k in value) {
        value = value[k];
      } else {
        value = undefined; // Path not found
        break;
      }
    }

    if (typeof value === 'function') {
      return value(...args);
    }
    return value !== undefined ? value : key; // Fallback to key if not found
  };

  const handleDragStart = (e, characterId) => {
    e.dataTransfer.setData("characterId", characterId);
  };

  const handleDrop = (e, placeholderId) => {
    e.preventDefault();
    const characterId = e.dataTransfer.getData("characterId");
    const draggedCharacter = characters.find(char => char.id === characterId);

    if (!draggedCharacter) return;

    const oldPlaceholderId = Object.keys(placeholders).find(key => placeholders[key]?.id === characterId);

    if (oldPlaceholderId && oldPlaceholderId !== placeholderId) {
      setPlaceholders(prev => ({
        ...prev,
        [oldPlaceholderId]: null,
        [placeholderId]: draggedCharacter,
      }));
    } else if (!oldPlaceholderId) {
      setPlaceholders(prev => ({
        ...prev,
        [placeholderId]: draggedCharacter,
      }));
      setCharacters(prev =>
        prev.map(char =>
          char.id === characterId ? { ...char, placed: true } : char
        )
      );
    }
    setArrangementFeedback(null); // Clear feedback on new drop or movement
  };


  const handleRemoveCharacter = (placeholderId) => {
    const characterToRemove = placeholders[placeholderId];
    if (characterToRemove) {
      setPlaceholders(prev => ({
        ...prev,
        [placeholderId]: null,
      }));
      setCharacters(prev =>
        prev.map(char =>
          char.id === characterToRemove.id ? { ...char, placed: false } : char
        )
      );
    }
    setArrangementFeedback(null); // Clear feedback on removal
  };

  const handleSubmitArrangement = () => {
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

    setArrangementFeedback({ feedback: newResults, allCorrect });

    if (allCorrect) {
      speak(t("speechAllCorrect"), language);
    } else {
      speak(t("speechNotAllCorrect"), language);
    }
  };

  const handleQuizAnswerChange = (questionId, selectedOption) => {
    setQuizAnswersSelected(prev => ({
      ...prev,
      [questionId]: selectedOption
    }));
  };

  const handleSubmitQuiz = () => {
    const feedback = {};
    let allCorrect = true;

    if (quizAnswersSelected.q1 === quizAnswers.q1) {
      feedback.q1 = { correct: true, message: "Correct! 🎉" };
    } else {
      feedback.q1 = { correct: false, message: `Incorrect. The answer is ${initialCharacters.find(c => c.id === quizAnswers.q1)?.name}. 🤔` };
      allCorrect = false;
    }

    if (quizAnswersSelected.q2 === quizAnswers.q2) {
      feedback.q2 = { correct: true, message: "Correct! 🎉" };
    } else {
      feedback.q2 = { correct: false, message: `Incorrect. The answer is ${initialCharacters.find(c => c.id === quizAnswers.q2)?.name}. 🤔` };
      allCorrect = false;
    }

    if (quizAnswersSelected.q3 === quizAnswers.q3) {
      feedback.q3 = { correct: true, message: "Correct! 🎉" };
    } else {
      feedback.q3 = { correct: false, message: `Incorrect. The answer is ${initialCharacters.find(c => c.id === quizAnswers.q3)?.name}. 🤔` };
      allCorrect = false;
    }

    setQuizFeedback({ feedback, allCorrect });
  };


  const handleResetExam = () => {
    setStep(-1); // Go back to landing page
    setOrientation('north-south'); // Reset orientation to default
    setCharacters(initialCharacters);
    setPlaceholders(initialPlaceholders);
    setArrangementFeedback(null);
    setQuizAnswersSelected({ q1: '', q2: '', q3: '' });
    setQuizFeedback(null);
    const resetInstructions = {};
    translations[language].instructions.forEach(inst => {
      resetInstructions[inst.id] = false;
    });
    setIndividualInstructionsRead(resetInstructions);
  };

  // Effect for initial welcome message (only once on landing page load)
  useEffect(() => {
    if (!hasSpokenWelcome && step === -1) { // Only speak welcome on landing page load
      speak(t("welcomeMessage"), language);
      setHasSpokenWelcome(true);
    }
  }, [hasSpokenWelcome, language, speak, t, step]);

  // Effects for step-specific voice messages
  useEffect(() => {
    // Only play if step actually changed
    if (currentStepVoicePlayed.current !== step) {
      if (window.speechSynthesis && window.speechSynthesis.speaking) {
        window.speechSynthesis.cancel();
      }

      if (step === 0) {
        speak(t("step0Voice"), language);
      } else if (step === 1) {
        speak(t("step1Voice"), language);
      } else if (step === 2) {
        speak(t("step2Voice"), language);
      } else if (step === 3) {
        speak(t("step3Voice"), language);
      } else if (step === 4) {
        speak(t("step4Voice"), language);
      } else if (step === 5) {
        speak(t("step5Voice"), language);
      } else if (step === 6) {
        speak(t("step6Voice"), language); // Step 6 is now old Step 7
      }
      currentStepVoicePlayed.current = step; // Update ref with current step
    }
  }, [step, language, speak, t]);


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

  // Check if all individual instruction checkboxes are ticked
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
          .rounded-xl { border-radius: 0.75rem; }
          .group:hover .group-hover\\:opacity-100 { opacity: 1; }

          @keyframes pulse-arrow {
            0%, 100% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.1);
              opacity: 0.7;
            }
          }

          .animate-pulse-arrow {
            animation: pulse-arrow 1.5s infinite ease-in-out;
          }

          @keyframes fadeInScale {
            0% {
              opacity: 0;
              transform: scale(0.95);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          .animate-fadeInScale {
            animation: fadeInScale 0.5s ease-out forwards;
          }
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

          {/* Persistent Instructions and Questions Section */}
          <div className="p-6 bg-blue-50 dark:bg-gray-700 rounded-xl shadow-inner border border-blue-200 dark:border-gray-600 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Problem Instructions */}
              <div>
                <p className="text-lg font-medium mb-4 text-center text-gray-700 dark:text-gray-300">{t("instructionsIntro")}</p>
                <ul className="list-disc list-inside space-y-2 text-left mb-4 px-4 text-gray-700 dark:text-gray-300">
                  {translations[language].instructions.map(inst => (
                    <li key={inst.id} className="flex items-center">
                      <input
                        type="checkbox"
                        id={`instruction-${inst.id}`}
                        checked={individualInstructionsRead[inst.id]}
                        onChange={(e) => handleIndividualInstructionChange(inst.id, e.target.checked)}
                        className="h-4 w-4 text-purple-600 rounded focus:ring-purple-500 dark:bg-gray-600 dark:border-gray-500 mr-2"
                      />
                      <label htmlFor={`instruction-${inst.id}`} className="text-base">{inst.text}</label>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Vertical Divider */}
              <div className="hidden md:block border-l-2 border-gray-300 dark:border-gray-600"></div>

              {/* Questions Section */}
              <div>
                <p className="text-lg font-medium mb-4 text-center text-gray-700 dark:text-gray-300">
                  **Questions:**
                </p>
                {/* Question Tabs */}
                <div className="flex justify-center flex-wrap gap-2 mb-4">
                  {['q1', 'q2', 'q3'].map((qId, index) => (
                    <button
                      key={qId}
                      onClick={() => setActiveQuestionTab(qId)}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200
                        ${activeQuestionTab === qId
                          ? 'bg-purple-600 text-white shadow-md'
                          : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                        }`}
                    >
                      Question {index + 1}
                    </button>
                  ))}
                </div>
                {/* Question Content based on active tab */}
                <div className="text-left px-4 text-gray-700 dark:text-gray-300">
                  {activeQuestionTab === 'q1' && (
                    <div>
                      <p className="font-semibold text-lg mb-2">{`1. ${t("question1")}`}</p>
                      <div className="flex flex-col space-y-2">
                        {t("options.q1").map(option => (
                          <label key={option} className="inline-flex items-center">
                            <input
                              type="radio"
                              name="landing-q1" // Unique name for landing page radios
                              value={option.toLowerCase()}
                              className="form-radio h-4 w-4 text-blue-600 mr-2"
                            />
                            <span className="text-base">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeQuestionTab === 'q2' && (
                    <div>
                      <p className="font-semibold text-lg mb-2">{`2. ${t("question2")}`}</p>
                      <div className="flex flex-col space-y-2">
                        {t("options.q2").map(option => (
                          <label key={option} className="inline-flex items-center">
                            <input
                              type="radio"
                              name="landing-q2"
                              value={option.toLowerCase()}
                              className="form-radio h-4 w-4 text-blue-600 mr-2"
                            />
                            <span className="text-base">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                  {activeQuestionTab === 'q3' && (
                    <div>
                      <p className="font-semibold text-lg mb-2">{`3. ${t("question3")}`}</p>
                      <div className="flex flex-col space-y-2">
                        {t("options.q3").map(option => (
                          <label key={option} className="inline-flex items-center">
                            <input
                              type="radio"
                              name="landing-q3"
                              value={option.toLowerCase()}
                              className="form-radio h-4 w-4 text-blue-600 mr-2"
                            />
                            <span className="text-base">{option}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
                {/* Submit and Restart buttons for Questions section */}
                <div className="flex justify-center space-x-4 mt-8"> {/* Changed to flex for horizontal alignment */}
                  <button
                    onClick={handleSubmitQuiz} // This button will submit quiz answers
                    disabled={!allIndividualInstructionsRead} // Disabled until all instructions are read
                    className={`px-6 py-3 font-bold rounded-lg shadow-md transition-all duration-300 transform ${
                      allIndividualInstructionsRead
                        ? 'bg-green-500 text-white hover:bg-green-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
                        : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
                    }`}
                  >
                    {t("submitAnswers")}
                  </button>
                  <button
                    onClick={handleResetExam} // This button will restart the entire exam setup
                    className="px-6 py-3 bg-red-500 text-white font-bold rounded-lg shadow-md hover:bg-red-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800"
                  >
                    {t("restartExam")}
                  </button>
                </div>
                {quizFeedback && (
                  <div className="mt-8 p-6 bg-blue-50 dark:bg-gray-700 rounded-xl shadow-inner border border-blue-200 dark:border-gray-600 animate-fadeInScale">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-700 dark:text-blue-400 text-center">
                      {t("questionFeedback")}
                    </h2>
                    <ul className="space-y-3">
                      <li className={`p-3 rounded-lg flex items-center justify-between shadow-sm ${quizFeedback.feedback.q1.correct ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 font-bold border-l-4 border-red-500 dark:border-red-400'}`}>
                        <span className="font-medium">Question 1:</span>
                        <span className="flex-1 ml-3">{quizFeedback.feedback.q1.message}</span>
                      </li>
                      <li className={`p-3 rounded-lg flex items-center justify-between shadow-sm ${quizFeedback.feedback.q2.correct ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 font-bold border-l-4 border-red-500 dark:border-red-400'}`}>
                        <span className="font-medium">Question 2:</span>
                        <span className="flex-1 ml-3">{quizFeedback.feedback.q2.message}</span>
                      </li>
                      <li className={`p-3 rounded-lg flex items-center justify-between shadow-sm ${quizFeedback.feedback.q3.correct ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200' : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 font-bold border-l-4 border-red-500 dark:border-red-400'}`}>
                        <span className="font-medium">Question 3:</span>
                        <span className="flex-1 ml-3">{quizFeedback.feedback.q3.message}</span>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>

            {/* "Start the practice mode" button only on landing page */}
            {step === -1 && (
              <div className="text-center mt-8">
                <button
                  onClick={() => setStep(0)} // Transition to Step 0 of exam mode
                  className="px-6 py-3 bg-indigo-500 text-white font-bold rounded-lg shadow-md hover:bg-indigo-600 transition-all duration-300 transform hover:scale-105"
                >
                  Start the practice mode
                </button>
              </div>
            )}
          </div>

          {/* Exam Mode Setup Content (appears only after starting practice mode) */}
          {step >= 0 && (
            <div className="p-6 bg-blue-50 dark:bg-gray-700 rounded-xl shadow-inner border border-blue-200 dark:border-gray-600 mt-8">
              <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-700 dark:text-blue-400 text-center">
                Exam Mode Setup
              </h2>

              {/* Step Tabs */}
              <div className="flex justify-center flex-wrap gap-2 mb-8">
                {[0, 1, 2, 3, 4, 5, 6].map((stepNum) => (
                  <button
                    key={stepNum}
                    onClick={() => setStep(stepNum)}
                    className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-200
                      ${step === stepNum
                        ? 'bg-purple-600 text-white shadow-md'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300 dark:hover:bg-gray-600'
                      }`}
                  >
                    Step {stepNum}
                  </button>
                ))}
              </div>

              {/* Step 0: Questions (reiterated for context in exam mode) */}
              {step === 0 && (
                <div className="animate-fadeInScale">
                  <p className="text-lg font-medium mb-4 text-center text-gray-700 dark:text-gray-300 mt-6">
                    **Questions:**
                  </p>
                  <ul className="list-decimal list-inside space-y-2 text-left mb-6 px-4 text-gray-700 dark:text-gray-300">
                    <li>{t("question1")}</li>
                    <li>{t("question2")}</li>
                    <li>{t("question3")}</li>
                  </ul>

                  <div className="text-center mt-6">
                    <button
                      onClick={() => setStep(1)}
                      className="px-6 py-3 bg-indigo-500 text-white font-bold rounded-lg shadow-md hover:bg-indigo-600 transition-all duration-300 transform hover:scale-105"
                    >
                      Proceed to **Step 1**
                    </button>
                  </div>
                </div>
              )}

              {/* Step 1: Note Down Characters */}
              {step === 1 && (
                <div className="mt-8 border-t border-gray-300 dark:border-gray-600 pt-8 animate-fadeInScale">
                  <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                    **Step 1:** Note Down Characters
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    {t("step1Intro")}
                  </p>
                  {renderCharactersList(initialCharacters)}
                  <div className="text-center mt-6">
                    <button
                      onClick={() => setStep(2)}
                      className="px-6 py-3 bg-indigo-500 text-white font-bold rounded-lg shadow-md hover:bg-indigo-600 transition-all duration-300 transform hover:scale-105"
                    >
                      Proceed to **Step 2**
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Create Two Lines */}
              {step === 2 && (
                <div className="mt-8 border-t border-gray-300 dark:border-gray-600 pt-8 animate-fadeInScale">
                  <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                    **Step 2:** Create Two Lines
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    {t("step2Intro")}
                  </p>
                  {renderCharactersList(initialCharacters)} {/* Show characters from Step 1 */}
                  {renderLinesOnly()}
                  <div className="text-center mt-6">
                    <button
                      onClick={() => setStep(3)}
                      className="px-6 py-3 bg-indigo-500 text-white font-bold rounded-lg shadow-md hover:bg-indigo-600 transition-all duration-300 transform hover:scale-105"
                    >
                      Proceed to **Step 3**
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Determine Facing Directions */}
              {step === 3 && (
                <div className="mt-8 border-t border-gray-300 dark:border-gray-600 pt-8 animate-fadeInScale">
                  <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                    **Step 3:** Determine Facing Directions
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    {t("step3Intro")}
                  </p>
                  {renderCharactersList(initialCharacters)} {/* Show characters from Step 1 */}
                  {renderLinesAndSpots(initialPlaceholders, false, true, orientation, handleDrop, handleRemoveCharacter, characterImages)} {/* Show lines, arrows, and empty spots */}
                  <div className="text-center mt-6">
                    <button
                      onClick={() => setStep(4)}
                      className="px-6 py-3 bg-indigo-500 text-white font-bold rounded-lg shadow-md hover:bg-indigo-600 transition-all duration-300 transform hover:scale-105"
                    >
                      Proceed to **Step 4**
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Create Empty Spaces */}
              {step === 4 && (
                <div className="mt-8 border-t border-gray-300 dark:border-gray-600 pt-8 animate-fadeInScale">
                  <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                    **Step 4:** Create Empty Spaces
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    {t("step4Intro")}
                  </p>
                  {renderCharactersList(initialCharacters)} {/* Show characters from Step 1 */}
                  {renderLinesAndSpots(initialPlaceholders, false, true, orientation, handleDrop, handleRemoveCharacter, characterImages)} {/* Show lines, arrows, and empty spots */}
                  <div className="text-center mt-6">
                    <button
                      onClick={() => setStep(5)}
                      className="px-6 py-3 bg-indigo-500 text-white font-bold rounded-lg shadow-md hover:bg-indigo-600 transition-all duration-300 transform hover:scale-105"
                    >
                      Proceed to **Step 5**
                    </button>
                  </div>
                </div>
              )}

              {/* Combined Step 5 (old Step 5 & 6) */}
              {step === 5 && (
                <div className="mt-8 border-t border-gray-300 dark:border-gray-600 pt-8 animate-fadeInScale">
                  <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                    **Step 5:** Place Characters & Verify Instructions
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    {t("step5Intro")}
                  </p>
                  {renderCharactersList(initialCharacters)} {/* Show characters from Step 1 */}
                  {renderLinesAndSpots(placeholders, true, true, orientation, handleDrop, handleRemoveCharacter, characterImages)} {/* Show lines, arrows, and draggable spots */}
                  {renderDraggableCharacters(characters, handleDragStart, characterImages)} {/* Draggable characters */}
                  
                  <p className="mt-8 mb-4 text-gray-600 dark:text-gray-400">
                    {t("step6Intro")} {/* Instruction for verification */}
                  </p>

                  <div className="text-center mt-6">
                      <button
                        onClick={handleSubmitArrangement}
                        disabled={!allPlaceholdersFilled}
                        className={`px-6 py-3 font-bold rounded-lg shadow-md transition-all duration-300 transform ${
                          allPlaceholdersFilled
                            ? 'bg-green-500 text-white hover:bg-green-600 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-400 focus:ring-offset-2 dark:focus:ring-offset-gray-800'
                            : 'bg-gray-300 text-gray-500 cursor-not-allowed dark:bg-gray-600 dark:text-gray-400'
                        }`}
                      >
                        {t("submitButton")}
                      </button>
                      <button
                        onClick={() => setStep(6)} // Proceed to new Step 6 (old Step 7)
                        className="px-6 py-3 ml-4 bg-indigo-500 text-white font-bold rounded-lg shadow-md hover:bg-indigo-600 transition-all duration-300 transform hover:scale-105"
                      >
                        Proceed to **Step 6**
                      </button>
                    </div>
                  {arrangementFeedback && (
                    <div className="mt-8 p-6 bg-blue-50 dark:bg-gray-700 rounded-xl shadow-inner border border-blue-200 dark:border-gray-600 animate-fadeInScale">
                      <h2 className="text-xl sm:text-2xl font-semibold mb-4 text-blue-700 dark:text-blue-400 text-center">
                        {t("feedbackHeading")}
                      </h2>
                      <ul className="space-y-3">
                        {Object.keys(arrangementFeedback.feedback).map(spotId => (
                          <li
                            key={spotId}
                            className={`p-3 rounded-lg flex items-center justify-between shadow-sm ${
                              arrangementFeedback.feedback[spotId].correct
                                ? 'bg-green-100 dark:bg-green-800 text-green-800 dark:text-green-200'
                                : 'bg-red-100 dark:bg-red-800 text-red-800 dark:text-red-200 font-bold border-l-4 border-red-500 dark:border-red-400'
                            }`}
                          >
                            <span className="font-medium">{spotId}:</span>
                            <span className="flex-1 ml-3">{arrangementFeedback.feedback[spotId].message}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}

              {/* New Step 6 (old Step 7): Questions */}
              {step === 6 && (
                <div className="mt-8 border-t border-gray-300 dark:border-gray-600 pt-8 animate-fadeInScale">
                  <h3 className="text-xl font-semibold mb-4 text-gray-700 dark:text-gray-300">
                    **Step 6:** Answer the Questions
                  </h3>
                  <p className="mb-4 text-gray-600 dark:text-gray-400">
                    {t("step7Intro")}
                  </p>
                  {renderCharactersList(initialCharacters)} {/* Show characters from Step 1 */}
                  {renderLinesAndSpots(placeholders, false, true, orientation, handleDrop, handleRemoveCharacter, characterImages)} {/* Persistent lines and arrows, final arrangement */}

                  {/* Questions and Submit/Restart buttons are now in the persistent top section */}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </LanguageContext.Provider>
  );
}

export default App;