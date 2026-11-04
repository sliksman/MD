#!/usr/bin/env python3
"""Sound design de « Chauve-souris » : stems séparés (WAV 48 kHz, 24 bits, stéréo, pleine durée, calés à 0), synthétisés en numpy.
Chaque famille de sons = une piste, au niveau de mix voulu (la voix, 01_voix.wav, reste la référence à 0 dB). Tous les évènements sont accrochés
aux mots de la voix (timeline.json) et aux débuts de scènes : si le montage bouge, relancer ce script suffit.
Écrit out/stems/*.wav, out/sound-design.json et out/stems/LISEZMOI-sound-design.md.   Usage : python3 scripts/sounddesign.py (après python3 scripts/stems.py)
Sons SYNTHÉTIQUES : à remplacer par de vrais enregistrements ; pas de pluie ni de musique (règle de la série)."""
import json, subprocess, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SR = 48000
T = json.loads((ROOT / "timeline.json").read_text())
DUR = T["duration"]
N = int(SR * DUR)
OUT = ROOT / "out" / "stems"; OUT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(23)
V = {l["id"]: l["words"] for l in T["vo"]}
SC = {s["id"]: s for s in T["scenes"]}
def wt(l, i): return V[l][i][1]
def ss(s): return SC[s]["start"]
# ---------------------------------------------------------------- outils
def fft_filter(x, lo=None, hi=None, order=3):
    X = np.fft.rfft(x); f = np.fft.rfftfreq(len(x), 1 / SR); g = np.ones_like(f)
    if lo: g = g / np.sqrt(1 + (lo / np.maximum(f, 1e-9)) ** (2 * order))
    if hi: g = g / np.sqrt(1 + (f / hi) ** (2 * order))
    return np.fft.irfft(X * g, len(x))
def noise(n, color="white"):
    x = rng.standard_normal(n)
    if color == "white": return x
    X = np.fft.rfft(x); f = np.fft.rfftfreq(n, 1 / SR); f[0] = f[1]
    X = X / (np.sqrt(f) if color == "pink" else f)
    y = np.fft.irfft(X, n); return y / (np.std(y) + 1e-12)
def sm_noise(n, fc):                        # bruit lent (enveloppes aléatoires) normalisé 0..1
    y = fft_filter(rng.standard_normal(n), None, fc, 2); y = (y - y.min()) / (np.ptp(y) + 1e-12); return y
def bell(n, peak=0.5, a=1.6, b=1.2):
    t = np.linspace(0, 1, n); return np.where(t < peak, (t / peak) ** a, ((1 - t) / (1 - peak)) ** b)
def fade(x, a=0.004, b=0.004):
    n = len(x); fa, fb = min(n // 2, int(a * SR)), min(n // 2, int(b * SR))
    if fa: x[:fa] *= np.linspace(0, 1, fa)
    if fb: x[n - fb:] *= np.linspace(1, 0, fb)
    return x
def curve(pts, tt): return np.interp(tt, [p[0] for p in pts], [p[1] for p in pts])
def db(x): return 10 ** (x / 20)
TT = np.arange(N) / SR

class Trk:
    def __init__(self, name, desc, level_db):
        self.name, self.desc, self.level_db = name, desc, level_db
        self.L = np.zeros(N); self.R = np.zeros(N); self.events = []
    def add(self, sig, t0, gain=1.0, pan=0.0, width_ms=0.0, label=""):
        i0 = int(t0 * SR)
        if i0 >= N or i0 + len(sig) <= 0: return
        a = np.cos((pan + 1) * np.pi / 4); b = np.sin((pan + 1) * np.pi / 4)
        s = sig; j0 = 0
        if i0 < 0: s = s[-i0:]; i0 = 0
        n = min(len(s), N - i0); s = s[:n]
        self.L[i0:i0 + n] += s * gain * a
        d = int(width_ms * SR / 1000); n2 = min(n, N - i0 - d)
        if n2 > 0: self.R[i0 + d:i0 + d + n2] += s[:n2] * gain * b
        if label: self.events.append({"t": round(t0, 2), "what": label})
    def full(self, l, r): self.L += l; self.R += r

# ---------------------------------------------------------------- briques sonores
def breath(d_in, d_out, amp=1.0, rasp=0.0, tight=0.0, nasal=1.0):
    """un souffle : inspiration (pic à 75 %) puis expiration (pic à 25 %), bruit mis en forme (voyelle ~ 1,6 kHz)"""
    def seg(d, peak, scale):
        n = int(d * SR); x = rng.standard_normal(n)
        lo, hi = (500, 5200) if tight else (320, 3600)
        y = fft_filter(x, lo, hi, 2) + 0.7 * nasal * fft_filter(x, 1100, 2300, 2) + 0.25 * fft_filter(x, 80, 260, 2)
        if rasp: y = y * (1 + rasp * np.sin(2 * np.pi * 34 * np.arange(n) / SR + 4 * sm_noise(n, 8)))
        return fade(y * bell(n, peak) * scale)
    parts = [seg(d_in, 0.75, 1.0)] if d_in else []
    if d_out: parts.append(seg(d_out, 0.25, 0.8))
    y = np.concatenate(parts) if parts else np.zeros(10)
    return y / (np.max(np.abs(y)) + 1e-9) * amp

def heart_beat(amp=1.0, muffled=False):
    n = int(0.55 * SR); t = np.arange(n) / SR
    def thump(t0, f0, f1, k, a):
        s = np.zeros(n); i = int(t0 * SR); tt = t[: n - i]
        f = f1 + (f0 - f1) * np.exp(-tt * 45); ph = 2 * np.pi * np.cumsum(f) / SR
        s[i:] = np.sin(ph) * np.exp(-tt * k) * (1 - np.exp(-tt * 500)) * a; return s
    y = 0.7 * (thump(0, 62, 40, 26, 1.0) + thump(0.27, 54, 36, 30, 0.62)) + 1.0 * (thump(0, 170, 105, 38, 1.0) + 0.6 * thump(0.27, 150, 95, 42, 1.0))   # le corps à 100-170 Hz s'entend sur un haut-parleur de téléphone
    c = fft_filter(rng.standard_normal(n), 60, 260, 2) * (np.exp(-t * 130) + 0.5 * np.exp(-(t - 0.27).clip(0) * 130) * (t > 0.27)); y += 0.18 * c
    if muffled: y = fft_filter(y, None, 190, 3) * 1.25
    return y * amp

def sub_hit(amp=1.0, dur=0.7, f0=82, f1=36):
    n = int(dur * SR); t = np.arange(n) / SR; f = f1 + (f0 - f1) * np.exp(-t * 14)
    y = 0.6 * np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * 6.5) * (1 - np.exp(-t * 800))
    y += 0.5 * fft_filter(rng.standard_normal(n), 40, 420, 2) * np.exp(-t * 18)
    y += 0.95 * np.sin(2 * np.pi * np.cumsum(70 + 150 * np.exp(-t * 22)) / SR) * np.exp(-t * 11)   # corps 90-220 Hz : audible sur téléphone
    return y * amp

def squelch(amp=1.0, dur=0.35, n_gr=None):
    """humide, étouffé : grains de bulles (glissando descendant) + frottement de gel (bruit 300-1200 Hz)"""
    n = int(dur * SR); y = np.zeros(n + int(0.2 * SR)); n_gr = n_gr or int(rng.integers(4, 9))
    for _ in range(n_gr):
        g0 = int(rng.random() * n); gd = int((0.035 + 0.06 * rng.random()) * SR); tt = np.arange(gd) / SR
        f0, f1 = 180 + 260 * rng.random(), 70 + 50 * rng.random(); f = f1 + (f0 - f1) * np.exp(-tt * 40)
        b = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-tt * 55) * (0.4 + 0.6 * rng.random())
        r = fft_filter(rng.standard_normal(gd), 300, 1300, 2) * np.exp(-tt * 70) * 0.55
        y[g0:g0 + gd] += b + r
    y = fft_filter(y, 45, 1700, 2); return fade(y / (np.max(np.abs(y)) + 1e-9) * amp, 0.01, 0.05)

def rustle(dur=0.5, amp=1.0):
    n = int(dur * SR); x = fft_filter(rng.standard_normal(n), 1400, 9500, 2)
    e = sm_noise(n, 22) ** 2.2 * bell(n, 0.4, 1.0, 1.0); return fade(x * e / (np.max(np.abs(x * e)) + 1e-9) * amp, 0.01, 0.02)

def creak(dur=0.6, amp=1.0, rate=38):
    n = int(dur * SR); imp = np.zeros(n); t = 0.0
    while t < dur:
        imp[int(t * SR)] = rng.random() * 0.6 + 0.4; t += (1 / rate) * (0.7 + 0.6 * rng.random())
    y = fft_filter(imp, 480, 1250, 3) + 0.6 * fft_filter(imp, 1500, 2600, 3)
    y = fft_filter(y, None, 3000, 2) * bell(n, 0.45, 1.2, 1.4); return y / (np.max(np.abs(y)) + 1e-9) * amp

def deep_breath(d, rising, amp=1.0):
    n = int(d * SR); x = fft_filter(noise(n, "brown"), None, 175, 3); t = np.arange(n) / SR
    env = bell(n, 0.72 if rising else 0.22, 1.5, 1.3)
    f = (34 + 10 * np.linspace(0, 1, n)) if rising else (46 - 12 * np.linspace(0, 1, n))
    s = np.sin(2 * np.pi * np.cumsum(f) / SR) * 0.7; air = fft_filter(rng.standard_normal(n), 220, 800, 2) * 0.42
    y = (x / (np.max(np.abs(x)) + 1e-9) * 0.4 + s * 0.5 + air * 1.6) * env; return fade(y / (np.max(np.abs(y)) + 1e-9) * amp, 0.05, 0.1)


# ---------------------------------------------------------------- briques supplémentaires
def whoosh(d, lo=300, hi=3000, amp=1.0, peak=0.5, up=True):
    n = int(d * SR); x = rng.standard_normal(n); out = np.zeros(n); blocks = 24
    for b in range(blocks):
        a0, a1 = b * n // blocks, (b + 1) * n // blocks; f = (b + 0.5) / blocks; c = lo * (hi / lo) ** (f if up else 1 - f)
        seg = fft_filter(x[a0:a1], c * 0.7, c * 1.6, 2); out[a0:a1] = seg
    y = out * bell(n, peak, 1.6, 1.6); return fade(y / (np.max(np.abs(y)) + 1e-9) * amp, 0.01, 0.03)
def blip(f0, f1, d=0.06, amp=1.0, k=40):
    n = int(d * SR); t = np.arange(n) / SR; f = f1 + (f0 - f1) * np.exp(-t * k); y = np.sin(2 * np.pi * np.cumsum(f) / SR) * np.exp(-t * (6 / d)) * (1 - np.exp(-t * 900)); return y * amp
def mix(*sigs):
    n = max(len(x) for x in sigs); out = np.zeros(n)
    for x in sigs: out[:len(x)] += x
    return out
def pop(amp=1.0): return mix(blip(520, 160, 0.07, amp, 60), 0.4 * fft_filter(rng.standard_normal(int(.02 * SR)), 1500, 6000, 2) * np.exp(-np.arange(int(.02 * SR)) / (.004 * SR)) * amp)
def bell_tone(f=523, d=1.8, amp=1.0):
    n = int(d * SR); t = np.arange(n) / SR; y = sum(a * np.sin(2 * np.pi * f * m * t) * np.exp(-t * k) for m, a, k in [(1, 1, 2.2), (2.0, 0.5, 3.0), (3.01, 0.25, 4.5), (4.2, 0.12, 6)])
    return fade(y / (np.max(np.abs(y)) + 1e-9) * amp, 0.002, 0.05)
def crackle(d, dens=60, amp=1.0):
    n = int(d * SR); y = np.zeros(n); t = 0.0
    while t < d:
        k = int((0.002 + rng.random() * 0.006) * SR); i = int(t * SR)
        if i + k < n: y[i:i + k] += fft_filter(rng.standard_normal(k), 800, 7000, 2) * np.exp(-np.arange(k) / (k * 0.3)) * (0.3 + rng.random())
        t += rng.exponential(1 / dens)
    return y / (np.max(np.abs(y)) + 1e-9) * amp
def twinkle(f, d=0.5, amp=1.0):
    n = int(d * SR); t = np.arange(n) / SR; return np.sin(2 * np.pi * f * t) * np.exp(-t * 9) * (1 - np.exp(-t * 800)) * amp


tracks = []
SC_ = {i: ss(f"s{i}") for i in range(1, 16)}
S = lambda i: SC_[i]

# --- 02 AMBIANCE : grotte (écho, goutte), grenier (bois, vent), grotte d'hiver (vent froid), chambre chaude (presque rien)
amb = Trk("02_ambiance-grotte", "L'air des lieux : la grotte (souffle grave, humidité), le grenier chaud et poussiéreux, la grotte d'hiver (vent sourd, froid), la chambre chaude presque silencieuse. Jamais de pluie ni de musique.", -33)
env = curve([(0, .15), (S(2) - .05, .15), (S(2) + .4, .8), (S(5) - .1, .8), (S(5) + .4, 1.0), (S(7) - .1, .7), (S(8), 1.3), (S(9) - .05, 1.3), (S(9) + .4, .5), (S(11), .4), (S(12), .15), (S(13), .45), (S(14) - .05, .2), (S(15), .12), (DUR, .12)], TT)
for ch, a in ((0, amb.L), (1, amb.R)):
    p = fft_filter(noise(N, "pink"), 40, 650, 2); h = np.sin(2 * np.pi * 55 * TT + ch) * 0.05 + np.sin(2 * np.pi * 110.7 * TT) * 0.02
    a += (p / np.std(p) * 0.05 + h) * env
for t in (4.2, 6.9, 14.2):
    amb.add(blip(1900, 1100, .05, .35, 60), t, 1.0, rng.uniform(-.6, .6), 0, "goutte" if t == 4.2 else "")
tracks.append(amb)

# --- 03 RESPIRATION : toi qui dors (début et fin), lent
br = Trk("03_respiration-dormeur", "Le souffle lent de la personne dans le lit : à la fin (chambre, 43,5 → fin) et pendant le plan chaud (35,9 → 38).", -28)
for a0, a1 in ((S(14) + .1, S(14) + 2.0), (S(15) + 1.6, DUR - .2)):
    t = a0
    while t < a1: br.add(breath(1.2, 1.6, .5, nasal=1.0), t, 1.0, 0.0, 0, "souffle calme"); t += 3.6
tracks.append(br)

# --- 04 CHAUVES-SOURIS : ailes, froissements, colonie, mites
bt = Trk("04_chauves-souris", "Ailes de cuir qui se replient (froissement), cliquetis des griffes, colonie qui murmure (« en colonie ») et fantôme qui s'élève (« mourais »). Les cris de sonar sont sur la piste 09.", -26)
bt.add(rustle(.5, .8), 0.45, 1.0, 0.0, 0, "la chauve-souris traverse la lune")
bt.add(rustle(.6, .7), wt("L02", 5) - .2, 1.0, 0.0, 0, "elle se retourne : tête en bas")
bt.add(fft_filter(rng.standard_normal(int(.5 * SR)), 1500, 6000, 2) * bell(int(.5 * SR), .5) * .6, wt("L04", 7) - .1, 1.0, 0, 0, "griffes qui serrent")
bt.add(whoosh(1.5, 150, 1600, .8, .7), wt("L04", 3) + .3, 1.0, 0.0, 8, "le fantôme s'élève")
for i in range(7): bt.add(rustle(.35, .45), wt("L05", 8) - .1 + i * .13, 1.0, rng.uniform(-.8, .8), 0, "colonie" if i == 0 else "")
for i in range(5): bt.add(rustle(.4, .4), wt("L05", 14) - .1 + i * .12, 1.0, rng.uniform(-.8, .8), 0, "grenier" if i == 0 else "")
bt.add(rustle(.5, .5), wt("L12", 6) - .2, 1.0, 0.3, 0, "elle passe à la fenêtre")
tracks.append(bt)

# --- 05 VERROUS : les pieds qui se bloquent
lk = Trk("05_verrous-pieds", "Les pieds qui se verrouillent : petit « clac » métallique sec sur chaque cadenas (« bloquent »), tendon qui se tend (grincement court).", -25)
lk.add(creak(.5, .6, 30), wt("L03", 4) - .1, 1.0, 0, 0, "tendons")
for i in range(3): lk.add(mix(blip(2400, 1500, .03, .6, 90), sub_hit(.35, .15, 160, 90)), wt("L03", 6) + .05 + i * .1, 1.0, [-.5, 0, .5][i], 0, "cadenas" if i == 0 else "")
tracks.append(lk)

# --- 06 THERMOMÈTRE ET FROID : mercure qui chute, givre, vent d'hiver
th = Trk("06_temperature-hiver", "Le mercure qui chute sur « descendre » (glissando descendant), craquement de givre sur la grotte, puis le vent d'hiver (« cinq ou six mois ») et six lunes qui passent (tintements graves).", -26)
th.add(blip(1400, 280, 1.2, .6, 2.5), wt("L06", 3), 1.0, 0, 0, "mercure qui descend")
th.add(crackle(.9, 90, .6), wt("L06", 8), 1.0, 0.0, 0, "givre")
th.add(whoosh(3.2, 150, 1800, .7, .5), wt("L07", 2) - .1, 1.0, 0.0, 14, "vent d'hiver")
for i in range(6): th.add(twinkle(660 + 60 * i, .6, .35), wt("L07", 8) + i * .2, 1.0, rng.uniform(-.5, .5), 0, "lune" if i == 0 else "")
th.add(mix(bell_tone(392, 1.5, .8), sub_hit(.6, .4, 100, 50)), wt("L07", 11), 1.0, 0, 0, "« mois »")
tracks.append(th)

# --- 07 BADGES ET MÉDAILLE : 1, 2, 3 + médaille des champions
bd = Trk("07_badges-medaille", "Les badges 1, 2, 3 (pop + petit tintement) sur chaque « nouvelle », tintements du cadran (16 → 20 h) et fanfare discrète de la médaille + confettis sur « champions ».", -25)
for lbl, t in (("badge 1", wt("L02", 0)), ("badge 2", wt("L05", 0)), ("badge 3", wt("L08", 0))): bd.add(mix(pop(.9), twinkle(1568, .5, .35)), t, 1.0, 0, 0, lbl)
for i in range(8): bd.add(blip(1500 + 40 * i, 1480 + 40 * i, .04, .35, 40), wt("L09", 0) + i * ((wt("L09", 3) - wt("L09", 0)) / 8), 1.0, rng.uniform(-.4, .4), 0, "tic du cadran" if i == 0 else "")
bd.add(mix(bell_tone(784, 1.6, .8), 0.6 * bell_tone(1175, 1.4, .6)), wt("L10", 4), 1.0, 0, 0, "médaille")
for i in range(10): bd.add(twinkle(2000 + 130 * (i % 5), .3, .25), wt("L10", 4) + .1 + i * .07, 1.0, rng.uniform(-.8, .8), 0, "confettis" if i == 0 else "")
tracks.append(bd)

# --- 08 SONAR : cris de chauve-souris, oreilles
so = Trk("08_sonar-oreilles", "« Elle voit le monde avec ses oreilles » : cris de sonar (chirps descendants rapides), échos qui reviennent de la mite et des troncs.", -27)
for i, t in enumerate([wt("L12", 1), wt("L12", 3) - .05, wt("L12", 5) - .1, wt("L12", 6) + .1]):
    so.add(blip(5200, 2600, .09, .5, 30), t, 1.0, [-.5, .3, -.2, .5][i], 0, "cri de sonar")
    so.add(blip(5000, 2500, .09, .2, 30), t + .28, 1.0, [.5, -.3, .2, -.5][i], 0, "écho" if i == 0 else "")
tracks.append(so)

# --- 09 LISTEN NÉON : le téléphone, le néon, les bulles, le globe, la carte
nn = Trk("09_listen-neon", "Seul moment brillant : le téléphone s'allume (« Listen »), le néon s'étend en cercle, trois bulles (forêt, mer, montagne), le globe et ses repères, carillon + « pop » de la carte de fin.", -25)
lis = wt("L14", 1) - .15
nn.add(mix(blip(260, 1300, .5, .6, 4) * 0.6, whoosh(.5, 600, 5000, .4, .8)), lis, 1.0, 0.0, 0, "le téléphone s'allume")
nn.add(whoosh(1.0, 200, 4500, 1.0, .75), wt("L14", 2) - .1, 1.0, 0.0, 8, "le néon s'étend")
for i, t in enumerate([wt("L14", 3), wt("L14", 5), wt("L14", 8)]): nn.add(mix(blip(480 + 130 * i, 820 + 130 * i, .16, .8, 16), 0.3 * crackle(.1, 200, .5)), t + .1, 1.0, [-.5, .5, 0][i], 0, f"bulle {i + 1}")
nn.add(twinkle(1760, .6, .5), wt("L14", 9), 1.0, 0.6, 0, "le globe")
for i, (t, f) in enumerate([(wt("L14", 10), 880), (wt("L14", 12), 1175), (wt("L14", 14), 1568)]): nn.add(bell_tone(f, 1.0, .55), t, 1.0, [.4, .6, .5][i], 0, f"repère {i + 1}")
c0 = wt("L15", 5) + .62
nn.add(mix(bell_tone(523, 2.2, .8), 0.7 * bell_tone(784, 2.0, .6)), c0 + .15, 1.0, 0.0, 0, "carte de fin : carillon"); nn.add(pop(.5), c0 + .85, 1.0, 0.0, 0, "« lien en bio »")
tracks.append(nn)

# --- 10 COUPES : impacts graves courts, ni sur les raccords continus ni sur la carte
ct = Trk("10_coupes", "Impacts graves courts sur les coupes de plan (début de chaque scène sauf le premier plan).", -24)
for i in range(2, 15): ct.add(sub_hit(.45, .5), S(i) - .02, 1.0, 0, 0, "coupe")
tracks.append(ct)

# --- 11 RETOURNEMENT : le lit qui bascule au début, et qui s'endort à la fin
fl = Trk("11_retournement-lit", "Le lit qui se retourne (0,2 → 1,8) : souffle d'air qui tourne, objets qui montent (froissements) ; à la fin, couette qui retombe et petit souffle d'endormissement.", -27)
fl.add(whoosh(1.6, 200, 2800, 1.0, .6), .15, 1.0, 0.0, 8, "le lit se retourne")
for t in (.5, .65, .8, .95): fl.add(rustle(.45, .5), t, 1.0, rng.uniform(-.6, .6), 0, "objet qui monte" if t == .5 else "")
fl.add(deep_breath(1.6, False, .5), S(15) + 1.0, 1.0, 0.0, 6, "elle s'endort")
tracks.append(fl)
# ---------------------------------------------------------------- écriture
def write_wav(path, L, R):
    x = np.clip(np.stack([L, R], 1), -1, 1); i = (x * (2 ** 23 - 1)).astype(np.int32).flatten()
    b = np.zeros((i.size, 3), np.uint8); b[:, 0] = i & 255; b[:, 1] = (i >> 8) & 255; b[:, 2] = (i >> 16) & 255
    with wave.open(str(path), "wb") as w: w.setnchannels(2); w.setsampwidth(3); w.setframerate(SR); w.writeframes(b.tobytes())
mix_L = np.zeros(N); mix_R = np.zeros(N)
voice = OUT / "01_voix.wav"
if voice.exists():
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(voice), "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"], capture_output=True).stdout
    v = np.frombuffer(raw, np.float32).reshape(-1, 2); n = min(N, len(v)); mix_L[:n] += v[:n, 0]; mix_R[:n] += v[:n, 1]
summary = []
for tr_ in tracks:
    pk = max(np.max(np.abs(tr_.L)), np.max(np.abs(tr_.R))) + 1e-9; k = db(tr_.level_db) / pk
    L, R = tr_.L * k, tr_.R * k; write_wav(OUT / f"{tr_.name}.wav", L, R); mix_L += L; mix_R += R
    summary.append({"stem": f"{tr_.name}.wav", "niveau_crete_dBFS": tr_.level_db, "role": tr_.desc, "evenements": tr_.events})
pk = max(np.max(np.abs(mix_L)), np.max(np.abs(mix_R)))
if pk > 0.97: mix_L *= 0.97 / pk; mix_R *= 0.97 / pk
write_wav(OUT / "00_mix-de-reference.wav", mix_L, mix_R)
(ROOT / "out" / "sound-design.json").write_text(json.dumps(summary, ensure_ascii=False, indent=1) + "\n")
md = ["# Sound design « Chauve-souris » — stems séparés", "",
      "Tous les fichiers : WAV 48 kHz, 24 bits, stéréo, pleine durée, calés à 0, au niveau de mix voulu (la voix `01_voix.wav` = référence). `00_mix-de-reference.wav` = voix + toutes les pistes.", "",
      "**Principe** : le sommeil est feutré (grotte, grenier, chambre chaude), puis le néon de Listen est le seul moment brillant. Tout est accroché aux mots de la voix ; si le calage bouge, relancer `scripts/sounddesign.py` suffit.", "",
      "**Ce sont des sons synthétiques** (numpy), conçus pour être remplacés piste par piste par de vrais enregistrements aux mêmes instants (`sound-design.json`).", ""]
for s_ in summary: md += [f"## {s_['stem']}", f"_Crête de piste : {s_['niveau_crete_dBFS']} dBFS._ {s_['role']}", ""] + ([f"- {e['t']:.2f} s — {e['what']}" for e in s_["evenements"] if e["what"]][:12]) + [""]
(OUT / "LISEZMOI-sound-design.md").write_text("\n".join(md))
print("sound design :", len(tracks), "pistes ; pic de la somme", round(float(pk), 3))
