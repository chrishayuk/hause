import { Reveal } from "../Reveal";

export type AnatomyChild = { label: string; detail?: string };

export type AnatomyLayer = {
	label: string;
	/** Short mono note, right-aligned in the layer's header — a role, a class number. */
	note?: string;
	/** The explanation — always visible. An anatomy that hides its annotations is a teaser, not a drawing. */
	detail: string;
	/** Named contents of this layer, listed beneath the explanation. */
	children?: AnatomyChild[];
	emphasis?: boolean;
	muted?: boolean;
};

export type AnatomyProps = {
	kicker: string;
	objectLabel: string;
	layers: AnatomyLayer[];
	caption?: string;
};

/**
 * An annotated cutaway: one artifact drawn as its layers, each layer
 * carrying its explanation in full. Deliberately static and fully
 * disclosed — the reader walks down the object the way they would walk
 * down an engineering drawing, and nothing is behind a click. The
 * emphasis layer (a root, a header) is ruled in accent; muted layers
 * are dashed. Server-renderable; the only motion is the shared Reveal.
 */
export function Anatomy({ kicker, objectLabel, layers, caption }: AnatomyProps) {
	return (
		<Reveal className="hause-grid py-20 sm:py-28">
			<div className="col-span-12 md:col-start-2 md:col-span-10 lg:col-span-9">
				<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-3 opacity-50">{kicker}</p>
				<p className="voice-editorial text-2xl sm:text-3xl mb-12">{objectLabel}</p>

				<div className="flex flex-col gap-3">
					{layers.map((layer) => (
						<div
							key={layer.label}
							className="border px-5 py-4 sm:px-7 sm:py-5"
							style={{
								borderColor: layer.emphasis ? "var(--color-accent)" : layer.muted ? "var(--color-mist)" : "var(--fg)",
								borderStyle: layer.muted ? "dashed" : "solid",
							}}
						>
							<div className="grid grid-cols-[minmax(0,1fr)_auto] items-baseline gap-4">
								<span
									className="voice-evidence text-sm sm:text-base"
									style={{ color: layer.emphasis ? "var(--color-accent)" : undefined, opacity: layer.muted ? 0.6 : 1 }}
								>
									{layer.label}
								</span>
								{layer.note && (
									<span
										className="voice-evidence text-[10px] sm:text-xs tracking-[0.1em] uppercase text-right"
										style={{ color: layer.emphasis ? "var(--color-accent)" : undefined, opacity: layer.emphasis ? 1 : 0.5 }}
									>
										{layer.note}
									</span>
								)}
							</div>
							<p className="voice-system text-sm sm:text-base opacity-80 leading-relaxed mt-3 max-w-2xl">{layer.detail}</p>
							{layer.children && layer.children.length > 0 && (
								<div className="mt-4 flex flex-col gap-1.5 border-t pt-4" style={{ borderColor: "var(--color-mist)" }}>
									{layer.children.map((child) => (
										<div key={child.label} className="grid grid-cols-[7.5rem_1fr] sm:grid-cols-[12rem_1fr] gap-4 items-baseline">
											<span className="voice-evidence text-xs break-words" style={{ color: "var(--color-accent)" }}>
												{child.label}
											</span>
											{child.detail && <span className="voice-system text-xs sm:text-sm opacity-60">{child.detail}</span>}
										</div>
									))}
								</div>
							)}
						</div>
					))}
				</div>

				{caption && <p className="voice-system text-sm opacity-60 max-w-xl mt-10">{caption}</p>}

				{/* Always-present text fallback: the object survives with the drawing removed. */}
				<p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-2xl mt-8">
					{objectLabel} — {layers.map((l) => l.label).join(" · ")}.
				</p>
			</div>
		</Reveal>
	);
}
