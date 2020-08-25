#!/bin/bash

source ../../secret/oauth.sh
open "http://www.strava.com/oauth/authorize?client_id=$CLIENT_ID&response_type=code&redirect_uri=http://localhost/exchange_token&approval_prompt=force&scope=read"

echo 
(
	"http://www.strava.com/oauth/authorize?
client_id=$CLIENT_ID&
response_type=code&
redirect_uri=http://localhost/exchange_token&
approval_prompt=force
&scope=read"

  "https://www.strava.com/oauth/authorize?
response_type=code&
redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Fapi%2Fauth%2Fcallback%2Fauth0&
scope=openid%20email%20profile&
state=ee5a94ab1cc6cbbcb5c46e278ddaf31260abd5fbe51b73ec4846dd9bfe3aa01a&
client_id=52300"
) > /dev/null
