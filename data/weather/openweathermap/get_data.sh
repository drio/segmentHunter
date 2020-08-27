#!/bin/bash

#$OPM_KEY
source ../../../secret/owm.sh
lat=32.784618
lon=-79.940918

cat <<EOF
curl -v https://api.openweathermap.org/data/2.5/onecall?lat=$lat&lon=$lon&APPID=$OPM_KEY > ./data.json
EOF
