import type { ComponentProps, ReactNode } from "react";
import { Codex } from "./Codex";
import "../notebook-template.css";

/** An authored sequence of spreads, with an independent manuscript and history.
 * The host supplies chapter boundaries, evidence and publication state. */
export function NotebookTemplate({ className = "", ...props }: ComponentProps<typeof Codex> & { className?: string }) {
 return <div className={`hause-notebook-template ${className}`}><Codex {...props}/></div>;
}

/** Text and an explanatory drawing share a margin, not a separate card. */
export function NotebookNote({ title, children, sketch, caption }: {
 title: ReactNode; children: ReactNode; sketch: ReactNode; caption: ReactNode;
}) {
 return <div className="hause-notebook-note-container"><section className="hause-notebook-note">
  <div className="hause-notebook-note-copy"><h3>{title}</h3>{children}</div>
  <figure className="hause-notebook-sketch">{sketch}<figcaption>{caption}</figcaption></figure>
 </section></div>;
}

/** A mounted moving-image plate. The supplied player retains playback ownership. */
export function NotebookFilm({ children, caption, source, marker = "Film study", timestamp }: {
 children: ReactNode; caption: ReactNode; source?: { href: string; label: string };
 marker?: string; timestamp?: string;
}) {
 return <figure className="hause-notebook-film">
  <div className="notebook-film-register"><span>{marker}</span>{timestamp && <span>From {timestamp}</span>}</div>
  <div className="notebook-film-mount"><div className="notebook-film-screen">{children}</div></div>
  <figcaption><div>{caption}</div>{source && <a href={source.href}>{source.label} ↗</a>}</figcaption>
 </figure>;
}
