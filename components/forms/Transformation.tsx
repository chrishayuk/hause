"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "../Reveal";

type Side = { label: string; properties: string[] };

export type TransformationProps = {
	kicker: string;
	objectLabel: string;
	blockLabels: string[];
	from: Side;
	to: Side;
};

/**
 * Comparison's cinematic sibling: one object, two interpretations —
 * but performed, not dragged. Once in view the first interpretation
 * holds for a beat, then the blocks travel to the second at
 * --motion-cinematic with the hause stagger, connector lines arriving
 * after the blocks settle. Plays once; REPLAY runs it again. The same
 * pieces move continuously between arrangements — reorganisation, not
 * conversion, which is why this one transition may travel rather than
 * swap.
 *
 * prefers-reduced-motion (and no-JS) lands on the finished second
 * interpretation, fully labelled — a designed resting state, not a
 * paused animation.
 */
export function Transformation({ kicker, objectLabel, blockLabels, from, to }: TransformationProps) {
	const stageRef = useRef<HTMLDivElement>(null);
	// Resting state is the destination, so the server-rendered page and
	// reduced-motion visitors see the finished arrangement.
	const [arrived, setArrived] = useState(true);
	const [instant, setInstant] = useState(true);
	const [played, setPlayed] = useState(false);
	const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

	const n = blockLabels.length;
	const filePos = blockLabels.map((_, i) => ({ x: i * 5, y: -i * 5 }));
	const spread = 220;
	const dbPos = blockLabels.map((_, i) => ({
		x: n === 1 ? 0 : -spread + (2 * spread * i) / (n - 1),
		y: 0,
	}));

	const run = () => {
		timers.current.forEach(clearTimeout);
		timers.current = [];
		setInstant(true);
		setArrived(false);
		requestAnimationFrame(() =>
			requestAnimationFrame(() => {
				setInstant(false);
				timers.current.push(
					setTimeout(() => {
						setArrived(true);
						setPlayed(true);
					}, 1100)
				);
			})
		);
	};

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const stage = stageRef.current;
		if (!stage) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					observer.disconnect();
					run();
				}
			},
			{ threshold: 0.5 }
		);
		observer.observe(stage);
		const pending = timers.current;
		return () => {
			observer.disconnect();
			pending.forEach(clearTimeout);
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const side = arrived ? to : from;

	return (
		<Reveal className="hause-grid py-20 sm:py-28">
			<div className="col-span-12">
				<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-3 opacity-50">{kicker}</p>
				<p className="voice-evidence text-sm mb-10 opacity-70">{objectLabel}</p>

				<div ref={stageRef} className="relative mx-auto mb-8" style={{ height: 220, maxWidth: 560 }} aria-hidden="true">
					{dbPos.slice(0, -1).map((p, i) => (
						<div
							key={`line-${i}`}
							className="absolute"
							style={{
								left: `calc(50% + ${p.x}px)`,
								top: "50%",
								// The connections draw themselves, left to right, once the blocks settle.
								width: arrived ? dbPos[i + 1].x - p.x : 0,
								height: 1,
								background: "var(--color-mist)",
								transition: instant
									? "none"
									: `width var(--motion-considered) var(--ease-hause) ${arrived ? 1100 + i * 140 : 0}ms`,
							}}
						/>
					))}

					{blockLabels.map((label, i) => {
						const pos = arrived ? dbPos[i] : filePos[i];
						return (
							<div
								key={label}
								className="absolute"
								style={{
									left: "50%",
									top: "50%",
									transform: `translate(calc(-50% + ${pos.x}px), calc(-50% + ${pos.y}px))`,
									transition: instant
										? "none"
										: `transform var(--motion-cinematic) var(--ease-hause) ${i * 140}ms`,
								}}
							>
								{/* An etched volume, not a flat square: bordered, page-ground
								    backed (so the file cascade occludes into a deck), with a
								    fine hatch that turns accent as the arrangement comes alive. */}
								<div
									className="relative w-14 h-14 sm:w-16 sm:h-16 border"
									style={{ borderColor: "var(--fg)", background: "var(--bg)" }}
								>
									<div
										className="absolute inset-0"
										style={{
											backgroundImage:
												"repeating-linear-gradient(45deg, var(--color-mist) 0, var(--color-mist) 1px, transparent 1px, transparent 5px)",
											opacity: arrived ? 0 : 0.8,
											transition: instant
												? "none"
												: `opacity var(--motion-cinematic) var(--ease-hause) ${i * 140}ms`,
										}}
									/>
									<div
										className="absolute inset-0"
										style={{
											backgroundImage:
												"repeating-linear-gradient(45deg, var(--color-accent) 0, var(--color-accent) 1px, transparent 1px, transparent 5px)",
											opacity: arrived ? 1 : 0,
											transition: instant
												? "none"
												: `opacity var(--motion-cinematic) var(--ease-hause) ${i * 140}ms`,
										}}
									/>
								</div>
								<p
									className="voice-evidence text-[10px] tracking-[0.08em] uppercase text-center mt-2 whitespace-nowrap"
									style={{
										color: "var(--fg)",
										opacity: arrived ? 1 : 0,
										transform: arrived ? "none" : "translateY(4px)",
										transition: instant
											? "none"
											: `opacity var(--motion-considered) var(--ease-hause) ${arrived ? 1200 + i * 140 : 0}ms, transform var(--motion-considered) var(--ease-hause) ${arrived ? 1200 + i * 140 : 0}ms`,
									}}
								>
									{label}
								</p>
							</div>
						);
					})}
				</div>

				<div className="flex justify-center gap-10 voice-evidence text-xs tracking-[0.1em] uppercase mb-8">
					<span style={{ opacity: arrived ? 0.4 : 1, transition: `opacity var(--motion-considered) var(--ease-hause)` }}>
						{from.label}
					</span>
					<span style={{ opacity: arrived ? 1 : 0.4, transition: `opacity var(--motion-considered) var(--ease-hause)` }}>
						{to.label}
					</span>
				</div>

				<div className="max-w-md mx-auto text-center">
					<ul className="voice-system text-sm opacity-80 flex flex-col gap-1">
						{side.properties.map((p) => (
							<li key={p}>{p}</li>
						))}
					</ul>
					{played && arrived && (
						<button
							onClick={run}
							className="voice-evidence text-xs tracking-[0.14em] uppercase border-b pb-0.5 mt-8"
							style={{ borderColor: "var(--color-accent)" }}
						>
							REPLAY →
						</button>
					)}
				</div>

				{/* Always-present text fallback — the argument survives with the animation removed. */}
				<p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-2xl mx-auto text-center mt-10">
					{objectLabel} — as {from.label.toLowerCase()}: {from.properties.join(", ").toLowerCase()}. As{" "}
					{to.label.toLowerCase()}: {to.properties.join(", ").toLowerCase()}.
				</p>
			</div>
		</Reveal>
	);
}
