"use client";
import { createContext, useContext, useEffect, useRef, type HTMLAttributes, type ReactNode } from "react";
import { AnchoredDisclosure } from "./AnchoredDisclosure";
import "../notebook.css";

const ReadingContext = createContext(false);
export const useNotebookEdition = () => useContext(ReadingContext);

/** A publication-wide reading contract. The author still owns sequence and evidence. */
export function NotebookEdition({ as: Element = "main", children, className = "", ...props }: HTMLAttributes<HTMLElement> & { as?: "main" | "article" | "div" }) {
  const root = useRef<HTMLElement>(null);
  useEffect(() => {
    const reveal = () => {
      let id: string;
      try { id = decodeURIComponent(location.hash.slice(1)); } catch { return; }
      const target = id ? document.getElementById(id) : null;
      if (!target || !root.current?.contains(target)) return;
      // Preserve deep links to sources, controls and manuscripts, including a
      // section whose first child is the disclosure containing its full record.
      for (let node: HTMLElement | null = target; node && root.current.contains(node); node = node.parentElement) {
        if (node instanceof HTMLDetailsElement) node.open = true;
      }
      target.querySelectorAll<HTMLDetailsElement>(":scope > details").forEach(detail => { detail.open = true; });
      target.scrollIntoView({ behavior: "instant", block: "start" });
    };
    reveal(); window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, []);
  // The tag is always a semantic block; the ref only uses HTMLElement APIs.
  return <ReadingContext.Provider value><Element {...props} ref={root as React.Ref<HTMLDivElement>} data-hause-notebook="reading" className={`hause-notebook ${className}`}>{children}</Element></ReadingContext.Provider>;
}

/** Supporting material stays server-rendered, linkable and selectable. */
export function NotebookSupport({ label, children, className = "" }: { label: string; children: ReactNode; className?: string }) {
  return <AnchoredDisclosure label={label} className={`hause-notebook-support ${className}`}>{children}</AnchoredDisclosure>;
}
