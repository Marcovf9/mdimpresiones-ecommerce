# MO Impresiones — Sitio institucional y catálogo

Sitio web de MO Impresiones, empresa gráfica familiar de Córdoba, Argentina, con más de
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
| `DB_URL`         | `jdbc:postgresql://localhost:5432/moimpresiones` | Conexión a PostgreSQL              |
| `DB_USER`        | `moimpresiones`                                | Usuario de base de datos             |
| `DB_PASSWORD`    | `moimpresiones`                                | Contraseña de base de datos          |
| `CORS_ORIGINS`   | `http://localhost:5173`                        | Orígenes permitidos, separados por coma |
| `MEDIA_PATH`     | `./uploads`                                    | Carpeta de imágenes subidas          |
| `JWT_SECRET`     | valor de desarrollo                            | **Obligatorio en producción** (mín. 32 caracteres) |
| `MAIL_HOST` / `MAIL_PORT` / `MAIL_USERNAME` / `MAIL_PASSWORD` | vacío | SMTP para avisar cotizaciones nuevas. Sin `MAIL_HOST`, apagado |
| `NOTIFICACIONES_DESTINO` | `contacto@moimpresiones.com` | Quién recibe el aviso |
| `MEDIA_PROVIDER` | `local`                                        | `local` (disco) o `cloudinary` |
| `CLOUDINARY_URL` | vacío                                          | `cloudinary://<key>:<secret>@wadqifnu`. Obligatorio si `MEDIA_PROVIDER=cloudinary` |
| `ADMIN_USERNAME` | `admin`                                        | Usuario inicial del panel            |
| `ADMIN_PASSWORD` | se genera al azar                              | Contraseña inicial del panel         |
| `WHATSAPP_NUMBER`| vacío                                          | Número internacional sin signos (ej. `5493511234567`) |
| `INSTAGRAM_URL`  | vacío                                          | Perfil de Instagram                  |
| `CONTACT_EMAIL`  | vacío                                          | Mail de contacto                     |
| `SITE_URL`       | vacío                                          | Dominio del sitio, sin barra final. Sin esto `/sitemap.xml` devuelve 404 |

## Panel de administración

La primera vez que arranca el backend, si la tabla `admin_users` está vacía se crea
un usuario inicial. Si no definiste `ADMIN_PASSWORD`, la contraseña se genera al azar
y se imprime **una sola vez** en el log de arranque.

Todo lo que escribe vive bajo `/api/admin/**` y exige el token que devuelve
`POST /api/auth/login`, enviado como `Authorization: Bearer <token>`.

## Fotos: disco local o Cloudinary

El backend guarda las imágenes del panel donde diga `app.media-provider`:

- **`local`** (por defecto) — disco del servidor. Sirve para desarrollar.
  **No usar en producción**: en Railway, Render o Fly el disco es efímero y
  cada despliegue borraría todas las fotos que subió el cliente.
- **`cloudinary`** — CDN, con las imágenes optimizadas según el dispositivo.

Para usar Cloudinary, copiá `.env.ejemplo` como `.env`, completá `CLOUDINARY_URL`
y arrancá el backend pasándole el archivo:

```bash
docker run -d --name moimpresiones-api \
  --network moimpresiones-ecommerce_default -p 8080:8080 \
  --env-file .env \
  -v "$PWD/backend":/app -v moimpresiones-m2:/root/.m2 -w /app \
  -e DB_URL=jdbc:postgresql://db:5432/moimpresiones \
  maven:3.9-eclipse-temurin-21 mvn -B spring-boot:run
```

Para migrar las fotos que ya están en disco, con Cloudinary activo:

```bash
python3 scripts/importar_fotos.py ~/Downloads/moimpresiones-fotos
```

El script reemplaza las imágenes de cada producto en vez de sumarlas, así que
se puede correr las veces que haga falta sin duplicar nada.

## Antes de publicar

Hay datos que el código deja explícitamente en blanco en lugar de inventarlos:

1. **`frontend/src/config/empresa.ts`** — razón social, CUIT, domicilio, horario y
   dominio. Mientras falten razón social y CUIT, las páginas legales muestran un
   aviso visible de que están incompletas.
2. **Variables de entorno** — `WHATSAPP_NUMBER`, `INSTAGRAM_URL`, `CONTACT_EMAIL`,
   `SITE_URL`, y un `JWT_SECRET` propio de al menos 32 caracteres.
3. **`frontend/public/video/`** — el video de portada y su poster.
4. **Fotos** de productos y terminaciones, que se cargan desde el panel.

Los términos y condiciones están redactados para una imprenta, pero **conviene que
los revise un abogado** antes de publicarlos.

### Servir la SPA

El frontend es una aplicación de una sola página: el servidor tiene que devolver
`index.html` para cualquier ruta que no sea un archivo, o `/productos/estuches`
va a dar 404 al recargar.

## Flujo de trabajo con Git

- `main` — producción. Nunca se pushea directo.
- `develop` — rama de integración. Todo llega acá vía merge.
- `feature/<tarea>` — una rama por tarea, sale de `develop` y vuelve a `develop`.
