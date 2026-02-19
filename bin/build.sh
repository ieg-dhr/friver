#!/bin/bash -e

CMD=$1

CURENV=$(declare -p -x)
source ./.env
eval "$CURENV"

ROOT=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )
BIN_DIR="${ROOT}/../node_modules/.bin"

rm -rf public
mkdir public

ln -sfnr data/Transcriptions public/data
ln -sfnr data/dbimages/ public/
ln -sfnr 'data/DTD and schema' public/resources
ln -sfnr src/data.json public/data.json
ln -sfnr src/translations.json public/translations.json
ln -sfnr src/archives.json public/archives.json
ln -sfnr assets public/

function fv-dev {
  ln -sfnr node_modules public/

  concurrently \
    "$BIN_DIR/rollup -c -w --no-watch.clearScreen" \
    "$BIN_DIR/sass -c -w --update -I ./node_modules --source-map src/app.scss public/app.css" \
    "$BIN_DIR/browser-sync start --server --serveStatic=./public --host=127.0.0.1 --port=4000 --browser=false --watch=true --single --no-notify"
}

function fv-build {
  $BIN_DIR/rollup -c
  $BIN_DIR/sass -c -I node_modules src/app.scss public/app.css
}

fv-$CMD
