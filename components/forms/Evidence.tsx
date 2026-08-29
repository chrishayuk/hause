import { Reveal } from "../Reveal";
import { StatusMark } from "../StatusMark";
import type { Status } from "../../types";

export function Evidence({ items }: { items: { label: string; status: Status; detail: string }[] }) {
	return (
		<Reveal className="hause-grid py-16 sm:py-24">
			<div className="col-span-12 md:col-start-2 md:col-span-10">
				<p className="voice-evidence text-xs tracking-[0.14em] uppercase mb-8 opacity-50">EVIDENCE</p>
				<div className="flex flex-col gap-8">
					{items.map((item, i) => (
						<div key={i} className="grid grid-cols-1 sm:grid-cols-[1fr_auto] gap-2 sm:gap-6 border-b pb-8" style={{ borderColor: "var(--color-mist)" }}>
							<div>
								<p className="voice-system text-lg sm:text-xl mb-2">{item.label}</p>
								<p className="voice-evidence text-sm opacity-60 leading-relaxed">{item.detail}</p>
							</div>
							<div className="sm:text-right">
								<StatusMark status={item.status} />
							</div>
						</div>
					))}
				</div>
			</div>
		</Reveal>
	);
}
