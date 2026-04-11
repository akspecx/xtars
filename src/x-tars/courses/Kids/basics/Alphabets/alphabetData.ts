/**
 * alphabetData.ts
 * Single source of truth for all 26 letters — objects, sounds, colors, gradients.
 * Imported by every alphabet learning module.
 */

export interface AlphabetObject {
  emoji:    string;
  word:     string;
  /** true = word starts with this letter's phoneme */
  starts:   boolean;
}

export interface LetterData {
  letter:   string;
  uppercase:string;
  lowercase:string;
  phoneme:  string;    // e.g. "/a/"
  color:    string;    // accent hex
  bg:       string;    // card gradient
  /** The 3 "example" objects for the intro module (all start with letter) */
  examples: [AlphabetObject, AlphabetObject, AlphabetObject];
  /** Full set of 4 objects for quiz (3 correct, 1 distractor) */
  quiz:     [AlphabetObject, AlphabetObject, AlphabetObject, AlphabetObject];
}

export const ALPHABET_DATA: LetterData[] = [
  {
    letter:'A', uppercase:'A', lowercase:'a', phoneme:'/a/',
    color:'#e11d48', bg:'linear-gradient(135deg,#fce7f3,#fda4af,#fb7185)',
    examples:[
      { emoji:'🍎', word:'Apple',     starts:true },
      { emoji:'🐜', word:'Ant',       starts:true },
      { emoji:'✈️', word:'Aeroplane', starts:true },
    ],
    quiz:[
      { emoji:'🍎', word:'Apple',    starts:true  },
      { emoji:'🐜', word:'Ant',      starts:true  },
      { emoji:'✈️', word:'Aeroplane',starts:true  },
      { emoji:'🐝', word:'Bee',      starts:false },
    ],
  },
  {
    letter:'B', uppercase:'B', lowercase:'b', phoneme:'/b/',
    color:'#2563eb', bg:'linear-gradient(135deg,#dbeafe,#93c5fd,#60a5fa)',
    examples:[
      { emoji:'🐻', word:'Bear',   starts:true },
      { emoji:'⚽', word:'Ball',   starts:true },
      { emoji:'🍌', word:'Banana', starts:true },
    ],
    quiz:[
      { emoji:'🐻', word:'Bear',   starts:true  },
      { emoji:'⚽', word:'Ball',   starts:true  },
      { emoji:'🍌', word:'Banana', starts:true  },
      { emoji:'🌸', word:'Flower', starts:false },
    ],
  },
  {
    letter:'C', uppercase:'C', lowercase:'c', phoneme:'/k/',
    color:'#059669', bg:'linear-gradient(135deg,#d1fae5,#6ee7b7,#34d399)',
    examples:[
      { emoji:'🐱', word:'Cat',   starts:true },
      { emoji:'🎂', word:'Cake',  starts:true },
      { emoji:'🚗', word:'Car',   starts:true },
    ],
    quiz:[
      { emoji:'🐱', word:'Cat',  starts:true  },
      { emoji:'🎂', word:'Cake', starts:true  },
      { emoji:'🚗', word:'Car',  starts:true  },
      { emoji:'🐕', word:'Dog',  starts:false },
    ],
  },
  {
    letter:'D', uppercase:'D', lowercase:'d', phoneme:'/d/',
    color:'#d97706', bg:'linear-gradient(135deg,#fef3c7,#fcd34d,#fbbf24)',
    examples:[
      { emoji:'🥁', word:'Drum', starts:true },
      { emoji:'🦆', word:'Duck', starts:true },
      { emoji:'🐕', word:'Dog',  starts:true },
    ],
    quiz:[
      { emoji:'🥁', word:'Drum',     starts:true  },
      { emoji:'🦆', word:'Duck',     starts:true  },
      { emoji:'🐕', word:'Dog',      starts:true  },
      { emoji:'🐘', word:'Elephant', starts:false },
    ],
  },
  {
    letter:'E', uppercase:'E', lowercase:'e', phoneme:'/e/',
    color:'#7c3aed', bg:'linear-gradient(135deg,#ede9fe,#c4b5fd,#a78bfa)',
    examples:[
      { emoji:'🥚', word:'Egg',      starts:true },
      { emoji:'🐘', word:'Elephant', starts:true },
      { emoji:'✏️', word:'Eraser',   starts:true },
    ],
    quiz:[
      { emoji:'🥚', word:'Egg',       starts:true  },
      { emoji:'🐘', word:'Elephant',  starts:true  },
      { emoji:'✏️', word:'Eraser',    starts:true  },
      { emoji:'🍞', word:'Bread',     starts:false },
    ],
  },
  {
    letter:'F', uppercase:'F', lowercase:'f', phoneme:'/f/',
    color:'#0369a1', bg:'linear-gradient(135deg,#e0f2fe,#7dd3fc,#38bdf8)',
    examples:[
      { emoji:'🐸', word:'Frog',   starts:true },
      { emoji:'🌸', word:'Flower', starts:true },
      { emoji:'🦊', word:'Fox',    starts:true },
    ],
    quiz:[
      { emoji:'🐸', word:'Frog',   starts:true  },
      { emoji:'🌸', word:'Flower', starts:true  },
      { emoji:'🦊', word:'Fox',    starts:true  },
      { emoji:'🐝', word:'Bee',    starts:false },
    ],
  },
  {
    letter:'G', uppercase:'G', lowercase:'g', phoneme:'/g/',
    color:'#15803d', bg:'linear-gradient(135deg,#dcfce7,#86efac,#4ade80)',
    examples:[
      { emoji:'🍇', word:'Grapes',  starts:true },
      { emoji:'🦒', word:'Giraffe', starts:true },
      { emoji:'🎸', word:'Guitar',  starts:true },
    ],
    quiz:[
      { emoji:'🍇', word:'Grapes',  starts:true  },
      { emoji:'🦒', word:'Giraffe', starts:true  },
      { emoji:'🎸', word:'Guitar',  starts:true  },
      { emoji:'🐟', word:'Fish',    starts:false },
    ],
  },
  {
    letter:'H', uppercase:'H', lowercase:'h', phoneme:'/h/',
    color:'#b45309', bg:'linear-gradient(135deg,#fef3c7,#fca5a5,#fbbf24)',
    examples:[
      { emoji:'🏠', word:'House', starts:true },
      { emoji:'🎩', word:'Hat',   starts:true },
      { emoji:'🐴', word:'Horse', starts:true },
    ],
    quiz:[
      { emoji:'🏠', word:'House',  starts:true  },
      { emoji:'🎩', word:'Hat',    starts:true  },
      { emoji:'🐴', word:'Horse',  starts:true  },
      { emoji:'🐰', word:'Rabbit', starts:false },
    ],
  },
  {
    letter:'I', uppercase:'I', lowercase:'i', phoneme:'/i/',
    color:'#0284c7', bg:'linear-gradient(135deg,#e0f2fe,#bae6fd,#7dd3fc)',
    examples:[
      { emoji:'🍦', word:'Ice Cream', starts:true },
      { emoji:'🦎', word:'Iguana',    starts:true },
      { emoji:'🐛', word:'Insect',    starts:true },
    ],
    quiz:[
      { emoji:'🍦', word:'Ice Cream', starts:true  },
      { emoji:'🦎', word:'Iguana',    starts:true  },
      { emoji:'🐛', word:'Insect',    starts:true  },
      { emoji:'🔥', word:'Fire',      starts:false },
    ],
  },
  {
    letter:'J', uppercase:'J', lowercase:'j', phoneme:'/j/',
    color:'#be185d', bg:'linear-gradient(135deg,#fce7f3,#fda4af,#fb7185)',
    examples:[
      { emoji:'🫙', word:'Jar',     starts:true },
      { emoji:'🧃', word:'Juice',   starts:true },
      { emoji:'🦘', word:'Jumping', starts:true },
    ],
    quiz:[
      { emoji:'🫙', word:'Jar',     starts:true  },
      { emoji:'🧃', word:'Juice',   starts:true  },
      { emoji:'🦘', word:'Jumping', starts:true  },
      { emoji:'🐱', word:'Cat',     starts:false },
    ],
  },
  {
    letter:'K', uppercase:'K', lowercase:'k', phoneme:'/k/',
    color:'#6d28d9', bg:'linear-gradient(135deg,#f3e8ff,#c084fc,#a855f7)',
    examples:[
      { emoji:'🦘', word:'Kangaroo', starts:true },
      { emoji:'🪁', word:'Kite',     starts:true },
      { emoji:'🗝️', word:'Key',      starts:true },
    ],
    quiz:[
      { emoji:'🦘', word:'Kangaroo', starts:true  },
      { emoji:'🪁', word:'Kite',     starts:true  },
      { emoji:'🗝️', word:'Key',      starts:true  },
      { emoji:'🌴', word:'Tree',     starts:false },
    ],
  },
  {
    letter:'L', uppercase:'L', lowercase:'l', phoneme:'/l/',
    color:'#16a34a', bg:'linear-gradient(135deg,#dcfce7,#86efac,#4ade80)',
    examples:[
      { emoji:'🦁', word:'Lion',  starts:true },
      { emoji:'🍋', word:'Lemon', starts:true },
      { emoji:'🦎', word:'Lizard',starts:true },
    ],
    quiz:[
      { emoji:'🦁', word:'Lion',  starts:true  },
      { emoji:'🍋', word:'Lemon', starts:true  },
      { emoji:'🦎', word:'Lizard',starts:true  },
      { emoji:'⭐', word:'Star',  starts:false },
    ],
  },
  {
    letter:'M', uppercase:'M', lowercase:'m', phoneme:'/m/',
    color:'#9d174d', bg:'linear-gradient(135deg,#fce7f3,#f9a8d4,#ec4899)',
    examples:[
      { emoji:'🌙', word:'Moon',    starts:true },
      { emoji:'🐒', word:'Monkey',  starts:true },
      { emoji:'🍄', word:'Mushroom',starts:true },
    ],
    quiz:[
      { emoji:'🌙', word:'Moon',    starts:true  },
      { emoji:'🐒', word:'Monkey',  starts:true  },
      { emoji:'🍄', word:'Mushroom',starts:true  },
      { emoji:'🌟', word:'Star',    starts:false },
    ],
  },
  {
    letter:'N', uppercase:'N', lowercase:'n', phoneme:'/n/',
    color:'#1e40af', bg:'linear-gradient(135deg,#dbeafe,#93c5fd,#60a5fa)',
    examples:[
      { emoji:'🌙', word:'Night',  starts:true },
      { emoji:'🪆', word:'Noodles',starts:true },
      { emoji:'👃', word:'Nose',   starts:true },
    ],
    quiz:[
      { emoji:'🌙', word:'Night',  starts:true  },
      { emoji:'🪆', word:'Noodles',starts:true  },
      { emoji:'👃', word:'Nose',   starts:true  },
      { emoji:'🐝', word:'Bee',    starts:false },
    ],
  },
  {
    letter:'O', uppercase:'O', lowercase:'o', phoneme:'/o/',
    color:'#ea580c', bg:'linear-gradient(135deg,#ffedd5,#fed7aa,#fb923c)',
    examples:[
      { emoji:'🐙', word:'Octopus', starts:true },
      { emoji:'🦉', word:'Owl',     starts:true },
      { emoji:'🍊', word:'Orange',  starts:true },
    ],
    quiz:[
      { emoji:'🐙', word:'Octopus', starts:true  },
      { emoji:'🦉', word:'Owl',     starts:true  },
      { emoji:'🍊', word:'Orange',  starts:true  },
      { emoji:'🐟', word:'Fish',    starts:false },
    ],
  },
  {
    letter:'P', uppercase:'P', lowercase:'p', phoneme:'/p/',
    color:'#7c3aed', bg:'linear-gradient(135deg,#ede9fe,#c4b5fd,#a78bfa)',
    examples:[
      { emoji:'🐧', word:'Penguin', starts:true },
      { emoji:'🍕', word:'Pizza',   starts:true },
      { emoji:'🪴', word:'Plant',   starts:true },
    ],
    quiz:[
      { emoji:'🐧', word:'Penguin', starts:true  },
      { emoji:'🍕', word:'Pizza',   starts:true  },
      { emoji:'🪴', word:'Plant',   starts:true  },
      { emoji:'🦁', word:'Lion',    starts:false },
    ],
  },
  {
    letter:'Q', uppercase:'Q', lowercase:'q', phoneme:'/kw/',
    color:'#0f766e', bg:'linear-gradient(135deg,#ccfbf1,#99f6e4,#2dd4bf)',
    examples:[
      { emoji:'👑', word:'Queen',    starts:true },
      { emoji:'❓', word:'Question', starts:true },
      { emoji:'🪶', word:'Quill',    starts:true },
    ],
    quiz:[
      { emoji:'👑', word:'Queen',    starts:true  },
      { emoji:'❓', word:'Question', starts:true  },
      { emoji:'🪶', word:'Quill',    starts:true  },
      { emoji:'🌺', word:'Rose',     starts:false },
    ],
  },
  {
    letter:'R', uppercase:'R', lowercase:'r', phoneme:'/r/',
    color:'#dc2626', bg:'linear-gradient(135deg,#fee2e2,#fca5a5,#f87171)',
    examples:[
      { emoji:'🌈', word:'Rainbow', starts:true },
      { emoji:'🐇', word:'Rabbit',  starts:true },
      { emoji:'🚀', word:'Rocket',  starts:true },
    ],
    quiz:[
      { emoji:'🌈', word:'Rainbow', starts:true  },
      { emoji:'🐇', word:'Rabbit',  starts:true  },
      { emoji:'🚀', word:'Rocket',  starts:true  },
      { emoji:'🐱', word:'Cat',     starts:false },
    ],
  },
  {
    letter:'S', uppercase:'S', lowercase:'s', phoneme:'/s/',
    color:'#0ea5e9', bg:'linear-gradient(135deg,#e0f2fe,#bae6fd,#38bdf8)',
    examples:[
      { emoji:'🌞', word:'Sun',  starts:true },
      { emoji:'⭐', word:'Star', starts:true },
      { emoji:'🐍', word:'Snake',starts:true },
    ],
    quiz:[
      { emoji:'🌞', word:'Sun',    starts:true  },
      { emoji:'⭐', word:'Star',   starts:true  },
      { emoji:'🐍', word:'Snake',  starts:true  },
      { emoji:'🐔', word:'Chicken',starts:false },
    ],
  },
  {
    letter:'T', uppercase:'T', lowercase:'t', phoneme:'/t/',
    color:'#0f766e', bg:'linear-gradient(135deg,#ccfbf1,#99f6e4,#5eead4)',
    examples:[
      { emoji:'🐯', word:'Tiger',  starts:true },
      { emoji:'🌳', word:'Tree',   starts:true },
      { emoji:'🐢', word:'Turtle', starts:true },
    ],
    quiz:[
      { emoji:'🐯', word:'Tiger',  starts:true  },
      { emoji:'🌳', word:'Tree',   starts:true  },
      { emoji:'🐢', word:'Turtle', starts:true  },
      { emoji:'🐻', word:'Bear',   starts:false },
    ],
  },
  {
    letter:'U', uppercase:'U', lowercase:'u', phoneme:'/u/',
    color:'#7c3aed', bg:'linear-gradient(135deg,#f3e8ff,#e9d5ff,#c084fc)',
    examples:[
      { emoji:'☂️', word:'Umbrella', starts:true },
      { emoji:'🦄', word:'Unicorn',  starts:true },
      { emoji:'🎺', word:'Ukulele',  starts:true },
    ],
    quiz:[
      { emoji:'☂️', word:'Umbrella', starts:true  },
      { emoji:'🦄', word:'Unicorn',  starts:true  },
      { emoji:'🎺', word:'Ukulele',  starts:true  },
      { emoji:'🌸', word:'Flower',   starts:false },
    ],
  },
  {
    letter:'V', uppercase:'V', lowercase:'v', phoneme:'/v/',
    color:'#6d28d9', bg:'linear-gradient(135deg,#f3e8ff,#ddd6fe,#c084fc)',
    examples:[
      { emoji:'🎻', word:'Violin',starts:true },
      { emoji:'🌺', word:'Violet',starts:true },
      { emoji:'🚐', word:'Van',   starts:true },
    ],
    quiz:[
      { emoji:'🎻', word:'Violin',starts:true  },
      { emoji:'🌺', word:'Violet',starts:true  },
      { emoji:'🚐', word:'Van',   starts:true  },
      { emoji:'🌙', word:'Moon',  starts:false },
    ],
  },
  {
    letter:'W', uppercase:'W', lowercase:'w', phoneme:'/w/',
    color:'#1d4ed8', bg:'linear-gradient(135deg,#dbeafe,#bfdbfe,#93c5fd)',
    examples:[
      { emoji:'🐋', word:'Whale', starts:true },
      { emoji:'🐺', word:'Wolf',  starts:true },
      { emoji:'⌚', word:'Watch', starts:true },
    ],
    quiz:[
      { emoji:'🐋', word:'Whale', starts:true  },
      { emoji:'🐺', word:'Wolf',  starts:true  },
      { emoji:'⌚', word:'Watch', starts:true  },
      { emoji:'🐸', word:'Frog',  starts:false },
    ],
  },
  {
    letter:'X', uppercase:'X', lowercase:'x', phoneme:'/ks/',
    color:'#374151', bg:'linear-gradient(135deg,#f3f4f6,#e5e7eb,#d1d5db)',
    examples:[
      { emoji:'🎸', word:'Xylophone',starts:true },
      { emoji:'❌', word:'X Mark',   starts:true },
      { emoji:'📦', word:'X-Ray Box',starts:true },
    ],
    quiz:[
      { emoji:'🎸', word:'Xylophone',starts:true  },
      { emoji:'❌', word:'X Mark',   starts:true  },
      { emoji:'📦', word:'X-Ray',    starts:true  },
      { emoji:'🌟', word:'Star',     starts:false },
    ],
  },
  {
    letter:'Y', uppercase:'Y', lowercase:'y', phoneme:'/y/',
    color:'#ca8a04', bg:'linear-gradient(135deg,#fef9c3,#fef08a,#fde047)',
    examples:[
      { emoji:'🧶', word:'Yarn',   starts:true },
      { emoji:'🪀', word:'Yo-yo',  starts:true },
      { emoji:'🍋', word:'Yellow', starts:true },
    ],
    quiz:[
      { emoji:'🧶', word:'Yarn',    starts:true  },
      { emoji:'🪀', word:'Yo-yo',   starts:true  },
      { emoji:'🍋', word:'Yellow',  starts:true  },
      { emoji:'🐙', word:'Octopus', starts:false },
    ],
  },
  {
    letter:'Z', uppercase:'Z', lowercase:'z', phoneme:'/z/',
    color:'#0f766e', bg:'linear-gradient(135deg,#ccfbf1,#a7f3d0,#34d399)',
    examples:[
      { emoji:'🦓', word:'Zebra', starts:true },
      { emoji:'⚡', word:'Zap',   starts:true },
      { emoji:'🎉', word:'Zoom',  starts:true },
    ],
    quiz:[
      { emoji:'🦓', word:'Zebra', starts:true  },
      { emoji:'⚡', word:'Zap',   starts:true  },
      { emoji:'🎉', word:'Zoom',   starts:true  },
      { emoji:'🌷', word:'Tulip', starts:false },
    ],
  },
];

/** Quick lookup: letter → LetterData */
export const LETTER_MAP = new Map<string, LetterData>(
  ALPHABET_DATA.map(d => [d.letter, d])
);

// ─── Daily life object categories used in the intro module ───────────────────
export interface DailyObject {
  emoji:    string;
  word:     string;
  category: string;
}

export const DAILY_CATEGORIES: { label: string; emoji: string; color: string; bg: string; objects: DailyObject[] }[] = [
  {
    label: 'At Home', emoji: '🏠', color: '#d97706',
    bg: 'linear-gradient(135deg,#fef3c7,#fcd34d)',
    objects: [
      { emoji:'🪭', word:'Fan',    category:'home' },
      { emoji:'💡', word:'Lamp',   category:'home' },
      { emoji:'📺', word:'TV',     category:'home' },
      { emoji:'⏰', word:'Clock',  category:'home' },
      { emoji:'🪑', word:'Chair',  category:'home' },
      { emoji:'📚', word:'Books',  category:'home' },
    ],
  },
  {
    label: 'Outside', emoji: '🌳', color: '#16a34a',
    bg: 'linear-gradient(135deg,#dcfce7,#86efac)',
    objects: [
      { emoji:'🌙', word:'Moon',   category:'nature' },
      { emoji:'☀️', word:'Sun',    category:'nature' },
      { emoji:'⭐', word:'Stars',  category:'nature' },
      { emoji:'🌈', word:'Rainbow',category:'nature' },
      { emoji:'⛅', word:'Cloud',  category:'nature' },
      { emoji:'🌲', word:'Tree',   category:'nature' },
    ],
  },
  {
    label: 'Food', emoji: '🍎', color: '#e11d48',
    bg: 'linear-gradient(135deg,#fce7f3,#fda4af)',
    objects: [
      { emoji:'🍎', word:'Apple',  category:'food' },
      { emoji:'🍌', word:'Banana', category:'food' },
      { emoji:'🍊', word:'Orange', category:'food' },
      { emoji:'🥦', word:'Broccoli',category:'food'},
      { emoji:'🥕', word:'Carrot', category:'food' },
      { emoji:'🍇', word:'Grapes', category:'food' },
    ],
  },
  {
    label: 'Animals', emoji: '🐾', color: '#7c3aed',
    bg: 'linear-gradient(135deg,#ede9fe,#c4b5fd)',
    objects: [
      { emoji:'🐕', word:'Dog',    category:'animal' },
      { emoji:'🐱', word:'Cat',    category:'animal' },
      { emoji:'🐦', word:'Bird',   category:'animal' },
      { emoji:'🐄', word:'Cow',    category:'animal' },
      { emoji:'🐘', word:'Elephant',category:'animal'},
      { emoji:'🦁', word:'Lion',   category:'animal' },
    ],
  },
  {
    label: 'Transport', emoji: '🚗', color: '#0369a1',
    bg: 'linear-gradient(135deg,#e0f2fe,#7dd3fc)',
    objects: [
      { emoji:'🚗', word:'Car',      category:'transport' },
      { emoji:'🚌', word:'Bus',      category:'transport' },
      { emoji:'✈️', word:'Airplane', category:'transport' },
      { emoji:'🚂', word:'Train',    category:'transport' },
      { emoji:'🚲', word:'Bicycle',  category:'transport' },
      { emoji:'🚢', word:'Ship',     category:'transport' },
    ],
  },
];
