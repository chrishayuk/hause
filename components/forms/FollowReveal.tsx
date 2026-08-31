"use client";

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "../Reveal";

/**
 * FOLLOWREVEAL — a path through connected ideas, replayed at the hause
 * stagger.
 *
 * A sentence, a control, and the path: each node carrying the relation
 * that brought it there — reads, operates, supports, contradicts — so
 * the shape of the argument is visible as a shape and not only as
 * prose. TRACE THE GRAPH replays the stagger for a reader who wants to
 * see the order again.
 *
 * The nodes are links and remain links with the animation removed;
 * the replay is emphasis, never the only way to read the path.
 *
 * An instrument: the reader operates it.
 */
export function FollowReveal({ text, path }: { text: string; path: { href: string; label: string; relation: string }[] }) {
	const [pulseKey, setPulseKey] = useState(0);

	if (path.length === 0) return null;

	return (
		<Reveal className="hause-grid py-16 sm:py-24">
			<div className="col-span-12 md:col-start-2 md:col-span-9">
				<p className="voice-system text-lg sm:text-xl opacity-85 leading-relaxed mb-6">{text}</p>
				<button
					onClick={() => setPulseKey((k) => k + 1)}
					className="voice-system text-sm tracking-[0.06em] border-b pb-0.5 mb-8 w-fit"
					style={{ borderColor: "var(--color-accent)" }}
				>
					TRACE THE GRAPH →
				</button>
				<div className="flex flex-col">
					{path.map((node, i) => (
						<div
							key={`${node.href}-${pulseKey}`}
							className="graph-pulse flex items-baseline gap-4 py-3 border-t"
							style={{ borderColor: "var(--color-mist)", animationDelay: `${i * 140}ms` }}
						>
							<span className="voice-evidence text-xs opacity-40 w-32 flex-none uppercase">{node.relation.replace(/_/g, " ")}</span>
							<Link href={node.href} className="voice-system text-lg hover:opacity-60 transition-opacity">
								{node.label}
							</Link>
						</div>
					))}
				</div>
			</div>
		</Reveal>
	);
}
