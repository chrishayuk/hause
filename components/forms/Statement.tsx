import { Reveal } from "../Reveal";

export function Statement({ text }: { text: string }) {
	return (
		<Reveal className="hause-grid py-20 sm:py-32">
			<p className="col-span-12 md:col-start-2 md:col-span-10 voice-editorial text-3xl sm:text-5xl lg:text-6xl leading-[1.05]">{text}</p>
		</Reveal>
	);
}
