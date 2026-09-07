# Publication and film extensions

Contributed from the CHRISHAYUK publication. Editorial layouts remain in the consumer; citation and machine-legibility rules belong to HAUSE.

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

`Share` from `@chrishayuk/hause/components/Share` accepts `url`, `text`, optional `label` and `className`. The publication supplies a canonical public URL and a concise proposition, preserving any uncertainty. `share.ts` exports the same `shareLinks` builder for other renderers; `share.css` supplies overridable reading defaults.

LinkedIn receives the canonical link and builds its preview from the destination's metadata; its share URL does not prefill post prose. X receives the supplied text and URL in a composer. Neither link publishes anything automatically. No provider SDK, tracking pixel, account or subscriber store is added. Keep the proposed X text short enough for its composer.

Copy opens a native disclosure with selectable text, and enhances it with clipboard feedback when JavaScript and clipboard access are available. A blocked clipboard leaves the text available. Use a single MotionProvider around other media as usual; Share itself has no motion.

```tsx
<Share url="https://example.org/notebook/a-question"
  text="The question that makes this record worth reading." />
```

The consumer decides which records may be shared. Do not expose unlisted drafts. Source cards, editorial post drafts and publication status remain consumer-owned. First consumer: CHRISHAYUK, September 2026. This is publication infrastructure, not a newly promoted semantic form.
