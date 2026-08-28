"use client";

import { useState } from "react";
import { Reveal } from "../Reveal";

type Side = { label: string; properties: string[] };

export type ComparisonProps = {
	kicker: string;
	objectLabel: string;
	blockLabels: string[];
	left: Side;
	right: Side;
};

/**
 * HOUSE's first Comparison-mode primitive: one object, two interpretations,
 * the same underlying pieces reorganising as the visitor drags between them.
 * Deliberately tests different ground than ExpertField (Simulation) — object
 * continuity across states, a user-driven continuous control rather than
 * discrete buttons, and an argument rather than a mechanism.
 *
 * No transition is applied to block position: it's a direct 1:1 mapping to
 * the range input's value, so there's nothing for prefers-reduced-motion to
 * suppress — dragging is exactly as responsive either way.
 */
export function Comparison({
	kicker,
	objectLabel,
	blockLabels,
	left,
	right,
}: ComparisonProps) {
	const [value, setValue] = useState(0);
	const t = value / 100;
	const isRight = value >= 50;
	const n = blockLabels.length;

	// FILE: a cascading stack, near-overlapping. DATABASE: an even spread.
	const filePos = blockLabels.map((_, i) => ({ x: i * 5, y: -i * 5 }));
	const spread = 220;
	const dbPos = blockLabels.map((_, i) => ({
		x: n === 1 ? 0 : -spread + (2 * spread * i) / (n - 1),
		y: 0,
	}));

	return (
		<Reveal className="house-grid py-20 sm:py-28">
			<div className="col-span-12">
				<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-3 opacity-50">{kicker}</p>
				<p className="voice-evidence text-sm mb-10 opacity-70">{objectLabel}</p>

				<div className="relative mx-auto mb-10" style={{ height: 220, maxWidth: 560 }} aria-hidden="true">
					{dbPos.slice(0, -1).map((p, i) => (
						<div
							key={`line-${i}`}
							className="absolute"
							style={{
								left: `calc(50% + ${p.x}px)`,
								top: "50%",
								width: dbPos[i + 1].x - p.x,
								height: 1,
								background: "var(--color-mist)",
								opacity: t,
							}}
						/>
					))}

					{blockLabels.map((label, i) => {
						const x = filePos[i].x + (dbPos[i].x - filePos[i].x) * t;
						const y = filePos[i].y + (dbPos[i].y - filePos[i].y) * t;
						return (
							<div
								key={label}
								className="absolute"
								style={{ left: "50%", top: "50%", transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))` }}
							>
								<div
									className="w-14 h-14 sm:w-16 sm:h-16"
									style={{ background: "var(--fg)", outline: t > 0.05 ? "2px solid var(--color-accent)" : "none", outlineOffset: 3 }}
								/>
								<p className="voice-evidence text-[10px] tracking-[0.08em] uppercase text-center mt-2 whitespace-nowrap" style={{ opacity: t, color: "var(--fg)" }}>
									{label}
								</p>
							</div>
						);
					})}
				</div>

				<div className="flex flex-col items-center gap-3 mb-10">
					<input
						type="range"
						min={0}
						max={100}
						value={value}
						onChange={(e) => setValue(Number(e.target.value))}
						aria-label={`Interpretation, from ${left.label} to ${right.label}`}
						aria-valuetext={isRight ? right.label : left.label}
						className="w-full max-w-sm"
						style={{ accentColor: "var(--color-accent)" }}
					/>
					<div className="flex justify-between w-full max-w-sm voice-evidence text-xs tracking-[0.1em] uppercase">
						<span style={{ opacity: isRight ? 0.4 : 1 }}>{left.label}</span>
						<span style={{ opacity: isRight ? 1 : 0.4 }}>{right.label}</span>
					</div>
				</div>

				<div className="max-w-md mx-auto text-center">
					<ul className="voice-system text-sm opacity-80 flex flex-col gap-1">
						{(isRight ? right.properties : left.properties).map((p) => (
							<li key={p}>{p}</li>
						))}
					</ul>
				</div>

				{/* Always-present text fallback — the argument survives with the interaction removed. */}
				<p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-2xl mx-auto text-center mt-10">
					{objectLabel} — as {left.label.toLowerCase()}: {left.properties.join(", ").toLowerCase()}. As {right.label.toLowerCase()}:{" "}
					{right.properties.join(", ").toLowerCase()}.
				</p>
			</div>
		</Reveal>
	);
}
