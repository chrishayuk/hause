"use client";

import { useEffect, useRef, useState } from "react";

export type QuantisationPhase = {
	/** Number of representable levels drawn as grid lines; 0 = the continuum, no grid. */
	levels: number;
	caption: string;
};

export type QuantisationProps = {
	/** Played in order, then held on the last. First phase is usually the continuum. */
	phases: QuantisationPhase[];
	/** The consequence line, revealed at rest — why the snapping matters. */
	note?: string;
	/** Values in (0,1) to display; defaults to a fixed deterministic set. */
	values?: number[];
};

/**
 * What quantisation actually does, performed: values live on a
 * continuum; storing them coarser means fewer representable levels,
 * and every value snaps to its nearest one. On a fine grid the move
 * is invisible; on a coarse one every value visibly steps, and mist
 * ghosts mark where the numbers used to be. Loops while in view,
 * pauses off-screen, rests on the final phase under
 * prefers-reduced-motion.
 */
const H = 170;
const DEFAULT_N = 26;
// Deterministic pseudo-random values in (0.06, 0.94) — never Math.random,
// so server and client render the same pixels.
const DEFAULT_VALUES = Array.from({ length: DEFAULT_N }, (_, i) => {
	const x = Math.sin((i + 1) * 12.9898) * 43758.5453;
	return 0.06 + (x - Math.floor(x)) * 0.88;
});
const snap = (v: number, levels: number) => Math.round(v * (levels - 1)) / (levels - 1);

export function Quantisation({ phases, note, values = DEFAULT_VALUES }: QuantisationProps) {
	const ref = useRef<HTMLDivElement>(null);
	const [phase, setPhase] = useState<number>(phases.length - 1);
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
					for (let i = 1; i < phases.length; i++) {
						timers.current.push(setTimeout(() => setPhase(i), i * 2000));
					}
					timers.current.push(setTimeout(cycle, phases.length * 2000 + 2200));
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
					setPhase(phases.length - 1);
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

	const p = phases[phase];
	const atRest = phase === phases.length - 1;

	return (
		<section className="hause-grid py-10 sm:py-14">
			<div ref={ref} className="col-span-12 flex flex-col items-center">
				<div aria-hidden="true" className="relative w-full max-w-xl border" style={{ height: H, borderColor: "var(--color-mist)" }}>
					{p.levels > 0 &&
						Array.from({ length: p.levels }).map((_, i) => (
							<div
								key={`${p.levels}-${i}`}
								className="absolute left-0 right-0"
								style={{
									top: `${((i / (p.levels - 1)) * (H - 2) + 1).toFixed(2)}px`,
									height: 1,
									background: "var(--color-mist)",
									opacity: atRest ? 0.7 : 0.35,
								}}
							/>
						))}
					{values.map((v, i) => {
						const shown = p.levels > 0 ? snap(v, p.levels) : v;
						const moved = Math.abs(shown - v) > 0.004;
						const x = `${(((i + 0.5) / values.length) * 100).toFixed(4)}%`;
						return (
							<div key={i}>
								<div
									className="absolute rounded-full"
									style={{
										left: x,
										top: `${(v * (H - 8) + 4).toFixed(2)}px`,
										width: 4,
										height: 4,
										marginLeft: -2,
										background: "var(--color-mist)",
										opacity: atRest && moved ? 0.9 : 0,
										transition: instant ? "none" : "opacity var(--motion-considered) var(--ease-hause)",
									}}
								/>
								<div
									className="absolute rounded-full"
									style={{
										left: x,
										top: `${(shown * (H - 8) + 4).toFixed(2)}px`,
										width: 7,
										height: 7,
										marginLeft: -3.5,
										background: "var(--color-accent)",
										transition: instant ? "none" : "top var(--motion-cinematic) var(--ease-hause)",
									}}
								/>
							</div>
						);
					})}
				</div>
				<p key={p.caption} className="graph-pulse voice-evidence text-xs sm:text-sm mt-5" style={{ color: "var(--color-accent)" }}>
					{p.caption}
				</p>
				{note && (
					<p
						className="voice-evidence text-[10px] tracking-[0.06em] uppercase mt-2 text-center max-w-md"
						style={{
							opacity: atRest ? 0.4 : 0,
							transition: instant ? "none" : "opacity var(--motion-considered) var(--ease-hause) 600ms",
						}}
					>
						{note}
					</p>
				)}

				{/* Always-present text fallback: the mechanism survives with the animation removed. */}
				<p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-2xl text-center mt-8">
					{phases.map((ph) => ph.caption).join(". ")}.{note ? ` ${note}.` : ""}
				</p>
			</div>
		</section>
	);
}
