#!/bin/sh

set -e
set -x


#compile angular application
ng build --prod --project=internal-job-sheet-applet --output-hashing none
node elements-build-scripts/wavelet-erp/internal-job-sheet-applet-elements-build.js


# WARNING: Backup first
 aws s3 mv s3://akaun-applets/bigledger/akaun-template/example-applet s3://akaun-applets/bigledger/akaun-template/example-applet/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile akaun --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/akaun-platform/applets/example-applet/ s3://akaun-applets/bigledger/akaun-template/example-applet --profile akaun --acl public-read --recursive
