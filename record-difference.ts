/** Compare two recorded inventories by identity, not just equal-sized totals. */
export function recordDifference(expected: readonly string[], actual: readonly string[]) {
  if (new Set(expected).size !== expected.length || new Set(actual).size !== actual.length) throw new Error("Record identities must be unique");
  const missing = expected.filter(id => !actual.includes(id));
  const extra = actual.filter(id => !expected.includes(id));
  return { missing, extra, matches: !missing.length && !extra.length };
}
