#!/bin/sh
set -e

# Aplica las migraciones (crea la BD SQLite si no existe).
echo "▶ Aplicando migraciones…"
npx prisma migrate deploy

# Siembra el contenido solo la primera vez (marcador en el volumen persistente).
SEED_MARKER="/data/.seeded"
if [ ! -f "$SEED_MARKER" ]; then
  echo "🌱 Sembrando contenido inicial…"
  npx tsx prisma/seed.ts
  touch "$SEED_MARKER" 2>/dev/null || true
else
  echo "✓ Datos ya sembrados, se omite el seed."
fi

echo "🚀 Arrancando API…"
exec npx tsx src/server.ts
