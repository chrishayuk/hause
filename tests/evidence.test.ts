import assert from "node:assert/strict";
import test from "node:test";
import { formatEvidence, tracePosition, validateEvidenceTable, validateMeasurementTrace } from "../evidence.ts";

test("evidence formatting distinguishes a real zero, an unrun arm and an inapplicable control", () => {
  assert.equal(formatEvidence(0, { precision: 2 }), "0.00");
  assert.equal(formatEvidence({ missing: "not-measured" }), "Not measured");
  assert.equal(formatEvidence({ missing: "not-applicable" }), "Not applicable");
  assert.equal(formatEvidence(.9583333333333334, { format: "percent" }), "96%");
  assert.equal(formatEvidence(.125, { format: "percent", precision: 1 }), "12.5%");
  assert.equal(formatEvidence(12, { precision: 3 }), "12.000");
  for (const value of [NaN, Infinity, -Infinity]) assert.throws(() => formatEvidence(value), /finite/);
});
test("tables reject silent omissions, extra cells and duplicate identities", () => {
  const columns = [{ id: "n", label: "Samples" }];
  validateEvidenceTable({ columns, rows: [{ id: "a", label: "Measured", values: { n: 0 } }, { id: "b", label: "Unrun", values: { n: { missing: "not-measured" } } }] });
  validateEvidenceTable({ columns, rows: [] });
  assert.throws(() => validateEvidenceTable({ columns, rows: [{ id: "a", label: "Absent", values: {} }] }), /Missing cell/);
  assert.throws(() => validateEvidenceTable({ columns, rows: [{ id: "a", label: "Bad", values: { n: 2, typo: 4 } }] }), /Unknown/);
  assert.throws(() => validateEvidenceTable({ columns: [...columns, ...columns], rows: [] }), /unique/);
  assert.throws(() => formatEvidence(1, { precision: -1 }), /Precision/);
});
test("trace uses authored units and domains without converting missing samples into zeros", () => {
  const stages = [{ id: "before", label: "Before" }, { id: "after", label: "After", caution: "Uncontrolled temperature" }];
  validateMeasurementTrace({ stages, series: [{ id: "temperature", label: "Temperature", unit: "°C", domain: [-20, 40], values: [-10, null], baseline: 0 }], bands: [{ from: "after", to: "after", label: "Uncontrolled", caution: true }] });
  assert.equal(tracePosition(-10, [-20, 40]), 1 / 6);
  assert.equal(tracePosition(0, [0, 100]), 0);
  assert.equal(tracePosition(100, [0, 100]), 1);
  assert.throws(() => tracePosition(101, [0, 100]), /domain/);
  assert.throws(() => tracePosition(0, [0, 0]), /domain/);
  const valid = { stages, series: [{ id: "a", label: "A", domain: [0, 1] as const, values: [.5, .6] }] };
  assert.throws(() => validateMeasurementTrace({ ...valid, series: [{ ...valid.series[0], values: [.5] }] }), /one value/);
  assert.throws(() => validateMeasurementTrace({ ...valid, annotations: [{ from: "after", to: "before", label: "Backwards" }] }), /ordered/);
  assert.throws(() => validateMeasurementTrace({ ...valid, bands: [{ from: "missing", to: "after", label: "Absent" }] }), /ordered/);
  assert.throws(() => validateMeasurementTrace({ ...valid, series: [{ ...valid.series[0], baseline: 2 }] }), /domain/);
});
