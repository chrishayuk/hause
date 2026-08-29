"use client";

import { useEffect, useId, useRef, useState } from "react";
import { tick, refuse } from "../../sound";

/**
 * TERMINAL — a query surface as an instrument.
 *
 * The form is the chrome: banner, scrollback, prompt, input, seed
 * chips, a CLEAR control, toned lines, the hause sounds. What the
 * terminal *means* lives entirely in the caller's `execute` — a
 * function from one typed line to lines out, sync or async. The form
 * never interprets a statement itself, so whatever discipline governs
 * the language (an allowlisted AST, a server-side capability profile)
 * stays in exactly one place: the executor.
 *
 * Promoted from vindex3.org's Explorer ("psql, for a model"), where the
 * executor is a live public query endpoint with an offline snapshot
 * fallback. `sessionKey` supports that shape: when it changes, the
 * scrollback resets to the current `banner`, so a transport change
 * reads as a new connection rather than a spliced history.
 *
 * The text fallback discipline holds: pass `fallback` — the plain
 * sentences that survive with the interaction removed.
 */

export type TerminalLine = {
	text: string;
	tone?: "accent" | "dim" | "err" | "ok";
	/** Renders the line as a link — the terminal's door into the rest of the site. */
	href?: string;
};

export type TerminalResult = {
	lines: TerminalLine[];
	/** Reset the scrollback to the banner instead of appending. */
	clear?: boolean;
	/** Play the refusal sound instead of the tick. */
	refused?: boolean;
};

export function Terminal({
	kicker,
	headline,
	banner,
	prompt = ">",
	seeds = [],
	execute,
	complete,
	sessionKey,
	height = 420,
	clearLabel = "CLEAR",
	fallback,
	footnote,
}: {
	/** Evidence-voice label above the instrument. */
	kicker: string;
	/** Editorial-voice line, e.g. "psql, for a model." */
	headline?: string;
	/** The lines a fresh session opens with — also what CLEAR restores. */
	banner: TerminalLine[];
	/** The prompt string, caller-owned (may change between lines). */
	prompt?: string;
	/** One-click statements rendered as chips under the terminal. */
	seeds?: string[];
	/** The meaning of the terminal: one line in, lines out. */
	execute: (line: string) => Promise<TerminalResult> | TerminalResult;
	/** Tab completion: candidate continuations for the current input. */
	complete?: (line: string) => string[];
	/** When this changes, the scrollback resets to the current banner. */
	sessionKey?: string | number;
	height?: number;
	clearLabel?: string;
	/** System-voice sentences that survive with the interaction removed. */
	fallback?: string;
	/** Evidence-voice closing line. */
	footnote?: string;
}) {
	const [lines, setLines] = useState<TerminalLine[]>(banner);
	const [input, setInput] = useState("");
	const [busy, setBusy] = useState(false);
	const endRef = useRef<HTMLDivElement>(null);
	const inputId = useId();
	// The banner belongs to the session: re-read it only when the
	// session changes, never on every render.
	const bannerRef = useRef(banner);
	bannerRef.current = banner;

	useEffect(() => {
		if (sessionKey === undefined) return;
		setLines(bannerRef.current);
	}, [sessionKey]);

	function scroll() {
		requestAnimationFrame(() => endRef.current?.scrollIntoView({ block: "nearest" }));
	}

	function reset() {
		tick();
		setLines(bannerRef.current);
		setInput("");
		scroll();
	}

	function onTab() {
		if (!complete) return;
		const options = complete(input);
		if (options.length === 0) return;
		if (options.length === 1) {
			tick();
			setInput(options[0]);
			return;
		}
		// Fill the longest common prefix, then show the choices.
		let prefix = options[0];
		for (const o of options) {
			let k = 0;
			while (k < prefix.length && k < o.length && prefix[k].toLowerCase() === o[k].toLowerCase()) k++;
			prefix = prefix.slice(0, k);
		}
		if (prefix.length > input.length) setInput(prefix);
		setLines((prev) => [...prev, { text: options.join("   "), tone: "dim" }]);
		scroll();
	}

	async function run(raw: string) {
		setLines((prev) => [...prev, { text: `${prompt} ${raw}`, tone: "accent" }]);
		setInput("");
		scroll();
		setBusy(true);
		try {
			const result = await execute(raw);
			if (result.refused) refuse();
			else tick();
			setLines((prev) => (result.clear ? bannerRef.current : [...prev, ...result.lines]));
		} finally {
			setBusy(false);
			scroll();
		}
	}

	return (
		<section className="hause-grid py-16 sm:py-24">
			<div className="col-span-12 md:col-start-2 md:col-span-10 lg:col-span-9">
				<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-3 opacity-50">{kicker}</p>
				{headline ? <p className="voice-editorial text-2xl sm:text-3xl mb-8 max-w-2xl">{headline}</p> : null}

				<div
					className="border p-4 sm:p-6 overflow-y-auto"
					style={{ borderColor: "var(--fg)", background: "var(--color-ink)", height }}
					onClick={() => (document.getElementById(inputId) as HTMLInputElement | null)?.focus()}
				>
					<div className="flex flex-col gap-1">
						{lines.map((l, i) => (
							<p
								key={i}
								className="voice-evidence text-[12px] sm:text-[13px] leading-relaxed whitespace-pre-wrap"
								style={{
									color:
										l.tone === "accent"
											? "var(--color-accent)"
											: l.tone === "err"
												? "var(--color-status-refuted)"
												: l.tone === "ok"
													? "var(--color-status-supported)"
													: "var(--color-white)",
									opacity: l.tone === "dim" ? 0.55 : 1,
								}}
							>
								{l.text}
							</p>
						))}
					</div>
					<form
						onSubmit={(e) => {
							e.preventDefault();
							if (input.trim() && !busy) void run(input);
						}}
						className="flex gap-2 mt-2"
					>
						<span className="voice-evidence text-[13px]" style={{ color: "var(--color-accent)" }}>
							{prompt}
						</span>
						<input
							id={inputId}
							value={input}
							onChange={(e) => setInput(e.target.value)}
							aria-label="Terminal input"
							autoComplete="off"
							spellCheck={false}
							className="voice-evidence text-[13px] flex-1 bg-transparent outline-none"
							style={{ color: "var(--color-white)", caretColor: "var(--color-accent)" }}
						/>
					</form>
					<div ref={endRef} />
				</div>

				<div className="flex flex-wrap gap-2 mt-4">
					{seeds.map((s) => (
						<button
							key={s}
							onClick={() => void run(s)}
							disabled={busy}
							className="voice-evidence text-[11px] px-3 py-1.5 border opacity-70 hover:opacity-100 disabled:opacity-30"
							style={{ borderColor: "var(--color-mist)" }}
						>
							{s}
						</button>
					))}
					<button
						onClick={reset}
						className="voice-evidence text-[11px] px-3 py-1.5 border opacity-70 hover:opacity-100 ml-auto"
						style={{ borderColor: "var(--color-accent)", color: "var(--color-accent)" }}
						aria-label="Clear the terminal"
					>
						{clearLabel}
					</button>
				</div>

				{fallback ? <p className="voice-system text-sm opacity-70 leading-relaxed max-w-2xl mt-6">{fallback}</p> : null}
				{footnote ? <p className="voice-evidence text-xs opacity-40 leading-relaxed max-w-2xl mt-3">{footnote}</p> : null}
			</div>
		</section>
	);
}
