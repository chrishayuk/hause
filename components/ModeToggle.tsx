"use client";

import { useEffect, useState } from "react";

/**
 * LIGHT / DARK — two authored environments, not a system-preference
 * switch. Once a bulb glyph beside the speaker, once spelled-out text:
 * the words earned their place while the nav was small, and gave it up
 * when the destinations multiplied. Line-art in currentColor so the
 * control still reads as hause voice, not app chrome — the bulb lit
 * (rays) in light, at rest in dark.
 */
export function ModeToggle() {
	// Server-rendered default is always dark; the blocking script in layout.tsx
	// sets the real attribute before paint, and this syncs to it after hydration
	// (a one-frame glyph flicker at worst, never a page-color flash).
	const [mode, setMode] = useState<"light" | "dark">("dark");

	useEffect(() => {
		setMode(document.documentElement.dataset.mode === "light" ? "light" : "dark");
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

	const light = mode === "light";
	return (
		<button
			onClick={toggle}
			aria-label={light ? "Switch to the dark environment" : "Switch to the light environment"}
			aria-pressed={light}
			title={light ? "Light" : "Dark"}
			className="transition-opacity hover:opacity-100"
			style={{ opacity: light ? 0.9 : 0.45, lineHeight: 0 }}
		>
			<svg width="17" height="17" viewBox="0 0 17 17" fill="none" stroke="currentColor" strokeWidth="1.1" aria-hidden="true">
				<path d="M8.5 3.2a3.9 3.9 0 0 1 2.2 7.1c-.5.4-.7.9-.7 1.4h-3c0-.5-.2-1-.7-1.4A3.9 3.9 0 0 1 8.5 3.2z" strokeLinejoin="round" />
				<path d="M7.2 13.4h2.6M7.7 14.9h1.6" strokeLinecap="round" />
				{light && (
					<path d="M8.5.9v1M3.4 3.1l.8.7M13.6 3.1l-.8.7M1.6 8h1M13.9 8h1.5" strokeLinecap="round" />
				)}
			</svg>
		</button>
	);
}
