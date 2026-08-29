"use client";

import { useState } from "react";
import { Reveal } from "../Reveal";

export type AgreementProps = {
	kicker: string;
	/** The authorities that must agree, in order. */
	columns: { label: string; source: string }[];
	rows: { values: string[]; verdict: "PASS" | "FAIL"; note?: string }[];
	caption?: string;
};

/**
 * N independently-derived values that must be identical — an
 * equivalence chain (A ≡ B ≡ C ≡ D) checked row by row, with a
 * verdict. The check replays on demand: values materialise left to
 * right at the house stagger, the way the comparison actually runs.
 * A FAIL row is first-class — an invariant you never see fail is
 * decoration.
 */
export function Agreement({ kicker, columns, rows, caption }: AgreementProps) {
	const [pulseKey, setPulseKey] = useState(0);
	const n = columns.length;

	return (
		<Reveal className="house-grid py-20 sm:py-28">
			<div className="col-span-12">
				<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-3 opacity-50">{kicker}</p>
				<p className="voice-editorial text-2xl sm:text-3xl mb-8">
					{columns.map((c) => c.label).join(" ≡ ")}
				</p>

				<button
					onClick={() => setPulseKey((k) => k + 1)}
					className="voice-system text-sm tracking-[0.06em] border-b pb-0.5 mb-10 w-fit"
					style={{ borderColor: "var(--color-accent)" }}
				>
					RUN THE CHECK →
				</button>

				<div className="overflow-x-auto">
					<div className="min-w-[680px]">
						<div
							className="grid gap-x-6 pb-3 border-b"
							style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr)) 6rem`, borderColor: "var(--fg)" }}
						>
							{columns.map((c) => (
								<div key={c.label}>
									<p className="voice-evidence text-xs tracking-[0.1em] uppercase">{c.label}</p>
									<p className="voice-system text-xs opacity-50 mt-1">{c.source}</p>
								</div>
							))}
							<span aria-hidden="true" />
						</div>

						{rows.map((row, r) => (
							<div key={r} className="border-b" style={{ borderColor: "var(--color-mist)" }}>
								<div
									className="grid gap-x-6 items-baseline py-4"
									style={{ gridTemplateColumns: `repeat(${n}, minmax(0, 1fr)) 6rem` }}
								>
									{row.values.map((value, c) => (
										<p
											key={`${r}-${c}-${pulseKey}`}
											className="voice-evidence text-sm graph-pulse break-words"
											style={{ animationDelay: `${c * 140}ms` }}
										>
											{value}
										</p>
									))}
									<p
										key={`v-${r}-${pulseKey}`}
										className="voice-evidence text-xs tracking-[0.1em] uppercase graph-pulse text-right"
										style={{
											animationDelay: `${n * 140}ms`,
											color: row.verdict === "PASS" ? "var(--color-status-supported)" : "var(--color-status-refuted)",
										}}
									>
										{row.verdict}
									</p>
								</div>
								{row.note && <p className="voice-system text-xs opacity-50 pb-4 max-w-2xl -mt-1">{row.note}</p>}
							</div>
						))}
					</div>
				</div>

				{caption && <p className="voice-system text-sm opacity-60 max-w-xl mt-8">{caption}</p>}

				{/* Always-present text fallback: the invariant survives with the animation removed. */}
				<p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-2xl mt-8">
					{columns.map((c) => c.label).join(" ≡ ")} — {rows.filter((r) => r.verdict === "PASS").length} of {rows.length}{" "}
					{rows.length === 1 ? "row agrees" : "rows agree"}; any disagreement is a distinct, named failure, never a
					warning.
				</p>
			</div>
		</Reveal>
	);
}
