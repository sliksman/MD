# SHAPE POC — Guide de compositing

Trois plaques animées en 1920×1080, 30 i/s, sans son, calées sur les SRT POC1 / POC2 / POC3 (TC 00:00 = début de chaque vidéo d'avatar).

| Fichier | Avatar | Durée | Zone avatar (laissée vide) |
|---|---|---|---|
| `renders/SHAPE_POC_slide12.mp4` | Narrateur (POC1) | 50 s | Carte arrondie x 45 → 585, y 200 → 875 (540×675, rayon 32 px) |
| `renders/SHAPE_POC_slide13.mp4` | Narrateur (POC2) | 48 s | Carte arrondie x 45 → 585, y 200 → 875 (540×675, rayon 32 px) |
| `renders/SHAPE_POC_slide15.mp4` | Coach (POC3) | 40 s | Moitié gauche, x 0 → 750 px, avatar ancré en bas, devant les formes magenta/citron |

## Placement conseillé
- **Narrateur (B, carte)** : vidéo filmée posée sur la carte grise, masquée par `renders/MATTE_carte_narrateur.png` (blanc = visible, en track matte luma). Recadrer la vidéo en 4:5, visage dans le tiers haut. L'ombre portée et le nom (« Dr Martin · Médecin gériatre », à faire valider) sont déjà dans la plaque.
- **Coach (C)** : plan taille centré sur x ≈ 380 px, bas du cadre ancré au bas de l'image. La pastille « Le coach APA · en séance » est en haut à gauche, sous le logo.
- Avatar posé sur la vidéo : aligner le TC 00:00 de la vidéo d'avatar sur la frame 0 de la plaque.

## Points de synchro (TC des SRT)
- **Slide 12** : robustesse 4,8 s · pré-fragilité 14,2 s · « phase la plus réversible » 20,8 s · leviers 23,5 s · déterminants 27,0 s · fragilité installée 34,4 s · seuil 39,9 s · message clé 41,7 s · courbe « infléchir » 46,8 s
- **Slide 13** : 5 critères 6,9 → 18,6 s · robuste / pré-fragile / fragile 20,8 / 23,8 / 26,4 s · dépistage 29,0 s · 40-50 % 36,4 s · 7-15 % 39,7 s · facteurs 42,8 s
- **Slide 15** : « Des modèles… » 0,2 s · titre 3,1 s · citation 6,1 / 10,5 s · cartes 15,0 / 21,2 / 26,8 s · équipe médicale 33,2 s · conclusion 35,4 s

## Modifier
Chaque slide est un projet HyperFrames (`s12/`, `s13/`, `s15/index.html`). Les temps sont dans le script en bas de chaque fichier. Pour regénérer : `npx hyperframes render --quality delivery`.
