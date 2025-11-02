#!/bin/sh

set -e
set -x

export NODE_OPTIONS=--max_old_space_size=8192

#compile angular application
ng build --configuration=senheng-production --project=internal-receipt-voucher-applet-v2 --aot --output-hashing none
node elements-build-scripts/wavelet-erp/internal-receipt-voucher-applet/internal-receipt-voucher-applet-elements-build.js

# WARNING: Backup first
 aws s3 mv s3://senheng-my-applets/bigledger/wavelet-erp/internal-receipt-voucher-applet/production s3://senheng-my-applets/bigledger/wavelet-erp/internal-receipt-voucher-applet/production/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senheng-production --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/internal-receipt-voucher-applet/ s3://senheng-my-applets/bigledger/wavelet-erp/internal-receipt-voucher-applet/production --profile senheng-production --acl public-read --recursive
 