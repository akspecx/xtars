"""
Patch remaining 5 game modules that have no '{/* Header */}' comment.
"""
import re, pathlib

BASE = pathlib.Path(__file__).parent

FILES = [
    "UnderstandingofSmall.tsx",
    "UnderstandingOfBigAndSmallMix.tsx",
    "UnderstandingOfTall.tsx",
    "UnderstandingOfShort.tsx",
    "UnderstandingOfTallAndShort.tsx",
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

# Pattern without the header comment prefix, also handles missing title+dots comment
HEADER_PATTERN = re.compile(
    r'      <div className="flex items-center gap-3 px-4 flex-none"\n'
    r'        style=\{\{ background: ACCENT,.*?\}\}>\n'
    r'.*?'
    r'      </div>\n'
    r'      <div className="flex-none pt-3 pb-2 px-4 text-center">\n'
    r'.*?'
    r'      </div>',
    re.DOTALL,
)

ok = []
fail = []

for fname in FILES:
    path = BASE / fname
    if not path.exists():
        fail.append(f"{fname}: NOT FOUND")
        continue

    text = path.read_text()
    new_text, n = HEADER_PATTERN.subn(NEW_HEADER, text)
    if n == 0:
        fail.append(f"{fname}: header pattern NOT MATCHED")
    else:
        path.write_text(new_text)
        ok.append(f"{fname}: OK (n={n})")

print("=== SUCCESS ===")
for m in ok: print(" ", m)
print("=== FAILED ===")
for m in fail: print(" ", m)
