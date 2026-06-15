# SkillDrop — Guía de despliegue

SkillDrop se despliega como **Docker Compose multi-contenedor** con un **único
servicio público** (`web`). Pensado para CodeHive (Traefik → `skilldrop.code-hive.space`).

## Arquitectura

```
                 ┌─────────────────────────────┐
  Internet ──TLS─▶  Traefik (CodeHive)          │
  skilldrop.code-hive.space                     │
                 └───────────────┬─────────────┘
                                 │  →  127.0.0.1:8080
                 ┌───────────────▼─────────────┐
                 │  web  (nginx, puerto 80)     │  ← ÚNICO servicio público
                 │   • sirve el SPA (React)     │
                 │   • /api/*  →  api:4000/*     │  (reverse-proxy, red interna)
                 └───────────────┬─────────────┘
                                 │  red interna de Docker
                 ┌───────────────▼─────────────┐
                 │  api  (Express + Prisma)     │  ← NO publicado al host
                 │   • SQLite en volumen /data  │
                 └─────────────────────────────┘
```

- **Single-origin:** el navegador solo habla con `https://skilldrop.code-hive.space`.
  Las llamadas a la API van a `/api/...` (mismo origen) y nginx las redirige a `api:4000`.
  No hay CORS entre dominios ni `localhost` en el bundle.
- **Persistencia:** la base de datos SQLite vive en el volumen `skilldrop-data` (`/data/dev.db`).
- **Init automático:** al primer arranque, `api` aplica migraciones (`prisma migrate deploy`)
  y siembra el contenido (13 fases + usuarios demo). El seed se omite en arranques posteriores
  (marcador `/data/.seeded`).

## Parámetros para la plataforma (ver `spec.md` §21)

| Campo | Valor |
|---|---|
| mode | docker-compose |
| public_service | web |
| internal_port | 80 |
| healthcheck_path | / |

## Variables de entorno

| Variable | Servicio | Por defecto | Descripción |
|---|---|---|---|
| `JWT_SECRET` | api | `change-me-in-production` | **Cambiar en producción.** Secreto de firma JWT. |
| `WEB_ORIGIN` | api | `https://skilldrop.code-hive.space` | Origen permitido (CORS). |
| `VITE_API_URL` | web (build) | `/api` | Base de la API (relativa). No usar `localhost`. |
| `WEB_PORT` | web | `8080` | Puerto loopback del host (Traefik apunta aquí). |
| `DATABASE_URL` | api | `file:/data/dev.db` | Conexión Prisma (SQLite en el volumen). |
| `OPENAI_API_KEY` | api | _(vacío)_ | Clave de OpenAI para la evaluación con IA. Si se deja vacía, el modo "Evaluar con IA" queda deshabilitado. |
| `OPENAI_MODEL` | api | `gpt-4o` | Modelo de OpenAI usado para evaluar. |

> `VITE_API_URL` se embebe en tiempo de **build** del frontend; si lo cambias, reconstruye `web`.

## Despliegue

```bash
# En el servidor, dentro del repo:
JWT_SECRET="<un-secreto-fuerte>" docker compose up -d --build
```

- Servicio público: `web` en `127.0.0.1:8080` (Traefik lo expone como `skilldrop.code-hive.space`).
- Comprobación local: `curl -I http://127.0.0.1:8080/` → `200`, `curl http://127.0.0.1:8080/api/health` → `{"ok":true}`.

## Cuentas demo (creadas por el seed)

| Rol | Email | Contraseña |
|---|---|---|
| Alumno | `student@skilldrop.dev` | `skilldrop` |
| Mentor | `mentor@skilldrop.dev` | `skilldrop` |
| Admin | `admin@skilldrop.dev` | `skilldrop` |

## Operaciones

- **Logs:** `docker compose logs -f web api`
- **Reiniciar:** `docker compose restart`
- **Resetear datos:** `docker compose down -v` (borra el volumen → vuelve a sembrar al arrancar).
- **Actualizar:** `git pull && docker compose up -d --build`
