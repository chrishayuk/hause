import { outcomeSummary, type ExhibitionOutcome } from "../../exhibition-outcomes";
import "../../exhibition-media.css";

/** One mark per recorded case, with an equivalent native text record.
 * The consumer supplies the frozen outcomes, scope and source; no simulated data. */
export function OutcomeMatrix({ label, outcomes, scope, sourceHref }: {
  label: string; outcomes: readonly ExhibitionOutcome[]; scope: string; sourceHref: string;
}) {
  const summary = outcomeSummary(outcomes);
  return <figure className="hause-outcome-matrix">
    <figcaption className="voice-evidence">{label}</figcaption>
    <p className="hause-outcome-score voice-evidence">{summary.exact}<span> / {summary.total}</span></p>
    <div className="hause-outcome-marks" aria-hidden="true">{outcomes.map(outcome => <i key={outcome.id} data-exact={outcome.exact} title={`${outcome.id}: ${outcome.exact ? "exact" : "miss"}`} />)}</div>
    <p className="voice-evidence">{summary.exact} exact · {summary.misses} missed<br />Solid = exact · slash = miss · one mark per case</p>
    <p className="voice-system">{scope}</p>
    <details><summary className="voice-evidence">READ EVERY CASE ({summary.total})</summary><div className="hause-outcome-table"><table><caption>{label} — recorded selections</caption><thead><tr><th scope="col">Case</th><th scope="col">Expected</th><th scope="col">Selected</th><th scope="col">Result</th></tr></thead><tbody>{outcomes.map(outcome => <tr key={outcome.id}><th scope="row">{outcome.id}</th><td>{outcome.expected}</td><td>{outcome.selected}</td><td>{outcome.exact ? "Exact" : "Miss"}</td></tr>)}</tbody></table></div></details>
    <a className="hause-exhibition-source voice-evidence" href={sourceHref}>INSPECT THE SOURCE ↗</a>
  </figure>;
}
