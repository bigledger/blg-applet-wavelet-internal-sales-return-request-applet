#!/bin/sh

set -e
set -x

export NODE_OPTIONS=--max_old_space_size=8192

#compile angular application
ng build --configuration=development --project=internal-purchase-order-supplier-access-applet --output-hashing none
node elements-build-scripts/wavelet-erp/internal-purchase-order-supplier-access-applet/internal-purchase-order-supplier-access-applet-elements-build.js

# WARNING: Backup first
aws s3 mv s3://development-akaun-applets/bigledger/wavelet-erp/internal-purchase-order-supplier-access-applet/dev s3://development-akaun-applets/bigledger/wavelet-erp/internal-purchase-order-supplier-access-applet/dev/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile development-bigledger --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
aws s3 cp elements/wavelet-erp/applets/internal-purchase-order-supplier-access-applet/ s3://development-akaun-applets/bigledger/wavelet-erp/internal-purchase-order-supplier-access-applet/dev --profile development-bigledger --acl public-read --recursive
