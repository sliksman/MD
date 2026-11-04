# « Astronaute » — épisode Listen, décors immersifs

Script (user) : « Si t'étais astronaute, tu dormirais comment ? … Sur Listen, t'écoutes des vrais endroits de la Terre, enregistrés sur place. Si t'en mettais un ce soir ? » (≈ 135 mots, ≈ 48 s estimées).
Même DA (personnages ronds, plongée du lit de la série), mais décors plus riches : station (panneaux, rivets, grilles, câbles, rampes, hublots), 3 plans de profondeur, objets qui flottent. Deux températures : bleu acier froid (station) / ambre chaud (Terre). Néon (cyan → violet → magenta) réservé à « Sur Listen » (plans 15-16). Pas de carte de fin (à confirmer). Boucle : la fin (lit) rejoint le début (le lit qui décolle).

Storyboard : `storyboard.html` (16 croquis, `node scripts/build-storyboard.mjs`).
À faire : le user donne voix + SRT ; pipeline = celui de `listen-dessous` (srt_align → breathe → sync → rendu → stems + sounddesign). Pièges connus : le SRT du user étend les blocs jusqu'au souffle de fin (mots mal calés → `overrides` à la main) ; vérifier le dernier mot de chaque sous-titre ; pas de coupe sur le même cadrage (jump cut).
