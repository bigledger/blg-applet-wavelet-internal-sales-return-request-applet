#!/bin/sh

set -e
set -x

export NODE_OPTIONS=--max_old_space_size=8192

#compile angular application
ng build --configuration=development --project=driver-delivery-order-applet --output-hashing none
node elements-build-scripts/wavelet-erp/driver-delivery-order-applet/driver-delivery-order-applet-elements.build.js

# WARNING: Backup first
 aws s3 mv s3://development-akaun-applets/bigledger/wavelet-erp/driver-delivery-order-applet/development s3://development-akaun-applets/bigledger/wavelet-erp/driver-delivery-order-applet/development/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile development-bigledger --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/driver-delivery-order-applet/ s3://development-akaun-applets/bigledger/wavelet-erp/asset-register-applet/development --profile development-bigledger --acl public-read --recursive
