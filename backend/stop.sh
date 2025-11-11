#!/data/data/com.termux/files/usr/bin/bash
pkill -9 -f "node backend/server.mjs" && echo "Stopped." || echo "Not running."
