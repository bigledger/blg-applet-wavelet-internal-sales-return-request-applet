#!/bin/sh

set -e
set -x

export NODE_OPTIONS=--max_old_space_size=8192

#compile angular application
ng build --configuration=staging --project=my-peppol-admin-applet --output-hashing none
node elements-build-scripts/wavelet-erp/my-peppol-admin-applet/my-peppol-admin-applet-elements-build.js

# WARNING: Backup first
 aws s3 mv s3://staging-my-akaun-applets/bigledger/wavelet-erp/my-peppol-admin-applet/staging s3://staging-my-akaun-applets/bigledger/wavelet-erp/my-peppol-admin-applet/staging/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile staging-bigledger --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/wavelet-erp/applets/my-peppol-admin-applet/ s3://staging-my-akaun-applets/bigledger/wavelet-erp/my-peppol-admin-applet/staging --profile staging-bigledger --acl public-read --recursive

# === Append Deployment Log as New File ===
DEPLOYER=$(aws sts get-caller-identity --profile staging-bigledger --query 'Arn' --output text)
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S MYT")
COMMIT_HASH=$(git rev-parse --short HEAD)
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

echo "[${TIMESTAMP}] Deployment by ${DEPLOYER} (commit ${COMMIT_HASH}, branch ${BRANCH_NAME}, env: staging)" > /tmp/changelog.txt

aws s3 cp /tmp/changelog.txt s3://staging-my-akaun-applets/bigledger/wavelet-erp/my-peppol-admin-applet/staging/changelog.txt --profile staging-bigledger --acl bucket-owner-full-control

rm /tmp/changelog.txt
