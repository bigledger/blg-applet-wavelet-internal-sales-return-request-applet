#!/bin/bash

# Directory containing the scripts (current directory)
SCRIPT_DIR="$(dirname "$0")"
# Log file for errors (in the same directory)
ERROR_LOG="$SCRIPT_DIR/error_log.txt"

# Clear the previous error log
> "$ERROR_LOG"

# Set NODE_OPTIONS
export NODE_OPTIONS=--max_old_space_size=8192

# Iterate over each script in the directory
for script in "$SCRIPT_DIR"/*
do
  if [[ -x "$script" ]] && [[ "$script" != "$0" ]]; then
    echo "Running $script"
    "$script" 2>> "$ERROR_LOG"
    if [[ $? -ne 0 ]]; then
      echo "Error running $script. Check $ERROR_LOG for details."
    fi
  else
    echo "Skipping $script (not executable or this script)"
  fi
done
