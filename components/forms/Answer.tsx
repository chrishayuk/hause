import { Reveal } from "../Reveal";

/**
 * ANSWER — the question, asked the way people ask it, answered first.
 *
 * The legibility form: a natural-language question as a real heading
 * and a 40–100 word answer a reader — or a machine — can lift whole.
 * It gives a page a boringly clear semantic skeleton without touching
 * the editorial surface around it: the beautiful heading stays; this
 * sits beneath it and says the plain thing plainly.
 *
 * The `id` makes the pair addressable — /page#anchor — so Ask, search
 * engines and answer engines can cite the exact question, not the
 * whole page.
 */
export function Answer({
	id,
	question,
	answer,
	cite,
}: {
	/** Stable anchor for deep links (e.g. "gate-up-down"). */
	id?: string;
	/** The question, phrased the way it is actually asked. */
	question: string;
	/** The direct answer — one lift-able paragraph, 40–100 words. */
	answer: string;
	/** Optional source note, e.g. "recorded — granite-4.1-3b · 2026-08-20". */
	cite?: string;
}) {
	return (
		<Reveal className="hause-grid py-8" id={id}>
			<section className="col-span-12 md:col-start-2 md:col-span-9" aria-label={question}>
				<h2 className="voice-evidence text-xs tracking-[0.14em] uppercase m-0 mb-3" style={{ color: "var(--color-accent)" }}>
					{question}
				</h2>
				<p className="voice-system text-base sm:text-lg leading-relaxed max-w-3xl m-0 opacity-90">{answer}</p>
				{cite && <p className="voice-evidence text-[10px] opacity-45 m-0 mt-2">{cite}</p>}
			</section>
		</Reveal>
	);
}
