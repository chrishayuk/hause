import Link from "next/link";
import { Reveal } from "../Reveal";

export function Connection({ text, links }: { text: string; links: { slug: string; label: string }[] }) {
	return (
		<Reveal className="house-grid py-16 sm:py-24">
			<div className="col-span-12 md:col-start-2 md:col-span-9">
				<p className="voice-system text-lg sm:text-xl opacity-85 leading-relaxed mb-6">{text}</p>
				<div className="flex flex-col gap-3">
					{links.map((link) => (
						<Link
							key={link.slug}
							href={`/codex/${link.slug}`}
							className="voice-system inline-flex items-center gap-2 text-sm tracking-[0.06em] w-fit border-b pb-0.5"
							style={{ borderColor: "var(--color-accent)" }}
						>
							FOLLOW THIS IDEA — {link.label} →
						</Link>
					))}
				</div>
			</div>
		</Reveal>
	);
}
