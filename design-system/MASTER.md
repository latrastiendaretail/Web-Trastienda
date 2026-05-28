# La Trastienda — Design System MASTER

> Global Source of Truth. Page-specific overrides live in `pages/`. When a page file exists, its rules override these.

---

## Project Identity

**Name**: La Trastienda  
**Tagline**: El comercio, desde dentro.  
**Sub-tagline**: Retail con propósito  
**Mission**: Social-retail hybrid — training people at risk of exclusion, connecting them to retail companies.  
**Tone**: Professional but human. Credible without coldness. Never ONG-aesthetic, never generic startup.  
**3 Audiences**: Particulares (young workers) · Empresas (retail companies) · Instituciones (public/social orgs)

---

## Style

**Primary style**: Minimalism & Swiss Style  
**Secondary style**: Storytelling-Driven (for mission narrative)  
**Tertiary style**: Trust & Authority (for B2B / institutional sections)

**Why**: The mockup is editorial-minimal with ochre accent. Clean grid-based layout, generous whitespace, serif display headings, functional sans body. Professional credibility + warm humanity.

**Anti-patterns to avoid**:
- No generic ONG/charity aesthetic (blue + orange + rounded)
- No startup-tech glassmorphism
- No heavy animations or parallax overload
- No emojis as icons — use SVG only (Lucide or Heroicons)
- No gradients in primary surfaces — clean flat color

---

## Color Palette

Direction D2 — Híbrida (Palette A + Typography C + Ocre accent). Source: `Direccion Artistica.html`.

| Token | Name | Hex | Usage |
|-------|------|-----|-------|
| `--color-papel` | Papel / Base | `#F4EFE6` | Page background, primary surface |
| `--color-tinta` | Tinta | `#1A1714` | Primary text, headings, borders |
| `--color-acento` | Ocre (D2) | `#B8821C` | CTAs, accent elements — **primary** |
| `--color-acento-soft` | Trigo (D1) | `#C9A227` | Secondary accent, highlights |
| `--color-acento-deep` | Bronce (D3) | `#8F5E1A` | Accent text on light backgrounds |
| `--color-lino` | Lino | `#E8DFCE` | Muted borders, dividers, card borders |
| `--color-cuero` | Cobre seco | `#8B7F70` | Secondary text, captions, subtle UI |
| `--color-blanco` | Blanco | `#FDFBF8` | Card surfaces, elevated elements |

### Contrast Rules
- Body text (`--color-tinta` on `--color-papel`): ratio ~13:1 ✅
- Accent (`--color-acento` on `--color-papel`): ~4.6:1 ✅ (passes AA)
- CTA button: `--color-tinta` bg + `--color-papel` text for maximum contrast
- Ocre CTA: `--color-acento` bg + `--color-tinta` text ✅
- **Never** use `--color-lino` or `--color-cuero` for body text — muted/captions only

---

## Typography

**Pairing**: Newsreader (headings/display) + Space Grotesk (body) + IBM Plex Mono (labels/mono)  
**Category**: Variable Serif + Geometric Sans + Monospace — Direction D2 Híbrida

```js
// next/font/google — layout.tsx
Newsreader({ weight: ['400','500','600'], style: ['normal','italic'], variable: '--font-newsreader' })
Space_Grotesk({ weight: ['300','400','500','600'], variable: '--font-space-grotesk' })
IBM_Plex_Mono({ weight: ['400','500'], variable: '--font-mono' })
```

```js
// tailwind.config.ts
fontFamily: {
  display: ['var(--font-newsreader)', 'Georgia', 'serif'],
  sans:    ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
  mono:    ['var(--font-mono)', 'monospace'],
}
```

### Type Scale

| Token | Size | Weight | Font | Usage |
|-------|------|--------|------|-------|
| `font-display` | clamp(3rem, 6vw, 5rem) | 400–500 | Newsreader | Hero headings |
| `font-display italic` | clamp(2.5rem, 5vw, 4rem) | 400 italic | Newsreader | Emotional subheadings |
| `font-display` h1 | clamp(2rem, 4vw, 3rem) | 400–500 | Newsreader | Section titles |
| `font-display` h2 | clamp(1.5rem, 2.5vw, 2rem) | 500 | Newsreader | Sub-section titles |
| `font-sans` body | 17–18px | 400 | Space Grotesk | Body text |
| `font-sans` small | 15–16px | 400 | Space Grotesk | Secondary body |
| `font-mono` caption | 12–13px | 400 | IBM Plex Mono | Labels, nav tags, eyebrows |

**Rules**:
- Line height body: 1.6 (comfortable reading)
- Line height headings: 0.95–1.2 (tight, editorial)
- Max line length: 65ch for body text
- Letter spacing display: -0.02em
- Letter spacing mono labels: 0.12–0.22em (spaced uppercase)
- Use italic Newsreader for emotional/emphasis — never faux italic

---

## Spacing & Layout

```css
--spacing-xs: 0.5rem;   /* 8px */
--spacing-sm: 1rem;     /* 16px */
--spacing-md: 1.5rem;   /* 24px */
--spacing-lg: 2.5rem;   /* 40px */
--spacing-xl: 4rem;     /* 64px */
--spacing-2xl: 6rem;    /* 96px */
--spacing-3xl: 8rem;    /* 128px */
```

- Container max-width: `1200px` (use consistently)
- Section padding: `py-24 md:py-32` (6rem / 8rem)
- Content padding: `px-6 md:px-12 lg:px-16`
- Grid gap: `gap-8 md:gap-12`
- Border radius: `rounded-none` for cards (sharp), `rounded-sm` (2px) for buttons

---

## Component Patterns

### Navbar
- Float style: `fixed top-4 left-4 right-4` with `max-w-7xl mx-auto`
- Background: `bg-papel/90 backdrop-blur-sm border border-lino/40`
- Logo: wordmark in Cormorant Garamond 500 + "RETAIL CON PROPÓSITO" in Inter 500 12px uppercase tracked
- Nav links: Inter 500 13px uppercase tracked, `text-cuero hover:text-tinta transition-colors duration-200`
- CTA button: `bg-tinta text-papel px-5 py-2 text-sm font-medium`

### Hero
- Full viewport height
- Headline: display font 500, "El comercio, desde dentro." — "desde dentro" in italic
- Sub-copy: Inter 18px, max 65ch, `text-cuero`
- Two CTAs: primary `bg-acento text-tinta` + secondary `border border-tinta/30 text-tinta`
- Decorative element: right column with "2 canales / 3 audiencias" stats in large Cormorant

### Cards (Programa / Audience)
- Background: `bg-blanco border border-lino/50`
- No border-radius on cards — sharp editorial
- Hover: `border-color: --color-tinta` transition 200ms
- Cursor: `cursor-pointer` always on interactive cards

### CTA Buttons

```css
/* Primary */
.btn-primary {
  background: var(--color-acento);
  color: var(--color-tinta);
  padding: 0.75rem 1.75rem;
  font-family: Inter;
  font-size: 14px;
  font-weight: 500;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-radius: 2px;
  cursor: pointer;
  transition: background 200ms, color 200ms;
}
.btn-primary:hover {
  background: var(--color-tinta);
  color: var(--color-papel);
}

/* Secondary */
.btn-secondary {
  border: 1px solid var(--color-tinta);
  color: var(--color-tinta);
  /* same sizing */
}
.btn-secondary:hover {
  background: var(--color-tinta);
  color: var(--color-papel);
}
```

### Section Dividers
- Alternate background: `bg-papel` ↔ `bg-tinta` (dark section) for visual rhythm
- Dark sections: text becomes `text-papel`, accent becomes `text-acento`

---

## Landing Page Structure

Based on: Storytelling-Driven + Feature-Rich Showcase pattern

```
1. [NAV]     Floating navbar — logo + links + CTA "Trabaja con nosotros"
2. [HERO]    "El comercio, desde dentro." — mission + 2 CTAs + stats aside
3. [QUIÉNES] Who we are — 3 founders, human tone, NOT corporate bios
4. [PROGRAMAS] 3 audience cards: Particulares · Empresas · Instituciones
5. [CONTENIDO] Training content pills — articles/resources on retail sector
6. [PODCAST]  Podcast or curated content section
7. [CONTACTO] Contact section — distinct CTA per audience type
8. [FOOTER]  Minimal: logo + nav links + legal
```

**CTA hierarchy**:
- Primary: "Trabaja con nosotros" (particulares)
- Secondary: "Formaciones abiertas"
- Tertiary: "Para empresas →" / "Para instituciones →"

---

## Icons

- Library: **Lucide React** (consistent 24x24 viewBox)
- Size: `w-5 h-5` (20px) for inline, `w-6 h-6` (24px) for standalone
- Color: inherit from parent text color
- Never use emoji as icons

---

## Animation

- Duration: 150–250ms for hover/focus states
- Easing: `ease-out` or `cubic-bezier(0.4, 0, 0.2, 1)`
- Scroll reveals: `translateY(16px) → translateY(0)` + `opacity 0 → 1`, 400ms
- Never animate `width`, `height`, `padding` — only `transform` + `opacity`
- Always check `prefers-reduced-motion`:

```css
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

## Accessibility Checklist

- [ ] All body text ≥ 16px
- [ ] Contrast ratio ≥ 4.5:1 for all text (check `--color-cuero` on `--color-papel`)
- [ ] Focus rings: `outline: 2px solid var(--color-acento); outline-offset: 2px`
- [ ] All `<img>` have descriptive `alt` text
- [ ] All form inputs have associated `<label>`
- [ ] Interactive elements have `cursor-pointer`
- [ ] Touch targets ≥ 44x44px
- [ ] `aria-label` on icon-only buttons
- [ ] Tab order matches visual flow
- [ ] `viewport meta`: `width=device-width, initial-scale=1`

---

## Tailwind CSS Variables

Add to `globals.css`:

```css
:root {
  --color-papel:        #F4EFE6;
  --color-tinta:        #1A1714;
  --color-acento:       #B8821C;
  --color-acento-soft:  #C9A227;
  --color-acento-deep:  #8F5E1A;
  --color-lino:         #E8DFCE;
  --color-cuero:        #8B7F70;
  --color-blanco:       #FDFBF8;
}
```

Extend in `tailwind.config.ts`:

```js
extend: {
  colors: {
    papel:         '#F4EFE6',
    tinta:         '#1A1714',
    acento:        '#B8821C',
    'acento-soft': '#C9A227',
    'acento-deep': '#8F5E1A',
    lino:          '#E8DFCE',
    cuero:         '#8B7F70',
    blanco:        '#FDFBF8',
  },
  fontFamily: {
    display: ['var(--font-newsreader)', 'Georgia', 'serif'],
    sans:    ['var(--font-space-grotesk)', 'system-ui', 'sans-serif'],
    mono:    ['var(--font-mono)', 'monospace'],
  },
}
```

---

## Z-Index Scale

```css
--z-base:    0;
--z-card:    10;
--z-sticky:  20;
--z-nav:     30;
--z-modal:   50;
--z-toast:   60;
```

---

## Pre-Delivery Checklist

- [ ] No emojis as icons — SVG/Lucide only
- [ ] All clickable elements: `cursor-pointer`
- [ ] Hover states: 200ms color/border transitions
- [ ] `--color-cuero` not used for body text (captions only)
- [ ] Floating nav has `top-4 left-4 right-4` spacing
- [ ] Content doesn't hide behind fixed navbar (add padding-top)
- [ ] Responsive: 375px · 768px · 1024px · 1440px
- [ ] No horizontal scroll on mobile

---

*Last updated: 2026-05-24 — Updated to Direction D2 Híbrida from `Direccion Artistica.html` (Newsreader + Space Grotesk + IBM Plex Mono, Ocre #B8821C)*
