#!/bin/sh

set -e
set -x

export NODE_OPTIONS=--max_old_space_size=8192

#compile angular application
ng build --configuration=senheng-staging --project=internal-purchase-quotation-applet --output-hashing none
node elements-build-scripts/wavelet-erp/internal-purchase-quotation-applet/internal-purchase-quotation-applet-elements-build.js

# WARNING: Backup first
 aws s3 mv s3://senheng-applets/bigledger/wavelet-erp/internal-purchase-quotation-applet/staging s3://senheng-applets/bigledger/wavelet-erp/internal-purchase-quotation-applet/staging/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senheng-staging --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/internal-purchase-quotation-applet/ s3://senheng-applets/bigledger/wavelet-erp/internal-purchase-quotation-applet/staging --profile senheng-staging --acl public-read --recursive

# Add assets folder containing i18n translation files
aws s3 cp projects/wavelet-erp/applets/internal-purchase-quotation-applet/src/assets/i18n s3://senheng-applets/bigledger/wavelet-erp/internal-purchase-quotation-applet/staging/assets/i18n --profile senheng-staging --acl public-read --recursive