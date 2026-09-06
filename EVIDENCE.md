# Recorded evidence: publication capabilities

First consumer: [The address is built through depth](https://chrishayuk.com/codex/the-address-is-built-through-depth), CHRISHAYUK, 7 September 2026. This extraction extends publication infrastructure. It does not promote new semantic forms or claim that the specimen book is independent reuse. Experiment numbers, source records, layer names and causal interpretations remain in the consuming site.

## EvidenceTable

A server-renderable component imported from `@chrishayuk/hause/components/EvidenceTable`. Pass `caption`, `rowLabel`, `columns` and `rows`. Optional `note`, `source`, `id` and `className` adapt it to a publication.

- Columns have stable `id`, `label`, optional `unit`, `precision` (0–12), and `format` (`number` or `percent`). Percent values are proportions: `.125` displays as `12.5%` with precision 1. Formatting changes presentation, not source values. Sample sizes can be ordinary labelled columns.
- Rows have stable `id`, `label`, and a `values` object containing exactly one value per column. Optional `baseline`, `note`, and `source` preserve comparison and provenance.
- Values are numbers, strings, or `{ missing: "not-measured" | "not-applicable", reason?: string }`. Zero is a measurement. A missing cell is an authoring error. Empty row sets render “No observations recorded.”
- Native column and row headers, keyboard-focusable horizontal overflow and printable text are provided. The component has no sorting that could silently alter authored order.

```tsx
<EvidenceTable caption="Recorded response latency" rowLabel="Configuration"
  columns={[{ id: "latency", label: "Median", unit: "ms", precision: 1 }]}
  rows={[
    { id: "baseline", label: "Baseline", baseline: true, values: { latency: 12.3 } },
    { id: "unrun", label: "Unrun configuration", values: { latency: { missing: "not-measured" } } },
  ]}
  note="Illustrative values for this API example, not a benchmark." />
```

## MeasurementTrace

A client component imported from `@chrishayuk/hause/components/MeasurementTrace`, rendered inside the existing `MotionProvider`. Its props are serializable data; server consumers do not send formatter or render callbacks.

- Required: `label`, `summary`, `stages` and `series`. Each stage has `id`, `label`, optional `title`, `description` and `caution`.
- Each series has `id`, `label`, one numeric value or `null` per stage, and an explicit increasing `domain: [min, max]`. Optional `unit`, `precision`, `baseline`, and `color` control presentation. Values outside the domain, NaN and Infinity are rejected instead of clipped. Bars encode position within the labelled domain, not necessarily distance from zero.
- `null` is shown as “Not measured”; no interpolation or smoothing occurs. Stage spacing expresses order, not proportional distance or elapsed time.
- Optional `annotations` and `bands` each use `{ from, to, label, caution? }`, referring to stage IDs. Both endpoints are inclusive. All cautions also appear as ordinary text beneath the figure.
- `stageLabel`, `kicker`, `source`, `id`, `className`, `initialStage`, `autoPlay` (default false) and `intervalMs` (default 2800; minimum 200) are supported. A single-stage trace is static with playback controls disabled.
- Play and Replay explicitly request motion ownership. Selecting a stage holds it. Auto playback, if enabled, respects the shared coordinator, reduced motion, save-data, hidden pages and offscreen suspension. The whole recorded table remains visible without playback or JavaScript. Animation is a reading aid, not simulation.

```tsx
<MotionProvider>
  <MeasurementTrace label="Illustrative heating sequence" stageLabel="Step"
    stages={[{ id: "a", label: "Before" }, { id: "b", label: "After" }]}
    series={[{ id: "temperature", label: "Temperature", unit: "°C",
      domain: [0, 100], values: [20, 60], precision: 0 }]}
    summary="Illustrative API values; no physical experiment is claimed." />
</MotionProvider>
```

## Styles and validation

Both components import `evidence.css`, in the low-priority `hause-components` cascade layer. They inherit HAUSE variables and consumer font choices. Use ordinary unlayered CSS on a consumer `className` for editorial treatment. The generic defaults contain no publication-specific palette or routes.

`evidence.ts` exports contracts, `formatEvidence`, `validateEvidenceTable`, `validateMeasurementTrace`, and `tracePosition`. Validation fails explicitly on malformed data before figures are drawn. Run `node --experimental-strip-types --test tests/*.test.ts` and `node scripts/readme.ts --check` in the library, then build real consumers. Browser interaction and accessibility checks are separate from numerical validation.
