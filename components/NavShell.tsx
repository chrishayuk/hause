"use client";

import { useState } from "react";
import Link from "next/link";
import { tick } from "../sound";

/**
 * NAVSHELL — the persistent header, at every width.
 *
 * Desktop: brand left, destinations and controls right, with each
 * link's own reveal budget (some chapters appear only as the viewport
 * affords them). Mobile: brand, the controls, and a text MENU toggle —
 * no hamburger iconography; the control reads as hause voice — opening
 * a full-width panel where EVERY destination is reachable, grouped,
 * in a column. The panel closes on navigation.
 *
 * Chrome, not a form: like ModeToggle and SoundToggle it lives beside
 * the forms, serving the two sites that share this exact pattern.
 */

export type NavLink = {
	href: string;
	label: string;
	/** Desktop reveal budget — when set, hidden below that breakpoint. */
	hide?: "sm" | "md" | "lg";
	/** Rendered in the accent colour (a privileged destination). */
	accent?: boolean;
	/** Rendered in a hairline box (a practical doorway). */
	boxed?: boolean;
	/** Mobile panel grouping label; consecutive links share a group. */
	group?: string;
};

const HIDE: Record<string, string> = {
	sm: "hidden sm:inline",
	md: "hidden md:inline",
	lg: "hidden lg:inline",
};

function DesktopLink({ link }: { link: NavLink }) {
	return (
		<Link
			href={link.href}
			className={`voice-evidence text-xs tracking-[0.1em] uppercase transition-opacity ${
				link.boxed ? "border px-2.5 py-1 opacity-80 hover:opacity-100" : "opacity-70 hover:opacity-100"
			} ${link.hide ? HIDE[link.hide] : ""}`}
			style={{
				color: link.accent ? "var(--color-accent)" : undefined,
				borderColor: link.boxed ? "var(--color-mist)" : undefined,
			}}
		>
			{link.label}
		</Link>
	);
}

export function NavShell({
	brand,
	links,
	controls,
}: {
	brand: { href: string; label: string };
	links: NavLink[];
	/** SoundToggle / ModeToggle etc — rendered at every width. */
	controls?: React.ReactNode;
}) {
	const [open, setOpen] = useState(false);

	// Group the links for the mobile panel, preserving order.
	const groups: { label?: string; links: NavLink[] }[] = [];
	for (const link of links) {
		const last = groups[groups.length - 1];
		if (last && last.label === link.group) last.links.push(link);
		else groups.push({ label: link.group, links: [link] });
	}

	return (
		<header className="hause-grid items-center py-6">
			<div className="col-span-5 sm:col-span-6 md:col-span-3">
				<Link href={brand.href} className="voice-system text-sm tracking-[0.12em]">
					{brand.label}
				</Link>
			</div>
			<nav className="col-span-7 sm:col-span-6 md:col-span-9 flex justify-end items-center gap-3 sm:gap-6 lg:gap-8 flex-nowrap">
				<span className="hidden sm:flex items-center gap-3 sm:gap-6 lg:gap-8 flex-nowrap">
					{links.map((l) => (
						<DesktopLink key={l.href + l.label} link={l} />
					))}
				</span>
				{controls}
				<button
					onClick={() => {
						tick();
						setOpen((v) => !v);
					}}
					aria-expanded={open}
					aria-label="Site menu"
					className="sm:hidden voice-evidence text-xs tracking-[0.12em] uppercase border px-2.5 py-1"
					style={{
						borderColor: open ? "var(--color-accent)" : "var(--color-mist)",
						color: open ? "var(--color-accent)" : undefined,
					}}
				>
					{open ? "CLOSE" : "MENU"}
				</button>
			</nav>
			{open && (
				<div className="col-span-12 sm:hidden border-t mt-5 pt-5 flex flex-col gap-5" style={{ borderColor: "var(--color-mist)" }}>
					{groups.map((g, gi) => (
						<div key={gi} className="flex flex-col gap-3">
							{g.label && (
								<p className="voice-evidence text-[10px] tracking-[0.14em] uppercase opacity-40 m-0">{g.label}</p>
							)}
							{g.links.map((l) => (
								<Link
									key={l.href + l.label}
									href={l.href}
									onClick={() => setOpen(false)}
									className="voice-evidence text-sm tracking-[0.1em] uppercase opacity-85"
									style={{ color: l.accent ? "var(--color-accent)" : undefined }}
								>
									{l.label}
								</Link>
							))}
						</div>
					))}
				</div>
			)}
		</header>
	);
}
