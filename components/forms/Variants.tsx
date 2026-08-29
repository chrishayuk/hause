"use client";

import { useState } from "react";
import { Reveal } from "../Reveal";
import { RefusalReadout } from "./Refusal";

export type Variant = {
	id: string;
	fidelity: string;
	bytes?: string;
	storage?: string;
	present: boolean;
	/** Relative physical size of this form, 0..1 — drives the drawn area. */
	scale?: number;
	/** Hatch pitch in px — tighter reads as denser packing / lower precision. */
	density?: number;
};

export type VariantsProps = {
	kicker: string;
	/** The identity that never changes and never re-renders. */
	objectLabel: string;
	variants: Variant[];
	baseline: string;
	refusalTitle: string;
	refusalPrinciple: string;
	caption?: string;
};

/**
 * One logical object; its physically present variants; a selector; a
 * refusal. The object's identity line is rendered once and never
 * re-keyed — the thing stays the same while its physical form is
 * chosen. Switching between present variants is a staged swap (key
 * remount + .swap-in): the old form is removed instantly, a held beat,
 * then the new form enters at --motion-cinematic. Never a crossfade —
 * a blend between two representations would depict a conversion, and
 * these are forms for systems where conversion is forbidden.
 *
 * Selecting an absent variant renders a Refusal readout instead of an
 * object: the structured fields (requested, present) before any byte
 * is read. The refusal is the most designed moment in the form.
 *
 * prefers-reduced-motion gets a designed static state: every variant
 * drawn side by side, the baseline ruled in accent, absent variants as
 * dashed empty frames with the refusal beneath.
 */
export function Variants({
	kicker,
	objectLabel,
	variants,
	baseline,
	refusalTitle,
	refusalPrinciple,
	caption,
}: VariantsProps) {
	const [selected, setSelected] = useState(baseline);
	const current = variants.find((v) => v.id === selected) ?? variants[0];
	const presentIds = variants.filter((v) => v.present).map((v) => v.id);

	const sizeOf = (v: Variant) => Math.round(88 + 72 * (v.scale ?? 1));
	const pitchOf = (v: Variant) => v.density ?? 6;

	const block = (v: Variant, size: number) => (
		<div
			aria-hidden="true"
			className="border flex-none"
			style={{
				width: size,
				height: size,
				borderColor: "var(--fg)",
				color: "var(--color-accent)",
				backgroundImage: `repeating-linear-gradient(45deg, currentColor 0, currentColor 1px, transparent 1px, transparent ${pitchOf(v)}px)`,
			}}
		/>
	);

	const meta = (v: Variant) => (
		<div className="voice-evidence text-xs leading-7 opacity-70">
			<p className="opacity-100" style={{ color: "var(--fg)" }}>
				{v.id}
				{v.id === baseline ? " · baseline" : ""}
			</p>
			<p>fidelity&nbsp;&nbsp;{v.fidelity}</p>
			{v.bytes && <p>bytes&nbsp;&nbsp;&nbsp;&nbsp;{v.bytes}</p>}
			{v.storage && <p>storage&nbsp;&nbsp;{v.storage}</p>}
		</div>
	);

	return (
		<Reveal className="house-grid py-20 sm:py-28">
			<div className="col-span-12">
				<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-3 opacity-50">{kicker}</p>
				{/* The identity line — outside every keyed subtree, deliberately. */}
				<p className="voice-editorial text-2xl sm:text-3xl mb-10">{objectLabel}</p>

				{/* Interactive stage — hidden under prefers-reduced-motion in favour of the static composition below. */}
				<div className="motion-reduce:hidden">
					<div className="flex gap-3 sm:gap-4 flex-wrap mb-10" role="group" aria-label="Select a physical variant">
						{variants.map((v) => (
							<button
								key={v.id}
								onClick={() => setSelected(v.id)}
								aria-pressed={v.id === selected}
								className="voice-evidence text-xs tracking-[0.08em] px-4 py-2 border"
								style={{
									borderColor: v.id === selected ? "var(--color-accent)" : "var(--color-mist)",
									borderStyle: v.present ? "solid" : "dashed",
									color: v.id === selected ? "var(--color-accent)" : undefined,
									opacity: v.present || v.id === selected ? 1 : 0.55,
								}}
							>
								{v.id}
								{!v.present && " · absent"}
							</button>
						))}
					</div>

					<div className="min-h-[220px] flex items-end" aria-live="polite">
						{current.present ? (
							<div key={current.id} className="swap-in flex items-end gap-6 sm:gap-8">
								{block(current, sizeOf(current))}
								{meta(current)}
							</div>
						) : (
							<div key={current.id} className="max-w-xl">
								<RefusalReadout
									title={refusalTitle}
									lines={[`requested   ${current.id}`, `present     ${presentIds.join(" · ")}`]}
									principle={refusalPrinciple}
								/>
							</div>
						)}
					</div>
				</div>

				{/* Designed static state for prefers-reduced-motion: all variants side by side. */}
				<div className="hidden motion-reduce:flex items-end gap-8 sm:gap-12 flex-wrap">
					{variants.map((v) => (
						<div key={v.id} className="flex flex-col gap-4">
							{v.present ? (
								<div
									className={v.id === baseline ? "border-b-2 pb-3" : "pb-3"}
									style={v.id === baseline ? { borderColor: "var(--color-accent)" } : undefined}
								>
									{block(v, Math.round(sizeOf(v) * 0.7))}
								</div>
							) : (
								<div
									aria-hidden="true"
									className="border border-dashed flex-none"
									style={{
										width: Math.round(sizeOf(v) * 0.7),
										height: Math.round(sizeOf(v) * 0.7),
										borderColor: "var(--color-mist)",
									}}
								/>
							)}
							{meta(v)}
							{!v.present && (
								<p className="voice-evidence text-xs max-w-[16rem]" style={{ color: "var(--color-status-refuted)" }}>
									{refusalTitle.toLowerCase()}
								</p>
							)}
						</div>
					))}
				</div>

				{caption && <p className="voice-system text-sm opacity-60 max-w-xl mt-10">{caption}</p>}

				{/* Always-present text fallback: the point survives with the interaction removed. */}
				<p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-2xl mt-10">
					{objectLabel} — {presentIds.length} physically present {presentIds.length === 1 ? "variant" : "variants"} (
					{presentIds.join(", ")}); baseline {baseline}. Selecting an absent variant fails closed.{" "}
					{refusalPrinciple}
				</p>
			</div>
		</Reveal>
	);
}
