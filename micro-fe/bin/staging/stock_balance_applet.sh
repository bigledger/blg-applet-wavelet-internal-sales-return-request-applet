#!/bin/sh

set -e
set -x


#compile angular application
ng build --configuration=staging --project=stock-balance-applet --output-hashing none
node elements-build-scripts/wavelet-erp/stock-balance-applet/stock-balance-applet-elements-build.js

# WARNING: Backup first
 aws s3 mv s3://staging-my-akaun-applets/bigledger/wavelet-erp/stock-balance-applet/staging s3://staging-my-akaun-applets/bigledger/wavelet-erp/stock-balance-applet/staging/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile staging-bigledger --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
 aws s3 cp elements/akaun-platform/applets/stock-balance-applet/ s3://staging-my-akaun-applets/bigledger/tonn-cable/stock-balance-applet/staging --profile staging-bigledger --acl public-read --recursive

# === Append Deployment Log as New File ===
DEPLOYER=$(aws sts get-caller-identity --profile staging-bigledger --query 'Arn' --output text)
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S MYT")
COMMIT_HASH=$(git rev-parse --short HEAD)
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

echo "[${TIMESTAMP}] Deployment by ${DEPLOYER} (commit ${COMMIT_HASH}, branch ${BRANCH_NAME}, env: staging)" > /tmp/changelog.txt

aws s3 cp /tmp/changelog.txt s3://staging-my-akaun-applets/bigledger/wavelet-erp/stock-balance-applet/staging/changelog.txt --profile staging-bigledger --acl bucket-owner-full-control

rm /tmp/changelog.txt
