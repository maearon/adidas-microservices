FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies
FROM base AS deps
COPY apps/web/package*.json ./
RUN npm install --only=production

# Build the app
FROM base AS builder
COPY apps/web/package*.json ./
COPY apps/web/prisma ./prisma/

# Install dependencies
# RUN npm ci --only=production

# Generate Prisma client
ENV DATABASE_URL=postgres://default:z9GYTlrXa8Qx@ep-bold-voice-a4yp8xc9-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require&pgbouncer=true&connect_timeout=15
RUN npx prisma generate

# Copy source code
COPY apps/web/ .

# Build TypeScript
RUN npm install
RUN npm run build

# Production image
FROM base AS runner
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs
EXPOSE 3001
ENV PORT 3001
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"]
