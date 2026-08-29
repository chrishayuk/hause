"use client";

import { useEffect, useState } from "react";
import { soundEnabled, setSoundEnabled } from "../sound";

/**
 * SOUND ON / OFF — the tactile voice's opt-in, styled exactly like
 * LIGHT / DARK. Off by default, always: hause sound is something a
 * visitor chooses, never something a page does to them. Turning it on
 * plays one tick, so the choice is answered in the palette itself.
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
		<button onClick={toggle} className="voice-evidence text-xs tracking-[0.1em]" aria-label="Toggle interface sound">
			<span style={{ opacity: 0.4 }}>SOUND </span>
			<span style={{ opacity: on ? 1 : 0.4 }}>ON</span>
			<span style={{ opacity: 0.4 }}> / </span>
			<span style={{ opacity: on ? 0.4 : 1 }}>OFF</span>
		</button>
	);
}
