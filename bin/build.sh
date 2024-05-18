#!/bin/bash -e

CMD=$1

CURENV=$(declare -p -x)
source ./.env
eval "$CURENV"

ROOT=$( cd -- "$( dirname -- "${BASH_SOURCE[0]}" )" &> /dev/null && pwd )

rm -rf public
mkdir public

ln -sfnr data/Transcriptions public/data
ln -sfnr 'data/DTD and schema' public/resources
ln -sfnr src/data.json public/data.json
ln -sfnr src/translations.json public/translations.json
ln -sfnr assets public/

function fv-dev {
  ln -sfnr node_modules public/

  concurrently \
    'rollup -c -w --no-watch.clearScreen' \
    'sass -c -w --update -I ./node_modules --source-map src/app.scss public/app.css' \
    "browser-sync start --server --serveStatic=./public --host=127.0.0.1 --port=4000 --browser=false --watch=true --single --no-notify"
}

function fv-build {
  rollup -c
  sass -c -I node_modules src/app.scss public/app.css
}

fv-$CMD

# cp node_modules/bootstrap-icons/bootstrap-icons.svg public/
# cp -a assets/ public/


  # "ws --port=4000 --hostname=127.0.0.1 --directory=./public --spa /index.html --spa.asset-test-fs"
  # 'live-server --host=127.0.0.1 --port=4000 --no-browser ./public'
  # 'chokidar "data/**/*" --initial -c "rm -rf public/data && cp -a data public/data"' \
