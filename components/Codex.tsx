"use client";
import { useEffect, useRef, useState, type ReactNode, type KeyboardEvent } from "react";
import { useMotion } from "./Motion";
import "../codex.css";
import { validateCodex, codexTurn } from "../codex";

export type CodexFolio = { id: string; label: string; kind?: "operate" | "evidence"; children: ReactNode };
type View = "cover" | "folios" | "read" | "history";

/** One bound entry; every page is real HTML. Ordinals are reading order, not provenance. */
export function Codex({ id, title, collection, byline, folios, manuscript, history }: {
  id: string; title: string; collection: string; byline: ReactNode;
  folios: CodexFolio[]; manuscript: ReactNode; history: ReactNode;
}) {
  validateCodex(id, folios);
  const [view, setView] = useState<View>("cover");
  const [index, setIndex] = useState(0);
  const [enlarged, setEnlarged] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const touch = useRef<number | null>(null);
  const { paused } = useMotion();
  const active = folios[index];
  useEffect(() => {
    const reveal = () => {
      let fragment: string; try { fragment = decodeURIComponent(location.hash.slice(1)); } catch { return; }
      const target = fragment ? document.getElementById(fragment) : null;
      if (!target || !root.current?.contains(target)) return;
      const page = target.closest<HTMLElement>("[data-codex-page]");
      if (!page) return;
      if (page.dataset.codexPage === "read") setView("read");
      else if (page.dataset.codexPage === "history") setView("history");
      else {
        const found = folios.findIndex(folio => folio.id === page.id);
        if (found < 0) return;
        setIndex(found); setView("folios");
      }
      for (let node: HTMLElement | null = target; node && root.current.contains(node); node = node.parentElement) {
        if (node instanceof HTMLDetailsElement) node.open = true;
      }
      target.querySelectorAll<HTMLDetailsElement>(":scope > details").forEach(detail => { detail.open = true; });
      requestAnimationFrame(() => { target.scrollIntoView({ behavior: "instant", block: "start" }); if (target instanceof HTMLElement && target.hasAttribute("tabindex")) target.focus({ preventScroll: true }); });
    };
    reveal(); window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, [folios]);
  function go(next: number) {
    const folio = folios[codexTurn(folios.length, next)];
    if (!folio) return;
    // A fragment records the actual spread and makes back/forward meaningful.
    location.hash = folio.id;
  }
  function keys(event: KeyboardEvent) {
    if (event.key === "Escape") { setEnlarged(false); return; }
    if (event.target instanceof Element && event.target.closest("input,select,textarea,button,a,[contenteditable]")) return;
    if (event.altKey || event.ctrlKey || event.metaKey || view !== "folios") return;
    if (event.key === "ArrowRight") { event.preventDefault(); go(index + 1); }
    if (event.key === "ArrowLeft") { event.preventDefault(); go(index - 1); }
  }
  const firstOperation = folios.find(folio => folio.kind === "operate");
  const firstEvidence = folios.find(folio => folio.kind === "evidence");
  return <div ref={root} className="hause-codex" id={id} data-view={view} data-enlarged={enlarged} data-motion={paused ? "paused" : "enabled"}>
    <header className="codex-heading">
      <p className="codex-collection">{collection}</p>
      <h1>{title}</h1>
      <div className="codex-byline">{byline}</div>
      <div className="codex-opening"><a href={`#${folios[0]?.id}`}>Open the notebook <span aria-hidden="true">↗</span></a><a href={`#${id}-read`}>Read the manuscript</a></div>
      <p className="codex-cover-note">Working papers · {folios.length} spreads</p>
    </header>
    <nav className="codex-modes" aria-label="Notebook views">
      <a href={`#${active?.id}`} aria-current={view === "folios" ? "true" : undefined}>Folios</a>
      <a href={`#${id}-read`} aria-current={view === "read" ? "true" : undefined}>Read</a>
      {firstOperation && <a href={`#${firstOperation.id}`}>Operate</a>}
      {firstEvidence && <a href={`#${firstEvidence.id}`}>Evidence</a>}
      <a href={`#${id}-history`} aria-current={view === "history" ? "true" : undefined}>History</a>
      {view !== "cover" && <button type="button" className="codex-enlarge" aria-pressed={enlarged} onClick={() => setEnlarged(value => !value)}>{enlarged ? "Fit spread" : "Enlarge"}</button>}
    </nav>
    <div className="codex-desk">
      <nav className="codex-edge" aria-label="Folio index">{folios.map((folio, i) => <a href={`#${folio.id}`} key={folio.id} aria-current={view === "folios" && index === i ? "page" : undefined}><span>{String(i + 1).padStart(2, "0")}</span><span>{folio.label}</span></a>)}</nav>
      <div className="codex-book" tabIndex={0} onKeyDown={keys} aria-label="Notebook spread. Left and right arrow keys turn pages.">
        {folios.map((folio, i) => <section key={folio.id} id={folio.id} className="codex-folio" data-codex-page="folio" tabIndex={-1} hidden={view !== "folios" || index !== i} aria-label={`Spread ${i + 1}: ${folio.label}`}>
          <div className="codex-folio-label"><span>{collection}</span><span>{String(i + 1).padStart(2, "0")} / {String(folios.length).padStart(2, "0")}</span></div>
          {folio.children}
        </section>)}
        <section id={`${id}-read`} data-codex-page="read" tabIndex={-1} className="codex-manuscript" hidden={view !== "read"}><h2>Read the manuscript</h2>{manuscript}</section>
        <section id={`${id}-history`} data-codex-page="history" tabIndex={-1} className="codex-history" hidden={view !== "history"}><h2>The record over time</h2>{history}</section>
      </div>
    </div>
    <div className="codex-pagination" hidden={view !== "folios"}>
      <button type="button" disabled={index === 0} onClick={() => go(index - 1)}>← Previous</button>
      <div className="codex-turn-handle" onPointerDown={event => { touch.current = event.clientX; event.currentTarget.setPointerCapture(event.pointerId); }} onPointerCancel={() => { touch.current = null; }} onPointerUp={event => { const from = touch.current; touch.current = null; if (from !== null && Math.abs(event.clientX - from) > 50) go(index + (event.clientX < from ? 1 : -1)); }}><span aria-live="polite">{index + 1} / {folios.length} · {active?.label}</span><small>Drag here to turn</small></div>
      <button type="button" disabled={index === folios.length - 1} onClick={() => go(index + 1)}>Next →</button>
    </div>
    <noscript><style>{`.hause-codex[data-view=cover] .codex-desk{display:block!important}.hause-codex .codex-folio[hidden],.hause-codex .codex-manuscript[hidden],.hause-codex .codex-history[hidden]{display:block!important}.hause-codex .codex-pagination{display:none!important}.hause-codex .codex-folio{margin-bottom:48px}`}</style></noscript>
  </div>;
}

/** Relative placement is semantic and collapses into DOM reading order on mobile. */
export function FolioObject({ children, place = "main", className = "" }: { children: ReactNode; place?: "left" | "right" | "main" | "margin" | "full"; className?: string }) {
  return <div className={`folio-object ${className}`} data-place={place}>{children}</div>;
}
export function Marginalia({ children, label }: { children: ReactNode; label: string }) {
  return <aside className="folio-marginalia"><h3>{label}</h3>{children}</aside>;
}
