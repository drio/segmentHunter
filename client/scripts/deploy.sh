#!/bin/bash
set -e

DST_HOST="my_vps"
DST_DIR="/var/www/segmenthunter.net"
SRC_DIR="/Users/drio/dev/segmentHunter/client"
CERT=~/dev/my_vps/certificate.pem
EXCLUDES="--exclude=node_modules --exclude=node_modules --exclude=.next"
SSH_CMD_SEED="ssh -i $CERT $DST_HOST"
INSTANCE_DIR_NAME="instance"
RUNNING_INFO_FILE=$DST_DIR/running_instance.txt
NGINX_CONFIG=/etc/nginx/sites-available/segmenthunter.net
TMP_FILE=/tmp/$(echo $RANDOM)_sh_nginx.txt
PORT_SEED=$(cat config.json | jq '.production.PORT' | cut -c1-3)

log() {
  local msg=$1
  echo ">> $msg"
}


RUNNING_INSTANCE=`$SSH_CMD_SEED "cat $RUNNING_INFO_FILE 2>/dev/null || echo '0'"`
if [ $RUNNING_INSTANCE -eq 0 ];then
  log "No running instance detected"
  DEPLOYMENT_INSTANCE=1
elif [ $RUNNING_INSTANCE -eq 1 ];then
  DEPLOYMENT_INSTANCE=2
elif [ $RUNNING_INSTANCE -eq 2 ];then
  DEPLOYMENT_INSTANCE=1
else
  log "Invalid instance number ($RUNNING_INSTANCE)"
  exit 1
fi

log "Current running instance: [$RUNNING_INSTANCE]"
log "Using instance [$DEPLOYMENT_INSTANCE] for deployment"
INSTANCE_DIR="$INSTANCE_DIR_NAME$DEPLOYMENT_INSTANCE"
REMOTE_DIR=$DST_DIR/$INSTANCE_DIR
NEW_PORT=$PORT_SEED$DEPLOYMENT_INSTANCE
OLD_PORT=$PORT_SEED$RUNNING_INSTANCE

$SSH_CMD_SEED "mkdir -p $REMOTE_DIR"
rsync -avz -e "ssh -i $CERT" --delete --progress $EXCLUDES $SRC_DIR/ $DST_HOST:$DST_DIR/$INSTANCE_DIR/
log "building "
$SSH_CMD_SEED "cd $DST_DIR/$INSTANCE_DIR && npm i && NODE_OPTIONS='--max_old_space_size=512' npm run build"
log "Updating nginx"
$SSH_CMD_SEED "cat $NGINX_CONFIG | sed 's/$OLD_PORT/$NEW_PORT/g' > $TMP_FILE; sudo mv $TMP_FILE $NGINX_CONFIG"
log "Updating running info file"
$SSH_CMD_SEED "echo '$DEPLOYMENT_INSTANCE' > $RUNNING_INFO_FILE"

# npm i 
# npm run build
# npx next start -p 3001
# or: npm run dev -- -p 3031

# Are we running prods?
# systemd script
# monitor
