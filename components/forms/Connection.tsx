import Link from "next/link";
import { Reveal } from "../Reveal";

/**
 * CONNECTION — a bridge out of the chapter: one sentence, then the doors.
 *
 * The last form in a chapter. The sentence says what the next idea is
 * and why it follows; the doors are links that name where they go
 * rather than saying "next". A chapter that ends without one leaves the
 * reader at a wall.
 *
 * The sentence should raise the next chapter's question, not summarise
 * this one — a summary is a door that opens onto the room you are
 * already standing in.
 *
 * A statement: the reader reads.
 */
export function Connection({ text, links }: { text: string; links: { href: string; label: string }[] }) {
	return (
		<Reveal className="hause-grid py-16 sm:py-24">
			<div className="col-span-12 md:col-start-2 md:col-span-9">
				<p className="voice-system text-lg sm:text-xl opacity-85 leading-relaxed mb-6">{text}</p>
				<div className="flex flex-col gap-3">
					{links.map((link) => (
						<Link
							key={link.href}
							href={link.href}
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
