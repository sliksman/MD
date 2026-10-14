#!/usr/bin/env python3
"""Respirations : insère des silences dans la voix et génère timeline.json depuis timeline.base.json.
timeline.base.json est écrit dans le temps de la voix d'origine (assets/audio/vo_norm.mp3) ; c'est le
fichier à éditer. Ce script écrit assets/audio/vo_v2.mp3 et timeline.json (tous les temps décalés ;
les coupes de plan et volets posés sur un point de respiration tombent au milieu du silence ajouté).
Usage : python3 scripts/breathe.py && npm run sync"""
import json, subprocess
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
SRC, DST = ROOT / "assets/audio/vo_norm.mp3", ROOT / "assets/audio/vo_v2.mp3"
# (instant dans la voix d'origine, durée ajoutée) — toujours au milieu d'un silence existant
GAPS = [(2.18, 1.6),    # après « Demain, tu te lèves à sept heures. »
        (12.30, 0.9),   # après « trois choses », avant « Un. »
        (27.84, 0.9),   # fin de l'astuce 1, avant « Voilà »
        (54.12, 0.9),   # fin de l'astuce 2, avant « Là, normalement »
        (61.44, 0.7),   # après la perceuse, avant « Trois. »
        (71.60, 0.8)]   # avant « Et toi ? »
TAIL = 1.2

f, parts, prev = [], [], 0.0
for i, (t, g) in enumerate(GAPS):
    f.append(f"[0]atrim={prev}:{t},asetpts=PTS-STARTPTS[a{i}]")
    f.append(f"anullsrc=r=44100:cl=stereo,atrim=0:{g}[s{i}]")
    parts += [f"[a{i}]", f"[s{i}]"]
    prev = t
f.append(f"[0]atrim={prev},asetpts=PTS-STARTPTS[aend]")
f.append(f"anullsrc=r=44100:cl=stereo,atrim=0:{TAIL}[tail]")
parts += ["[aend]", "[tail]"]
f.append("".join(parts) + f"concat=n={len(parts)}:v=0:a=1[out]")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", str(SRC), "-filter_complex", ";".join(f), "-map", "[out]",
                "-ar", "44100", "-ac", "2", "-b:a", "192k", str(DST)], check=True)

def sh(t, mid=False):
    """décale t ; mid=True : un instant posé pile sur un point de respiration va au milieu du silence"""
    out = t
    for p, g in GAPS:
        if abs(t - p) < 1e-6 and mid: out += g / 2
        elif t > p + 1e-6: out += g
    return round(out, 3)

T = json.loads((ROOT / "timeline.base.json").read_text())
T["_doc"] = "GÉNÉRÉ par scripts/breathe.py depuis timeline.base.json — éditer la base, pas ce fichier."
for l in T["vo"]:
    l["start"], l["end"] = sh(l["start"]), sh(l["end"])
    if "words" in l: l["words"] = [[w, sh(t)] for w, t in l["words"]]
for s in T["scenes"]:
    s["start"], s["end"] = sh(s["start"], True), sh(s["end"], True)
T["wipes"] = [sh(t, True) for t in T.get("wipes", [])]
T["captionY"] = [[sh(a, True), sh(b, True) if b < 90 else b, y] for a, b, y in T.get("captionY", [])]
for x in T.get("sfx", []):
    if isinstance(x["at"], (int, float)): x["at"] = sh(x["at"])
    if "until" in x: x["until"] = sh(x["until"])
newdur = float(subprocess.run(["ffprobe", "-v", "error", "-show_entries", "format=duration", "-of", "csv=p=0", str(DST)],
                              capture_output=True, text=True).stdout)
T["voFile"] = "assets/audio/vo_v2.mp3"
T["voDuration"] = round(newdur, 3)
T["duration"] = round(newdur, 2)
T["scenes"][-1]["end"] = T["duration"]
for x in T.get("sfx", []):
    if x["id"] == "pad": x["dur"] = T["duration"]
(ROOT / "timeline.json").write_text(json.dumps(T, ensure_ascii=False, indent=1) + "\n")
print(f"voix → {newdur:.2f}s ; volets {T['wipes']}")
