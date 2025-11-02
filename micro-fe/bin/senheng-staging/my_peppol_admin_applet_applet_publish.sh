#!/bin/sh

set -e
set -x

export NODE_OPTIONS=--max_old_space_size=8192

#compile angular application
ng build --configuration=senheng-staging --project=my-peppol-admin-applet --output-hashing none
node elements-build-scripts/wavelet-erp/my-peppol-admin-applet/my-peppol-admin-applet-elements-build.js

# WARNING: Backup first
 aws s3 mv s3://senheng-applets/bigledger/wavelet-erp/my-peppol-admin-applet/staging s3://senheng-applets/bigledger/wavelet-erp/my-peppol-admin-applet/staging/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senheng-staging --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/my-peppol-admin-applet/ s3://senheng-applets/bigledger/wavelet-erp/my-peppol-admin-applet/staging --profile senheng-staging --acl public-read --recursive
