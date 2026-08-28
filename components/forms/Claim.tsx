import { Reveal } from "../Reveal";
import { StatusMark } from "../StatusMark";
import type { Status } from "../../types";

export function Claim({ text, status, detail }: { text: string; status: Status; detail?: string }) {
	return (
		<Reveal className="house-grid py-14 sm:py-20">
			<div className="col-span-12 md:col-start-2 md:col-span-9 border-t pt-8" style={{ borderColor: "var(--color-mist)" }}>
				<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-4 opacity-50">CLAIM</p>
				<p className="voice-system text-2xl sm:text-3xl leading-snug mb-4">{text}</p>
				<div className="mb-3">
					<StatusMark status={status} />
				</div>
				{detail && <p className="voice-system text-base opacity-70 max-w-2xl leading-relaxed">{detail}</p>}
			</div>
		</Reveal>
	);
}
