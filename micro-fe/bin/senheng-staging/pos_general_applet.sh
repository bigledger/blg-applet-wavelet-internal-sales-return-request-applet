#!/bin/sh

set -e
set -x
export NODE_OPTIONS=--max_old_space_size=8192

#compile angular application
ng build --configuration=senheng-staging --project=pos-general-applet --output-hashing none
node elements-build-scripts/wavelet-erp/pos-general-applet/pos-general-applet-elements.js

# WARNING: Backup first
 aws s3 mv s3://senheng-applets/bigledger/wavelet-erp/pos-general-applet/staging s3://senheng-applets/bigledger/wavelet-erp/pos-general-applet/staging/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senheng-staging --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/pos-general-applet/ s3://senheng-applets/bigledger/wavelet-erp/pos-general-applet/staging --profile senheng-staging --acl public-read --recursive
