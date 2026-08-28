import { Reveal } from "../Reveal";

export function Film({ title, description }: { title: string; description: string }) {
	return (
		<Reveal className="house-grid py-16 sm:py-24">
			<div className="col-span-12">
				<div
					className="aspect-video w-full flex items-center justify-center border border-dashed"
					style={{ borderColor: "var(--color-mist)" }}
				>
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase opacity-40">FILM — PLACEHOLDER</p>
				</div>
				<div className="mt-6 max-w-2xl">
					<p className="voice-system text-lg mb-2">{title}</p>
					<p className="voice-system text-sm opacity-60 leading-relaxed">{description}</p>
				</div>
			</div>
		</Reveal>
	);
}
