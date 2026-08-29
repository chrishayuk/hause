"use client";

import { useEffect, useRef, useState } from "react";

export type ProcessionProps = {
	/** Labels for the stages, in order — "layer 0" … "layer 5". */
	stages: string[];
	/** The line revealed under the finished descent. */
	caption: string;
};

/**
 * One thing passing through every stage, in order: a token descending
 * a stack, a request through a pipeline. The stage being passed
 * flares accent; each passed stage stays faintly lit — its
 * contribution now aboard. Loops gently while in view (a reader
 * scrolling down should never find it finished), pauses off-screen,
 * and rests on the completed passage under prefers-reduced-motion.
 */
const ROW = 44; // 34px bar + 10px gap

export function Procession({ stages, caption }: ProcessionProps) {
	const ref = useRef<HTMLDivElement>(null);
	const n = stages.length;
	// phase −1 = before the first stage; i = just past stage i; rest = n−1.
	const [phase, setPhase] = useState<number>(n - 1);
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
			setPhase(-1);
			requestAnimationFrame(() =>
				requestAnimationFrame(() => {
					if (!running.current) return;
					setInstant(false);
					for (let i = 0; i < n; i++) {
						timers.current.push(setTimeout(() => setPhase(i), 500 + i * 520));
					}
					timers.current.push(setTimeout(cycle, 500 + n * 520 + 1600));
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
					setPhase(n - 1);
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

	const done = phase >= n - 1;

	return (
		<section className="hause-grid py-10 sm:py-14">
			<div className="col-span-12 flex flex-col items-center">
				<div ref={ref} aria-hidden="true" className="relative w-full max-w-sm" style={{ height: n * ROW + 70 }}>
					{stages.map((label, i) => {
						const passed = phase >= i;
						const active = phase === i && !done;
						return (
							<div
								key={label}
								className="absolute left-0 right-0 border"
								style={{
									top: 30 + i * ROW,
									height: 34,
									borderColor: active ? "var(--color-accent)" : "var(--fg)",
									background: "var(--bg)",
									transition: instant ? "none" : "border-color var(--motion-immediate) var(--ease-hause)",
								}}
							>
								<div
									className="absolute inset-0"
									style={{
										backgroundImage: `repeating-linear-gradient(45deg, ${
											passed ? "var(--color-accent)" : "var(--color-mist)"
										} 0, ${passed ? "var(--color-accent)" : "var(--color-mist)"} 1px, transparent 1px, transparent 6px)`,
										opacity: active ? 0.85 : passed ? 0.3 : 0.4,
										transition: instant ? "none" : "opacity var(--motion-considered) var(--ease-hause)",
									}}
								/>
								<span className="absolute left-2 top-1/2 -translate-y-1/2 voice-evidence text-[9px] tracking-[0.08em] uppercase opacity-40">
									{label}
								</span>
							</div>
						);
					})}
					<div
						className="absolute left-1/2 -translate-x-1/2"
						style={{
							top: phase < 0 ? 0 : 30 + phase * ROW + 38,
							width: 14,
							height: 14,
							background: "var(--color-accent)",
							transition: instant ? "none" : "top var(--motion-considered) var(--ease-hause)",
						}}
					/>
					<p
						className="absolute left-1/2 -translate-x-1/2 voice-evidence text-[10px] tracking-[0.08em] uppercase whitespace-nowrap"
						style={{
							top: 30 + n * ROW + 28,
							opacity: done ? 0.6 : 0,
							transition: instant ? "none" : "opacity var(--motion-considered) var(--ease-hause) 300ms",
						}}
					>
						{caption}
					</p>
				</div>

				{/* Always-present text fallback: the passage survives with the animation removed. */}
				<p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-2xl text-center mt-8">
					{stages.join(" → ")} — {caption.toLowerCase()}.
				</p>
			</div>
		</section>
	);
}
