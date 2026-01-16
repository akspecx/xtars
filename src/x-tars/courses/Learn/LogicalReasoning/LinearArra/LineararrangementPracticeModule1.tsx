import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Play, Pause, ChevronDown, Check, X, ArrowRight } from 'lucide-react';

const SeatingArrangementAdditionalPractice = () => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [textBeingSpoken, setTextBeingSpoken] = useState<string | null>(null); // New state to track what's being spoken
  const [currentLanguage, setCurrentLanguage] = useState('en-US');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [useAssetImages, setUseAssetImages] = useState(false);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const utteranceRef = useRef<SpeechSynthesisUtterance | null>(null); // Ref to hold the SpeechSynthesisUtterance object
  const [voicesLoaded, setVoicesLoaded] = useState(false);

  // Define the fixed seating order from left to right (User's perspective)
  const seatingOrder = ['Bunny', 'Ninnie', 'Vinnie', 'Annie', 'Sunny'];

  // --- Character Image Components ---
  // Asset Image Components (placeholders for actual images)
  const AnnieAssetImage = () => (
    <div className="w-20 h-28 md:w-32 md:h-40 rounded-xl overflow-hidden shadow-lg relative border-2 border-pink-200 dark:border-pink-700">
      <img
        src="https://placehold.co/128x160/FBCFE8/881337?text=Annie"
        alt="Annie"
        className="w-full h-full object-cover"
        // Fallback to text if image fails to load
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.style.display = 'none';
          if (img.nextSibling && img.nextSibling instanceof HTMLElement) {
            (img.nextSibling as HTMLElement).style.display = 'block';
          }
        }}
      />
      <div className="w-full h-full bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-800 dark:to-pink-900 absolute top-0 left-0 flex items-center justify-center text-pink-600 dark:text-pink-300 font-bold text-xs md:text-sm" style={{ display: 'none' }}>
        Annie
      </div>
    </div>
  );

  const VinnieAssetImage = () => (
    <div className="w-20 h-28 md:w-32 md:h-40 rounded-xl overflow-hidden shadow-lg relative border-2 border-blue-200 dark:border-blue-700">
      <img
        src="https://placehold.co/128x160/DBEAFE/1E40AF?text=Vinnie"
        alt="Vinnie"
        className="w-full h-full object-cover"
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.style.display = 'none';
          if (img.nextSibling && img.nextSibling instanceof HTMLElement) {
            (img.nextSibling as HTMLElement).style.display = 'block';
          }
        }}
      />
      <div className="w-full h-full bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 absolute top-0 left-0 flex items-center justify-center text-blue-600 dark:text-blue-300 font-bold text-xs md:text-sm" style={{ display: 'none' }}>
        Vinnie
      </div>
    </div>
  );

  const NinnieAssetImage = () => (
    <div className="w-20 h-28 md:w-32 md:h-40 rounded-xl overflow-hidden shadow-lg relative border-2 border-green-200 dark:border-green-700">
      <img
        src="https://placehold.co/128x160/D1FAE5/065F46?text=Ninnie"
        alt="Ninnie"
        className="w-full h-full object-cover"
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.style.display = 'none';
          if (img.nextSibling && img.nextSibling instanceof HTMLElement) {
            (img.nextSibling as HTMLElement).style.display = 'block';
          }
        }}
      />
      <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 absolute top-0 left-0 flex items-center justify-center text-green-600 dark:text-green-300 font-bold text-xs md:text-sm" style={{ display: 'none' }}>
        Ninnie
      </div>
    </div>
  );

  const BunnyAssetImage = () => (
    <div className="w-20 h-28 md:w-32 md:h-40 rounded-xl overflow-hidden shadow-lg relative border-2 border-orange-200 dark:border-orange-700">
      <img
        src="https://placehold.co/128x160/FFEDD5/C2410C?text=Bunny"
        alt="Bunny"
        className="w-full h-full object-cover"
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.style.display = 'none';
          if (img.nextSibling && img.nextSibling instanceof HTMLElement) {
            (img.nextSibling as HTMLElement).style.display = 'block';
          }
        }}
      />
      <div className="w-full h-full bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-800 dark:to-orange-900 absolute top-0 left-0 flex items-center justify-center text-orange-600 dark:text-orange-300 font-bold text-xs md:text-sm" style={{ display: 'none' }}>
        Bunny
      </div>
    </div>
  );

  const SunnyAssetImage = () => (
    <div className="w-20 h-28 md:w-32 md:h-40 rounded-xl overflow-hidden shadow-lg relative border-2 border-yellow-200 dark:border-yellow-700">
      <img
        src="https://placehold.co/128x160/FEF9C3/A16207?text=Sunny"
        alt="Sunny"
        className="w-full h-full object-cover"
        onError={(e) => {
          const img = e.target as HTMLImageElement;
          img.style.display = 'none';
          if (img.nextSibling && img.nextSibling instanceof HTMLElement) {
            (img.nextSibling as HTMLElement).style.display = 'block';
          }
        }}
      />
      <div className="w-full h-full bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900 absolute top-0 left-0 flex items-center justify-center text-yellow-600 dark:text-yellow-300 font-bold text-xs md:text-sm" style={{ display: 'none' }}>
        Sunny
      </div>
    </div>
  );

  // Character DIV Image Components (stylized representations)
  const AnnieImage = () => (
    <div className="w-20 h-28 md:w-32 md:h-40 bg-gradient-to-br from-pink-100 to-pink-200 dark:from-pink-800 dark:to-pink-900 rounded-xl overflow-hidden shadow-lg relative border-2 border-pink-200 dark:border-pink-700">
      {/* Hair */}
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-12 h-6 md:w-20 md:h-8 bg-gradient-to-br from-amber-400 to-amber-500 dark:from-amber-600 dark:to-amber-700 rounded-t-full"></div>
      
      {/* Face */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-pink-200 to-pink-300 dark:from-pink-700 dark:to-pink-800 rounded-full border border-pink-300 dark:border-pink-600">
        {/* Eyes */}
        <div className="absolute top-2 left-1.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        <div className="absolute top-2 right-1.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        
        {/* Nose */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 md:w-1 md:h-1 bg-pink-400 dark:bg-pink-500 rounded-full"></div>
        
        {/* Mouth */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-0.5 md:w-3 md:h-1 bg-red-400 dark:bg-red-500 rounded-full"></div>
      </div>
      
      {/* Body */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-7 h-12 md:w-10 md:h-16 bg-gradient-to-br from-purple-300 to-purple-400 dark:from-purple-600 dark:to-purple-700 rounded-lg"></div>
      
      {/* Arms */}
      <div className="absolute bottom-12 left-1 w-1.5 h-6 md:w-2 md:h-8 bg-pink-300 dark:bg-pink-600 rounded-full"></div>
      <div className="absolute bottom-12 right-1 w-1.5 h-6 md:w-2 md:h-8 bg-pink-300 dark:bg-pink-600 rounded-full"></div>
      
      {/* Legs */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 -translate-x-1.5 w-1.5 h-4 md:w-2 md:h-5 bg-blue-400 dark:bg-blue-600 rounded-full"></div>
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 translate-x-1.5 w-1.5 h-4 md:w-2 md:h-5 bg-blue-400 dark:bg-blue-600 rounded-full"></div>
    </div>
  );

  const VinnieImage = () => (
    <div className="w-20 h-28 md:w-32 md:h-40 bg-gradient-to-br from-blue-100 to-blue-200 dark:from-blue-800 dark:to-blue-900 rounded-xl overflow-hidden shadow-lg relative border-2 border-blue-200 dark:border-blue-700">
      {/* Hair */}
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-12 h-6 md:w-20 md:h-8 bg-gradient-to-br from-amber-700 to-amber-800 dark:from-amber-500 dark:to-amber-600 rounded-t-full"></div>
      
      {/* Face */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-blue-200 to-blue-300 dark:from-blue-700 dark:to-blue-800 rounded-full border border-blue-300 dark:border-blue-600">
        {/* Eyes */}
        <div className="absolute top-2 left-1.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        <div className="absolute top-2 right-1.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        
        {/* Nose */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 md:w-1 md:h-1 bg-blue-400 dark:bg-blue-500 rounded-full"></div>
        
        {/* Mouth */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-0.5 md:w-3 md:h-1 bg-red-400 dark:bg-red-500 rounded-full"></div>
      </div>
      
      {/* Body */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-7 h-12 md:w-10 md:h-16 bg-gradient-to-br from-green-300 to-green-400 dark:from-green-600 dark:to-green-700 rounded-lg"></div>
      
      {/* Arms */}
      <div className="absolute bottom-12 left-1 w-1.5 h-6 md:w-2 md:h-8 bg-blue-300 dark:bg-blue-600 rounded-full"></div>
      <div className="absolute bottom-12 right-1 w-1.5 h-6 md:w-2 md:h-8 bg-blue-300 dark:bg-blue-600 rounded-full"></div>
      
      {/* Legs */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 -translate-x-1.5 w-1.5 h-4 md:w-2 md:h-5 bg-gray-600 dark:bg-gray-400 rounded-full"></div>
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 translate-x-1.5 w-1.5 h-4 md:w-2 md:h-5 bg-gray-600 dark:bg-gray-400 rounded-full"></div>
    </div>
  );

  const NinnieImage = () => (
    <div className="w-20 h-28 md:w-32 md:h-40 bg-gradient-to-br from-green-100 to-green-200 dark:from-green-800 dark:to-green-900 rounded-xl overflow-hidden shadow-lg relative border-2 border-green-200 dark:border-green-700">
      {/* Hair */}
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-12 h-6 md:w-20 md:h-8 bg-gradient-to-br from-red-600 to-red-700 dark:from-red-500 dark:to-red-600 rounded-t-full"></div>
      
      {/* Face */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-green-200 to-green-300 dark:from-green-700 dark:to-green-800 rounded-full border border-green-300 dark:border-green-600">
        {/* Eyes */}
        <div className="absolute top-2 left-1.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        <div className="absolute top-2 right-1.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        
        {/* Nose */}
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 md:w-1 md:h-1 bg-green-400 dark:bg-green-500 rounded-full"></div>
        
        {/* Mouth */}
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-0.5 md:w-3 md:h-1 bg-red-400 dark:bg-red-500 rounded-full"></div>
      </div>
      
      {/* Body */}
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-7 h-12 md:w-10 md:h-16 bg-gradient-to-br from-orange-300 to-orange-400 dark:from-orange-600 dark:to-orange-700 rounded-lg"></div>
      
      {/* Arms */}
      <div className="absolute bottom-12 left-1 w-1.5 h-6 md:w-2 md:h-8 bg-green-300 dark:bg-green-600 rounded-full"></div>
      <div className="absolute bottom-12 right-1 w-1.5 h-6 md:w-2 md:h-8 bg-green-300 dark:bg-green-600 rounded-full"></div>
      
      {/* Legs */}
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 -translate-x-1.5 w-1.5 h-4 md:w-2 md:h-5 bg-yellow-500 dark:bg-yellow-600 rounded-full"></div>
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 translate-x-1.5 w-1.5 h-4 md:w-2 md:h-5 bg-yellow-500 dark:bg-yellow-600 rounded-full"></div>
    </div>
  );

  const BunnyImage = () => (
    <div className="w-20 h-28 md:w-32 md:h-40 bg-gradient-to-br from-orange-100 to-orange-200 dark:from-orange-800 dark:to-orange-900 rounded-xl overflow-hidden shadow-lg relative border-2 border-orange-200 dark:border-orange-700">
      <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-16 h-8 md:w-24 md:h-12 bg-gradient-to-br from-gray-700 to-gray-800 dark:from-gray-500 dark:to-gray-600 rounded-t-full"></div>
      <div className="absolute top-0 left-1/4 transform -translate-x-1/2 w-4 h-8 md:w-6 md:h-10 bg-gray-700 dark:bg-gray-500 rounded-full rotate-45"></div>
      <div className="absolute top-0 right-1/4 transform translate-x-1/2 w-4 h-8 md:w-6 md:h-10 bg-gray-700 dark:bg-gray-500 rounded-full -rotate-45"></div>
      <div className="absolute top-6 left-1/2 transform -translate-x-1/2 w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-orange-200 to-orange-300 dark:from-orange-700 dark:to-orange-800 rounded-full border border-orange-300 dark:border-orange-600">
        <div className="absolute top-2 left-1.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        <div className="absolute top-2 right-1.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 md:w-1 md:h-1 bg-orange-400 dark:bg-orange-500 rounded-full"></div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-0.5 md:w-3 md:h-1 bg-red-400 dark:bg-red-500 rounded-full"></div>
      </div>
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-7 h-12 md:w-10 md:h-16 bg-gradient-to-br from-yellow-300 to-yellow-400 dark:from-yellow-600 dark:to-yellow-700 rounded-lg"></div>
      <div className="absolute bottom-12 left-1 w-1.5 h-6 md:w-2 md:h-8 bg-orange-300 dark:bg-orange-600 rounded-full"></div>
      <div className="absolute bottom-12 right-1 w-1.5 h-6 md:w-2 md:h-8 bg-orange-300 dark:bg-orange-600 rounded-full"></div>
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 -translate-x-1.5 w-1.5 h-4 md:w-2 md:h-5 bg-amber-600 dark:bg-amber-500 rounded-full"></div>
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 translate-x-1.5 w-1.5 h-4 md:w-2 md:h-5 bg-amber-600 dark:bg-amber-500 rounded-full"></div>
    </div>
  );

  const SunnyImage = () => (
    <div className="w-20 h-28 md:w-32 md:h-40 bg-gradient-to-br from-yellow-100 to-yellow-200 dark:from-yellow-800 dark:to-yellow-900 rounded-xl overflow-hidden shadow-lg relative border-2 border-yellow-200 dark:border-yellow-700">
      <div className="absolute top-1 left-1/2 transform -translate-x-1/2 w-12 h-6 md:w-20 md:h-8 bg-gradient-to-br from-amber-200 to-amber-300 dark:from-amber-600 dark:to-amber-700 rounded-t-full"></div>
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 w-8 h-8 md:w-12 md:h-12 bg-gradient-to-br from-yellow-200 to-yellow-300 dark:from-yellow-700 dark:to-yellow-800 rounded-full border border-yellow-300 dark:border-yellow-600">
        <div className="absolute top-2 left-1.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        <div className="absolute top-2 right-1.5 w-1.5 h-1.5 md:w-2 md:h-2 bg-gray-800 dark:bg-gray-200 rounded-full"></div>
        <div className="absolute top-3 left-1/2 transform -translate-x-1/2 w-0.5 h-0.5 md:w-1 md:h-1 bg-yellow-400 dark:bg-yellow-500 rounded-full"></div>
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-2 h-0.5 md:w-3 md:h-1 bg-red-400 dark:bg-red-500 rounded-full"></div>
      </div>
      <div className="absolute bottom-6 left-1/2 transform -translate-x-1/2 w-7 h-12 md:w-10 md:h-16 bg-gradient-to-br from-pink-300 to-pink-400 dark:from-pink-600 dark:to-pink-700 rounded-lg"></div>
      <div className="absolute bottom-12 left-1 w-1.5 h-6 md:w-2 md:h-8 bg-yellow-300 dark:bg-yellow-600 rounded-full"></div>
      <div className="absolute bottom-12 right-1 w-1.5 h-6 md:w-2 md:h-8 bg-yellow-300 dark:bg-yellow-600 rounded-full"></div>
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 -translate-x-1.5 w-1.5 h-4 md:w-2 md:h-5 bg-purple-400 dark:bg-purple-600 rounded-full"></div>
      <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 translate-x-1.5 w-1.5 h-4 md:w-2 md:h-5 bg-purple-400 dark:bg-purple-600 rounded-full"></div>
    </div>
  );

  // Reusable Character Component to display name and image
  type CharacterComponentProps = {
    name: string;
    ImageComponent: React.ComponentType;
    colorTheme: string;
  };

  const CharacterComponent: React.FC<CharacterComponentProps> = ({ name, ImageComponent, colorTheme }) => (
    <div className="flex flex-col items-center">
      <ImageComponent />
      <h3 className={`text-sm md:text-lg font-bold mt-1 md:mt-2 ${colorTheme} dark:${colorTheme.replace('text-', 'text-').replace('-600', '-400')}`}>{name}</h3>
    </div>
  );
  // --- End Character Image Components ---

  // Define the allowed question IDs as a union type
  type QuestionId = 'q1' | 'q2' | 'q3' | 'q4' | 'q5' | 'q6';
  
  type Question = {
    id: QuestionId;
    correctAnswerKey: string;
    optionsKey: 'characterNames' | 'numberOptions';
  };
  
  // Global array of question definitions (language-agnostic parts)
  const allQuestions: Question[] = [
    {
      id: 'q1', // Who is sitting to the left of Vinnie? (Vinnie's left is Annie - from Vinnie's perspective facing user)
      correctAnswerKey: 'Annie',
      optionsKey: 'characterNames'
    },
    {
      id: 'q2', // Who is sitting to the right of Vinnie? (Vinnie's right is Ninnie - from Vinnie's perspective facing user)
      correctAnswerKey: 'Ninnie',
      optionsKey: 'characterNames'
    },
    {
      id: 'q3', // Who is sitting between Ninnie and Annie? (Vinnie)
      correctAnswerKey: 'Vinnie',
      optionsKey: 'characterNames'
    },
    {
      id: 'q4', // How many people are sitting between Annie and Bunny? (2: Vinnie, Ninnie)
      correctAnswerKey: '2',
      optionsKey: 'numberOptions'
    },
    {
      id: 'q5', // Who is 2nd to the left of Ninnie? (Ninnie's 1st left is Vinnie, 2nd left is Annie - from Ninnie's perspective facing user)
      correctAnswerKey: 'Annie',
      optionsKey: 'characterNames'
    },
    {
      id: 'q6', // Who is 2nd to the right of Sunny? (Sunny's 1st right is Annie, 2nd right is Vinnie - from Sunny's perspective facing user)
      correctAnswerKey: 'Vinnie',
      optionsKey: 'characterNames'
    },
  ];

  // Define language-specific messages, questions, and answers
  const languages = [
    {
      code: 'en-US',
      name: 'English (US)',
      scenarioMessage: 'Bunny, Ninnie, Vinnie, Annie, and Sunny are sitting in a row from left to right. They are facing you.',
      questionTexts: {
        q1: 'Who is sitting to the left of Vinnie?',
        q2: 'Who is sitting to the right of Vinnie?',
        q3: 'Who is sitting between Ninnie and Annie?',
        q4: 'How many people are sitting between Annie and Bunny?',
        q5: 'Who is 2nd to the left of Ninnie?',
        q6: 'Who is 2nd to the right of Sunny?',
      },
      options: {
        characterNames: [
          { display: 'Annie', value: 'Annie' },
          { display: 'Vinnie', value: 'Vinnie' },
          { display: 'Ninnie', value: 'Ninnie' },
          { display: 'Bunny', value: 'Bunny' },
          { display: 'Sunny', value: 'Sunny' },
        ],
        numberOptions: [
          { display: '0', value: '0' },
          { display: '1', value: '1' },
          { display: '2', value: '2' },
          { display: '3', value: '3' },
        ],
      },
      explanations: {
        q1_correct: 'Correct! Annie is sitting directly to the left of Vinnie (from Vinnie\'s perspective, facing you).',
        q1_incorrect: 'Incorrect. Annie is sitting directly to the left of Vinnie (from Vinnie\'s perspective, facing you). Remember the order is Bunny, Ninnie, Vinnie, Annie, Sunny from your left to right.',
        q2_correct: 'Correct! Ninnie is sitting directly to the right of Vinnie (from Vinnie\'s perspective, facing you).',
        q2_incorrect: 'Incorrect. Ninnie is sitting directly to the right of Vinnie (from Vinnie\'s perspective, facing you). Remember the order is Bunny, Ninnie, Vinnie, Annie, Sunny from your left to right.',
        q3_correct: 'Correct! Vinnie is sitting between Ninnie and Annie.',
        q3_incorrect: 'Incorrect. Vinnie is sitting between Ninnie and Annie. Remember the order is Bunny, Ninnie, Vinnie, Annie, Sunny from your left to right.',
        q4_correct: 'Correct! There are 2 people (Vinnie and Ninnie) sitting between Annie and Bunny.',
        q4_incorrect: 'Incorrect. There are 2 people (Vinnie and Ninnie) sitting between Annie and Bunny. Remember the order is Bunny, Ninnie, Vinnie, Annie, Sunny from your left to right.',
        q5_correct: 'Correct! Annie is 2nd to the left of Ninnie (Ninnie -> Vinnie -> Annie, from Ninnie\'s perspective facing you).',
        q5_incorrect: 'Incorrect. Annie is 2nd to the left of Ninnie. Remember the order is Bunny, Ninnie, Vinnie, Annie, Sunny from your left to right.',
        q6_correct: 'Correct! Vinnie is 2nd to the right of Sunny (Sunny -> Annie -> Vinnie, from Sunny\'s perspective facing you).',
        q6_incorrect: 'Incorrect. Vinnie is 2nd to the right of Sunny. Remember the order is Bunny, Ninnie, Vinnie, Annie, Sunny from your left to right.',
      }
    },
    {
      code: 'en-GB',
      name: 'English (UK)',
      scenarioMessage: 'Bunny, Ninnie, Vinnie, Annie, and Sunny are sitting in a row from left to right. They are facing you.',
      questionTexts: {
        q1: 'Who is sitting to the left of Vinnie?',
        q2: 'Who is sitting to the right of Vinnie?',
        q3: 'Who is sitting between Ninnie and Annie?',
        q4: 'How many people are sitting between Annie and Bunny?',
        q5: 'Who is 2nd to the left of Ninnie?',
        q6: 'Who is 2nd to the right of Sunny?',
      },
      options: {
        characterNames: [
          { display: 'Annie', value: 'Annie' },
          { display: 'Vinnie', value: 'Vinnie' },
          { display: 'Ninnie', value: 'Ninnie' },
          { display: 'Bunny', value: 'Bunny' },
          { display: 'Sunny', value: 'Sunny' },
        ],
        numberOptions: [
          { display: '0', value: '0' },
          { display: '1', value: '1' },
          { display: '2', value: '2' },
          { display: '3', value: '3' },
        ],
      },
      explanations: {
        q1_correct: 'Correct! Annie is sitting directly to the left of Vinnie (from Vinnie\'s perspective, facing you).',
        q1_incorrect: 'Incorrect. Annie is sitting directly to the left of Vinnie (from Vinnie\'s perspective, facing you). Remember the order is Bunny, Ninnie, Vinnie, Annie, Sunny from your left to right.',
        q2_correct: 'Correct! Ninnie is sitting directly to the right of Vinnie (from Vinnie\'s perspective, facing you).',
        q2_incorrect: 'Incorrect. Ninnie is sitting directly to the right of Vinnie (from Vinnie\'s perspective, facing you). Remember the order is Bunny, Ninnie, Vinnie, Annie, Sunny from your left to right.',
        q3_correct: 'Correct! Vinnie is sitting between Ninnie and Annie.',
        q3_incorrect: 'Incorrect. Vinnie is sitting between Ninnie and Annie. Remember the order is Bunny, Ninnie, Vinnie, Annie, Sunny from your left to right.',
        q4_correct: 'Correct! There are 2 people (Vinnie and Ninnie) sitting between Annie and Bunny.',
        q4_incorrect: 'Incorrect. There are 2 people (Vinnie and Ninnie) sitting between Annie and Bunny. Remember the order is Bunny, Ninnie, Vinnie, Annie, Sunny from your left to right.',
        q5_correct: 'Correct! Annie is 2nd to the left of Ninnie (Ninnie -> Vinnie -> Annie, from Ninnie\'s perspective facing you).',
        q5_incorrect: 'Incorrect. Annie is 2nd to the left of Ninnie. Remember the order is Bunny, Ninnie, Vinnie, Annie, Sunny from your left to right.',
        q6_correct: 'Correct! Vinnie is 2nd to the right of Sunny (Sunny -> Annie -> Vinnie, from Sunny\'s perspective facing you).',
        q6_incorrect: 'Incorrect. Vinnie is 2nd to the right of Sunny. Remember the order is Bunny, Ninnie, Vinnie, Annie, Sunny from your left to right.',
      }
    },
    {
      code: 'de-DE',
      name: 'German',
      scenarioMessage: 'Bunny, Ninnie, Vinnie, Annie und Sunny sitzen in einer Reihe von links nach rechts. Sie blicken Sie an.',
      questionTexts: {
        q1: 'Wer sitzt links von Vinnie?',
        q2: 'Wer sitzt rechts von Vinnie?',
        q3: 'Wer sitzt zwischen Ninnie und Annie?',
        q4: 'Wie viele Personen sitzen zwischen Annie und Bunny?',
        q5: 'Wer ist die 2. Person links von Ninnie?',
        q6: 'Wer ist die 2. Person rechts von Sunny?',
      },
      options: {
        characterNames: [
          { display: 'Annie', value: 'Annie' },
          { display: 'Vinnie', value: 'Vinnie' },
          { display: 'Ninnie', value: 'Ninnie' },
          { display: 'Bunny', value: 'Bunny' },
          { display: 'Sunny', value: 'Sunny' },
        ],
        numberOptions: [
          { display: '0', value: '0' },
          { display: '1', value: '1' },
          { display: '2', value: '2' },
          { display: '3', value: '3' },
        ],
      },
      explanations: {
        q1_correct: 'Richtig! Annie sitzt direkt links von Vinnie (aus Vinnies Sicht, Ihnen zugewandt).',
        q1_incorrect: 'Falsch. Annie sitzt direkt links von Vinnie (aus Vinnies Sicht, Ihnen zugewandt). Die Reihenfolge ist Bunny, Ninnie, Vinnie, Annie, Sunny von Ihrer linken nach rechten Seite.',
        q2_correct: 'Richtig! Ninnie sitzt direkt rechts von Vinnie (aus Vinnies Sicht, Ihnen zugewandt).',
        q2_incorrect: 'Falsch. Ninnie sitzt direkt rechts von Vinnie (aus Vinnies Sicht, Ihnen zugewandt). Die Reihenfolge ist Bunny, Ninnie, Vinnie, Annie, Sunny von Ihrer linken nach rechten Seite.',
        q3_correct: 'Richtig! Vinnie sitzt zwischen Ninnie und Annie.',
        q3_incorrect: 'Falsch. Vinnie sitzt zwischen Ninnie und Annie. Die Reihenfolge ist Bunny, Ninnie, Vinnie, Annie, Sunny von Ihrer linken nach rechten Seite.',
        q4_correct: 'Richtig! Es sitzen 2 Personen (Vinnie und Ninnie) zwischen Annie und Bunny.',
        q4_incorrect: 'Falsch. Es sitzen 2 Personen (Vinnie und Ninnie) zwischen Annie und Bunny. Die Reihenfolge ist Bunny, Ninnie, Vinnie, Annie, Sunny von Ihrer linken nach rechten Seite.',
        q5_correct: 'Richtig! Annie ist die 2. Person links von Ninnie (Ninnie -> Vinnie -> Annie, aus Ninnies Sicht, Ihnen zugewandt).',
        q5_incorrect: 'Falsch. Annie ist die 2. Person links von Ninnie. Die Reihenfolge ist Bunny, Ninnie, Vinnie, Annie, Sunny von Ihrer linken nach rechten Seite.',
        q6_correct: 'Richtig! Vinnie ist die 2. Person rechts von Sunny (Sunny -> Annie -> Vinnie, aus Sunnys Sicht, Ihnen zugewandt).',
        q6_incorrect: 'Falsch. Vinnie ist die 2. Person rechts von Sunny. Die Reihenfolge ist Bunny, Ninnie, Vinnie, Annie, Sunny von Ihrer linken nach rechten Seite.',
      }
    },
    {
      code: 'hi-IN',
      name: 'Hindi',
      scenarioMessage: 'बनी, निन्नी, विन्नी, एनी और सन्नी एक कतार में बाएं से दाएं बैठे हैं। वे आपकी ओर देख रहे हैं।',
      questionTexts: {
        q1: 'विन्नी के बाईं ओर कौन बैठा है?',
        q2: 'विन्नी के दाईं ओर कौन बैठा है?',
        q3: 'निन्नी और एनी के बीच में कौन बैठा है?',
        q4: 'एनी और बनी के बीच कितने लोग बैठे हैं?',
        q5: 'निन्नी के बाईं ओर दूसरा कौन है?',
        q6: 'सन्नी के दाईं ओर दूसरा कौन है?',
      },
      options: {
        characterNames: [
          { display: 'एनी', value: 'Annie' },
          { display: 'विन्नी', value: 'Vinnie' },
          { display: 'निन्नी', value: 'Ninnie' },
          { display: 'बनी', value: 'Bunny' },
          { display: 'सन्नी', value: 'Sunny' },
        ],
        numberOptions: [
          { display: '0', value: '0' },
          { display: '1', value: '1' },
          { display: '2', value: '2' },
          { display: '3', value: '3' },
        ],
      },
      explanations: {
        q1_correct: 'सही! एनी विन्नी के ठीक बाईं ओर बैठी है (विन्नी के दृष्टिकोण से, आपकी ओर देखते हुए)।',
        q1_incorrect: 'गलत। एनी विन्नी के ठीक बाईं ओर बैठी है (विन्नी के दृष्टिकोण से, आपकी ओर देखते हुए)। पंक्ति का क्रम आपकी बाईं ओर से दाईं ओर बनी, निन्नी, विन्नी, एनी, सन्नी है।',
        q2_correct: 'सही! निन्नी विन्नी के ठीक दाईं ओर बैठी है (विन्नी के दृष्टिकोण से, आपकी ओर देखते हुए)।',
        q2_incorrect: 'गलत। निन्नी विन्नी के ठीक दाईं ओर बैठी है (विन्नी के दृष्टिकोण से, आपकी ओर देखते हुए)। पंक्ति का क्रम आपकी बाईं ओर से दाईं ओर बनी, निन्नी, विन्नी, एनी, सन्नी है।',
        q3_correct: 'सही! विन्नी निन्नी और एनी के बीच में बैठा है।',
        q3_incorrect: 'गलत। विन्नी निन्नी और एनी के बीच में बैठा है। पंक्ति का क्रम आपकी बाईं ओर से दाईं ओर बनी, निन्नी, विन्नी, एनी, सन्नी है।',
        q4_correct: 'सही! एनी और बनी के बीच 2 लोग (विन्नी और निन्नी) बैठे हैं।',
        q4_incorrect: 'गलत। एनी और बनी के बीच 2 लोग (विन्नी और निन्नी) बैठे हैं। पंक्ति का क्रम आपकी बाईं ओर से दाईं ओर बनी, निन्नी, विन्नी, एनी, सन्नी है।',
        q5_correct: 'सही! निन्नी के बाईं ओर दूसरा एनी है (निन्नी -> विन्नी -> एनी, निन्नी के दृष्टिकोण से, आपकी ओर देखते हुए)।',
        q5_incorrect: 'गलत। निन्नी के बाईं ओर दूसरा एनी है। पंक्ति का क्रम आपकी बाईं ओर से दाईं ओर बनी, निन्नी, विन्नी, एनी, सन्नी है।',
        q6_correct: 'सही! सन्नी के दाईं ओर दूसरा विन्नी है (सन्नी -> एनी -> विन्नी, सन्नी के दृष्टिकोण से, आपकी ओर देखते हुए)।',
        q6_incorrect: 'गलत। सन्नी के दाईं ओर दूसरा विन्नी है। पंक्ति का क्रम आपकी बाईं ओर से दाईं ओर बनी, निन्नी, विन्नी, एनी, सन्नी है।',
      }
    },
  ];

  // Helper functions using useCallback for memoization
  const getCurrentLangData = useCallback(() => {
    return languages.find(l => l.code === currentLanguage) || languages[0];
  }, [currentLanguage, languages]);

  const getCurrentQuestionData = useCallback(() => {
    return allQuestions[currentQuestionIndex];
  }, [currentQuestionIndex]);
  const getQuestionText = useCallback(() => {
    const langData = getCurrentLangData();
    const questionData = getCurrentQuestionData();
    return langData.questionTexts[questionData.id as QuestionId];
  }, [getCurrentLangData, getCurrentQuestionData]);

  const getScenarioMessage = useCallback(() => {
    return getCurrentLangData().scenarioMessage;
  }, [getCurrentLangData]);

  const getQuestionOptions = useCallback(() => {
    const langData = getCurrentLangData();
    const questionData = getCurrentQuestionData();
    // Now returns an array of { display: string, value: string } objects
    return langData.options[questionData.optionsKey];
  }, [getCurrentLangData, getCurrentQuestionData]);

  const getCorrectAnswer = useCallback(() => {
    // This remains the canonical English key
    return getCurrentQuestionData().correctAnswerKey;
  }, [getCurrentQuestionData]);

  const getCorrectExplanation = useCallback(() => {
    const langData = getCurrentLangData();
    const questionData = getCurrentQuestionData();
    return langData.explanations[`${questionData.id}_correct`];
  }, [getCurrentLangData, getCurrentQuestionData]);

  const getIncorrectExplanation = useCallback(() => {
    const langData = getCurrentLangData();
    const questionData = getCurrentQuestionData();
    return langData.explanations[`${questionData.id}_incorrect`];
  }, [getCurrentLangData, getCurrentQuestionData]);

  const getCurrentLanguageName = useCallback(() => {
    return getCurrentLangData().name;
  }, [getCurrentLangData]);

  // Function to play, pause, or resume voice message
  const playVoiceMessage = useCallback((textToSpeak: string | undefined, onEndCallback: (() => void) | null = null) => {
    if (!voicesLoaded) {
      console.warn("Speech Synthesis voices not loaded yet. Cannot play audio.");
      return;
    }
    if (!textToSpeak) {
        console.warn("No text provided to playVoiceMessage.");
        return;
    }

    if ('speechSynthesis' in window) {
      // If the requested text is already paused, resume it
      if (utteranceRef.current && utteranceRef.current.text === textToSpeak && window.speechSynthesis.paused) {
          console.log(`Resuming speech for: "${textToSpeak}"`);
          window.speechSynthesis.resume();
          setIsPlaying(true);
          setIsPaused(false);
          setTextBeingSpoken(textToSpeak);
          return; // Exit, as we've resumed
      }

      // If something else is speaking or paused, or if it's the same text but not paused (i.e., playing), cancel it
      if (window.speechSynthesis.speaking || window.speechSynthesis.paused) {
          console.log("Cancelling current speech to play new text.");
          window.speechSynthesis.cancel();
          utteranceRef.current = null; // Clear old utterance reference
      }

      // Create a new utterance for the text
      const utterance = new SpeechSynthesisUtterance(textToSpeak);
      utterance.lang = currentLanguage;
      utterance.rate = 0.8;
      utterance.pitch = 1;
      utterance.volume = 1;

      const voices = window.speechSynthesis.getVoices();
      let selectedVoice = voices.find(voice => voice.lang === currentLanguage);
      if (!selectedVoice && currentLanguage.startsWith('en')) {
          selectedVoice = voices.find(voice => voice.lang.startsWith('en'));
      }
      if (selectedVoice) {
          utterance.voice = selectedVoice;
          console.log(`Attempting to speak: "${textToSpeak}" (Lang: ${currentLanguage}). Using voice: ${selectedVoice.name} (${selectedVoice.lang})`);
      } else {
          console.warn(`No specific voice found for language ${currentLanguage}. Using default voice.`);
      }

      utterance.onstart = () => {
          setIsPlaying(true);
          setIsPaused(false);
          setTextBeingSpoken(textToSpeak);
      };

      utterance.onend = () => {
          setIsPlaying(false);
          setIsPaused(false);
          setTextBeingSpoken(null);
          utteranceRef.current = null;
          if (onEndCallback && typeof onEndCallback === 'function') {
              onEndCallback(); // Execute callback on end
          }
      };

      utterance.onerror = (event) => {
          console.error('SpeechSynthesisUtterance error:', event);
          setIsPlaying(false);
          setIsPaused(false);
          setTextBeingSpoken(null);
          utteranceRef.current = null;
      };

      // Delay before speaking to allow browser engine to reset/prepare
      setTimeout(() => {
          console.log(`Before speak (after delay): speaking=${window.speechSynthesis.speaking}, pending=${window.speechSynthesis.pending}`);
          // Add an additional check to ensure the engine is truly idle before speaking
          if (window.speechSynthesis.speaking || window.speechSynthesis.pending) {
              console.warn("SpeechSynthesis is still busy after delay. Skipping this utterance to prevent error.");
              setIsPlaying(false);
              setIsPaused(false);
              setTextBeingSpoken(null);
              utteranceRef.current = null;
              return; // Exit if still busy
          }
          try {
              window.speechSynthesis.speak(utterance);
              utteranceRef.current = utterance;
          } catch (error) {
              console.error("Error calling speechSynthesis.speak() after delay and check:", error);
              setIsPlaying(false);
              setIsPaused(false);
              setTextBeingSpoken(null);
          }
      }, 500); // Increased delay to 500ms
      
    } else {
      console.warn("Speech Synthesis not supported in this browser.");
    }
  }, [currentLanguage, voicesLoaded]);

  // Function to pause voice message
  const pauseVoiceMessage = useCallback(() => {
    if ('speechSynthesis' in window && window.speechSynthesis.speaking) {
      window.speechSynthesis.pause();
      setIsPlaying(false);
      setIsPaused(true);
      console.log("Speech paused.");
    }
  }, []);

  // Handle language change from dropdown
  const handleLanguageChange = (langCode: React.SetStateAction<string>) => {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel(); // Stop current speech when changing language
    }
    setCurrentLanguage(langCode);
    setIsPlaying(false);
    setIsPaused(false);
    setTextBeingSpoken(null);
    setIsDropdownOpen(false);
    utteranceRef.current = null;
    // Reset quiz state when language changes
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    setCurrentQuestionIndex(0); // Go back to the first question
  };

  // Handle user's answer selection
  const handleAnswerSelect = (answerValue: string) => { // Now expects the 'value' not 'display'
    setSelectedAnswer(answerValue);
    setShowResult(true);
    const correctAns = getCorrectAnswer();
    setIsCorrect(answerValue === correctAns);

    // Play the appropriate answer message immediately
    playVoiceMessage((answerValue === correctAns) ? getCorrectExplanation() : getIncorrectExplanation());
  };

  // Move to the next question
  const goToNextQuestion = useCallback(() => {
    const nextIndex = currentQuestionIndex + 1;
    if (nextIndex < allQuestions.length) {
      setCurrentQuestionIndex(nextIndex);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
      // Play the question immediately after moving to the next one
      playVoiceMessage(getQuestionText());
    } else {
      // All questions answered, loop back to the first question
      setShowResult(true); // Keep result section visible to show message
      setIsCorrect(false); // Not a correct/incorrect state, just completion
      setSelectedAnswer(null); // Clear selected answer
      // Display a message to the user that all questions are completed.
      // This message is not spoken automatically.
      // The user can click 'Play Scenario' to hear it or restart.
      setCurrentQuestionIndex(0);
      setSelectedAnswer(null);
      setShowResult(false);
      setIsCorrect(false);
    }
  }, [currentQuestionIndex, allQuestions.length, playVoiceMessage, getQuestionText]);

  // Reset quiz state for a new attempt (current question)
  const resetCurrentQuestion = useCallback(() => {
    setSelectedAnswer(null);
    setShowResult(false);
    setIsCorrect(false);
    // Replay the current question immediately
    playVoiceMessage(getQuestionText());
  }, [playVoiceMessage, getQuestionText]);

  // Effect to load voices and set voicesLoaded state
  useEffect(() => {
    if ('speechSynthesis' in window) {
      const loadVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices.length > 0) {
          setVoicesLoaded(true);
          console.log("SpeechSynthesis voices loaded. Total voices:", voices.length);
          // Log available voices for debugging
          voices.forEach((voice, index) => {
            console.log(`Voice ${index + 1}: Name: ${voice.name}, Lang: ${voice.lang}, Default: ${voice.default}`);
          });
        } else {
          console.warn("No SpeechSynthesis voices available yet.");
        }
      };

      // Try to load voices immediately
      loadVoices();

      // Listen for voiceschanged event (important for some browsers like Chrome)
      window.speechSynthesis.addEventListener('voiceschanged', loadVoices);

      return () => {
        window.speechSynthesis.removeEventListener('voiceschanged', loadVoices);
        if ('speechSynthesis' in window) {
          window.speechSynthesis.cancel(); // Clean up speech synthesis on unmount
        }
      };
    } else {
      console.error("Speech Synthesis API not supported in this browser.");
    }
  }, []); // Empty dependency array ensures this runs once on mount

  // New useEffect to automatically play scenario then first question
  useEffect(() => {
    if (voicesLoaded) {
      // Define the callback for when the scenario message ends
      const playFirstQuestionCallback = () => {
        playVoiceMessage(getQuestionText());
      };
      // Play the scenario message, and chain the first question
      playVoiceMessage(getScenarioMessage(), playFirstQuestionCallback);
    }
  }, [voicesLoaded, currentLanguage, getScenarioMessage, getQuestionText, playVoiceMessage]);


  // Character mapping for rendering
  const characterComponents = {
    'Annie': { div: AnnieImage, asset: AnnieAssetImage, color: 'text-pink-600' },
    'Vinnie': { div: VinnieImage, asset: VinnieAssetImage, color: 'text-blue-600' },
    'Ninnie': { div: NinnieImage, asset: NinnieAssetImage, color: 'text-green-600' },
    'Bunny': { div: BunnyImage, asset: BunnyAssetImage, color: 'text-orange-600' },
    'Sunny': { div: SunnyImage, asset: SunnyAssetImage, color: 'text-yellow-600' },
  };

  return (
    <div className="max-w-4xl mx-auto p-3 md:p-6 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 min-h-screen font-sans">
      <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-3 md:p-6">
        <h1 className="text-xl md:text-3xl font-bold text-center mb-4 md:mb-6 text-gray-800 dark:text-gray-100">
          Seating Arrangement Practice
        </h1>

        {/* User Instruction for Audio */}
        {!voicesLoaded && (
          <p className="text-center text-sm text-red-500 dark:text-red-400 mb-3">
            Loading voices... If audio doesn't play, ensure your browser supports Speech Synthesis and try refreshing.
          </p>
        )}
        {voicesLoaded && (
          <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-3">
            Audio will play automatically. If not, click "Play Scenario" or "Play Question".
          </p>
        )}

        {/* Image Type Toggle */}
        <div className="flex justify-center mb-3 md:mb-4">
          <div className="flex items-center gap-2 md:gap-4 bg-gray-100 dark:bg-gray-700 p-1 rounded-lg">
            <button
              onClick={() => setUseAssetImages(false)}
              className={`px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-medium transition-colors ${
                !useAssetImages
                  ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
              }`}
            >
              DIV Images
            </button>
            <button
              onClick={() => setUseAssetImages(true)}
              className={`px-2 md:px-3 py-1 rounded-md text-xs md:text-sm font-medium transition-colors ${
                useAssetImages
                  ? 'bg-white dark:bg-gray-600 text-gray-800 dark:text-gray-100 shadow-sm'
                  : 'text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-gray-100'
              }`}
            >
              Asset Images
            </button>
          </div>
        </div>

        {/* Language Selection Dropdown */}
        <div className="flex justify-center mb-3 md:mb-4">
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex items-center gap-1 md:gap-2 px-2 md:px-3 py-1 md:py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-600 transition-colors min-w-24 md:min-w-32 text-xs md:text-sm"
            >
              <span className="text-gray-700 dark:text-gray-200 truncate">{getCurrentLanguageName()}</span>
              <ChevronDown size={14} className={`text-gray-500 dark:text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>

            {isDropdownOpen && (
              <div className="absolute top-full left-0 mt-1 w-36 md:w-44 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto">
                {languages.map((lang) => (
                  <button
                    key={lang.code}
                    onClick={() => handleLanguageChange(lang.code)}
                    className={`w-full text-left px-2 md:px-3 py-1 md:py-2 hover:bg-gray-100 dark:hover:bg-gray-600 transition-colors text-xs md:text-sm ${
                      currentLanguage === lang.code ? 'bg-blue-50 dark:bg-blue-900 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-200'
                    }`}
                  >
                    {lang.name}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Voice Control */}
        <div className="flex justify-center mb-4 md:mb-6">
          <button
            onClick={() => {
              const scenarioText = getScenarioMessage();
              if (isPlaying && textBeingSpoken === scenarioText && !isPaused) {
                pauseVoiceMessage();
              } else {
                playVoiceMessage(scenarioText);
              }
            }}
            className="flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-xs md:text-sm"
            disabled={!voicesLoaded}
          >
            {isPlaying && textBeingSpoken === getScenarioMessage() && !isPaused ? <Pause size={14} className="md:w-4 md:h-4" /> : <Play size={14} className="md:w-4 md:h-4" />}
            {isPlaying && textBeingSpoken === getScenarioMessage() && isPaused ? 'Resume' : 'Play Scenario'}
          </button>
          <button
            onClick={() => {
              const questionText = getQuestionText();
              if (isPlaying && textBeingSpoken === questionText && !isPaused) {
                pauseVoiceMessage();
              } else {
                playVoiceMessage(questionText);
              }
            }}
            className="ml-2 flex items-center gap-1 md:gap-2 px-3 md:px-4 py-2 bg-purple-500 hover:bg-purple-600 dark:bg-purple-600 dark:hover:bg-purple-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-xs md:text-sm"
            disabled={!voicesLoaded}
          >
            {isPlaying && textBeingSpoken === getQuestionText() && !isPaused ? <Pause size={14} className="md:w-4 md:h-4" /> : <Play size={14} className="md:w-4 md:h-4" />}
            {isPlaying && textBeingSpoken === getQuestionText() && isPaused ? 'Resume' : 'Play Question'}
          </button>
        </div>

        {/* Seating Arrangement Visualization */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-xl p-3 md:p-6 mb-4 md:mb-6">
          <div className="flex justify-center items-center">
            <div className="flex flex-row justify-center items-center gap-1 md:gap-4 w-full flex-wrap">
              {seatingOrder.map((characterName) => {
                const charData = characterComponents[characterName as keyof typeof characterComponents];
                const ImageComp = useAssetImages ? charData.asset : charData.div;
                return (
                  <CharacterComponent
                    key={characterName}
                    name={characterName}
                    ImageComponent={ImageComp}
                    colorTheme={charData.color}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Current Message Display (Scenario) */}
        <div className="mb-4 md:mb-6 text-center px-2 md:px-4">
          <p className="text-sm md:text-base text-gray-600 dark:text-gray-300 italic break-words">
            "{getScenarioMessage()}"
          </p>
        </div>

        {/* Quiz Question */}
        <div className="bg-blue-50 dark:bg-blue-900/30 rounded-xl p-3 md:p-6 mb-4 md:mb-6">
          <h2 className="text-lg md:text-xl font-bold text-blue-800 dark:text-blue-300 text-center mb-3 md:mb-4">
            {getQuestionText()} ({currentQuestionIndex + 1}/{allQuestions.length})
          </h2>

          {!showResult && (
            <div className="flex flex-wrap gap-2 md:gap-4 justify-center">
              {getQuestionOptions().map((optionObj) => (
                <button
                  key={optionObj.value}
                  onClick={() => handleAnswerSelect(optionObj.value)}
                  className="px-4 md:px-6 py-2 md:py-3 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm md:text-base"
                >
                  {optionObj.display}
                </button>
              ))}
            </div>
          )}

          {showResult && (
            <div className="text-center">
              <div className={`flex items-center justify-center gap-2 mb-3 md:mb-4 ${isCorrect ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'}`}>
                {isCorrect ? <Check size={20} className="md:w-6 md:h-6" /> : <X size={20} className="md:w-6 md:h-6" />}
                <span className="text-lg md:text-xl font-bold">
                  {isCorrect ? 'Correct!' : 'Incorrect!'}
                </span>
              </div>

              {/* Show selected answer with color coding */}
              <div className="flex flex-wrap gap-2 md:gap-4 justify-center mb-3 md:mb-4">
                {getQuestionOptions().map((optionObj) => (
                    <div
                      key={optionObj.value}
                      className={`px-4 md:px-6 py-2 md:py-3 rounded-lg font-medium text-sm md:text-base ${
                        selectedAnswer === optionObj.value
                          ? (isCorrect ? 'bg-green-500 dark:bg-green-600 text-white' : 'bg-red-500 dark:bg-red-600 text-white')
                          : (optionObj.value === getCorrectAnswer() && !isCorrect ? 'bg-green-100 dark:bg-green-800 text-green-700 dark:text-green-200 border border-green-300 dark:border-green-600' : 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300')
                      }`}
                    >
                      {optionObj.display} {selectedAnswer === optionObj.value && (isCorrect ? '✓' : '✗')}
                    </div>
                ))}
              </div>

              <p className="text-sm md:text-base text-gray-700 dark:text-gray-300 mb-3 md:mb-4">
                {isCorrect ? getCorrectExplanation() : getIncorrectExplanation()}
              </p>

              <div className="flex justify-center gap-2 md:gap-4">
                <button
                  onClick={resetCurrentQuestion}
                  className="px-4 md:px-6 py-2 bg-yellow-500 hover:bg-yellow-600 dark:bg-yellow-600 dark:hover:bg-yellow-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm md:text-base"
                >
                  Try Current Question Again
                </button>
                <button
                  onClick={goToNextQuestion}
                  className="px-4 md:px-6 py-2 bg-blue-500 hover:bg-blue-600 dark:bg-blue-600 dark:hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 shadow-md hover:shadow-lg text-sm md:text-base flex items-center gap-1"
                >
                  Next Question <ArrowRight size={14} className="md:w-4 md:h-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SeatingArrangementAdditionalPractice;
