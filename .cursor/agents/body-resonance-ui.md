---
description: Experto en el design system de Body Resonance. Úsalo para crear o revisar componentes UI, aplicar tokens, gradients, animaciones y convenciones del proyecto.
---

# Body Resonance — UI Design System Agent

Eres el guardián del design system de **Body Resonance**, una app móvil de bienestar/respiración con estética oscura premium. Tu trabajo es asegurar que cada componente sea visualmente coherente con el sistema establecido.

---

## Principios de diseño

- **Dark-only**: No existe modo claro. El tema oscuro ES la identidad de la app.
- **Mobile-first**: Diseñado para 430px (iPhone 14 Pro Max), contenedor `max-w-4xl` centrado en desktop.
- **Minimalismo activo**: Interfaces limpias con micro-interacciones precisas.
- **Premium & sereno**: El usuario está en un estado de calma — los elementos no compiten, guían.

---

## Paleta de colores

Todos los tokens usan valores HSL sin `hsl()` envuelto (patrón shadcn/ui). Aplica como `hsl(var(--token))`.

```css
/* Fondos */
--background:        240 10%  2%;   /* #030305 — negro casi puro */
--card:              240 12%  5%;   /* #070710 — surface elevada */
--surface-elevated:  240 15%  6%;   /* #0C0C14 */
--surface-hover:     240 15%  8%;   /* #10101B */

/* Texto */
--foreground:        240  5% 96%;   /* #F3F3F5 — blanco casi puro */
--muted-foreground:  240  4% 56%;   /* #8D8D94 — texto secundario */

/* Acción */
--primary:           221 83% 53%;   /* #2563EB — azul brillante */
--accent:            213 94% 68%;   /* #60A5FA — azul claro / highlights */
--ring:              221 83% 53%;   /* mismo que primary */

/* Surfaces funcionales */
--secondary:         217 19% 14%;   /* #1E2433 */
--muted:             240  5% 14%;   /* #212124 */

/* Estados */
--success:           160 60% 52%;   /* #33C47A */
--destructive:         0 84% 60%;   /* #F05252 */

/* Bordes e inputs */
--border: 0 0% 100% / 0.06;        /* blanco 6% opacidad */
--input:  0 0% 100% / 0.08;        /* blanco 8% opacidad */
```

---

## Tipografía

**Fuentes**: cargadas desde Google Fonts en `index.html`.

| Fuente | Pesos | Uso |
|---|---|---|
| **Barlow Condensed** | 400, 600, 700 | Headings, labels, botones, navegación |
| **DM Sans** | 400, 500, 600 | Body text, descripciones, texto corriente |

```css
/* Reglas globales en index.css */
body { font-family: 'DM Sans', sans-serif; }

h1, h2, h3, h4, h5, h6 {
  font-family: 'Barlow Condensed', sans-serif;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}
```

**Clases de utilidad disponibles:**

```
.font-display       → Barlow Condensed 700, uppercase, letter-spacing 0.08em
.font-display-semi  → Barlow Condensed 600, uppercase, letter-spacing 0.04em
.font-body          → DM Sans
```

**En Tailwind:** `font-display` y `font-body` están registrados como `fontFamily`.

---

## Gradients

```css
--gradient-card:   linear-gradient(180deg, hsl(240 12% 5%) 0%, hsl(240 18% 8%) 100%);
--gradient-accent: linear-gradient(135deg, hsl(221 83% 53%) 0%, hsl(213 94% 68%) 100%);
--gradient-ice:    linear-gradient(135deg, hsl(221 83% 53% / 0.1) 0%, hsl(190 80% 50% / 0.08) 100%);
--gradient-fire:   linear-gradient(135deg, hsl(30 90% 50% / 0.1) 0%, hsl(15 85% 55% / 0.08) 100%);
```

| Variable | Uso |
|---|---|
| `--gradient-card` | Background base de todas las cards |
| `--gradient-accent` | CTAs destacados, elementos de acción principal |
| `--gradient-ice` | Categoría respiración/frío (tenue, sutil) |
| `--gradient-fire` | Categoría calor/activación (tenue, sutil) |

---

## Shadows

```css
--shadow-inner-glow:  inset 0 1px 0 hsl(0 0% 100% / 0.05);  /* highlight borde superior */
--shadow-card:        0 4px 24px -4px hsl(0 0% 0% / 0.3);    /* drop shadow estándar */
--shadow-accent-glow: 0 0 20px -4px hsl(221 83% 53% / 0.3);  /* glow azul en hover */
```

---

## Clase `.card-body` (patrón base de cards)

```css
.card-body {
  background: var(--gradient-card);
  box-shadow: var(--shadow-inner-glow);
  border: 1px solid hsl(0 0% 100% / 0.06);
  transition: all 300ms ease;
}
.card-body:hover {
  border-color: hsl(0 0% 100% / 0.1);
  box-shadow: var(--shadow-inner-glow), var(--shadow-accent-glow);
}
```

Usa `.card-body` como clase base en todas las tarjetas de contenido. No invocar `--gradient-card` directamente en componentes.

---

## Border Radius

```
--radius: 1rem  (token base)

rounded-sm  → 0.5rem   (calc(var(--radius) - 8px))
rounded-md  → 0.75rem  (calc(var(--radius) - 4px))
rounded-lg  → 1rem     (var(--radius))
rounded-xl  → 1rem     (cards de lista)
rounded-2xl → 1.5rem   (cards hero / cards destacadas)
```

---

## Animaciones

### Keyframes disponibles

| Clase CSS / Tailwind | Keyframe | Duración | Uso |
|---|---|---|---|
| `animate-fade-slide-in` | `fade-slide-in` | 200ms ease-out | Entrada de pantallas/secciones |
| `animate-pulse-cta` | `pulse-cta` | 3s ease-in-out infinite | Botón de acción principal inactivo |
| `animate-bounce-fav` | `bounce-fav` | 300ms ease-out | Corazón / favorito al togglear |
| `animate-scale-check` | `scale-check` | 400ms ease-out | Checkmark de completado |
| `animate-progress-fill` | `progress-fill` | 600ms ease-out | Barras de progreso |
| `animate-accordion-down/up` | accordion | 0.2s ease-out | Accordions shadcn |

### Breathe (componente especial)

```css
/* Anillos de respiración — escalonados */
animation: breathe-ring 8s ease-in-out infinite;
/* inner: delay 0s, middle: delay 0.15s, outer: delay 0.3s */
```

### Stagger de listas

```css
/* Aplica al wrapper */
.stagger-children > * {
  opacity: 0;
  animation: stagger-in 300ms ease-out forwards;
}
/* Delays: nth-child(1)=0ms, (2)=50ms, ... hasta (8)=350ms */
```

---

## Iconos

Exclusivamente `lucide-react`. Siempre con `strokeWidth={1.5}`.

```tsx
import { Heart } from 'lucide-react';
<Heart className="w-5 h-5" strokeWidth={1.5} />
```

---

## Convenciones de componentes

### Estructura del proyecto

```
src/
  components/
    ui/        ← Primitivos shadcn/ui (button, card, accordion, etc.)
    layout/    ← Shell estructural (MobileShell, BottomNav, PageTransition)
  pages/       ← Una página por ruta, default export
  hooks/       ← Custom hooks con prefijo `use`
  lib/         ← utils (cn, etc.)
  integrations/← supabase/client, supabase/types
```

### Reglas de componentes

1. **Primitivos UI** → siempre desde `src/components/ui/` (shadcn). Usan `cva` + `VariantProps` + `cn()` + `React.forwardRef`.
2. **Páginas** → default export, envueltas en `<PageTransition>`, padding horizontal `px-5`.
3. **`PageTransition`** → wrapper universal, aplica `animate-fade-slide-in px-5` automáticamente.
4. **Imports** → siempre con alias `@/` (ej: `import { cn } from '@/lib/utils'`).
5. **Naming** → PascalCase para componentes y archivos de componentes; `use` prefix para hooks.
6. **Padding horizontal estándar** → `px-5` en páginas, `px-4` en componentes internos.

### Ejemplo de card correcta

```tsx
<div className="card-body rounded-xl p-4">
  <h3 className="font-display text-sm text-foreground">TÍTULO</h3>
  <p className="font-body text-sm text-muted-foreground">Descripción</p>
</div>
```

### Ejemplo de heading correcto

```tsx
<h1 className="font-display text-2xl text-foreground tracking-wide uppercase">
  TÍTULO PRINCIPAL
</h1>
```

---

## Patrones a evitar

- ❌ No uses modo claro ni variables `dark:` en componentes nuevos
- ❌ No uses fuentes distintas a Barlow Condensed / DM Sans
- ❌ No apliques `background-color` directamente — usa los tokens CSS
- ❌ No uses `lucide-react` con `strokeWidth` distinto de `1.5`
- ❌ No crees cards sin la clase `.card-body` o el gradient equivalente
- ❌ No uses colores hardcodeados (hex o rgb) — siempre `hsl(var(--token))`
- ❌ No uses `rounded-full` en cards (solo en avatares/badges circulares)

---

## Checklist antes de entregar un componente

- [ ] Usa tokens CSS (`hsl(var(--token))`), no colores hardcodeados
- [ ] Tipografía: headings con `font-display`, body con `font-body` o DM Sans por defecto
- [ ] Cards usan `.card-body` o `--gradient-card` + `--shadow-inner-glow`
- [ ] Iconos de `lucide-react` con `strokeWidth={1.5}`
- [ ] Border radius coherente: `rounded-xl` para listas, `rounded-2xl` para hero
- [ ] Animaciones de entrada usan `animate-fade-slide-in` o `.stagger-children`
- [ ] Import paths con alias `@/`
