# 🚀 Guía de Despliegue en Vercel — DAX Servicios Digitales

> Guía paso a paso para desplegar la plataforma DAX en Vercel con PostgreSQL.

---

## 📋 Requisitos Previos

| Requisito | Detalle |
|-----------|---------|
| **Node.js** | Versión 18 o superior ([descargar](https://nodejs.org/)) |
| **Vercel CLI** | `npm i -g vercel` |
| **Cuenta de GitHub** | [github.com](https://github.com) |
| **Cuenta de Vercel** | [vercel.com](https://vercel.com) (gratuita) |
| **Base de datos PostgreSQL** | Vercel Postgres, Neon, Supabase o PlanetScale |

> ⚠️ **Importante:** Vercel no soporta SQLite en producción (el filesystem es efímero). Es necesario migrar a PostgreSQL antes de desplegar.

---

## Paso 1 — Subir el proyecto a GitHub

### 1.1 Inicializar repositorio Git

```bash
cd dax-project

# Inicializar repositorio
git init

# Crear .gitignore (si no existe)
cat > .gitignore << 'EOF'
node_modules/
.next/
db/*.db
db/*.db-journal
.env
.env.local
*.log
EOF

# Agregar todos los archivos
git add .

# Primer commit
git commit -m "feat: proyecto DAX inicial"
```

### 1.2 Crear repositorio en GitHub y subir

```bash
# Crear el repositorio en GitHub desde la web:
# https://github.com/new → Nombre: dax-project → Private

# Conectar y subir
git remote add origin https://github.com/TU_USUARIO/dax-project.git
git branch -M main
git push -u origin main
```

---

## Paso 2 — Migrar base de datos de SQLite a PostgreSQL

Vercel usa un filesystem efímero, lo que significa que SQLite se pierde en cada despliegue. **Es obligatorio usar PostgreSQL en producción.**

### Opción A: Vercel Postgres (Recomendada)

La opción más sencilla porque se integra directamente con Vercel.

1. Ve a [vercel.com/dashboard](https://vercel.com/dashboard)
2. Selecciona tu proyecto → pestaña **Storage**
3. Haz clic en **Create Database** → selecciona **Postgres**
4. Selecciona el plan **Free** (Hobby) → **Create**
5. Vercel generará automáticamente la variable `DATABASE_URL` en tu proyecto

### Opción B: Proveedores externos

| Proveedor | Plan gratuito | URL |
|-----------|---------------|-----|
| **Neon** | Sí (0.5 GB) | [neon.tech](https://neon.tech) |
| **Supabase** | Sí (500 MB) | [supabase.com](https://supabase.com) |
| **PlanetScale** | No (pago) | [planetscale.com](https://planetscale.com) |

> 💡 Neon es una excelente alternativa gratuita con branching y escalado automático.

### 2.1 Modificar el esquema de Prisma

Edita el archivo `prisma/schema.prisma`:

**Antes (SQLite):**
```prisma
datasource db {
  provider = "sqlite"
  url      = env("DATABASE_URL")
}
```

**Después (PostgreSQL):**
```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}
```

El resto del esquema (modelos User, Service, Order, Transaction, Setting) **no necesita cambios** — Prisma maneja las diferencias entre motores automáticamente.

### 2.2 Actualizar el archivo de base de datos (`src/lib/db.ts`)

Para producción en Vercel, es recomendable reducir el nivel de logging:

```typescript
import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['query'] : ['error'],
  })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

### 2.3 Actualizar `next.config.ts` para Vercel

El proyecto tiene `output: "standalone"` que es para despliegues en VPS/Docker. En Vercel **no es necesario** y puede causar conflictos:

**Antes:**
```typescript
const nextConfig: NextConfig = {
  output: "standalone",
  // ...
};
```

**Después:**
```typescript
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;
```

### 2.4 Agregar script de migración en `package.json`

Agrega estos scripts a tu `package.json`:

```json
{
  "scripts": {
    "postinstall": "prisma generate",
    "db:migrate:prod": "prisma migrate deploy",
    "vercel-build": "prisma migrate deploy && next build"
  }
}
```

### 2.5 Crear la migración inicial

Antes de desplegar, genera la migración que se aplicará en Vercel:

```bash
# Instalar dependencias
npm install

# Generar el cliente Prisma
npx prisma generate

# Crear la migración inicial (sin aplicarla localmente si no tienes PostgreSQL local)
npx prisma migrate dev --name init --create-only
```

> 📝 El flag `--create-only` genera los archivos SQL sin ejecutarlos. Esto es útil si no tienes PostgreSQL instalado localmente. Los archivos se crean en `prisma/migrations/`.

Si **sí** tienes PostgreSQL local y quieres verificar:

```bash
# Con DATABASE_URL apuntando a tu PostgreSQL local:
npx prisma migrate dev --name init
```

### 2.6 Hacer commit de los cambios

```bash
git add .
git commit -m "feat: migrar de SQLite a PostgreSQL para Vercel"
git push origin main
```

---

## Paso 3 — Conectar a Vercel

### 3.1 Desde la interfaz web (Recomendado)

1. Ve a [vercel.com/new](https://vercel.com/new)
2. Haz clic en **Import Git Repository**
3. Selecciona tu repositorio `dax-project`
4. Se abrirá la pantalla de configuración del proyecto

### 3.2 Desde la CLI (Alternativa)

```bash
# Instalar Vercel CLI si no lo tienes
npm i -g vercel

# Iniciar sesión
vercel login

# Desplegar (desde la raíz del proyecto)
vercel

# Para producción:
vercel --prod
```

---

## Paso 4 — Configurar Variables de Entorno

En la pantalla de configuración del proyecto en Vercel, ve a **Settings → Environment Variables** y agrega:

| Variable | Valor | Requerida |
|----------|-------|-----------|
| `DATABASE_URL` | `postgresql://usuario:contraseña@host:5432/nombre_db?sslmode=require` | ✅ Sí |
| `TELEGRAM_BOT_TOKEN` | Token de tu bot de Telegram | ⚠️ Opcional |
| `TELEGRAM_CHAT_ID` | ID del chat/grupo de Telegram | ⚠️ Opcional |

### Ejemplo de `DATABASE_URL`

**Vercel Postgres:**
```
postgresql://default:xxxxx@ep-xxx-xxx.us-east-1.aws.neon.tech/verceldb?sslmode=require
```

**Neon:**
```
postgresql://neondb_owner:xxxxx@ep-xxx-xxx.us-east-1.aws.neon.tech/neondb?sslmode=require
```

**Supabase:**
```
postgresql://postgres.xxxxx:xxxxx@aws-0-region.pooler.supabase.com:6543/postgres?sslmode=require
```

> 💡 Si usas Vercel Postgres y lo creaste desde la pestaña Storage, la variable `DATABASE_URL` se configura automáticamente.

### Configuración desde la CLI

```bash
# Configurar variables de entorno desde la terminal
vercel env add DATABASE_URL production
vercel env add TELEGRAM_BOT_TOKEN production
vercel env add TELEGRAM_CHAT_ID production

# Ver variables configuradas
vercel env ls
```

---

## Paso 5 — Configurar Build

En la pantalla de configuración del proyecto (o en **Settings → General**):

| Configuración | Valor |
|---------------|-------|
| **Framework Preset** | Next.js |
| **Build Command** | `npx prisma generate && npx prisma migrate deploy && next build` |
| **Output Directory** | `.next` |
| **Install Command** | `npm install` |
| **Node.js Version** | 18.x o 20.x |

> ⚠️ **Alternativa más limpia:** Si agregaste el script `"vercel-build"` en el paso 2.4, puedes dejar el Build Command por defecto (`next build`) y Vercel usará automáticamente el script `vercel-build` si existe. Pero es más explícito configurarlo manualmente como se indica arriba.

### Captura de configuración en Vercel

```
┌──────────────────────────────────────────────────────┐
│  Project Settings                                    │
├──────────────────────────────────────────────────────┤
│  Framework Preset:  Next.js                          │
│  Build Command:     npx prisma generate &&           │
│                     npx prisma migrate deploy &&     │
│                     next build                       │
│  Output Directory:  .next                            │
│  Install Command:   npm install                      │
└──────────────────────────────────────────────────────┘
```

---

## Paso 6 — Desplegar

### 6.1 Primer despliegue

1. Desde la pantalla de configuración del proyecto en Vercel, haz clic en **Deploy**
2. Espera a que complete el build (usualmente 1-3 minutos)
3. Si todo sale bien, verás el mensaje ✅ **Congratulations!**

### 6.2 Verificar el despliegue

```bash
# Obtener la URL del despliegue
vercel ls

# Probar que el sitio responde
curl -s -o /dev/null -w "%{http_code}" https://tu-proyecto.vercel.app
# Debería devolver: 200
```

### 6.3 Despliegues posteriores

Cada `git push` a la rama `main` activará automáticamente un nuevo despliegue:

```bash
git add .
git commit -m "fix: cambio descripción"
git push origin main
# Vercel detecta el push y despliega automáticamente
```

---

## Paso 7 — Poblar la Base de Datos (Seed)

Una vez desplegado, necesitas crear los datos iniciales (admin, servicios, configuración).

### 7.1 Ejecutar el seed con curl

```bash
# Reemplaza con tu URL de Vercel
curl -X POST https://tu-proyecto.vercel.app/api/seed
```

Respuesta esperada:
```json
{
  "message": "Base de datos poblada exitosamente",
  "seeded": true
}
```

> ⚠️ Si recibes `{"message": "Ya hay datos en la base de datos", "seeded": false}`, significa que ya se había ejecutado antes.

### 7.2 Verificar datos

```bash
# Verificar servicios
curl -s https://tu-proyecto.vercel.app/api/services | head -c 200

# Verificar login del admin
curl -X POST https://tu-proyecto.vercel.app/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@dax.com","password":"admin123"}'
```

### 7.3 Credenciales por defecto

| Rol | Email | Contraseña |
|-----|-------|------------|
| Admin | admin@dax.com | admin123 |
| Usuario | juan@ejemplo.com | user123 |

> 🔒 **Importante:** Cambia la contraseña del admin inmediatamente después del primer despliegue.

---

## Paso 8 — Post-Despliegue

### 8.1 Dominio personalizado

1. Ve a **Settings → Domains** en tu proyecto de Vercel
2. Agrega tu dominio: `tudominio.com`
3. Configura los DNS en tu registrador:

| Tipo | Nombre | Valor |
|------|--------|-------|
| A | `@` | `76.76.21.21` |
| CNAME | `www` | `cname.vercel-dns.com` |

4. Vercel configura automáticamente **SSL/HTTPS** con Let's Encrypt

### 8.2 Monitoreo

- **Vercel Analytics**: Settings → Analytics → Enable (gratuito en Hobby)
- **Vercel Speed Insights**: Settings → Speed Insights → Enable
- **Logs en tiempo real**: Ve a tu proyecto → Deployments → clic en un deploy → Logs
- **Alertas**: Vercel envía notificaciones por email si un deploy falla

### 8.3 Proteger el endpoint de Seed

Para producción, se recomienda proteger el endpoint `/api/seed` para que solo admins puedan ejecutarlo. Agrega esta verificación al inicio del handler:

```typescript
// En src/app/api/seed/route.ts — agregar protección
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { hashPassword } from '@/lib/auth';

export async function POST(request: NextRequest) {
  // Verificar que no existe un admin (solo permite seed inicial)
  const existingAdmin = await db.user.findFirst({ where: { role: 'admin' } });
  if (existingAdmin) {
    return NextResponse.json(
      { message: 'Ya hay datos en la base de datos', seeded: false },
      { status: 409 }
    );
  }
  // ... resto del código
}
```

> El código actual ya incluye esta protección — verificará si ya existe un admin antes de insertar datos.

---

## 🔧 Solución de Problemas

### Error: `P1001: Can't reach database server`

**Causa:** La `DATABASE_URL` es incorrecta o la base de datos no está accesible.

**Solución:**
```bash
# Verificar la URL de conexión
vercel env pull .env.local
npx prisma db pull

# Si falla, verifica que:
# 1. La URL incluye ?sslmode=require
# 2. Las credenciales son correctas
# 3. La IP de Vercel no está bloqueada por el proveedor
```

### Error: `P3005: The database schema is not empty`

**Causa:** Ya existe un schema en la base de datos.

**Solución:**
```bash
# Si es una base de datos nueva con schema incompleto, resetear:
npx prisma migrate reset

# O forzar la resolución:
npx prisma migrate resolve --applied "init"
```

### Error: `PrismaClient could not locate the Query Engine`

**Causa:** El cliente de Prisma no se generó durante el build.

**Solución:**
- Asegúrate de que el Build Command incluye `npx prisma generate`
- Agrega `"postinstall": "prisma generate"` en `package.json` (paso 2.4)

### Error: Cold starts lentos (>3 segundos)

**Causa:** Prisma genera el cliente en runtime en el primer request.

**Solución:**
1. Agrega `"postinstall": "prisma generate"` en `package.json`
2. Usa el adaptador de Prisma para Edge:

```bash
npm install @prisma/adapter-pg pg
```

3. Opcionalmente, cambia a Prisma Accelerate para caching:
```bash
npm install @prisma/extension-accelerate
```

4. Modifica `src/lib/db.ts` para Edge Runtime:

```typescript
import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'
import pg from 'pg'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  const adapter = new PrismaPg(new pg.Pool({ connectionString: process.env.DATABASE_URL }))
  return new PrismaClient({ adapter })
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db
```

### Error: `output: "standalone"` causa problemas en Vercel

**Causa:** El modo standalone es para despliegues en VPS/Docker, no para Vercel.

**Solución:** Elimina `output: "standalone"` de `next.config.ts` (ver paso 2.3).

### Error: Build falla con errores de TypeScript

**Causa:** El proyecto tiene `ignoreBuildErrors: true` pero aún puede fallar.

**Solución:**
```bash
# Verificar errores localmente antes de push
npx tsc --noEmit

# Si hay errores, puedes:
# 1. Corregir los errores
# 2. O mantener ignoreBuildErrors: true en next.config.ts
```

### Error: Las migraciones no se aplican

**Causa:** El Build Command no incluye `prisma migrate deploy`.

**Solución:**
```bash
# Verificar que el Build Command en Vercel sea:
npx prisma generate && npx prisma migrate deploy && next build

# O aplicar migraciones manualmente:
vercel env pull .env.local
npx prisma migrate deploy
```

### Error: `@prisma/client did not initialize yet`

**Causa:** El generador de Prisma no se ejecutó correctamente.

**Solución:**
1. Verifica que `prisma generate` está en el Build Command
2. Verifica que `prisma/schema.prisma` está en el repositorio (no en `.gitignore`)
3. Asegúrate de que el `provider` en el schema es `"postgresql"`, no `"sqlite"`

---

## 📝 Resumen Rápido

```bash
# 1. Subir a GitHub
git init && git add . && git commit -m "init"
git remote add origin https://github.com/TU_USUARIO/dax-project.git
git push -u origin main

# 2. Cambiar Prisma a PostgreSQL
# Editar prisma/schema.prisma: provider = "postgresql"
# Editar next.config.ts: eliminar output: "standalone"

# 3. Crear migración
npx prisma migrate dev --name init --create-only

# 4. Commit y push
git add . && git commit -m "feat: postgresql migration" && git push

# 5. Conectar en Vercel
# vercel.com/new → importar repositorio

# 6. Configurar en Vercel
# Build Command: npx prisma generate && npx prisma migrate deploy && next build
# Env vars: DATABASE_URL, TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID

# 7. Desplegar y poblar
curl -X POST https://tu-proyecto.vercel.app/api/seed

# 8. ¡Listo! 🎉
```

---

## 🏗️ Arquitectura en Producción

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────────┐
│  Usuario     │────▶│  Vercel CDN      │────▶│  Next.js App    │
│  (Navegador) │     │  (Edge Network)  │     │  (Serverless)   │
└─────────────┘     └──────────────────┘     └────────┬────────┘
                                                       │
                                              ┌────────▼────────┐
                                              │  PostgreSQL     │
                                              │  (Vercel/Neon)  │
                                              └─────────────────┘
                                                       │
                                              ┌────────▼────────┐
                                              │  Telegram API   │
                                              │  (Notificaciones)│
                                              └─────────────────┘
```

---

## 📚 Recursos Adicionales

- [Documentación de Vercel](https://vercel.com/docs)
- [Prisma en Vercel](https://www.prisma.io/docs/guides/deployment/deployment-guides/deploying-to-vercel)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Next.js en Vercel](https://nextjs.org/docs/app/building-your-application/deploying)
