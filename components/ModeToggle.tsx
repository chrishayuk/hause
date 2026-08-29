"use client";

import { useEffect, useState } from "react";

/**
 * LIGHT / DARK — two authored environments, not a system-preference switch.
 * Deliberately text, not a sun/moon icon: the control itself should read as
 * part of the hause voice, not app chrome.
 */
export function ModeToggle() {
	// Server-rendered default is always light; the blocking script in layout.tsx
	// sets the real attribute before paint, and this syncs to it after hydration
	// (a one-frame label flicker at worst, never a page-color flash).
	const [mode, setMode] = useState<"light" | "dark">("light");

	useEffect(() => {
		setMode(document.documentElement.dataset.mode === "dark" ? "dark" : "light");
	}, []);

	function toggle() {
		const next = mode === "light" ? "dark" : "light";
		setMode(next);
		document.documentElement.dataset.mode = next;
		try {
			window.localStorage.setItem("hause-mode", next);
		} catch {
			// localStorage can throw (private mode, disabled site data) — the
			// toggle still works for this page view, it just won't persist.
		}
	}

	return (
		<button onClick={toggle} className="voice-evidence text-xs tracking-[0.1em]" aria-label="Toggle light or dark mode">
			<span style={{ opacity: mode === "light" ? 1 : 0.4 }}>LIGHT</span>
			<span style={{ opacity: 0.4 }}> / </span>
			<span style={{ opacity: mode === "dark" ? 1 : 0.4 }}>DARK</span>
		</button>
	);
}
