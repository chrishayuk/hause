import { Reveal } from "../Reveal";

export type TimelineProps = { entries: { date: string; text: string }[] };

/**
 * TIMELINE — dated entries, in order. History as prose, not a widget.
 *
 * Dates in accent evidence voice, entries in system voice, and nothing
 * between them: no rails, no dots, no scroll animation. What makes a
 * history legible is that every line carries a date and says what
 * happened, which is a writing problem the design cannot solve for you.
 *
 * Where a Ladder governs what may happen next, a Timeline records what
 * did. Provenance holds the same facts for one published object.
 *
 * A statement: the reader reads.
 */
export function Timeline({ entries }: TimelineProps) {
	return (
		<Reveal className="hause-grid py-16 sm:py-24">
			<div className="col-span-12 md:col-start-2 md:col-span-9">
				<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-8 opacity-50">EVOLUTION</p>
				<div className="flex flex-col gap-6">
					{entries.map((entry, i) => (
						<div key={i} className="grid grid-cols-[6.5rem_1fr] sm:grid-cols-[9rem_1fr] gap-4 sm:gap-8">
							<p className="voice-evidence text-sm" style={{ color: "var(--color-accent)" }}>
								{entry.date}
							</p>
							<p className="voice-system text-base sm:text-lg opacity-90 leading-relaxed">{entry.text}</p>
						</div>
					))}
				</div>
			</div>
		</Reveal>
	);
}
