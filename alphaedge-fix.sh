#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

REPO_DIR="$HOME/alphaedge"
API_BASE="https://alphaedge-backend.onrender.com"  # <-- your Render backend URL

echo "[i] Repo: $REPO_DIR"
cd "$REPO_DIR"
git config --global --add safe.directory "$REPO_DIR" || true

echo "[i] Pulling latest from main..."
git pull --rebase origin main || true

# ---------- Sync frontend to /docs (what GitHub Pages serves) ----------
# If you already keep your final HTML/CSS/JS in docs/, this block ensures it’s up to date.
# If you build with a bundler, copy the build output to docs/ instead.
if [ -d frontend ]; then
  echo "[i] Syncing frontend -> docs/"
  mkdir -p docs
  # keep .nojekyll if it exists
  find docs -mindepth 1 -not -name ".nojekyll" -exec rm -rf {} +
  cp -R frontend/* docs/
else
  echo "[i] No frontend/ dir found, using existing docs/"
  mkdir -p docs
fi

# Ensure .nojekyll for GitHub Pages
touch docs/.nojekyll

# ---------- Patch API_BASE in the JS that Pages serves ----------
for f in docs/auto.js docs/tv.js; do
  if [ -f "$f" ]; then
    echo "[i] Patching API_BASE in $f"
    # Replace any old localhost/127.* or previous const/let assignments
    sed -i 's|http://127\.0\.0\.1:[0-9]\+|'"$API_BASE"'|g' "$f"
    sed -i 's|https://127\.0\.0\.1:[0-9]\+|'"$API_BASE"'|g' "$f"
    sed -i 's|http://localhost:[0-9]\+|'"$API_BASE"'|g' "$f"
    sed -i 's|^\s*\(const\|let\)\s*API_BASE\s*=.*$|const API_BASE = "'"$API_BASE"'";|g' "$f"
  else
    echo "[!] Missing $f (skipping)"
  fi
done

echo "[i] Sanity check for API_BASE lines:"
grep -n "API_BASE" docs/auto.js docs/tv.js 2>/dev/null || true

# ---------- Cache-bust JS so browsers fetch the new files ----------
TS="$(date +%s)"
echo "[i] Cache-busting with ?v=$TS"
for h in docs/*.html; do
  [ -f "$h" ] || continue
  # add ?v=timestamp to auto.js and tv.js references (both ./auto.js and auto.js forms)
  sed -i 's|\(src="\.\/\)\(auto\|tv\)\(.js\)"|\1\2\3?v='"$TS"'"|g' "$h"
  sed -i 's|\(src="\)\(auto\|tv\)\(.js\)"|\1\2\3?v='"$TS"'"|g' "$h"
done

# ---------- Commit & push ----------
echo "[i] Committing changes..."
git add -A
git commit -m "Fix API_BASE -> $API_BASE and cache-bust ($TS); sync frontend to docs" || true
git push origin main

echo "[i] Done. Pages will redeploy shortly."
echo "    Site: https://mrdevashish.github.io/alphaedge/"
echo "    Backend health: $API_BASE/health"
