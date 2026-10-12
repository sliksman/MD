#!/usr/bin/env bash
# Vérifie le MP4 rendu, pas les captures : durée, nombre d'images, pistes,
# chaque raccord de scène image par image (±2), planche contact toutes les 0,5 s.
# Usage : bash scripts/verify-mp4.sh [out/mordu-spot-16x9.mp4]
set -euo pipefail
cd "$(dirname "$0")/.."
MP4="${1:-out/mordu-spot-16x9.mp4}"
OUT="review/mp4"
mkdir -p "$OUT"
ffprobe -v error -show_entries format=duration:stream=codec_type,codec_name,width,height,r_frame_rate -of compact "$MP4"
echo "images : $(ffprobe -v error -count_frames -select_streams v:0 -show_entries stream=nb_read_frames -of csv=p=0 "$MP4")"
# Raccords : 5 images autour de chaque début de scène (lus dans timeline.json).
for start in $(node -e "for (const s of require('./timeline.json').scenes) console.log(s.start)"); do
  f0=$(node -e "console.log(Math.max(0, Math.round($start*30)-2))")
  ffmpeg -v error -y -i "$MP4" -vf "select='between(n\,$f0\,$((f0+4)))',scale=384:-1,tile=5x1" -vsync 0 -frames:v 1 -update 1 "$OUT/raccord-$start.png"
done
# Planche contact : une image toutes les 0,5 s (120 vignettes).
ffmpeg -v error -y -i "$MP4" -vf "fps=2,scale=320:-1,tile=12x10" -frames:v 1 -update 1 "$OUT/planche.png"
echo "→ $OUT/raccord-*.png, $OUT/planche.png"
