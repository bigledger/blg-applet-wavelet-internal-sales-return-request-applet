#!/bin/sh

set -e
set -x


#compile angular application
ng build --configuration=senheng-staging --project=example-applet --output-hashing none
node elements-build-scripts/akaun-example/example-applet-elements-build.js


# WARNING: Backup first
 aws s3 mv s3://akaun-applets/bigledger/akaun-template/example-applet/staging s3://akaun-applets/bigledger/akaun-template/example-applet/staging/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/akaun-platform/applets/example-applet/ s3://akaun-applets/bigledger/akaun-template/example-applet/staging --acl public-read --recursive

# https://akaun-applets.s3-ap-southeast-1.amazonaws.com/bigledger/akaun-template/example-applet/staging/example-applet-elements.js
