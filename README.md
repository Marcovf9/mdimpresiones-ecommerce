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
