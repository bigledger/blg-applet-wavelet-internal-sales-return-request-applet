#!/bin/sh

set -e
set -x

export NODE_OPTIONS=--max_old_space_size=8192

#compile angular application
ng build --configuration=senheng-production --project=statement-of-account-applet --output-hashing none
node elements-build-scripts/wavelet-erp/statement-of-account-applet/statement-of-account-applet-elements-build.js

# WARNING: Backup first
 aws s3 mv s3://senheng-my-applets/bigledger/wavelet-erp/statement-of-account-applet/production s3://senheng-my-applets/bigledger/wavelet-erp/statement-of-account-applet/production/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senheng-production --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/statement-of-account-applet/ s3://senheng-my-applets/bigledger/wavelet-erp/statement-of-account-applet/production --profile senheng-production --acl public-read --recursive
