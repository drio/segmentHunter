#!/bin/bash

CLIENT_ID=52300
CLIENT_SECRET=5e512f6f0549c3b1099a1b416118249b5eb12c93
AUTH_CODE=$1

if [ ".$AUTH_CODE" != "." ];then
	@echo "Current token: "
	@curl -X POST https://www.strava.com/oauth/token \
	-F client_id=$CLIENT_ID \
	-F client_secret=$CLIENT_SECRET \
	-F code=$AUTH_CODE \
	-F grant_type=authorization_code | \
	jq .access_token > ../secret/access_token.txt
	@echo "New Token: "
	@cat ../secret/access_token.txt
else
	echo "Need auth code from step1"
fi
