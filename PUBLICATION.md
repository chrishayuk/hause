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
