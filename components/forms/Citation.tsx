"use client";

import { useState } from "react";
import { citationFormats, kindLabel, type CitationRecord } from "../../cite";
import { tick } from "../../sound";

export type CitationProps = {
	record: CitationRecord;
	/** Anchor — Provenance's CITE link points here. Defaults to "cite". */
	id?: string;
	kicker?: string;
	/** One sentence of context: what exactly is being cited. */
	note?: string;
};

/**
 * CITATION — cite this, in the formats people actually paste.
 *
 * An instrument with the plainest possible resting state: the reference
 * itself, rendered as text, selected by default and therefore present
 * in the served HTML. The tabs switch it to BibTeX, APA or CSL-JSON —
 * three formats rather than six, because CSL-JSON is what every
 * reference manager turns into the other three hundred.
 *
 * Every string here is produced by cite.ts from one record, so the
 * reference on the page, the tags in the head and the JSON-LD in the
 * graph cannot disagree about who wrote what, or when.
 */
export function Citation({ record, id = "cite", kicker = "CITE THIS", note }: CitationProps) {
	const formats = citationFormats(record);
	const [active, setActive] = useState(formats[0].id);
	const [copied, setCopied] = useState(false);
	const shown = formats.find((f) => f.id === active) ?? formats[0];

	const copy = async () => {
		try {
			await navigator.clipboard.writeText(shown.text);
			setCopied(true);
			tick();
			setTimeout(() => setCopied(false), 1600);
		} catch {
			/* Clipboard denied: the text is on the page, selectable. Nothing to report. */
		}
	};

	return (
		<section className="hause-grid py-10" id={id} aria-label={`Cite ${record.title}`}>
			<div className="col-span-12 md:col-start-2 md:col-span-9">
				<div className="flex flex-wrap items-baseline justify-between gap-3 mb-3">
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase opacity-50 m-0">{kicker}</p>
					<p className="voice-evidence text-[10px] tracking-[0.12em] uppercase opacity-35 m-0">
						{kindLabel(record.kind)}
						{record.version ? ` · ${record.version}` : ""}
					</p>
				</div>

				<div className="flex flex-wrap items-center gap-x-5 gap-y-2 mb-3">
					{formats.map((f) => (
						<button
							key={f.id}
							onClick={() => {
								setActive(f.id);
								tick();
							}}
							aria-pressed={f.id === active}
							className="voice-evidence text-[10px] tracking-[0.12em] uppercase"
							style={{
								color: f.id === active ? "var(--color-accent)" : "var(--fg)",
								opacity: f.id === active ? 1 : 0.45,
							}}
						>
							{f.label}
						</button>
					))}
					<button
						onClick={copy}
						aria-live="polite"
						aria-label={`Copy the ${shown.label} reference`}
						className="voice-evidence text-[10px] tracking-[0.12em] uppercase ml-auto opacity-45 hover:opacity-100"
					>
						{copied ? "COPIED" : "COPY"}
					</button>
				</div>

				<pre
					className="voice-evidence text-[12px] sm:text-[13px] leading-relaxed border p-4 sm:p-5 overflow-x-auto whitespace-pre-wrap break-words"
					style={{ borderColor: "var(--color-mist)", background: "var(--color-ink)", color: "var(--color-white)" }}
				>
					{shown.text}
				</pre>

				{note && <p className="voice-system text-sm opacity-60 leading-relaxed max-w-2xl mt-3 m-0">{note}</p>}
			</div>
		</section>
	);
}
