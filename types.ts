/**
 * HOUSE owns this vocabulary — it's part of the design system (StatusMark,
 * the forms/* primitives), not the Codex content model. Codex re-exports it
 * for convenience; anything consuming HOUSE independently of Codex should
 * import it from here.
 */
export type Status = "OPEN" | "ONGOING" | "SUPPORTED" | "REFUTED" | "SUPERSEDED";
