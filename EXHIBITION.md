# Exhibition composition

Discovered in the chrishayuk.com Notebook, “I wanted a website to behave like an
exhibition.” The latest hause.design homepage supplied the staging reference:
dark arrivals, distinct rooms, an archive and a full accent-colour statement.
The consuming publication owns the order, content, imagery and colour direction.

Import `@chrishayuk/hause/exhibition.css` after HAUSE tokens. The stylesheet ships
with its components: the consumer does not need to recreate their layout rules.
Exhibitions can set `--exhibition-gutter` and `--exhibition-bleed` for full-width
sections; without them the frames stay in normal content flow.

## Existing forms, extended

`Statement` keeps its original default. `presentation="room"` provides a centred,
balanced measure and optional `continuation`, a second explicitly authored beat.
It is visible before hydration and with JavaScript disabled. The consumer owns
the semantic anchor and any background around the statement.

`Comparison` keeps its original block interpretation by default. Optional
`panels={{ left, right }}` provides two actual readings of the same object.
Pass existing semantic forms as the content. Native radios select the reading
without animation, audio, persistence or URL changes. CSS keeps the stage at the
height of its taller reading, so a selection does not move the following content.
Both readings are server rendered; only the selected reading is exposed visually
and to assistive technology. Print exposes both. Import `exhibition.css`.

## StagedTransition

The new performance requires `MotionProvider`. `from` leaves, a held absence
follows, then `to` arrives. The two states never crossfade through each other.
The three-entry `score` supplies the labels and explanations, and `caption`
states the meaning of the empty beat. The complete score remains readable.

The initial, paused, offscreen and no-JavaScript state shows the final state.
Reduced motion keeps this still edition even after a manual play request.
Playback has a persistent labelled control and participates in shared motion
ownership. There is no independent observer or timer loop. The manifest records
the real originating exhibit and marks the specimen-book entry as not yet shown.

## Composition helpers

`components/exhibition/Exhibition.tsx` exports `ExhibitionEntrance`,
`ReferenceStudies`, `UniformGrid`, `ReleasedActs`, `ArchiveExhibit`, `ReadingRooms`
and `GrammarComparison`. They are exhibition layout helpers, not additions to the
semantic act taxonomy. `ReferenceStudies` accepts a visual slot per reference;
rights, citations and domain-specific illustrations belong to the consumer.
`UniformGrid` is a comparison plate for the argument about uniform containers,
not a general application card. `ReleasedActs` stages short semantic labels.

The library is not being given Dior/Burberry content or Notebook records. Those
remain in the publication. New forms should still arise from a demonstrated need.
