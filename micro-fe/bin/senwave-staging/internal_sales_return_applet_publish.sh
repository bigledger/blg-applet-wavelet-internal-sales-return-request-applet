#!/bin/sh

set -e
set -x

export NODE_OPTIONS=--max_old_space_size=8192

#compile angular application
ng build --configuration=senwave-staging --project=internal-sales-return-applet --output-hashing none
node elements-build-scripts/wavelet-erp/internal-sales-return-applet/internal-sales-return-applet-elements-build.js

# WARNING: Backup first
 aws s3 mv s3://senwave-applets/bigledger/wavelet-erp/internal-sales-return-applet/production s3://senwave-applets/bigledger/wavelet-erp/internal-sales-return-applet/production/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senwave-staging --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/internal-sales-return-applet/ s3://senwave-applets/bigledger/wavelet-erp/internal-sales-return-applet/production --profile senwave-staging --acl public-read --recursive
