"use client";

import { useState } from "react";

const TEMPOS = [
	{ label: "IMMEDIATE", value: "var(--motion-immediate)", ms: "150ms", note: "Interface actions respond." },
	{ label: "CONSIDERED", value: "var(--motion-considered)", ms: "450ms", note: "Ideas unfold." },
	{ label: "CINEMATIC", value: "var(--motion-cinematic)", ms: "1200ms", note: "Moments are allowed to arrive." },
];

export function PaceDemo() {
	const [i, setI] = useState(1);
	const [replayKey, setReplayKey] = useState(0);
	const tempo = TEMPOS[i];

	return (
		<div>
			<div className="flex gap-6 mb-8">
				{TEMPOS.map((t, idx) => (
					<button
						key={t.label}
						onClick={() => {
							setI(idx);
							setReplayKey((k) => k + 1);
						}}
						className="voice-evidence text-xs tracking-[0.1em]"
						style={{ opacity: idx === i ? 1 : 0.35 }}
					>
						{t.label}
						<span className="block opacity-60">{t.ms}</span>
					</button>
				))}
			</div>
			<div
				key={replayKey}
				className="pace-demo-box border px-8 py-10 mb-4"
				style={{ borderColor: "var(--fg)", animationDuration: tempo.value }}
			>
				<p className="voice-editorial text-2xl sm:text-3xl">{tempo.note}</p>
			</div>
			<button
				onClick={() => setReplayKey((k) => k + 1)}
				className="voice-system text-xs tracking-[0.06em] opacity-50 hover:opacity-100 transition-opacity"
			>
				REPLAY
			</button>
		</div>
	);
}
