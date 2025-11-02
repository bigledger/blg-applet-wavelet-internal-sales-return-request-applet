#!/bin/sh

set -e
set -x

export NODE_OPTIONS=--max_old_space_size=8192


#compile angular application
ng build --configuration=senwave-staging --project=pdg-applet --output-hashing none
node elements-build-scripts/wavelet-erp/pdg-applet/pdg-applet-elements-build.js

# WARNING: Backup first
 aws s3 mv s3://senwave-applets/bigledger/wavelet-erp/pdg-applet/staging s3://senwave-applets/bigledger/wavelet-erp/pdg-applet/staging/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile senwave-staging --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/pdg-applet/ s3://senwave-applets/bigledger/wavelet-erp/pdg-applet/staging --profile senwave-staging --acl public-read --recursive
