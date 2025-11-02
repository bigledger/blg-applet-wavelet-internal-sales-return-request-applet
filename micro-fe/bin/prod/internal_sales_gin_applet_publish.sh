#!/bin/sh

set -e
set -x

export NODE_OPTIONS=--max_old_space_size=8192

#compile angular application
ng build --prod --project=internal-sales-gin-applet --output-hashing none
node elements-build-scripts/wavelet-erp/internal-sales-gin-applet/internal-sales-gin-applet-elements-build.js

# WARNING: Backup first
aws s3 mv s3://akaun-applets/bigledger/wavelet-erp/internal-sales-gin-applet/prod s3://akaun-applets/bigledger/wavelet-erp/internal-sales-gin-applet/prod/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile akaun --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
aws s3 cp elements/wavelet-erp/applets/internal-sales-gin-applet/ s3://akaun-applets/bigledger/wavelet-erp/internal-sales-gin-applet/prod --profile akaun --acl public-read --recursive

# === Append Deployment Log as New File ===
DEPLOYER=$(aws sts get-caller-identity --profile akaun --query 'Arn' --output text)
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S MYT")
COMMIT_HASH=$(git rev-parse --short HEAD)
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

echo "[${TIMESTAMP}] Deployment by ${DEPLOYER} (commit ${COMMIT_HASH}, branch ${BRANCH_NAME}, env: prod)" > /tmp/changelog.txt

aws s3 cp /tmp/changelog.txt s3://akaun-applets/bigledger/wavelet-erp/internal-sales-gin-applet/prod/changelog.txt --profile akaun --acl bucket-owner-full-control

rm /tmp/changelog.txt
