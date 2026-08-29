import { Reveal } from "../Reveal";

export function Observation({ label, text }: { label?: string; text: string }) {
	return (
		<Reveal className="hause-grid py-12 sm:py-16">
			<div className="col-span-12 md:col-start-3 md:col-span-8">
				{label && (
					<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-3 opacity-60">{label}</p>
				)}
				<p className="voice-system text-lg sm:text-xl leading-relaxed opacity-90">{text}</p>
			</div>
		</Reveal>
	);
}
