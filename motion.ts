export type MotionCandidate = { id: string; visible: number; area: number; manual?: boolean; manualOnly?: boolean };
export function chooseMotion(candidates: MotionCandidate[], current: string | null, paused: boolean, hidden: boolean): string | null {
  if (hidden) return null;
  const eligible = candidates.filter(c => c.visible >= 0.5 && (!c.manualOnly || c.manual) && (!paused || c.manual)).sort((a,b) => Number(Boolean(b.manual)) - Number(Boolean(a.manual)) || b.area - a.area);
  const next = eligible[0];
  if (!next) return null;
  const held = eligible.find(c => c.id === current);
  if (held && !next.manual && held.area >= next.area * .8) return held.id;
  return next.id;
}
