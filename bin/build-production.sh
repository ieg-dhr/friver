#!/bin/bash -e

export NODE_ENV=production
export FV_STATIC_URL="https://friedensvertraege.ieg-mainz.de"
export FV_STATIC_ROOT="https://friedensvertraege.ieg-mainz.de"
export FV_STATIC_PREFIX='https://friedensvertraege.ieg-mainz.de'
export FV_USE_LOCAL_IMAGES="true"

npm run build
