#!/bin/sh

curl \
  -F "file=@test.png" \
  -H "X-API-Key: test" \
  http://localhost:3007/upload