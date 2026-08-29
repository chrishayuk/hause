"use client";

import { useState } from "react";
import { Reveal } from "../Reveal";

export type ByteField = {
	name: string;
	type: string;
	bytes: number;
	/** A fixed value, when the format pins one (a magic, a version). */
	value?: string;
	meaning: string;
};

export type ByteMapProps = {
	kicker: string;
	title: string;
	fields: ByteField[];
	/** e.g. "24 bytes · little-endian · regions 64-byte aligned" */
	totalLabel?: string;
	caption?: string;
};

/**
 * A physical layout drawn to scale: a proportional bar (each field's
 * width is its width in bytes) above the field table, hover on either
 * illuminating the other. Strictly static apart from that illumination,
 * at --motion-immediate — bytes are the one place a page should feel
 * like an engineering drawing, not a film.
 */
export function ByteMap({ kicker, title, fields, totalLabel, caption }: ByteMapProps) {
	const [hover, setHover] = useState<number | null>(null);
	const total = fields.reduce((a, f) => a + f.bytes, 0);

	return (
		<Reveal className="house-grid py-16 sm:py-24">
			<div className="col-span-12 md:col-start-2 md:col-span-10 lg:col-span-9">
				<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-3 opacity-50">{kicker}</p>
				<p className="voice-evidence text-base sm:text-lg mb-8">{title}</p>

				<div className="flex w-full mb-2" role="img" aria-label={`${title}: ${fields.map((f) => `${f.name} (${f.bytes} ${f.bytes === 1 ? "byte" : "bytes"})`).join(", ")}`}>
					{fields.map((f, i) => (
						<div
							key={f.name}
							onMouseEnter={() => setHover(i)}
							onMouseLeave={() => setHover(null)}
							className="h-12 sm:h-14 border-y border-l last:border-r flex items-center justify-center overflow-hidden"
							style={{
								width: `${(f.bytes / total) * 100}%`,
								minWidth: 0,
								borderColor: "var(--fg)",
								background: hover === i ? "var(--color-accent)" : "transparent",
								transition: "background-color var(--motion-immediate) var(--ease-house)",
							}}
						>
							<span
								className="voice-evidence text-[9px] sm:text-[10px] tracking-[0.06em] uppercase whitespace-nowrap px-1"
								style={{ color: hover === i ? "var(--color-white)" : "var(--fg)", opacity: hover === i ? 1 : 0.55 }}
							>
								{f.bytes >= total / fields.length ? f.name : ""}
							</span>
						</div>
					))}
				</div>
				{totalLabel && <p className="voice-evidence text-xs opacity-50 mb-8">{totalLabel}</p>}

				<div className="overflow-x-auto">
					<div className="min-w-[560px] flex flex-col">
						{fields.map((f, i) => (
							<div
								key={f.name}
								onMouseEnter={() => setHover(i)}
								onMouseLeave={() => setHover(null)}
								className="grid grid-cols-[11rem_4rem_3.5rem_1fr] gap-4 sm:gap-6 items-baseline py-2.5 border-t"
								style={{
									borderColor: "var(--color-mist)",
									background: hover === i ? "color-mix(in srgb, var(--color-accent) 10%, transparent)" : "transparent",
									transition: "background-color var(--motion-immediate) var(--ease-house)",
								}}
							>
								<span className="voice-evidence text-sm" style={{ color: "var(--color-accent)" }}>
									{f.name}
									{f.value ? ` = ${f.value}` : ""}
								</span>
								<span className="voice-evidence text-xs opacity-60">{f.type}</span>
								<span className="voice-evidence text-xs opacity-60 text-right">
									{f.bytes} B
								</span>
								<span className="voice-system text-xs sm:text-sm opacity-75">{f.meaning}</span>
							</div>
						))}
						<div className="border-t" style={{ borderColor: "var(--color-mist)" }} />
					</div>
				</div>

				{caption && <p className="voice-system text-sm opacity-60 max-w-xl mt-8">{caption}</p>}
			</div>
		</Reveal>
	);
}
