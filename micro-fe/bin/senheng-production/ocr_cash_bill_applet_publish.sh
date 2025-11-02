#!/bin/sh

set -e
set -x


#compile angular application
ng build --configuration=senheng-production --project=ocr-cash-bill-applet --output-hashing none
node elements-build-scripts/wavelet-erp/ocr-cash-bill-applet/ocr-cash-bill-applet-elements-build.js

# WARNING: Backup first
aws s3 mv s3://senheng-my-applets/bigledger/wavelet-erp/ocr-cash-bill-applet/production s3://senheng-my-applets/bigledger/wavelet-erp/ocr-cash-bill-applet/production/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senheng-production --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
aws s3 cp elements/wavelet-erp/applets/ocr-cash-bill-applet/ s3://senheng-my-applets/bigledger/wavelet-erp/ocr-cash-bill-applet/production --profile senheng-production --acl public-read --recursive

