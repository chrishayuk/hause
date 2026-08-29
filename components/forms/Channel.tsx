"use client";

import { useEffect, useRef, useState } from "react";

export type ChannelStage = {
	/** Payload density in the stream — wide units move slowly, narrow units arrive more often. */
	density: "wide" | "narrow";
	caption: string;
};

export type ChannelProps = {
	/** The producing endpoint's label — "memory", "disk", "the source". */
	from: string;
	/** The consuming endpoint's label. */
	to: string;
	/** Printed under the conduit — name its fixed capacity. */
	channelLabel: string;
	/** Exactly the stages to play, in order; rests on the last. */
	stages: ChannelStage[];
};

/**
 * Throughput through a fixed-capacity conduit: payload streams from
 * one endpoint to the other, and when the payload gets narrower the
 * same channel visibly delivers more often. Stage changes are staged
 * swaps, never morphs. Plays once in view, rests on the final stage,
 * REPLAY runs it again; prefers-reduced-motion rests statically. The
 * stream classes live in tokens.css (channel-flow-wide / -narrow),
 * with finite iteration counts — hause motion never runs forever.
 */
export function Channel({ from, to, channelLabel, stages }: ChannelProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [stage, setStage] = useState<number>(stages.length - 1);
	const [playKey, setPlayKey] = useState(0);
	const [played, setPlayed] = useState(false);
	const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

	const run = () => {
		timers.current.forEach(clearTimeout);
		timers.current = [];
		if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setStage(stages.length - 1);
			return;
		}
		setStage(0);
		setPlayKey((k) => k + 1);
		for (let i = 1; i < stages.length; i++) {
			timers.current.push(
				setTimeout(() => {
					setStage(i);
					setPlayKey((k) => k + 1);
					if (i === stages.length - 1) setPlayed(true);
				}, i * 7600)
			);
		}
	};

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					observer.disconnect();
					run();
				}
			},
			{ threshold: 0.5 }
		);
		observer.observe(el);
		const pending = timers.current;
		return () => {
			observer.disconnect();
			pending.forEach(clearTimeout);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const s = stages[stage];
	const wide = s.density === "wide";
	const atRest = stage === stages.length - 1;

	return (
		<section className="hause-grid py-10 sm:py-14">
			<div className="col-span-12 flex flex-col items-center">
				<div ref={ref} aria-hidden="true" className="w-full max-w-xl">
					<div className="flex items-stretch gap-0">
						<div className="relative border flex-none" style={{ width: 110, height: 88, borderColor: "var(--fg)", background: "var(--bg)" }}>
							<div
								className="absolute inset-0"
								style={{
									backgroundImage:
										"repeating-linear-gradient(45deg, var(--color-mist) 0, var(--color-mist) 1px, transparent 1px, transparent 6px)",
									opacity: 0.5,
								}}
							/>
							<span className="absolute bottom-1 left-2 voice-evidence text-[9px] tracking-[0.08em] uppercase opacity-60">{from}</span>
						</div>
						<div className="flex-1 flex flex-col justify-center">
							<div
								key={`${s.density}-${playKey}`}
								className={wide ? "channel-flow-wide" : "channel-flow-narrow"}
								style={{
									height: 18,
									borderTop: "1px solid var(--color-mist)",
									borderBottom: "1px solid var(--color-mist)",
									backgroundImage: wide
										? "repeating-linear-gradient(90deg, var(--color-accent) 0, var(--color-accent) 14px, transparent 14px, transparent 24px)"
										: "repeating-linear-gradient(90deg, var(--color-accent) 0, var(--color-accent) 4px, transparent 4px, transparent 10px)",
								}}
							/>
							<p className="voice-evidence text-[9px] tracking-[0.08em] uppercase opacity-50 text-center mt-2">{channelLabel}</p>
						</div>
						<div className="relative border flex-none" style={{ width: 110, height: 88, borderColor: "var(--fg)", background: "var(--bg)" }}>
							<div
								className="absolute inset-0"
								style={{
									backgroundImage:
										"repeating-linear-gradient(45deg, var(--color-accent) 0, var(--color-accent) 1px, transparent 1px, transparent 6px)",
									opacity: 0.5,
								}}
							/>
							<span className="absolute bottom-1 left-2 voice-evidence text-[9px] tracking-[0.08em] uppercase opacity-60">{to}</span>
						</div>
					</div>
					<p key={`c-${s.density}`} className="graph-pulse voice-evidence text-xs text-center mt-5">
						{s.caption}
					</p>
				</div>
				{played && atRest && (
					<button
						onClick={run}
						className="voice-evidence text-xs tracking-[0.14em] uppercase border-b pb-0.5 mt-6"
						style={{ borderColor: "var(--color-accent)" }}
					>
						REPLAY →
					</button>
				)}

				{/* Always-present text fallback: the argument survives with the animation removed. */}
				<p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-2xl text-center mt-8">
					{from} → {to}, through {channelLabel}. {stages.map((st) => st.caption).join(". ")}.
				</p>
			</div>
		</section>
	);
}
