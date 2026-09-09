import type { ReactNode } from "react";
import "../../exhibition-media.css";

/** The consumer supplies the media renderer, alternative text and truthful credit.
 * Composition infrastructure, not a semantic form or a source of evidence. */
export function VisualPlate({ media, label, title, reading, credit, className = "" }: {
  media: ReactNode; label: string; title: string; reading: string; credit: string; className?: string;
}) {
  return <figure className={`hause-visual-plate ${className}`}>
    <div className="hause-visual-plate-media">{media}</div>
    <figcaption><span className="voice-evidence">{label}</span><p className="voice-editorial">{title}</p><p className="voice-system">{reading}</p><small className="voice-evidence">{credit}</small></figcaption>
  </figure>;
}
