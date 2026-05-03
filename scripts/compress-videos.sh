#!/usr/bin/env bash
# Compress every .mp4 in private/videos/ into private/videos/compressed/.
# Skips files that already have a compressed counterpart unless FORCE=1.
#
# Knobs:
#   CRF=26          quality (lower=bigger/better; 23 default, 26 noticeably smaller, 28 visibly soft)
#   PRESET=slow     encoder effort (faster | medium | slow | veryslow)
#   CODEC=h264      h264 | h265
#   HEIGHT=1080     downscale target height (try 720 to roughly halve again)
#   FORCE=1         re-encode even if output already exists
#
# Examples:
#   ./scripts/compress-videos.sh
#   CRF=28 CODEC=h265 ./scripts/compress-videos.sh
#   ./scripts/compress-videos.sh band.mp4   # one file only

set -euo pipefail

CRF="${CRF:-26}"
PRESET="${PRESET:-slow}"
CODEC="${CODEC:-h264}"
HEIGHT="${HEIGHT:-1080}"
FORCE="${FORCE:-0}"

SRC_DIR="$(cd "$(dirname "$0")/.." && pwd)/private/videos"
OUT_DIR="$SRC_DIR/compressed"
mkdir -p "$OUT_DIR"

case "$CODEC" in
  h264) VCODEC=(-c:v libx264 -preset "$PRESET" -crf "$CRF") ;;
  h265) VCODEC=(-c:v libx265 -preset "$PRESET" -crf "$CRF" -tag:v hvc1) ;;
  *) echo "CODEC must be h264 or h265"; exit 1 ;;
esac

if [ "$#" -gt 0 ]; then
  FILES=("$@")
else
  FILES=("$SRC_DIR"/*.mp4)
fi

human() { du -h "$1" 2>/dev/null | cut -f1; }

printf "codec=%s crf=%s preset=%s height=%s\n\n" "$CODEC" "$CRF" "$PRESET" "$HEIGHT"

for input in "${FILES[@]}"; do
  [ -f "$input" ] || { echo "skip (not a file): $input"; continue; }
  name="$(basename "$input")"
  output="$OUT_DIR/$name"

  if [ -f "$output" ] && [ "$FORCE" != "1" ]; then
    printf "skip %-25s (exists; FORCE=1 to re-encode)\n" "$name"
    continue
  fi

  before="$(human "$input")"
  printf "→ %-25s (%s) ... " "$name" "$before"
  start=$(date +%s)

  ffmpeg -hide_banner -loglevel error -y \
    -i "$input" \
    "${VCODEC[@]}" \
    -vf "scale=-2:${HEIGHT}" \
    -c:a aac -b:a 96k -ac 2 \
    -movflags +faststart \
    "$output"

  after="$(human "$output")"
  elapsed=$(( $(date +%s) - start ))
  printf "done in %ds: %s → %s\n" "$elapsed" "$before" "$after"
done

echo
echo "Originals  total: $(du -sh "$SRC_DIR"  --exclude=compressed 2>/dev/null | cut -f1)"
echo "Compressed total: $(du -sh "$OUT_DIR" | cut -f1)"
