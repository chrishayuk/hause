# Studies discovered through the Notebook

Recorded 9 September 2026 while bringing chrishayuk.com's older Notebook entries
up to the exhibition note's standard. The publication exposed needs for scoped
measurements, a readable sequence, citable supporting notes and coordinated text
correction. Its research claims and domain-specific drawings stay with it.

## Composition, not new semantic acts

`components/exhibition/Study.tsx` exports StudyRoom, StudySequence and StudyMeasures.
Each imports `study.css`. These are composition helpers, not additions to the
form taxonomy. StudyRoom supplies a named room and paper/dark/accent treatments.
StudySequence renders the entire sequence as an ordered list; no automatic motion
or intermediate-state hiding. StudyMeasures keeps a measure's label, detail and
required scope note next to its magnitude. Authors must supply real observations,
units, tested conditions and provenance; these helpers do not invent any.

## Citable field notes

`components/FieldNotes.tsx` provides a native disclosure and CitationScope.
The complete content remains in server HTML. CitationScope opens ancestor
disclosures when an `#act-N` fragment is followed, and opens notes within an
anchored exhibit when that is where its underlying record lives. It does not
renumber or create anchors. No JavaScript is required to operate the disclosure.

## Refusal, still

`Refusal` accepts `presentation="still"`. Default animated behaviour is unchanged.
The still edition renders its title, exact lines and governing principle once,
without pulses or a second flattened fallback. All text is present without JS.

## TextCorrection

The attribution note's rejected metadata line became `TextCorrection`, a
performance registered honestly as not yet exhibited in the specimen book.
It keeps the rejected text legible and then stages the consequence. It uses the
shared MotionProvider, manual replay/pause, and a resolved resting state for
paused, offscreen, reduced-motion and no-JavaScript reading. Importing the
component also imports its styles. There is no independent observer or timer.

The consumer supplies `before`, `after` and `caption`. A policy rejecting a line
is not an automatic edit: the first consumer says “Rewrite required” and explains
that CI blocks the contribution until the author rewrites the metadata.

First consumers: N-STATE and N-ADDRESS (study rooms), N-MAP (readable sequences),
the visual notebooks (FieldNotes / Refusal), N-ATTRIBUTION (TextCorrection).
