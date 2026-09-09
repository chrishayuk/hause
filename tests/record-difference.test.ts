import assert from "node:assert/strict";
import test from "node:test";
import { recordDifference } from "../record-difference.ts";
test("inventory comparison checks identities, including equal-sized substitutions", () => {
  assert.deepEqual(recordDifference(["A", "B"], ["B", "A"]), { missing: [], extra: [], matches: true });
  assert.deepEqual(recordDifference(["A", "B"], ["A", "C"]), { missing: ["B"], extra: ["C"], matches: false });
  assert.deepEqual(recordDifference(["A"], []), { missing: ["A"], extra: [], matches: false });
  assert.deepEqual(recordDifference([], []), { missing: [], extra: [], matches: true });
  assert.throws(() => recordDifference(["A", "A"], ["A"]));
  assert.throws(() => recordDifference(["A"], ["A", "A"]));
});
