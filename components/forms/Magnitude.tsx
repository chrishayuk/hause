"use client";

import { useEffect, useRef, useState } from "react";

export type MagnitudeItem = {
	label: string;
	/** The measure, printed beside the label — "4 MB", "≈1.5 TB". */
	sub: string;
	/** The quantity, in any consistent unit. Items must be ascending. */
	magnitude: number;
};

export type MagnitudeProps = {
	items: MagnitudeItem[];
	/** Shown once the sequence rests on the final scale. */
	note?: string;
};

/**
 * A powers-of-ten zoom-out: each arrival rescales the world, so the
 * thing that filled the frame becomes a speck beside the next. Areas
 * are true to magnitude; anything smaller than a few pixels is
 * clamped to a visible tick — say so in the note, honestly. Loops
 * gently while in view (a reader scrolling down should never find it
 * finished), pauses off-screen, and rests on the final scale under
 * prefers-reduced-motion.
 */
const BASE = 220; // px side of the current phase's item

export function Magnitude({ items, note }: MagnitudeProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [phase, setPhase] = useState<number>(items.length - 1);
	const [instant, setInstant] = useState(true);
	const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
	const running = useRef(false);

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const el = ref.current;
		if (!el) return;
		const clear = () => {
			timers.current.forEach(clearTimeout);
			timers.current = [];
		};
		const cycle = () => {
			if (!running.current) return;
			setInstant(true);
			setPhase(0);
			requestAnimationFrame(() =>
				requestAnimationFrame(() => {
					if (!running.current) return;
					setInstant(false);
					for (let i = 1; i < items.length; i++) {
						timers.current.push(setTimeout(() => setPhase(i), i * 2000));
					}
					timers.current.push(setTimeout(cycle, items.length * 2000 + 2600));
				})
			);
		};
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting && !running.current) {
					running.current = true;
					cycle();
				} else if (!entry.isIntersecting && running.current) {
					running.current = false;
					clear();
					setInstant(true);
					setPhase(items.length - 1);
				}
			},
			{ threshold: 0.35 }
		);
		observer.observe(el);
		return () => {
			running.current = false;
			observer.disconnect();
			clear();
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const current = items[phase];

	return (
		<section className="house-grid py-10 sm:py-14">
			<div ref={ref} className="col-span-12 flex flex-col items-center">
				<div aria-hidden="true" className="flex items-end justify-center gap-6 sm:gap-10 w-full" style={{ height: BASE + 30 }}>
					{items.map((s, i) => {
						if (i > phase) return null;
						const side = Math.max(2, Math.round(BASE * Math.sqrt(s.magnitude / current.magnitude)));
						const speck = side <= 3;
						return (
							<div key={s.label} className="flex flex-col items-center justify-end" style={{ minWidth: 2 }}>
								<div
									className={speck ? "" : "relative border"}
									style={{
										width: side,
										height: side,
										borderColor: "var(--fg)",
										background: speck ? "var(--fg)" : "var(--bg)",
										transition: instant
											? "none"
											: "width var(--motion-cinematic) var(--ease-house), height var(--motion-cinematic) var(--ease-house)",
									}}
								>
									{!speck && (
										<div
											className="absolute inset-0"
											style={{
												backgroundImage: `repeating-linear-gradient(45deg, ${
													i === phase ? "var(--color-accent)" : "var(--color-mist)"
												} 0, ${i === phase ? "var(--color-accent)" : "var(--color-mist)"} 1px, transparent 1px, transparent 6px)`,
												opacity: i === phase ? 0.7 : 0.5,
												transition: instant ? "none" : "opacity var(--motion-considered) var(--ease-house)",
											}}
										/>
									)}
								</div>
							</div>
						);
					})}
				</div>
				<p key={current.label} className="graph-pulse voice-evidence text-xs sm:text-sm mt-5" style={{ color: "var(--color-accent)" }}>
					{current.label} — {current.sub}
				</p>
				{note && (
					<p
						className="voice-evidence text-[10px] tracking-[0.06em] uppercase mt-2"
						style={{ opacity: phase === items.length - 1 ? 0.4 : 0 }}
					>
						{note}
					</p>
				)}

				{/* Always-present text fallback: the comparison survives with the animation removed. */}
				<p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-2xl text-center mt-8">
					To one scale: {items.map((s) => `${s.label} (${s.sub})`).join(" · ")} — each drawn area-true to its
					magnitude.
				</p>
			</div>
		</section>
	);
}
