/**
 * HAUSE owns this vocabulary — it's part of the design system (StatusMark,
 * the forms/* primitives), not the Codex content model. Codex re-exports it
 * for convenience; anything consuming HAUSE independently of Codex should
 * import it from here.
 *
 * STATUSES is the same vocabulary as a value, so a surface that lists the
 * statuses reads them from here rather than retyping them beside the type.
 */
export const STATUSES = ["OPEN", "ONGOING", "SUPPORTED", "REFUTED", "SUPERSEDED"] as const;
export type Status = (typeof STATUSES)[number];
