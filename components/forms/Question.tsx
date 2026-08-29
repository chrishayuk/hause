import { Reveal } from "../Reveal";
import { StatusMark } from "../StatusMark";
import type { Status } from "../../types";

export function Question({ text, status, detail }: { text: string; status: Status; detail?: string }) {
	return (
		<Reveal className="hause-grid py-20 sm:py-28">
			<div className="col-span-12 md:col-start-2 md:col-span-9">
				<div className="mb-6">
					<StatusMark status={status} />
				</div>
				<p className="voice-editorial text-3xl sm:text-4xl lg:text-5xl leading-tight mb-6">{text}</p>
				{detail && <p className="voice-system text-base sm:text-lg opacity-70 max-w-2xl leading-relaxed">{detail}</p>}
			</div>
		</Reveal>
	);
}
