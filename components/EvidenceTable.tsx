import { formatEvidence, validateEvidenceTable, type EvidenceSource, type EvidenceTableData } from "../evidence";
import "../evidence.css";

export type EvidenceTableProps = EvidenceTableData & {
  id?: string; className?: string; caption: string; rowLabel: string; note?: string; source?: EvidenceSource;
};
/** A server-rendered table of recorded results. Units and precision belong to
 * columns; every absent value states why. Publication capability, not a new
 * manifest form. The consumer supplies the measurements and interpretation. */
export function EvidenceTable({ id, className = "", caption, rowLabel, columns, rows, note, source }: EvidenceTableProps) {
  validateEvidenceTable({ columns, rows });
  return <div id={id} className={`hause-evidence-table ${className}`}>
    <div className="hause-evidence-scroll" role="region" aria-label={caption} tabIndex={0}>
      <table><caption>{caption}</caption><thead><tr><th scope="col">{rowLabel}</th>{columns.map(column => <th key={column.id} scope="col">{column.label}{column.unit && <small>{column.unit}</small>}</th>)}</tr></thead>
        <tbody>{rows.map(row => <tr key={row.id} data-baseline={row.baseline || undefined}><th scope="row">{row.label}{row.baseline && <small>Baseline</small>}{row.note && <small>{row.note}</small>}{row.source && <a href={row.source.href}>{row.source.label} ↗</a>}</th>{columns.map(column => {
          const value = row.values[column.id];
          return <td key={column.id} data-missing={typeof value === "object" ? value.missing : undefined} data-numeric={typeof value === "number" || undefined}>{formatEvidence(value, column)}{typeof value === "object" && value.reason && <small>{value.reason}</small>}</td>;
        })}</tr>)}</tbody>
      </table>
    </div>
    {!rows.length && <p className="hause-evidence-note">No observations recorded.</p>}
    {(note || source) && <p className="hause-evidence-note">{note}{note && source ? " " : ""}{source && <a href={source.href}>{source.label} ↗</a>}</p>}
  </div>;
}
