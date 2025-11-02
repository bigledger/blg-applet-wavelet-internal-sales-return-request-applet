#!/bin/sh

set -e
set -x


#compile angular application
ng build --configuration=senheng-staging --project=internal-payment-voucher-applet --aot --output-hashing none
node elements-build-scripts/wavelet-erp/internal-payment-voucher-applet/internal-payment-voucher-applet-elements-build.js

# WARNING: Backup first
 aws s3 mv s3://senheng-applets/bigledger/wavelet-erp/internal-payment-voucher-applet/staging s3://senheng-applets/bigledger/wavelet-erp/internal-payment-voucher-applet/staging/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senheng-staging --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/internal-payment-voucher-applet/ s3://senheng-applets/bigledger/wavelet-erp/internal-payment-voucher-applet/staging --profile senheng-staging --acl public-read --recursive
 