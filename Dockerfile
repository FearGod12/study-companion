# Build stage
FROM node:20-slim AS builder

WORKDIR /app

# Copy package files and TypeScript config
COPY backend/package*.json ./
COPY backend/tsconfig.json ./
COPY backend/prisma ./prisma/

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

# Copy package files and install ALL dependencies (including devDependencies)
COPY backend/package*.json ./
COPY backend/tsconfig.json ./
COPY backend/prisma ./prisma/
RUN npm ci

# Copy built application from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Set environment variables
ENV NODE_ENV=production

# Expose the port the app runs on
EXPOSE 3000

# Start the application
CMD ["node", "dist/index.js"]
