#!/bin/bash

CURRENT_VERSION=`cat package.json | grep version | awk -F: '{print $2}' | awk -F\" '{print $2}'`
echo "Current version: $CURRENT_VERSION"

echo -ne "Enter new version and press <enter>: "
read NEW_VERSION

echo -ne "Launch vim to edit changelog <enter>"
vim CHANGELOG.md

cat << EOF
sed -i "s/$CURRENT_VERSION/$NEW_VERSION/" package.json
sed -i "s/$CURRENT_VERSION/$NEW_VERSION/" config.json
EOF
