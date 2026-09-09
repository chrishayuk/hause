"use client";
import { useEffect, useId, useRef, useState } from "react";
import { useMotion } from "../Motion";
import "../../study.css";

/** A rejected line remains legible while the consequence arrives. Shared motion
 * owns playback; paused, reduced-motion and no-JS editions show the resolution.
 * The consumer must name the actual consequence, not imply an automatic edit. */
export function TextCorrection({ before, after, caption, compact = false }: {
  before: string; after: string; caption: string; compact?: boolean;
}) {
  const id = useId(); const ref = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false); const [cycle, setCycle] = useState(0);
  const { register, request, setPaused } = useMotion();
  useEffect(() => {
    if (!ref.current) return;
    return register({ id, element: ref.current, start: () => { setCycle(n => n + 1); setPlaying(true); }, stop: () => setPlaying(false) });
  }, [id, register]);
  return <figure ref={ref} className="hause-text-correction" data-playing={playing} data-compact={compact}>
    <div key={cycle} className="hause-correction-stage"><p className="hause-correction-before"><s>{before}</s></p><p className="hause-correction-after">{after}</p></div>
    <figcaption>{caption}</figcaption>
    <button type="button" onClick={() => playing ? setPaused(true) : request(id)} aria-label={playing ? "Pause text correction" : "Play text correction"}>{playing ? "PAUSE Ⅱ" : "REPLAY THE CORRECTION ↻"}</button>
  </figure>;
}
