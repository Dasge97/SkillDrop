# ---- SkillDrop Web (Vite + React) servido por nginx ----
# Build context = repo root.
FROM node:20-bookworm-slim AS build
WORKDIR /app

# 1. Manifests.
COPY package.json package-lock.json ./
COPY packages/shared/package.json packages/shared/
COPY apps/api/package.json apps/api/
COPY apps/web/package.json apps/web/
RUN npm ci

# 2. Código necesario para el build del frontend.
COPY tsconfig.base.json ./
COPY packages/shared ./packages/shared
COPY apps/web ./apps/web

# 3. URL de la API embebida en el bundle (configurable en build).
ARG VITE_API_URL=http://localhost:4000
RUN echo "VITE_API_URL=$VITE_API_URL" > apps/web/.env

RUN npm run build --workspace=apps/web

# ---- Servir estáticos ----
FROM nginx:1.27-alpine AS serve
COPY apps/web/nginx.conf /etc/nginx/conf.d/default.conf
COPY --from=build /app/apps/web/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
