---
name: frontend-polish
description: >-
  Eleva la calidad visual de componentes UI en Body Resonance. Aplica tratamientos
  premium: gradientes ricos, íconos con glow/fondo, tipografía con jerarquía marcada,
  profundidad con shadows y glass, y micro-animaciones. Usar cuando el usuario pida
  mejorar el frontend, hacer polish visual, o refinar componentes existentes.
---

# Frontend Polish — Body Resonance

Guía para elevar componentes de "funcional" a "premium". No es documentación del design system (eso está en el subagente `body-resonance-ui`). Esto es un playbook de **cómo hacer que se vea increíble**.

## Principio central

Cada elemento debe tener **profundidad, intención y calidez**. Nada plano, nada genérico.

---

## 1. Gradientes — Nunca fondos planos

### Cards: gradient + inner glow + borde sutil

```css
/* ❌ Plano */
background: hsl(240 12% 5%);

/* ✅ Con profundidad */
background: linear-gradient(
  180deg,
  hsl(240 12% 5%) 0%,
  hsl(240 18% 8%) 100%
);
box-shadow: inset 0 1px 0 hsl(0 0% 100% / 0.05);
border: 1px solid hsl(0 0% 100% / 0.06);
```

### Cards destacadas: gradient diagonal con color de categoría

```tsx
// Hielo/Respiración — azul sutil
style={{ background: "linear-gradient(135deg, hsl(221 83% 53% / 0.08) 0%, hsl(190 80% 50% / 0.05) 100%)" }}

// Calor — naranja sutil
style={{ background: "linear-gradient(135deg, hsl(30 90% 50% / 0.08) 0%, hsl(15 85% 55% / 0.05) 100%)" }}

// Éxito/Completado — verde sutil
style={{ background: "linear-gradient(135deg, hsl(160 60% 52% / 0.08) 0%, hsl(140 50% 45% / 0.05) 100%)" }}
```

### Botones CTA: gradient en vez de color sólido

```tsx
// ❌ Plano
className="bg-primary"

// ✅ Con gradient y glow
className="bg-gradient-to-r from-[hsl(221,83%,48%)] to-[hsl(213,94%,63%)] shadow-[0_0_20px_-4px_hsl(221,83%,53%/0.4)]"
```

---

## 2. Íconos — Con personalidad, no líneas sueltas

### Íconos con fondo circular + color sutil

```tsx
// ❌ Genérico
<Activity size={16} className="text-muted-foreground" />

// ✅ Con presencia
<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
  <Activity size={16} strokeWidth={1.5} className="text-accent" />
</div>
```

### Íconos de categoría con glow

```tsx
// Para íconos destacados (hero cards, explore)
<div className="relative">
  <div className="absolute inset-0 rounded-full bg-primary/20 blur-md" />
  <div className="relative flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
    <Wind size={20} strokeWidth={1.5} className="text-accent" />
  </div>
</div>
```

### Regla de tamaños

| Contexto | Tamaño ícono | Fondo |
|----------|-------------|-------|
| Stats cards | 16px | `h-8 w-8 rounded-lg bg-primary/10` |
| Explore cards | 20px | `h-10 w-10 rounded-xl bg-[categoría]/10` |
| Hero/destacado | 24px | `h-12 w-12 rounded-xl` + glow |
| Inline/lista | 16-20px | Sin fondo, solo color |

---

## 3. Tipografía — Jerarquía clara y dramática

### Escala de tamaños

| Nivel | Clase | Ejemplo |
|-------|-------|---------|
| Hero | `font-display text-4xl` | Pantalla de logro, splash |
| Page title | `font-display text-2xl` | "HOLA, CHRISTIAN" |
| Section title | `font-display text-base text-muted-foreground` | "PROGRAMAS", "EXPLORA" |
| Card title | `font-display text-lg text-foreground` | Nombre de práctica |
| Body | `font-body text-sm text-muted-foreground` | Descripciones |
| Caption | `font-body text-[11px] text-muted-foreground` | Labels, metadata |
| Micro | `font-display text-[10px] text-accent` | Badges, chips |

### Números destacados: siempre bold y grandes

```tsx
// ❌ Número sin impacto
<p className="text-lg">{value}</p>

// ✅ Número con peso visual
<p className="font-display-semi text-3xl text-foreground">{value}</p>
<p className="font-body text-[11px] text-muted-foreground mt-1">{label}</p>
```

### Texto con acento de color

```tsx
// Para valores destacados (racha, logros)
<span className="bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent font-display-semi text-3xl">
  {streak}
</span>
```

---

## 4. Profundidad — Layers que se sienten

### Glass morphism para overlays y barras fijas

```tsx
className="bg-background/80 backdrop-blur-xl border-t border-[hsl(0_0%_100%/0.06)]"
```

### Sombras por nivel de elevación

```
Nivel 0 (fondo):     sin sombra
Nivel 1 (cards):     shadow-inner-glow + border 6%
Nivel 2 (hover):     shadow-inner-glow + shadow-accent-glow + border 10%
Nivel 3 (floating):  shadow-[0_8px_32px_-8px_hsl(0,0%,0%/0.5)]
Nivel 4 (modal):     shadow-[0_16px_64px_-16px_hsl(0,0%,0%/0.7)] + backdrop-blur
```

### Cards con borde superior luminoso

```tsx
// Efecto "glassmorphism lite" — borde top más brillante que el resto
<div className="card-body rounded-xl p-4 relative overflow-hidden">
  <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[hsl(0_0%_100%/0.1)] to-transparent" />
  {/* contenido */}
</div>
```

---

## 5. Micro-animaciones — Vida sin ruido

### Hover en cards: translate + glow

```tsx
className="card-body rounded-xl p-4 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_-4px_hsl(221,83%,53%/0.2)]"
```

### Números que cuentan (countup effect)

Para stats importantes, animar el número desde 0:

```tsx
const [displayed, setDisplayed] = useState(0);
useEffect(() => {
  const step = Math.max(1, Math.floor(target / 20));
  const interval = setInterval(() => {
    setDisplayed(d => d >= target ? target : d + step);
  }, 40);
  return () => clearInterval(interval);
}, [target]);
```

### Skeleton loaders con shimmer

```tsx
// ❌ Solo pulse
<div className="animate-pulse bg-card h-16 rounded-xl" />

// ✅ Con shimmer gradient
<div className="relative overflow-hidden rounded-xl bg-card h-16">
  <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-[hsl(0_0%_100%/0.04)] to-transparent" />
</div>
```

---

## 6. Badges y chips — Con identidad

### Badge de intención con color por tipo

```tsx
const intentionColors: Record<string, string> = {
  energia: "bg-amber-500/10 text-amber-400",
  calma: "bg-blue-400/10 text-blue-400",
  dormir: "bg-indigo-400/10 text-indigo-400",
  reset: "bg-emerald-400/10 text-emerald-400",
};

<span className={`rounded-full px-3 py-1 font-display text-[10px] ${intentionColors[intention]}`}>
  {intention.toUpperCase()}
</span>
```

### Badge con dot indicator

```tsx
<span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1">
  <span className="h-1.5 w-1.5 rounded-full bg-primary animate-pulse" />
  <span className="font-display text-[10px] text-accent">EN VIVO</span>
</span>
```

---

## Checklist de polish

Antes de entregar un componente "polished", verificar:

- [ ] Cards con gradient (no bg plano) + inner glow + borde sutil
- [ ] Íconos con fondo/contenedor, no flotando solos
- [ ] Jerarquía tipográfica clara (3+ niveles visibles)
- [ ] Al menos un elemento con gradient de texto o color de acento
- [ ] Hover states con translate Y + glow sutil
- [ ] Números grandes con font-display-semi, no font-body
- [ ] Badges con color contextual (no todos iguales)
- [ ] Loading states con shimmer, no solo pulse
- [ ] Botón CTA principal con gradient + shadow glow
