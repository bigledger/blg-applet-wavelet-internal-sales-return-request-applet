#!/bin/sh

set -e
set -x

export NODE_OPTIONS=--max_old_space_size=8192

#compile angular application
ng build --configuration=senheng-staging --project=internal-purchase-refund-note-applet --aot --output-hashing none
node elements-build-scripts/wavelet-erp/internal-purchase-refund-note-applet/internal-purchase-refund-note-applet-elements-build.js

# WARNING: Backup first
 aws s3 mv s3://senheng-applets/bigledger/wavelet-erp/internal-purchase-refund-note-applet/staging s3://senheng-applets/bigledger/wavelet-erp/internal-purchase-refund-note-applet/staging/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senheng-staging --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/internal-purchase-refund-note-applet/ s3://senheng-applets/bigledger/wavelet-erp/internal-purchase-refund-note-applet/staging --profile senheng-staging --acl public-read --recursive
 