# SHAPE POC — Guide de compositing

Trois plaques animées en 1920×1080, 30 i/s, sans son, calées sur les SRT VIDEO1 / VIDEO2 / VIDEO3 (dossier `srt/`) (TC 00:00 = début de chaque vidéo d'avatar).

| Fichier | Avatar | Durée | Zone avatar (laissée vide) |
|---|---|---|---|
| `renders/SHAPE_POC_slide12.mp4` | Narrateur (VIDEO1) | 50 s | Carte arrondie x 45 → 585, y 200 → 875 (540×675, rayon 32 px) |
| `renders/SHAPE_POC_slide13.mp4` | Narrateur (VIDEO2) | 48 s | Carte arrondie x 45 → 585, y 200 → 875 (540×675, rayon 32 px) |
| `renders/SHAPE_POC_slide15.mp4` | Coach (VIDEO3) | 41 s | Moitié gauche, x 0 → 750 px, avatar ancré en bas, devant les formes magenta/citron |

## Placement conseillé
- **Narrateur (B, carte)** : vidéo filmée posée sur la carte grise, masquée par `renders/MATTE_carte_narrateur.png` (blanc = visible, en track matte luma). Recadrer la vidéo en 4:5, visage dans le tiers haut. L'ombre portée et le nom (« Dr Martin · Médecin gériatre », à faire valider) sont déjà dans la plaque.
- **Coach (C)** : plan taille centré sur x ≈ 380 px, bas du cadre ancré au bas de l'image. La pastille « Le coach APA · en séance » est en haut à gauche, sous le logo.
- Avatar posé sur la vidéo : aligner le TC 00:00 de la vidéo d'avatar sur la frame 0 de la plaque.

## Points de synchro (TC des SRT VIDEO1-3)
- **Slide 12** : robustesse 5,0 s · stress 8,4 s · pré-fragilité 14,6 s · « phase la plus réversible » 21,6 s · leviers 24,0 s · déterminants 28,3 → 31,8 s · fragilité installée 35,0 s · seuil 40,8 s · message clé 42,1 s · courbe « infléchir » 46,9 s
- **Slide 13** : 5 critères 7,1 → 19,2 s · robuste / pré-fragile / fragile 21,5 / 24,5 / 27,1 s · dépistage 29,8 s · 40-50 % 36,4 s · 7-15 % 39,4 s · facteurs 43,4 s
- **Slide 15** : « Des modèles… » 1,0 s · titre 4,4 s · citation 7,4 / 11,6 s · cartes 16,2 / 22,3 / 27,7 s · équipe médicale 34,6 s · conclusion 36,0 s

## Modifier
Chaque slide est un projet HyperFrames (`s12/`, `s13/`, `s15/index.html`). Les temps sont dans le script en bas de chaque fichier. Pour regénérer : `npx hyperframes render --quality delivery`.
