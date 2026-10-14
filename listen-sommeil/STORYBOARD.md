---
format: 1080x1920
duration: 75s
message: "Quand rien ne marche pour t'endormir, un fond sonore doux sur Listen peut faire le reste."
arc: Galère → astuce 1 (corps) → astuce 2 (tête) → rechute (voisin) → astuce 3 (Listen) → question
audience: TikTokeurs FR qui scrollent au lit, fatigués, 18–35
mode: collaborative
version: v2
---

# Listen — « Les nuits blanches, épisode 3 »

## Décisions

- **Message** : quand rien ne marche pour t'endormir, un fond sonore doux sur Listen peut faire le reste.
- **Format** : 1080×1920, ~75 s, voix off IA FR (ElevenLabs), SFX + ambiance. Sous-titres mot à mot.
- **Zone utile TikTok** : contenu clé dans x 60–900 / y 160–1500. Sous-titres centrés autour de y ≈ 1240, largeur ≤ 820. Rien d'important à droite de x 900 entre y 800 et 1500 (icônes), rien sous y 1520 (légende).
- **Fil rouge (spine)** : une seule chambre-diorama, la nuit. On ne change jamais de « carte » : la caméra passe d'un angle à l'autre dans le même monde — vue du dessus (comme la carte de l'étang), plongée, vue en coupe (comme le sol coupé). Les **chemins de points lumineux** changent de sens selon l'astuce : chaleur (ambre), pensées en boucle (blanc), bruit du voisin (points durs, saccadés), pluie (points bleus doux).
- **Objet héros** : le téléphone sur la table de nuit, écran noir dès 01. Il revient en 12 (il s'allume sur Listen) et en 14 (icône).
- **Grammaire Catcharium** : surtitre capitales espacées + titre serif italique avec mot ambre ; pastilles sombres translucides reliées par un trait à un point d'ancrage ; sous-titres sans-serif gras arrondi, blanc, mots-clés ambre.
- **Rendu** : 2D « fausse 3D » — aplats vectoriels avec dégradés radiaux, ombres portées douces, occlusion au contact, brouillard bleu en profondeur, grain léger.
- **Palette** : nuit indigo (fond #121633 → #1d2350), lune/froid #8fa3d9, accent ambre #F5B85A (chaleur, mots-clés, points), blanc cassé #F1EDE4. Le dégradé néon de Listen (cyan #3BD6F5 → violet #7B5CFF → magenta #E04FD8) est **réservé** à 12–14 : l'app « rallume » la vidéo.
- **Typo** : titres Fraunces Italic (serif doux) ; sous-titres et pastilles Nunito ExtraBold/Bold ; UI Listen en Poppins (sa vraie police).
- **Interdits** : pas de diaporama (chaque beat = un mouvement de caméra ou une transformation, jamais une nouvelle carte posée) ; pas d'économiseur d'écran (chaque mouvement de points dit quelque chose) ; pas de néon avant Listen ; pas de fausse fonctionnalité Listen ; pas de mot santé type « guérir / médical ».
- **Frame tenu** : 13 — la pluie tombe, rien d'autre ne bouge, la phrase se pose.
- **Vérité** : interface Listen reconstruite d'après les captures App Store (écran « Concentration et sommeil »). Le titre de piste « Pluie régulière » est une hypothèse à confirmer dans l'app.
- **Durée** : à débit naturel le script fait ~80–85 s. Pour tenir 75 s : voix à vitesse ~1.08–1.1 et silences serrés. La vraie durée de la voix fait foi.

## Changes from v1

- Retour : « J'aime beaucoup la DA visuelle. C'est frais. Effectivement, les jambes sont pas visibles. Peut-être donner plus de forme aux pieds pour qu'on comprenne. »
- 04 : caméra au pied du lit, deux plantes de pied en chaussettes (talon / voûte / orteils, talon et pointe contrastés), tête au fond.
- 05–06 : jambe de profil dans une poche d'air sous la couette coupée, pied orteils en l'air, chaussette avec revers ; vaisseaux qui suivent la jambe jusqu'au pied, arcs de chaleur qui partent du pied.

## Still open

- Nom réel d'une piste de pluie dans Listen (sinon « Pluie régulière » reste marqué « à confirmer »).
- Voix : génération ElevenLabs bloquée (« Free Tier access has been disabled ») — à régler avant l'audio.

## Frame 1 — Réveil

- scene: Vue du dessus du lit dans le noir ; réveil « 07:00 » en pastille ; titre de série
- duration: 3s
- transition_in: cut
- status: built
- src: compositions/01-reveil.html
- voiceover: "Demain, tu te lèves à sept heures."

Vue du dessus façon carte de l'étang : le lit (couette bleu nuit, oreiller), la table de nuit avec réveil et **téléphone écran noir**. Surtitre « LES NUITS BLANCHES · ÉPISODE 3 », titre serif « Pourquoi tu *dors* toujours pas ? ». Pastille « 07:00 » ancrée sur le réveil. Mouvement : léger zoom avant continu (0 → 3 s), le titre se compose mot par mot. Seam : la caméra bascule en plongée (rotation de plan vers le bas). Pourquoi : la promesse (dormir) et l'enjeu (7 h) en 3 s.

## Frame 2 — Insomnie

- scene: Plongée sur le lit ; deux yeux grands ouverts dans le noir ; horloge qui avance d'1 h
- duration: 5.7s
- transition_in: camera-tilt
- status: built
- src: compositions/02-insomnie.html
- voiceover: "T'es fatigué, ça fait 1h que la lumière est éteinte, mais impossible de dormir !"

Le perso-mannequin (tête ronde, sans genre marqué) dans le lit, deux yeux blancs ouverts. Le réveil défile 23:04 → 00:04, pastille « +1 h ». La lampe de chevet s'éteint au début (ombre qui tombe). Mot ambre « impossible ». Non : pas de moutons à compter (cliché).

## Frame 3 — Oreiller

- scene: L'oreiller se retourne, compteur « 6ᵉ fois » ; trois points ambre apparaissent
- duration: 5s
- transition_in: continuous
- status: built
- src: compositions/03-oreiller.html
- voiceover: "Alors avant de retourner ton oreiller une sixième fois, essaie ces trois choses."

L'oreiller fait 5 retournements rapides (compteur pastille 1…5), le 6ᵉ est bloqué en l'air par une main-pastille « stop ». Puis trois points ambre s'allument au-dessus du lit (1 · 2 · 3) : ce sont les trois astuces, ils serviront de sommaire. Seam : la caméra glisse vers le pied du lit.

## Frame 4 — Astuce 1 : chaussettes

- scene: Numéro « 1 » serif ; les pieds sortent de la couette, des chaussettes s'enfilent
- duration: 3.2s
- transition_in: camera-pan
- status: built
- src: compositions/04-chaussettes.html
- voiceover: "Un. T'as chaud, alors mets des chaussettes."

Caméra au pied du lit. Le 1er point ambre devient « 1 » serif italique. Les deux plantes de pied dépassent de la couette (talon, voûte, orteils lisibles) ; les chaussettes glissent dessus, talon et pointe contrastés. Au fond, la tête dépasse. Pastille « chaussettes ». Humour : pastille « t'as chaud » sur le perso avec un petit thermomètre rouge.

## Frame 5 — Le paradoxe

- scene: Vue en coupe de la jambe : chaleur ambre dans les pieds, flèche corps « refroidir »
- duration: 5.7s
- transition_in: cutaway
- status: built
- src: compositions/05-paradoxe.html
- voiceover: "Aussi bizarre que ça puisse paraître, réchauffer tes pieds peut aider ton corps à refroidir."

La couette « se coupe » comme le sol chez Catcharium : sous les strates, la jambe de profil, pied orteils en l'air. Les chaussettes émettent une lueur ambre. Pastille « pieds : chauds » en bas, pastille « corps : à refroidir » en haut. Mots ambre « réchauffer » / « refroidir ».

## Frame 6 — Vaisseaux

- scene: Petits vaisseaux en points qui s'élargissent, la chaleur sort en chemins de points ; thermomètre interne qui baisse
- duration: 9.1s
- transition_in: continuous
- status: built
- src: compositions/06-vaisseaux.html
- voiceover: "La chaleur dilate les petits vaisseaux et facilite l'évacuation de la chaleur du corps. Cette baisse de température va aider ton corps à s'endormir."

Dans la coupe : trois lignes de points (vaisseaux) s'écartent (« dilate »), les points ambre migrent du tronc vers les pieds puis s'échappent dans l'air en arcs (« évacuation »), exactement comme les arcs « thud » de la référence. Pastille « température interne » sur une jauge qui descend de 37,2 → 36,8. Fin : la jambe-coupe se referme, couette lisse.

## Frame 7 — L'agenda

- scene: Coupe de la tête : la semaine tourne en boucle sur un chemin de points (LUN, MAR, MER…)
- duration: 8.6s
- transition_in: camera-pan-up
- status: built
- src: compositions/07-agenda.html
- voiceover: "Voilà, maintenant t'es confortable. Mais ta tête elle, n'est pas prête à s'endormir ! Elle a décidé de préparer toute ta semaine."

Caméra remonte vers la tête. « confortable » : pastille ✓. Puis une orbite de points blancs autour de la tête, et des pastilles qui y défilent : « LUN · réunion 9 h », « MAR · rappeler le proprio », « MER · sport ? », « JEU · trouver un cadeau », « VEN · tout ce qu'on a pas fait ». L'orbite accélère. Humour méta : une pastille « SAM · planifier dimanche ».

## Frame 8 — Astuce 2 : cognitive shuffle

- scene: « 2 » serif ; l'orbite se vide ; une pomme, puis un parapluie, puis une chaise apparaissent un à un
- duration: 7s
- transition_in: continuous
- status: built
- src: compositions/08-shuffle.html
- voiceover: "Deux. Occupe ton esprit. Imagine une pomme. Quelques secondes. Puis un parapluie. Puis une chaise."

Le 2ᵉ point ambre devient « 2 ». Les pastilles de la semaine tombent hors champ. Dans la bulle de pensée (vue du dessus, comme un étang), une **pomme** se pose, pastille « pomme » ; « Quelques secondes » : pastille mini-chrono qui se remplit ; puis **parapluie**, puis **chaise**. Chaque objet remplace le précédent (un seul à la fois).

## Frame 9 — Sans lien

- scene: Les trois objets côte à côte, aucun trait ne les relie ; pastilles barrées « histoire » / « liste »
- duration: 6.3s
- transition_in: continuous
- status: built
- src: compositions/09-sans-lien.html
- voiceover: "Des objets simples, sans lien entre eux. Pas d'histoire à construire, pas de liste à réussir."

Les trois objets reviennent ensemble ; un chemin de points tente de les relier puis s'effrite (« sans lien »). Deux pastilles « histoire » et « liste » apparaissent puis se barrent d'un trait ambre.

## Frame 10 — Le nom

- scene: Titre serif « cognitive *shuffle* » ; l'orbite des pensées se casse et se disperse
- duration: 7.7s
- transition_in: continuous
- status: built
- src: compositions/10-nom.html
- voiceover: "Ça s'appelle le cognitive shuffle : une technique à tester pour détourner ton attention des pensées qui tournent en boucle."

Surtitre « ASTUCE 2 », titre « cognitive *shuffle* ». Pastille « à tester ». Une dernière boucle de points (les pensées) tourne, puis se déroule en ligne droite et s'éteint. Les paupières du perso descendent à moitié. Pourquoi : c'est le crédit honnête — on nomme la technique sans la survendre.

## Frame 11 — Le voisin

- scene: Vue en coupe du mur : à droite le voisin à la perceuse ; arcs de points durs qui traversent la cloison ; les yeux se rouvrent
- duration: 9.2s
- transition_in: camera-pan-right
- status: built
- src: compositions/11-voisin.html
- voiceover: "Là normalement, tu es sur le point de t'endormir, mais au moment de fermer les yeux, ton voisin décide visiblement de refaire toute sa cuisine."

Les yeux presque fermés (pastille « presque… »). La caméra recule : le mur de la chambre est coupé, on voit l'appart d'à côté (cuisine en chantier, mannequin à perceuse, casque de chantier). Sur « refaire toute sa cuisine » : arcs de points blancs saccadés traversent la cloison (référence « thud »), pastille « BRRRRR » ancrée sur la perceuse. Les yeux s'ouvrent d'un coup. Le téléphone sur la table de nuit est bien visible dans le cadre.

## Frame 12 — Astuce 3 : Listen

- scene: « 3 » ; le téléphone s'allume (première apparition du néon) ; zoom dans l'écran Listen, on tape une carte pluie
- duration: 6.9s
- transition_in: zoom-into-phone
- status: built
- src: compositions/12-listen.html
- voiceover: "Trois. Essaie un fond sonore doux. Rends-toi sur l'app Listen et lance une pluie régulière, par exemple."

Le 3ᵉ point ambre devient « 3 ». Le téléphone s'allume : l'anneau néon (icône Listen) éclaire la table de nuit — premier néon du film. La caméra plonge dans l'écran : interface reconstruite (écran « Concentration et sommeil », puces Bali / tropical / vent…, collection « Sons de l'eau · 32 sons »), un doigt-point tape la carte « Pluie régulière » (à confirmer) → lecteur « À l'écoute ». Pastille « Listen ».

## Frame 13 — La pluie

- scene: Retour à la coupe du mur : la pluie, en points bleus doux, recouvre les arcs de la perceuse ; les yeux se ferment
- duration: 3.3s
- transition_in: zoom-out-of-phone
- status: built
- src: compositions/13-pluie.html
- voiceover: "Si cette ambiance t'apaise, laisse-la accompagner le moment."

**Frame tenu.** Le téléphone émet des arcs bleus doux qui se superposent aux arcs blancs du voisin et les absorbent. Pluie fine en points sur toute la chambre. Les yeux se ferment. Rien d'autre ne bouge.

## Frame 14 — Et toi ?

- scene: Retour vue du dessus (rappel de 01), perso endormi ; titre « Et *toi* ? » ; icône Listen
- duration: 4.2s
- transition_in: camera-tilt-up
- status: built
- src: compositions/14-et-toi.html
- voiceover: "Et toi ? C'est quoi tes astuces pour t'endormir ?"

Rappel exact du cadre de 01 : même vue du dessus, mais le perso dort (paupières fermées, « Zz » en pastille), le réveil indique 00:12, le téléphone diffuse de la pluie. Titre serif « Et *toi* ? », pastille « dis-le en commentaire ». Petit bloc icône Listen + « Listen – Sounds of the World » en bas de la zone utile.
