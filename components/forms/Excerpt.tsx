/**
 * EXCERPT — someone else's words, typeset.
 *
 * Verbatim source material — a specification section, a doctrine
 * passage, a cited document — presented as an object: source and
 * section in evidence voice above an accent rule, the text in system
 * voice with its light markdown (emphasis, inline code, blockquotes,
 * lists, fenced code and simple tables) rendered rather than leaking as
 * asterisks, hyphens, backticks and pipes.
 * A trimmed excerpt ends at a word boundary with a visible mark —
 * never mid-word, never silently.
 *
 * A statement: the reader reads. Promoted from Ask VINDEX3, where the
 * synthesis tier cites the specification's own passages and the free
 * tier answers with them verbatim.
 */

import React from "react";

function inline(text: string, keyBase: string): React.ReactNode[] {
	const out: React.ReactNode[] = [];
	// **bold** · *italic* · `code`
	const re = /(\*\*[^*]+\*\*|\*[^*\n]+\*|`[^`]+`)/g;
	let last = 0;
	let m: RegExpExecArray | null;
	let i = 0;
	while ((m = re.exec(text))) {
		if (m.index > last) out.push(text.slice(last, m.index));
		const tok = m[0];
		if (tok.startsWith("**")) out.push(<strong key={`${keyBase}-${i++}`}>{tok.slice(2, -2)}</strong>);
		else if (tok.startsWith("`"))
			out.push(
				<code key={`${keyBase}-${i++}`} className="voice-evidence text-[0.9em]" style={{ color: "var(--color-accent)" }}>
					{tok.slice(1, -1)}
				</code>
			);
		else out.push(<em key={`${keyBase}-${i++}`}>{tok.slice(1, -1)}</em>);
		last = m.index + tok.length;
	}
	if (last < text.length) out.push(text.slice(last));
	return out;
}

type Chunk =
	| { kind: "para"; lines: string[] }
	| { kind: "quote"; lines: string[] }
	| { kind: "list"; items: string[] }
	| { kind: "code"; lines: string[] }
	| { kind: "table"; rows: string[][] };

function chunk(text: string): Chunk[] {
	const chunks: Chunk[] = [];
	let current: Chunk | null = null;
	const push = () => {
		if (current) chunks.push(current);
		current = null;
	};
	let fenced = false;
	for (const raw of text.split("\n")) {
		const line = raw.trimEnd();
		// A fence opens and closes verbatim territory: inside it, nothing is
		// interpreted — a spec's JSON keeps its braces, quotes and shape.
		if (/^\s*```/.test(line)) {
			if (fenced) push();
			else {
				push();
				current = { kind: "code", lines: [] };
			}
			fenced = !fenced;
			continue;
		}
		if (fenced) {
			if (current?.kind === "code") current.lines.push(raw);
			continue;
		}
		if (!line.trim()) {
			push();
			continue;
		}
		if (/^\s*[-*]\s+/.test(line)) {
			if (current?.kind !== "list") {
				push();
				current = { kind: "list", items: [] };
			}
			current.items.push(line.replace(/^\s*[-*]\s+/, ""));
		} else if (current?.kind === "list") {
			// A wrapped continuation line belongs to the item above it.
			current.items[current.items.length - 1] += ` ${line.trim()}`;
		} else if (/^\|.*\|$/.test(line.trim())) {
			const cells = line.trim().slice(1, -1).split("|").map((c) => c.trim());
			if (cells.every((c) => /^:?-{2,}:?$/.test(c))) continue; // separator row
			if (current?.kind !== "table") {
				push();
				current = { kind: "table", rows: [] };
			}
			current.rows.push(cells);
		} else if (/^>\s?/.test(line)) {
			if (current?.kind !== "quote") {
				push();
				current = { kind: "quote", lines: [] };
			}
			current.lines.push(line.replace(/^>\s?/, ""));
		} else {
			if (current?.kind !== "para") {
				push();
				current = { kind: "para", lines: [] };
			}
			current.lines.push(line);
		}
	}
	push();
	return chunks;
}

/** Trim to a word boundary at most `max` characters, marking the cut. */
export function excerptTrim(text: string, max: number): { text: string; trimmed: boolean } {
	if (text.length <= max) return { text, trimmed: false };
	const cut = text.lastIndexOf(" ", max);
	return { text: text.slice(0, cut > max * 0.6 ? cut : max).trimEnd(), trimmed: true };
}

export function Excerpt({
	source,
	heading,
	text,
	trimmed,
	href,
}: {
	/** Which document — evidence voice. */
	source: string;
	/** The section within it. */
	heading?: string;
	/** The verbatim passage (light markdown rendered). */
	text: string;
	/** Whether the passage was cut — shown honestly, never mid-word. */
	trimmed?: boolean;
	/** The whole document, when it lives somewhere linkable. */
	href?: string;
}) {
	const chunks = chunk(text);
	return (
		<div className="border-l-2 pl-5 py-1 max-w-2xl" style={{ borderColor: "var(--color-accent)" }}>
			<p className="voice-evidence text-[11px] tracking-[0.08em] uppercase opacity-60 mb-3 mt-0">
				{source}
				{/* A numbered section earns a §; a prose heading does not. */}
				{heading ? <> — {/^\d/.test(heading) ? "§" : ""}{heading}</> : null}
			</p>
			<div className="flex flex-col gap-3">
				{chunks.map((c, ci) => {
					if (c.kind === "table")
						return (
							<div key={ci} className="overflow-x-auto">
								<table className="voice-evidence text-[12px] border-collapse">
									<tbody>
										{c.rows.map((row, ri) => (
											<tr key={ri}>
												{row.map((cell, di) => (
													<td
														key={di}
														className={`pr-6 py-1 align-top ${ri === 0 ? "opacity-50 uppercase tracking-[0.08em] text-[10px]" : "opacity-80"}`}
													>
														{inline(cell, `t${ci}-${ri}-${di}`)}
													</td>
												))}
											</tr>
										))}
									</tbody>
								</table>
							</div>
						);
					if (c.kind === "code")
						return (
							<pre
								key={ci}
								className="voice-evidence text-[11px] sm:text-xs leading-relaxed border p-3 sm:p-4 overflow-x-auto m-0"
								style={{ borderColor: "var(--color-mist)", background: "var(--color-ink)", color: "var(--color-white)" }}
							>
								{c.lines.join("\n")}
							</pre>
						);
					if (c.kind === "list")
						return (
							<ul key={ci} className="flex flex-col gap-1.5 m-0 pl-0 list-none">
								{c.items.map((item, ii) => (
									<li key={ii} className="voice-system text-sm opacity-85 leading-relaxed grid grid-cols-[0.9rem_1fr]">
										<span aria-hidden="true" className="opacity-40">
											·
										</span>
										<span>{inline(item, `l${ci}-${ii}`)}</span>
									</li>
								))}
							</ul>
						);
					if (c.kind === "quote")
						return (
							<p key={ci} className="voice-editorial text-base sm:text-lg opacity-90 m-0 pl-4 border-l" style={{ borderColor: "var(--color-mist)" }}>
								{inline(c.lines.join(" "), `q${ci}`)}
							</p>
						);
					return (
						<p key={ci} className="voice-system text-sm opacity-85 leading-relaxed m-0">
							{inline(c.lines.join(" "), `p${ci}`)}
						</p>
					);
				})}
			</div>
			{(trimmed || href) && (
				<p className="voice-evidence text-[10px] opacity-45 mt-3 mb-0">
					{trimmed && <span>excerpt — trimmed at a word boundary&nbsp;&nbsp;</span>}
					{href && (
						<a href={href} className="border-b pb-0.5" style={{ borderColor: "var(--color-accent)", opacity: 0.9 }}>
							the whole document →
						</a>
					)}
				</p>
			)}
		</div>
	);
}
