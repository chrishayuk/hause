"use client";

import { useState } from "react";
import { Reveal } from "../Reveal";

export type Rung = {
	id: string;
	question?: string;
	gate?: string;
	status?: "PASSED" | "OPEN" | "BUILDING";
	detail?: string;
};

export type LadderProps = {
	kicker: string;
	rungs: Rung[];
	caption?: string;
};

const RUNG_COLOR: Record<NonNullable<Rung["status"]>, string> = {
	PASSED: "var(--color-status-supported)",
	OPEN: "var(--color-status-open)",
	BUILDING: "var(--color-accent)",
};

/**
 * A gated progression — rungs climbed in order, each with a question
 * and the exact criterion that closes it. Statuses are optional: with
 * them the ladder is a live status instrument; without them it is a
 * reference (a maturity scale, ordered levels).
 *
 * Passed rungs are solid, open rungs hollow, the rung being built is
 * accent. A rung with a gate or detail expands on selection to show
 * the criterion verbatim. Everything is in the DOM at all times — the
 * expansion is disclosure, not content gating.
 */
export function Ladder({ kicker, rungs, caption }: LadderProps) {
	const [expanded, setExpanded] = useState<number | null>(null);

	return (
		<Reveal className="house-grid py-16 sm:py-24">
			<div className="col-span-12 md:col-start-2 md:col-span-9">
				<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-8 opacity-50">{kicker}</p>

				<div className="flex flex-col">
					{rungs.map((rung, i) => {
						const expandable = Boolean(rung.gate || rung.detail);
						const isOpen = expanded === i;
						const color = rung.status ? RUNG_COLOR[rung.status] : "var(--fg)";
						return (
							<div key={rung.id} className="border-t" style={{ borderColor: "var(--color-mist)" }}>
								<button
									onClick={() => expandable && setExpanded(isOpen ? null : i)}
									disabled={!expandable}
									aria-expanded={expandable ? isOpen : undefined}
									className="w-full grid grid-cols-[6.5rem_1fr_auto] sm:grid-cols-[9rem_1fr_auto] gap-4 sm:gap-8 items-baseline py-4 text-left disabled:cursor-default"
								>
									<span className="voice-evidence text-sm" style={{ color: "var(--color-accent)" }}>
										{rung.id}
									</span>
									<span className="voice-system text-base sm:text-lg opacity-90">{rung.question}</span>
									<span className="flex items-baseline gap-4">
										{rung.status && (
											<span
												className="voice-evidence text-[0.72rem] tracking-[0.08em] uppercase inline-flex items-center gap-2"
												style={{ color }}
											>
												<span
													aria-hidden="true"
													className="inline-block w-[6px] h-[6px] rounded-full flex-none"
													style={
														rung.status === "OPEN"
															? { border: `1px solid ${color}`, background: "transparent" }
															: { background: color }
													}
												/>
												{rung.status}
											</span>
										)}
										{expandable && (
											<span className="voice-system text-sm opacity-40" aria-hidden="true">
												{isOpen ? "−" : "+"}
											</span>
										)}
									</span>
								</button>
								{isOpen && (
									<div className="grid grid-cols-[6.5rem_1fr] sm:grid-cols-[9rem_1fr] gap-4 sm:gap-8 pb-6">
										<span aria-hidden="true" />
										<div className="graph-pulse">
											{rung.gate && (
												<p className="voice-evidence text-sm mb-2">
													<span className="opacity-50 uppercase tracking-[0.1em] text-xs">GATE — </span>
													{rung.gate}
												</p>
											)}
											{rung.detail && <p className="voice-system text-sm opacity-70 leading-relaxed max-w-2xl">{rung.detail}</p>}
										</div>
									</div>
								)}
							</div>
						);
					})}
					<div className="border-t" style={{ borderColor: "var(--color-mist)" }} />
				</div>

				{caption && <p className="voice-system text-sm opacity-60 max-w-xl mt-8">{caption}</p>}

				{/* Always-present text fallback: the progression survives with the interaction removed. */}
				<p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-2xl mt-8">
					{rungs.map((r) => `${r.id}${r.status ? ` (${r.status.toLowerCase()})` : ""}`).join(" → ")}
					{rungs.some((r) => r.gate) && " — each rung closed only by its own gate, in order."}
				</p>
			</div>
		</Reveal>
	);
}
