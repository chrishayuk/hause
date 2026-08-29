"use client";

import { useEffect, useRef, useState } from "react";
import { tick, settle } from "../../sound";

export type CompilationProps = {
	kicker: string;
	headline: string;
	/** Label over the source pile — what you start with. */
	sourceLabel: string;
	sources: string[];
	/** The named stages, lit in order. */
	stages: { name: string; gloss: string }[];
	/** Label over the assembling result. */
	resultLabel: string;
	/** Result rows appear in order during the final stage; an emphasis row is accent-ruled. */
	results: { name: string; emphasis?: boolean; note?: string }[];
	/** The proof mark revealed at the end, in supported green. */
	verifiedLabel: string;
	/** Revealed over the ghosted source pile — why it is no longer needed. */
	discardNote: string;
	/** The whole story in plain words — the always-present fallback. */
	fallback: string;
};

/**
 * A pile of inputs compiled down through named stages into an
 * artifact — and then the inputs ghost out, because the artifact no
 * longer needs them. Plays once in view: stages light in order, the
 * result assembles row by row during the final constructive stage,
 * the proof mark lands, the source fades. COMPILE replays. Resting
 * state (and prefers-reduced-motion) is the finished compilation.
 */
export function Compilation({
	kicker,
	headline,
	sourceLabel,
	sources,
	stages,
	resultLabel,
	results,
	verifiedLabel,
	discardNote,
	fallback,
}: CompilationProps) {
	const sectionRef = useRef<HTMLElement>(null);
	const done = stages.length;
	const [phase, setPhase] = useState<number>(done);
	const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
	const [played, setPlayed] = useState(false);

	const run = () => {
		timers.current.forEach(clearTimeout);
		timers.current = [];
		if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setPhase(done);
			return;
		}
		setPhase(0);
		stages.forEach((_, i) => {
			timers.current.push(
				setTimeout(() => {
					setPhase(i + 1);
					if (i + 1 === done) { setPlayed(true); settle(); }
				}, 700 + i * 1100)
			);
		});
	};

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const el = sectionRef.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					observer.disconnect();
					run();
				}
			},
			{ threshold: 0.35 }
		);
		observer.observe(el);
		const pending = timers.current;
		return () => {
			observer.disconnect();
			pending.forEach(clearTimeout);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const verified = phase >= done;
	const buildStage = done - 2; // results assemble during the stage before the proof stage

	return (
		<section ref={sectionRef} className="hause-grid py-20 sm:py-28">
			<div className="col-span-12 md:col-start-2 md:col-span-10 lg:col-span-9">
				<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-3 opacity-50">{kicker}</p>
				<p className="voice-editorial text-2xl sm:text-3xl mb-10 max-w-2xl">{headline}</p>

				<div className="grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] gap-8 md:gap-10 items-start">
					<div
						className="flex flex-col gap-2 transition-opacity motion-reduce:transition-none"
						style={{
							opacity: verified ? 0.28 : 1,
							transitionDuration: "var(--motion-cinematic)",
							transitionTimingFunction: "var(--ease-hause)",
						}}
					>
						<p className="voice-evidence text-[10px] tracking-[0.1em] uppercase opacity-50 mb-1">{sourceLabel}</p>
						{sources.map((f) => (
							<div key={f} className="border border-dashed px-4 py-2.5" style={{ borderColor: "var(--color-mist)" }}>
								<span className="voice-evidence text-xs truncate block">{f}</span>
							</div>
						))}
						<p
							className="voice-evidence text-[10px] tracking-[0.06em] uppercase mt-1 transition-opacity motion-reduce:transition-none"
							style={{
								color: "var(--color-accent)",
								opacity: verified ? 1 : 0,
								transitionDuration: "var(--motion-considered)",
							}}
						>
							{discardNote}
						</p>
					</div>

					<div className="flex md:flex-col gap-4 md:gap-5 md:pt-6 flex-wrap">
						{stages.map((s, i) => {
							const lit = phase > i;
							const active = phase === i + 1 && phase < done;
							return (
								<div
									key={s.name}
									className="transition-opacity motion-reduce:transition-none"
									style={{
										opacity: lit ? 1 : 0.2,
										transitionDuration: "var(--motion-considered)",
										transitionTimingFunction: "var(--ease-hause)",
									}}
								>
									<p
										className="voice-evidence text-xs tracking-[0.1em] uppercase"
										style={{ color: lit && (active || i === done - 1) ? "var(--color-accent)" : undefined }}
									>
										{s.name} ↓
									</p>
									<p className="voice-system text-[11px] opacity-60 max-w-[11rem] hidden md:block">{s.gloss}</p>
								</div>
							);
						})}
					</div>

					<div className="flex flex-col gap-2">
						<p className="voice-evidence text-[10px] tracking-[0.1em] uppercase opacity-50 mb-1">{resultLabel}</p>
						{results.map((r, i) => {
							const visible = phase > buildStage;
							return (
								<div
									key={r.name}
									className="border px-4 py-2.5 transition-opacity motion-reduce:transition-none"
									style={{
										borderColor: r.emphasis ? "var(--color-accent)" : "var(--fg)",
										background: "var(--bg)",
										opacity: visible ? 1 : 0,
										transitionDuration: "var(--motion-considered)",
										transitionTimingFunction: "var(--ease-hause)",
										transitionDelay: visible ? `${i * 180}ms` : "0ms",
									}}
								>
									<span
										className="voice-evidence text-xs truncate block"
										style={{ color: r.emphasis ? "var(--color-accent)" : undefined }}
									>
										{r.name}
										{r.note ? ` — ${r.note}` : ""}
									</span>
								</div>
							);
						})}
						<p
							className="voice-evidence text-[10px] tracking-[0.08em] uppercase mt-1 transition-opacity motion-reduce:transition-none inline-flex items-center gap-2"
							style={{
								color: "var(--color-status-supported)",
								opacity: verified ? 1 : 0,
								transitionDuration: "var(--motion-considered)",
								transitionDelay: verified ? "900ms" : "0ms",
							}}
						>
							<span className="inline-block w-[6px] h-[6px] rounded-full" style={{ background: "currentColor" }} />
							{verifiedLabel}
						</p>
					</div>
				</div>

				{played && verified && (
					<button
						onClick={() => { tick(); run(); }}
						className="voice-evidence text-xs tracking-[0.14em] uppercase border-b pb-0.5 mt-10"
						style={{ borderColor: "var(--color-accent)" }}
					>
						COMPILE →
					</button>
				)}

				{/* Always-present text fallback: the story survives with the animation removed. */}
				<p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-2xl mt-10">{fallback}</p>
			</div>
		</section>
	);
}
