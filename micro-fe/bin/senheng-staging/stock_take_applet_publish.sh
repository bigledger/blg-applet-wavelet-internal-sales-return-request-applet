#!/bin/sh

set -e
set -x


export NODE_OPTIONS=--max_old_space_size=8192

#compile angular application
ng build --configuration staging --project=stock-take-applet --output-hashing none
node elements-build-scripts/wavelet-erp/stock-take-applet/stock-take-applet-elements-build-staging.js

# WARNING: Backup first
aws s3 mv s3://senheng-applets/bigledger/wavelet-erp/stock-take-applet/staging s3://senheng-applets/bigledger/wavelet-erp/stock-take-applet/staging/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senheng-staging --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
aws s3 cp elements/wavelet-erp/applets/stock-take-applet/staging/ s3://senheng-applets/bigledger/wavelet-erp/stock-take-applet/staging --profile senheng-staging --acl public-read --recursive

