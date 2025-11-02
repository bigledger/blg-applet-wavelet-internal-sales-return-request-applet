#!/bin/sh

set -e
set -x

export NODE_OPTIONS=--max_old_space_size=8192

#compile angular application
ng build --configuration=senheng-staging --project=debtor-report-applet-V2 --output-hashing none
node elements-build-scripts/wavelet-erp/debtor-report-applet/debtor-report-applet-elements-build.js

# WARNING: Backup first
 aws s3 mv s3://senheng-applets/bigledger/wavelet-erp/debtor-report-applet-V2/staging s3://senheng-applets/bigledger/wavelet-erp/debtor-report-applet/staging/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senheng-staging --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/debtor-report-applet-V2/ s3://senheng-applets/bigledger/wavelet-erp/debtor-report-applet/staging --profile senheng-staging --acl public-read --recursive

