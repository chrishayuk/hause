import { Reveal } from "../Reveal";
import { StatusMark } from "../StatusMark";
import type { Status } from "../../types";

/**
 * QUESTION — an open question, given the same typographic dignity as an
 * answer.
 *
 * Editorial voice at display size, led by its status mark, with room
 * for the working answer beneath. Most systems bury what they have not
 * settled in a roadmap; this form puts it at the size of a claim,
 * because an honest open question is more informative than a confident
 * paragraph about the same subject.
 *
 * A statement: the reader reads.
 */
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
