#!/bin/sh

set -e
set -x

export NODE_OPTIONS=--max_old_space_size=8192

#compile angular application
ng build --configuration=development --project=ocr-cash-bill-applet --output-hashing none
node elements-build-scripts/wavelet-erp/ocr-cash-bill-applet/ocr-cash-bill-applet-elements-build.js

# WARNING: Backup first
 aws s3 mv s3://development-akaun-applets/bigledger/wavelet-erp/ocr-cash-bill-applet/development s3://development-akaun-applets/bigledger/wavelet-erp/ocr-cash-bill-applet/development/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile development-bigledger --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/ocr-cash-bill-applet/ s3://development-akaun-applets/bigledger/wavelet-erp/ocr-cash-bill-applet/development --profile development-bigledger --acl public-read --recursive
