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
the only way HAUSE accepts structure. The canonical index is
[`manifest.ts`](manifest.ts) — every consumer that counts or lists the
forms derives from it, so the lists below are prose, and the manifest is
the evidence.

**Statements** — prose forms in the three voices; server-renderable, no
interaction. The reader reads.
`Hero · Statement · Observation · Claim · Evidence · Question · Timeline ·
Connection · Refusal · Excerpt`

**Instruments** — interactive forms; understanding through manipulation.
The reader operates them, and every one carries a text fallback so the
point survives with the interaction removed.
`Anatomy · Decomposition · ExpertField · Comparison · Variants · Ladder ·
Agreement · Derivation · ByteMap · FollowReveal · Terminal · Gating ·
Provenance · Citation · Lens`

(`Inquiry` lives outside `forms/` — a routing primitive over the real
forms, not a form itself.)

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

## Sound — the tactile voice

`sound.ts` is a synthesized palette (sine waves and envelopes, no audio
files): `tick` for a selection, `swap` for a staged swap committing,
`settle` for a performance finishing, `refuse` for a fail-closed moment.
Opt-in via `SoundToggle` (localStorage `hause-sound`), off by default —
hause sound is chosen, never inflicted. Loops stay silent; only
interactions and completions speak. Peak gains sit far below speech
level: a well-made drawer closing, not an app chirping.

**HAUSE knows nothing about any specific site's content model.** No file here imports from outside this package. `Inquiry` takes a `resolve` function as a prop rather than importing one — the caller (the site) supplies what a query means; HAUSE only supplies how the result is experienced. That boundary is the whole point of this being a separate repo.

## Using it in a project

This isn't published to a registry. All three consumers install it straight from the repository:

```bash
npm install github:chrishayuk/hause
```

```json
// package.json — what that writes
"dependencies": {
  "@chrishayuk/hause": "github:chrishayuk/hause"
}
```

A sibling checkout (`"file:../hause"`) also works and is convenient while
changing the library and a consumer together — but the lockfile then
pins a path rather than a commit, so a deploy that runs `npm ci`
elsewhere will not find it. Use the GitHub form for anything that ships;
`npm update @chrishayuk/hause` moves a consumer to the current commit. Because this package ships raw `.tsx`/`.ts` source (no build step), the consuming Next.js app has to compile it itself — add it to `next.config.ts`:

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

/* Tailwind v4 skips node_modules when scanning for class names, so the
   utilities used only inside the forms are never generated without this.
   All three consumers found it the same way: a page that rendered with
   none of its styles. */
@source "../../node_modules/@chrishayuk/hause";
```

Fonts are the one thing HAUSE doesn't own — each site loads Fraunces / Inter / Geist Mono itself via `next/font/google` in its own `layout.tsx` and applies the resulting CSS variables **on `<html>`**, not `<body>` (see chrishayuk's `DESIGN.md` for exactly why — a CSS custom-property inheritance gotcha, not a style preference).

Import components by subpath:

```tsx
import { Statement } from "@chrishayuk/hause/components/forms/Statement";
import { ModeToggle } from "@chrishayuk/hause/components/ModeToggle";
import type { Status } from "@chrishayuk/hause/types";
```

## Light / Dark

Two authored environments, not a `prefers-color-scheme` inversion — **dark is the default**, an editorial choice rather than the OS preference, and a viewer opts into light through `ModeToggle`, which sets `data-mode="light"` on `<html>` and flips the `--bg`/`--fg` tokens. (`tokens.css` is the authority here; this paragraph said the opposite for two days after the default changed, which is the drift the library argues against, found by a reader rather than by a build.) To avoid a flash on load, each consuming site's `layout.tsx` needs a small blocking inline script in `<head>` that reads `localStorage` before paint, plus `suppressHydrationWarning` on `<html>` for the resulting (expected) attribute mismatch. Copy this verbatim rather than reinventing it — see any consuming site's `layout.tsx`:

```html
<script dangerouslySetInnerHTML={{ __html:
  `try{var m=localStorage.getItem('hause-mode');if(m==='light')document.documentElement.dataset.mode='light';}catch(e){}`
}} />
```

## Design principles (the ones that matter for extension)

- **No generic card kit.** Every `forms/*` component is a specific, semantic thing — a Statement is not a styled div, it's an editorial-voice claim with its own scale and rhythm. If you're about to add a `Card` component, stop.
- **A Mode gets built for a real chapter, not manufactured as a demo.** `ExpertField` (Simulation) and `Comparison` (one object, two interpretations) both exist because a real exhibition needed them, in that order, discovered through making — not designed as an abstract taxonomy up front. When adding a new Mode, build it against real content first.
- **Always-present text fallback.** Every interactive form (`Decomposition`, `ExpertField`, `Comparison`) renders a plain-language sentence describing its point even with the interaction removed — for `prefers-reduced-motion`, no-JS, and crawlers. Keep this pattern.
- **`prefers-reduced-motion` gets a designed static state, not just `animation: none`.** Check `Reveal`, `.graph-pulse`, `.pace-demo-box` in `tokens.css` for the pattern.

## Machine legibility — SEO and AEO as design-system concerns

HAUSE is a design system for AI, and that cuts both ways: AIs compose
answers *from* the forms, and machines — crawlers, answer engines, agent
browsers — must be able to *read* what the forms say. Legibility to
machines is not an afterthought bolted onto a site; it is part of the
grammar, carried by the library itself:

- **The `Answer` form.** A natural-language question as a real heading and
  a 40–100 word answer a reader or a machine can lift whole, with a stable
  anchor so the exact question is citable — not just the page. It sits
  beneath the editorial surface and says the plain thing plainly; the
  beautiful heading keeps its job.
- **`seo.ts` + `JsonLd`.** Builders that emit structured data from records
  a site already holds — WebSite, TechArticle, BreadcrumbList, DefinedTerm
  (a knowledge-graph entity, said in schema.org), SoftwareApplication,
  QAPage. The crawlable answer can never drift from the rendered one,
  because both project from the same record.
- **Query-shaped `<title>`, designed headings.** The browser title says
  what the page answers, in the words people search with; the visible
  HAUSE heading stays exactly as designed. You get both, always.
- **ARIA state on every instrument.** Agent browsers read `aria-pressed`,
  `aria-expanded`, and labels to understand interactive interfaces — the
  Terminal's DESIGNED|RAW|GRAPH tabs carry them, and every new instrument
  must.
- **Nothing lives only in the animation.** The always-present text
  fallback (above) is also the AEO rule: canvas, WebGL, and animation
  coordinates are invisible to crawlers, so every form's point must
  survive with the interaction stripped.

The test for all of it: strip the page to text, and it should still
answer the question it was designed to answer.

## Provenance and citation — publishing as a design-system concern

A design system for AI has to model the objects an AI actually reasons
over. Buttons and cards are not those objects; claims, evidence,
sources and provenance are. Citation is where that stops being a thesis
and becomes machinery, so HAUSE carries it: `cite.ts`, and two forms.

**One record, four surfaces.** A `CitationRecord` — title, authors,
first-publication date, version, canonical URL, and whatever
identifiers actually exist — projects onto all four places a
publication has to exist at once, and can never drift between them:

- **the page** — `Provenance`, one quiet line (published · revised ·
  version · DOI where there is one) that expands to the full record:
  the commit, the artifact hash, the archive record, the dated history
  of how the work came to be said.
- **the export** — `Citation`, the reference in the formats people
  paste. Three, not six: BibTeX for LaTeX, APA for prose, CSL-JSON
  because every reference manager turns it into the other three hundred.
- **the head** — `citationMeta()` emits `citation_*` tags, which is how
  Zotero, Scholar and every "add to library" button read a page without
  being told anything about your site. Spread it into Next's
  `metadata.other`.
- **the graph** — `citationLd()` in `seo.ts`, the same record said in
  schema.org, with identifiers as PropertyValues.

**Two levels, one system.** Everything substantive is *citable by
default*: stable URL, title, author, first-publication date, version,
and an export — no registration, no cost, nothing to decide. A work
that makes a claim worth defending can additionally become a
*registered publication*: an immutable version plus a registered
identifier (a DOI, a SWHID, an archive record). The second is a
deliberate act, not a side effect of publishing, and it changes nothing
about the first. A DOI is infrastructure, not aesthetics.

**The rules, which are the same rule.** `published` means *first*
published — a revision sets `revised` and never quietly moves the date,
because the date is what a priority claim rests on. A substantive
change is a new version, not a silent edit; the old version stays
addressable. And an identifier that has not been registered is
**absent** — no placeholder DOI, no "registration pending" — exactly
the discipline the manifest applies to an unrecorded origin. The record
states what is true and stops.

**The register stays the site's.** A citable page is not a paper: it
looks like whatever it already looked like, and the apparatus sits
underneath — one quiet evidence-voice line, and a block at the foot for
anyone who needs the reference. Behaviour of research, without the
performance of research.

As with everything else here, HAUSE knows nothing about your content:
the site holds the records, the library holds the forms, the
formatters and the machine surfaces.

## Depth is a design problem, not a navigation problem

Technical writing keeps splitting one subject into a tutorial and a
reference, then asking the reader to guess which one holds their answer.
The `Lens` instrument refuses the split: one concept, one URL, several
depths — **LEARN** what it means, **INSPECT** the real object, **SPEC**
the words that govern it — with the reader's chosen depth remembered
across pages and written into the fragment, so a reader who thinks in
clauses stays in clauses and can link someone straight to the depth they
meant.

Every panel stays in the DOM. Depth is disclosure, not content gating —
which is also why the normative text is legible to a crawler whether or
not anyone clicked the tab, and why a reader with no JavaScript still
lands on a complete first depth rather than an empty frame.

## How a form enters the library

Four stages, and the third is the one that does the work.

**DISCOVERED** — a real page exposes an explanatory need. Not a gap in a
taxonomy, not a component someone would like to have: a chapter that
cannot be built with what exists.

**BUILT** — one implementation solves that need, in the exhibition that
raised it. It lives in that site, doing real work, knowing everything
about the content it carries. Most things stop here, and should.

**REUSED** — a second, genuinely different context needs the same
semantic act, and gets it *without the abstraction being bent to fit the
first consumer*. Reuse is evidence, not duplication: a second instance
on the same page is duplication; a second exhibition with a different
subject is evidence. The manifest records this as `reusedBy`, measured
from the consuming sites' real pages — exhibiting a form in a specimen
book is not using one.

**PROMOTED** — the abstraction has survived reuse, its semantics are
stable, its text and machine fallback are defined, and its props no
longer know which exhibition caused it. Only then does HAUSE own it.

The point of the third rung is that promotion stops being a matter of
taste. The question "why is this a first-class form?" gets answered with
"because reality asked for it more than once", and the record shows
where. A form that has served one exhibition has been generalised
against one kind of content — which is a claim about the author's
imagination, not about the form.

Two properties by one author is the weakest admissible evidence of
reuse, and the library says so rather than counting it as proof. The
test that matters is an exhibition whose content has nothing to do with
the one the form was born in.

## A capability that matters earns a record

The second rule this library learned by failing rather than by design.

A keyword list tells a system which words to notice. A record tells it
what the thing means. The difference is invisible until something has to
resolve an input nobody anticipated — and then it is the whole
difference.

Two evaluations found it from opposite directions on the same day.
CHOOSING-1 gave a model 124 unfamiliar descriptions and asked which form
each needed: from the manifest's one-line records it answered 122; the
deployed keyword resolver, given the same 124, answered 8. ROUTING-1
then asked sixty questions of the assistant itself, and the spaces
backed by records — what is this form, where did it come from — answered
24 of 24, while the spaces backed by hand-written keyword lists answered
16 of 36.

So: **a capability that matters earns a record; a keyword list is only
scaffolding until the record exists.** The manifest is a record. The
selection grammar is a record. The problems are records. Where a surface
still holds a list of phrases, that is not an implementation detail — it
is a capability that has not been given its object yet, and it will fail
on the first sentence nobody thought to add.

This sits beside the other rule the same programme produced: a recurring
visual need earns a form, a one-page visual need earns an
implementation. Both are the same instinct — do not promote scaffolding,
and do not leave a real thing as scaffolding either.
