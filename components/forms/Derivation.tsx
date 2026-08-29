"use client";

import { useEffect, useRef, useState } from "react";
import { Reveal } from "../Reveal";

export type DerivationProps = {
	kicker: string;
	/** The graded scale, strongest first. */
	lattice: { level: string; meaning: string }[];
	/** Each cap: what pushes the marker down, and from where to where. */
	steps: { label: string; from: string; to: string }[];
	/** The derived level — where the fold ends. */
	result: string;
	caption?: string;
};

/**
 * A value derived by folding caps down a graded scale — never asserted,
 * only pushed downward. The lattice is drawn as a vertical scale with
 * the strongest level at the top; DERIVE replays the fold, each cap
 * moving the marker down at --motion-considered with its reason
 * revealed as it applies. The resting state is the finished
 * derivation, so the content is complete before any interaction, and
 * prefers-reduced-motion simply keeps it there.
 */
export function Derivation({ kicker, lattice, steps, result, caption }: DerivationProps) {
	// phase = number of caps applied; resting state is the finished fold.
	const [phase, setPhase] = useState(steps.length);
	const timers = useRef<ReturnType<typeof setTimeout>[]>([]);

	useEffect(() => {
		const pending = timers.current;
		return () => pending.forEach(clearTimeout);
	}, []);

	const replay = () => {
		timers.current.forEach(clearTimeout);
		timers.current = [];
		if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
			setPhase(steps.length);
			return;
		}
		setPhase(0);
		steps.forEach((_, i) => {
			timers.current.push(setTimeout(() => setPhase(i + 1), (i + 1) * 900));
		});
	};

	const heldLevel = phase === 0 ? steps[0]?.from ?? result : steps[phase - 1]?.to ?? result;

	return (
		<Reveal className="house-grid py-20 sm:py-28">
			<div className="col-span-12 md:col-start-2 md:col-span-9">
				<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-8 opacity-50">{kicker}</p>

				<button
					onClick={replay}
					className="voice-system text-sm tracking-[0.06em] border-b pb-0.5 mb-10 w-fit"
					style={{ borderColor: "var(--color-accent)" }}
				>
					DERIVE →
				</button>

				<div className="grid grid-cols-1 md:grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)] gap-10 md:gap-14 items-start">
					{/* The lattice — strongest at the top. */}
					<div className="flex flex-col" role="img" aria-label={`Graded scale from ${lattice[0]?.level} down to ${lattice[lattice.length - 1]?.level}; the fold currently rests at ${heldLevel}`}>
						{lattice.map((entry) => {
							const held = entry.level === heldLevel;
							return (
								<div
									key={entry.level}
									className="grid grid-cols-[3px_1fr] gap-5 border-t py-3 transition-opacity motion-reduce:transition-none"
									style={{
										borderColor: "var(--color-mist)",
										opacity: held ? 1 : 0.45,
										transitionDuration: "var(--motion-considered)",
										transitionTimingFunction: "var(--ease-house)",
									}}
								>
									<span
										aria-hidden="true"
										className="self-stretch transition-colors motion-reduce:transition-none"
										style={{
											background: held ? "var(--color-accent)" : "transparent",
											transitionDuration: "var(--motion-considered)",
										}}
									/>
									<div>
										<p
											className="voice-evidence text-sm"
											style={{ color: held ? "var(--color-accent)" : undefined }}
										>
											{entry.level}
										</p>
										<p className="voice-system text-xs opacity-70 mt-1 leading-relaxed">{entry.meaning}</p>
									</div>
								</div>
							);
						})}
						<div className="border-t" style={{ borderColor: "var(--color-mist)" }} />
					</div>

					{/* The caps, revealed as they apply. */}
					<div className="flex flex-col gap-5">
						{steps.map((step, i) => (
							<div
								key={`${step.label}-${phase >= i + 1}`}
								className="transition-opacity motion-reduce:transition-none"
								style={{
									opacity: phase >= i + 1 ? 1 : 0.15,
									transitionDuration: "var(--motion-considered)",
									transitionTimingFunction: "var(--ease-house)",
								}}
							>
								<p className="voice-evidence text-xs tracking-[0.1em] uppercase opacity-50 mb-1">CAP {i + 1}</p>
								<p className="voice-system text-sm sm:text-base leading-relaxed">{step.label}</p>
								<p className="voice-evidence text-xs mt-1 opacity-70">
									{step.from} ↓ {step.to}
								</p>
							</div>
						))}
						<div
							className="border-t pt-4 mt-1 transition-opacity motion-reduce:transition-none"
							style={{
								borderColor: "var(--fg)",
								opacity: phase >= steps.length ? 1 : 0.15,
								transitionDuration: "var(--motion-considered)",
							}}
						>
							<p className="voice-evidence text-xs tracking-[0.1em] uppercase opacity-50 mb-1">DERIVED</p>
							<p className="voice-evidence text-base" style={{ color: "var(--color-accent)" }}>
								{result}
							</p>
						</div>
					</div>
				</div>

				{caption && <p className="voice-system text-sm opacity-60 max-w-xl mt-10">{caption}</p>}

				{/* Always-present text fallback: the fold survives with the animation removed. */}
				<p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-2xl mt-8">
					{steps[0]?.from ?? result}
					{steps.map((s) => ` → capped by ${s.label.toLowerCase()} → ${s.to}`).join("")} — derived, never asserted.
				</p>
			</div>
		</Reveal>
	);
}
