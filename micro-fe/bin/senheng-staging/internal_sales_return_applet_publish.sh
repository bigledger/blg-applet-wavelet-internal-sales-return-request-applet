#!/bin/sh

set -e
set -x

export NODE_OPTIONS=--max_old_space_size=8192

#compile angular application
ng build --configuration=senheng-staging --project=internal-sales-return-applet --output-hashing none
node elements-build-scripts/wavelet-erp/internal-sales-return-applet/internal-sales-return-applet-elements-build.js

# WARNING: Backup first
 aws s3 mv s3://senheng-applets/bigledger/wavelet-erp/internal-sales-return-applet/staging s3://senheng-applets/bigledger/wavelet-erp/internal-sales-return-applet/staging/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senheng-staging --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/internal-sales-return-applet/ s3://senheng-applets/bigledger/wavelet-erp/internal-sales-return-applet/staging --profile senheng-staging --acl public-read --recursive
