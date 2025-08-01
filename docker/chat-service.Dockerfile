# Use Node.js Alpine image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++

# Copy package files
COPY apps/chat-service/package*.json ./
COPY apps/chat-service/prisma ./prisma/

# Install dependencies
RUN npm install

# Generate Prisma client
ENV DATABASE_URL=postgres://default:z9GYTlrXa8Qx@ep-bold-voice-a4yp8xc9-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require&pgbouncer=true&connect_timeout=15
RUN npx prisma generate

# Copy source code
COPY apps/chat-service/ .

# Build TypeScript
RUN npm run build

# Optional: prune devDependencies for final image size
RUN npm prune --production

# Create non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nodejs -u 1001

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app
USER nodejs

# Expose port
EXPOSE 3002

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3002/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start the application
CMD ["npm", "start"]
