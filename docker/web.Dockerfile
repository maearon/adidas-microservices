FROM node:22-alpine AS base
WORKDIR /app

# Install production dependencies only
FROM base AS deps
COPY apps/web/package*.json ./
RUN npm ci --omit=dev || npm install --omit=dev

# Build the app
FROM base AS builder
COPY apps/web/package*.json ./
COPY apps/web/package-lock.json ./
COPY apps/web/prisma ./prisma/

ENV PRISMA_DATABASE_URL=postgres://default:z9GYTlrXa8Qx@ep-bold-voice-a4yp8xc9-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require&pgbouncer=true&connect_timeout=15
ENV DATABASE_URL=postgres://default:z9GYTlrXa8Qx@ep-bold-voice-a4yp8xc9-pooler.us-east-1.aws.neon.tech:5432/verceldb?sslmode=require&pgbouncer=true&connect_timeout=15
ENV STRIPE_SECRET_KEY=sk_test_dummy_key_for_build

# Install deps first so prisma CLI matches package.json (^6.x), not latest npx
RUN npm ci || npm install

COPY apps/web/ .

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
ENV PORT=3001
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
