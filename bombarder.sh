#!/bin/bash

# Config
# current config is for an M1 Pro MBPro (14in, 8 Cores)
THREADS=8
CONNECTIONS=2000
DURATION=15s
URL="http://localhost:3000/log"
SCRIPT="wrk-settings.lua"

wrk -t$THREADS -c$CONNECTIONS -d$DURATION -s $SCRIPT $URL
