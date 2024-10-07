#!/bin/bash

total_lines=0

for file in *.txt; do
  # wc -l: Word count interms of lines
  lines=$(wc -l < "$file")
  total_lines=$((total_lines + lines))
  echo "Current file: $lines"
done

echo "Total logs: $total_lines"
