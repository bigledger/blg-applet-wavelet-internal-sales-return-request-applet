#!/bin/sh

set -e
set -x

export NODE_OPTIONS=--max_old_space_size=8192


#compile angular application
ng build --configuration=senheng-production --project=web-hook-applet --output-hashing none
node elements-build-scripts/wavelet-erp/web-hook-applet/web-hook-applet-elements-build.js

# WARNING: Backup first
 aws s3 mv s3://senheng-my-applets/bigledger/wavelet-erp/web-hook-applets/production s3://senheng-my-applets/bigledger/wavelet-erp/web-hook-applet/production/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senheng-production --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/web-hook-applet/ s3://senheng-my-applets/bigledger/wavelet-erp/web-hook-applet/production --profile senheng-production --acl public-read --recursive