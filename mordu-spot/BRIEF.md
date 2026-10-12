---
workflow: general-video
flow: companion
storyboard: no
message: "Les barres MORDU sont faites avec de vrais ingrédients, selon une méthode moderne — pas comme des briques de placo."
aspect: 1920x1080
language: fr
length: 60s
---

## Intent

Spot de 60 s, full motion design, pour MORDU (marque fictive de barres protéinées,
caramel cacahuète, 20 g de protéines). Explique la « méthode de fabrication MORDU »
avec un ton deadpan, impertinent, très sûr de lui. Diorama d'usine miniature en
isométrie CSS 3D : élégance épurée façon Monument Valley, humour sec de notice de montage.
Le monde passe du gris poussiéreux (chantier, barres « placo ») au bordeaux propre
(usine MORDU) à la scène 2 et n'y revient pas.

## Assets

- Charte MORDU (fournie en image) — palette : Rouge #7A2328, Crème #EDE2D2, Caramel #B8732A, Chocolat #3A2A24, Gris neutre #D8D5D1 ; wordmark Anton ; wrapper rouge, « CARAMEL CACAHUÈTE », pastille 20g.
- Photo de l'opérateur (fournie) — roux, barbe fournie, lunettes rondes dorées, t-shirt gris, bracelets noirs.
- assets/fonts/ — Anton et Inter (woff2 locaux, OFL).

## Customizations

- Aucun audio dans le MP4 : la voix off sera enregistrée par l'utilisateur. Livrer `out/cues.json` (repères SFX).
- Toute la chronologie (scènes, répliques, mots, beats, cues) dans `timeline.json` ; `npm run sync` régénère le reste.
- Sous-titres mot à mot désactivables (`subtitles.enabled` dans timeline.json).
- Phase 4 (9:16) : seulement sur demande.

## Notes

- Décision A (validée) : le t-shirt de l'opérateur est un gris neutre assombri — exception assumée à la règle « gris = monde placo ».
- Fond de scène : dérivé du Rouge MORDU assombri (absent de la charte).
- Aucun mot de santé à l'écran. Promesses de goût, d'ingrédients et de méthode uniquement.
- Rythme sec : out-cubic, pas de rebond, pas d'entrée en fondu, transitions par mouvements de caméra raccordés.
