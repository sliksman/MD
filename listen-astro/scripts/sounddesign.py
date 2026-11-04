#!/usr/bin/env python3
"""Sound design de « Astronaute » : stems séparés (WAV 48 kHz, 24 bits, stéréo, pleine durée, calés à 0), synthétisés en numpy.
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
S2, S3, S4, S5, S6, S7, S8, S9, S10, S11 = (ss(f"s{i}") for i in range(2, 12))

# --- 02 AMBIANCE : l'air de la station (jamais du vide) ; plus dense dans le tunnel, étouffée par les bouchons, presque absente dans la chambre
amb = Trk("02_ambiance-station", "L'air d'une station : souffle grave, bourdonnement de machines. Presque rien dans la chambre du début et de la fin ; dense dans le tunnel (« bruit »), étouffé par les bouchons (« bouchons dans les oreilles » : tout s'assourdit) ; discret pendant les souvenirs de la Terre.", -33)
env = curve([(0, .25), (S2 - .05, .25), (S2 + .3, .7), (S5 - .05, .8), (S5 + .4, 1.25), (wt("L05", 5), 1.5), (S6 - .05, .9), (wt("L07", 1) - .1, .9), (wt("L07", 1) + .5, .22), (S8, .22), (S9 - .05, .22), (S9 + .5, .12), (S10 - .05, .12), (S10 + .6, .2), (DUR, .2)], TT)
for ch, a in ((0, amb.L), (1, amb.R)):
    p = fft_filter(noise(N, "pink"), 40, 700, 2); h = np.sin(2 * np.pi * 58 * TT + ch) * 0.07 + np.sin(2 * np.pi * 116.5 * TT) * 0.03 + np.sin(2 * np.pi * 174 * TT + 1) * 0.015 * curve([(S5, 0), (S5 + .5, 1), (S6, 0)], TT)
    a += (p / np.std(p) * 0.05 + h) * env
tracks.append(amb)

# --- 03 RESPIRATION : l'astronaute dort ; elle devient courte et pénible quand la bulle se referme (7,5 → 12,2), puis disparaît sous le ventilateur
br = Trk("03_respiration-astronaute", "L'astronaute endormi, au centre. Souffle lent et régulier dans le module (2,6 → 7), de plus en plus court et rauque quand l'air expiré reste autour de sa tête (7,5 → 12,2). S'arrête quand le ventilateur démarre.", -26)
t = S2 + 0.1
while t < S3 + 2.6:
    br.add(breath(1.1, 1.4, .5, nasal=1.1), t, 1.0, 0.0, 0, "souffle calme"); t += 3.3
t = S3 + 3.2
k = 0
while t < S4 - 0.3:
    d = max(0.5, 1.0 - 0.1 * k); br.add(breath(d * .55, d * .45, .6 + .05 * k, rasp=.15 + .06 * k, tight=1), t, 1.0, 0.0, 0, "souffle court"); t += d * 1.25; k += 1
tracks.append(br)

# --- 04 VENTILATEURS : la turbine qui démarre à « ventilateurs », puis la ventilation qui continue toute la nuit
fn = Trk("04_ventilateurs", "Les ventilateurs : démarrage en montée à « ventilateurs » (12,7), puis un ronronnement constant (plus présent quand on le voit : 12,3 → 14,9 et pendant le roulis 24,9 → 30,7) qui continue sous la suite, comme la nuit. S'éteint avec la carte.", -27)
f0 = wt("L04", 2)
for ch, a in ((0, fn.L), (1, fn.R)):
    nz = fft_filter(noise(N, "pink"), 180, 2800, 2); nz = nz / np.std(nz)
    blade = 1 + 0.45 * np.sin(2 * np.pi * (14 + 6 * curve([(f0 - .3, 0), (f0 + .8, 1)], TT)) * TT + ch)
    tone = np.sin(2 * np.pi * (110 + 40 * curve([(f0 - .3, 0), (f0 + .8, 1)], TT)) * TT) * 0.25
    g = curve([(0, 0), (f0 - .35, 0), (f0 + .7, 1.0), (S5 - .1, 1.0), (S5 + .3, .3), (S8 - .1, .3), (S8 + .5, .7), (S9 - .1, .7), (S9 + .5, .25), (S10 - .2, .15), (S10 + .5, 0.0), (DUR, 0)], TT)
    a += (nz * blade * 0.3 + tone) * g
fn.add(whoosh(1.0, 200, 2500, .9, .6), f0 - .45, 1.0, 0.2, 0, "démarrage du ventilateur")
tracks.append(fn)

# --- 05 MACHINES : le tunnel (« plein de bruit ») : bips, pompes, ondes de bruit sur « bruit », montée de lumière sur « lumière »
mc = Trk("05_machines-bruit", "La station qui vit : pompe qui bat (0,9 s), bips de voyants, trois ondes de bruit sur « bruit » (16,8), montée brillante sur « lumière » (17,8). Se coupe net avec la scène du soleil.", -27)
t = S5 + .2
while t < S6 - .1:
    mc.add(sub_hit(.35, .4, 110, 50), t, 1.0, -0.2, 0, ""); t += 0.9
t = S5 + .5
while t < S6 - .2:
    mc.add(blip(1500, 1380, .05, .25), t, 1.0, rng.uniform(-.8, .8), 0, "bip"); t += rng.uniform(.35, .8)
for i in range(4): mc.add(whoosh(.7, 150, 1800, .8, .3, up=False), wt("L05", 5) + i * .7 - .1, 1.0, rng.uniform(-.4, .4), 0, "onde de bruit")
mc.add(whoosh(.9, 600, 5000, .9, .8), wt("L05", 9) - .15, 1.0, 0.0, 0, "montée de lumière")
mc.events = [{"t": round(S5, 2), "what": "tunnel : pompe + bips"}, {"t": round(wt("L05", 5), 2), "what": "ondes de bruit sur « bruit »"}, {"t": round(wt("L05", 9), 2), "what": "montée de lumière sur « lumière »"}]
tracks.append(mc)

# --- 06 SOLEIL : le lever, puis les 16 repères du cadran (de plus en plus vite), « ×16 »
su = Trk("06_soleil-x16", "Le lever de soleil (montée chaude 19,2 → 20,4), puis 16 petits tintements qui s'accélèrent et montent en hauteur (même courbe que les 16 repères du cadran à l'image), et un impact brillant sur « ×16 ».", -26)
D6 = SC["s6"]["end"] - S6; n0 = wt("L06", 5) - S6
su.add(whoosh(1.4, 180, 2400, .9, .75), wt("L06", 1) - .15, 1.0, 0.0, 6, "lever de soleil")
for i in range(16): su.add(blip(900 + 55 * i, 880 + 55 * i, .1, .5, 20), S6 + n0 + (D6 - n0 - .15) * (i / 15) ** .75, 1.0, rng.uniform(-.5, .5), 0, "repère " + str(i + 1) if i in (0, 15) else "")
su.add(bell_tone(660, 1.2, .8), wt("L06", 5) + .1, 1.0, 0.0, 0, "« ×16 »"); su.add(sub_hit(.6, .5, 110, 50), wt("L06", 5) + .1, 1.0, 0, 0, "")
tracks.append(su)

# --- 07 MASQUE ET BOUCHONS : le claquement de la sangle, deux « pop », puis le monde qui s'éteint
mk = Trk("07_masque-bouchons", "Le masque glisse (tissu), la sangle claque ; deux « pop » étouffés quand les bouchons se plantent, suivis d'un creux grave (l'oreille qui se bouche).", -25)
m0 = wt("L07", 1) - .1; p0 = wt("L07", 5) - .05
mk.add(rustle(.45, .8), m0, 1.0, 0.0, 0, "le masque glisse"); mk.add(mix(pop(.9), sub_hit(.5, .25, 160, 90)), m0 + .45, 1.0, 0.0, 0, "la sangle claque")
mk.add(pop(1.0), p0, 1.0, -0.5, 0, "pop (bouchon gauche)"); mk.add(pop(1.0), p0 + .08, 1.0, 0.5, 0, "pop (bouchon droit)"); mk.add(sub_hit(.7, .6, 90, 40), p0 + .05, 1.0, 0, 0, "creux grave (l'oreille se bouche)")
tracks.append(mk)

# --- 08 ROULIS : la caméra qui tourne, « haut » et « bas » barrés, le crochet
rl = Trk("08_roulis-haut-bas", "Le roulis : grand souffle qui monte puis redescend (26,1 → 28,1) ; « haut » et « bas » qui s'apposent et se barrent (grattement de stylo) ; petit « tic » sur « accroché au mur ».", -26)
r0 = wt("L08", 5) + .2; r1 = wt("L08", 11) + .1
rl.add(whoosh(r1 - r0, 120, 2200, 1.0, .5), r0, 1.0, 0.0, 14, "roulis")
for lbl, t in (("haut", wt("L08", 8)), ("bas", wt("L08", 10))):
    rl.add(pop(.7), t, 1.0, -0.2, 0, f"« {lbl} » apparaît"); rl.add(fft_filter(rng.standard_normal(int(.28 * SR)), 2500, 8000, 2) * bell(int(.28 * SR), .5) * 0.5, t + .18, 1.0, 0.2, 0, "barré (stylo)")
rl.add(blip(1100, 900, .08, .7, 30), wt("L08", 18), 1.0, 0.3, 0, "tic « accroché au mur »")
tracks.append(rl)

# --- 09 SOUVENIRS DE LA TERRE : le hublot qui s'allume en ambre (parasites, ré-apparition), pas de pluie ni de musique
tr = Trk("09_souvenirs-terre", "Le hublot qui devient un souvenir : montée douce et chaude à chaque changement (toit → terrasse → rue), un peu de parasite (crépitement) sur le bord, puis un petit « clic » par fenêtre qui s'éteint dans la rue. Aucun bruit de pluie, aucune musique (la voix porte).", -28)
for lbl, t in (("toit", wt("L09", 4) - .35), ("terrasse", wt("L10", 0) - .2), ("rue", wt("L11", 0) - .2), ("retour à la vraie vue", ss("s9") + (SC["s9"]["end"] - ss("s9")) - .4)):
    tr.add(whoosh(.8, 200, 2500, .6, .6), t - .1, 1.0, 0.0, 6, f"souvenir : {lbl}"); tr.add(crackle(.35, 70, .5), t, 1.0, 0.0, 0, "")
for i in range(8): tr.add(blip(1900, 1700, .03, .3, 80), wt("L11", 0) - .2 + .3 + i * .16, 1.0, rng.uniform(-.5, .5), 0, "fenêtre qui s'éteint" if i == 0 else "")
tr.add(pop(.5), wt("L09", 0) + .04 + 0.0, 1.0, 0.0, 0, "badge 3")
tracks.append(tr)

# --- 10 NÉON LISTEN : l'allumage du téléphone, l'expansion du néon, les bulles, le globe, la carte de fin
nn = Trk("10_listen-neon", "Le téléphone qui s'allume (glissando montant, 40,0), le néon qui s'étend (souffle montant, 40,5), trois bulles qui éclosent (bloop montants), le globe puis trois repères (pings), et à la carte de fin un carillon doux + un petit « pop » sur « lien en bio ». C'est le seul moment « coloré » de l'épisode : les sons sont plus brillants.", -25)
lis = wt("L12", 3) - .1; ect = wt("L12", 4) - .05
nn.add(mix(blip(260, 1300, .5, .6, 4) * 0.6, whoosh(.5, 600, 5000, .4, .8)), lis, 1.0, 0.0, 0, "le téléphone s'allume")
nn.add(whoosh(.95, 200, 4500, 1.0, .75), ect, 1.0, 0.0, 8, "le néon s'étend")
for i, t in enumerate([max(wt("L12", 4), ect + .45), max(wt("L12", 6), ect + .45), max(wt("L12", 7) + .1, ect + .45)]): nn.add(mix(blip(480 + 130 * i, 820 + 130 * i, .16, .8, 16), 0.3 * crackle(.1, 200, .5)), t, 1.0, [-.5, .5, 0][i], 0, f"bulle {i + 1}")
nn.add(twinkle(1760, .6, .5), wt("L12", 10), 1.0, 0.6, 0, "le globe")
for i, (t, f) in enumerate([(wt("L12", 11), 880), (wt("L12", 12) + .05, 1175), (wt("L12", 13), 1568)]): nn.add(bell_tone(f, 1.0, .55), t, 1.0, [.4, .6, .5][i], 0, f"repère {i + 1}")
c0 = wt("L13", 5) + .62
nn.add(mix(bell_tone(523, 2.2, .8), 0.7 * bell_tone(784, 2.0, .6)), c0 + .15, 1.0, 0.0, 0, "carte de fin : carillon"); nn.add(pop(.5), c0 + .85, 1.0, 0.0, 0, "« lien en bio »")
tracks.append(nn)

# --- 11 COUPES : un impact grave et court sur les coupes de plan
ct = Trk("11_coupes", "Impacts graves courts sur les coupes (début de chaque plan). Aucun sur les raccords continus (le plan 3 de la bulle, le roulis, les souvenirs, le néon).", -24)
for s, a in [(S2, .5), (S3, .5), (S4, .5), (S5, .6), (S6, .5), (S7, .5), (S8, .5), (S9, .5), (S10, .45), (S11, .4)]: ct.add(sub_hit(a, .5), s - .02, 1.0, 0, 0, "coupe")
tracks.append(ct)

# --- 12 DÉCOLLAGE : le lit qui se met à flotter (0 → 2,5 s)
dc = Trk("12_decollage", "Le lit qui décolle : grand souffle d'air qui monte (0,1 → 2,3), étoiles qui scintillent (tintements aigus doux), froissements de couette et d'oreiller, léger grondement sourd qui monte.", -27)
dc.add(whoosh(2.3, 200, 3200, 1.0, .85), 0.05, 1.0, 0.0, 8, "décollage")
for i, f in enumerate([2093, 2637, 3136, 2349, 3520, 2794, 3951, 2489]): dc.add(twinkle(f, .5, .4), .3 + i * .26, 1.0, rng.uniform(-.8, .8), 0, "étoile" if i == 0 else "")
for t in (.25, .35, .45, .55): dc.add(rustle(.5, .5), t, 1.0, rng.uniform(-.6, .6), 0, "objet qui se soulève" if t == .25 else "")
dc.add(deep_breath(2.4, True, .5), 0.0, 1.0, 0.0, 8, "grondement sourd qui monte")
tracks.append(dc)

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
md = ["# Sound design « Astronaute » — stems séparés", "",
      "Tous les fichiers : WAV 48 kHz, 24 bits, stéréo, pleine durée, calés à 0, au niveau de mix voulu (la voix `01_voix.wav` = référence). `00_mix-de-reference.wav` = voix + toutes les pistes.", "",
      "**Principe** : la station est un lieu vivant (air, machines), dont on s'isole peu à peu : les bouchons assourdissent tout (piste 02), les souvenirs de la Terre sont presque silencieux (pas de pluie : ce serait l'appli qu'on entendrait), puis le néon de Listen est le seul moment brillant. Tout est accroché aux mots de la voix ; si le calage bouge, relancer `scripts/sounddesign.py` suffit.", "",
      "**Ce sont des sons synthétiques** (numpy), conçus pour être remplacés piste par piste par de vrais enregistrements aux mêmes instants (`sound-design.json`).", ""]
for s_ in summary: md += [f"## {s_['stem']}", f"_Crête de piste : {s_['niveau_crete_dBFS']} dBFS._ {s_['role']}", ""] + ([f"- {e['t']:.2f} s — {e['what']}" for e in s_["evenements"] if e["what"]][:12]) + [""]
(OUT / "LISEZMOI-sound-design.md").write_text("\n".join(md))
print("sound design :", len(tracks), "pistes ; pic de la somme", round(float(pk), 3))
