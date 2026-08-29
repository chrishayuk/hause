"use client";

import { useState } from "react";
import { Reveal } from "../Reveal";

type Scenario = { label: string; activeIndices: number[] };

export type ExpertFieldProps = {
	statement?: string;
	totalUnits: number;
	scenarios: Scenario[];
	caption?: string;
};

/**
 * HAUSE's first Simulation-mode primitive: understanding through
 * manipulation, not just reading. A field of units, mostly dormant;
 * selecting a scenario lights up the subset that activates for it.
 *
 * First concrete case: mixture-of-experts routing. Kept specific rather
 * than generalized into an abstract "Simulation" framework — one real
 * example earns its keep faster than a taxonomy with nothing in it yet.
 */
export function ExpertField({ statement, totalUnits, scenarios, caption }: ExpertFieldProps) {
	const [selected, setSelected] = useState(0);
	const active = new Set(scenarios[selected].activeIndices);
	const columns = Math.ceil(Math.sqrt(totalUnits));

	return (
		<Reveal className="hause-grid py-20 sm:py-28">
			<div className="col-span-12">
				{statement && <p className="voice-editorial text-3xl sm:text-4xl leading-tight mb-10 max-w-2xl">{statement}</p>}

				<div className="flex gap-6 mb-8 flex-wrap">
					{scenarios.map((s, i) => (
						<button
							key={s.label}
							onClick={() => setSelected(i)}
							className="voice-evidence text-xs tracking-[0.1em] uppercase"
							style={{ opacity: i === selected ? 1 : 0.4, color: i === selected ? "var(--color-accent)" : undefined }}
						>
							{s.label}
						</button>
					))}
				</div>

				<div
					className="grid gap-[3px] mb-8 mx-auto"
					style={{ gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`, maxWidth: "min(100%, 560px)" }}
					role="img"
					aria-label={`${active.size} of ${totalUnits} units active for ${scenarios[selected].label}`}
				>
					{Array.from({ length: totalUnits }).map((_, i) => {
						const isActive = active.has(i);
						return (
							<div
								key={i}
								className="aspect-square transition-all motion-reduce:transition-none"
								style={{
									background: isActive ? "var(--color-accent)" : "var(--color-mist)",
									opacity: isActive ? 1 : 0.25,
									transitionDuration: "var(--motion-considered)",
									transitionTimingFunction: "var(--ease-hause)",
								}}
							/>
						);
					})}
				</div>

				<p className="voice-evidence text-sm mb-2">
					{active.size} / {totalUnits} UNITS ACTIVE — {scenarios[selected].label.toUpperCase()}
				</p>

				{caption && <p className="voice-system text-sm opacity-60 max-w-xl mt-4">{caption}</p>}

				{/* Always-present text fallback — the point survives with the interaction removed. */}
				<p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-2xl mt-8">
					Across {scenarios.length} scenarios shown here, only {Math.round((scenarios.reduce((a, s) => a + s.activeIndices.length, 0) / scenarios.length))} of {totalUnits} units
					activate on average — which ones depends on the input.
				</p>
			</div>
		</Reveal>
	);
}
