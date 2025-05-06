#!/usr/bin/env bash
set -e

echo "📦 1. 빌드 시작..."
npm run build

echo "☁️ 2. S3에 동기화 시작..."
aws s3 sync ./build s3://dopee-admin --profile root

echo "✅ 완료!"