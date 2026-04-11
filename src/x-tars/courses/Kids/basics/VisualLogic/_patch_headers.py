"""
Batch-update all 17 Understanding*.tsx game modules:
  1. Replace colored header (bg=ACCENT) → white header with "X or Y?" + dots
  2. Remove the old "Title + dots" section entirely
  3. Remove colored background / border from Card area div
"""
import re, pathlib, sys

BASE = pathlib.Path(__file__).parent

FILES = [
    "UnderstandingOfBig.tsx",
    "UnderstandingofSmall.tsx",
    "UnderstandingOfBigAndSmallMix.tsx",
    "UnderstandingOfTall.tsx",
    "UnderstandingOfShort.tsx",
    "UnderstandingOfTallAndShort.tsx",
    "UnderstandingOfAbove.tsx",
    "UnderstandingOfBelow.tsx",
    "UnderstandingOfAboveAndBelow.tsx",
    "UnderstandingOfInside.tsx",
    "UnderstandingOfOutside.tsx",
    "UnderstandingOfInsideAndOutsideMix.tsx",
    "UnderstandingOfFull.tsx",
    "UnderstandingOfEmpty.tsx",
    "UnderstandingOfFullAndEmpty.tsx",
    "UnderstandingofSamePictures.tsx",
    "UnderstandingOfDifferent.tsx",
]

NEW_HEADER = """\
      {/* Header */}
      <div className="flex items-center gap-2 px-4 flex-none bg-white border-b border-gray-200 shadow-sm"
        style={{ paddingTop: 'env(safe-area-inset-top, 14px)', paddingBottom: 14 }}>
        {onBack && (
          <motion.button whileTap={{ scale: 0.85 }} onClick={onBack}
            className="w-9 h-9 flex items-center justify-center text-gray-700 flex-none">
            <ChevronLeft size={24} strokeWidth={2.5} />
          </motion.button>
        )}
        <p className="flex-1 text-center font-black text-lg text-gray-800">
          {PRIMARY_LBL} or {SECONDARY_LBL}?
        </p>
        <div className="flex items-center gap-1.5 flex-none">
          {game.sessionPairs.slice(0, 8).map((_, i) => (
            <motion.div key={i} animate={{ scale: i === game.pairIdx ? 1.3 : 1 }}
              className="rounded-full transition-all"
              style={{
                width: i === game.pairIdx ? 10 : 7,
                height: i === game.pairIdx ? 10 : 7,
                background: i < game.pairIdx ? '#3B82F6' : i === game.pairIdx ? '#1D4ED8' : '#CBD5E1',
              }} />
          ))}
          <button onClick={() => game.setIsMuted(!game.isMuted)} className="w-9 h-9 flex items-center justify-center ml-1">
            {game.isMuted ? <VolumeX size={18} className="text-gray-400" /> : <Volume2 size={18} className="text-gray-600" />}
          </button>
        </div>
      </div>"""

# Pattern: old colored header + title/dots block (handles "dots" or "progress dots")
HEADER_PATTERN = re.compile(
    r'      \{/\* Header \*/\}\n'
    r'      <div className="flex items-center gap-3 px-4 flex-none"\n'
    r'        style=\{\{ background: ACCENT,.*?\}\}>\n'
    r'.*?'              # everything inside header
    r'      </div>\n'   # closing </div> of header
    r'\n'
    r'      \{/\* Title \+ (?:progress )?dots \*/\}\n'
    r'      <div className="flex-none pt-3 pb-2 px-4 text-center">\n'
    r'.*?'
    r'      </div>',
    re.DOTALL,
)

# Pattern: card area with colored bg/border  → just clean flex container
CARD_AREA_PATTERN = re.compile(
    r'      <div className="flex-1 flex flex-col items-center justify-center mx-4 mt-1 mb-3 rounded-3xl min-h-0"\n'
    r'        style=\{\{ background: colorMode === \'dark\' \? theme\.areaBg : AREA_BG, border: `2px solid \$\{colorMode === \'dark\' \? theme\.areaRing : AREA_RING\}`'
    r' \}\}>',
)

CARD_AREA_NEW = '      <div className="flex-1 flex flex-col items-center justify-center min-h-0">'

ok = []
fail = []

for fname in FILES:
    path = BASE / fname
    if not path.exists():
        fail.append(f"{fname}: NOT FOUND")
        continue

    text = path.read_text()
    orig = text

    # 1. Replace old header + title+dots with new clean header
    new_text, n1 = HEADER_PATTERN.subn(NEW_HEADER, text)
    if n1 == 0:
        fail.append(f"{fname}: header pattern NOT MATCHED")
        # still try card area
    text = new_text

    # 2. Replace card area colored bg
    new_text, n2 = CARD_AREA_PATTERN.subn(CARD_AREA_NEW, text)
    if n2 == 0:
        fail.append(f"{fname}: card area pattern NOT MATCHED")
    text = new_text

    if text != orig:
        path.write_text(text)
        ok.append(f"{fname}: OK (header={n1}, card={n2})")
    else:
        fail.append(f"{fname}: NO CHANGES (patterns not found)")

print("=== SUCCESS ===")
for m in ok: print(" ", m)
print("=== FAILED ===")
for m in fail: print(" ", m)
