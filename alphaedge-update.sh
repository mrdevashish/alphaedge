#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

REPO_DIR="$HOME/alphaedge"
API_BASE="https://alphaedge-backend.onrender.com"   # <- your Render backend
PAGES_DIR="$REPO_DIR/docs"
FRONTEND_DIR="$REPO_DIR/frontend"

log(){ printf "\033[1;36m[i]\033[0m %s\n" "$*"; }
warn(){ printf "\033[1;33m[!]\033[0m %s\n" "$*"; }
err(){ printf "\033[1;31m[x]\033[0m %s\n" "$*"; }

cd "$REPO_DIR"
git config --global --add safe.directory "$REPO_DIR" || true

log "Pull latest from GitHub (main)…"
git pull --rebase origin main || true

# ---------- Sync frontend -> docs (what GitHub Pages serves) ----------
log "Sync frontend → docs/"
mkdir -p "$PAGES_DIR"
# Keep .nojekyll if present; clean the rest
find "$PAGES_DIR" -mindepth 1 -not -name ".nojekyll" -exec rm -rf {} + || true

if [ -d "$FRONTEND_DIR" ]; then
  cp -R "$FRONTEND_DIR"/* "$PAGES_DIR"/
else
  warn "No frontend/ folder found; using existing docs/"
fi

# Also copy any root HTML/CSS/JS if you keep some there
cp -R *.html *.css *.js *.svg "$PAGES_DIR"/ 2>/dev/null || true

# Ensure Pages doesn’t run Jekyll
touch "$PAGES_DIR/.nojekyll"

# Minimal index redirect if missing
if [ ! -f "$PAGES_DIR/index.html" ]; then
  cat > "$PAGES_DIR/index.html" <<'HTML'
<!doctype html><meta charset="utf-8"><title>AlphaEdge</title>
<meta http-equiv="refresh" content="0; url=./dashboard.html">
<p>Redirecting to <a href="./dashboard.html">dashboard</a>…</p>
HTML
fi

# ---------- Force API_BASE in the JS that Pages serves ----------
for f in "$PAGES_DIR/auto.js" "$PAGES_DIR/tv.js"; do
  if [ -f "$f" ]; then
    log "Patching API_BASE in $(basename "$f")"
    sed -i 's|http://127\.0\.0\.1:[0-9]\+|'"$API_BASE"'|g' "$f"
    sed -i 's|https://127\.0\.0\.1:[0-9]\+|'"$API_BASE"'|g' "$f"
    sed -i 's|http://localhost:[0-9]\+|'"$API_BASE"'|g' "$f"
    sed -i 's|^\s*\(const\|let\)\s*API_BASE\s*=.*$|const API_BASE = "'"$API_BASE"'";|g' "$f"
    sed -i 's|{API_BASE}|'"$API_BASE"'|g' "$f"
    sed -i 's|\${API_BASE}|'"$API_BASE"'|g' "$f"
  else
    warn "Missing $(basename "$f")"
  fi
done

log "API_BASE lines:"
grep -n "API_BASE" "$PAGES_DIR"/auto.js "$PAGES_DIR"/tv.js 2>/dev/null || true

# ---------- Fix absolute paths (important on GitHub Project Pages) ----------
# Convert /auto.js -> ./auto.js, etc. (safe to re-run)
for h in "$PAGES_DIR"/*.html; do
  [ -f "$h" ] || continue
  sed -i 's/href="\/style.css"/href=".\/style.css"/g' "$h"
  sed -i 's/src="\/auto.js"/src=".\/auto.js"/g' "$h"
  sed -i 's/src="\/tv.js"/src=".\/tv.js"/g' "$h"
  sed -i 's/src="\/tvlib.js"/src=".\/tvlib.js"/g' "$h"
  sed -i 's/href="\/\([^"]*\)\.html"/href=".\/\1.html"/g' "$h"
done

# ---------- Cache-bust JS so browsers fetch new files ----------
TS="$(date +%s)"
log "Cache-busting ?v=$TS"
for h in "$PAGES_DIR"/*.html; do
  [ -f "$h" ] || continue
  sed -i 's|\(src="\.\/\)\(auto\|tv\)\(.js\)"|\1\2\3?v='"$TS"'"|g' "$h"
  sed -i 's|\(src="\)\(auto\|tv\)\(.js\)"|\1\2\3?v='"$TS"'"|g' "$h"
done

# ---------- Commit & push ----------
log "Committing and pushing…"
git add -A
git commit -m "Automated: sync docs, set API_BASE=$API_BASE, cache-bust $TS" || true
git push origin main

log "GitHub Pages will redeploy shortly: https://mrdevashish.github.io/alphaedge/"

# ---------- Backend quick verification ----------
log "Backend health:"
curl -sS "$API_BASE/health" || true
echo
log "Screener test:"
curl -sS -X POST "$API_BASE/api/screener" -H 'Content-Type: application/json' \
  -d '{"symbols":["TCS.NS","RELIANCE.NS"],"tf":"1d"}' || true
echo

log "Done."
