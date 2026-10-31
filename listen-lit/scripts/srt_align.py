#!/usr/bin/env python3
"""Cale chaque mot du script sur la voix à partir d'un SRT (transcription Premiere/DaVinci de la voix
d'ORIGINE, assets/transcript/vo.srt). Le texte reste celui du script ; le SRT ne fournit que les temps.
1) alignement de séquence mots du SRT ↔ mots du script (le SRT peut contenir des erreurs de transcription) ;
2) chaque sous-titre donne un ancrage début/fin, resserré sur la parole réelle (détection d'énergie) ;
3) entre deux ancrages, les mots sont répartis au prorata des syllabes sur le temps de PAROLE uniquement.
Écrit start/end/words dans timeline.base.json. Usage : python3 scripts/srt_align.py && python3 scripts/breathe.py && npm run sync"""
import json, re, subprocess, unicodedata, difflib
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
BASE = ROOT / "timeline.base.json"
T = json.loads(BASE.read_text())
SRT = (ROOT / "assets/transcript/vo.srt").read_text(encoding="utf-8-sig")

def ts(s):
    h, m, r = s.split(":"); sec, ms = r.split(",")
    return int(h) * 3600 + int(m) * 60 + int(sec) + int(ms) / 1000
cues = []
for block in re.split(r"\n\s*\n", SRT.strip()):
    lines = block.strip().splitlines()
    tl_ = next(l for l in lines if "-->" in l)
    a, b = [ts(x.strip()) for x in tl_.split("-->")]
    text = " ".join(lines[lines.index(tl_) + 1:])
    cues.append((a, b, text))
# la transcription Premiere « normalise » (chiffres, « ne », « appli »…) : on la ramène au vocabulaire du script AVANT l'appariement des mots
ALIASES = [tuple(x) for x in T.get("aliases", [])] or [(r"\b0 h 34\b", "minuit trente quatre"), (r"\bce n'est\b", "c'est")]
def fix_cue(t):
    for pat, rep in ALIASES: t = re.sub(pat, rep, t, flags=re.I)
    return t
cues = [(a, b, fix_cue(t)) for a, b, t in cues]

def norm(w):
    w = unicodedata.normalize("NFD", w.lower())
    w = "".join(c for c in w if unicodedata.category(c) != "Mn")
    return re.sub(r"[^a-z0-9']", "", w)
def words_of(text):
    out = []
    for tok in text.split():
        if re.fullmatch(r"[:;!?»]", tok) and out: out[-1] += " " + tok
        else: out.append(tok)
    return out
VOW = re.compile(r"[aeiouyàâäéèêëîïôöùûüœæ]+", re.I)
def syl(w):
    c = re.sub(r"[^a-zàâäéèêëîïôöùûüœæç'-]", "", w.lower()); k = len(VOW.findall(c))
    if k > 1 and re.search(r"[^aeiouy]es?$", c): k -= 1
    return max(1, k)

# --- parole réelle (énergie)
raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(ROOT / "assets/audio/vo_norm.mp3"), "-ac", "1", "-ar", "16000",
                      "-af", "highpass=f=200,lowpass=f=3000", "-f", "s16le", "-"], capture_output=True, check=True).stdout
x = np.frombuffer(raw, dtype=np.int16).astype(float) / 32768
e = np.sqrt(np.convolve(x ** 2, np.ones(320) / 320, "same")[::160])
db = np.convolve(20 * np.log10(e + 1e-9), np.ones(3) / 3, "same")
speech = db > -40
def onset(t, lo=0.0, hi=0.45):
    i0, i1 = max(0, int((t + lo) * 100)), min(len(speech) - 1, int((t + hi) * 100))
    for i in range(i0, i1):
        if speech[i] and speech[i + 1]: return i / 100
    return t
def offset(t, lo=-0.5, hi=0.1):
    i0, i1 = max(1, int((t + lo) * 100)), min(len(speech) - 1, int((t + hi) * 100))
    for i in range(i1, i0, -1):
        if speech[i] and speech[i - 1]: return (i + 1) / 100
    return t
cum = np.concatenate([[0], np.cumsum(speech.astype(float))]) / 100  # temps de parole cumulé
def speech_time(t): i = min(len(cum) - 1, max(0, int(t * 100))); return cum[i]
def from_speech_time(st, a, b):
    i0, i1 = int(a * 100), int(b * 100)
    idx = np.searchsorted(cum[i0:i1 + 1], st, side="left")
    return (i0 + idx) / 100

# --- alignement des séquences
SW = [(li, w) for li, l in enumerate(T["vo"]) for w in words_of(l["text"])]
CW = [(ci, p) for ci, (a, b, t) in enumerate(cues) for w in t.split() for p in w.split("-") if norm(p)]
# mots composés comparés partie par partie (« Rends-toi » → rends + toi)
SP = [(i, p) for i, (_, w) in enumerate(SW) for p in w.split("-") if norm(p)]
sm = difflib.SequenceMatcher(None, [norm(p) for _, p in SP], [norm(w) for _, w in CW], autojunk=False)
s2c, cw_matched = {}, set()
for blk in sm.get_matching_blocks():
    for k in range(blk.size):
        wi = SP[blk.a + k][0]
        s2c.setdefault(wi, CW[blk.b + k][0]); cw_matched.add(blk.b + k)
def trailing_unmatched(c):  # le sous-titre c finit-il par des mots non reconnus ?
    idx = [k for k, (ci, _) in enumerate(CW) if ci == c]
    return bool(idx) and idx[-1] not in cw_matched
# chaque mot du script hérite du sous-titre de ses voisins appariés
cue_of = [None] * len(SW)
for i in range(len(SW)):
    if i in s2c: cue_of[i] = s2c[i]
for i in range(len(SW)):
    if cue_of[i] is None:
        prev = next((cue_of[j] for j in range(i - 1, -1, -1) if cue_of[j] is not None), 0)
        nxt = next((cue_of[j] for j in range(i + 1, len(SW)) if cue_of[j] is not None), prev)
        first_of_line = i == 0 or SW[i - 1][0] != SW[i][0]
        # mot non apparié (erreur de transcription, trait d'union…) : en début de réplique il rejoint le
        # sous-titre suivant, sinon le précédent
        if prev == nxt or not first_of_line: cue_of[i] = prev
        elif trailing_unmatched(prev): cue_of[i] = prev          # « trois Et c'est » → Essaie reste avec trois
        elif nxt - prev > 1: cue_of[i] = prev + 1               # sous-titre intermédiaire non reconnu (« Rends toi »)
        else: cue_of[i] = nxt
# ancrages : premier mot de chaque sous-titre → début ; fin de groupe → fin
groups = []
for i, c in enumerate(cue_of):
    if not groups or groups[-1][0] != c: groups.append([c, i, i])
    else: groups[-1][2] = i
# souffles (parole entre micro-silences ≥ 80 ms)
segs, i, N = [], 0, len(speech)
while i < N:
    if speech[i]:
        j = i
        while j < N:
            if not speech[j]:
                k = j
                while k < N and not speech[k]: k += 1
                if k - j >= 8 or k >= N: break
                j = k
            else: j += 1
        if j - i >= 5: segs.append((i / 100, j / 100))
        i = j
    else: i += 1
import math
def place(ws, a0, b0):
    """répartit les mots ws sur les souffles de [a0,b0] (programmation dynamique), renvoie les débuts"""
    S = [syl(w) for w in ws]; nW = len(ws)
    loc = [(max(a, a0), min(b, b0)) for a, b in segs if b > a0 + 0.02 and a < b0 - 0.02]
    loc = [(a, b) for a, b in loc if b - a > 0.04] or [(a0, b0)]
    rate = sum(S) / sum(b - a for a, b in loc); nS = len(loc)
    cs = np.concatenate([[0], np.cumsum(S)]); INF = 1e18
    dp = np.full((nS + 1, nW + 1), INF); dp[0][0] = 0; bk = np.zeros((nS + 1, nW + 1), dtype=int)
    for si in range(1, nS + 1):
        a, b = loc[si - 1]; d = b - a
        for w in range(nW + 1):
            best, arg = dp[si - 1][w] + (1.5 if d > 0.2 else 0.2), w
            for v in range(0, w):
                if dp[si - 1][v] >= INF: continue
                c = dp[si - 1][v] + math.log(((cs[w] - cs[v]) / d) / rate) ** 2 * 3 + (0 if re.search(r"[,:;.!?]$", ws[w - 1]) or w == nW else 0.6)
                if c < best: best, arg = c, v
            dp[si][w], bk[si][w] = best, arg
    assign, w = [], nW
    for si in range(nS, 0, -1):
        v = bk[si][w]
        if v < w: assign.append((si - 1, v, w))
        w = v
    out = [None] * nW
    for si, v, w in assign:
        a, b = loc[si]; tot = cs[w] - cs[v]; acc = 0
        for k in range(v, w): out[k] = a + (b - a) * acc / tot; acc += S[k]
    return out if all(t is not None for t in out) else [a0 + (b0 - a0) * k / nW for k in range(nW)]
times = [None] * len(SW)
for c, i0, i1 in groups:
    a, b, _ = cues[c]
    a2, b2 = onset(a), offset(b)
    if b2 <= a2 + 0.1: a2, b2 = a, b
    for k, t in zip(range(i0, i1 + 1), place([SW[k][1] for k in range(i0, i1 + 1)], a2, b2)):
        times[k] = round(t, 3)
ends = {}
for c, i0, i1 in groups: ends[i1] = round(offset(cues[c][1]), 3)
# --- corrections manuelles (le DP place mal quelques mots collés dans un même sous-titre du SRT)
OVERRIDES = {(lid, i): t for lid, i, t in T.get("overrides", [])}   # temps imposés à la main (mot du script mal placé par l'alignement)
END_OVERRIDES = dict(T.get("endOverrides", {}))
gidx = [(l["id"], i) for l in T["vo"] for i in range(len(words_of(l["text"])))]
for k, (lid, i) in enumerate(gidx):
    if (lid, i) in OVERRIDES: times[k] = OVERRIDES[(lid, i)]
# --- groupes de sous-titres : découpés selon la PONCTUATION DU SCRIPT (fin de phrase, virgule), pas selon les cues du SRT ;
# un mot seul ne reste seul que s'il termine une phrase (« Un. », « Deux. », « Évidemment. ») ; trop long (> 6 mots ou > 32 signes) → coupé
WEAK = {"de", "du", "des", "la", "le", "les", "un", "une", "ton", "ta", "tes", "à", "au", "aux", "que", "qui", "pour", "sur", "ce", "c'est", "et", "tu", "te",
        "il", "est", "n'as", "d'y", "n'est", "se", "sa", "son", "mon", "ma", "mes", "t'as", "t'es", "pas", "ne", "t'arrives", "en", "ça", "l'app"}
def split_len(ids):
    ws = [SW[k][1] for k in ids]
    if len(ids) <= 6 and len(" ".join(ws)) <= 32: return [ids]
    best, bp = 1e9, None
    for p in range(2, len(ids) - 1):
        L, R = len(" ".join(ws[:p])), len(" ".join(ws[p:]))
        last = re.sub(r"[^\wàâäéèêëîïôöùûüçœ']", "", ws[p - 1].lower())
        cost = abs(L - R) - (8 if re.search(r"[,;:]$", ws[p - 1]) else 0) + (25 if last in WEAK else 0)
        if cost < best: best, bp = cost, p
    if bp is None: return [ids]
    return split_len(ids[:bp]) + split_len(ids[bp:])
segs = []
k0 = 0
for l in T["vo"]:
    n = len(words_of(l["text"])); cur = []
    for i in range(n):
        cur.append(k0 + i)
        if re.search(r"[.?!,;:]$", SW[k0 + i][1]) or re.search(r" [?!]$", SW[k0 + i][1]) or i == n - 1:
            segs.append(cur); cur = []
    k0 += n
# fusion des mots seuls (sauf fin de phrase) avec le segment suivant de la même réplique
merged = []
for sg in segs:
    if merged and len(sg) == 1 and re.search(r"[.?!]$", SW[sg[0]][1]) and SW[merged[-1][-1]][1].endswith(",") and len(merged[-1]) <= 4 and SW[merged[-1][0]][0] == SW[sg[0]][0]:
        merged[-1] = merged[-1] + sg   # « …la fatigue, ça. » reste ensemble
    elif merged and len(merged[-1]) == 1 and not re.search(r"[.?!]$", SW[merged[-1][0]][1]) and SW[merged[-1][0]][0] == SW[sg[0]][0] and times[sg[0]] - times[merged[-1][0]] < 0.55:
        merged[-1] = merged[-1] + sg
    else: merged.append(sg)
cap_groups = []
for sg in merged: cap_groups += split_len(sg)
cue_first = {i0 for c, i0, i1 in groups}
# les départs de sous-titres qui ne sont pas des débuts de cue se calent sur le début de parole le plus proche (± 0,3 s)
ons = [i / 100 for i in range(6, len(speech) - 1) if speech[i] and not speech[i - 6:i].any()]
for g in cap_groups:
    k = g[0]
    if k in cue_first or k == 0: continue
    cand = [o for o in ons if abs(o - times[k]) <= 0.3 and o > times[k - 1] + 0.04]
    if cand: times[k] = round(min(cand, key=lambda o: abs(o - times[k])), 3)
# un sous-titre affiché moins de 0,45 s est illisible : on le fusionne avec le suivant (≤ 7 mots, ≤ 36 signes) ;
# si la fusion est trop longue, il emprunte les premiers mots du suivant jusqu'à durer 0,45 s
changed = True
while changed:
    changed = False
    for gi in range(len(cap_groups) - 1):
        g, n = cap_groups[gi], cap_groups[gi + 1]
        if times[n[0]] - times[g[0]] >= 0.45 or (len(g) == 1 and re.search(r"[.?!]$", SW[g[0]][1])): continue
        if len(g) + len(n) <= 7 and len(" ".join(SW[k][1] for k in g + n)) <= 36:
            cap_groups[gi:gi + 2] = [g + n]; changed = True; break
        g, n = list(g), list(n)
        while len(n) > 2 and times[n[0]] - times[g[0]] < 0.45: g.append(n.pop(0))
        cap_groups[gi], cap_groups[gi + 1] = g, n
T["capGroups"] = [[list(gidx[k]) for k in g] for g in cap_groups]
# --- écriture
j = 0
for l in T["vo"]:
    n = len(words_of(l["text"]))
    l["words"] = [[SW[k][1], times[k]] for k in range(j, j + n)]
    l["start"] = times[j]
    nxt = times[j + n] if j + n < len(SW) else 999
    l["end"] = END_OVERRIDES.get(l["id"], round(min(ends.get(j + n - 1, times[j + n - 1] + 0.5), nxt - 0.02), 3))
    l.pop("lock", None)
    j += n
BASE.write_text(json.dumps(T, ensure_ascii=False, indent=1) + "\n")
for l in T["vo"]:
    print(l["id"], f"{l['start']:6.2f}-{l['end']:6.2f}", " ".join(f"{w}@{t:.2f}" for w, t in l["words"])[:140])

# --- diagnostic : mots dont le temps sort de l'intervalle de leur sous-titre SRT
for k, c in enumerate(cue_of):
    a, b, _ = cues[c]
    if times[k] < a - 0.15 or times[k] > b + 0.15: print(f"  ⚠ « {SW[k][1]} » à {times[k]:.2f} hors du sous-titre {c} [{a:.2f}-{b:.2f}]")
