#!/bin/sh

set -e
set -x


#compile angular application
ng build --configuration=senheng-staging --project=ocr-cash-bill-applet --output-hashing none
node elements-build-scripts/wavelet-erp/ocr-cash-bill-applet/ocr-cash-bill-applet-elements-build.js

# WARNING: Backup first
aws s3 mv s3://senheng-applets/bigledger/wavelet-erp/ocr-cash-bill-applet/staging s3://senheng-applets/bigledger/wavelet-erp/ocr-cash-bill-applet/staging/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senheng-staging --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
aws s3 cp elements/wavelet-erp/applets/ocr-cash-bill-applet/ s3://senheng-applets/bigledger/wavelet-erp/ocr-cash-bill-applet/staging --profile senheng-staging --acl public-read --recursive

