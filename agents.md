# AGENTS.md — Contexto y Especificación del Sistema `searchsvc`

Este archivo documenta todo el conocimiento acumulado sobre el proyecto **`searchsvc`**, sus requerimientos funcionales según el enunciado (**`Search service.pdf`**), su arquitectura técnica actual y la hoja de ruta pendiente. Está diseñado para que cualquier agente de IA o desarrollador comprenda el estado del sistema y pueda continuar su construcción de manera consistente.

---

## 1. Propósito General del Sistema

El objetivo es construir una solución basada en **microservicios** para:
1. **Registrar y configurar sitios web** que se deseen inspeccionar (*crawlear*).
2. **Ejecutar tareas de extracción periódicas** que visiten las páginas de los sitios, sigan enlaces y extraigan información estructurada utilizando snippets de JavaScript con la librería **Cheerio**.
3. **Almacenar la información extraída** en una base de datos **MongoDB**.
4. **Exponer un motor de búsqueda por texto** (`GET /search?q=...`) que permita encontrar documentos a través de palabras clave (*keyphrases*), optimizado mediante el operador `$text` de MongoDB y protegido por **API Key**.
5. **Autenticación y acceso multi-cuenta**: Permitir el acceso de usuarios mediante plataformas de identidad Single Sign-On (SSO) como **Auth0** (con Google ID).

---

## 2. Stack Tecnológico y Configuración

* **Lenguaje:** TypeScript 5+ (compilando a ES2023 con ESM nativo `"type": "module"` en `package.json` y `moduleResolution: "nodenext"`).
  > ⚠️ **Regla ESM crítica:** Todos los imports relativos en TypeScript **deben incluir la extensión `.js`** (ej: `import { Site } from './site.js';`).
* **Framework:** NestJS 12.
* **Base de Datos:** MongoDB conectada mediante `@nestjs/mongoose` y `mongoose` 9+.
* **Validación de Entrada:** `class-validator` y `class-transformer` con `ValidationPipe` global en `src/main.ts` (`whitelist: true`, `transform: true`).
* **Documentación de API:** Swagger / OpenAPI en la ruta `/api`.
* **Herramientas de Calidad:**
  * Linter: **Oxlint** (`npm run lint`).
  * Pruebas: **Vitest** (`npm run test`).

---

## 3. Modelo de Dominio y Entidades Actuales

Actualmente se encuentran implementadas dos entidades principales bajo una relación **One-to-Many / hasMany** (`Account` 1 ➔ N `Site`):

### A. `Account` (Cuenta / Usuario titular)
* **Ubicación:** [`src/accounts/`](file:///home/gasparfay/Projects/IAW/searchsvc/src/accounts)
* **Propósito:** Representa a la persona u organización que posee sitios y realiza búsquedas.
* **Atributos:**
  * `_id`: ObjectId de MongoDB.
  * `name`: string (requerido, nombre del titular).
  * `email`: string (requerido, único, en minúsculas).
  * `apiKey`: string (UUID autogenerado mediante `crypto.randomUUID()`, con índice único).
  * `auth0Id`: string (opcional, sparse index, para vincular el ID de Google SSO / Auth0).
  * `createdAt` / `updatedAt`: Dates autogeneradas vía `timestamps: true`.
* **Relación Virtual:**
  * Define el campo virtual `sites` (`AccountSchema.virtual('sites', { ref: 'Site', localField: '_id', foreignField: 'accountId' })`). Permite que al hacer `.populate('sites')`, MongoDB devuelva los sitios asociados sin tener que guardar un array ilimitado en la cuenta.
* **Endpoints:**
  * `POST /accounts`: Registra una nueva cuenta.
  * `GET /accounts`: Lista cuentas (con sus sitios poblados).
  * `GET /accounts/:id`: Obtiene una cuenta por ID.
  * `PATCH /accounts/:id`: Actualiza datos de la cuenta.
  * `DELETE /accounts/:id`: Elimina la cuenta.

---

### B. `Site` (Sitio web a crawlear)
* **Ubicación:** [`src/sites/`](file:///home/gasparfay/Projects/IAW/searchsvc/src/sites)
* **Propósito:** Configura los parámetros de visita e inspección de un sitio específico.
* **Atributos:**
  * `_id`: ObjectId de MongoDB.
  * `accountId`: ObjectId referenciando a `Account` (**clave foránea requerida**, con índice).
  * `name`: string (requerido, nombre identificatorio del sitio).
  * `url`: string (requerido, URL base a crawlear).
  * `maxDepth`: number (default: 2, profundidad de páginas a visitar).
  * `frequency`: string (default: `'daily'`, intervalo o expresión cron de visita).
  * `extractorSnippet`: string (código JavaScript ejecutable para extraer datos de la página usando Cheerio).
  * `pageResolverSnippet`: string (opcional, código JavaScript para resolver qué links `<a href>` seguir).
* **Integridad Referencial:**
  * En `SitesService.create()`, antes de guardar el sitio se valida que el `accountId` exista en MongoDB mediante `this.accountsService.findOne()`.
* **DTOs y Tipado:**
  * `CreateSiteDto`: Exige `accountId` como `@IsMongoId()`, `url` válida con `@IsUrl()`, y el snippet.
  * `UpdateSiteDto`: Usa `PartialType(OmitType(CreateSiteDto, ['accountId'] as const))` para permitir actualizar cualquier campo pero **bloquear que se transfiera el sitio a otra cuenta**.
* **Endpoints:**
  * `POST /sites`: Registra un nuevo sitio.
  * `GET /sites`: Lista sitios (soporta filtro opcional `?accountId=<id>`).
  * `GET /sites/:id`: Obtiene un sitio por ID (con los datos básicos de la cuenta dueña poblados).
  * `PATCH /sites/:id`: Modifica la configuración de un sitio.
  * `DELETE /sites/:id`: Elimina un sitio.

---

## 4. Requerimientos Pendientes del Enunciado (Roadmap)

Según **`Search service.pdf`**, para completar el sistema se requerirán las siguientes etapas:

### 1. Entidad `ExtractedDocument` (Página / Documento extraído)
* Representa los datos extraídos de cada página visitada.
* Campos sugeridos:
  * `siteId`: ObjectId referenciando a `Site`.
  * `url`: string (URL de la página visitada).
  * `name` / `title`: string (título extraído).
  * `description`: string (descripción extraída de metatags o párrafos).
  * `content`: string (contenido de texto).
  * `crawledAt`: Date.
* **Índice de Texto `$text`:** Configurar un índice compuesto de texto sobre `name`, `description` y `content` para permitir búsquedas eficientes por palabras clave.

### 2. Entidad `Snapshot` (Fotos de ejecución del Crawler)
* El PDF menciona: *"desde la aplicación, se deberá permitir acceder a las diferentes fotos/snapshots que capturó el job/tarea de un sitio. Por cada 'foto', se deberá poder navegar por los diferentes documentos extraídos"*.
* Modela cada corrida histórica del crawler con su estado, fecha de inicio/fin y cantidad de páginas procesadas.

### 3. Endpoint de Búsqueda Externa (`GET /search`)
* Formato especificado en el PDF:
  ```http
  GET /search?q=palabra1+palabra2
  Authorization: <API Key generada>
  ```
* Lógica requerida:
  1. Extraer el token de `Authorization` y buscar la cuenta asociada a ese `apiKey`. Si no existe, responder 401 Unauthorized.
  2. Obtener los IDs de los sitios pertenecientes a esa cuenta.
  3. Ejecutar la consulta en MongoDB usando `$text: { $search: q }` acotada a los sitios de esa cuenta, ordenada por relevancia (`score: { $meta: 'textScore' }`).
  4. Retornar la lista de documentos extraídos.

### 4. Motor de Crawling y Scheduler
* Sistema de tareas programadas (jobs) disparadas según la `frequency` configurada en cada sitio.
* Descarga de HTML con Cheerio.
* Ejecución segura en sandbox (módulo `vm` de Node.js) del `extractorSnippet` y del `pageResolverSnippet`.
* Respeto del límite de niveles de hojas (`maxDepth`).

### 5. Integración con Auth0 / Google SSO
* Proteger endpoints administrativos mediante validación de JWT emitidos por Auth0.
* Vinculación del usuario logueado con el campo `auth0Id` de la entidad `Account`.

---

## 5. Estructura de Carpetas del Proyecto

```text
searchsvc/
├── .env                              # Variables de entorno activas (MONGODB_URI)
├── package.json                      # Dependencias y scripts del proyecto
├── nest-cli.json                     # Configuración del CLI de NestJS
├── tsconfig.json                     # TypeScript config (nodenext)
├── Search Service.pdf                # Enunciado original completo
├── agents.md                         # Este documento de contexto
│
└── src/
    ├── main.ts                       # Bootstrap de NestJS con ValidationPipe global
    ├── app.module.ts                 # Módulo raíz (conecta MongooseModule.forRootAsync y submódulos)
    ├── app.controller.ts             # Health check básico
    ├── app.service.ts                # Servicio base
    │
    ├── accounts/                     # Dominio de Cuentas / Usuarios
    │   ├── schemas/account.schema.ts # Esquema MongoDB y virtuals de Account
    │   ├── dto/create-account.dto.ts # DTO de validación para creación
    │   ├── dto/update-account.dto.ts # DTO de actualización
    │   ├── accounts.controller.ts    # Endpoints HTTP (/accounts)
    │   ├── accounts.service.ts       # Operaciones de base de datos
    │   └── accounts.module.ts        # Registro y exportación de AccountsService
    │
    └── sites/                        # Dominio de Sitios a crawlear
        ├── schemas/site.schema.ts    # Esquema MongoDB de Site (referencia a Account)
        ├── dto/create-site.dto.ts    # DTO de validación para creación
        ├── dto/update-site.dto.ts    # DTO con OmitType para bloquear cambio de dueño
        ├── sites.controller.ts       # Endpoints HTTP (/sites)
        ├── sites.service.ts          # Operaciones de base de datos y validación de FK
        └── sites.module.ts           # Registro del módulo
```

---

## 6. Comandos de Operación

```bash
# Iniciar en modo desarrollo con recarga automática:
npm run start:dev

# Compilar para producción (TypeScript nodenext):
npm run build

# Ejecutar el linter (Oxlint):
npm run lint

# Ejecutar tests unitarios (Vitest):
npm run test
```
