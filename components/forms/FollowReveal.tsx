"use client";

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "../Reveal";

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
