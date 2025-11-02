#!/bin/sh

set -e
set -x


#compile angular application
ng build --configuration=senheng-production --project=ledger-and-journal-applet --output-hashing none
node elements-build-scripts/wavelet-erp/ledger-and-journal-applet/ledger-and-journal-applet-elements.js

# WARNING: Backup first
 aws s3 mv s3://senheng-my-applets/bigledger/wavelet-erp/ledger-and-journal-applet/production s3://senheng-my-applets/bigledger/wavelet-erp/ledger-and-journal-applet/production/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senheng-production --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/ledger-and-journal-applet/ s3://senheng-my-applets/bigledger/wavelet-erp/ledger-and-journal-applet/production --profile senheng-production --acl public-read --recursive
