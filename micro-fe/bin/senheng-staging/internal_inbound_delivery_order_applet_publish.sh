#!/bin/sh

set -e
set -x

# set NODE_OPTIONS=--max_old_space_size=8192

#compile angular application
ng build --configuration=senheng-staging --project=internal-inbound-delivery-order-applet --output-hashing none
node elements-build-scripts/wavelet-erp/internal-inbound-delivery-order-applet/internal-inbound-delivery-order-applet-elements-build.js

# WARNING: Backup first
 aws s3 mv s3://senheng-applets/bigledger/wavelet-erp/internal-inbound-delivery-order-applet/staging s3://senheng-applets/bigledger/wavelet-erp/internal-inbound-delivery-order-applet/staging/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senheng-staging --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/internal-inbound-delivery-order-applet/ s3://senheng-applets/bigledger/wavelet-erp/internal-inbound-delivery-order-applet/staging --profile senheng-staging --acl public-read --recursive
