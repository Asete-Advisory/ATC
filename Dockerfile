# syntax=docker/dockerfile:1

FROM node:24-bookworm-slim AS base
WORKDIR /app
ENV NEXT_TELEMETRY_DISABLED=1

FROM base AS dependencies
ARG PNPM_VERSION=11.23.0
RUN npm install --global pnpm@${PNPM_VERSION}

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
# Reuse downloaded packages across attempts and limit concurrent registry requests.
# Copy packages so node_modules remains usable without the BuildKit cache mount.
RUN --mount=type=cache,id=atcchinabrasil-main-pnpm-v11,target=/pnpm/store,sharing=locked \
    pnpm install --frozen-lockfile \
    --store-dir=/pnpm/store \
    --package-import-method=copy \
    --network-concurrency=8 \
    --fetch-timeout=120000 \
    --fetch-retries=3 \
    --reporter=append-only

FROM dependencies AS builder
COPY . .
RUN pnpm run build

FROM base AS runner
ENV NODE_ENV=production \
    PORT=3000 \
    HOSTNAME=0.0.0.0

COPY --from=builder --chown=node:node /app/.next/standalone ./
COPY --from=builder --chown=node:node /app/.next/static ./.next/static
COPY --from=builder --chown=node:node /app/public ./public

# Next.js writes optimized images and revalidated responses to this cache.
RUN mkdir -p .next/cache && chown node:node .next/cache

USER node

# The homepage renders without calling the external news or market providers.
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD ["node", "-e", "fetch('http://127.0.0.1:' + (process.env.PORT || 3000), { signal: AbortSignal.timeout(4000) }).then((response) => process.exit(response.ok ? 0 : 1)).catch(() => process.exit(1))"]

CMD ["node", "server.js"]
