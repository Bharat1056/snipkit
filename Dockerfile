# ---- Base Node image ----
FROM node:18-alpine AS base
WORKDIR /app

# Install dependencies only when needed
FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci --frozen-lockfile

# ---- Build the app ----
FROM deps AS builder
COPY . .
# Generate Prisma client
RUN npx prisma generate
# Build Next.js app
RUN npm run build

# ---- Production image ----
FROM base AS runner
ENV NODE_ENV=production
WORKDIR /app

# Copy only necessary files for production
COPY --from=builder /app/.next .next
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/src ./src
COPY --from=builder /app/middleware.ts ./middleware.ts

# Expose port 3000
EXPOSE 3000

# Healthcheck (optional, can be customized)
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000 || exit 1

# Start the app
CMD ["npm", "run", "start"] 