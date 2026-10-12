#!/usr/bin/env bash
# Bande d'images extraite du MP4 : strip.sh <début_s> <fin_s> <nb_images> <sortie.png> [mp4]
set -euo pipefail
cd "$(dirname "$0")/.."
A="$1"; Z="$2"; N="$3"; OUT="$4"; MP4="${5:-out/mordu-spot-16x9.mp4}"
F0=$(node -e "console.log(Math.round($A*30))"); F1=$(node -e "console.log(Math.round($Z*30))")
STEP=$(node -e "console.log(Math.max(1, Math.floor(($F1-$F0)/Math.max(1,$N-1))))")
COLS=$(node -e "console.log(Math.min($N,5))"); ROWS=$(node -e "console.log(Math.ceil($N/5))")
ffmpeg -v error -y -i "$MP4" -vf "select='between(n\,$F0\,$F1)*not(mod(n-$F0\,$STEP))',scale=384:-1,tile=${COLS}x${ROWS}" -vsync 0 -frames:v 1 -update 1 "$OUT"
