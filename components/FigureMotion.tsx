"use client";
import { createElement, useCallback, useEffect, useId, useRef, type ReactNode, type HTMLAttributes, type Ref } from "react";
import { useMotion } from "./Motion";
import "../reading.css";

/** Reveal recorded geometry once. Values never count up or interpolate. */
export function FigureMotion({ children, as = "div", reveal = "marks", elementRef, className = "", ...props }: HTMLAttributes<HTMLElement> & { children: ReactNode; as?: "div" | "figure"; reveal?: "marks" | "surface"; elementRef?: Ref<HTMLElement> }) {
  const element = useRef<HTMLElement>(null);
  const attach = useCallback((node: HTMLElement | null) => {
    element.current = node;
    if (typeof elementRef === "function") return elementRef(node);
    if (elementRef) elementRef.current = node;
  }, [elementRef]);
  const animations = useRef<Animation[]>([]);
  const played = useRef(false);
  const id = useId();
  const { register, request } = useMotion();
  useEffect(() => {
    if (!element.current) return;
    const finish = () => animations.current.forEach(animation => animation.finish());
    const unregister = register({ id, element: element.current,
      start: () => {
        if (played.current || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
        played.current = true;
        animations.current.forEach(animation => animation.cancel());
        const targets = reveal === "surface" ? [element.current!] : Array.from(element.current!.querySelectorAll<HTMLElement>("[data-figure-trace], [data-figure-reveal]"));
        animations.current = targets.map((node, index) =>
          node.animate(node.hasAttribute("data-figure-trace")
            ? [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }]
            : [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: reveal === "surface" ? 550 : 950, delay: Math.min(index * 65, 650), easing: "cubic-bezier(.22,.7,.2,1)", fill: "backwards" }));
      }, stop: finish,
    });
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const changed = () => { if (preference.matches) finish(); };
    preference.addEventListener("change", changed);
    return () => { unregister(); preference.removeEventListener("change", changed); animations.current.forEach(animation => animation.cancel()); };
  }, [id, register, reveal]);
  return createElement(as, { ...props, className: `figure-motion ${className}`, ref: attach }, children,
    <button type="button" className="figure-motion-replay" onClick={() => { played.current = false; request(id); }}>Replay figure <span aria-hidden="true">↻</span></button>);
}
