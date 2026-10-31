# Série « Les nuits blanches » (app Listen) — résumé de réalisation pour reprendre dans une nouvelle fenêtre

Dépôt `sliksman/md`, branche `claude/nifty-fermat-dui0lb`. Trois dossiers : `listen-sommeil/` (épisode 3), `listen-coucher/` (épisode 1), `listen-lit/` (épisode 2).

## 1. Le projet
- **Commande** : vidéos TikTok verticales (1080×1920, 30 i/s, français) qui ressemblent à du contenu « astuces sommeil » mais sont des **pubs déguisées pour l'app iPhone « Listen – Sounds of the World »** (sons du monde réel enregistrés sur place, minuteur de sommeil, mode « Fermez les yeux », interface sombre en Poppins, icône anneau néon cyan→violet→magenta). L'app n'apparaît qu'à la 3ᵉ astuce, comme un soulagement.
- **Style** : inspiré de @catcharium (connu seulement par 4 captures) : vues de dessus/en coupe, chemins de points lumineux, pastilles reliées à un point d'ancrage, sous-titres mot à mot avec mots-clés en ambre, titres en serif italique avec surtitre en capitales espacées. Rendu « 2D fausse 3D » (vectoriel, ombres douces).
- **Outil** : HyperFrames (HTML + SVG + GSAP rendu en vidéo), CLI épinglée `hyperframes@0.8.157`.
- **Utilisateur** : monteur / motion designer (6 ans), humour méta, **veut des retours honnêtes, qu'on le challenge, qu'on ne flatte pas et qu'on dise quand on ne sait pas**. Il fournit lui-même la voix (ElevenLabs « Laura », modèle Eleven v4, vitesse normale, une prise) et le SRT (transcription Premiere), et cale sa musique lui-même.

## 2. État
| Épisode | Dossier | Titre | État |
|---|---|---|---|
| 3 | `listen-sommeil` | Pourquoi tu dors toujours pas ? | Terminé, livré (82,7 s). Pas repris depuis les améliorations des épisodes 1 et 2 (voir §8). |
| 1 | `listen-coucher` | Pourquoi tu te couches toujours trop tard | Livré en version 9 (76,17 s), dernier retour traité. |
| 2 | `listen-lit` | Pourquoi ton lit ne te fait plus dormir | Livré en version 2 (80,97 s), en attente de retours. |

Livrables par épisode (dans `out/`, versionnés avec `git add -f` car `out/*.mp4` est ignoré) : master HD **sans son** (`listen-epN-hd_sans-son.mp4`, ≈ 43–46 Mo, donc au-dessus de la limite d'envoi de 30 Mo : on donne les liens GitHub blob/raw), `listen-epN-sons-separes.zip` (WAV 48 kHz, pleine durée, calés à 0), `cues.json` (repères en secondes et en images). La voix avec respirations est `assets/audio/vo_v2.mp3`. **Pas de musique** dans les livrables.

## 3. Ce que dit chaque épisode
- **Ép. 1** (ressort : l'ouverture requalifie le problème, ce n'est pas l'insomnie c'est la procrastination ; chaque astuce échoue) : 00:34 sur le canapé → « pas envie d'y aller », le téléphone posé revient 3 fois, score TOI 0 – ÉCRAN 7 → astuce 1 : heure de fin + réveil ambre qui sonne puis est balayé → astuce 2 : carte de la journée en anneau de 24 h, 20 min découpées en ambre, « c'est l'heure à laquelle tu le prends » → lit à l'heure, silence → astuce 3 : Listen (piste « Terrasse de café ») → canapé/lit → « Et toi, c'est quoi ton heure de fin ? ».
- **Ép. 2** (ressort : le lit est un personnage qui a démissionné ; la question est « est-ce que je récupère mon lit ? ») : lit en coupe avec des yeux, objets qui tombent dedans, lettre de démission → astuce 1 : le lit sert à dormir, les objets sont expulsés, plan du studio « même à un mètre », échec : le plafond connu par cœur → astuce 2 : « sors de ton lit » (contrôle du stimulus), maison vue de dessus, salon à 2 h du mat' (lampe à abat-jour en forme de tête et d'épaules) → astuce 3 : Listen (pluie, forêt), téléphone face contre table sur le canapé → lit retrouvé, badge « LIT · métier : dormir » → « Et toi ? ».
- **Ép. 3** : voir `listen-sommeil/RESUME-POUR-CLAUDE.md` (chaussettes, cognitive shuffle, voisin, pluie).

## 4. Direction artistique (à respecter)
- Palette : nuit indigo #121633 / #1d2350, **ambre #F5B85A = la décision / l'alarme / les mots-clés / les volets**, crème #F1EDE4, bleu froid #9cc8ff = l'écran (le problème). **Néon cyan #3BD6F5 / violet #7B5CFF / magenta #E04FD8 réservés à Listen**, jamais avant l'app.
- Polices : Fraunces Italic (titres), Nunito 800/900 (sous-titres, pastilles), Poppins (interface Listen).
- Zones sûres TikTok : rien d'important dans la colonne d'icônes à droite (x > 920, y 780–1520), sous la légende (y > 1530), ni en haut (y < 150).
- **Volet jaune ambre** à bord biseauté entre les plans, posé dans une respiration de la voix. Plans continus sinon (caméra, dézoom, zoom), jamais de diaporama ni de « carte posée ».
- Points de progression ambre en haut à droite (x 820/876/932, y 212) : 0/3 → 3/3.
- Titre d'ouverture : surtitre justifié sur la largeur de la 1ʳᵉ ligne (textLength), 2ᵉ ligne agrandie pour l'égaler, animation d'entrée comme l'épisode 3 (surtitre en fondu, lignes avec rebond), disparition avant la 1ʳᵉ phrase.
- Personnage : mannequin minimal (tête ronde, deux yeux, buste étroit — il a été jugé « obèse » au début). Épisode 2 : la tête de lit a des yeux (c'est elle le personnage).

## 5. Chaîne technique (par épisode, mêmes scripts copiés)
Fichiers : `timeline.base.json` (**le fichier à éditer**, temps de la voix d'origine) → `scripts/srt_align.py` (alignement des mots sur le SRT + groupes de sous-titres) → `scripts/breathe.py` (insère les respirations `GAPS`, écrit `assets/audio/vo_v2.mp3` et `timeline.json`) → `scripts/sync.mjs` (écrit `timeline.js`, `index.html`, `compositions/pN-*.html` depuis `src/scenes/*.js`, `out/cues.json`) → `scripts/stems.py` (WAV séparés par famille d'ID : wipe, cam, pop, hit, flop, slide, alarm).
```
python3 scripts/srt_align.py && python3 scripts/breathe.py && node scripts/sync.mjs
npx --yes hyperframes@0.8.157 snapshot --at 1.2,5.4,... --no-end -o /tmp/x     # contrôle d'images
npx --yes hyperframes@0.8.157 render --quality delivery --fps 30 -o out/epN-render.mp4   # ≈ 10 min
ffmpeg -y -i out/epN-render.mp4 -an -c:v copy out/listen-epN-hd_sans-son.mp4
python3 scripts/stems.py && (cd out && zip -qj listen-epN-sons-separes.zip stems/*.wav)
git add -f listen-X/out/listen-epN-hd_sans-son.mp4 listen-X/out/*.zip listen-X/out/cues.json
```
- Kit : `kit/kit.js` (window.LS ; `L.art(prefix)` renvoie les dessins `A.*` — pastilles, titres, `bigNum`, `dots`, lit/canapé/horloges/réveil/anneau de 24 h/plan de studio/lit en coupe/salon/lampe-tête, interface Listen `A.phoneUI` — et les animations `L.pill`, `L.slam`, `L.pop`, `L.drawDots`, `L.blink`, `L.shut`, `L.lids`, `L.cam`, `L.setText`). Le préfixe d'art doit être égal à l'id du stage + « - ».
- Chaque scène `src/scenes/pN-*.js` reçoit `ID, L, A, sc, w, tl, root, gsap` ; `w("L07", 3)` = temps (scène) du 4ᵉ mot de la réplique L07.
- Contrôle rapide des scènes sans rendu : `scripts/check-scenes.cjs` (Playwright ; lancer `python3 -m http.server 8767` dans le dossier de l'épisode, puis `node scripts/check-scenes.cjs http://localhost:8767 '{"p1":"p1-xxx",...}'`). `npx hyperframes check` complet dépasse son délai : utiliser snapshot.
- Pièges appris : (1) `tl.call` ne se déclenche pas en seek → utiliser des `set`/opacités ; (2) `svgOrigin` : ne le donner qu'au premier tween de caméra, jamais aux suivants si `x,y` sont aussi animés ; (3) un `fromTo` ajouté plus tard sur la même propriété doit avoir `immediateRender:false` ; (4) les ids des yeux : `A.eyes("eyes",…)` ; autre nom → passer le nom à `L.blink/L.shut` ; (5) aucun mot ne doit tomber après la coupe de plan (les sous-titres sont bornés à la fin de leur plan).

## 6. Sous-titres et alignement (leçon centrale des épisodes 1 et 2)
- **Texte affiché = texte exact du script** (ponctuation de l'auteur). Le SRT ne sert **qu'aux temps** : sa transcription est « normalisée » par Premiere (« Ce n'est pas que tu n'arrives pas », « 0 h 34 », « appli Sun »…), donc `timeline.base.json` contient `aliases` (regex qui ramènent le SRT au vocabulaire du script avant l'appariement), `overrides` (temps imposés à la main) et `endOverrides`.
- Groupes de sous-titres = **ponctuation du script** (fin de phrase, virgule), mot seul uniquement s'il finit une phrase (« Un. », « Deux. »), coupe si > 6 mots ou > 32 signes (jamais après « de », « ton », « que »…), fusion si < 0,45 s, départs recalés sur le début de parole le plus proche (± 0,3 s). Le diagnostic `⚠` d'`srt_align.py` signale tout mot hors de son sous-titre SRT.
- Position verticale des sous-titres : `captionY` par plage de temps, toujours **sous** les éléments du plan.

## 7. Retours de l'utilisateur à ne plus reproduire
Trop rapide / pas le temps de lire (ajouter des respirations, tenir les titres) · transitions brouillonnes → volet jaune simple · **pas de pulsations de caméra « pour du mouvement »** (les chiffres et sous-titres qui claquent sont OK) · pas de bruit de pluie · pas de musique dans les livrables · sous-titres qui passent sur des éléments · pastilles qui se superposent · collisions texte/chiffres (score, titre/horloge) · éléments en trop sur des images de storyboard (germe du chiffre, rond jaune) · le **premier plan ne doit jamais rester statique** (ép. 1 : fil qui défile, horloge qui avance, caméra qui se rapproche, 3 allers-retours du téléphone) · pas de jump cut brutal, **un seul téléphone visible à la fois** · lit ou canapé « qui ne ressemble à rien » → soigner la lisibilité des objets · bien cadrer par rapport au script (« Le problème » n'est pas un début de phrase) · plan final lisible (le personnage doit se voir sur le canapé) · storyboard validé avant l'animation. Il a aimé : le dynamisme de l'épisode 2, les chiffres et sous-titres qui claquent.

## 8. Points ouverts
1. **Lien tracké** : « Listen · App Store » fait chercher l'app par son nom (hors lien tracké). Carte de fin des ép. 1 et 2 : « Sounds of the World · **lien en bio** » (choix réversible, non validé). Les liens dans la description TikTok ne sont, à ma connaissance, pas cliquables, et le lien en bio dépend du type de compte (non vérifié). L'ép. 3 dit encore « App Store ». À décider avec le client ; pistes : publicité avec bouton, page produit App Store dédiée.
2. **Mention publicitaire** (« Publicité » / « Collaboration commerciale » / contenu de marque TikTok) : à prévoir.
3. **Noms réels de pistes dans Listen** : « Pluie régulière » (ép. 3), « Terrasse de café » (ép. 1), « Pluie » / « forêt » (ép. 2) ne sont pas vérifiés.
4. **Cohérence de marque** : l'app promet « rien n'est synthétisé » ; les vidéos utilisent une voix IA et des bruitages synthétiques provisoires (`assets/sfx/*.wav`, dont le bip de réveil de l'ép. 1).
5. **Ép. 2 « Dormir, et ce que tu sais »** : clin d'œil adulte dans une pub bien-être → validation du client. Le conseil « sors du lit » vient du contrôle du stimulus (thérapie du sommeil) ; source citée de mémoire, à vérifier avant toute légende.
6. **Allégations** : le script garde « peut aider », « à tester ». Ép. 1 : étude « procrastination au coucher » citée de mémoire (Kroese et al., 2014), non vérifiée.
7. **Rétention** : les dispositifs (points de progression, échec de chaque astuce, produit en soulagement à ≈ 79–85 % du film, boucle) sont des principes courants, **pas des données** ; seules les stats TikTok trancheront.
8. **Aucun rendu n'a été revu en mouvement par moi** (contrôle par images fixes uniquement) ; l'utilisateur est le seul à avoir vu/entendu les films.
9. L'ép. 3 n'a pas reçu : alignement par ponctuation du script, volets/sous-titres bornés, mannequin affiné, titre justifié, « lien en bio ».
10. Question laissée à l'utilisateur : la coupe à 60 s est refusée dans les faits (il enregistre le script complet) — ép. 1 : 203 mots / 76 s, ép. 2 : 214 mots / 81 s ; ces durées sont longues pour TikTok.

## 9. Limites de l'environnement
Pas d'accès à TikTok ni à l'App Store depuis le conteneur (captures de l'utilisateur seulement) ; Whisper/Hugging Face bloqués (on utilise le SRT de l'utilisateur) ; connecteur ElevenLabs trop coûteux (l'utilisateur génère la voix) ; `SendUserFile` limité à 30 Mio ; un rendu sans GPU prend ≈ 10 min ; les fichiers temporaires vont dans le scratchpad de la session.

## 10. Pour continuer
Retours sur l'ép. 2 → ajuster `src/scenes/*.js` ou `timeline.base.json`, relancer la chaîne, snapshot, rendu, livrer. Éventuellement reprendre l'ép. 3 avec les améliorations, préparer un ép. 4, ou aider à la mise en ligne (couverture, légende, mention pub, lien).
