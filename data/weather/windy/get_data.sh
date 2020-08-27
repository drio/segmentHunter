#!/bin/bash

source ../../../secret/windy.sh

# https://api.windy.com/point-forecast/docs#parameters
cat <<EOF > ./payload.json
{
	"lat": 32.784618,
	"lon": -79.940918,
	"model": "gfs",
	"parameters": ["temp", "precip", "dewpoint", "wind", "windGust", "ptype", "rh" ],
	"levels": ["surface"],
	"key": "$WINDY_API_KEY"
} 
EOF

cat <<EOF
curl -v -X POST https://api.windy.com/api/point-forecast/v2 \
-H "Content-Type: application/json" \
--data-binary @payload.json > ./data.json
EOF
