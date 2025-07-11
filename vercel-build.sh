#!/bin/bash

# Navigate to the backend directory
cd backend

# Install dependencies
npm ci

# Generate Prisma client
npx prisma generate

# Build the application
npm run build

# Return to the root directory
cd ..
