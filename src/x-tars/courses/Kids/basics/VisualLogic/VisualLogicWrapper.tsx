import React, { Suspense } from "react";
import { useNavigate } from "react-router";
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
  const meta = META[id] ?? { title: 'Visual Logic', emoji: '🧩', subtitle: 'Visual Logic' };

  return (
    <div className="flex flex-col min-h-screen bg-[#FDFBF7]">
      <KidsPageHeader
        title={meta.title}
        emoji={meta.emoji}
        subtitle={`Visual Logic · ${meta.subtitle}`}
        onBack={() => navigate("/games/visuallogic")}
      />
      <Suspense fallback={<LoadingFallback />}>
        <Component />
      </Suspense>
    </div>
  );
};

// ── Size-game wrapper: SizeGame owns its own full header, no KidsPageHeader ──

const SizeGameWrapper: React.FC<VLGameProps> = ({ Component }) => {
  const navigate = useNavigate();
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Component onBack={() => navigate("/games/visuallogic")} />
    </Suspense>
  );
};

// ── Individual game exports ───────────────────────────────────────────────────

export const VisualLogicSameWrapper:              React.FC = () => <VisualLogicGame id="same"           Component={UnderstandingofSamePictures}          />;
export const VisualLogicAboveAndBelowWrapper:     React.FC = () => <VisualLogicGame id="above-below"    Component={UnderstandingOfAboveAndBelow}         />;
export const VisualLogicTallAndShortWrapper:      React.FC = () => <VisualLogicGame id="tall-short"     Component={UnderstandingOfTallAndShort}          />;
export const VisualLogicTallWrapper:              React.FC = () => <VisualLogicGame id="tall"           Component={UnderstandingOfTall}                  />;
export const VisualLogicShortWrapper:             React.FC = () => <VisualLogicGame id="short"          Component={UnderstandingOfShort}                 />;
export const VisualLogicFullAndEmptyWrapper:      React.FC = () => <VisualLogicGame id="full-empty"     Component={UnderstandingOfFullAndEmpty}          />;
export const VisualLogicFullWrapper:              React.FC = () => <VisualLogicGame id="full"           Component={UnderstandingOfFull}                  />;
export const VisualLogicEmptyWrapper:             React.FC = () => <VisualLogicGame id="empty"          Component={UnderstandingOfEmpty}                 />;
export const VisualLogicDifferentWrapper:         React.FC = () => <VisualLogicGame id="different"      Component={UnderstandingOfDifferent}             />;
/* Big / Small / Mix — own integrated header, no KidsPageHeader wrapper */
export const VisualLogicBigWrapper:               React.FC = () => <SizeGameWrapper id="big"            Component={UnderstandingOfBig}                   />;
export const VisualLogicSmallWrapper:             React.FC = () => <SizeGameWrapper id="small"          Component={UnderstandingofSmall}                 />;
export const VisualLogicBigAndSmallMixWrapper:    React.FC = () => <SizeGameWrapper id="big-small"      Component={UnderstandingOfBigAndSmallMix}        />;
export const VisualLogicAboveWrapper:             React.FC = () => <VisualLogicGame id="above"          Component={UnderstandingOfAbove}                 />;
export const VisualLogicBelowWrapper:             React.FC = () => <VisualLogicGame id="below"          Component={UnderstandingOfBelow}                 />;
export const VisualLogicAboveAndBelowMixWrapper:  React.FC = () => <VisualLogicGame id="above-below"    Component={UnderstandingOfAboveAndBelow}         />;
export const VisualLogicInsideWrapper:            React.FC = () => <VisualLogicGame id="inside"         Component={UnderstandingOfInside}                />;
export const VisualLogicOutsideWrapper:           React.FC = () => <VisualLogicGame id="outside"        Component={UnderstandingOfOutside}               />;
export const VisualLogicInsideAndOutsideMixWrapper: React.FC = () => <VisualLogicGame id="inside-outside" Component={UnderstandingOfInsideAndOutsideMix} />;


