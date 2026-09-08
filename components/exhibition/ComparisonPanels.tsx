"use client";

import { useId, type ReactNode } from "react";

/** Two readings, one fixed stage. Native radios work before hydration and without
 * JavaScript; no autoplay, crossfade, URL mutation or fabricated spatial model. */
export function ComparisonPanels({ kicker, objectLabel, leftLabel, rightLabel, left, right }: {
  kicker: string; objectLabel: string; leftLabel: string; rightLabel: string;
  left: ReactNode; right: ReactNode;
}) {
  const id = useId();
  return <section className="exhibition-comparison-panels" aria-label={objectLabel}>
    <header><p className="exhibition-label">{kicker}</p><h2>{objectLabel}</h2></header>
    <fieldset><legend className="exhibition-label">CHOOSE HOW TO READ IT</legend><label><input type="radio" name={id} value="left" defaultChecked /><span>{leftLabel}</span></label><label><input type="radio" name={id} value="right" /><span>{rightLabel}</span></label></fieldset>
    <div className="exhibition-comparison-readings"><div data-reading="left" role="region" aria-label={leftLabel}>{left}</div><div data-reading="right" role="region" aria-label={rightLabel}>{right}</div></div>
  </section>;
}
