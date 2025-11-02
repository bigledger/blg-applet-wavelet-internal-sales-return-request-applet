#!/bin/sh

set -e
set -x

# set NODE_OPTIONS=--max_old_space_size=8192

#compile angular application
ng build --configuration=senheng-production --project=delivery-installation-applet-V2 --output-hashing none
node elements-build-scripts/wavelet-erp/delivery-installation-applet/delivery-installation-applet-elements-build.js

# WARNING: Backup first
 aws s3 mv s3://senheng-my-applets/bigledger/wavelet-erp/delivery-installation-applet-v2/production s3://senheng-my-applets/bigledger/wavelet-erp/delivery-installation-applet-v2/production/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senheng-production --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/delivery-installation-applet/ s3://senheng-my-applets/bigledger/wavelet-erp/delivery-installation-applet-v2/production --profile senheng-production --acl public-read --recursive
