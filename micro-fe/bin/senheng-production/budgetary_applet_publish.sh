#!/bin/sh

set -e
set -x


#compile angular application
ng build --configuration=senheng-production --project=budgetary-applet --output-hashing none
node elements-build-scripts/wavelet-erp/budgetary-applet/budgetary-applet-elements.js

# WARNING: Backup first
 aws s3 mv s3://senheng-my-applets/bigledger/wavelet-erp/budgetary-applet/production s3://senheng-my-applets/bigledger/wavelet-erp/budgetary-applet/production/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senheng-production --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/budgetary-applet/ s3://senheng-my-applets/bigledger/wavelet-erp/budgetary-applet/production --profile senheng-production --acl public-read --recursive