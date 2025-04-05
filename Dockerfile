# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Install OpenSSL
RUN apt-get update -y && apt-get install -y openssl

# Copy package files and TypeScript config
COPY backend/package*.json ./
COPY backend/tsconfig.json ./
COPY backend/prisma ./prisma/
COPY backend/templates ./templates/

# Install dependencies
RUN npm ci

# Copy source code
COPY backend/src ./src

# Generate Prisma client
RUN npx prisma generate

# Build the application
RUN npm run build

# Production stage
FROM node:20-slim AS production

WORKDIR /app

# Install OpenSSL
RUN apt-get update -y && apt-get install -y openssl

# Copy package files and install ALL dependencies (including devDependencies)
COPY backend/package*.json ./
COPY backend/tsconfig.json ./
COPY backend/prisma ./prisma/
COPY backend/templates ./templates/
RUN npm ci

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/templates ./templates

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3000
ENV HOST=0.0.0.0

# Expose the port the app runs on
EXPOSE 3000

# Create a startup script
RUN echo '#!/bin/sh\n\
echo "Starting application..."\n\
node dist/index.js\n\
' > /app/start.sh && chmod +x /app/start.sh

# Start the application using the script
CMD ["/app/start.sh"]
