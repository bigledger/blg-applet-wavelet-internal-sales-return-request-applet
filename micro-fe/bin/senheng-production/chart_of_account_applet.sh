#!/bin/sh

set -e
set -x


#compile angular application
ng build --configuration=senheng-production --project=chart-of-account-applet --output-hashing none
node elements-build-scripts/wavelet-erp/chart-of-account-applet/chart-of-account-applet-elements.js

# WARNING: Backup first
 aws s3 mv s3://senheng-my-applets/bigledger/wavelet-erp/chart-of-account-applet/production s3://senheng-my-applets/bigledger/wavelet-erp/chart-of-account-applet/production/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senheng-production --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/chart-of-account-applet/ s3://senheng-my-applets/bigledger/wavelet-erp/chart-of-account-applet/production --profile senheng-production --acl public-read --recursive