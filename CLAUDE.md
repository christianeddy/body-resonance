# CLAUDE.md — Bodhi App

## 1. Qué es el proyecto

Bodhi es una app móvil de wellness enfocada en respiración y cold/heat exposure. El MVP incluye 10 prácticas (6 de respiración + 4 de hielo/calor), todas gratuitas. Los usuarios pueden explorar prácticas por categoría e intención, reproducirlas con guía visual o de audio, registrar sus sesiones y seguir programas multi-día. El backend corre en Supabase (Postgres + Auth) y el frontend en React. El builder principal es Lovable, que genera y sincroniza frontend + schema de Supabase juntos.

---

## 2. Stack

- **Frontend:** React 18 + Vite 5 + TypeScript + Tailwind CSS 3.4
- **UI:** shadcn/ui (55+ componentes Radix UI) + Phosphor Icons + Lucide React
- **Routing:** React Router DOM v6
- **Data fetching:** TanStack React Query v5
- **Backend:** Supabase (Postgres + Auth + RLS)
- **Forms:** React Hook Form + Zod
- **Charts:** Recharts
- **Tema:** Dark forzado, mobile-first, container 430px
- **Fuentes:** Poppins (display) + DM Sans (body)
- **Builder:** Lovable (genera código frontend + schema Supabase)
- **Testing:** Vitest (unit) + Playwright (e2e)

---

## 3. Workflow con Lovable

- **Lovable es el builder principal.** Genera el frontend y el schema de Supabase juntos en sync.
- **Flujo estándar:** Lovable genera cambios → `git pull` local → revisar/refinar → `git push` de vuelta.
- **Supabase es nativo a Lovable.** No modificar tablas, migraciones ni RLS directamente desde código local. Los cambios en DB van por prompt en Lovable.
- Las migraciones en `supabase/migrations/` son generadas por Lovable — no editarlas manualmente.
- El archivo `src/integrations/supabase/types.ts` es auto-generado — no editarlo a mano.

---

## 4. Estructura de carpetas

```
bodhi-app/
├── src/
│   ├── pages/              # Una página por ruta (Auth, Index, Respirar, Sesion, Perfil,
│   │                       #   Player, Practica, Programa, Onboarding, NotFound)
│   ├── components/
│   │   ├── ui/             # shadcn/ui (55+ componentes)
│   │   ├── layout/         # MobileShell, BottomNav, PageTransition
│   │   ├── AuthGuard.tsx   # Protección de rutas + redirect onboarding
│   │   └── BreathingCircle.tsx  # Visualización animada de respiración
│   ├── hooks/              # useAuth, usePractices, useSessions,
│   │                       #   usePrograms, useFavorites
│   ├── integrations/
│   │   ├── supabase/       # client.ts + types.ts (auto-generado)
│   │   └── lovable/        # OAuth integration
│   ├── lib/
│   │   └── utils.ts        # cn() y helpers
│   ├── assets/             # Imágenes: logo, hero-*.png, ritual-*.png
│   └── App.tsx             # Routing principal
├── supabase/
│   ├── config.toml         # Project ID: adhkldxelbehovkykkrc
│   └── migrations/         # 8 archivos SQL (generados por Lovable)
├── public/
├── CLAUDE.md               # Este archivo
├── README.md
└── package.json
```

---

## 5. Rutas principales

| Path | Página | Acceso |
|---|---|---|
| `/auth` | Auth | Pública |
| `/onboarding` | Onboarding | Protegida |
| `/` | Index (home/dashboard) | Protegida |
| `/respirar` | Breathing explorer | Protegida |
| `/sesion` | Ice/heat sessions (tabs) | Protegida |
| `/perfil` | Perfil de usuario | Protegida |
| `/practica/:id` | Detalle de práctica | Protegida |
| `/programa/:id` | Detalle de programa | Protegida |
| `/player/:id` | Reproductor de práctica | Protegida |
| `/*` | NotFound (404) | — |

Layout: `MobileShell` envuelve todas las rutas protegidas con `<Outlet />` + `BottomNav` (5 tabs: Home, Respirar, Frío, Calor, Perfil).

---

## 6. Tablas de Supabase

| Tabla | Propósito | Campos clave |
|---|---|---|
| `profiles` | Perfil del usuario | `user_id`, `display_name`, `user_profile`, `onboarding_completed`, `onboarding_answers` |
| `practices` | Catálogo de prácticas | `id`, `name`, `category`, `intention`, `technique`, `duration_estimated`, `intensity`, `media_mode`, `media_url`, `phases` (JSONB), `tags` (JSONB), `premium`, `sort_order` |
| `programs` | Programas multi-día | `id`, `name`, `description`, `target_profile`, `days` (JSONB), `max_days` |
| `sessions` | Historial de sesiones completadas | `user_id`, `practice_id`, `duration_seconds`, `feeling`, `temperature`, `ice_duration_minutes` |
| `saved_practices` | Favoritos del usuario | `user_id`, `practice_id`, `saved_at` |
| `user_program_progress` | Progreso en programas | `user_id`, `program_id`, `current_day`, `completed_days` (JSONB) |

RLS habilitado en todas las tablas. Todos los cambios de schema van por Lovable.

---

## 7. Regla de oro

**Este proyecto se construye en Lovable.**

El rol de Claude en este proyecto es:
- Analizar código y documentar estructura
- Generar diagramas (Mermaid u otros)
- Refactorizar código local que luego se pushea a Lovable
- Identificar deuda técnica y proponer mejoras

**No hacer:**
- Crear features nuevas que rompan el sync con Lovable
- Modificar Supabase directamente (migraciones, RLS, schema)
- Editar `src/integrations/supabase/types.ts` a mano
- Editar archivos en `supabase/migrations/` manualmente

---

## 8. Pendientes / Deuda técnica

- **TypeScript strict está desactivado** (`strict: false` en `tsconfig.app.json`). Hay uso de `any` en varios hooks y tipos de Supabase. Activarlo requeriría una sesión de limpieza de tipos.

- **Textos hardcodeados en componentes** — La sección "Aprende" tiene contenido educativo escrito directo en los componentes, pendiente de migrar a datos reales (tabla en Supabase o CMS).

- **Protocolos pendientes de definir por la clienta:**
  - `Energy Flow` — protocolo de exposición al frío para energía
  - `Rest Flow` — protocolo de exposición al calor para recuperación
  - Programa `New to Bodhi` — programa introductorio multi-día

- **Nombre del package.json** sigue siendo `vite_react_shadcn_ts` (el default de Lovable). No afecta funcionalidad pero podría actualizarse a `bodhi-app`.

- **`/practica/:id` está intencionalmente desconectada** — El componente `Practica.tsx` existe y funciona, pero ninguna pantalla navega a él. Está bloqueada porque el contenido (descripciones, técnica, fases detalladas por práctica) aún no está definido. Para activarla cuando esté lista la data:
  1. Definir el contenido de cada práctica con la clienta (technique, phases, tags en tabla `practices`)
  2. Cargar la data vía Lovable (prompt → migración)
  3. Agregar `Link to={/practica/${id}}` en los cards de `Respirar.tsx` y `Sesion.tsx`
  4. Decidir si el flujo es: card → detalle → player, o mantener card → player directo
