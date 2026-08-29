import { Reveal } from "../Reveal";

export type RefusalProps = {
	kicker?: string;
	title: string;
	lines: string[];
	principle: string;
};

/**
 * Fail-closed rendered as design language, not as an error state.
 * Built for systems whose personality is that they refuse rather than
 * guess: the refusal is an instrument readout — structured fields under
 * a refuted-red rule, closed by the governing principle in editorial
 * voice. The lines stagger in at the hause cadence on mount; re-key to
 * replay (the PaceDemo idiom).
 *
 * RefusalReadout is the bare readout for embedding inside another form
 * (Variants renders one when an absent variant is selected); Refusal is
 * the standalone chapter form.
 */
export function RefusalReadout({ title, lines, principle }: Omit<RefusalProps, "kicker">) {
	return (
		<div className="border-l-2 pl-5 py-1" style={{ borderColor: "var(--color-status-refuted)" }}>
			<p
				className="voice-evidence text-xs tracking-[0.12em] uppercase mb-3 graph-pulse"
				style={{ color: "var(--color-status-refuted)" }}
			>
				{title}
			</p>
			<div className="flex flex-col gap-1.5">
				{lines.map((line, i) => (
					<p
						key={`${line}-${i}`}
						className="voice-evidence text-sm graph-pulse whitespace-pre-wrap"
						style={{ animationDelay: `${(i + 1) * 140}ms` }}
					>
						{line}
					</p>
				))}
			</div>
			<p
				className="voice-editorial text-lg sm:text-xl mt-4 graph-pulse"
				style={{ animationDelay: `${(lines.length + 2) * 140}ms` }}
			>
				{principle}
			</p>
		</div>
	);
}

export function Refusal({ kicker, title, lines, principle }: RefusalProps) {
	return (
		<Reveal className="hause-grid py-16 sm:py-24">
			<div className="col-span-12 md:col-start-2 md:col-span-9">
				{kicker && <p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-8 opacity-50">{kicker}</p>}
				<RefusalReadout title={title} lines={lines} principle={principle} />

				{/* Always-present text fallback: the point survives with the animation removed. */}
				<p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-2xl mt-10">
					{title.toLowerCase()} — {lines.join("; ").toLowerCase()}. {principle}
				</p>
			</div>
		</Reveal>
	);
}
