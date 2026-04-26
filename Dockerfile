# syntax=docker/dockerfile:1

FROM node:22-bookworm-slim AS base
WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1

RUN apt-get update \
  && apt-get install -y --no-install-recommends ca-certificates openssl \
  && rm -rf /var/lib/apt/lists/*

FROM base AS deps
COPY package.json package-lock.json ./
RUN npm ci

FROM deps AS builder
WORKDIR /app

COPY . .
RUN DATABASE_URL="mongodb://127.0.0.1:27017/qaryz" npm run prisma:generate
RUN npm run build

FROM base AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

COPY --from=builder /app ./

EXPOSE 3000

CMD ["npm", "run", "start:web"]
