"use client";

import { useState } from "react";
import { Reveal } from "../Reveal";

type Part = { label: string; detail: string };

export type DecompositionProps = {
	kicker: string;
	source: Part;
	parts: Part[];
	result: Part;
};

export function Decomposition({ kicker, source, parts, result }: DecompositionProps) {
	const [step, setStep] = useState(0);
	const steps = [source.label, "DECOMPOSES", result.label];

	return (
		<Reveal className="hause-grid py-20 sm:py-28">
			<div className="col-span-12">
				<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-10 opacity-50">{kicker}</p>

				<div className="min-h-[280px] sm:min-h-[320px] flex items-center justify-center mb-10">
					{step === 0 && (
						<div className="border px-8 py-10 sm:px-12 sm:py-14 text-center" style={{ borderColor: "var(--fg)" }}>
							<p className="voice-evidence text-lg sm:text-xl mb-3">{source.label}</p>
							<p className="voice-system text-sm opacity-60 max-w-xs mx-auto">{source.detail}</p>
						</div>
					)}

					{step === 1 && (
						<div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 w-full">
							{parts.map((part) => (
								<div key={part.label} className="border px-4 py-6 text-center" style={{ borderColor: "var(--color-mist)" }}>
									<p className="voice-evidence text-sm mb-2" style={{ color: "var(--color-accent)" }}>
										{part.label}
									</p>
									<p className="voice-system text-xs opacity-60 leading-relaxed">{part.detail}</p>
								</div>
							))}
						</div>
					)}

					{step === 2 && (
						<div className="border-2 px-8 py-10 sm:px-14 sm:py-16 text-center" style={{ borderColor: "var(--color-accent)" }}>
							<p className="voice-evidence text-lg sm:text-xl mb-3" style={{ color: "var(--color-accent)" }}>
								{result.label}
							</p>
							<p className="voice-system text-sm sm:text-base opacity-80 max-w-md mx-auto">{result.detail}</p>
						</div>
					)}
				</div>

				<div className="flex items-center justify-center gap-6">
					<button
						onClick={() => setStep((s) => Math.max(0, s - 1))}
						disabled={step === 0}
						className="voice-system text-sm disabled:opacity-20 opacity-70 hover:opacity-100 transition-opacity"
						aria-label="Previous step"
					>
						←
					</button>
					<p className="voice-evidence text-xs tracking-[0.1em] opacity-50 w-40 text-center">
						{String(step + 1).padStart(2, "0")} / 03 — {steps[step]}
					</p>
					<button
						onClick={() => setStep((s) => Math.min(2, s + 1))}
						disabled={step === 2}
						className="voice-system text-sm disabled:opacity-20 opacity-70 hover:opacity-100 transition-opacity"
						aria-label="Next step"
					>
						→
					</button>
				</div>

				{/* Always-present text fallback: the point survives with the interaction removed. */}
				<p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-2xl mx-auto text-center mt-12">
					{source.label} decomposes into {parts.map((p) => p.label).join(", ")} — which {result.label} assembles into {result.detail.toLowerCase()}
				</p>
			</div>
		</Reveal>
	);
}
