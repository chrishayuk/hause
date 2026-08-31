"use client";

import { useState } from "react";
import { displayDate, doiUrl, type CitationRecord } from "../../cite";
import { tick } from "../../sound";

export type ProvenanceEvent = { date: string; text: string };

export type ProvenanceProps = {
	/** The published object this page is. One record; four surfaces. */
	record: CitationRecord;
	/** Dated events, newest first — when the work was made, not when the page was touched. */
	history?: ProvenanceEvent[];
	/** Anchor of the Citation block, so the line can offer CITE. */
	citeHref?: string;
	id?: string;
};

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
	<div className="grid grid-cols-[7rem_1fr] sm:grid-cols-[9rem_1fr] gap-3 sm:gap-6 py-1.5 border-t" style={{ borderColor: "var(--color-mist)" }}>
		<span className="voice-evidence text-[10px] tracking-[0.12em] uppercase opacity-45 pt-0.5">{label}</span>
		<span className="voice-evidence text-xs sm:text-[13px] break-all opacity-85">{children}</span>
	</div>
);

/**
 * PROVENANCE — the publication record beneath the page.
 *
 * An instrument whose resting state is a single quiet line — published,
 * revised, version, author, DOI where one exists — and whose expansion
 * is the full record: the identifiers that pin the work to actual
 * objects (a commit, an artifact hash, an archive record) and the dated
 * history of how it came to be said.
 *
 * Provenance belongs in the interface, not in a footer: a claim that
 * cannot be dated is a claim that cannot be defended. What the form
 * will not do is invent the defence — an identifier that has not been
 * registered is absent, never a placeholder, and `published` is the
 * first publication date, never the last edit.
 */
export function Provenance({ record, history, citeHref, id }: ProvenanceProps) {
	const [open, setOpen] = useState(false);
	const ids = record.identifiers ?? [];

	const line = [
		`PUBLISHED ${displayDate(record.published)}`,
		record.revised ? `REVISED ${displayDate(record.revised)}` : "",
		record.version ? `VERSION ${record.version}` : "",
	].filter(Boolean);

	const expandable = ids.length > 0 || (history?.length ?? 0) > 0 || Boolean(record.independence || record.license || record.partOf);

	return (
		<section className="hause-grid py-6" id={id} aria-label="Provenance">
			<div className="col-span-12 md:col-start-2 md:col-span-10">
				<div
					className="flex flex-wrap items-baseline gap-x-4 gap-y-2 justify-between border-t pt-3"
					style={{ borderColor: "var(--color-mist)" }}
				>
					<p className="voice-evidence text-[10px] sm:text-[11px] tracking-[0.1em] uppercase opacity-55 m-0">
						{line.join("  ·  ")}
						{record.doi && (
							<>
								{"  ·  "}
								<a href={doiUrl(record.doi)} className="underline underline-offset-2" style={{ color: "var(--color-accent)" }}>
									DOI {record.doi}
								</a>
							</>
						)}
					</p>
					<span className="flex items-baseline gap-4">
						{citeHref && (
							<a href={citeHref} className="voice-evidence text-[10px] tracking-[0.12em] uppercase opacity-55 hover:opacity-100">
								CITE
							</a>
						)}
						{expandable && (
							<button
								onClick={() => {
									setOpen(!open);
									tick();
								}}
								aria-expanded={open}
								className="voice-evidence text-[10px] tracking-[0.12em] uppercase opacity-55 hover:opacity-100"
							>
								PROVENANCE {open ? "−" : "+"}
							</button>
						)}
					</span>
				</div>

				{open && (
					<div className="graph-pulse mt-4 max-w-3xl">
						<Row label="title">{record.title}</Row>
						<Row label="authors">{record.authors.map((a) => (typeof a === "string" ? a : [a.given, a.family].filter(Boolean).join(" "))).join(" · ")}</Row>
						<Row label="canonical">
							<a href={record.url} className="underline underline-offset-2">
								{record.url}
							</a>
						</Row>
						{record.partOf && (
							<Row label="part of">
								{record.partOf.title}
								{record.partOf.version ? ` ${record.partOf.version}` : ""}
							</Row>
						)}
						{ids.map((it) => (
							<Row key={it.label} label={it.label}>
								{it.href ? (
									<a href={it.href} className="underline underline-offset-2">
										{it.value}
									</a>
								) : (
									it.value
								)}
							</Row>
						))}
						{record.license && <Row label="license">{record.license}</Row>}
						{record.independence && <Row label="independence">{record.independence}</Row>}

						{history && history.length > 0 && (
							<div className="mt-6">
								<p className="voice-evidence text-[10px] tracking-[0.12em] uppercase opacity-45 mb-2">HISTORY</p>
								<ul className="flex flex-col gap-1 m-0 p-0 list-none">
									{history.map((h) => (
										<li key={`${h.date}-${h.text}`} className="grid grid-cols-[7rem_1fr] sm:grid-cols-[9rem_1fr] gap-3 sm:gap-6">
											<span className="voice-evidence text-[11px] opacity-45">{displayDate(h.date)}</span>
											<span className="voice-system text-sm opacity-80">{h.text}</span>
										</li>
									))}
								</ul>
							</div>
						)}
					</div>
				)}

				{/* Always-present text fallback: the record's load-bearing facts survive
				    with the disclosure closed, the JavaScript gone, or the reader in a hurry. */}
				{!open && ids.length > 0 && (
					<p className="voice-evidence text-[10px] opacity-30 leading-relaxed mt-2 m-0 break-all">
						{ids.map((it) => `${it.label} ${it.value}`).join("  ·  ")}
					</p>
				)}
			</div>
		</section>
	);
}
