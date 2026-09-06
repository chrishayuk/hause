"use client";
import { useEffect, useId, useRef, useState, type CSSProperties } from "react";
import { useMotion } from "./Motion";
import { formatEvidence, tracePosition, validateMeasurementTrace, type EvidenceSource, type MeasurementTraceData } from "../evidence";
import "../evidence.css";

export type MeasurementTraceProps = MeasurementTraceData & {
  id?: string; className?: string; label: string; kicker?: string; stageLabel?: string;
  summary: string; source?: EvidenceSource; initialStage?: string; autoPlay?: boolean; intervalMs?: number;
};
/** Recorded tracks across ordered stages. All values are present in the native
 * HTML table; playback moves the emphasis, never manufactures intermediate data.
 * Requires MotionProvider. Missing samples are gaps, not zeros. */
export function MeasurementTrace({ id, className = "", label, kicker, stageLabel = "Stage", stages, series, annotations = [], bands = [], summary, source, initialStage, autoPlay = false, intervalMs = 2800 }: MeasurementTraceProps) {
  validateMeasurementTrace({ stages, series, annotations, bands });
  if (!Number.isFinite(intervalMs) || intervalMs < 200) throw new Error("Trace playback interval must be at least 200 ms");
  if (initialStage !== undefined && !stages.some(stage => stage.id === initialStage)) throw new Error("Initial stage must exist");
  const [selected, setSelected] = useState(initialStage ?? stages[0].id);
  const [held, setHeld] = useState(false);
  const [running, setRunning] = useState(false);
  const ref = useRef<HTMLElement>(null);
  const uid = useId();
  const { register, request } = useMotion();
  const index = Math.max(0, stages.findIndex(stage => stage.id === selected));
  const current = stages[index];
  useEffect(() => {
    if (!ref.current || stages.length < 2) return;
    return register({ id: uid, element: ref.current, manualOnly: !autoPlay, start: () => setRunning(true), stop: () => setRunning(false) });
  }, [uid, register, autoPlay, stages.length]);
  useEffect(() => {
    if (!running || held || stages.length < 2) return;
    const timer = window.setInterval(() => setSelected(value => stages[(Math.max(0, stages.findIndex(s => s.id === value)) + 1) % stages.length].id), intervalMs);
    return () => window.clearInterval(timer);
  }, [running, held, stages, intervalMs]);
  const select = (value: number) => { setHeld(true); setSelected(stages[value].id); };
  const spans = (items: MeasurementTraceData["bands"], kind: string) => items?.length ? <div className={`hause-trace-spans ${kind}`} style={{ "--stage-count": stages.length } as CSSProperties}>{items.map((span, i) => <span key={`${span.from}-${span.to}-${i}`} data-caution={span.caution || undefined} style={{ gridColumn: `${stages.findIndex(s => s.id === span.from) + 1} / ${stages.findIndex(s => s.id === span.to) + 2}` }}><strong>{stages.find(s => s.id === span.from)!.label}{span.from !== span.to ? ` → ${stages.find(s => s.id === span.to)!.label}` : ""}</strong><br/>{span.label}</span>)}</div> : null;
  return <figure ref={ref} id={id} className={`hause-measurement-trace ${className}`} aria-label={label}>
    {kicker && <p className="hause-trace-kicker">{kicker}</p>}
    <div className="hause-trace-heading"><div><span>{stageLabel}</span><strong>{current.label}</strong></div><p>{current.title ?? label}</p></div>
    <div className="hause-evidence-scroll" role="region" aria-label={`${label}: all recorded values`} tabIndex={0}>
      <table className="hause-trace-table"><caption>{label}</caption><thead><tr><th scope="col">{stageLabel}</th>{stages.map((stage, i) => <th key={stage.id} scope="col" data-caution={Boolean(stage.caution) || undefined}><button type="button" aria-pressed={index === i} onClick={() => select(i)}>{stage.label}{stage.caution && <span className="hause-trace-caution-label">Caution</span>}</button></th>)}</tr></thead>
        <tbody>{series.map(track => <tr key={track.id} style={{ "--trace-color": track.color ?? "var(--color-accent, currentColor)" } as CSSProperties}><th scope="row">{track.label}<small>{track.domain[0]}–{track.domain[1]}{track.unit ? ` ${track.unit}` : ""}</small>{track.baseline !== undefined && <small>Baseline {formatEvidence(track.baseline, track)}</small>}</th>{track.values.map((value, i) => <td key={stages[i].id} data-selected={index === i || undefined} data-caution={Boolean(stages[i].caution) || undefined}>
          <span className="hause-trace-bar" aria-hidden="true">{value !== null && <i style={{ height: `${tracePosition(value, track.domain) * 100}%` }}/>}{track.baseline !== undefined && <b style={{ bottom: `${tracePosition(track.baseline, track.domain) * 100}%` }}/>}</span>
          <span className="hause-trace-value">{value === null ? "Not measured" : formatEvidence(value, track)}</span>
        </td>)}</tr>)}</tbody>
      </table>
    </div>
    {spans(annotations, "hause-trace-annotations")}{spans(bands, "hause-trace-bands")}
    <div className="hause-trace-controls"><label htmlFor={`${uid}-stage`}>Explore {stageLabel.toLowerCase()}</label><input id={`${uid}-stage`} type="range" min={0} max={stages.length - 1} step={1} value={index} disabled={stages.length < 2} aria-valuetext={`${current.label}. ${current.title ?? ""}`} onChange={event => select(Number(event.target.value))}/><button type="button" disabled={stages.length < 2} onClick={() => { if (running && !held) setHeld(true); else { setHeld(false); request(uid); } }}>{running && !held ? "Pause Ⅱ" : "Play →"}</button><button type="button" disabled={stages.length < 2} onClick={() => { setSelected(stages[0].id); setHeld(false); request(uid); }}>Replay ↻</button></div>
    {current.description && <p className="hause-trace-description">{current.description}</p>}
    <figcaption>{summary}{source && <> <a href={source.href}>{source.label} ↗</a></>}</figcaption>
    {stages.some(stage => stage.caution) && <ul className="hause-trace-cautions">{stages.filter(stage => stage.caution).map(stage => <li key={stage.id}><strong>{stage.label}:</strong> {stage.caution}</li>)}</ul>}
  </figure>;
}
