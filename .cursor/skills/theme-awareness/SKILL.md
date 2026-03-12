---
name: theme-awareness
description: >-
  Crear componentes theme-safe que funcionan en light y dark mode. Evitar colores
  hardcodeados, usar tokens CSS, verificar contraste. Usar cuando se crean o
  modifican componentes UI, cuando se revisan estilos, o cuando el usuario pide
  soporte de light/dark mode.
---

# Theme Awareness — Body Resonance

Guía para crear componentes que funcionan en ambos temas sin colores hardcodeados.

## Regla principal

**NUNCA** usar valores HSL/hex/rgb directos en `className` o `style`. Siempre tokens CSS.

---

## Tabla de reemplazos

### Fondos

```
❌ bg-[#020202]                    → ✅ bg-background
❌ bg-[hsl(240_12%_5%)]            → ✅ bg-card
❌ bg-[hsl(0_0%_100%/0.06)]       → ✅ bg-border (o border-border)
❌ bg-[hsl(0_0%_100%/0.08)]       → ✅ bg-input
❌ bg-[hsl(0_0%_100%/0.12)]       → ✅ bg-muted
```

### Bordes

```
❌ border-[hsl(0_0%_100%/0.06)]   → ✅ border-border
❌ border-[hsl(0_0%_100%/0.08)]   → ✅ border-input
❌ border-[hsl(0_0%_100%/0.12)]   → ✅ border-muted
❌ border-[hsl(0_0%_100%/0.04)]   → ✅ border-border/60
```

### Textos

```
❌ text-[hsl(...)]                 → ✅ text-foreground / text-muted-foreground / text-accent
```

### Gradients inline

```
❌ style={{ background: "linear-gradient(135deg, hsl(240 12% 5%) ...)" }}
✅ style={{ background: "var(--gradient-card)" }}

❌ style={{ background: "linear-gradient(135deg, hsl(221 83% 53% / 0.1) ...)" }}
✅ style={{ background: "var(--gradient-ice)" }}
```

---

## Tokens disponibles por tema

| Token | Light | Dark |
|-------|-------|------|
| `--background` | blanco | casi negro |
| `--card` | gris 97% | gris 9% |
| `--foreground` | negro 10% | blanco 96% |
| `--muted-foreground` | gris 46% | gris 56% |
| `--border` | gris 91% | blanco 6% |
| `--primary` | azul 53% | azul 53% (mismo) |
| `--accent` | azul 58% | azul 68% |
| `--gradient-card` | gris claro | gris oscuro gradient |
| `--shadow-card` | sombra suave gris | sombra fuerte negra |

---

## Cards theme-safe

```tsx
// ✅ Correcto — usa .card-body que internamente referencia tokens
<div className="card-body rounded-xl p-4">

// ✅ Correcto — gradients con variables
<div className="card-body rounded-xl p-4" style={{ background: "var(--gradient-ice)" }}>

// ❌ Incorrecto — hsl hardcodeado
<div className="rounded-xl p-4 bg-[hsl(240_12%_5%)]">

// ❌ Incorrecto — gradient con valores fijos
<div style={{ background: "linear-gradient(135deg, hsl(240 12% 5%) 0%, hsl(240 18% 8%) 100%)" }}>
```

---

## Sombras por tema

Las sombras cambian con el tema via tokens CSS. Usar siempre variables:

```tsx
// ✅ Usa variable que cambia con el tema
box-shadow: var(--shadow-card)
box-shadow: var(--shadow-inner-glow)
box-shadow: var(--shadow-accent-glow)

// ❌ Hardcodeado — solo se ve bien en dark
box-shadow: 0 4px 24px -4px hsl(0 0% 0% / 0.3)
```

Para sombras en Tailwind que no tienen token, usar shadow con opacidad:
```
shadow-sm          → sombras del sistema (adaptan con tema)
shadow-md
shadow-lg
```

---

## Cómo verificar que un componente es theme-safe

1. Buscar en el archivo: cualquier literal `hsl(` en className o style
2. Buscar: cualquier `#` seguido de hex en className
3. Si encuentra alguno, reemplazar por token según tabla
4. Excepción: SVGs inline (como el logo de Google en Auth) pueden mantener colores fijos
5. Excepción: `.card-body` en index.css usa hsl() internamente — eso está bien porque son tokens

---

## Contraste light mode

| Combinación | ¿Legible? |
|-------------|-----------|
| `text-foreground` sobre `bg-background` | Sí |
| `text-foreground` sobre `bg-card` | Sí |
| `text-muted-foreground` sobre `bg-card` | Sí |
| `text-muted-foreground` sobre `bg-muted` | Verificar — puede ser bajo |
| `text-accent` sobre `bg-background` | Sí en dark, verificar en light |

Regla: si un texto es importante, usar `text-foreground`. Si es secundario, `text-muted-foreground`. No usar `text-accent` para textos largos.
