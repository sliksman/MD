#!/usr/bin/env python3
"""Exporte les pistes son séparées (WAV 48 kHz, pleine durée, calées à 0) depuis out/cues.json :
voix + une piste par famille de bruitages. Volumes = ceux du mix. Usage : python3 scripts/stems.py"""
import json, subprocess
from pathlib import Path
ROOT = Path(__file__).resolve().parent.parent
T = json.loads((ROOT / "timeline.json").read_text()); D = T["duration"]
cues = json.loads((ROOT / "out/cues.json").read_text())
OUT = ROOT / "out/stems"; OUT.mkdir(parents=True, exist_ok=True)
GROUPS = [("02_volets", "wipe"), ("03_mouvements-camera", "cam"), ("03b_reveil", "alarm"), ("04_apparitions-pastilles", "pop"),
          ("05_impacts-chiffres", "hit"), ("06_oreiller", "flop"), ("07_perceuse", "drill")]
def run(args): subprocess.run(["ffmpeg", "-v", "error", "-y"] + args, check=True)
run(["-i", str(ROOT / T["voFile"]), "-af", f"apad,atrim=0:{D}", "-ar", "48000", "-ac", "2", "-c:a", "pcm_s16le", str(OUT / "01_voix.wav")])
for name, prefix in GROUPS:
    ev = [c for c in cues if c["id"].startswith(prefix)]
    if not ev: continue
    ins, fl = [], []
    for i, c in enumerate(ev):
        ins += ["-i", str(ROOT / "assets/sfx" / c["file"])]
        ms = int(round(c["t"] * 1000))
        fl.append(f"[{i}]atrim=0:{c['dur']},aformat=sample_rates=48000:channel_layouts=stereo,volume={c['vol']},adelay={ms}|{ms}[e{i}]")
    fl.append("".join(f"[e{i}]" for i in range(len(ev))) + f"amix=inputs={len(ev)}:normalize=0,apad,atrim=0:{D}[o]")
    run(ins + ["-filter_complex", ";".join(fl), "-map", "[o]", "-ar", "48000", "-c:a", "pcm_s16le", str(OUT / f"{name}.wav")])
    print(name, len(ev), "évènements")
