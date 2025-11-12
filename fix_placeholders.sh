#!/data/data/com.termux/files/usr/bin/bash
set -e
cd "$(dirname "$0")"
grep -RIl 'http://127.0.0.1:5000\|http://127.0.0.1:5000' . | while read -r f; do
  sed -i 's|http://127.0.0.1:5000|http://127.0.0.1:5000|g' "$f"
  sed -i 's|http://127.0.0.1:5000|http://127.0.0.1:5000|g' "$f"
done
echo "Placeholders fixed."
