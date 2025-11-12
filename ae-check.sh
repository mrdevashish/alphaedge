#!/data/data/com.termux/files/usr/bin/bash
set -euo pipefail

SITE_URL="https://mrdevashish.github.io/alphaedge/"
BACKEND="https://alphaedge-backend.onrender.com"

echo "[i] Checking GitHub Pages…"
CODE=$(curl -Is "$SITE_URL?_ts=$(date +%s)" | head -n1 | awk '{print $2}' || true)
echo "    Pages HTTP: $CODE"

echo "[i] Checking backend /health…"
HB=$(curl -s "$BACKEND/health" || true)
echo "    Health: $HB"

# If Pages is not 200, republish gh-pages from current docs (or minimal)
if [ "$CODE" != "200" ]; then
  echo "[!] Pages not 200 (got $CODE). Republish gh-pages…"
  cd "$HOME/alphaedge"
  git fetch origin
  git checkout main
  git pull --rebase origin main || true

  # Ensure docs basics
  mkdir -p docs
  touch docs/.nojekyll
  if [ ! -f docs/index.html ]; then
    cat > docs/index.html <<'HTML'
<!doctype html><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>AlphaEdge</title>
<link rel="stylesheet" href="./style.css">
<body style="font-family:system-ui;background:#0b0f1a;color:#e6f0ff;margin:24px">
  <h1>AlphaEdge</h1>
  <p>Site is live. <a href="./dashboard.html">Open Dashboard</a></p>
</body>
HTML
  fi
  cp -f docs/index.html docs/404.html

  # Make links relative
  sed -i 's|href="/|href="./|g; s|src="/|src="./|g' docs/*.html 2>/dev/null || true

  # Publish docs → gh-pages (root)
  git subtree split --prefix docs -b gh-pages-publish
  git push -f origin gh-pages-publish:gh-pages
  git branch -D gh-pages-publish

  echo "[i] Set GitHub Pages to: Branch=gh-pages, Folder=/ (root)"
  echo "    (Check in repo Settings → Pages once.)"

  # Wait a moment and re-check
  sleep 15
  CODE=$(curl -Is "$SITE_URL?_ts=$(date +%s)" | head -n1 | awk '{print $2}' || true)
  echo "    Re-check Pages HTTP: $CODE"
fi

echo
echo "Final:"
echo "  Frontend: $SITE_URL"
echo "  Backend : $BACKEND/health"
