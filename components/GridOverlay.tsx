"use client";

import { useState, type ReactNode } from "react";

export function GridOverlay({ children }: { children: ReactNode }) {
	const [show, setShow] = useState(false);
	return (
		<div>
			<button
				onClick={() => setShow((s) => !s)}
				className="voice-evidence text-xs tracking-[0.14em] uppercase border-b pb-0.5 mb-6 w-fit"
				style={{ borderColor: "var(--color-accent)" }}
			>
				{show ? "HIDE STRUCTURE" : "SHOW STRUCTURE"}
			</button>
			<div className="relative">
				{children}
				{show && (
					<div className="absolute inset-0 hause-grid pointer-events-none" aria-hidden="true">
						{Array.from({ length: 12 }).map((_, i) => (
							<div
								key={i}
								style={{
									background: "color-mix(in srgb, var(--color-accent) 10%, transparent)",
									outline: "1px dashed var(--color-accent)",
								}}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
