# Publication and film extensions

Contributed from the CHRISHAYUK publication. Editorial layouts remain in the consumer; citation and machine-legibility rules belong to HAUSE.

The subsequent hause.design exhibition donation adds `VisualPlate`, native
`ExhibitionChoices` / `BeforeAfter`, and `OutcomeMatrix`. They keep media credits,
readable treatment choices and per-case evaluation records with the experience.
See [EXHIBITION-MEDIA.md](EXHIBITION-MEDIA.md) for contracts and compatibility notes.
The publication supplies its imagery, text, outcomes and scope; none are generated
by these components. These capabilities do not add semantic forms.

- `cite.ts`: film/image kinds, literal corporate authors, optional unknown publication dates, stable record IDs; Plain, APA, BibTeX, CSL-JSON and head metadata share one record. Never use a retrieval date as a publication date. An absent date exports as n.d. and is omitted from machine date fields.
- `seo.ts`: `publicationMetadata` emits canonical, social, indexing and citation head values. `videoObjectLd` distinguishes the local screening URL, original source, producer and participants. These are discoverability helpers, not promises of indexing or rich-result eligibility. Sites supply summaries, facts, routes, imagery and their publication policy.
- `components/Motion`: one dominant visible media owner, explicit full-film activation, reduced-motion/save-data, global pause, page visibility and dialog suspension. Wrap the publication once. `useMotion` lets local ambient films and system studies join the same coordinator. Storage key is configurable.
- `components/YouTubeFilm`: poster-first, click-to-load privacy-enhanced YouTube screening. Optional React preview slot, external chapter requests and configurable exhibition classes. Requires MotionProvider. Full playback resets when suspended; returning requires a new play action. Films do not load an iframe during SSR.
- `components/FilmChapters` and `components/TimedTranscript`: time-indexed source navigation; consumers supply seeking, original-source URLs and an explicit caption provenance statement. Transcript text remains server-rendered inside native disclosure.
- `components/CitationExport`: accessible format selection, copy feedback, download and a no-JS disclosure, accepting the formats emitted by `cite.ts`. Complements the existing semantic Citation form for compact archival apparatus.
- `components/ModeToggle` and `mode.ts`: authored light/dark environments. Call `modeScript(defaultMode)` before paint, set matching initial `data-mode`, and pass the same default to ModeToggle. Storage failure keeps the default. No automatic OS-mode switching. Consumer themes must preserve contrast and any fixed cinematic scenes.

The new reading/player CSS is in a low-priority `hause-components` cascade layer, so exhibitions can supply art direction. Existing Film and Citation forms keep their established behaviour; adopting the shared motion coordinator is opt-in.

Run portable metadata/citation/theme checks with `node --experimental-strip-types --test tests/publication.test.ts`. The public date on a locally published research record is still required by its publication workflow even though a catalogued external work can have an unknown date.

## Recorded evidence

Contributed from ADDRESS-BUILD-1 in the CHRISHAYUK notebook, 7 September 2026.
`components/EvidenceTable` renders semantic tables with column units/precision,
explicit baseline rows, sample-count columns, source references and distinguishable
not-measured/not-applicable cells. `components/MeasurementTrace` renders measured
tracks across discrete stages, with authored domains, baselines, caution bands,
annotations and pause/play/replay via MotionProvider. Every value and caution is
server-rendered; animation only changes emphasis. Data and interpretation remain
in the publication. These are capabilities, not additions to the form count.
See [EVIDENCE.md](EVIDENCE.md) for contracts, examples and extraction status.

## Reader-initiated sharing

For the later hause.design donations—VisualPlate, ExhibitionChoices / BeforeAfter, OutcomeMatrix, DecisionTrail, GraphNeighbourhood, SequencePlayer and recordDifference—see [EXHIBITION-MEDIA.md](EXHIBITION-MEDIA.md). They supply reusable exhibition composition and record checks, not additional semantic forms or CHRISHAYUK contribution claims.

`Share` from `@chrishayuk/hause/components/Share` accepts `url`, `text`, optional `label` and `className`. The publication supplies a canonical public URL and a concise proposition, preserving any uncertainty. `share.ts` exports the same `shareLinks` builder for other renderers; `share.css` supplies overridable reading defaults.

LinkedIn receives the canonical link and builds its preview from the destination's metadata; its share URL does not prefill post prose. X receives the supplied text and URL in a composer. Neither link publishes anything automatically. No provider SDK, tracking pixel, account or subscriber store is added. Keep the proposed X text short enough for its composer.

Copy opens a native disclosure with selectable text, and enhances it with clipboard feedback when JavaScript and clipboard access are available. A blocked clipboard leaves the text available. Use a single MotionProvider around other media as usual; Share itself has no motion.

```tsx
<Share url="https://example.org/notebook/a-question"
  text="The question that makes this record worth reading." />
```

The consumer decides which records may be shared. Do not expose unlisted drafts. Source cards, editorial post drafts and publication status remain consumer-owned. First consumer: CHRISHAYUK, September 2026. This is publication infrastructure, not a newly promoted semantic form.

## Reading and publication contracts

`FigureMotion` and `AnchoredDisclosure` are shared reading helpers extracted
from chrishayuk.com. A figure's numbers remain recorded values throughout its
reveal. Motion belongs to `MotionProvider`; paused and reduced-motion readers
receive the complete still figure. Styling, content and experimental claims
belong to the publication. An anchored disclosure opens for a fragment inside
it and remains an ordinary native details element without JavaScript.

`legibility.ts` supplies `searchProjection`, `legibilityLd` and `auditLegibility`.
An editorial search opt-out needs an authored reason and preserves meaning,
authorship and provenance obligations.

`provenance.ts` supplies `auditContinuity`, `realDate` and `compareVersions`.
Revision checks retain the first-publication date and require a later version,
revision date and named predecessor. Hosts store and verify their own artifacts.


## Codex composition

A major entry can opt into `NotebookEdition` and `Codex`, with `ReadingFigure`,
`FolioObject` and `Marginalia` as its working objects. Supply ordered `folios`
with stable IDs, labels and optional `kind: "operate" | "evidence"`, plus the
`manuscript` and `history` React slots. Mode and index links use real fragments;
links to an object inside a hidden folio reveal it before scrolling. Existing
instruments stay mounted when pages change. Do not invent historical numbering,
revisions or measurements for the cover, marginalia or history view.

The cover is skippable through Read, Operate, Evidence, History and the folio
index. The drag strip is separate from text and instruments. Narrow screens
collapse authored columns into source order; no canvas, page-curl asset, imposed
scrolling or GPU renderer is required. No-JavaScript and print readers receive
all folios and manuscript sections. Existing playback instruments keep their own
motion coordinator; this shell changes presentation, never a recorded outcome.

`Manuscript` presents the full authored account as continuous prose, with optional
contents and chapter anchors. It is distinct from concise `Codex` folios. Codex
turns keep the desk in place and use inert visual copies for a directional leaf
animation; live instruments stay mounted. Reduced motion and pause skip the turn.

`EditorialPlate` accepts publication-owned media and a required caption. Its
wide, inset and portrait compositions establish a sequence of views and details
without inventing media, credentials or evidence. Images remain still inside
turning folios. The caption should carry the actual credit and provenance.
