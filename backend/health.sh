#!/data/data/com.termux/files/usr/bin/bash
curl -fsS http://127.0.0.1:5000/health || wget -qO- http://127.0.0.1:5000/health || echo
