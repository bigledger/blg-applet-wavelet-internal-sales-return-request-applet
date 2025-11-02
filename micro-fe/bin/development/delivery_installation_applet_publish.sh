#!/bin/sh

set -e
set -x

export NODE_OPTIONS=--max_old_space_size=8192

#compile angular application
ng build --configuration=development --project=delivery-installation-applet-V2 --output-hashing none
node elements-build-scripts/wavelet-erp/delivery-installation-applet/delivery-installation-applet-elements-build.js

# WARNING: Backup first
 aws s3 mv s3://development-akaun-applets/bigledger/wavelet-erp/delivery-installation-applet-v2/development s3://development-akaun-applets/bigledger/wavelet-erp/delivery-installation-applet-v2/development/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile development-bigledger --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/delivery-installation-applet/ s3://development-akaun-applets/bigledger/wavelet-erp/delivery-installation-applet-v2/development --profile development-bigledger --acl public-read --recursive
