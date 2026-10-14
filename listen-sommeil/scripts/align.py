#!/usr/bin/env python3
"""Aligne les mots du script sur la voix, sans ASR.
1) découpe la voix en « souffles » (parole entre micro-silences ≥ 80 ms, énergie 300–2500 Hz) ;
2) les bornes de chaque réplique (start/end, relevées à la main sur les silences) sont des ancres ;
   dans la fenêtre, programmation dynamique : chaque souffle reçoit un bloc de mots contigu, en
   minimisant l'écart au débit syllabique moyen et en favorisant les coupes sur la ponctuation ;
3) dans un souffle, les mots sont placés au prorata des syllabes.
Écrit "words" de chaque réplique dans timeline.json. Usage : python3 scripts/align.py"""
import json, math, re, subprocess
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
T = json.loads((ROOT / "timeline.json").read_text())
VO = ROOT / T.get("voFile", "assets/audio/vo.mp3")

raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(VO), "-ac", "1", "-ar", "16000",
                      "-af", "highpass=f=200,lowpass=f=3000", "-f", "s16le", "-"], capture_output=True, check=True).stdout
x = np.frombuffer(raw, dtype=np.int16).astype(float) / 32768
hop, win = 160, 320
e = np.sqrt(np.convolve(x ** 2, np.ones(win) / win, "same")[::hop])
db = 20 * np.log10(e + 1e-9)
db = np.convolve(db, np.ones(3) / 3, "same")
TH, MINSIL, MINSEG = -38, 8, 5  # dB, frames de 10 ms
speech = db > TH
segs, i, N = [], 0, len(speech)
while i < N:
    if speech[i]:
        j = i
        while j < N:
            if not speech[j]:
                k = j
                while k < N and not speech[k]:
                    k += 1
                if k - j >= MINSIL or k >= N:
                    break
                j = k
            else:
                j += 1
        if j - i >= MINSEG:
            segs.append((i / 100, j / 100))
        i = j
    else:
        i += 1

VOW = re.compile(r"[aeiouyàâäéèêëîïôöùûüœæ]+", re.I)
def syl(w):
    c = re.sub(r"[^a-zàâäéèêëîïôöùûüœæç'-]", "", w.lower())
    k = len(VOW.findall(c))
    if k > 1 and re.search(r"[^aeiouy]es?$", c):
        k -= 1
    return max(1, k)
def words_of(text):
    out = []
    for tok in text.split():
        if re.fullmatch(r"[:;!?»]", tok) and out:
            out[-1] += " " + tok
        else:
            out.append(tok)
    return out

def cut_cost(w):
    if re.search(r"[,:;.!?]$", w): return 0.0
    return 0.6
# alignement local : les bornes de chaque réplique (start/end) sont des ancres mesurées à la main ;
# à l'intérieur, les mots sont répartis sur les souffles de la fenêtre par programmation dynamique.
all_speech = sum(b - a for a, b in segs)
report = []
for l in T["vo"]:
    if l.get("lock"):
        report.append(f"{l['id']} : verrouillée (calée à la main)"); continue
    ws = words_of(l["text"]); S = [syl(w) for w in ws]; nW = len(ws)
    a0, b0 = l["start"], l["end"]
    loc = [(max(a, a0), min(b, b0)) for a, b in segs if b > a0 + 0.02 and a < b0 - 0.02]
    loc = [(a, b) for a, b in loc if b - a > 0.04]
    if not loc: loc = [(a0, b0)]
    rate = sum(S) / sum(b - a for a, b in loc)
    nS = len(loc); cs = np.concatenate([[0], np.cumsum(S)])
    INF = 1e18
    dp = np.full((nS + 1, nW + 1), INF); dp[0][0] = 0
    bk = np.zeros((nS + 1, nW + 1), dtype=int)
    for si in range(1, nS + 1):
        a, b = loc[si - 1]; d = b - a
        for w in range(nW + 1):
            best, arg = dp[si - 1][w] + (1.5 if d > 0.2 else 0.2), w
            for v in range(0, w):
                if dp[si - 1][v] >= INF: continue
                n = cs[w] - cs[v]
                c = dp[si - 1][v] + math.log((n / d) / rate) ** 2 * 3 + (cut_cost(ws[w - 1]) if w < nW else 0)
                if c < best: best, arg = c, v
            dp[si][w], bk[si][w] = best, arg
    assign, w = [], nW
    for si in range(nS, 0, -1):
        v = bk[si][w]
        if v < w: assign.append((si - 1, v, w))
        w = v
    times = [None] * nW
    for si, v, w in assign:
        a, b = loc[si]; tot = cs[w] - cs[v]; acc = 0
        for k in range(v, w):
            times[k] = a + (b - a) * acc / tot; acc += S[k]
    if any(t is None for t in times):
        report.append(f"{l['id']} : échec, inchangé"); continue
    l["words"] = [[ws[k], round(times[k], 3)] for k in range(nW)]
    report.append(f"{l['id']} {len(loc)} souffle(s) : " + " ".join(f"{w}@{t:.2f}" for w, t in l["words"]))
(ROOT / "timeline.json").write_text(json.dumps(T, ensure_ascii=False, indent=1) + "\n")
print("\n".join(report))
