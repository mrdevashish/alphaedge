#!/data/data/com.termux/files/usr/bin/bash
cd "$(dirname "$0")/.."
nohup npm start > backend.log 2>&1 &
echo "Started. PIDs:"
ps -aux | grep 'node backend/server.mjs' | grep -v grep
