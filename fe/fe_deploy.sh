#!/usr/bin/env bash
set -e

echo "📦 1. 빌드 시작..."
npm run build

echo "☁️ 2. S3에 동기화 시작..."
aws s3 sync ./build s3://dopee-admin --profile root
aws cloudfront create-invalidation --profile=root  --distribution-id EYG6PP8MYC1A5 --paths / /index.html /error.html /service-worker.js /manifest.json /favicon.ico

echo "✅ 완료!"