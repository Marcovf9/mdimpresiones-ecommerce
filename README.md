# MD Impresiones — Sitio institucional y catálogo

Sitio web de MD Impresiones, empresa gráfica familiar de Córdoba, Argentina, con más de
30 años de trayectoria.

## Stack

| Capa       | Tecnología                                            |
|------------|-------------------------------------------------------|
| Backend    | Java 21 · Spring Boot 3.5 · Spring Data JPA · Security |
| Base datos | PostgreSQL 16 · migraciones con Flyway                 |
| Frontend   | React 19 · TypeScript · Vite · Tailwind CSS 4          |

## Estructura

```
backend/    API REST de catálogo, cotizaciones y panel de administración
frontend/   Sitio público en React + panel admin
docker-compose.yml   PostgreSQL para desarrollo local
```

## Puesta en marcha

1. Levantar la base de datos:

   ```bash
   docker compose up -d
   ```

2. Backend (arranca en `http://localhost:8080`, aplica las migraciones Flyway solo):

   ```bash
   cd backend && ./mvnw spring-boot:run
   ```

3. Frontend (arranca en `http://localhost:5173`, con proxy a `/api`):

   ```bash
   cd frontend && npm install && npm run dev
   ```

## Variables de entorno

| Variable         | Default                                        | Descripción                          |
|------------------|------------------------------------------------|--------------------------------------|
| `DB_URL`         | `jdbc:postgresql://localhost:5432/mdimpresiones` | Conexión a PostgreSQL              |
| `DB_USER`        | `mdimpresiones`                                | Usuario de base de datos             |
| `DB_PASSWORD`    | `mdimpresiones`                                | Contraseña de base de datos          |
| `CORS_ORIGINS`   | `http://localhost:5173`                        | Orígenes permitidos, separados por coma |
| `MEDIA_PATH`     | `./uploads`                                    | Carpeta de imágenes subidas          |
| `JWT_SECRET`     | valor de desarrollo                            | **Obligatorio en producción** (mín. 32 caracteres) |

## Flujo de trabajo con Git

- `main` — producción. Nunca se pushea directo.
- `develop` — rama de integración. Todo llega acá vía merge.
- `feature/<tarea>` — una rama por tarea, sale de `develop` y vuelve a `develop`.
