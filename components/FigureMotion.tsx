"use client";
import { useEffect, useId, useRef, type ReactNode } from "react";
import { useMotion } from "./Motion";
import "../reading.css";

/** Reveal recorded geometry once. Values never count up or interpolate. */
export function FigureMotion({ children }: { children: ReactNode }) {
  const element = useRef<HTMLDivElement>(null);
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
        animations.current = Array.from(element.current!.querySelectorAll<HTMLElement>("[data-figure-trace], [data-figure-reveal]")).map((node, index) =>
          node.animate(node.hasAttribute("data-figure-trace")
            ? [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0 0 0 0)" }]
            : [{ opacity: 0, transform: "translateY(10px)" }, { opacity: 1, transform: "translateY(0)" }],
          { duration: 950, delay: Math.min(index * 65, 650), easing: "cubic-bezier(.22,.7,.2,1)", fill: "backwards" }));
      }, stop: finish,
    });
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const changed = () => { if (preference.matches) finish(); };
    preference.addEventListener("change", changed);
    return () => { unregister(); preference.removeEventListener("change", changed); animations.current.forEach(animation => animation.cancel()); };
  }, [id, register]);
  return <div className="figure-motion" ref={element}>{children}<button type="button" className="figure-motion-replay" onClick={() => { played.current = false; request(id); }}>Replay figure <span aria-hidden="true">↻</span></button></div>;
}
