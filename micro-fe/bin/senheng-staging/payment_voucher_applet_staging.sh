#!/bin/sh

set -e
set -x


#compile angular application
ng build --configuration=senheng-staging --project=payment-voucher-applet --output-hashing none
node elements-build-scripts/wavelet-erp/payment-voucher-applet/payment-voucher-applet-elements-build-staging.js

# WARNING: Backup first
 aws s3 mv s3://senheng-applets/bigledger/akaun-platform/payment-voucher-applet/staging s3://senheng-applets/bigledger/akaun-platform/payment-voucher-applet/staging/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senheng-staging --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/payment-voucher-applet/staging/ s3://senheng-applets/bigledger/akaun-platform/payment-voucher-applet/staging --profile senheng-staging --acl public-read --recursive
