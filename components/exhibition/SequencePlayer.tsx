"use client";
import { useEffect, useRef, useState, type ReactNode } from "react";
import "../../exhibition-media.css";

export type SequenceFrame = { id: string; label: string; reading: string; content: ReactNode; durationMs?: number };
/** Finite, reader-started playback. The final frame and full text score exist before JS. */
export function SequencePlayer({ label, frames }: { label: string; frames: SequenceFrame[] }) {
  if (!frames.length || new Set(frames.map(frame => frame.id)).size !== frames.length) throw new Error("A sequence needs uniquely identified frames");
  const [at, setAt] = useState(frames.length - 1);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [reduced, setReduced] = useState(true);
  const stage = useRef<HTMLDivElement>(null);
  useEffect(() => {
    setReady(true);
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(preference.matches);
    const stop = () => setPlaying(false);
    const change = () => { setReduced(preference.matches); stop(); if (preference.matches) setAt(frames.length - 1); };
    const visibility = () => { if (document.hidden) stop(); };
    const observer = new IntersectionObserver(([entry]) => { if (!entry.isIntersecting) stop(); });
    if (stage.current) observer.observe(stage.current);
    preference.addEventListener("change", change);
    document.addEventListener("visibilitychange", visibility);
    return () => { observer.disconnect(); preference.removeEventListener("change", change); document.removeEventListener("visibilitychange", visibility); };
  }, [frames.length]);
  useEffect(() => {
    if (!playing || reduced) return;
    const timer = setTimeout(() => {
      if (at >= frames.length - 1) setPlaying(false);
      else setAt(at + 1);
    }, Math.max(300, frames[at].durationMs ?? 1600));
    return () => clearTimeout(timer);
  }, [at, playing, reduced, frames]);
  return <div ref={stage} className="hause-sequence-player" data-sequence={label} data-playing={playing}>
    <p className="voice-evidence">{label}</p>
    <div className="hause-sequence-stage">{frames.map((frame, index) => <div key={frame.id} hidden={index !== at} data-sequence-frame={frame.id}>{frame.content}</div>)}</div>
    <p className="voice-system" aria-live="polite" aria-atomic="true">{frames[at].reading}</p>
    <div className="hause-sequence-controls"><button disabled={!ready || reduced} onClick={() => { if (playing) setPlaying(false); else { setAt(0); setPlaying(true); } }}>{playing ? "PAUSE" : "PLAY FROM START"}</button><span className="voice-evidence">{reduced ? "STATIC VIEW / CHOOSE A FRAME" : "FINITE SEQUENCE / NO LOOP"}</span></div>
    <div className="hause-sequence-steps" role="group" aria-label="Choose a frame">{frames.map((frame, index) => <button key={frame.id} disabled={!ready} aria-pressed={index === at} onClick={() => { setPlaying(false); setAt(index); }}>{frame.label}</button>)}</div>
    <details><summary className="voice-evidence">READ THE COMPLETE SEQUENCE</summary><ol>{frames.map(frame => <li key={frame.id}><strong>{frame.label}</strong> — {frame.reading}</li>)}</ol></details>
  </div>;
}
