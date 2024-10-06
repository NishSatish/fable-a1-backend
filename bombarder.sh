#!/bin/bash

# Define variables
THREADS=8
CONNECTIONS=2000
DURATION=15s
URL="http://localhost:3000/log"
SCRIPT="wrk-settings.lua"

# Run the wrk command
wrk -t$THREADS -c$CONNECTIONS -d$DURATION -s $SCRIPT $URL
