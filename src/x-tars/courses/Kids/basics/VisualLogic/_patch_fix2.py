"""Remove stray extra </div> between header close and card area comment."""
import pathlib

BASE = pathlib.Path(__file__).parent

FILES = [
    "UnderstandingOfBig.tsx", "UnderstandingofSmall.tsx", "UnderstandingOfBigAndSmallMix.tsx",
    "UnderstandingOfTall.tsx", "UnderstandingOfShort.tsx", "UnderstandingOfTallAndShort.tsx",
    "UnderstandingOfAbove.tsx", "UnderstandingOfBelow.tsx", "UnderstandingOfAboveAndBelow.tsx",
    "UnderstandingOfInside.tsx", "UnderstandingOfOutside.tsx", "UnderstandingOfInsideAndOutsideMix.tsx",
    "UnderstandingOfFull.tsx", "UnderstandingOfEmpty.tsx", "UnderstandingOfFullAndEmpty.tsx",
    "UnderstandingofSamePictures.tsx", "UnderstandingOfDifferent.tsx",
]

OLD = '      </div>\n      </div>\n\n      {/* Card area */}'
NEW = '      </div>\n\n      {/* Card area */}'

ok, fail = [], []
for fname in FILES:
    p = BASE / fname
    t = p.read_text()
    if OLD in t:
        p.write_text(t.replace(OLD, NEW, 1))
        ok.append(fname)
    else:
        fail.append(f"{fname}: not found")

print("FIXED:", ok)
print("SKIP:", fail)
