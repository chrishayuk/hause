import type { ReactNode } from "react";
import "../../study.css";

/** Publication composition, not a new semantic act. The consumer owns the
 * evidence, its qualifications and the order of the rooms. Import exhibition.css. */
export function StudyRoom({ id, label, title, description, tone = "paper", children }: {
  id?: string; label: string; title: ReactNode; description?: string;
  tone?: "paper" | "dark" | "accent"; children?: ReactNode;
}) {
  return <section id={id} className="hause-study-room" data-tone={tone}>
    <header><span className="exhibition-label">{label}</span><h2>{title}</h2>{description && <p>{description}</p>}</header>
    {children && <div className="hause-study-content">{children}</div>}
  </section>;
}

/** A readable sequence. No automatic motion, invented measurements or hidden
 * intermediate state: order is expressed by native list semantics. */
export function StudySequence({ label, steps, note }: {
  label: string; steps: { label: string; value: string; detail?: string }[]; note?: string;
}) {
  return <figure className="hause-study-sequence"><figcaption className="exhibition-label">{label}</figcaption>
    <ol>{steps.map((step, i) => <li key={i}><span className="exhibition-label">{step.label}</span><strong>{step.value}</strong>{step.detail && <p>{step.detail}</p>}</li>)}</ol>
    {note && <p className="hause-study-note">{note}</p>}
  </figure>;
}

/** Magnitude with its scope attached. Static evidence, not a counting animation. */
export function StudyMeasures({ label, items, note }: {
  label: string; items: { value: string; label: string; detail?: string }[]; note: string;
}) {
  return <figure className="hause-study-measures"><figcaption className="exhibition-label">{label}</figcaption>
    <dl>{items.map((item, i) => <div key={i}><dt>{item.label}</dt><dd>{item.value}</dd>{item.detail && <dd className="hause-study-measure-detail">{item.detail}</dd>}</div>)}</dl>
    <p className="hause-study-note">{note}</p>
  </figure>;
}
