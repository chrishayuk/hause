"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "../Reveal";
import type { DecompositionProps } from "./Decomposition";
import { tick, settle } from "../../sound";

/**
 * Decomposition's cinematic sibling, the way Transformation is
 * Comparison's: the same argument — one object, its parts, the thing
 * that assembles them — performed instead of stepped. The source
 * holds as a closed deck of volumes, unfolds into its parts at
 * --motion-cinematic with the hause stagger, then the result arrives
 * beneath and seals the set in accent. Plays once in view; REPLAY
 * runs it again.
 *
 * Takes DecompositionProps verbatim, so the two forms are
 * interchangeable per chapter. Resting state (and reduced motion) is
 * the finished composition: parts and result, fully labelled.
 */
export function Unfolding({ kicker, source, parts, result }: DecompositionProps) {
	const stageRef = useRef<HTMLDivElement>(null);
	// 0 = closed deck · 1 = parts unfolded · 2 = result sealed (rest)
	const [phase, setPhase] = useState(2);
	const [instant, setInstant] = useState(true);
	const [played, setPlayed] = useState(false);
	const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

	const n = parts.length;
	const spread = 200;

	const run = () => {
		timers.current.forEach(clearTimeout);
		timers.current = [];
		setInstant(true);
		setPhase(0);
		requestAnimationFrame(() =>
			requestAnimationFrame(() => {
				setInstant(false);
				timers.current.push(setTimeout(() => setPhase(1), 1000));
				timers.current.push(
					setTimeout(() => {
						setPhase(2);
						setPlayed(true);
						settle();
					}, 2600)
				);
			})
		);
	};

	useEffect(() => {
		if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
		const el = stageRef.current;
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

	const unfolded = phase >= 1;

	return (
		<Reveal className="hause-grid py-20 sm:py-28">
			<div className="col-span-12">
				<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-10 opacity-50">{kicker}</p>

				<div ref={stageRef} className="relative mx-auto" style={{ height: 200, maxWidth: 620 }} aria-hidden="true">
					{parts.map((part, i) => {
						const x = unfolded ? (n === 1 ? 0 : -spread + (2 * spread * i) / (n - 1)) : i * 5;
						const y = unfolded ? 0 : -i * 5;
						return (
							<div
								key={part.label}
								className="absolute"
								style={{
									left: "50%",
									top: "38%",
									transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
									transition: instant ? "none" : `transform var(--motion-cinematic) var(--ease-hause) ${i * 140}ms`,
									zIndex: n - i,
								}}
							>
								<div className="relative w-16 h-16 sm:w-20 sm:h-20 border" style={{ borderColor: "var(--fg)", background: "var(--bg)" }}>
									<div
										className="absolute inset-0"
										style={{
											backgroundImage:
												"repeating-linear-gradient(45deg, var(--color-accent) 0, var(--color-accent) 1px, transparent 1px, transparent 5px)",
											opacity: unfolded ? 0.75 : 0.25,
											transition: instant ? "none" : `opacity var(--motion-cinematic) var(--ease-hause) ${i * 140}ms`,
										}}
									/>
								</div>
								<p
									className="voice-evidence text-[9px] sm:text-[10px] tracking-[0.06em] uppercase text-center mt-2 w-28 sm:w-32 -ml-6 leading-relaxed"
									style={{
										color: "var(--fg)",
										opacity: unfolded ? 1 : 0,
										transition: instant ? "none" : `opacity var(--motion-considered) var(--ease-hause) ${unfolded ? 1100 + i * 140 : 0}ms`,
									}}
								>
									{part.label}
								</p>
							</div>
						);
					})}

					{/* The source label — names the closed deck, steps aside once it unfolds. */}
					<p
						className="absolute left-1/2 -translate-x-1/2 voice-evidence text-sm sm:text-base whitespace-nowrap"
						style={{
							top: "72%",
							opacity: phase === 0 ? 1 : 0,
							transition: instant ? "none" : "opacity var(--motion-considered) var(--ease-hause)",
						}}
					>
						{source.label}
					</p>
				</div>

				{/* The result — arrives beneath and seals the set. */}
				<div
					className="border-2 px-6 py-5 sm:px-10 sm:py-6 text-center max-w-xl mx-auto"
					style={{
						borderColor: "var(--color-accent)",
						opacity: phase >= 2 ? 1 : 0,
						transform: phase >= 2 ? "none" : "translateY(10px)",
						transition: instant
							? "none"
							: "opacity var(--motion-cinematic) var(--ease-hause), transform var(--motion-cinematic) var(--ease-hause)",
					}}
				>
					<p className="voice-evidence text-base sm:text-lg mb-1" style={{ color: "var(--color-accent)" }}>
						{result.label}
					</p>
					<p className="voice-system text-xs sm:text-sm opacity-70">{result.detail}</p>
				</div>

				{played && phase >= 2 && (
					<div className="text-center mt-8">
						<button
							onClick={() => { tick(); run(); }}
							className="voice-evidence text-xs tracking-[0.14em] uppercase border-b pb-0.5"
							style={{ borderColor: "var(--color-accent)" }}
						>
							REPLAY →
						</button>
					</div>
				)}

				{/* Always-present text fallback: the point survives with the animation removed. */}
				<p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-2xl mx-auto text-center mt-10">
					{source.label} — {source.detail.toLowerCase()} It unfolds into {parts.map((p) => p.label).join(", ").toLowerCase()};{" "}
					{result.label} assembles them: {result.detail.toLowerCase()}
				</p>
			</div>
		</Reveal>
	);
}
