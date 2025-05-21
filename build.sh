#!/bin/bash

# Install dependencies
npm install --legacy-peer-deps

# Clean old pm2 processes
pm2 delete admin-web2
pm2 delete file-api

# Rebuild the admin-web2 (optional)
npm run build2

# Start backend
pm2 start npm --name file-api -- run start:file-api

# Start frontend (admin-web2)
pm2 start npm --name admin-web2 -- run start:admin-web2

# Show status
pm2 ls