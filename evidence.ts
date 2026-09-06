/** Recorded evidence contracts. No model, database, interpolation or inferred results. */
export type EvidenceSource = { label: string; href: string };
export type MissingEvidence = { missing: "not-measured" | "not-applicable"; reason?: string };
export type EvidenceValue = number | string | MissingEvidence;
export type EvidenceColumn = { id: string; label: string; unit?: string; precision?: number; format?: "number" | "percent" };
export type EvidenceRow = { id: string; label: string; values: Record<string, EvidenceValue>; baseline?: boolean; note?: string; source?: EvidenceSource };
export type EvidenceTableData = { columns: readonly EvidenceColumn[]; rows: readonly EvidenceRow[] };
export type TraceStage = { id: string; label: string; title?: string; description?: string; caution?: string };
export type TraceSeries = { id: string; label: string; values: readonly (number | null)[]; domain: readonly [number, number]; precision?: number; unit?: string; baseline?: number; color?: string };
export type TraceSpan = { from: string; to: string; label: string; caution?: boolean };
export type MeasurementTraceData = { stages: readonly TraceStage[]; series: readonly TraceSeries[]; annotations?: readonly TraceSpan[]; bands?: readonly TraceSpan[] };

function uniqueIds(items: readonly { id: string }[], name: string) {
  if (items.some(item => !item.id.trim()) || new Set(items.map(item => item.id)).size !== items.length) throw new Error(`${name} require nonempty unique IDs`);
}
function precision(value?: number) {
  if (value !== undefined && (!Number.isInteger(value) || value < 0 || value > 12)) throw new Error("Precision must be an integer from 0 to 12");
}
export function formatEvidence(value: EvidenceValue, column: Pick<EvidenceColumn, "precision" | "format"> = {}): string {
  precision(column.precision);
  if (typeof value === "object" && value !== null) {
    if (value.missing === "not-applicable") return "Not applicable";
    if (value.missing === "not-measured") return "Not measured";
    throw new Error("Missing evidence must identify whether it is unmeasured or inapplicable");
  }
  if (typeof value === "string") return value;
  if (typeof value !== "number" || !Number.isFinite(value)) throw new Error("Evidence must be finite or explicitly missing");
  if (column.format === "percent") return `${(value * 100).toFixed(column.precision ?? 0)}%`;
  return column.precision === undefined ? String(value) : value.toFixed(column.precision);
}
export function validateEvidenceTable(data: EvidenceTableData): void {
  if (!data.columns.length) throw new Error("Evidence tables require columns");
  uniqueIds(data.columns, "Columns"); uniqueIds(data.rows, "Rows");
  for (const column of data.columns) { precision(column.precision); if (!column.label.trim()) throw new Error("Columns require labels"); }
  for (const row of data.rows) {
    if (!row.label.trim()) throw new Error("Rows require labels");
    for (const key of Object.keys(row.values)) if (!data.columns.some(c => c.id === key)) throw new Error(`Unknown evidence column: ${key}`);
    for (const column of data.columns) {
      if (!Object.hasOwn(row.values, column.id)) throw new Error(`Missing cell ${row.id}/${column.id}; mark it explicitly`);
      formatEvidence(row.values[column.id], column);
    }
  }
}
/** A proportion within the authored domain, never a fitted or interpolated value. */
export function tracePosition(value: number, domain: readonly [number, number]): number {
  if (!Number.isFinite(value) || !domain.every(Number.isFinite) || domain[1] <= domain[0] || value < domain[0] || value > domain[1]) throw new Error("Trace value must lie within a finite increasing domain");
  return (value - domain[0]) / (domain[1] - domain[0]);
}
export function validateMeasurementTrace(data: MeasurementTraceData): void {
  if (!data.stages.length || !data.series.length) throw new Error("A measurement trace requires stages and series");
  uniqueIds(data.stages, "Stages"); uniqueIds(data.series, "Series");
  for (const stage of data.stages) if (!stage.label.trim()) throw new Error("Stages require labels");
  for (const series of data.series) {
    if (!series.label.trim() || series.values.length !== data.stages.length) throw new Error("Each series requires a label and one value per stage");
    precision(series.precision);
    tracePosition(series.domain[0], series.domain);
    if (series.baseline !== undefined) tracePosition(series.baseline, series.domain);
    for (const value of series.values) if (value !== null) tracePosition(value, series.domain);
  }
  for (const span of [...(data.annotations ?? []), ...(data.bands ?? [])]) {
    const first = data.stages.findIndex(s => s.id === span.from), last = data.stages.findIndex(s => s.id === span.to);
    if (first < 0 || last < first || !span.label.trim()) throw new Error("Trace spans require existing ordered endpoints and a label");
  }
}
