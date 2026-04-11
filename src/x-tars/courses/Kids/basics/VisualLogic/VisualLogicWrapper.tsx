import React, { Suspense } from "react";
import { useNavigate } from "react-router";
import { useTheme } from "../../../../../context/ThemeContext";
import { KidsPageHeader } from "../../../CommonUtility/KidsModuleLandingPage";

const VisualLogicLandingPage = React.lazy(() => import("./VisualLogicLandingPage"));
const UnderstandingofSamePictures = React.lazy(() => import("./UnderstandingofSamePictures"));
const UnderstandingOfAbove = React.lazy(() => import("./UnderstandingOfAbove"));
const UnderstandingOfBelow = React.lazy(() => import("./UnderstandingOfBelow"));
const UnderstandingOfAboveAndBelow = React.lazy(() => import("./UnderstandingOfAboveAndBelow"));
const UnderstandingOfTallAndShort = React.lazy(() => import("./UnderstandingOfTallAndShort"));
const UnderstandingOfTall = React.lazy(() => import("./UnderstandingOfTall"));
const UnderstandingOfShort = React.lazy(() => import("./UnderstandingOfShort"));
const UnderstandingOfFullAndEmpty = React.lazy(() => import("./UnderstandingOfFullAndEmpty"));
const UnderstandingOfFull = React.lazy(() => import("./UnderstandingOfFull"));
const UnderstandingOfEmpty = React.lazy(() => import("./UnderstandingOfEmpty"));
const UnderstandingOfDifferent = React.lazy(() => import("./UnderstandingOfDifferent"));
const UnderstandingOfBig = React.lazy(() => import("./UnderstandingOfBig"));
const UnderstandingofSmall = React.lazy(() => import("./UnderstandingofSmall"));
const UnderstandingOfBigAndSmallMix = React.lazy(() => import("./UnderstandingOfBigAndSmallMix"));
const UnderstandingOfInside = React.lazy(() => import("./UnderstandingOfInside"));
const UnderstandingOfOutside = React.lazy(() => import("./UnderstandingOfOutside"));
const UnderstandingOfInsideAndOutsideMix = React.lazy(() => import("./UnderstandingOfInsideAndOutsideMix"));

const LoadingFallback: React.FC = () => (
  <div className="flex h-screen items-center justify-center bg-[#FDFBF7]">
    <div className="text-xl font-bold animate-pulse text-amber-400">Loading…</div>
  </div>
);

// ── Per-game title / emoji lookup ────────────────────────────────────────────

const META: Record<string, { title: string; emoji: string; subtitle: string }> = {
  big:               { title: 'Big',          emoji: '🐘', subtitle: 'Find the big one'    },
  small:             { title: 'Small',        emoji: '🐜', subtitle: 'Find the small one'  },
  'big-small':       { title: 'Big & Small',  emoji: '⚖️', subtitle: 'Mixed size fun'      },
  tall:              { title: 'Tall',         emoji: '🦒', subtitle: 'Who is taller?'      },
  short:             { title: 'Short',        emoji: '🐸', subtitle: 'Who is shorter?'     },
  'tall-short':      { title: 'Tall & Short', emoji: '📏', subtitle: 'Height challenge'    },
  above:             { title: 'Above',        emoji: '☁️', subtitle: 'What is up there?'   },
  below:             { title: 'Below',        emoji: '🌱', subtitle: 'What is down there?' },
  'above-below':     { title: 'Above & Below',emoji: '↕️', subtitle: 'Up and down fun'    },
  inside:            { title: 'Inside',       emoji: '🏠', subtitle: 'In the box'          },
  outside:           { title: 'Outside',      emoji: '🌳', subtitle: 'Out of the box'      },
  'inside-outside':  { title: 'In & Out',     emoji: '📦', subtitle: 'Where is it?'        },
  full:              { title: 'Full',         emoji: '🧃', subtitle: 'All filled up'       },
  empty:             { title: 'Empty',        emoji: '🫙', subtitle: 'Nothing inside'      },
  'full-empty':      { title: 'Full & Empty', emoji: '🥛', subtitle: 'Mixed volume fun'    },
  same:              { title: 'Same',         emoji: '👯', subtitle: 'Match the pictures'  },
  different:         { title: 'Different',    emoji: '🤔', subtitle: 'Spot the odd one'    },
};

// ── Landing page wrapper ─────────────────────────────────────────────────────

export const VisualLogicGamesPageWrapper: React.FC = () => {
  const navigate = useNavigate();
  return (
    <Suspense fallback={<LoadingFallback />}>
      <VisualLogicLandingPage onBack={() => navigate("/games")} />
    </Suspense>
  );
};

// ── Reusable sub-game wrapper with KidsPageHeader ────────────────────────────

interface VLGameProps {
  Component: React.LazyExoticComponent<React.FC<any>>;
  id: string;
}

const VisualLogicGame: React.FC<VLGameProps> = ({ Component, id }) => {
  const navigate = useNavigate();
  const { theme } = useTheme();
  const isDark = theme === 'dark';
  const meta = META[id] ?? { title: 'Visual Logic', emoji: '🧩', subtitle: 'Visual Logic' };

  return (
    <div className={`flex flex-col min-h-screen ${isDark ? 'bg-gray-900' : 'bg-[#FDFBF7]'}`}>
      <KidsPageHeader
        title={meta.title}
        emoji={meta.emoji}
        subtitle={`Visual Logic · ${meta.subtitle}`}
        onBack={() => navigate("/games/visuallogic", { state: { fromProfileSelection: true } })}
      />
      <Suspense fallback={<LoadingFallback />}>
        <Component />
      </Suspense>
    </div>
  );
};

// ── Size-game wrapper: SizeGame owns its own full header, no KidsPageHeader ──

const SizeGameWrapper: React.FC<VLGameProps & { onNext?: string }> = ({ Component, onNext }) => {
  const navigate = useNavigate();
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Component
        onBack={() => navigate('/games/visuallogic', { state: { fromProfileSelection: true } })}
        onNext={onNext ? () => navigate(onNext, { state: { fromProfileSelection: true } }) : undefined}
      />
    </Suspense>
  );
};

// ── Individual game exports ─────────────────────────────────────────────────
// All modules use SizeGameWrapper so the component owns its header (no double header).

/* Big → Small → Mix */
export const VisualLogicBigWrapper:                React.FC = () => <SizeGameWrapper id="big"            Component={UnderstandingOfBig}               onNext="/games/visuallogic/small"             />;
export const VisualLogicSmallWrapper:              React.FC = () => <SizeGameWrapper id="small"          Component={UnderstandingofSmall}             onNext="/games/visuallogic/big-small-mix"     />;
export const VisualLogicBigAndSmallMixWrapper:     React.FC = () => <SizeGameWrapper id="big-small"      Component={UnderstandingOfBigAndSmallMix}    onNext="/games/visuallogic/tall"              />;
/* Tall → Short → Mix → Above */
export const VisualLogicTallWrapper:               React.FC = () => <SizeGameWrapper id="tall"           Component={UnderstandingOfTall}              onNext="/games/visuallogic/short"             />;
export const VisualLogicShortWrapper:              React.FC = () => <SizeGameWrapper id="short"          Component={UnderstandingOfShort}             onNext="/games/visuallogic/tall-short"        />;
export const VisualLogicTallAndShortWrapper:       React.FC = () => <SizeGameWrapper id="tall-short"     Component={UnderstandingOfTallAndShort}      onNext="/games/visuallogic/above"             />;
/* Above → Below → Mix */
export const VisualLogicAboveWrapper:              React.FC = () => <SizeGameWrapper id="above"          Component={UnderstandingOfAbove}             onNext="/games/visuallogic/below"             />;
export const VisualLogicBelowWrapper:              React.FC = () => <SizeGameWrapper id="below"          Component={UnderstandingOfBelow}             onNext="/games/visuallogic/above-below-mix"   />;
export const VisualLogicAboveAndBelowWrapper:      React.FC = () => <SizeGameWrapper id="above-below"    Component={UnderstandingOfAboveAndBelow}     onNext="/games/visuallogic/inside"            />;
export const VisualLogicAboveAndBelowMixWrapper:   React.FC = () => <SizeGameWrapper id="above-below"    Component={UnderstandingOfAboveAndBelow}     onNext="/games/visuallogic/inside"            />;
/* Inside → Outside → Mix */
export const VisualLogicInsideWrapper:             React.FC = () => <SizeGameWrapper id="inside"         Component={UnderstandingOfInside}            onNext="/games/visuallogic/outside"           />;
export const VisualLogicOutsideWrapper:            React.FC = () => <SizeGameWrapper id="outside"        Component={UnderstandingOfOutside}           onNext="/games/visuallogic/inside-outside-mix" />;
export const VisualLogicInsideAndOutsideMixWrapper:React.FC = () => <SizeGameWrapper id="inside-outside" Component={UnderstandingOfInsideAndOutsideMix} onNext="/games/visuallogic/full"            />;
/* Full → Empty → Mix */
export const VisualLogicFullWrapper:               React.FC = () => <SizeGameWrapper id="full"           Component={UnderstandingOfFull}              onNext="/games/visuallogic/empty"             />;
export const VisualLogicEmptyWrapper:              React.FC = () => <SizeGameWrapper id="empty"          Component={UnderstandingOfEmpty}             onNext="/games/visuallogic/full-empty"        />;
export const VisualLogicFullAndEmptyWrapper:       React.FC = () => <SizeGameWrapper id="full-empty"     Component={UnderstandingOfFullAndEmpty}      onNext="/games/visuallogic/same"              />;
/* Same → Different → landing */
export const VisualLogicSameWrapper:               React.FC = () => <SizeGameWrapper id="same"           Component={UnderstandingofSamePictures}      onNext="/games/visuallogic/different"         />;
export const VisualLogicDifferentWrapper:          React.FC = () => <SizeGameWrapper id="different"      Component={UnderstandingOfDifferent}         />;


