# « Heure de fin » — nouveau format (pilote) : résumé pour reprendre

Dépôt `sliksman/md`, branche `claude/new-session-aic5g9`, dossier `listen-fin/`. Même histoire que l'ép. 1 (`listen-coucher`, v9 intacte),
écrite et montée pour la rétention : ≈ 49 s au lieu de 76 s. Voix ElevenLabs Laura (`voix.mp3`) + SRT Premiere (`voix.srt`) de l'utilisateur.

## Ce qui change par rapport à l'ép. 1
- **Compteur permanent** « avant ton réveil » (composition `compositions/counter.html`) : gros → petit → gros (ambre → crème), à la seconde, deux sauts dans le temps
  (00:45 puis 00:50). Les valeurs sont des `<text>` allumés par `tl.set` (aucun callback : seek-safe).
- **Sous-titres en haut** (y = 450), sous le compteur, tout le film. Pour la dernière phrase ils sont masqués (`captionY` hors cadre) : le titre « Et toi, c'est quoi ton heure de fin ? » les remplace.
- **Un seul volet ambre** (avant la règle 1). Les autres raccords sont des coupes calées sur la voix ou des continus (dive dans l'écran, rétrécissement du téléphone).
- **Pas de pulsation de caméra** : `L.slam(…, { noPunch: true })`. La caméra pousse en continu, se retire pour le gag, dézoome sur le mur de traits.
- **Le téléphone n'est jamais rallumé en main après la règle 1** : Listen se lance, le téléphone est retourné (liseré néon), « sans l'écran ».
- Le néon (cyan → violet → magenta) n'apparaît qu'au plan 4.

## Chaîne
Même chaîne que les autres épisodes. Spécificités :
- `assets/audio/vo_norm.mp3` est la voix **normalisée en volume** (`loudnorm`), indispensable : la détection de parole de `srt_align.py` est calibrée sur un niveau normalisé (sinon les mots s'entassent).
- `scripts/breathe.py` : 6 respirations (`GAPS`), dont 4 sur les raccords de plan (0,3 à 0,7 s) ; `TAIL = 0.6`.
- `scripts/sync.mjs` n'écrit plus de titre d'ouverture et ajoute la composition `counter`.
- Scènes : `p1-hook` (0–14,5 s) · volet · `p2-regle1` (→ 22,7) · `p3-alarme` (→ 30,3) · `p4-regle2` (→ 41,8) · `p5-fin`.
- Kit : ajouts `A.ruleNum`, `A.tally`, `A.heldPhone`, `A.tablePhoneLit`, `A.downPhone`, `A.alarmPhone`, `A.void`, et `L.slam(…, { noPunch })`.
- **Ancrage des caméras :** `O = "540 800"` dans toutes les scènes (axe du lit, hauteur de la tête). Un ancrage à gauche (470) fait zoomer « vers la gauche » : le sujet dérive hors du centre. Si on change le cadrage, garder l'ancrage sur le sujet, pas sur la table de nuit.
- Pièges appris : `transformOrigin: "230px 744px"` est mal interprété sur un groupe SVG → utiliser `svgOrigin: "230 744"` ; ne pas animer `x` sur un groupe qui porte déjà un attribut `transform="rotate(…)"` (animer le groupe enfant).

## Écarts voix / script à vérifier (l'utilisateur est le seul à avoir écouté la prise)
- « Tu le poses » : la transcription Premiere dit « tu poses ». Texte à l'écran aligné sur la prise : « Tu poses. »
- « Sur Listen, » : le SRT dit « sur les sons » (probablement la prononciation de « Listen »). Texte à l'écran : « Sur Listen, ». **À vérifier à l'oreille.**
- « Une alarme, pas pour dormir, pour poser le téléphone » et « Minuit cinquante, six heures dix » : ponctuation de la prise légèrement différente, sans effet sur les mots.

## Points encore ouverts (inchangés)
Nom réel de la piste « Terrasse de café » dans Listen · « lien en bio » ou « App Store » · mention publicitaire · cohérence « rien n'est synthétisé » (voix IA, bruitages synthétiques) ·
aucun rendu revu en mouvement par moi (images fixes seulement) · rétention non mesurée.
