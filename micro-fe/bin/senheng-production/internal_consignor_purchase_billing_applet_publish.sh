#!/bin/sh

set -e
set -x

# set NODE_OPTIONS=--max_old_space_size=8192

#compile angular application
ng build --configuration=senheng-production --project=internal-consignor-purchase-billing-applet --output-hashing none
node elements-build-scripts/wavelet-erp/internal-consignor-purchase-billing-applet/internal-consignor-purchase-billing-applet-elements-build.js

# WARNING: Backup first
 aws s3 mv s3://senheng-my-applets/bigledger/wavelet-erp/internal-consignor-purchase-billing-applet/production s3://senheng-my-applets/bigledger/wavelet-erp/internal-consignor-purchase-billing-applet/production/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senheng-production --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/internal-consignor-purchase-billing-applet/ s3://senheng-my-applets/bigledger/wavelet-erp/internal-consignor-purchase-billing-applet/production --profile senheng-production --acl public-read --recursive
