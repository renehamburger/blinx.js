#!/bin/bash
set -e

VERSION=$(node -p "require('./package.json').version")
sed -i'' "s/blinx\.js@v[0-9]\+.[0-9]\+.[0-9]\+/blinx.js@v$VERSION/g" README.md
git add README.md
