#!/bin/sh

set -e
set -x

export NODE_OPTIONS=--max_old_space_size=8192

#compile angular application
ng build --configuration=senheng-production --project=stock-conversion-applet --output-hashing none
node elements-build-scripts/wavelet-erp/stock-conversion-applet/stock-conversion-applet-elements-build.js

# WARNING: Backup first
 aws s3 mv s3://senheng-my-applets/bigledger/wavelet-erp/stock-conversion-applet/production s3://senheng-my-applets/bigledger/wavelet-erp/stock-conversion-applet/production/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senheng-production --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/stock-conversion-applet/ s3://senheng-my-applets/bigledger/wavelet-erp/stock-conversion-applet/production --profile senheng-production --acl public-read --recursive
