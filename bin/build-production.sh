#!/bin/bash -e

export NODE_ENV=production
export FV_STATIC_URL="https://friedensvertraege.ieg-mainz.de/friverplus"
export FV_STATIC_ROOT="https://friedensvertraege.ieg-mainz.de/friverplus"
export FV_STATIC_PREFIX='https://friedensvertraege.ieg-mainz.de'

./bin/build.sh build
