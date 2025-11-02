#!/bin/sh

set -e
set -x


#compile angular application
ng build --configuration=development --project=ledger-and-journal-applet --output-hashing none
node elements-build-scripts/wavelet-erp/ledger-and-journal-applet/ledger-and-journal-applet-elements.js

# WARNING: Backup first
 aws s3 mv s3://development-akaun-applets/bigledger/wavelet-erp/ledger-and-journal-applet/staging s3://development-akaun-applets/bigledger/wavelet-erp/ledger-and-journal-applet/development/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile development-bigledger --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/ledger-and-journal-applet/ s3://development-akaun-applets/bigledger/wavelet-erp/ledger-and-journal-applet/development --profile development-bigledger --acl public-read --recursive
