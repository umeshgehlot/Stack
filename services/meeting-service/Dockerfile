FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm ci

# Copy source code
COPY . .

# Build TypeScript code
RUN npm run build

# Production stage
FROM node:18-alpine AS production

WORKDIR /app

# Copy package files and install production dependencies only
COPY package*.json ./
RUN npm ci --only=production

# Copy built files from builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/.env.example ./.env.example

# Create uploads directory for recordings
RUN mkdir -p ./uploads

# Set environment variables
ENV NODE_ENV=production
ENV PORT=3003
ENV HOST=0.0.0.0

# Expose port
EXPOSE 3003

# Start the service
CMD ["node", "dist/index.js"]
