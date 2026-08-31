"use client";

import { useEffect, useId, useState } from "react";
import { tick } from "../../sound";

export type LensDepth = {
	/** Short, stable, and used as the URL fragment — "learn", "inspect", "spec". */
	id: string;
	label: string;
	/** What this depth gives, in a few words. */
	hint: string;
	content: React.ReactNode;
};

export type LensProps = {
	kicker: string;
	/** The concept being looked at, for the accessible name. */
	concept: string;
	depths: LensDepth[];
	/** Persist the reader's chosen depth across pages. Default true. */
	remember?: boolean;
	caption?: string;
};

const KEY = "hause-lens";

/**
 * LENS — one concept, several depths, one URL.
 *
 * The instrument that refuses the oldest split in technical writing:
 * the tutorial over here, the reference over there, and a reader who
 * must guess which one holds the answer. A Lens keeps the explanation,
 * the object itself and the normative clause as three depths of the
 * same thing — LEARN what it means, INSPECT the real object, SPEC the
 * words that govern it — so moving between them costs a click rather
 * than a navigation, and never loses the reader's place in the concept.
 *
 * The chosen depth is remembered (localStorage) and written into the
 * URL fragment, so a reader who thinks in clauses stays in clauses, and
 * can link someone straight to the depth they mean. Every panel is in
 * the DOM at all times — the depths are disclosure, not content gating,
 * which is also why a crawler reads the specification text whether or
 * not the tab was clicked.
 *
 * A panel is page-level, not a grid column: pass forms, which carry
 * their own grid, and wrap bare prose in a `hause-grid` section of your
 * own. The chrome is what lives in the twelve columns here.
 */
export function Lens({ kicker, concept, depths, remember = true, caption }: LensProps) {
	const [active, setActive] = useState(depths[0]?.id);
	const uid = useId().replace(/:/g, "");

	useEffect(() => {
		const ids = depths.map((d) => d.id);
		const hash = typeof window !== "undefined" ? window.location.hash.replace(/^#/, "") : "";
		if (ids.includes(hash)) {
			setActive(hash);
			return;
		}
		if (!remember) return;
		try {
			const saved = localStorage.getItem(KEY);
			if (saved && ids.includes(saved)) setActive(saved);
		} catch {
			/* Storage denied: the first depth is a perfectly good place to start. */
		}
	}, [depths, remember]);

	const choose = (id: string) => {
		setActive(id);
		tick();
		if (remember) {
			try {
				localStorage.setItem(KEY, id);
			} catch {
				/* Nothing to report — the choice still applies to this page. */
			}
		}
		// replace, never push: switching depth is not a navigation, but the
		// URL should still say which depth you are reading.
		if (typeof window !== "undefined") window.history.replaceState(null, "", `#${id}`);
	};

	return (
		<section className="py-16 sm:py-24" aria-label={`${concept} — three depths`}>
			<div className="hause-grid">
				<div className="col-span-12 md:col-start-2 md:col-span-10">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-6 opacity-50">{kicker}</p>

					<div
						role="tablist"
						aria-label={`Depth of ${concept}`}
						className="flex flex-wrap gap-x-8 gap-y-2 border-b pb-3"
						style={{ borderColor: "var(--color-mist)" }}
					>
						{depths.map((d) => {
							const on = d.id === active;
							return (
								<button
									key={d.id}
									id={`${uid}-tab-${d.id}`}
									role="tab"
									aria-selected={on}
									aria-controls={`${uid}-panel-${d.id}`}
									onClick={() => choose(d.id)}
									className="text-left"
								>
									<span
										className="voice-evidence text-xs tracking-[0.12em] uppercase block"
										style={{ color: on ? "var(--color-accent)" : "var(--fg)", opacity: on ? 1 : 0.5 }}
									>
										{d.label}
									</span>
									<span className="voice-system text-xs opacity-40 block mt-0.5">{d.hint}</span>
								</button>
							);
						})}
					</div>
				</div>
			</div>

			{depths.map((d) => (
				<div
					key={d.id}
					id={`${uid}-panel-${d.id}`}
					role="tabpanel"
					aria-labelledby={`${uid}-tab-${d.id}`}
					hidden={d.id !== active}
				>
					{d.content}
				</div>
			))}

			<div className="hause-grid">
				<div className="col-span-12 md:col-start-2 md:col-span-10">
					{caption && <p className="voice-system text-sm opacity-60 max-w-xl">{caption}</p>}

					{/* Always-present text fallback: what the other depths hold, said
					    plainly, for a reader who never touches the control. */}
					<p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-2xl mt-6">
						{concept} — {depths.map((d) => `${d.label.toLowerCase()}: ${d.hint}`).join(" · ")}. One concept, one URL,
						the depth of your choosing.
					</p>
				</div>
			</div>
		</section>
	);
}
