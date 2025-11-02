#!/bin/sh

set -e
set -x

export NODE_OPTIONS=--max_old_space_size=8192

#compile angular application
ng build --configuration=senheng-production --project=engagement-applet --output-hashing none
node elements-build-scripts/wavelet-erp/engagement-applet/engagement-applet-elements-build.js

# WARNING: Backup first
 aws s3 mv s3://senheng-my-applets/bigledger/wavelet-erp/engagement-applet/production s3://senheng-my-applets/bigledger/wavelet-erp/engagement-applet/production/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senheng-production --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/engagement-applet/ s3://senheng-my-applets/bigledger/wavelet-erp/engagement-applet/production --profile senheng-production --acl public-read --recursive
