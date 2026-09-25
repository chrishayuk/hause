"use client";
import { useEffect, useRef, useState, type ReactNode, type KeyboardEvent, type MouseEvent } from "react";
import { useMotion } from "./Motion";
import "../codex.css";
import { validateCodex, codexTurn } from "../codex";
import { snapshotCodexPage, animateCodexTurn } from "../codex-page-turn";

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
  const book = useRef<HTMLDivElement>(null);
  const navigate = useRef<(fragment: string, initial?: boolean) => void>(() => {});
  const cancelTurn = useRef<(() => void) | null>(null);
  const motionPaused = useRef(paused);
  useEffect(() => {
    motionPaused.current = paused;
    if (paused) cancelTurn.current?.();
  }, [paused]);
  useEffect(() => {
    let frame = 0;
    function reveal(fragment: string, initial = false) {
      cancelAnimationFrame(frame);
      cancelTurn.current?.();
      let decoded: string; try { decoded = decodeURIComponent(fragment); } catch { return; }
      if (!decoded && !initial) { setView('cover'); return; }
      const target = decoded ? document.getElementById(decoded) : null;
      if (!target || !root.current?.contains(target)) return;
      const page = target.closest<HTMLElement>("[data-codex-page]");
      if (!page || !book.current) return;
      const previous = book.current.querySelector<HTMLElement>('[data-codex-page]:not([hidden])');
      const found = folios.findIndex(folio => folio.id === page.id);
      const previousIndex = folios.findIndex(folio => folio.id === previous?.id);
      const canTurn = !initial && previous && previous !== page && found >= 0 && previousIndex >= 0
        && !motionPaused.current && !matchMedia('(prefers-reduced-motion: reduce)').matches
        && typeof book.current.animate === 'function';
      const snapshot = canTurn ? snapshotCodexPage(previous) : null;
      const surface = book.current;
      if (page.dataset.codexPage === 'read') setView('read');
      else if (page.dataset.codexPage === 'history') setView('history');
      else if (found >= 0) { setIndex(found); setView('folios'); }
      for (let node: HTMLElement | null = target; node && root.current.contains(node); node = node.parentElement) {
        if (node instanceof HTMLDetailsElement) node.open = true;
      }
      target.querySelectorAll<HTMLDetailsElement>(":scope > details").forEach(detail => { detail.open = true; });
      const finish = () => {
        // Ordinary turns keep the desk in place. Only entering the book or following
        // a specific annotation moves the reading position.
        if (initial || !previous || target !== page) target.scrollIntoView({ behavior: 'instant', block: 'start' });
        const focus = target.hasAttribute('tabindex') ? target : page;
        focus.focus({ preventScroll: true });
      };
      // Install cleanup before React paints, including a rapid second navigation.
      cancelTurn.current = () => { cancelAnimationFrame(frame); };
      const ready = () => {
        // React may defer a commit; never measure or snapshot a hidden destination.
        if (page.hidden) { frame = requestAnimationFrame(ready); return; }
        if (snapshot && !motionPaused.current) cancelTurn.current = animateCodexTurn(surface, snapshot, page, found > previousIndex, finish);
        else { cancelTurn.current = null; finish(); }
      };
      frame = requestAnimationFrame(ready);
    }
    navigate.current = reveal;
    const changed = () => reveal(location.hash.slice(1));
    reveal(location.hash.slice(1), true);
    window.addEventListener('hashchange', changed);
    return () => { cancelAnimationFrame(frame); cancelTurn.current?.(); window.removeEventListener('hashchange', changed); };
  }, [folios]);
  function visit(fragment: string) {
    if (location.hash !== `#${fragment}`) window.history.pushState(window.history.state, '', `#${fragment}`);
    navigate.current(fragment);
  }
  function links(event: MouseEvent) {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.altKey || event.shiftKey) return;
    const link = event.target instanceof Element ? event.target.closest<HTMLAnchorElement>('a[href^="#"]') : null;
    if (!link || link.target || link.hasAttribute('download')) return;
    let target: HTMLElement | null;
    try { target = document.getElementById(decodeURIComponent(link.hash.slice(1))); } catch { return; }
    if (!target || !root.current?.contains(target) || !target.closest('[data-codex-page]')) return;
    event.preventDefault();
    visit(link.hash.slice(1));
  }
  function go(next: number) {
    const folio = folios[codexTurn(folios.length, next)];
    if (folio && folio.id !== active?.id) visit(folio.id);
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
  return <div ref={root} className="hause-codex" id={id} onClick={links} data-view={view} data-enlarged={enlarged} data-motion={paused ? "paused" : "enabled"}>
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
      <div ref={book} className="codex-book" tabIndex={0} onKeyDown={keys} aria-label="Notebook spread. Left and right arrow keys turn pages.">
        {folios.map((folio, i) => <section key={folio.id} id={folio.id} className="codex-folio" data-codex-page="folio" tabIndex={-1} hidden={view !== "folios" || index !== i} aria-label={`Spread ${i + 1}: ${folio.label}`}>
          <div className="codex-folio-label"><span>{collection}</span><span>{String(i + 1).padStart(2, "0")} / {String(folios.length).padStart(2, "0")}</span></div>
          {folio.children}
        </section>)}
        <section id={`${id}-read`} data-codex-page="read" tabIndex={-1} className="codex-manuscript" hidden={view !== "read"}><h2>The full account</h2>{manuscript}</section>
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
