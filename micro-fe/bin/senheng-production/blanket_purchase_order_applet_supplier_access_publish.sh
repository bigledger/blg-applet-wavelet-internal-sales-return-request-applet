#!/bin/sh

set -e
set -x

export NODE_OPTIONS=--max_old_space_size=8192


#compile angular application
ng build --configuration=senheng-production --project=blanket-purchase-order-applet-supplier-access --output-hashing none
node elements-build-scripts/wavelet-erp/blanket-purchase-order-applet-supplier-access/blanket-purchase-order-applet-supplier-access-elements-build.js

# WARNING: Backup first
 aws s3 mv s3://senheng-my-applets/bigledger/wavelet-erp/blanket-purchase-order-applet-supplier-access/production s3://senheng-my-applets/bigledger/wavelet-erp/blanket-purchase-order-applet-supplier-access/production/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senheng-production --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/blanket-purchase-order-applet-supplier-access/ s3://senheng-my-applets/bigledger/wavelet-erp/blanket-purchase-order-applet-supplier-access/production --profile senheng-production --acl public-read --recursive