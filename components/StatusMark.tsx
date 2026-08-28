import type { Status } from "../types";

const COLOR: Record<Status, string> = {
	OPEN: "var(--color-status-open)",
	ONGOING: "var(--color-status-ongoing)",
	SUPPORTED: "var(--color-status-supported)",
	REFUTED: "var(--color-status-refuted)",
	SUPERSEDED: "var(--color-status-superseded)",
};

export function StatusMark({ status }: { status: Status }) {
	return (
		<span className="status-mark" style={{ color: COLOR[status] }}>
			{status}
		</span>
	);
}
