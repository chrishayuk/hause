"use client";

import { useEffect, useRef, useState } from "react";
import { tick } from "../../sound";

/**
 * GATING — expand, judge, compress, performed by widths.
 *
 * A fixed-width stream widens into a larger working space, every
 * channel is judged for whether it matters right now, the judged
 * result is brought back to the original width. The bar does the
 * arguing: its width is the dimensionality, and judged channels
 * visibly fade. The reader steps the stages by hand — an instrument,
 * not a performance — and each stage carries its reading in the panel
 * below, with an optional evidence-voice payoff line.
 *
 * Promoted from vindex3.org's Anatomy chapter, where the stages are
 * up_proj / gate_proj / the multiply / down_proj and the payoff lines
 * are the container addresses those tensors answer to. The form knows
 * none of that: stages, widths, and the kept-channel pattern are all
 * the caller's.
 */

export type GatingStage = {
	/** The chip label the reader steps with. */
	chip: string;
	/** Editorial-voice reading of the stage. */
	title: string;
	/** System-voice explanation. */
	text: string;
	/** Optional evidence-voice payoff line, rendered in accent. */
	payoff?: string;
	/** Bar width at this stage. */
	width: "narrow" | "wide";
	/** Whether the judgement is visible — unkept channels fade. */
	gated?: boolean;
	/** Evidence-voice label under the bar. */
	label: string;
};

const hatch = (color: string, pitch = 4) =>
	`repeating-linear-gradient(45deg, ${color} 0, ${color} 1px, transparent 1px, transparent ${pitch}px)`;

export function Gating({
	stages,
	channels = 24,
	keep,
	fallback,
	footnote,
}: {
	stages: GatingStage[];
	/** How many channel segments the bar draws. */
	channels?: number;
	/** Indices of channels that survive the judgement. */
	keep: number[];
	/** System-voice sentences that survive with the interaction removed. */
	fallback?: string;
	/** Evidence-voice closing line. */
	footnote?: string;
}) {
	const [stage, setStage] = useState(0);
	const held = useRef(false);
	const rootRef = useRef<HTMLDivElement>(null);

	// One considered pass on first view, then rest; any click takes over.
	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const el = rootRef.current;
		if (!el) return;
		let interval: ReturnType<typeof setInterval> | undefined;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (!entry.isIntersecting) return;
				observer.disconnect();
				let i = 0;
				interval = setInterval(() => {
					if (held.current || i >= stages.length - 1) {
						clearInterval(interval);
						return;
					}
					i += 1;
					setStage(i);
				}, 2200);
			},
			{ threshold: 0.45 }
		);
		observer.observe(el);
		return () => {
			observer.disconnect();
			if (interval) clearInterval(interval);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const s = stages[stage];
	const kept = new Set(keep);
	return (
		<section className="hause-grid py-12 sm:py-16">
			<div ref={rootRef} className="col-span-12 md:col-start-3 md:col-span-8 flex flex-col items-center">
				<div className="flex flex-wrap gap-2 mb-8 justify-center">
					{stages.map((st, i) => (
						<button
							key={st.chip + i}
							onClick={() => {
								held.current = true;
								tick();
								setStage(i);
							}}
							className="voice-evidence text-xs px-4 py-2 border"
							style={{
								borderColor: i === stage ? "var(--color-accent)" : "var(--color-mist)",
								color: i === stage ? "var(--color-accent)" : undefined,
								opacity: i === stage ? 1 : 0.6,
							}}
						>
							{st.chip}
						</button>
					))}
				</div>
				<div className="w-full max-w-3xl flex flex-col items-center">
					<div
						aria-hidden="true"
						className="flex overflow-hidden border"
						style={{
							width: s.width === "wide" ? "100%" : "33%",
							height: 56,
							borderColor: "var(--fg)",
							transition: "width var(--motion-considered) var(--ease-hause)",
						}}
					>
						{Array.from({ length: channels }, (_, i) => (
							<div
								key={i}
								className="flex-1 border-r last:border-r-0"
								style={{
									borderColor: "var(--bg)",
									backgroundImage: hatch(s.gated && !kept.has(i) ? "var(--color-mist)" : "var(--color-accent)"),
									opacity: s.gated && !kept.has(i) ? 0.18 : 0.9,
									transition: "opacity var(--motion-considered) var(--ease-hause)",
								}}
							/>
						))}
					</div>
					<p className="voice-evidence text-[11px] opacity-55 mt-2">{s.label}</p>
				</div>
				<div key={stage} className="graph-pulse w-full max-w-3xl border p-6 mt-8" style={{ borderColor: "var(--color-mist)", background: "var(--bg)" }}>
					<p className="voice-editorial text-xl sm:text-2xl mb-2">{s.title}</p>
					<p className="voice-system text-sm opacity-80 leading-relaxed max-w-xl">{s.text}</p>
					{s.payoff && (
						<p className="voice-evidence text-xs mt-4" style={{ color: "var(--color-accent)" }}>
							{s.payoff}
						</p>
					)}
				</div>
				{fallback && <p className="voice-system text-sm opacity-70 leading-relaxed max-w-2xl mt-8 text-center">{fallback}</p>}
				{footnote && <p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-xl mt-3 text-center">{footnote}</p>}
			</div>
		</section>
	);
}
