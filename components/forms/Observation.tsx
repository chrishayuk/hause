import { Reveal } from "../Reveal";

/**
 * OBSERVATION — a labelled paragraph that watches rather than argues.
 *
 * System voice, indented off the full measure, with an optional
 * evidence-voice label naming what is being observed. Where a Statement
 * asserts and an Evidence row measures, an Observation notices: what is
 * actually there, before what it means.
 *
 * The label is the form's whole discipline. Having to name the thing in
 * three words is what stops an observation from drifting into a second
 * argument.
 *
 * A statement: the reader reads.
 */
export function Observation({ label, text }: { label?: string; text: string }) {
	return (
		<Reveal className="hause-grid py-12 sm:py-16">
			<div className="col-span-12 md:col-start-3 md:col-span-8">
				{label && (
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-3 opacity-60">{label}</p>
				)}
				<p className="voice-system text-lg sm:text-xl leading-relaxed opacity-90">{text}</p>
			</div>
		</Reveal>
	);
}
