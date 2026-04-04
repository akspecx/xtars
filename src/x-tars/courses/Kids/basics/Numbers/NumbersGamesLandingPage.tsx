import React from 'react';
import KidsModuleLandingPage, { KidsGameEntry } from '../../../CommonUtility/KidsModuleLandingPage';

const numbersData: KidsGameEntry[] = [
  { id: 'Introduction',        title: 'Starting with Numbers',     subtitle: 'Introduction to numbers',                  icon: '1️⃣', path: '/games/numbers/introduction',       gradient: 'from-indigo-500 to-purple-500' },
  { id: 'Association',         title: 'Associate Objects',         subtitle: 'How many objects are there?',              icon: '🤗', path: '/games/numbers/association',        gradient: 'from-indigo-400 to-blue-500' },
  { id: 'identification',      title: 'Match the Numbers',         subtitle: 'Identify and match numbers',               icon: '🍎', path: '/games/numbers/identification',     gradient: 'from-rose-500 to-orange-500' },
  { id: 'counting',            title: 'Count On Your Body',        subtitle: 'Learn numbers with body examples',         icon: '🤗', path: '/games/numbers/counting',           gradient: 'from-rose-500 to-amber-500' },
  { id: 'tracing',             title: 'Trace the Numbers',         subtitle: 'Practice drawing numbers',                 icon: '✍️', path: '/games/numbers/tracing',            gradient: 'from-sky-500 to-blue-500' },
  { id: 'sequence',            title: 'Number Train Sequence',     subtitle: 'Arrange train coaches in order',           icon: '🚂', path: '/games/numbers/sequence',           gradient: 'from-orange-500 to-amber-500' },
  { id: 'filltheblank',        title: 'Fill in the Blanks',        subtitle: 'Drag and drop missing numbers',            icon: '🔢', path: '/games/numbers/fill-the-blanks',    gradient: 'from-lime-500 to-green-500' },
  { id: 'descending',          title: 'Descending Order Train',    subtitle: 'Place coaches in descending order',        icon: '🚃', path: '/games/numbers/descending',         gradient: 'from-cyan-500 to-blue-500' },
  { id: 'dot-dash',            title: 'Dot Dash Rockets',          subtitle: 'Subitize 1–5 dots (Age 3–4)',              icon: '🚀', path: '/games/numbers/dot-dash-rockets',   gradient: 'from-sky-500 to-indigo-500' },
  { id: 'ladybug',             title: 'Ladybug Spots Match',       subtitle: 'Match spots to numbers (Age 3–4)',         icon: '🐞', path: '/games/numbers/ladybug-spots',      gradient: 'from-emerald-500 to-lime-500' },
  { id: 'cleanup',             title: 'Clean-Up Count',            subtitle: 'Sort toys and count (Age 3–4)',            icon: '🧸', path: '/games/numbers/cleanup-count',      gradient: 'from-teal-500 to-cyan-500' },
  { id: 'more',                title: 'Learn what is More',        subtitle: 'Which one is more? (Age 3–4)',             icon: '🧺', path: '/games/numbers/more',               gradient: 'from-amber-500 to-rose-500' },
  { id: 'less',                title: 'Learn what is Less',        subtitle: 'Find the less (Age 3–4)',                  icon: '🧺', path: '/games/numbers/less',               gradient: 'from-amber-400 to-orange-500' },
  { id: 'zero-hero',           title: 'Zero the Hero',             subtitle: 'Learn about zero (Age 3–4)',               icon: '🦸', path: '/games/numbers/zero-hero',          gradient: 'from-purple-500 to-pink-500' },
  { id: 'pizza-party',         title: 'Pizza Party Sharing',       subtitle: 'Share pizza fairly (Age 3–4)',             icon: '🍕', path: '/games/numbers/pizza-party',        gradient: 'from-orange-500 to-red-500' },
  { id: 'coin-collector',      title: 'Coin Collector',            subtitle: 'Sort and recognize coins (Age 3–4)',       icon: '🪙', path: '/games/numbers/coin-collector',     gradient: 'from-yellow-500 to-amber-500' },
  { id: 'understanding-equal', title: 'Understanding Equal',       subtitle: 'Learn about equal numbers (Age 3–4)',      icon: '⚖️', path: '/games/numbers/understanding-equal', gradient: 'from-blue-500 to-indigo-500' },
  { id: 'bridge',              title: 'Number Bridge Builder',     subtitle: 'Fill missing stones (Age 4–5)',            icon: '🌉', path: '/games/numbers/number-bridge',      gradient: 'from-blue-500 to-cyan-500' },
  { id: 'pattern-train',       title: 'Pattern Train Cars',        subtitle: 'Complete patterns (Age 4–5)',              icon: '🚃', path: '/games/numbers/pattern-train-cars', gradient: 'from-fuchsia-500 to-purple-500' },
  { id: 'snack-sharing',       title: 'Snack Sharing Party',       subtitle: 'Share snacks fairly (Age 4–5)',            icon: '🧁', path: '/games/numbers/snack-sharing-party', gradient: 'from-rose-500 to-orange-500' },
  { id: 'ordinal-race',        title: 'Ordinal Race Track',        subtitle: 'Learn 1st, 2nd, 3rd (Age 4–5)',          icon: '🏁', path: '/games/numbers/ordinal-race',       gradient: 'from-blue-500 to-purple-500' },
  { id: 'shape-puzzles',       title: 'Shape Number Puzzles',      subtitle: 'Count sides and corners (Age 4–5)',       icon: '🔷', path: '/games/numbers/shape-puzzles',      gradient: 'from-purple-500 to-pink-500' },
  { id: 'clock-time',          title: 'Clock Tower Time',          subtitle: 'Learn to tell time (Age 4–5)',             icon: '🕐', path: '/games/numbers/clock-time',         gradient: 'from-sky-500 to-blue-500' },
  { id: 'number-detective',    title: 'Number Detective',          subtitle: 'Find numbers in scenes (Age 4–5)',        icon: '🔍', path: '/games/numbers/number-detective',   gradient: 'from-indigo-500 to-purple-500' },
  { id: 'ten-frame',           title: 'Ten-Frame Garden',          subtitle: 'Plant seeds in a ten-frame (Age 5–6)',    icon: '🌼', path: '/games/numbers/ten-frame-garden',   gradient: 'from-emerald-500 to-lime-500' },
  { id: 'add-animals',         title: 'Add the Animals',           subtitle: 'Count animals altogether (Age 5–6)',      icon: '🐑', path: '/games/numbers/add-the-animals',    gradient: 'from-sky-500 to-emerald-500' },
  { id: 'bonds',               title: 'Number Bonds Bubbles',      subtitle: 'Find pairs to make a number (Age 5–6)',   icon: '💭', path: '/games/numbers/number-bonds-bubbles', gradient: 'from-cyan-500 to-indigo-500' },
  { id: 'jumping-frogs',       title: 'Jumping Frogs',             subtitle: 'Skip-count by 2s and 5s (Age 5–6)',      icon: '🐸', path: '/games/numbers/jumping-frogs',      gradient: 'from-green-500 to-teal-500' },
  { id: 'fill-bucket',         title: 'Fill the Bucket',           subtitle: 'Experiment with capacity (Age 5–6)',      icon: '🪣', path: '/games/numbers/fill-the-bucket',    gradient: 'from-sky-500 to-blue-500' },
  { id: 'subtract-snacks',     title: 'Subtract the Snacks',       subtitle: 'Learn subtraction (Age 5–6)',             icon: '🍪', path: '/games/numbers/subtract-snacks',    gradient: 'from-orange-500 to-red-500' },
  { id: 'measure-monsters',    title: 'Measure the Monsters',      subtitle: 'Compare heights (Age 5–6)',               icon: '📏', path: '/games/numbers/measure-monsters',   gradient: 'from-green-500 to-teal-500' },
  { id: 'number-jumper',       title: 'Number Line Jumper',        subtitle: 'Jump forward and backward (Age 5–6)',     icon: '🦘', path: '/games/numbers/number-jumper',      gradient: 'from-lime-500 to-green-500' },
];

const NumbersGamesLandingPage: React.FC<{ onBack?: () => void }> = ({ onBack }) => (
  <KidsModuleLandingPage
    moduleTitle="Numbers"
    moduleEmoji="🔢"
    headerGradient="from-indigo-500 to-purple-600"
    bgColor="#f0f0ff"
    games={numbersData}
    onBack={onBack}
  />
);

export default NumbersGamesLandingPage;
