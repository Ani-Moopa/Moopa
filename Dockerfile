FROM node:20-alpine AS base

FROM base AS deps
RUN apk add --no-cache libc6-compat git
WORKDIR /app
RUN git clone https://github.com/Ani-Moopa/Moopa.git .
RUN rm -rf .git .gitignore .vscode LICENSE.md README.md
RUN npm install --verbose

FROM base AS builder
ENV NEXT_TELEMETRY_DISABLED 1
WORKDIR /app
COPY --from=deps --link /app/node_modules ./node_modules
COPY --from=deps /app .
RUN npm run build

FROM base AS runner
ENV NEXT_TELEMETRY_DISABLED 1
WORKDIR /app
RUN addgroup --system --gid 1001 nodejs; \
    adduser --system --uid 1001 nextjs
COPY --from=builder /app/public ./public
COPY --from=builder --chown=1001:1001 /app/.next/standalone ./
COPY --from=builder --chown=1001:1001 /app/.next/static ./.next/static
USER nextjs
EXPOSE 3000
CMD ["node", "server.js"]
