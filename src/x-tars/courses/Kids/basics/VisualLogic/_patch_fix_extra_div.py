"""
Remove the stray extra closing </div> that appears after the new header.
Pattern: right after mute button's outer div closes, there's one extra </div>.
"""
import re, pathlib

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

# The new header ends with: 
#   </div>     ← closes the dot-map div
# </div>       ← closes the outer header div
# Then there should NOT be another </div> right after.

# Pattern: correct header ending followed by extra </div>
STRAY_DIV = re.compile(
    r'(          \{game\.isMuted \? <VolumeX[^\n]+\n'
    r'          \}\}\n'
    r'          </button>\n'
    r'        </div>\n'
    r'      </div>)\n'
    r'      </div>',
)

ok = []
fail = []

for fname in FILES:
    path = BASE / fname
    if not path.exists():
        fail.append(f"{fname}: NOT FOUND")
        continue

    text = path.read_text()
    new_text, n = STRAY_DIV.subn(r'\1', text)
    if n > 0:
        path.write_text(new_text)
        ok.append(f"{fname}: fixed (n={n})")
    else:
        fail.append(f"{fname}: pattern not matched")

print("=== FIXED ===")
for m in ok: print(" ", m)
print("=== SKIPPED ===")
for m in fail: print(" ", m)
