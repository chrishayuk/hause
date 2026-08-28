"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";

/**
 * Content is always present in the DOM — this only defers the visual
 * transition until the block is in view. Never gates content on JS.
 */
export function Reveal({ children, className = "" }: { children: ReactNode; className?: string }) {
	const ref = useRef<HTMLDivElement>(null);
	const [visible, setVisible] = useState(false);

	useEffect(() => {
		const el = ref.current;
		if (!el) return;
		const observer = new IntersectionObserver(
			([entry]) => {
				if (entry.isIntersecting) {
					setVisible(true);
					observer.disconnect();
				}
			},
			{ threshold: 0.15 }
		);
		observer.observe(el);
		return () => observer.disconnect();
	}, []);

	return (
		<div ref={ref} data-visible={visible} className={`reveal ${className}`}>
			{children}
		</div>
	);
}
