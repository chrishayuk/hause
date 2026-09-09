export type ExhibitionOutcome = { id: string; expected: string; selected: string; exact: boolean };

/** Never infer a pass from a label: use the recorded scoring decision. */
export function outcomeSummary(outcomes: readonly ExhibitionOutcome[]) {
  const ids = outcomes.map(outcome => outcome.id);
  if (new Set(ids).size !== ids.length) throw new Error("Outcome IDs must be unique within a condition");
  const exact = outcomes.filter(outcome => outcome.exact).length;
  return { total: outcomes.length, exact, misses: outcomes.length - exact, percent: outcomes.length ? exact / outcomes.length * 100 : null };
}
