#!/bin/sh

curl \
  -H "Content-Type: application/json" \
  -X POST \
  -d '{"url":"http://localhost:3007/file/xxvAIEnJJpLU1nmmZns1hFfmwvLS67IZ3TcE"}' \
  -H "X-API-Key: test" \
  http://localhost:3007/download