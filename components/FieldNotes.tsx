"use client";
import { useEffect, type ReactNode } from "react";
import "../study.css";

/** Native, printable disclosure. Anchors and the complete record remain in HTML. */
export function FieldNotes({ children, label = "FIELD NOTES", detail = "EXPLANATION & SOURCES +", className = "" }: {
  children: ReactNode; label?: string; detail?: string; className?: string;
}) {
  return <details className={`hause-field-notes ${className}`}><summary><span>{label}</span><span>{detail}</span></summary>{children}</details>;
}

/** Following a citation opens every ancestor disclosure before scrolling.
 * Handles both anchors inside notes and an exhibit whose notes contain its record. */
export function CitationScope({ children, className = "" }: { children: ReactNode; className?: string }) {
  useEffect(() => {
    const reveal = () => {
      if (!/^#act-\d+$/.test(location.hash)) return;
      const target = document.getElementById(location.hash.slice(1));
      if (!target) return;
      for (let parent = target.parentElement; parent; parent = parent.parentElement) {
        if (parent instanceof HTMLDetailsElement) parent.open = true;
      }
      target.querySelectorAll("details").forEach(details => { details.open = true; });
      target.scrollIntoView({ behavior: "instant", block: "start" });
    };
    reveal(); window.addEventListener("hashchange", reveal);
    return () => window.removeEventListener("hashchange", reveal);
  }, []);
  return <div className={className}>{children}</div>;
}
