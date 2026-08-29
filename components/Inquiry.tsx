"use client";

import { useState } from "react";
import { Comparison, type ComparisonProps } from "./forms/Comparison";
import { Timeline, type TimelineProps } from "./forms/Timeline";
import { ExpertField, type ExpertFieldProps } from "./forms/ExpertField";
import { Decomposition, type DecompositionProps } from "./forms/Decomposition";

/**
 * The result of resolving a query. Every variant except "lookup" and "none"
 * carries exactly the props one of HAUSE's own forms already takes — Inquiry
 * doesn't invent new rendering, it routes to the real primitive.
 *
 * This type lives in HAUSE because Inquiry has to know the shapes it can
 * render. Nothing here knows what a "Codex entry" is — resolve() (injected
 * by the caller) is the only place that searches real content. That's the
 * boundary: the resolver decides what matters, Inquiry decides how it's
 * experienced.
 */
export type InquiryPlan =
	| { kind: "comparison"; sourceTitle: string; props: ComparisonProps }
	| { kind: "timeline"; sourceTitle: string; props: TimelineProps }
	| { kind: "expert-field"; sourceTitle: string; props: ExpertFieldProps }
	| { kind: "decomposition"; sourceTitle: string; props: DecompositionProps }
	| { kind: "lookup"; matches: { title: string; description: string; href: string }[] }
	| { kind: "none" };

type Resolution = { plan: InquiryPlan; trace: string[] };

type State =
	| { phase: "dormant" }
	| { phase: "resolving"; query: string; trace: string[] }
	| { phase: "presenting"; query: string; resolution: Resolution };

export function Inquiry({
	resolve,
	placeholder = "What are you curious about?",
}: {
	resolve: (query: string) => Resolution;
	placeholder?: string;
}) {
	const [state, setState] = useState<State>({ phase: "dormant" });
	const [input, setInput] = useState("");
	const [insideOpen, setInsideOpen] = useState(false);

	function ask(query: string) {
		if (!query.trim()) return;
		const resolution = resolve(query);
		setState({ phase: "resolving", query, trace: resolution.trace });
		// A brief, honest pause — there's no network call or model behind this
		// yet, but an instant snap reads as broken, not as fast.
		window.setTimeout(() => setState({ phase: "presenting", query, resolution }), 650);
	}

	function reset() {
		setState({ phase: "dormant" });
		setInput("");
		setInsideOpen(false);
	}

	if (state.phase === "dormant") {
		return (
			<form
				onSubmit={(e) => {
					e.preventDefault();
					ask(input);
				}}
				className="w-full max-w-xl"
			>
				<input
					type="text"
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder={placeholder}
					className="voice-editorial w-full bg-transparent border-b py-3 text-2xl sm:text-3xl focus:outline-none"
					style={{ borderColor: "var(--fg)" }}
				/>
				<p className="voice-evidence text-xs opacity-40 mt-3">
					Ask something — this searches the Codex itself, not a model. Try "compare file and database" or "how did your thinking change".
				</p>
			</form>
		);
	}

	if (state.phase === "resolving") {
		return (
			<div className="w-full max-w-xl">
				<p className="voice-evidence text-xs tracking-[0.1em] uppercase opacity-50 mb-4">RESOLVING — {state.query}</p>
				<div className="flex flex-col gap-1">
					{state.trace.map((line, i) => (
						<p key={line} className="graph-pulse voice-evidence text-sm opacity-60" style={{ animationDelay: `${i * 140}ms` }}>
							{line}
						</p>
					))}
				</div>
			</div>
		);
	}

	const { query, resolution } = state;
	const { plan, trace } = resolution;

	return (
		<div className="w-full">
			<div className="flex items-start justify-between gap-6 mb-4">
				<div>
					<p className="voice-evidence text-xs tracking-[0.1em] uppercase opacity-40 mb-2">YOU ASKED</p>
					<h2 className="voice-editorial text-3xl sm:text-4xl leading-tight">{query}</h2>
				</div>
				<button onClick={reset} className="voice-system text-xs tracking-[0.1em] opacity-50 hover:opacity-100 transition-opacity flex-none mt-1">
					ASK SOMETHING ELSE
				</button>
			</div>

			<div className="my-6">
				{plan.kind === "comparison" && <Comparison {...plan.props} />}
				{plan.kind === "timeline" && <Timeline {...plan.props} />}
				{plan.kind === "expert-field" && <ExpertField {...plan.props} />}
				{plan.kind === "decomposition" && <Decomposition {...plan.props} />}
				{plan.kind === "lookup" && (
					<div className="flex flex-col gap-6 py-8">
						<p className="voice-system text-sm opacity-60">Closest matches in the Codex:</p>
						{plan.matches.map((m) => (
							<a key={m.href} href={m.href} className="block group">
								<p className="voice-editorial text-2xl group-hover:opacity-70 transition-opacity">{m.title}</p>
								{m.description && <p className="voice-system text-sm opacity-60 mt-1">{m.description}</p>}
							</a>
						))}
					</div>
				)}
				{plan.kind === "none" && (
					<p className="voice-system text-lg opacity-70 py-8">The Codex doesn't have an answer for this yet — that's a real gap, not a hedge.</p>
				)}
			</div>

			<button onClick={() => setInsideOpen((o) => !o)} className="voice-evidence text-xs tracking-[0.1em] uppercase opacity-50 hover:opacity-100 transition-opacity">
				{insideOpen ? "CLOSE" : "INSIDE"}
			</button>
			{insideOpen && (
				<div className="mt-4 p-6" style={{ background: "var(--fg)", color: "var(--bg)" }}>
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase opacity-50 mb-3">RESOLUTION TRACE — RULE-BASED, NO MODEL CALL</p>
					<ul className="voice-evidence text-sm leading-relaxed flex flex-col gap-1">
						{trace.map((line) => (
							<li key={line}>— {line}</li>
						))}
					</ul>
				</div>
			)}
		</div>
	);
}
