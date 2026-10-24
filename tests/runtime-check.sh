#!/bin/sh
set -eu
base=http://127.0.0.1:8080
curl --fail --silent --show-error "$base/" | grep -q '東京ストア'
echo 'PASS: Japanese storefront returns HTTP 200 and UTF-8 text'
test "$(curl --fail --silent --show-error "$base/health.txt")" = ok
echo 'PASS: health endpoint returns ok'
curl --fail --silent --show-error "$base/catalog.json" | grep -q '"currency":"JPY"'
echo 'PASS: catalog currency remains JPY'
curl --fail --silent --show-error "$base/catalog.json" | grep -q '京都の抹茶セット'
echo 'PASS: Japanese product names survive HTTP transport'
curl --fail --silent --show-error "$base/style.css" | grep -q 'color-scheme'
echo 'PASS: stylesheet is available'
test "$(curl --silent --output /dev/null --write-out '%{http_code}' "$base/missing-file")" = 404
echo 'PASS: missing paths retain HTTP 404 behavior'
curl --silent --head "$base/" | grep -iq 'X-Content-Type-Options: nosniff'
echo 'PASS: security response header is retained'
