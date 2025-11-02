#!/bin/sh

set -e
set -x

export NODE_OPTIONS=--max_old_space_size=8192
export NODE_OPTIONS=--openssl-legacy-provider

#compile angular application
ng build --configuration=senheng-staging --project=medical-management-system-applet --output-hashing none
node elements-build-scripts/wavelet-erp/medical-management-system-applet/medical-management-system-applet-elements-build.js

# WARNING: Backup first
#  aws s3 mv s3://senheng-applets/bigledger/wavelet-erp/medical-management-system-applet/staging s3://senheng-applets/bigledger/wavelet-erp/medical-management-system-applet/staging/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senheng-staging --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/medical-management-system-applet/ s3://senheng-applets/bigledger/wavelet-erp/medical-management-system-applet/staging --profile senheng-staging --acl public-read --recursive
