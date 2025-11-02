#!/bin/sh

set -e
set -x

export NODE_OPTIONS=--max_old_space_size=8192

#compile angular application
ng build --configuration=development --project=inv-item-maintenance-applet --output-hashing none
node elements-build-scripts/wavelet-erp/inv-item-maintenance-applet/inv-item-maintenance-applet-elements-build.js

# WARNING: Backup first
 aws s3 mv s3://development-akaun-applets/bigledger/wavelet-erp/inv-item-maintenance-applet/development s3://development-akaun-applets/bigledger/wavelet-erp/inv-item-maintenance-applet/development/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile development-bigledger --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/inv-item-maintenance-applet/ s3://development-akaun-applets/bigledger/wavelet-erp/inv-item-maintenance-applet/development --profile development-bigledger --acl public-read --recursive
