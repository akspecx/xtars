import React from 'react';
import KidsModuleLandingPage, { KidsGameEntry } from '../../../CommonUtility/KidsModuleLandingPage';

const alphabetsData: KidsGameEntry[] = [
  { id: 'match',          title: 'Letter Match',              subtitle: 'Correctly match the alphabets',       icon: '🔠', path: '/games/alphabets/letter-match',     gradient: 'from-orange-500 to-amber-500' },
  { id: 'arrange',        title: 'Arranging Alphabets',       subtitle: 'Arrange in order',                    icon: '🔡', path: '/games/alphabets/sequence',         gradient: 'from-lime-500 to-green-500' },
  { id: 'fruitNaming',    title: 'Fruit Naming',              subtitle: 'Practice fruit naming with letters',  icon: '🍎', path: '/games/alphabets/fruit-naming',     gradient: 'from-cyan-500 to-blue-500' },
  { id: 'randomAlphabets', title: 'Random Alphabet Mapping',  subtitle: 'Select the correct alphabets',        icon: '❓', path: '/games/alphabets/random-balloon',   gradient: 'from-purple-500 to-fuchsia-500' },
  { id: 'tracing',        title: 'Trace the Letters',         subtitle: 'Follow dotted guides and strokes',    icon: '✍️', path: '/games/alphabets/tracing',          gradient: 'from-pink-500 to-purple-500' },
  { id: 'soundGarden',    title: 'Alphabet Sound Garden',     subtitle: 'Hear stories and chants',             icon: '🎵', path: '/games/alphabets/counting',         gradient: 'from-emerald-500 to-teal-500' },
  { id: 'storyCards',     title: 'Alphabet Story Cards',      subtitle: 'Tiny stories for each letter',        icon: '📖', path: '/games/alphabets/story-cards',      gradient: 'from-amber-400 to-orange-500' },
  { id: 'fillBlanks',     title: 'Fill in the Blanks',        subtitle: 'Drag letters to complete sequences',  icon: '🚂', path: '/games/alphabets/fill-blanks',      gradient: 'from-indigo-500 to-purple-500' },
  { id: 'objectMatching', title: 'Letter-Object Matching',    subtitle: 'Match letters with objects',          icon: '🎯', path: '/games/alphabets/object-matching',  gradient: 'from-rose-500 to-pink-500' },
  { id: 'caseMatching',   title: 'Uppercase / Lowercase',     subtitle: 'Match uppercase with lowercase',      icon: '🔤', path: '/games/alphabets/case-matching',    gradient: 'from-blue-500 to-indigo-500' },
  { id: 'sorting',        title: 'Letter Sorting',            subtitle: 'Sort by vowels, curves, and more',    icon: '📦', path: '/games/alphabets/sorting',          gradient: 'from-green-500 to-emerald-500' },
  { id: 'descending',     title: 'Reverse Alphabet',          subtitle: 'Arrange letters in reverse',          icon: '🔙', path: '/games/alphabets/descending',       gradient: 'from-orange-500 to-red-500' },
  { id: 'beginSound',     title: 'Beginning Sound Picker',    subtitle: 'Pick pictures by starting sound',     icon: '🔈', path: '/games/alphabets/begin-sound',      gradient: 'from-sky-500 to-cyan-500' },
  { id: 'letterPuzzle',   title: 'Build the Letter',          subtitle: 'Snap pieces to build letters',        icon: '🧩', path: '/games/alphabets/letter-puzzle',    gradient: 'from-violet-500 to-indigo-500' },
  { id: 'letterMaze',     title: 'Letter Path Maze',          subtitle: 'Tap letters in order',                icon: '🧭', path: '/games/alphabets/path-maze',        gradient: 'from-yellow-500 to-amber-500' },
  { id: 'rhyming',        title: 'Rhyming Friends',           subtitle: 'Find words that rhyme',               icon: '🎵', path: '/games/alphabets/rhyming',          gradient: 'from-fuchsia-500 to-rose-500' },
  { id: 'nameBuilder',    title: 'Build Your Name',           subtitle: 'Use letters to build your name',      icon: '✍️', path: '/games/alphabets/name-builder',     gradient: 'from-teal-500 to-emerald-500' },
  { id: 'findTap',        title: 'Find & Tap Letters',        subtitle: 'Search scenes for hidden letters',    icon: '🔍', path: '/games/alphabets/find-tap',         gradient: 'from-emerald-400 to-sky-400' },
  { id: 'uppercaseUsage', title: 'Uppercase or Lowercase?',   subtitle: 'Choose letters that should be uppercase', icon: '🔡', path: '/games/alphabets/uppercase-usage', gradient: 'from-slate-500 to-indigo-500' },
  { id: 'letter-safari',  title: 'Letter Hunt Safari',        subtitle: 'Find animals by starting letter',     icon: '🦁', path: '/games/alphabets/letter-safari',    gradient: 'from-amber-500 to-orange-500' },
  { id: 'dance-party',    title: 'Alphabet Dance Party',      subtitle: 'Learn letters through actions',        icon: '💃', path: '/games/alphabets/dance-party',      gradient: 'from-pink-500 to-purple-500' },
  { id: 'size-sorting',   title: 'Letter Size Sorting',       subtitle: 'Sort big and small letters',           icon: '📐', path: '/games/alphabets/size-sorting',     gradient: 'from-yellow-500 to-orange-500' },
  { id: 'print-match',    title: 'Environmental Print Match', subtitle: 'Match brands with letters',            icon: '🏪', path: '/games/alphabets/print-match',      gradient: 'from-cyan-500 to-blue-500' },
  { id: 'cvc-builder',    title: 'CVC Word Builder',          subtitle: 'Build 3-letter words',                 icon: '🏗️', path: '/games/alphabets/cvc-builder',      gradient: 'from-green-500 to-emerald-500' },
  { id: 'word-families',  title: 'Word Family Houses',        subtitle: 'Sort rhyming word families',           icon: '🏠', path: '/games/alphabets/word-families',    gradient: 'from-orange-500 to-red-500' },
  { id: 'alphabet-chef',  title: 'Alphabet Chef',             subtitle: 'Spell food words',                     icon: '👨‍🍳', path: '/games/alphabets/alphabet-chef',  gradient: 'from-rose-500 to-pink-500' },
  { id: 'sight-words',    title: 'Sight Word Stars',          subtitle: 'Catch falling sight words',            icon: '⭐', path: '/games/alphabets/sight-words',      gradient: 'from-indigo-500 to-purple-500' },
  { id: 'pre-writing',    title: 'Pre-Writing Strokes',       subtitle: 'Practice writing strokes',             icon: '✏️', path: '/games/alphabets/pre-writing',      gradient: 'from-blue-500 to-purple-500' },
  { id: 'blending',       title: 'Blending Bridge',           subtitle: 'Blend sounds to make words',           icon: '🌉', path: '/games/alphabets/blending',         gradient: 'from-sky-500 to-blue-500' },
  { id: 'sentence-builder', title: 'Sentence Builder',        subtitle: 'Build complete sentences',             icon: '📝', path: '/games/alphabets/sentence-builder', gradient: 'from-teal-500 to-cyan-500' },
  { id: 'compound-words', title: 'Compound Word Factory',     subtitle: 'Combine words to make new ones',       icon: '🏭', path: '/games/alphabets/compound-words',   gradient: 'from-purple-500 to-pink-500' },
];

const AlphabetGamesLandingPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => (
  <KidsModuleLandingPage
    moduleTitle="Alphabets"
    moduleEmoji="🔤"
    headerGradient="from-rose-500 to-pink-500"
    bgColor="#fff0f5"
    games={alphabetsData}
    onBack={onBack}
  />
);

export default AlphabetGamesLandingPage;
