#!/bin/bash
set -e

CERT=~/dev/my_vps/certificate.pem

cd ..
GITBALL="head-master.`git rev-parse --short HEAD`.tar.gz"
git archive --format=tar.gz HEAD:client/ > $$GITBALL
scp -i $CERT $GITBALL my_vps:segmenthunter/
ssh -i $CERT my_vps \
  "rm -f segmenthunter/latest; ln -s segmenthunter/$$GITBALL segmenthunter/latest"
rm -f $GITBALL
