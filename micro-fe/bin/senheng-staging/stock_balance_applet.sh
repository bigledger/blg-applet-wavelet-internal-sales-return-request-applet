#!/bin/sh

set -e
set -x


#compile angular application
ng build --configuration=senheng-staging --project=stock-balance-applet --output-hashing none
node elements-build-scripts/wavelet-erp/stock-balance-applet/stock-balance-applet-elements-build.js

# WARNING: Backup first
 aws s3 mv s3://senheng-applets/bigledger/wavelet-erp/stock-balance-applet/staging s3://senheng-applets/bigledger/wavelet-erp/stock-balance-applet/staging/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senheng-staging --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/akaun-platform/applets/stock-balance-applet/ s3://senheng-applets/bigledger/wavelet-erp/stock-balance-applet/staging --profile senheng-staging --acl public-read --recursive
