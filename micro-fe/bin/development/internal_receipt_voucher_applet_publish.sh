#!/bin/sh

set -e
set -x


#compile angular application
ng build --configuration=development --project=internal-receipt-voucher-applet-v2 --aot --output-hashing none
node elements-build-scripts/wavelet-erp/internal-receipt-voucher-applet/internal-receipt-voucher-applet-elements-build.js

# WARNING: Backup first
 aws s3 mv s3://development-akaun-applets/bigledger/wavelet-erp/internal-receipt-voucher-applet/development s3://development-akaun-applets/bigledger/wavelet-erp/internal-receipt-voucher-applet/development/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile development-bigledger --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/internal-receipt-voucher-applet/ s3://development-akaun-applets/bigledger/wavelet-erp/internal-receipt-voucher-applet/development --profile development-bigledger --acl public-read --recursive
 