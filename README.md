# HAUSE

A cinematic visual language for ideas, systems and explanations — not a component library, not brand guidelines. Extracted from [chrishayuk](https://github.com/chrishayuk/chrishayuk) once a second consumer (vindex3.org) made copy-pasting the design system across repos the wrong move.

Read `tokens.css` and the files under `components/` before this README — they're the source of truth. This file just explains how a project wires HAUSE in.

## What's in here

```
tokens.css     palette, three type voices (editorial/system/evidence), 12-col grid,
               motion tokens, Light/Dark, status marks, reveal/pulse animations
types.ts       Status ("OPEN" | "ONGOING" | "SUPPORTED" | "REFUTED" | "SUPERSEDED")
components/
  Reveal.tsx          scroll-triggered reveal wrapper
  StatusMark.tsx       word + dot status indicator
  GridOverlay.tsx      "SHOW STRUCTURE" 12-column overlay
  PaceDemo.tsx         Immediate / Considered / Cinematic motion demo
  ModeToggle.tsx       LIGHT / DARK control
  Inquiry.tsx          "Ask the Codex"-style query -> real-form primitive
  forms/               the chapter primitives — all in one flat directory,
                        because the import path is the public API and it does
                        not move. The taxonomy below is documentation, not
                        directory structure.
```

## The three modes

Every form under `forms/` is one of three kinds. The split was not designed
up front — it emerged from real chapters (the vindex3.org build), which is
the only way HAUSE accepts structure.

**Statements** — prose forms in the three voices; server-renderable, no
interaction. The reader reads.
`Hero · Statement · Observation · Claim · Evidence · Question · Timeline ·
Connection · Refusal`

**Instruments** — interactive forms; understanding through manipulation.
The reader operates them, and every one carries a text fallback so the
point survives with the interaction removed.
`Decomposition · ExpertField · Comparison · Variants · Ladder · Agreement ·
Derivation · Anatomy · ByteMap · FollowReveal · Inquiry`

**Performances** — cinematic forms; they play themselves. In-view start, a
designed resting state (which is what reduced-motion and no-JS get), REPLAY
where the piece runs once, a gentle in-view loop where a scrolling reader
must never find it finished. Never a crossfade between two physical forms
of one thing — staged swaps only.
`Film · Transformation · Unfolding · Compilation · Procession · Magnitude ·
Channel · Quantisation`

Three motion idioms, one per mode boundary: the one-shot `Reveal`, the
staged swap (`.swap-in`), and the in-view loop (pause off-screen, rest
state designed). A new form should say which mode it is in its doc comment.

**HAUSE knows nothing about any specific site's content model.** No file here imports from outside this package. `Inquiry` takes a `resolve` function as a prop rather than importing one — the caller (the site) supplies what a query means; HAUSE only supplies how the result is experienced. That boundary is the whole point of this being a separate repo.

## Using it in a project

This isn't published to a registry — it's consumed as a local path dependency between sibling checkouts:

```json
// package.json
"dependencies": {
  "@chrishayuk/hause": "file:../hause"
}
```

Then `npm install`. Because this package ships raw `.tsx`/`.ts` source (no build step), the consuming Next.js app has to compile it itself — add it to `next.config.ts`:

```ts
const nextConfig: NextConfig = {
  transpilePackages: ["@chrishayuk/hause"],
};
```

Pull the tokens into your global stylesheet:

```css
/* app/globals.css */
@import "tailwindcss";
@import "@chrishayuk/hause/tokens.css";
```

Fonts are the one thing HAUSE doesn't own — each site loads Fraunces / Inter / Geist Mono itself via `next/font/google` in its own `layout.tsx` and applies the resulting CSS variables **on `<html>`**, not `<body>` (see chrishayuk's `DESIGN.md` for exactly why — a CSS custom-property inheritance gotcha, not a style preference).

Import components by subpath:

```tsx
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { ModeToggle } from "@chrishayuk/hause/components/ModeToggle";
import type { Status } from "@chrishayuk/hause/types";
```

## Light / Dark

Two authored environments, not a `prefers-color-scheme` inversion — default light, explicit opt-in via `ModeToggle`, `data-mode="dark"` on `<html>` flips the `--bg`/`--fg` tokens. To avoid a flash on load, each consuming site's `layout.tsx` needs a small blocking inline script in `<head>` that reads `localStorage` before paint, plus `suppressHydrationWarning` on `<html>` for the resulting (expected) attribute mismatch. Copy this verbatim rather than reinventing it — see any consuming site's `layout.tsx`:

```html
<script dangerouslySetInnerHTML={{ __html:
  `try{var m=localStorage.getItem('hause-mode');if(m==='dark')document.documentElement.dataset.mode='dark';}catch(e){}`
}} />
```

## Design principles (the ones that matter for extension)

- **No generic card kit.** Every `forms/*` component is a specific, semantic thing — a Statement is not a styled div, it's an editorial-voice claim with its own scale and rhythm. If you're about to add a `Card` component, stop.
- **A Mode gets built for a real chapter, not manufactured as a demo.** `ExpertField` (Simulation) and `Comparison` (one object, two interpretations) both exist because a real exhibition needed them, in that order, discovered through making — not designed as an abstract taxonomy up front. When adding a new Mode, build it against real content first.
- **Always-present text fallback.** Every interactive form (`Decomposition`, `ExpertField`, `Comparison`) renders a plain-language sentence describing its point even with the interaction removed — for `prefers-reduced-motion`, no-JS, and crawlers. Keep this pattern.
- **`prefers-reduced-motion` gets a designed static state, not just `animation: none`.** Check `Reveal`, `.graph-pulse`, `.pace-demo-box` in `tokens.css` for the pattern.
