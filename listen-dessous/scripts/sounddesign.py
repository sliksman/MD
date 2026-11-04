#!/usr/bin/env python3
"""Sound design de « Dessous » : stems séparés (WAV 48 kHz, 24 bits, stéréo, pleine durée, calés à 0), synthétisés en numpy.
Chaque famille de sons = une piste, aux niveaux relatifs du mix voulu (la voix, 01_voix.wav, reste la référence à 0 dB).
Écrit out/stems/*.wav, out/sound-design.json (liste des évènements) et out/stems/LISEZMOI-sound-design.md.
Usage : python3 scripts/sounddesign.py   (après python3 scripts/stems.py, qui exporte la voix)
Tout est déterministe (graine fixe). Ce sont des sons SYNTHÉTIQUES : de vrais enregistrements (souffles, tissu, bois) feront mieux ;
chaque piste est conçue pour être remplacée telle quelle."""
import json, subprocess, wave
from pathlib import Path
import numpy as np

ROOT = Path(__file__).resolve().parent.parent
SR = 48000
T = json.loads((ROOT / "timeline.json").read_text())
DUR = T["duration"]
N = int(SR * DUR)
OUT = ROOT / "out" / "stems"; OUT.mkdir(parents=True, exist_ok=True)
rng = np.random.default_rng(11)
END = 47.4                                  # coupe au noir : tout s'arrête net

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

# ---------------------------------------------------------------- la chaleur : position du front (même courbe que l'image)
U = [(0, 0), (5.9, 0.0), (6.52, 0.05), (6.72, 0.09), (10, 0.10), (15.4, 0.10), (16.9, 0.20), (17.53, 0.30), (18.27, 0.37), (20.9, 0.43),
     (21.73, 0.43), (22.03, 0.49), (22.25, 0.49), (22.55, 0.55), (22.72, 0.55), (23.02, 0.61), (26.8, 0.61), (27.0, 0.73), (37.86, 0.78), (41.4, 0.90), (END, 0.95)]
u = curve(U, TT)

def mask(pts): return curve(pts, TT)
def hold_gap(v):                             # le silence d'une seconde (« respirer… non ») : le monde retient son souffle
    return v * curve([(0, 1), (36.85, 1), (37.0, 0.04), (37.62, 0.04), (37.95, 1), (END, 1)], TT)

# ================================================================ PISTES
tracks = []

# --- 02 AMBIANCE : le silence d'une chambre (jamais du vide), qui s'éteint dans la pause « non »
amb = Trk("02_ambiance-chambre", "Chambre la nuit : air, un très léger ronflement de frigo/immeuble, jamais du silence numérique. S'éteint presque complètement dans la pause de « … non » (37,0 → 37,9), revient après.", -34)
for ch, a in ((0, amb.L), (1, amb.R)):
    p = fft_filter(noise(N, "pink"), 35, 420, 2); h = np.sin(2 * np.pi * 50 * TT + ch) * 0.10 + np.sin(2 * np.pi * 100.3 * TT) * 0.03
    a += (p / np.std(p) * 0.06 + h) * hold_gap(curve([(0, 0.8), (6, 0.8), (20, 1.0), (END, 1.25)], TT))
tracks.append(amb)

# --- 03 RESPIRATION DE LÉA : 12 cycles réguliers (≈ 3,2 s) ; le dernier est une inspiration jamais expirée (35,55 → « respirer… » → rien)
lea = Trk("03_respiration-lea", "Léa, à droite, endormie. Cycles réguliers pendant tout le film ; le dernier (35,5 s) est une inspiration qui n'est JAMAIS expirée : c'est le moment où tout s'arrête.", -26)
per = (35.55 - 0.2) / 11
for k in range(12):
    t0 = 0.2 + k * per; last = k == 11
    lea.add(breath(1.25 if not last else 1.45, 0 if last else 1.55, 0.55, nasal=1.2), t0, 1.0, 0.5, 0.35, "inspiration (jamais expirée)" if last else "souffle de Léa")
tracks.append(lea)

# --- 04 RESPIRATION DE LUI : proche, centrée ; courte et tremblante quand il a peur ; il retient son souffle ; il aspire de force à « Je peux pas »
him = Trk("04_respiration-lui", "Lui, au centre, très proche. Souffles courts et tremblants ; 3 inspirations nettes sur les « crans » (21,6 / 22,1 / 22,6) ; APNÉE de 24,4 à 26,8 ; grande aspiration rauque à « Je peux pas » ; souffle saccadé qui se calme jusqu'à 35.", -24)
for t0, a, r in [(3.75, .45, 0), (5.55, .45, 0), (6.4, .7, .25), (8.2, .55, .35), (10.3, .55, .4), (11.9, .5, .3), (13.7, .5, .3), (15.7, .5, .3), (17.5, .55, .3), (19.2, .55, .35)]:
    him.add(breath(.55, .45, a, rasp=r, tight=1), t0, 1.0, 0.0, 0, "souffle court (peur)")
for t0 in (21.6, 22.12, 22.6): him.add(breath(.32, 0, .85, rasp=.4, tight=1), t0, 1.0, 0.0, 0, "inspiration sur un cran")
g = breath(.62, .5, 1.0, rasp=.6, tight=1); g[:int(.62 * SR)] *= 1.25
him.add(g, 26.62, 1.0, 0.0, 0, "GRANDE aspiration (« Je peux pas »)")
for t0, a in [(27.9, .6), (29.4, .55), (31.0, .5), (32.7, .45), (34.3, .4)]: him.add(breath(.5, .45, a, rasp=.35, tight=1), t0, 1.0, 0.0, 0, "souffle saccadé qui se calme")
tracks.append(him)

# --- 05 CŒUR : lub-dub sourd ; s'emballe quand il retient son souffle ; STOP net à 36,95 (silence) ; revient lent et profond sous le lit
heart = Trk("05_coeur", "Battement de cœur sourd (sub). Plus fort et plus rapide dans les plans « intérieurs » (paupières, yeux écarquillés), 140 bpm pendant l'apnée. S'arrête net à 36,95 s ; reprend lent et profond (52 bpm) à 38,0 et s'éteint vers 43.", -22)
bpm = [(3.2, 64), (7.6, 74), (11.3, 70), (21, 78), (24.4, 98), (26.8, 144), (27.7, 118), (33, 86), (36.9, 82)]
gn = [(3.2, .20), (7.6, .52), (8.85, .58), (11.3, .42), (15, .26), (21, .32), (24.4, .6), (26.8, 1.0), (27.7, .55), (33, .30), (36.9, .30)]
inner = [(7.85, 11.3), (25.6, 26.9)]
t = 3.2
while t < 36.95:
    m = any(a <= t <= b for a, b in inner)
    heart.add(heart_beat(1.0, muffled=m), t, float(np.interp(t, [p[0] for p in gn], [p[1] for p in gn])) * (1.5 if m else 1.0), 0.0, 0, "battement" if m else "")
    t += 60 / float(np.interp(t, [p[0] for p in bpm], [p[1] for p in bpm]))
t = 38.0
while t < 43.0:
    heart.add(heart_beat(1.0, muffled=True), t, 0.5 * float(np.interp(t, [38, 41.4, 43], [1, .9, 0.0])), 0.0, 0, ""); t += 60 / 52
heart.events = [{"t": 3.2, "what": "cœur (lub-dub) 64 bpm"}, {"t": 7.85, "what": "plan « paupières » : cœur étouffé, plus fort"}, {"t": 24.4, "what": "apnée : le cœur s'emballe"}, {"t": 26.8, "what": "pic (aspiration)"}, {"t": 36.95, "what": "STOP net"}, {"t": 38.0, "what": "reprise lente et profonde (52 bpm)"}]
tracks.append(heart)

# --- 06 ACOUPHÈNE : ce qu'on entend les yeux fermés / dans la panique
tin = Trk("06_acouphene-interieur", "Sifflement aigu très discret quand il ferme les yeux et dans le contrechamp de la panique : on est dans sa tête.", -38)
for a, b in [(7.85, 8.85), (9.65, 10.0), (10.4, 11.3), (25.6, 26.8)]:
    n = int((b - a) * SR); tt = np.arange(n) / SR
    y = (np.sin(2 * np.pi * 5230 * tt) + 0.8 * np.sin(2 * np.pi * 5262 * tt)) * np.sin(np.pi * np.linspace(0, 1, n)) ** 0.7 * 0.5
    tin.add(y, a, 1.0, 0.0, 0, "acouphène")
tracks.append(tin)

# --- 07 CHALEUR : bruit chaud et grave, pulsation lente (celle de la lueur), crépitement microscopique dont la densité suit le front
warm = Trk("07_chaleur-impalpable", "La chaleur, sans forme : souffle chaud grave qui pulse (~1 Hz), crépitements microscopiques dont la densité suit le front de chaleur (même courbe que l'image). Naît à 5,9 s, s'arrête avec le noir.", -29)
for ch, a in ((0, warm.L), (1, warm.R)):
    w_ = fft_filter(noise(N, "pink"), 110, 950, 2); w_ = w_ / np.std(w_)
    pulse = 1 + 0.35 * np.sin(2 * np.pi * 0.95 * TT + ch * 0.7); gain = mask([(0, 0), (5.7, 0), (6.6, .35), (7.6, .30), (9.5, .35), (15, .38), (END, 1.0)]) * (0.55 + 0.9 * u)
    a += w_ * pulse * gain * 0.35 * hold_gap(1.0) * (TT <= END)
lam = 1.5 + 26 * u; t = 5.9
while t < END:
    t += rng.exponential(1 / float(np.interp(t, TT, lam)))
    if t >= END: break
    k = int(0.003 * SR + rng.random() * 0.006 * SR); c = fft_filter(rng.standard_normal(k), 700, 4500, 2) * np.exp(-np.arange(k) / (k * 0.35))
    warm.add(c / (np.max(np.abs(c)) + 1e-9), t, 0.05 + 0.25 * rng.random(), rng.uniform(-.8, .8), 0, "")
warm.events = [{"t": 5.9, "what": "la chaleur naît (« Il y a un truc chaud »)"}, {"t": 17.5, "what": "cran : « Là, c'est la cheville »"}, {"t": 21.6, "what": "3 crans sur les inspirations (21,6 / 22,1 / 22,6)"}, {"t": 27.0, "what": "saut de deux crans (« Je peux pas »)"}, {"t": 41.4, "what": "presque sur lui"}]
tracks.append(warm)

# --- 08 HUMIDE : bulles étouffées, frottements de gel
wet = Trk("08_humide", "Sons mouillés étouffés (bulles, gel) : l'insert du drap (11,5 → 12,9), l'empreinte (13 → 14,1), un petit à chaque cran, et trois gouttes dans la marée finale. Jamais clair, toujours sous le reste.", -28)
for t0, a, d in [(6.85, .30, .3), (11.55, .55, .45), (11.9, .5, .4), (12.1, .6, .4), (12.45, .5, .35), (12.8, .45, .3), (13.2, .5, .5), (13.7, .55, .5), (14.05, .9, .6),
                 (17.55, .45, .4), (18.3, .45, .4), (18.9, .35, .4), (19.6, .35, .4), (20.3, .35, .4), (21.8, .4, .3), (22.35, .4, .3), (22.85, .45, .3), (27.05, .7, .5),
                 (44.1, .3, .5), (45.3, .3, .5), (46.2, .3, .5)]:
    wet.add(squelch(a, d), t0, 1.0, rng.uniform(-.4, .4), 0, "humide")
tracks.append(wet)

# --- 09 DRONE : grave continu, monte avec le front de chaleur ; se tait dans la pause « non » ; marée finale
dr = Trk("09_drone-tension", "Drone grave (~40-50 Hz + quinte + octave) qui monte avec la progression de la chaleur. S'éteint dans la pause de « non » (37,0 → 37,9), revient avec le lit. De 43,3 à 47,4 : marée montante, coupée net au noir.", -27)
f1 = 40 + 10 * u
for ch, a in ((0, dr.L), (1, dr.R)):
    ph = 2 * np.pi * np.cumsum(f1 * (1 + 0.0015 * (1 if ch else -1))) / SR
    s = np.sin(ph) * 0.45 + np.sin(1.5 * ph + 0.3) * 0.4 * (0.3 + u) + np.sin(2.01 * ph) * 0.3 * (0.4 + u) + np.sin(3.02 * ph) * 0.10 * u * u + np.sin(4.03 * ph + 1) * 0.3 * (0.35 + u) + np.sin(6.05 * ph) * 0.22 * (0.2 + u) + np.sin(8.07 * ph) * 0.1 * u
    s *= 1 + 0.22 * np.sin(2 * np.pi * 0.17 * TT + ch)
    air = fft_filter(noise(N, "pink"), 150, 1700, 2) * 0.16 * (0.4 + u)
    env = mask([(0, 0), (5.4, 0), (6.6, .35), (7.6, .30), (15, .40), (21, .55), (24.4, .55), (26.8, .50), (27.7, .50), (36.9, .6), (END, .6)])
    tide = np.clip((TT - 43.3) / 4.1, 0, 1) ** 1.7
    tide_sig = (np.sin(2 * np.pi * 55 * TT + ch) + 0.7 * np.sin(2 * np.pi * 82.5 * TT) + 0.5 * np.sin(2 * np.pi * 110.3 * TT + ch)) * 0.55 * (1 + 0.25 * np.sin(2 * np.pi * 0.3 * TT))
    tide_air = fft_filter(noise(N, "pink"), 200, 2600, 2) * 0.28
    a += hold_gap(((s + air) * env + (tide_sig + tide_air) * tide) * 0.55) * (TT <= END)
dr.events = [{"t": 5.4, "what": "le drone naît"}, {"t": 21, "what": "monte avec les crans"}, {"t": 37.0, "what": "SE TAIT (pause de « non »)"}, {"t": 37.95, "what": "revient avec le lit"}, {"t": 43.3, "what": "marée finale (montée)"}, {"t": END, "what": "COUPÉ NET (noir)"}]
tracks.append(dr)

# --- 10 COUPES ET À-COUPS : impacts graves courts sur les coupes ; plus gros sur « trop » et « Je peux pas »
cuts = Trk("10_coupes-et-a-coups", "Impacts graves courts (sub + queue de bruit) sur les coupes de plan ; gros sur « trop » (14,1) et sur l'aspiration (26,8). Aucun impact sur « non » (37,86) : le silence est le choc.", -23)
for t0, a in [(0.95, .30), (3.2, .45), (6.72, .35), (7.6, .35), (8.85, .22), (9.65, .22), (11.3, .45), (15.4, .45), (17.45, .30), (25.6, .35), (27.7, .5), (41.4, .55), (43.3, .4)]:
    cuts.add(sub_hit(a, .55), t0 - 0.02, 1.0, 0, 0, "coupe")
for t0, a, label in [(14.11, 1.0, "« trop » : l'empreinte serre"), (17.53, .6, "cran « Là »"), (18.27, .5, "cran « cheville »"), (21.9, .4, "cran (inspiration)"), (22.45, .4, "cran"), (22.92, .5, "cran « cran »"), (26.83, 1.0, "« Je peux pas » : aspiration"), (27.1, .5, "saut de crans")]:
    cuts.add(sub_hit(a, .8, 90, 33), t0, 1.0, 0, 0, label)
tracks.append(cuts)

# --- 11 TISSU ET LIT : frottements de drap / oreiller, grincements du matelas
fab = Trk("11_tissu-et-matelas", "Frottements de tissu (oreiller, drap, sa main) et grincements du matelas, chaque fois que quelque chose bouge sous la couette. Le grincement du lit est ce qui trahit la chose.", -27)
for t0, d, a, p in [(0.95, .5, .5, -.2), (3.2, .35, .3, 0), (17.4, .5, .5, 0), (21.3, .3, .3, 0), (26.8, .9, .9, 0), (28.85, .8, .55, -.3), (29.9, .6, .4, -.3), (33.7, .6, .3, 0), (35.8, .5, .25, 0), (43.4, .6, .3, .3)]:
    fab.add(rustle(d, a), t0, 1.0, p, 0, "tissu")
for t0, d, a, f in [(17.5, .7, .55, 38), (18.25, .6, .5, 44), (22.0, .6, .5, 40), (22.5, .5, .45, 46), (22.95, .8, .6, 36), (27.0, 1.0, .75, 33), (38.4, 1.4, .5, 30), (40.4, 1.2, .5, 28), (44.8, 1.0, .35, 30)]:
    fab.add(creak(d, a, f), t0, 1.0, rng.uniform(-.3, .3), 6, "grincement du matelas")
tracks.append(fab)

# --- 12 LE LIT RESPIRE : la grande respiration grave du matelas, ≈ 4 s, bien plus lente que celle de Léa
bed = Trk("12_le-lit-respire", "La respiration du lit (sub + souffle grave) : inspiration 37,9 → 39,85 (le cadre monte), expiration 39,85 → 42,0 (déborde sous le noir et « Léa ? »). Prend la suite de la respiration de Léa, 10 fois plus grave : c'est ce qu'il prenait pour elle.", -23)
bed.add(deep_breath(1.95, True, .9), 37.9, 1.0, 0, 8, "inspiration du lit")
bed.add(deep_breath(2.2, False, .9), 39.85, 1.0, 0, 8, "expiration du lit")
bed.add(deep_breath(1.7, True, .45), 43.3, 1.0, 0, 8, "inspiration (finale)")
tracks.append(bed)

# --- 13 PAUSE ET FINAL : la montée de la pause (inverse de souffle) et le gros plan final
fin = Trk("13_pause-et-final", "Un souffle inversé presque inaudible qui monte dans les derniers 0,4 s du silence (37,5 → 37,86) et prépare l'entrée du lit ; un battement de cœur lent et grave à 42,1 (« Léa ? ») ; puis RIEN : coupe nette à 47,4 (noir) suivie de 1 s de silence total avant la boucle (aucun impact, aucune queue de réverbération).", -26)
n = int(.4 * SR); rv = breath(.4, 0, .5)[::-1].copy(); fin.add(rv[:n], 37.5, 1.0, 0, 0, "souffle inversé (la pause se referme)")
fin.add(heart_beat(1.0, True), 42.1, .7, 0, 0, "cœur lent sur « Léa ? »")
tracks.append(fin)

# ---------------------------------------------------------------- mixage final des pistes, coupe nette à END, écriture
def write_wav(path, L, R):
    x = np.clip(np.stack([L, R], 1), -1, 1); i = (x * (2 ** 23 - 1)).astype(np.int32).flatten()
    b = np.zeros((i.size, 3), np.uint8); b[:, 0] = i & 255; b[:, 1] = (i >> 8) & 255; b[:, 2] = (i >> 16) & 255
    with wave.open(str(path), "wb") as w: w.setnchannels(2); w.setsampwidth(3); w.setframerate(SR); w.writeframes(b.tobytes())

# niveaux : chaque piste est normalisée sur son pic puis placée à son niveau de mix (dB, voix = 0 dB de référence)
mix_L = np.zeros(N); mix_R = np.zeros(N)
voice = OUT / "01_voix.wav"
vL = vR = None
if voice.exists():
    raw = subprocess.run(["ffmpeg", "-v", "error", "-i", str(voice), "-f", "f32le", "-ac", "2", "-ar", str(SR), "-"], capture_output=True).stdout
    v = np.frombuffer(raw, np.float32).reshape(-1, 2); vL = np.zeros(N); vR = np.zeros(N); n = min(N, len(v)); vL[:n] = v[:n, 0]; vR[:n] = v[:n, 1]
    mix_L += vL; mix_R += vR
cut_mask = (TT < END).astype(float); cut_mask[int((END - 0.01) * SR):int(END * SR)] *= np.linspace(1, 0, int(END * SR) - int((END - 0.01) * SR))
summary = []
for tr in tracks:
    tr.L *= cut_mask if tr.name != "13_pause-et-final" else 1; tr.R *= cut_mask if tr.name != "13_pause-et-final" else 1
    pk = max(np.max(np.abs(tr.L)), np.max(np.abs(tr.R))) + 1e-9; k = db(tr.level_db) / pk * 0.707 / 0.707
    L, R = tr.L * k, tr.R * k; write_wav(OUT / f"{tr.name}.wav", L, R); mix_L += L; mix_R += R
    summary.append({"stem": f"{tr.name}.wav", "niveau_crete_dBFS": tr.level_db, "role": tr.desc, "evenements": tr.events})
pk = max(np.max(np.abs(mix_L)), np.max(np.abs(mix_R)))
if pk > 0.97: mix_L *= 0.97 / pk; mix_R *= 0.97 / pk
write_wav(OUT / "00_mix-de-reference.wav", mix_L, mix_R)
(ROOT / "out" / "sound-design.json").write_text(json.dumps(summary, ensure_ascii=False, indent=1) + "\n")
md = ["# Sound design « Dessous » — stems séparés", "",
      "Tous les fichiers : WAV 48 kHz, 24 bits, stéréo, pleine durée (48,4 s), calés à 0, au niveau de mix voulu (la voix `01_voix.wav` = référence). `00_mix-de-reference.wav` = voix + toutes les pistes, pour écoute.", "",
      "**Principe** : la chambre n'est jamais silencieuse, SAUF dans la pause de « … non » (37,0 → 37,9 s) où tout s'arrête d'un coup (ambiance, drone, cœur, souffle de Léa) : c'est le vrai choc de l'épisode. Le souffle de Léa (piste 03) se termine sur une inspiration jamais expirée ; ce que l'on entend ensuite (piste 12, le lit) est la même respiration, dix fois plus grave : c'est ce qu'il prenait pour Léa. Tout est coupé net au noir à 47,4 s, suivi de silence total.", "",
      "**Ce sont des sons synthétiques** (numpy). Ils sont conçus pour être remplacés piste par piste par de vrais enregistrements (souffle, tissu, bois, sub) en gardant les mêmes instants ; la liste des évènements est dans `sound-design.json`.", ""]
for s in summary:
    md += [f"## {s['stem']}", f"_Crête de piste : {s['niveau_crete_dBFS']} dBFS._ {s['role']}", ""] + ([f"- {e['t']:.2f} s — {e['what']}" for e in s["evenements"] if e["what"]][:14]) + [""]
(OUT / "LISEZMOI-sound-design.md").write_text("\n".join(md))
print("sound design :", len(tracks), "pistes ; pic de la somme", round(float(pk), 3))
for s in summary: print(" ", s["stem"], len(s["evenements"]), "évènements")
