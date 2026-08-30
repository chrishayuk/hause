import Link from "next/link";

/**
 * SITEFOOTER — the complete index, at the bottom of every page.
 *
 * The top nav is a budget: destinations reveal as the viewport
 * affords them, and a growing site cannot list everything there
 * without becoming chrome. The footer is where everything IS listed —
 * every destination, grouped, in one crawlable column set. Chrome,
 * not a form: it lives beside NavShell, serving the sites that share
 * the pattern, and doubles as the internal-linking spine a crawler
 * walks.
 */

export type FooterGroup = {
	label: string;
	links: { href: string; label: string; external?: boolean }[];
};

export function SiteFooter({
	brand,
	tagline,
	groups,
	note,
}: {
	brand: string;
	tagline: string;
	groups: FooterGroup[];
	note?: string;
}) {
	return (
		<footer className="hause-grid pt-16 pb-12 mt-16 border-t" style={{ borderColor: "var(--color-mist)" }}>
			<div className="col-span-12 md:col-start-2 md:col-span-10">
				<div className="flex flex-wrap gap-x-12 gap-y-8">
					<div className="min-w-[10rem]">
						<p className="voice-editorial text-lg m-0">{brand}</p>
						<p className="voice-system text-xs opacity-60 leading-relaxed max-w-[14rem] mt-2 m-0">{tagline}</p>
					</div>
					{groups.map((g) => (
						<nav key={g.label} aria-label={g.label} className="min-w-[8rem]">
							<p className="voice-evidence text-[10px] tracking-[0.14em] uppercase opacity-45 m-0 mb-3">{g.label}</p>
							<ul className="m-0 p-0 list-none flex flex-col gap-1.5">
								{g.links.map((l) => (
									<li key={l.href}>
										{l.external ? (
											<a
												href={l.href}
												className="voice-evidence text-[11px] tracking-[0.06em] opacity-70 hover:opacity-100 transition-opacity"
											>
												{l.label} ↗
											</a>
										) : (
											<Link
												href={l.href}
												className="voice-evidence text-[11px] tracking-[0.06em] opacity-70 hover:opacity-100 transition-opacity"
											>
												{l.label}
											</Link>
										)}
									</li>
								))}
							</ul>
						</nav>
					))}
				</div>
				{note && <p className="voice-evidence text-[10px] opacity-40 mt-10 m-0">{note}</p>}
			</div>
		</footer>
	);
}
