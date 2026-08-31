/**
 * THE MANIFEST — the library's one index.
 *
 * Everything that counts the forms derives from this file: the
 * specimen book's holdings page, its homepage refusal, the Terminal
 * specimen's SHOW FORMS, the README's mode lists. Copy that states a
 * count without reading this file is editorial where evidence was
 * owed — exactly the drift the Agreement form exists to catch.
 *
 * Rules of the record:
 * - `origin` and `date` are stated only where the history is written
 *   down. An unrecorded origin is absent, never guessed.
 * - `exhibited: false` marks a form the library holds without yet
 *   showing a specimen (a Film with no real film is held, not faked).
 * - A form enters this manifest in the same change that adds its file
 *   under components/forms/ — or the book drifts from the library.
 */

export type FormMode = "statement" | "instrument" | "performance";

export type FormRecord = {
	name: string;
	mode: FormMode;
	/** What the form is, in one line. */
	line: string;
	/** Where the form originated — only where the history records it. */
	origin?: string;
	/** When it entered the library — only where the history records it. */
	date?: string;
	/** False while the book holds the form without exhibiting a specimen. */
	exhibited: boolean;
};

export const FORM_MANIFEST: FormRecord[] = [
	// ── Statements — the reader reads ──
	{ name: "Hero", mode: "statement", line: "The room's first wall: kicker, headline, dek.", exhibited: true },
	{ name: "Statement", mode: "statement", line: "One sentence, given the whole width.", exhibited: true },
	{ name: "Observation", mode: "statement", line: "A labelled paragraph that watches rather than argues.", exhibited: true },
	{ name: "Claim", mode: "statement", line: "An assertion that knows it must answer to evidence.", exhibited: true },
	{ name: "Evidence", mode: "statement", line: "Rows of labelled findings with status marks — receipts, not decoration.", exhibited: true },
	{ name: "Question", mode: "statement", line: "An open question given the same typographic dignity as an answer.", exhibited: true },
	{ name: "Timeline", mode: "statement", line: "Dated entries, in order — history as prose, not a widget.", exhibited: true },
	{ name: "Connection", mode: "statement", line: "A bridge out of the chapter: one sentence, then the doors.", exhibited: true },
	{ name: "Refusal", mode: "statement", line: "Fail-closed rendered as design language, not as an error state.", origin: "vindex3", exhibited: true },
	{ name: "Excerpt", mode: "statement", line: "Someone else's words, typeset — verbatim source material with its markdown rendered and its trims marked.", origin: "vindex3 · Ask", date: "2026-08-29", exhibited: true },
	{ name: "Answer", mode: "statement", line: "The question asked the way people ask it, answered first — one lift-able paragraph beneath the editorial surface, addressable by anchor.", origin: "vindex3 · the legibility layer", date: "2026-08-30", exhibited: true },
	{ name: "Snippet", mode: "statement", line: "A labeled block of code or terminal output, verbatim on the ink — the on-ramp form, promoted when two sites needed the same shape.", origin: "hause.design · Use", date: "2026-08-30", exhibited: true },
	// ── Instruments — the reader operates ──
	{ name: "Anatomy", mode: "instrument", line: "An annotated cutaway — one artifact drawn as its layers, fully disclosed.", exhibited: true },
	{ name: "Decomposition", mode: "instrument", line: "One object, its parts, the thing that assembles them — stepped by hand.", exhibited: true },
	{ name: "ExpertField", mode: "instrument", line: "A field of units, mostly dormant; each scenario lights the subset that answers.", origin: "the codex", exhibited: true },
	{ name: "Comparison", mode: "instrument", line: "One object, two interpretations, dragged between.", origin: "the codex", exhibited: true },
	{ name: "Variants", mode: "instrument", line: "Physically present variants of one identity — and a designed refusal for the absent one.", origin: "vindex3", exhibited: true },
	{ name: "Ladder", mode: "instrument", line: "A gated progression — rungs climbed in order, each closed only by its own criterion.", origin: "vindex3", exhibited: true },
	{ name: "Agreement", mode: "instrument", line: "N independently-derived values that must be identical — with a FAIL row.", exhibited: true },
	{ name: "Derivation", mode: "instrument", line: "A value folded down a graded scale by caps — derived, never asserted.", exhibited: true },
	{ name: "ByteMap", mode: "instrument", line: "A physical layout drawn to scale — each field's width is its width in bytes.", exhibited: true },
	{ name: "FollowReveal", mode: "instrument", line: "A path through connected ideas, replayed at the hause stagger.", exhibited: true },
	{ name: "Terminal", mode: "instrument", line: "A query surface whose chrome is the form and whose meaning is one executor.", origin: "vindex3 · the Explorer", date: "2026-08-29", exhibited: true },
	{ name: "Gating", mode: "instrument", line: "A stream widened into a working space, judged channel by channel, brought back home.", origin: "vindex3 · the Anatomy", date: "2026-08-29", exhibited: true },
	{ name: "Provenance", mode: "instrument", line: "The publication record beneath the page — dates, version, identifiers, history — disclosed on demand, absent where nothing is registered.", origin: "vindex3 · citing the specification", date: "2026-08-31", exhibited: true },
	{ name: "Citation", mode: "instrument", line: "The reference itself, in the formats people paste — plain, BibTeX, APA, CSL-JSON, all from one record.", origin: "vindex3 · citing the specification", date: "2026-08-31", exhibited: true },
	// ── Performances — the forms play themselves ──
	{ name: "Transformation", mode: "performance", line: "Comparison's cinematic sibling — identical props, performed.", origin: "vindex3", exhibited: true },
	{ name: "Unfolding", mode: "performance", line: "Decomposition's cinematic sibling — the parts arrive on their own.", origin: "vindex3", exhibited: true },
	{ name: "Compilation", mode: "performance", line: "A pile of inputs compiled down through named stages.", origin: "vindex3", exhibited: true },
	{ name: "Procession", mode: "performance", line: "One thing passing through every stage, in order.", origin: "vindex3", exhibited: true },
	{ name: "Magnitude", mode: "performance", line: "A powers-of-ten zoom-out — each arrival rescales the world.", origin: "vindex3", exhibited: true },
	{ name: "Channel", mode: "performance", line: "Throughput through a fixed-capacity conduit.", origin: "vindex3", exhibited: true },
	{ name: "Quantisation", mode: "performance", line: "What quantisation actually does, performed on a lattice.", origin: "vindex3", exhibited: true },
	// Held, not yet exhibited: a Film specimen waits for a real film —
	// the book refuses to fake one.
	{ name: "Film", mode: "performance", line: "A short film in the flow of a chapter — poster until it earns the play.", origin: "vindex3", exhibited: false },
];

export const MODES: FormMode[] = ["statement", "instrument", "performance"];

export function formsByMode(mode: FormMode): FormRecord[] {
	return FORM_MANIFEST.filter((f) => f.mode === mode);
}

export function formCount(): number {
	return FORM_MANIFEST.length;
}

export function importPath(name: string): string {
	return `@chrishayuk/hause/components/forms/${name}`;
}
