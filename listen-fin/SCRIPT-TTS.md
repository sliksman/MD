# Nouveau format (pilote, histoire de l'ép. 1) — script v2 prêt pour la voix

## Texte à l'écran (sous-titres = ce texte exact)

```
Dans six heures vingt-six, ton réveil sonne. Et toi, tu scrolles.
Minuit trente-quatre. T'as posé ton téléphone deux fois. Il est revenu deux fois.
Cette négo, tu la perds depuis des mois. Et c'est pas une question de volonté.
Règle numéro un : décide de ton heure de fin, pas de ton heure de coucher. Une alarme. Pas pour dormir. Pour poser le téléphone.
Elle sonne. Tu l'éteins. Elle sonne. Tu le poses.
Et là, ta chambre fait un silence pas possible.
Règle numéro deux : remplis ce silence. Sur Listen, une terrasse de café, enregistrée sur place. Tu lances, tu retournes le téléphone. Le bruit des autres, sans l'écran.
Minuit cinquante. Six heures dix devant toi. Téléphone retourné. Et toi, c'est quoi ton heure de fin ?
```

## Ce qui a changé et pourquoi
| Avant | Après | Raison |
|---|---|---|
| « Alors Listen. » | « Règle numéro deux : remplis ce silence. Sur Listen, » | « Règle numéro un » sans règle deux laissait une liste ouverte. Listen devient la règle 2 : l'attente créée par le « un » est payée. |
| (rien) | « Tu lances, tu retournes le téléphone. » | Contradiction centrale : on pose le téléphone puis on le reprend pour une app. Ici on lance le son et on retourne l'écran (lecture en arrière-plan, fonction de l'app). |
| « Le bruit des autres, sans sortir. » | « Le bruit des autres, sans l'écran. » | « Sans sortir » ne sert pas le propos ; « sans l'écran » le ferme. |
| « Téléphone posé. » | « Téléphone retourné. » | Écho exact de l'action de la règle 2 : l'image finale prouve la règle. |

Heures : 00:34 + 6 h 26 = 7:00 · alarme 00:45 (+ 6 h 15) · 00:50 + 6 h 10 = 7:00.

## Version à coller dans ElevenLabs (Laura, Eleven v4, vitesse 1.0, une prise)
Seul changement pour la voix : les deux-points deviennent des virgules (lecture plus naturelle).

```
Dans six heures vingt-six, ton réveil sonne. Et toi, tu scrolles.
Minuit trente-quatre. T'as posé ton téléphone deux fois. Il est revenu deux fois.
Cette négo, tu la perds depuis des mois. Et c'est pas une question de volonté.
Règle numéro un, décide de ton heure de fin, pas de ton heure de coucher. Une alarme. Pas pour dormir. Pour poser le téléphone.
Elle sonne. Tu l'éteins. Elle sonne. Tu le poses.
Et là, ta chambre fait un silence pas possible.
Règle numéro deux, remplis ce silence. Sur Listen, une terrasse de café, enregistrée sur place. Tu lances, tu retournes le téléphone. Le bruit des autres, sans l'écran.
Minuit cinquante. Six heures dix devant toi. Téléphone retourné. Et toi, c'est quoi ton heure de fin ?
```

Respirations (après « sonne » au début, avant « Règle numéro deux ») : pas besoin de les marquer dans le texte,
je les insère au montage (`scripts/breathe.py`), comme sur les épisodes précédents : c'est plus précis et ça ne
dépend pas de la prise. Je ne sais pas si Eleven v4 respecte de façon fiable une balise de pause, je ne m'y fierais pas.

Ensuite : le MP3 et le SRT de la prise (transcription Premiere).
