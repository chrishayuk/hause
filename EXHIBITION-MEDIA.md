# Exhibition media and recorded outcomes

Donated by hause.design, 9 September 2026. These are publication/composition capabilities, not additions to the semantic form count. The first consumer needed material imagery, a before/after you could operate without JavaScript, a choice between three modes, and a visible record of every evaluation outcome.

- `components/exhibition/VisualPlate`: accepts a `media` React slot, `label`, `title`, `reading`, required `credit`, and optional `className`. The consumer supplies responsive images, intrinsic dimensions, meaningful alt text and truthful source/generation disclosure. No image asset, venue, historical claim or automatic video policy ships with it.
- `components/exhibition/ExhibitionChoices`: requires a unique `id`, a `legend` and `choices: {label, content}[]`. Native radio controls present one panel at a time, including without JavaScript. Arrow keys and focus use native radio behaviour. All content is server-rendered; printing exposes every panel. Avoid huge choice sets. Hidden media must manage its own visibility/playback lifecycle.
- `BeforeAfter`, from the same module: a two-choice composition taking `before`, `after`, `legend`, a unique `id` and optional labels. It performs no automated transformation and never invents an intermediate state.
- `components/exhibition/OutcomeMatrix`: accepts a condition `label`, frozen `outcomes: {id, expected, selected, exact}[]`, required `scope` and `sourceHref`. One solid or slashed mark per case, a derived total and a native table disclosure. Recorded `exact` decisions are authoritative, including accepted alternatives and abstentions. Empty input is not 0% accuracy. Duplicate case IDs are rejected. The complete table remains available without JavaScript. Marks are an overview, not 124 redundant keyboard stops.

Portable styling is in `exhibition-media.css` in the low-priority `hause-components` layer. Surfaces use `--bg` and `--fg`; there is no forced dark or light mode, automatic animation, remote request or site-specific copy. The consumer may supply art direction. Image/video loading belongs to its media renderer.

## Guided journeys and connected records

The later problem-chapter pass adds:

- `components/exhibition/SequencePlayer`: `label` and non-empty `frames: {id, label, reading, content, durationMs?}[]`. Unique frame IDs are required. Initial SSR state is the final frame; a native disclosure retains every reading. Playback is explicitly reader-started, finite and stoppable. It stops offscreen, on page hide and on a change to reduced motion; reduced-motion readers use static frame controls. Consumer-supplied CSS animations must honour both `data-playing` and `prefers-reduced-motion`. This is a standalone sequence, not a replacement for MotionProvider; do not place competing media inside its frames. Re-key the component when replacing its programme.
- `record-difference.ts`: `recordDifference(expected, actual)` compares string identities, rejects duplicates, and returns `{missing, extra, matches}`. It catches different records with equal counts. It neither loads files nor asserts independent sources.

DecisionTrail now supports `layout="beside"`: compact native disclosures hold the choices next to the result; both stay server-rendered and responsive. GraphNeighbourhood groups incident edges by relation and neighbouring record kind; branches with more than six edges begin collapsed. Every edge remains in the HTML, with its direction and basis intact. `groupRelationships` is exported from `exhibition-graph.ts` for other renderers. These changes refine the same donated capabilities, not the form taxonomy.

Also donated by hause.design on 9 September 2026:

- `components/exhibition/DecisionTrail`: accepts ordered `steps: {id, title, selected, options: {id, label, detail, href}[]}[]` and a result in `children`. Each option is a real anchor, the current choice has `aria-current`, and the consumer owns the URL, selection rules and server-rendered result. The component does not infer recommendations. Use a small number of meaningful choices per step; the full reference can sit beneath the journey.
- `components/exhibition/GraphNeighbourhood`: accepts `nodes`, `edges` and `focusId`. Nodes carry `id`, `title`, `kind`, `text`, `href` (the work), `focusHref` (navigation within the graph) and `sourceHref`. Edges carry `from`, `to`, `relation` and `basis`. All incident edges are shown, including distinct relations between the same endpoints; no invented edges, truncated lists or force simulation. Basis disclosures and links remain usable without JavaScript. Desktop uses incoming / focus / outgoing columns; narrow screens place focus first and label each direction explicitly.
- `exhibition-graph.ts`: exports the node/edge types and `graphNeighbourhood` helper. Rejects duplicate node IDs, missing focus, dangling endpoints and duplicate directed relations. Self-edges appear in both directional lists by design. Empty branches have explicit recorded-absence text.

The selection grammar, graph records, route validation and authored form studies stay with the consumer. These capabilities do not change the semantic form count. The native VINDEX3 film wrapper in hause.design composes the existing `useMotion` contract; its archive media and editorial interpretation are not donated assets.

```tsx
import { VisualPlate } from "@chrishayuk/hause/components/exhibition/VisualPlate";
import { BeforeAfter } from "@chrishayuk/hause/components/exhibition/ExhibitionChoices";

<VisualPlate media={<img src="/study.webp" width={1536} height={1024}
  loading="lazy" alt="Describe this particular visual." />}
  label="A MATERIAL STUDY" title="Let the object explain."
  reading="The publication supplies the interpretation."
  credit="State who made it, and whether it is generated or documentary." />
<BeforeAfter id="unique-treatment" legend="Compare the treatments"
  before={<p>Original treatment</p>} after={<p>Revised treatment</p>} />
```

Run `node --experimental-strip-types --test tests/exhibition-media.test.ts` for scoring invariants. hause.design's production-build checks exercise the rendered components, native controls, scopes, sources and complete case records. Interactive browser verification is still required.

The first consumer's installed release predates these components and holds 35 forms, while current library HEAD holds 37. Until an explicit package upgrade, that consumer carries an exact, SHA-256-checked source snapshot via `scripts/sync-exhibition.ts`. Library files are canonical; the snapshot must not be edited independently. This avoids silently promoting two unrelated forms into the site's catalogue during a media change.
