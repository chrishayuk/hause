"use client";

import { useEffect, useId, useRef, useState } from "react";
import { useMotion } from "../Motion";

/** A held absence separates two states. The still edition preserves the score. */
export type StagedTransitionProps = {
  from: string;
  to: string;
  kicker: string;
  caption: string;
  score: [{ label: string; description: string }, { label: string; description: string }, { label: string; description: string }];
};

/** Exit, held absence, enter. Uses MotionProvider for visibility and pause
 * ownership. The final state and the complete score are the still edition.
 * Import @chrishayuk/hause/exhibition.css alongside HAUSE tokens. */
export function StagedTransition({ from, to, kicker, caption, score }: StagedTransitionProps) {
  const id = useId();
  const ref = useRef<HTMLElement>(null);
  const [playing, setPlaying] = useState(false);
  const { register, request, setPaused } = useMotion();
  useEffect(() => {
    if (!ref.current) return;
    return register({ id, element: ref.current, start: () => setPlaying(true), stop: () => setPlaying(false) });
  }, [id, register]);
  return <figure ref={ref} className="exhibition-staged-change" data-playing={playing}>
    <figcaption className="exhibition-label"><span>{kicker}</span><button onClick={() => playing ? setPaused(true) : request(id)} aria-label={playing ? "Pause staged change" : "Play staged change"}>{playing ? "PAUSE Ⅱ" : "PLAY ▷"}</button></figcaption>
    <div className="exhibition-performance-stage" aria-hidden="true"><span className="exhibition-state-claim">{from}</span><span className="exhibition-state-evidence">{to}</span><i /></div>
    <ol className="exhibition-performance-score">{score.map((beat, i) => <li key={i}><small>{String(i + 1).padStart(2, "0")}</small><span>{beat.label}</span><p>{beat.description}</p></li>)}</ol>
    <p>{caption}</p>
  </figure>;
}
