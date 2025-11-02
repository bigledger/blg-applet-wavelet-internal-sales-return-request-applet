#!/bin/sh

set -e
set -x

# set NODE_OPTIONS=--max_old_space_size=8192

#compile angular application
ng build --configuration=senheng-staging --project=recurring-sales-invoice-applet-v2 --output-hashing none
node elements-build-scripts/wavelet-erp/recurring-sales-invoice-applet-v2/recurring-sales-invoice-applet-v2-elements-build.js

# WARNING: Backup first
 aws s3 mv s3://senheng-applets/bigledger/wavelet-erp/recurring-sales-invoice-applet/staging s3://senheng-applets/bigledger/wavelet-erp/recurring-sales-invoice-applet/staging/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senheng-staging --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/recurring-sales-invoice-applet-v2/ s3://senheng-applets/bigledger/wavelet-erp/recurring-sales-invoice-applet/staging --profile senheng-staging --acl public-read --recursive
