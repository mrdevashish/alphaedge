#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail
REPO_DIR="$HOME/alphaedge"
API_BASE="https://alphaedge-backend.onrender.com"   # Render backend URL

cd "$REPO_DIR"
git config --global --add safe.directory "$REPO_DIR" || true
git pull --rebase origin main || true

# ---- sync frontend to /docs ----
if [ -d frontend ]; then
  mkdir -p docs
  find docs -mindepth 1 -not -name ".nojekyll" -exec rm -rf {} +
  cp -R frontend/* docs/
fi
mkdir -p docs
touch docs/.nojekyll

# ---- patch API_BASE in served JS ----
for f in docs/auto.js docs/tv.js; do
  [ -f "$f" ] || { echo "[!] $f missing"; continue; }
  sed -i 's|http://127\.0\.0\.1:[0-9]\+|'"$API_BASE"'|g' "$f"
  sed -i 's|https://127\.0\.0\.1:[0-9]\+|'"$API_BASE"'|g' "$f"
  sed -i 's|http://localhost:[0-9]\+|'"$API_BASE"'|g' "$f"
  sed -i 's|^\s*\(const\|let\)\s*API_BASE\s*=.*$|const API_BASE = "'"$API_BASE"'";|g' "$f"
done

TS="$(date +%s)"   # cache-bust
for h in docs/*.html; do
  [ -f "$h" ] || continue
  sed -i 's|\(src="\.\/\)\(auto\|tv\)\(.js\)"|\1\2\3?v='"$TS"'"|g' "$h"
  sed -i 's|\(src="\)\(auto\|tv\)\(.js\)"|\1\2\3?v='"$TS"'"|g' "$h"
done

git add -A
git commit -m "Redeploy: sync docs + API_BASE patched + v=$TS" || true
git push origin main
