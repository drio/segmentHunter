#!/bin/bash
set -e

DST_HOST="my_vps"
DST_DIR="/var/www/segmenthunter.net"
SRC_DIR="/Users/drio/dev/segmentHunter/client"
CERT=~/dev/my_vps/certificate.pem
EXCLUDES="--exclude=node_modules --exclude=node_modules --exclude=.next"

rsync -avz -e "ssh -i $CERT" --delete --progress $EXCLUDES $SRC_DIR/ $DST_HOST:$DST_DIR/
# npm i 
# npm run build
# npx next start -p 3001

