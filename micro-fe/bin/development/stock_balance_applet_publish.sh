#!/bin/sh

set -e
set -x


#compile angular application
ng build --configuration=development --project=stock-balance-applet --output-hashing none
node elements-build-scripts/wavelet-erp/stock-balance-applet/stock-balance-applet-elements-build.js

# WARNING: Backup first
 aws s3 mv s3://development-akaun-applets/bigledger/tonn-cable/stock-balance-applet/dev s3://development-akaun-applets/bigledger/tonn-cable/stock-balance-applet/dev/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile development-bigledger --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/akaun-platform/applets/stock-balance-applet/ s3://development-akaun-applets/bigledger/tonn-cable/stock-balance-applet/dev --profile development-bigledger --acl public-read --recursive
