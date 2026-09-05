"use client";
import { createContext, useCallback, useContext, useEffect, useRef, useState, type ReactNode } from "react";
import { chooseMotion, type MotionCandidate } from "../motion";
type Entry = MotionCandidate & { element: HTMLElement; start: () => void; stop: () => void };
type MotionContextValue = { paused: boolean; setPaused: (p: boolean) => void; register: (entry: Omit<Entry, "visible" | "area">) => () => void; request: (id: string) => void; suspend: (value: boolean) => void };
const Context = createContext<MotionContextValue | null>(null);
export function MotionProvider({ children, storageKey = "hause-motion" }: { children: ReactNode; storageKey?: string }) {
  const [paused, setPausedState] = useState(true);
  const entries = useRef(new Map<string, Entry>()); const owner = useRef<string | null>(null);
  const flags = useRef({ paused: true, hidden: false, suspended: false });
  const reconcile = useCallback(() => {
    const next = chooseMotion([...entries.current.values()], owner.current, flags.current.paused, flags.current.hidden || flags.current.suspended);
    if (next === owner.current) return;
    if (owner.current) { const previous = entries.current.get(owner.current); previous?.stop(); if(previous?.manualOnly) previous.manual = false; }
    owner.current = next;
    if (next) entries.current.get(next)?.start();
  }, []);
  const setPaused = useCallback((value: boolean) => {
    for (const entry of entries.current.values()) entry.manual = false;
    flags.current.paused = value; setPausedState(value);
    try { sessionStorage.setItem(storageKey, value ? "paused" : "playing"); } catch {}
    reconcile();
  }, [reconcile, storageKey]);
  useEffect(() => {
    const preference = matchMedia("(prefers-reduced-motion: reduce)");
    const connection = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    let saved: string | null = null; try { saved = sessionStorage.getItem(storageKey); } catch {}
    const off = preference.matches || Boolean(connection?.saveData) || saved === "paused";
    flags.current.hidden = document.hidden;
    flags.current.paused = off; setPausedState(off); reconcile();
    const change = () => { if (preference.matches) setPaused(true); };
    const visibility = () => { flags.current.hidden = document.hidden; reconcile(); };
    preference.addEventListener("change", change); document.addEventListener("visibilitychange", visibility);
    return () => { preference.removeEventListener("change", change); document.removeEventListener("visibilitychange", visibility); };
  }, [reconcile, setPaused, storageKey]);
  const register = useCallback((entry: Omit<Entry, "visible" | "area">) => {
    const value = { ...entry, visible: 0, area: 0 }; entries.current.set(entry.id, value);
    const observer = new IntersectionObserver(([e]) => { value.visible = e.intersectionRatio; value.area = e.intersectionRect.width * e.intersectionRect.height; reconcile(); }, { threshold: [0, .25, .5, .65, .8, 1] });
    observer.observe(entry.element);
    return () => { observer.disconnect(); if (owner.current === entry.id) { entry.stop(); owner.current = null; } entries.current.delete(entry.id); reconcile(); };
  }, [reconcile]);
  const request = useCallback((id: string) => {
    // Manual playback grants this source only; it does not silently resume every film.
    for (const entry of entries.current.values()) entry.manual = entry.id === id;
    const entry = entries.current.get(id); if (!entry || flags.current.suspended || flags.current.hidden) return;
    if (owner.current) { const previous = entries.current.get(owner.current); previous?.stop(); if(previous?.manualOnly) previous.manual = false; }
    entry.manual = true; owner.current = id; entry.start();
  }, []);
  const suspend = useCallback((value: boolean) => { flags.current.suspended = value; reconcile(); }, [reconcile]);
  return <Context.Provider value={{ paused, setPaused, register, request, suspend }}>{children}</Context.Provider>;
}
export function useMotion() { const context = useContext(Context); if (!context) throw new Error("MotionProvider is required"); return context; }
