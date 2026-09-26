import type { ReactNode } from 'react';
import '../notebook-objects.css';

/** Stage the author's existing instrument; never split or resize its data to fit. */
export function NotebookStage({ children, layout = 'spread' }: {
 children: ReactNode; layout?: 'spread' | 'plate' | 'reading';
}) {
 return <div className="hause-notebook-stage" data-notebook-layout={layout}>{children}</div>;
}

/** A full-width object with its identification and qualification attached. */
export function NotebookPlate({ label, title, description, children, note, headingId, className = '' }: {
 label: string; title: ReactNode; description?: ReactNode; children: ReactNode;
 note?: ReactNode; headingId?: string; className?: string;
}) {
 return <section className={`hause-notebook-plate ${className}`}>
  <header className="notebook-object-heading"><span className="notebook-object-register">{label}</span><h2 id={headingId}>{title}</h2>{description && <div className="notebook-object-description">{description}</div>}</header>
  <div className="notebook-object-surface">{children}</div>
  {note && <footer className="notebook-object-note">{note}</footer>}
 </section>;
}

/** A contact sheet of authored specimens, not an invented set of trials. */
export function NotebookSpecimens({ children, label, density = 'editorial', className = '' }: {
 children: ReactNode; label: string; density?: 'editorial' | 'compact'; className?: string;
}) {
 return <div className={`hause-notebook-specimens ${className}`} aria-label={label} data-density={density}>{children}</div>;
}

/** Native disclosure keeps the full specimen server-rendered and keyboard accessible.
 * A group allows one specimen open at a time. IDs belong to the publication. */
export function NotebookSpecimen({ id, group, summary, children, className = '' }: {
 id: string; group?: string; summary: ReactNode; children: ReactNode; className?: string;
}) {
 return <details id={id} name={group} className={`hause-notebook-specimen ${className}`}>
  <summary>{summary}<span className="notebook-specimen-toggle" aria-hidden="true">+</span></summary>
  <div className="notebook-specimen-content">{children}</div>
 </details>;
}

/** The finding and its boundary receive equal space. Copy remains author-owned. */
export function NotebookClosing({ register, title, finding, scopeLabel, scope, children }: {
 register: ReactNode; title: string; finding: ReactNode; scopeLabel: string; scope: ReactNode; children?: ReactNode;
}) {
 return <div className="hause-notebook-closing">
  <header><p className="notebook-object-register">{register}</p><h2>{title}</h2></header>
  <div className="notebook-closing-pair"><div className="notebook-closing-finding">{finding}</div><aside className="notebook-closing-scope"><h3>{scopeLabel}</h3>{scope}</aside></div>
  {children && <footer>{children}</footer>}
 </div>;
}
