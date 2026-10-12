# MORDU — recaler le spot sur ta voix

Tout se règle dans **`timeline.json`**. Ne touche jamais aux fichiers `compositions/*.html` pour le timing.

## 1. Caler les répliques

Chaque réplique a un `start` / `end` en secondes absolues :

```json
{ "id": "vo1b", "scene": "s1", "start": 7.3, "end": 8.1, "text": "On presse." }
```

Mets les vraies valeurs mesurées dans ton montage. Les mots sont répartis automatiquement
au prorata des syllabes. Pour caler au mot près (sous-titres karaoké exacts), ajoute :

```json
"words": [["On", 7.30], ["presse.", 7.52]]
```

## 2. Les gestes suivent la voix

Les beats d'animation accrochés à la voix (`{"vo": "vo1b", "word": 1}`) se déplacent seuls :
le coup de presse tombe sur « presse », le tampon REFUSÉE sur le bon mot, etc.
Les beats numériques (`"belt": 0.3`) sont en secondes **relatives au début de la scène**.

## 3. Durée des scènes

`scenes[].start` / `end` : les scènes doivent rester contiguës et couvrir 0 → 60 s
(le script refuse un trou ou un chevauchement).

## 4. Régénérer et rendre

```bash
npm run sync      # régénère timeline.js, index.html, out/cues.json (+ contrôles)
npm run check     # lint + audits
npx hyperframes render -o out/mordu-spot-16x9.mp4 --fps 30 --quality delivery
```

## 5. Sous-titres

`"subtitles": { "enabled": false }` dans `timeline.json`, puis `npm run sync` → rendu sans sous-titres.

## 6. Repères sonores

`out/cues.json` : `t` (secondes), `frame` (à 30 fps), `name`, `scene`. Régénéré par `npm run sync`.
