#!/bin/bash

#$OPM_KEY
source ../../../secret/owm.sh
lat=32.784618
lon=-79.940918

#curl -v 'https://api.openweathermap.org/data/2.5/onecall?lat=32.784618&lon=-79.940918&APPID=92f710577a529b24207f0d0c0b3e0971' > data.json
cat <<EOF
curl -v  'https://api.openweathermap.org/data/2.5/onecall?lat=$lat&lon=$lon&APPID=$OPM_KEY&exclude=minutely,daily,current&units=metric' > ./data.json
EOF
