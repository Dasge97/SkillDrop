# ---- SkillDrop API (Express + Prisma + SQLite) ----
# Build context = repo root (para acceder a los workspaces).
FROM node:20-bookworm-slim AS base
WORKDIR /app

# Prisma necesita openssl en Debian slim.
RUN apt-get update -y && apt-get install -y --no-install-recommends openssl \
  && rm -rf /var/lib/apt/lists/*

# 1. Manifests (cacheo de la capa de dependencias).
COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN npm ci

# 2. Código necesario para la API.
COPY tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY apps/api ./apps/api

# 3. Cliente Prisma.
RUN npm run db:generate --workspace=apps/api

ENV NODE_ENV=production
ENV API_PORT=4000
EXPOSE 4000

WORKDIR /app/apps/api
ENTRYPOINT ["sh", "docker-entrypoint.sh"]
