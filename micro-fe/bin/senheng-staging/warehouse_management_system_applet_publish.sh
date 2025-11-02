#!/bin/sh

set -e
set -x

export NODE_OPTIONS=--max_old_space_size=8192

#compile angular application
ng build --configuration=senheng-staging --project=warehouse-management-system-applet --output-hashing none
node elements-build-scripts/wavelet-erp/warehouse-management-system-applet/warehouse-management-system-applet-elements-build.js

# WARNING: Backup first
 aws s3 mv s3://senheng-applets/bigledger/wavelet-erp/warehouse-management-system-applet/staging s3://senheng-applets/bigledger/wavelet-erp/warehouse-management-system-applet/staging/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senheng-staging --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/warehouse-management-system-applet/ s3://senheng-applets/bigledger/wavelet-erp/warehouse-management-system-applet/staging --profile senheng-staging --acl public-read --recursive
