import { Reveal } from "../Reveal";

/**
 * STATEMENT — one sentence, given the whole width.
 *
 * The turn of a chapter, in editorial voice at display size: the line a
 * reader would quote if they quoted one line. Everything around it
 * explains; this asserts, and the space above and below it is part of
 * the form — a statement crowded by paragraphs is just a large
 * sentence.
 *
 * Numbers never appear here. A measurement in editorial voice is a
 * claim wearing a costume; it belongs in evidence voice, dated and
 * attributed, beneath.
 *
 * A statement: the reader reads.
 */
export function Statement({ text }: { text: string }) {
	return (
		<Reveal className="hause-grid py-20 sm:py-32">
			<p className="col-span-12 md:col-start-2 md:col-span-10 voice-editorial text-3xl sm:text-5xl lg:text-6xl leading-[1.05]">{text}</p>
		</Reveal>
	);
}
