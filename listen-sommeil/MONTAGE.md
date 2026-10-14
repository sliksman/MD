# Listen — Nuits blanches ép. 3 : recaler, retoucher, rendre

Tout le minutage vit dans **`timeline.json`**. Les fichiers `compositions/*.html` et `index.html`
sont **générés** : on édite `timeline.json` et `src/scenes/*.js`, puis `npm run sync`.

## 1. La voix

`voFile` pointe vers `assets/audio/vo_v2.mp3` : ta prise ElevenLabs normalisée à −16 LUFS (`vo_norm.mp3`)
+ 5 respirations insérées par `python3 scripts/breathe.py` (liste `GAPS` dans le script) — 74,9 s → 80,3 s.
L'original est `assets/audio/vo.mp3`.

Calage mot à mot : `python3 scripts/align.py` (souffles détectés dans la voix, sans ASR). Une réplique
`"lock": true` n'est pas recalée (L15, calée à la main).

## 2. Les répliques (`vo`)

Chaque réplique a `start` / `end` en secondes absolues. Les mots sont répartis au prorata des
syllabes. Pour caler un mot précisément, ajoute une liste `words` :

```json
{ "id": "L18", "start": 35.79, "end": 37.35, "text": "Occupe ton esprit.",
  "words": [["Occupe", 35.79], ["ton", 36.52], ["esprit.", 36.78]] }
```

`hl` = mots en ambre dans les sous-titres. Toutes les animations et tous les bruitages sont accrochés
aux mots : ils suivent tout seuls.

## 3. Les scènes (`scenes`)

6 plans continus, contigus de 0 à `duration`. Entre deux plans : le volet de points
(`compositions/wipes.html`), aux instants listés dans `wipes` (toujours dans une respiration de la voix).

## 4. Sous-titres

`captions.enabled`, `captions.maxWords` (2–3 mots, façon Catcharium), `captionY` = plages `[début, fin, y]`.

## 5. Bruitages (`sfx`)

`at` = seconde absolue, ou `{ "vo": "L30", "word": 12, "+": 0.1 }`. `vol` 0–1. Fichiers dans
`assets/sfx/` (générés à la main avec ffmpeg : à remplacer par ta propre banque si tu veux).
`out/cues.json` liste tous les repères (secondes + frame à 30 i/s) pour refaire le mix dans ton NLE.
Le tapis (`sfx-pad`) est « creusé » sous la voix (EQ dynamique, attributs `data-fx-*` conservés par la sync).

## 6. Rendre

```bash
npm run sync
npx hyperframes lint
npx hyperframes check --range 0,25 --timeout 60000   # par tranches : la vérif complète est lente sans GPU
npx hyperframes render --quality delivery --fps 30 -o out/listen-nuits-blanches-ep3.mp4
```

Sources des plans : `src/scenes/p1…p6-*.js` (enveloppées en `compositions/*.html` par la sync).
```
```
