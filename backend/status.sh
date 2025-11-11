#!/data/data/com.termux/files/usr/bin/bash
ps -aux | grep 'node backend/server.mjs' | grep -v grep || echo "Not running."
