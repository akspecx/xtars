"""Fix stray </div> in the 5 files that had no card area comment."""
import pathlib

BASE = pathlib.Path(__file__).parent

FILES5 = [
    "UnderstandingofSmall.tsx", "UnderstandingOfBigAndSmallMix.tsx",
    "UnderstandingOfTall.tsx", "UnderstandingOfShort.tsx", "UnderstandingOfTallAndShort.tsx",
]

OLD = '      </div>\n      </div>\n      <div className="flex-1'
NEW = '      </div>\n      <div className="flex-1'

ok, fail = [], []
for fname in FILES5:
    p = BASE / fname
    t = p.read_text()
    if OLD in t:
        p.write_text(t.replace(OLD, NEW, 1))
        ok.append(fname)
    else:
        fail.append(f"{fname}: pattern not found")

print("FIXED:", ok)
print("SKIP:", fail)
