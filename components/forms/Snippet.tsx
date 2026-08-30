/**
 * SNIPPET — a labeled block of code or terminal output, in the ink.
 *
 * The on-ramp form: hause.design's Use page invented it, vindex3's
 * Get Started needed the same shape, and two sites doing one thing
 * differently is exactly what a design system exists to stop. A
 * kicker names what the block is; the block itself is verbatim
 * monospace on the ink panel, scrolling sideways rather than
 * wrapping. An optional aside carries the one sentence of context
 * that belongs beside the code rather than in a paragraph above it.
 */
export function Snippet({
	label,
	code,
	aside,
}: {
	/** The kicker above the block — what this is, in a few words. */
	label: string;
	/** Verbatim code or output. Rendered as-is, monospace. */
	code: string;
	/** One sentence of context, set quietly beneath the block. */
	aside?: string;
}) {
	return (
		<section className="hause-grid py-8">
			<div className="col-span-12 md:col-start-2 md:col-span-9">
				<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-3 opacity-50">{label}</p>
				<pre
					className="voice-evidence text-[12px] sm:text-[13px] leading-relaxed border p-4 sm:p-5 overflow-x-auto"
					style={{ borderColor: "var(--color-mist)", background: "var(--color-ink)", color: "var(--color-white)" }}
				>
					{code}
				</pre>
				{aside && <p className="voice-system text-sm opacity-60 leading-relaxed max-w-2xl mt-3 m-0">{aside}</p>}
			</div>
		</section>
	);
}
