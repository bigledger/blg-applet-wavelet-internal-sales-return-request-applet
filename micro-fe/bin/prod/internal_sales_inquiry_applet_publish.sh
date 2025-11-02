#!/bin/sh

set -e
set -x

#compile angular application
ng build --prod --project=internal-sales-inquiry-applet --output-hashing none
node elements-build-scripts/wavelet-erp/internal-sales-inquiry-applet/internal-sales-inquiry-applet-elements-build.js

# WARNING: Backup first
aws s3 mv s3://akaun-applets/bigledger/wavelet-erp/internal-sales-inquiry-applet/prod s3://akaun-applets/bigledger/wavelet-erp/internal-sales-inquiry-applet/prod/backups/Backup-`date +%Y-%m-%d:%H:%M:%S` --profile akaun --recursive --exclude "backups/*"

# WARNING: Upload the new  file to s3
aws s3 cp elements/wavelet-erp/applets/internal-sales-inquiry-applet/ s3://akaun-applets/bigledger/wavelet-erp/internal-sales-inquiry-applet/prod --profile akaun --acl public-read --recursive

# Add assets folder containing i18n translation files
aws s3 cp projects/wavelet-erp/applets/internal-sales-inquiry-applet/src/assets/i18n s3://staging-my-akaun-applets/bigledger/wavelet-erp/internal-sales-inquiry-applet/staging/assets/i18n --profile staging-bigledger --acl public-read --recursive

# === Append Deployment Log as New File ===
DEPLOYER=$(aws sts get-caller-identity --profile akaun --query 'Arn' --output text)
TIMESTAMP=$(date "+%Y-%m-%d %H:%M:%S MYT")
COMMIT_HASH=$(git rev-parse --short HEAD)
BRANCH_NAME=$(git rev-parse --abbrev-ref HEAD)

echo "[${TIMESTAMP}] Deployment by ${DEPLOYER} (commit ${COMMIT_HASH}, branch ${BRANCH_NAME}, env: prod)" > /tmp/changelog.txt

aws s3 cp /tmp/changelog.txt s3://akaun-applets/bigledger/wavelet-erp/internal-sales-inquiry-applet/prod/changelog.txt --profile akaun --acl bucket-owner-full-control

rm /tmp/changelog.txt
