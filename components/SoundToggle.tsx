"use client";

import { useEffect, useState } from "react";
import { soundEnabled, setSoundEnabled } from "../sound";

/**
 * SOUND — the tactile voice's opt-in, now a speaker glyph: as the nav
 * grew destinations, two spelled-out toggles made the chrome busier
 * than the pages. Off by default, always: hause sound is something a
 * visitor chooses, never something a page does to them. Turning it on
 * plays one tick, so the choice is answered in the palette itself.
 * Line-art in currentColor — hause voice, not app chrome: arcs when
 * sounding, a strike when silent.
 */
export function SoundToggle() {
	const [on, setOn] = useState(false);

	useEffect(() => {
		setOn(soundEnabled());
	}, []);

	function toggle() {
		const next = !on;
		setOn(next);
		setSoundEnabled(next);
	}

	return (
		<button
			onClick={toggle}
			aria-label={on ? "Turn interface sound off" : "Turn interface sound on"}
			aria-pressed={on}
			title={on ? "Sound on" : "Sound off"}
			className="transition-opacity hover:opacity-100"
			style={{ opacity: on ? 0.9 : 0.45, lineHeight: 0 }}
		>
			<svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
				<path d="M2.5 6.5h2.6L9 3.5v10L5.1 10.5H2.5z" strokeLinejoin="round" />
				{on ? (
					<>
						<path d="M11.2 6.2a3.2 3.2 0 0 1 0 4.6" strokeLinecap="round" />
						<path d="M13.1 4.4a5.8 5.8 0 0 1 0 8.2" strokeLinecap="round" />
					</>
				) : (
					<path d="M11 6.8l3.6 3.6M14.6 6.8L11 10.4" strokeLinecap="round" />
				)}
			</svg>
		</button>
	);
}
