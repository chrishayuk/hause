"use client";

/**
 * The figure-authoring toolkit — what every custom figure reaches for.
 *
 * Promoted after three exhibits (Anatomy, Quantization, Discovering
 * the Map) each pasted the same three helpers: the etched-hatch
 * material, the reduced-motion gate, and the enter-once viewport
 * trigger. A site's figures are its own; the hand they are drawn
 * with belongs to the library.
 */

import { useEffect, useRef, useState } from "react";

/** The etched-hatch material: 45° hairlines in the given color. */
export const hatch = (color: string, pitch = 4) =>
	`repeating-linear-gradient(45deg, ${color} 0, ${color} 1px, transparent 1px, transparent ${pitch}px)`;

/** True when the visitor asked for reduced motion — figures must then
 * render their designed final state, not an un-animated absence. */
export function reducedMotion() {
	return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Enter-once viewport trigger: `inView` flips true the first time the
 * ref'd element crosses `threshold`, and immediately under reduced
 * motion so the final state shows without waiting.
 */
export function useInView(threshold = 0.3) {
	const ref = useRef<HTMLDivElement>(null);
	const [inView, setInView] = useState(false);
	useEffect(() => {
		if (reducedMotion()) {
			setInView(true);
			return;
		}
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					observer.disconnect();
					setInView(true);
				}
			},
			{ threshold }
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, [threshold]);
	return { ref, inView };
}
