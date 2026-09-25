import type { ReactNode } from 'react';
import '../notebook.css';

/** Continuous long-form reading, separate from the composed folio summary. */
export function Manuscript({ id, introduction, contents, children }: { id?: string; introduction: ReactNode; contents?: ReactNode; children: ReactNode }) {
 return <article id={id} className="hause-manuscript"><header className="manuscript-introduction">{introduction}</header>{contents && <details className="manuscript-contents"><summary>In this essay</summary><nav aria-label="Essay contents">{contents}</nav></details>}{children}</article>;
}
